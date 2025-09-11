
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDb } from "./db/connection.js"; 
import { makeItemsRouter } from "./item/itemRouter.js";
import makeContactsRouter from "./item/contactRouter.js";
import { makeAuthRouter } from "./auth/authRouter.js";
import { requireAuth } from "./auth/requireAuth.js";
import { makeCartRouter } from "./cart/cartRouter.js";
import { makeOrdersRouter } from "./order/orderRouter.js";

dotenv.config();

const PORT = Number(process.env.PORT ?? 3000);

async function run() {
  console.log("Booting server...");

  const app = express();
  app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));

  app.use(express.json());

  const db = await connectDb();
// quick sanity routes
app.get("/__ping", (_req, res) => res.send("user-server alive"));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

 
  app.use("/api/auth", makeAuthRouter(db));
  app.use("/api/items", makeItemsRouter(db));
  app.use("/contacts", makeContactsRouter(db));
  app.use("/api/cart", requireAuth, makeCartRouter(db));
  app.use("/api/orders", requireAuth, makeOrdersRouter(db));
  app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

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
