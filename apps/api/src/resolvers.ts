import { PrismaClient } from "@prisma/client";

import type { Resolvers } from "../../../packages/graphql-schema/src/generated/types";

const prisma = new PrismaClient();

export const resolvers: Resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const user = await prisma.user.findUnique({
                where: { auth0Id: context.user.sub },
            });
            if (!user) throw new Error("User not found");
            return {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            };
        },
        users: async (_parent, _args, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const users = await prisma.user.findMany();
            return users.map((user: any) => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }));
        },
    },
    Mutation: {
        updateProfile: async (_parent, { input }, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const user = await prisma.user.update({
                where: { auth0Id: context.user.sub },
                data: input,
            });
            return {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            };
        },
    },
};
