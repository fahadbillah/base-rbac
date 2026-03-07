To achieve a portable backend, you must treat **Firebase as just a host**, not a framework. By the time you are ready to migrate to Docker or AWS, your core application shouldn't even "know" it was once running on Firebase.

Here is the master implementation plan to feed into Gemini Antigravity.

---

## 🤖 Prompt for Gemini Antigravity (Portable Backend)

Copy and paste this into your agent:

> **Mission:** Build a portable Node.js/TypeScript Express backend designed for Firebase v2 but architected for seamless Docker migration.
> **Structural Rules:**
> 1. **Core Decoupling:** The entire Express app must reside in `src/app.ts`. It must use standard Express middleware (cors, json) and standard routes. It must NOT import anything from `firebase-functions`.
> 2. **Environment:** Use a `.env` file for all secrets/configs. Access them via `process.env`.
> 3. **Dual Entry Points:**
> * `src/index.ts`: The Firebase entry point. Exports the app via `onRequest(app)`.
> * `src/server.ts`: The Docker/Standalone entry point. Uses `app.listen(process.env.PORT)`.
> 
> 
> 4. **Firebase v2:** Use the 2nd Gen `firebase-functions/v2/https` for better performance and `.env` support.
> 5. **Docker:** Create a multi-stage `Dockerfile` (Build -> Production) using `node:22-alpine`.
> 
> 
> **Task 1:** Scaffolding - Setup a TS project with `express`, `firebase-admin`, and `firebase-functions`.
> **Task 2:** Create `src/app.ts` as the main Express application with a "Health Check" route.
> **Task 3:** Create the two entry points (`index.ts` for Firebase, `server.ts` for local/Docker).
> **Task 4:** Generate a `Dockerfile` that compiles TS to JS and runs `node dist/server.js`.

---

## 🛠️ Implementation Breakdown

### **Phase 1: The Portable App (`src/app.ts`)**

Your business logic lives here. Because it’s a standard Express app, it can run anywhere.

* **Task:** Define your routes, controllers, and middleware here.
* **Why:** If you move to AWS or a VPS, you take this file with you and change nothing.

### **Phase 2: The Firebase Bridge (`src/index.ts`)**

This is a "thin wrapper." It only exists to make Firebase happy.

```typescript
import { onRequest } from "firebase-functions/v2/https";
import { app } from "./app";

// Firebase expects an exported function
export const api = onRequest({ region: "us-central1", memory: "256MiB" }, app);

```

### **Phase 3: The Docker Entry Point (`src/server.ts`)**

When you switch to Docker, your container will call this instead.

```typescript
import { app } from "./app";
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

```

### **Phase 4: The Multi-Stage Dockerfile**

This ensures your production image is tiny and secure, containing only compiled JavaScript and no source code.

| Stage | Purpose | Output |
| --- | --- | --- |
| **Stage 1: Build** | Install all deps, run `tsc`. | `/dist` folder |
| **Stage 2: Production** | Install only `dependencies` (no `devDependencies`). | 80MB - 120MB Image |

---

## 🚀 Deployment Strategy

1. **For Firebase:** Run `firebase deploy --only functions`. Firebase will look at `index.ts` and handle the rest.
2. **For Docker:** Run `docker build -t my-admin-api .`. The Dockerfile will use `server.ts` to start the app.
3. **Local Dev:** Run `tsx watch src/server.ts` (using the same entry point Docker uses).

**Next Step:** Would you like me to generate the **Dockerfile** code now so you can save it as an artifact for your agent?