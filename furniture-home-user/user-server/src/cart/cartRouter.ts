// src/cart/cartRouter.ts
import { Router } from "express";
import type { Db, ObjectId } from "mongodb";
import { ObjectId as OID } from "mongodb";

type CartItem = { itemId: ObjectId; qty: number };
type CartDoc  = { _id: ObjectId; userId: ObjectId; items: CartItem[]; updatedAt: Date };

// pull userId from any common JWT field and validate
function getUserIdFromReq(req: any): OID | null {
  const raw =
    req?.auth?.userId ??
    req?.auth?.sub ??
    req?.auth?.user_id ??
    null;
  if (!raw || typeof raw !== "string") return null;
  if (!OID.isValid(raw)) return null;
  return new OID(raw);
}

export function makeCartRouter(db: Db) {
  const router = Router();
  const carts  = db.collection<CartDoc>("carts");
  const items  = db.collection("items");

  // unique cart per user
  carts.createIndex({ userId: 1 }, { unique: true }).catch(() => {});

  // GET /api/cart
  router.get("/", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) return res.status(401).json({ message: "Invalid token" });

      const cart = await carts
        .aggregate([
          { $match: { userId } },
          { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "items",
              localField: "items.itemId",
              foreignField: "_id",
              as: "prod",
            },
          },
          { $unwind: { path: "$prod", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: "$_id",
              items: {
                $push: {
                  itemId: "$items.itemId",
                  qty: "$items.qty",
                  title: "$prod.title",
                  price: "$prod.price",
                  imgThumbURL: "$prod.imgThumbURL",
                },
              },
            },
          },
        ])
        .next();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const itemsArr = (cart?.items ?? []).filter((x: any) => x);
      const count    = itemsArr.reduce((n: number, it: any) => n + (it.qty || 0), 0);
      const subtotal = itemsArr.reduce((s: number, it: any) => s + (it.qty || 0) * (it.price || 0), 0);

      res.json({ items: itemsArr, count, subtotal });
    } catch (e) {
      console.error("GET /api/cart error:", e);
      res.status(500).json({ message: "Failed to load cart" });
    }
  });

  // POST /api/cart/add  { itemId, qty?=1 }
// POST /api/cart/add  { itemId, qty?=1 }
router.post("/add", async (req, res) => {
  try {
    const userId = getUserIdFromReq(req); // your helper; or new OID(String((req as any).auth?.sub))
    if (!userId) return res.status(401).json({ message: "Invalid token" });

    const { itemId, qty = 1 } = req.body as { itemId: string; qty?: number };
    if (!itemId) return res.status(400).json({ message: "itemId is required" });
    if (qty <= 0) return res.status(400).json({ message: "qty must be > 0" });
    if (!OID.isValid(itemId)) return res.status(400).json({ message: "invalid itemId" });

    const _id = new OID(itemId);

    // make sure the product exists
    const exists = await items.findOne({ _id });
    if (!exists) return res.status(404).json({ message: "Item not found" });

    // 1) increment qty if the line already exists (no upsert here)
    const incRes = await carts.updateOne(
      { userId, "items.itemId": _id },
      { $inc: { "items.$.qty": qty }, $currentDate: { updatedAt: true } }
    );

    if (incRes.matchedCount > 0) {
      // line existed and was incremented
      return res.json({ ok: true, updated: "inc" });
    }

    // 2) line not found -> push it (upsert cart if needed)
    await carts.updateOne(
      { userId },
      {
        $setOnInsert: { userId },                     // do NOT set `items` here
        $push: { items: { itemId: _id, qty } },       // safely creates array if missing
        $currentDate: { updatedAt: true }
      },
      { upsert: true }
    );

    res.json({ ok: true, updated: "push" });
  } catch (e: any) {
    console.error("POST /api/cart/add error:", e);
    res.status(500).json({ message: e?.message || "Failed to add to cart" });
  }
});


  // PATCH /api/cart/item  { itemId, qty }  (qty<=0 removes)
  router.patch("/item", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) return res.status(401).json({ message: "Invalid token" });

      const { itemId, qty } = req.body as { itemId: string; qty: number };
      if (!itemId || qty === undefined) return res.status(400).json({ message: "itemId and qty required" });
      if (!OID.isValid(itemId)) return res.status(400).json({ message: "invalid itemId" });

      const _id = new OID(itemId);

      if (qty <= 0) {
        await carts.updateOne(
          { userId },
          { $pull: { items: { itemId: _id } }, $currentDate: { updatedAt: true } }
        );
        return res.json({ ok: true });
      }

      const r = await carts.updateOne(
        { userId, "items.itemId": _id },
        { $set: { "items.$.qty": qty }, $currentDate: { updatedAt: true } }
      );
      if (!r.matchedCount) return res.status(404).json({ message: "Line not found" });
      res.json({ ok: true });
    } catch (e: any) {
      console.error("PATCH /api/cart/item error:", e);
      res.status(500).json({ message: e?.message || "Failed to update cart" });
    }
  });

  // DELETE /api/cart/item/:itemId
  router.delete("/item/:itemId", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) return res.status(401).json({ message: "Invalid token" });

      const { itemId } = req.params;
      if (!OID.isValid(itemId)) return res.status(400).json({ message: "invalid itemId" });
      const _id = new OID(itemId);

      await carts.updateOne(
        { userId },
        { $pull: { items: { itemId: _id } }, $currentDate: { updatedAt: true } }
      );
      res.json({ ok: true });
    } catch (e: any) {
      console.error("DELETE /api/cart/item error:", e);
      res.status(500).json({ message: e?.message || "Failed to remove from cart" });
    }
  });

  return router;
}
