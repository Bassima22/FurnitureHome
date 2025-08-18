import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (db) {
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

    
    await db.command({ ping: 1 });
    console.log("✅ Connected to MongoDB");

    return db;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
