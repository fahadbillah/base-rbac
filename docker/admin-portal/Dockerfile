# ── Stage 1: deps ─────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/config/package.json packages/config/
COPY packages/ui/package.json packages/ui/
COPY apps/admin-portal/package.json apps/admin-portal/
RUN pnpm install --frozen-lockfile

# ── Stage 2: build ────────────────────────────────────────────
FROM deps AS builder
COPY packages/ packages/
COPY apps/admin-portal/ apps/admin-portal/
WORKDIR /repo/apps/admin-portal
RUN pnpm run build

# ── Stage 3: production (nginx static) ───────────────────────
FROM nginx:alpine AS prod
COPY --from=builder /repo/apps/admin-portal/dist /usr/share/nginx/html
COPY docker/admin-portal/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
