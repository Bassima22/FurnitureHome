import { Router } from "express";
import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

export function makeItemsRouter(db: Db) {
  const router = Router();
  const col = db.collection("items");

  
router.get("/", async (req, res) => {
  try {
    const normalize = (s: string) => s.toLowerCase().replace(/-/g, "");
    const roomRaw = req.query.room as string | undefined;
    const sectionRaw = req.query.section as string | undefined;

    const page = Math.max(parseInt((req.query.page as string) ?? "1", 10), 1);
    const limit = Math.min(Math.max(parseInt((req.query.limit as string) ?? "12", 10), 1), 60);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (roomRaw) filter.room = normalize(roomRaw);          // e.g. "living-room" -> "livingroom"
    if (sectionRaw) filter.section = normalize(sectionRaw);  // "item" | "gallery"

    const [total, docs] = await Promise.all([
      col.countDocuments(filter),
      col.find(filter)
        .project({
          title: 1,
          price: 1,
          room: 1,
          section: 1,
          imgThumbURL: 1,     // 👈 send only the thumbnail in list responses
        })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    const items = docs.map(d => ({
      _id: String(d._id),
      title: d.title,
      price: d.price,
      room: d.room,
      section: d.section,
      imgThumbURL: d.imgThumbURL ?? "", // older docs may not have it
    }));

    res.json({ items, page, limit, total, hasMore: page * limit < total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});


  
  router.get("/:room/:section", async (req, res) => {
    const room = req.params.room.toLowerCase().replace(/-/g, "");
    const section = req.params.section.toLowerCase();
    const docs = await col.find({ room, section }).toArray();
    res.json(docs.map(d => ({ ...d, _id: String(d._id) })));
  });

  router.get("/by-id/:id", async (req, res) => {
    try {
      const _id = new ObjectId(req.params.id);
      const doc = await col.findOne({ _id });
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json({ ...doc, _id: String(doc._id) });
    } catch {
      res.status(400).json({ error: "Invalid id" });
    }
  });

  return router;
}
