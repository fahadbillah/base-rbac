import { onRequest } from "firebase-functions/v2/https";
import { createApp } from "./app.js";

// Firebase expects an exported function
export const api = onRequest(
    {
        region: "us-central1",
        memory: "256MiB",
        // Secrets can be injected here for Firebase if needed
    },
    async (req, res) => {
        const app = await createApp();
        return app(req, res);
    }
);
