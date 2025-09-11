// src/order/ordersRouter.ts
import { Router } from "express";
import { connectDb } from "../db/connection.js";
import { ObjectId } from "mongodb";
const OrdersRouter = Router();
async function OrdersCollection() {
    const db = await connectDb();
    return db.collection("orders");
}
// Build a pipeline that joins the users collection and exposes userName/userEmail
function withUserJoin(match) {
    return [
        { $match: match },
        { $sort: { createdAt: -1, _id: -1 } },
        // Robust lookup: works if orders.userId is ObjectId or stored as string
        {
            $lookup: {
                from: "users",
                let: { uid: "$userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    "$_id",
                                    {
                                        $cond: [
                                            { $eq: [{ $type: "$$uid" }, "objectId"] },
                                            "$$uid",
                                            { $toObjectId: "$$uid" },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    { $project: { name: 1, email: 1 } },
                ],
                as: "user",
            },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                // keep all the fields you need on the client
                items: 1,
                count: 1,
                subtotal: 1,
                address: 1,
                phone: 1,
                deliveryTime: 1,
                status: 1,
                createdAt: 1,
                handledAt: 1,
                userId: 1,
                // expose user name/email
                userName: { $ifNull: ["$user.name", "$user.email"] },
                userEmail: "$user.email",
            },
        },
    ];
}
// GET /api/orders  -> pending (not handled)
OrdersRouter.get("/", async (_req, res) => {
    const col = await OrdersCollection();
    const match = {
        $or: [
            { handled: { $ne: true } },
            { status: { $exists: false } },
            { status: { $ne: "handled" } },
        ],
    };
    const docs = await col.aggregate(withUserJoin(match)).toArray();
    res.json(docs.map((o) => ({
        ...o,
        _id: String(o._id),
        userId: o.userId ? String(o.userId) : undefined,
    })));
});
// GET /api/orders/handled -> handled list
OrdersRouter.get("/handled", async (_req, res) => {
    const col = await OrdersCollection();
    const match = { $or: [{ handled: true }, { status: "handled" }] };
    const docs = await col.aggregate(withUserJoin(match)).toArray();
    res.json(docs.map((o) => ({
        ...o,
        _id: String(o._id),
        userId: o.userId ? String(o.userId) : undefined,
    })));
});
// PATCH /api/orders/:id/handled -> mark one as handled
OrdersRouter.patch("/:id/handled", async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid id" });
        }
        const col = await OrdersCollection();
        const result = await col.updateOne({ _id: new ObjectId(id) }, { $set: { handled: true, status: "handled", handledAt: new Date() } });
        if (!result.matchedCount) {
            return res.status(404).json({ error: "Order not found" });
        }
        res.json({ ok: true });
    }
    catch (err) {
        console.error("PATCH /api/orders/:id/handled error:", err);
        res.status(500).json({ error: "Failed to mark as handled" });
    }
});
export { OrdersRouter };
//# sourceMappingURL=orderRouter.js.map