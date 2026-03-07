# ── Stage 1: deps ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/config/package.json packages/config/
COPY packages/graphql-schema/package.json packages/graphql-schema/
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile

# ── Stage 2: build ────────────────────────────────────────────
FROM deps AS builder
COPY packages/ packages/
COPY apps/api/ apps/api/
WORKDIR /repo/apps/api
RUN pnpm run build

# ── Stage 3: production ───────────────────────────────────────
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/api/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/index.js"]
