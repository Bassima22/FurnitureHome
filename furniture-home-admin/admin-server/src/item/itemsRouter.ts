import { Router } from "express";
import { connectDb } from "../db/connection.js";
import { ObjectId } from "mongodb";

const itemsRouter = Router();

function isDataImageBase64(s: unknown): s is string {
  if (typeof s !== "string") return false;
  return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s);
}

function overSizeLimitDataImage(
  s: string,
  maxBytes = 5 * 1024 * 1024
): boolean {
  const commaIdx = s.indexOf(",");
  if (commaIdx < 0) return true;
  const b64 = s.slice(commaIdx + 1);
  const approxBytes = Math.floor((b64.length * 3) / 4);
  return approxBytes > maxBytes;
}

async function itemsCollection() {
  const db = await connectDb();
  return db.collection("items");
}

itemsRouter.get("/", async (req, res) => {
  const collection = await itemsCollection();
  const items = await collection.find().toArray();
  res.json(items);
});

itemsRouter.post("/", async (req, res) => {
  const item = req.body;

  if (item.imgURL && !isDataImageBase64(item.imgURL)) {
    return res
      .status(400)
      .json({ error: "imgURL must be data:image/*;base64" });
  }
  if (item.imgURL && overSizeLimitDataImage(item.imgURL)) {
    return res.status(413).json({ error: "Image too large (max 5MB)." });
  }

  const collection = await itemsCollection();
  await collection.insertOne(item);
  res.sendStatus(200);
});

itemsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;

  if (updatedItem.imgURL && !isDataImageBase64(updatedItem.imgURL)) {
    return res
      .status(400)
      .json({ error: "imgURL must be data:image/*;base64" });
  }
  if (updatedItem.imgURL && overSizeLimitDataImage(updatedItem.imgURL)) {
    return res.status(413).json({ error: "Image too large (max 5MB)." });
  }

  const collection = await itemsCollection();
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedItem });
  res.sendStatus(200);
});

itemsRouter.delete("/:id", async (req, res) => {
  const collection = await itemsCollection();
  await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.sendStatus(204);
});

itemsRouter.get("/:room/:section", async (req, res) => {
  const collection = await itemsCollection();
  const items = await collection
    .find({
      room: req.params.room,
      section: req.params.section,
    })
    .project({
      title: 1,
      price: 1,
      room: 1,
      section: 1,
      imgThumbURL: 1, // only small image
    })
    .toArray();
  res.json(items);
});

export { itemsRouter };
