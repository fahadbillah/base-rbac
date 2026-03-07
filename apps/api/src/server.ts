import { createApp } from "./app.js";

const PORT = process.env.PORT ?? 4000;

async function startServer() {
  const app = await createApp();
  app.listen(PORT, () => {
    console.log(`🚀 Standalone API ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
