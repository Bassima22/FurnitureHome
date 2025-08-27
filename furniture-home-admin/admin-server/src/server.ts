import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { connectDb } from "./db/connection.js";
import express from "express";
import { itemsRouter } from "./item/itemsRouter.js";
import { ContactsRouter } from "./item/contactRouter.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function run() {
  const app = express();
  app.use(express.json({ limit: "15mb" })); 
  app.use(express.urlencoded({ extended: true, limit: "15mb" })); 
  app.use(cors());

  await connectDb();

  app.use("/api/auth", authRoutes);
  app.use("/items", itemsRouter);
  app.use("/api/home", ContactsRouter);

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
  });
}

run();
