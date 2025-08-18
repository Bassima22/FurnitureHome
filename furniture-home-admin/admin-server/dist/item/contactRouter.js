import { Router } from "express";
import { connectDb } from "../db/connection.js";
import { ObjectId } from "mongodb";
const ContactsRouter = Router();
async function ContactsCollection() {
    const db = await connectDb();
    return db.collection("contacts");
}
ContactsRouter.get("/", async (req, res) => {
    const collection = await ContactsCollection();
    const contacts = await collection.find({ handled: { $ne: true } }).toArray();
    res.json(contacts);
});
ContactsRouter.get("/handled", async (_req, res) => {
    const collection = await ContactsCollection();
    const contacts = await collection.find({ handled: true }).toArray();
    res.json(contacts);
});
ContactsRouter.patch("/:id/handled", async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        const collection = await ContactsCollection();
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: { handled: true, handledAt: new Date() } });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to mark as handled" });
    }
});
export { ContactsRouter };
//# sourceMappingURL=contactRouter.js.map