import { Router } from "express";
import type { Db } from "mongodb";



export default function makeContactsRouter(db:Db){
    const router=Router();
    const col= db.collection("contacts");

      router.post("/", async (req, res) => {
    try {
      const { name, email, phone, message, appointment } = req.body ?? {};

      // Basic validation
      if (typeof name !== "string" || !name.trim())
        return res.status(400).json({ error: "Name is required" });
      if (typeof email !== "string" || !email.trim())
        return res.status(400).json({ error: "Email is required" });
      if (typeof message !== "string" || !message.trim())
        return res.status(400).json({ error: "Message is required" });

      // la nhawel l checkbox la actual true
      const toBool = (v: any) =>
        v === true ||
        v === "true" ||
        v === "on" ||
        v === 1 ||
        v === "1";

      const doc = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone:
          typeof phone === "string" && phone.trim() ? phone.trim() : undefined,
        message: message.trim(),
        appointment: toBool(appointment),
        createdAt: new Date(),
        handled: false,
      } as const;

      const result = await col.insertOne(doc);
      return res.status(201).json({ _id: String(result.insertedId) });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save contact" });
    }
  });


    return router;
}