import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express, { json } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import helmet from "helmet";

import { EnforcerSingleton } from "@ai-sdlc/acl-core";
import "@ai-sdlc/graphql-schema";
import { schema } from "@ai-sdlc/graphql-schema/schema";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirectiveTransformer } from "./infrastructure/auth/authDirective.js";
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
        const sub = authHeader.split(" ")[1];
        const role = req.headers["x-mock-role"] || "teacher";
        req.auth = { sub, "https://app.com/claims/role": [role] }; // Mock SAML role
        next();
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    };

  // Build executable schema with resolvers
  let executableSchema = makeExecutableSchema({
    typeDefs: schema,
    resolvers,
  });

  // Apply authorization transformer
  executableSchema = authDirectiveTransformer(executableSchema, "auth");

  // Apollo GraphQL server
  const server = new ApolloServer({ schema: executableSchema });
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
