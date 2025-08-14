// src/server.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDb } from "./db/connection.js"; // keep .js for NodeNext/ESM builds
import { makeItemsRouter } from "./item/itemRouter.js";

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);

async function run() {
  console.log("Booting server...");

  const app = express();
  app.use(cors({ origin: ["http://localhost:5173"] }));

  app.use(express.json());

  const db = await connectDb();

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/items", makeItemsRouter(db));

  app.listen(PORT, () => {
    console.log(`✅ API running on http://localhost:${PORT}`);
  });
}

run().catch((err) => {
  console.error("Fatal start error:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("UnhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err);
});
