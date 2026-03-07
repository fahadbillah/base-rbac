To finalize your portable architecture, here is the **Dockerfile** and the **Implementation Plan** for Gemini Antigravity.

This plan uses a **multi-stage build** which ensures your production image is tiny (~140MB instead of 1GB+) and contains only the compiled JavaScript, making it secure and fast to deploy.

---

## 🐋 Portable Dockerfile Artifact

Save this as `Dockerfile` in your root directory. It is designed to work with the **Standard Express** architecture we discussed.

```dockerfile
# STAGE 1: Build (TypeScript Compilation)
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency files first for layer caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# STAGE 2: Production (Minimal Runtime)
FROM node:22-alpine AS production
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JS from builder stage
COPY --from=builder /app/dist ./dist

# Use a non-root user for security
USER node

# Expose the standard port (Render, AWS, DigitalOcean default)
EXPOSE 8080

# Start the standalone server, NOT the Firebase entry point
CMD ["node", "dist/server.js"]

```

---

## 🤖 Prompt for Gemini Antigravity (Final Implementation)

Copy this to your agent to execute the full setup:

> **Mission:** Finalize the portable backend by creating the build system and entry points.
> **Project Context:** We are using **Express.js** with **TypeScript**. We need to support both Firebase Cloud Functions and standard Docker containers.
> **Task 1: Project Scripts**
> Update `package.json` with these scripts:
> * `"build": "tsc"`
> * `"start": "node dist/server.js"` (For Docker/Production)
> * `"dev": "tsx watch src/server.ts"` (For local development)
> * `"serve": "firebase emulators:start"` (For Firebase testing)
> 
> 
> **Task 2: Dual Entry Logic**
> * Create `src/app.ts`: Export the `app` instance (Standard Express).
> * Create `src/server.ts`: Import `app`, call `app.listen(8080)`.
> * Create `src/index.ts`: Import `app`, export `api = onRequest(app)` from `firebase-functions/v2/https`.
> 
> 
> **Task 3: Dockerization**
> * Use the provided multi-stage `Dockerfile`.
> * Create a `.dockerignore` file to exclude `node_modules`, `dist`, and `.env` from the build context.
> 
> 
> **Verification:** Ensure that running `npm run dev` starts a local web server on port 8080, and `npm run build` generates a clean `dist` folder.

---

## 💡 Why this is "Anti-Lock-in"

1. **Firebase:** Only looks at `src/index.ts`. It ignores the Dockerfile and the `server.ts`.
2. **Docker / Other Vendors:** Only look at the `Dockerfile` and `src/server.ts`. They never see the Firebase code.
3. **The Result:** You can deploy to **Firebase** today with one command, and next week you can move to **AWS App Runner** or **Railway** just by pointing them to your GitHub repo—no code changes required.

**Would you like me to generate a `docker-compose.yml` so you can test the "Docker version" of your app locally alongside a database?**