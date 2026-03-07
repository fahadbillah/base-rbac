import type { Resolvers } from "@ai-sdlc/graphql-schema";
import { DIContainer } from "./infrastructure/di-container.js";
import { GetUser } from "./application/use-cases/GetUser.js";
import { ListUsers } from "./application/use-cases/ListUsers.js";
import { UpdateUser } from "./application/use-cases/UpdateUser.js";

const userRepository = DIContainer.getUserRepository();

export const resolvers: Resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const getUser = new GetUser(userRepository);
            const user = await getUser.execute(context.user.sub);
            if (!user) throw new Error("User not found");
            return {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            };
        },
        users: async (_parent, _args, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const listUsers = new ListUsers(userRepository);
            const users = await listUsers.execute();
            return users.map(user => ({
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }));
        },
    },
    Mutation: {
        updateProfile: async (_parent, { input }, context) => {
            if (!context.user?.sub) throw new Error("Unauthenticated");
            const updateUser = new UpdateUser(userRepository);
            const user = await updateUser.execute(context.user.sub, input as any);
            return {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            };
        },
    },
};
