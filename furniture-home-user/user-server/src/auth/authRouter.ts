// src/auth/authRouter.ts
import { Router } from "express";
import type { Db, ObjectId } from "mongodb";
import * as bcrypt from "bcrypt"; // if bcrypt gives trouble on Windows, `npm i bcryptjs` and change to "bcryptjs"
import { SignJWT, jwtVerify } from "jose";
import { loadKeys } from "./keyLoader.js";

type UserDoc = {
  _id: ObjectId;
  email: string;
  name?: string;
  role: "user" | "admin";
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const { privateKey, publicKey } = loadKeys();

export function makeAuthRouter(db: Db) {
  const router = Router();
  const users = db.collection<UserDoc>("users");

  // make sure email is unique (safe if already exists)
  users.createIndex({ email: 1 }, { unique: true }).catch(() => {});

  // POST /api/auth/register
  router.post("/register", async (req, res) => {
    try {
      const { email, password, name } = req.body as { email: string; password: string; name?: string };
      if (!email || !password) return res.status(400).json({ message: "email and password required" });

      const existing = await users.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(409).json({ message: "email already in use" });

      const passwordHash = await bcrypt.hash(password, 10);
      const doc: Omit<UserDoc, "_id"> = {
        email: email.toLowerCase(),
        name,
        role: "user",
        passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await users.insertOne(doc as any);
      res.status(201).json({ id: String(result.insertedId), email: doc.email, name: doc.name ?? null });
    } catch (e: any) {
      if (e?.code === 11000) return res.status(409).json({ message: "email already in use" });
      res.status(500).json({ message: "registration failed" });
    }
  });

  // POST /api/auth/login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ message: "email and password required" });

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) return res.sendStatus(401);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.sendStatus(401);

    const token = await new SignJWT({ sub: String(user._id), email: user.email, role: user.role })
      .setProtectedHeader({ alg: "RS256" })
      .setIssuedAt()
      .setExpirationTime(process.env.JWT_EXPIRATION_TIME ?? "15 min")
      .sign(privateKey);

    res.json({
      token,
      user: { id: String(user._id), email: user.email, name: user.name ?? null, role: user.role },
    });
  });

  // POST /api/auth/verify  (debug helper to inspect a token)
  router.post("/verify", async (req, res) => {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    try {
      const { payload } = await jwtVerify(token, publicKey);
      res.json({ valid: true, payload });
    } catch {
      res.status(401).json({ valid: false });
    }
  });

  // GET /api/auth/me  (quick way to fetch current user claims)
  router.get("/me", async (req, res) => {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    try {
      const { payload } = await jwtVerify(token, publicKey);
      res.json({ id: payload.sub, email: payload.email, role: payload.role });
    } catch {
      res.sendStatus(401);
    }
  });

  return router;
}
