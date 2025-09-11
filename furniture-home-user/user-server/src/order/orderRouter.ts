import { Router } from "express";
import type { Db, ObjectId } from "mongodb";
import { ObjectId as OID } from "mongodb";

type CartItem = { itemId: ObjectId; qty: number };
type CartDoc  = { _id: ObjectId; userId: ObjectId; items: CartItem[]; updatedAt: Date };

type OrderItem = {
  itemId: ObjectId;
  qty: number;
  title: string;
  price: number;
  imgThumbURL?: string;
};

type OrderDoc = {
  _id: ObjectId;
  userId: ObjectId;
  items: OrderItem[];
  count: number;
  subtotal: number;
  address: string;
  phone: string;
  deliveryTime: string;       // store as free text (e.g. "Tomorrow 5-7pm") or ISO string if you prefer
  status: "pending" | "confirmed" | "shipped" | "delivered" | "canceled";
  createdAt: Date;
};

function getUserIdFromReq(req: any): OID | null {
  const raw = req?.auth?.userId ?? req?.auth?.sub ?? req?.auth?.user_id ?? null;
  if (!raw || typeof raw !== "string") return null;
  if (!OID.isValid(raw)) return null;
  return new OID(raw);
}

export function makeOrdersRouter(db: Db) {
  const router = Router();

  const carts  = db.collection<CartDoc>("carts");
  const items  = db.collection("items");
  const orders = db.collection<OrderDoc>("orders");

  // indexes helpful for admin/user views
  orders.createIndex({ userId: 1, createdAt: -1 }).catch(() => {});
  orders.createIndex({ createdAt: -1 }).catch(() => {});

  // POST /api/orders  -> create order from current cart
  router.post("/", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) return res.status(401).json({ message: "Invalid token" });

      const { address, phone, deliveryTime } = req.body as {
        address: string; phone: string; deliveryTime: string;
      };

      if (!address?.trim() || !phone?.trim() || !deliveryTime?.trim()) {
        return res.status(400).json({ message: "address, phone, deliveryTime are required" });
      }

      // 1) load cart
      const cart = await carts.findOne({ userId });
      const cartItems = cart?.items ?? [];
      if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

      // 2) fetch product details for snapshot
      const ids = cartItems.map((c) => c.itemId);
      const prods = await items.find({ _id: { $in: ids } }).toArray();
      const map = new Map<string, any>(prods.map((p) => [String(p._id), p]));

      const orderItems: OrderItem[] = cartItems.map((c) => {
        const p = map.get(String(c.itemId)) || {};
        return {
          itemId: c.itemId,
          qty: c.qty,
          title: p.title ?? "",
          price: Number(p.price ?? 0),
          imgThumbURL: p.imgThumbURL ?? "",
        };
      });

      const count = orderItems.reduce((n, it) => n + it.qty, 0);
      const subtotal = orderItems.reduce((s, it) => s + it.qty * it.price, 0);

      // 3) insert order (snapshot)
      const result = await orders.insertOne({
        userId,
        items: orderItems,
        count,
        subtotal,
        address: String(address).trim(),
        phone: String(phone).trim(),
        deliveryTime: String(deliveryTime).trim(),
        status: "pending",
        createdAt: new Date(),
      } as unknown as OrderDoc);

      // 4) clear cart
      await carts.updateOne(
        { userId },
        { $set: { items: [] }, $currentDate: { updatedAt: true } }
      );

      res.status(201).json({ ok: true, orderId: String(result.insertedId) });
    } catch (e: any) {
      console.error("POST /api/orders error:", e);
      res.status(500).json({ message: e?.message || "Failed to place order" });
    }
  });

  // (optional) list user's orders
  router.get("/my", async (req, res) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) return res.status(401).json({ message: "Invalid token" });
      const data = await orders
        .find({ userId })
        .project({ items: 1, count: 1, subtotal: 1, status: 1, createdAt: 1, address: 1, phone: 1, deliveryTime: 1 })
        .sort({ createdAt: -1 })
        .toArray();
      res.json({ orders: data.map((o) => ({ ...o, _id: String(o._id) })) });
    } catch (e) {
      console.error("GET /api/orders/my error:", e);
      res.status(500).json({ message: "Failed to load orders" });
    }
  });

  return router;
}
