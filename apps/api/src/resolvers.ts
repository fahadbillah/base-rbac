import type { Resolvers } from "@ai-sdlc/graphql-schema/src/generated/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers: Resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const user = await prisma.user.findUnique({
                where: { auth0Id: context.user.sub },
            });
            if (!user) throw new Error("User not found");
            return user;
        },
        users: async (_parent, _args, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            return prisma.user.findMany();
        },
    },
    Mutation: {
        updateProfile: async (_parent, { input }, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            return prisma.user.update({
                where: { auth0Id: context.user.sub },
                data: input,
            });
        },
    },
};
