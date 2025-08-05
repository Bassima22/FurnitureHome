import { MongoClient } from "mongodb";

export async function connectDb() {
  console.log("Connection to MongoDB");
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI env variable is required");
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("test-db-001");
  console.log("Pinging MongoDB");
  db.command({ ping: 1 });
  console.log("MongoDB is connected");
  return db;
}
