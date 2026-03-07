import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { resolvers } from "./resolvers";
import { schema } from "../../packages/graphql-schema/src/schema";

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
    const app = express();

    // Security middlewares
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") }));
    app.use(express.json());

    // Health check
    app.get("/health", (_req, res) => res.json({ status: "ok" }));

    const checkJwt = auth({
        issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
        audience: process.env.AUTH0_AUDIENCE!,
    });

    // Apollo GraphQL server
    const server = new ApolloServer({ typeDefs: schema, resolvers });
    await server.start();

    app.use(
        "/graphql",
        checkJwt,
        expressMiddleware(server, {
            context: async ({ req }) => ({
                user: (req as Express.Request).auth,
            }),
        })
    );

    app.listen(PORT, () => {
        console.log(`🚀 API ready at http://localhost:${PORT}/graphql`);
    });
}

bootstrap().catch(console.error);
