import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express, { json } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import helmet from "helmet";

import "@ai-sdlc/graphql-schema";
import { EnforcerSingleton } from "@ai-sdlc/acl-core";
import { schema } from "@ai-sdlc/graphql-schema/schema";

import { resolvers } from "./resolvers.js";

export async function createApp(): Promise<express.Express> {
  const app = express();

  // Security middlewares
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") }));
  app.use(json());

  // Health check
  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  const checkJwt = process.env.AUTH0_DOMAIN
    ? auth({
      issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
      audience: process.env.AUTH0_AUDIENCE!,
    })
    : (req: any, res: any, next: any) => {
      // Mock auth context for CI when Auth0 secrets are absent
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        req.auth = { sub: authHeader.split(" ")[1], "https://app.com/claims/role": ["teacher"] }; // Mock SAML role
        next();
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    };

  // Apollo GraphQL server
  const server = new ApolloServer({ typeDefs: schema, resolvers });
  await server.start();
  
  // Initialize Casbin RBAC Singleton before request cycle
  const enforcer = await EnforcerSingleton.getInstance();

  app.use(
    "/graphql",
    checkJwt,
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authPayload = (req as any).auth;
        
        // SAML attribute mapping to Casbin subjects
        const rawRoles = authPayload?.["https://app.com/claims/role"] || [];
        const casbinSubjects = Array.isArray(rawRoles) 
          ? rawRoles.map((role: string) => `role:${role}`)
          : typeof rawRoles === "string" 
            ? [`role:${rawRoles}`] 
            : [];
            
        // If user has no specific SAML roles, fallback to their unique sub
        if (casbinSubjects.length === 0 && authPayload?.sub) {
          casbinSubjects.push(authPayload.sub);
        }

        return {
          user: authPayload,
          casbinSubjects,
          enforcer
        };
      },
    }) as any // Bypass Express definition mismatch
  );

  return app;
}
