// db/connection.ts (or connection.js if using JS)
import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (db) {
    // Reuse existing database connection
    return db;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is required");
  }

  client = new MongoClient(uri);

  try {
    await client.connect();
    db = client.db("test-db-001");

    // ping la net2akad eno meche 
    await db.command({ ping: 1 });
    console.log("✅ Connected to MongoDB");

    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
