import { Router } from "express";
import { connectDb } from "../db/connection.js";
import { ObjectId } from "mongodb";
const itemsRouter = Router();
async function itemsCollection() {
    const db = await connectDb();
    return db.collection("items");
}
itemsRouter.get("/", async (req, res) => {
    const collection = await itemsCollection();
    const items = await collection.find().toArray();
    res.json(items);
});
itemsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedItem = req.body;
    const collection = await itemsCollection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedItem });
    res.sendStatus(200);
});
itemsRouter.post("/", async (req, res) => {
    const item = req.body;
    const collection = await itemsCollection();
    collection.insertOne(item);
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
        .toArray();
    res.json(items);
});
export { itemsRouter };
//# sourceMappingURL=itemsRouter.js.map