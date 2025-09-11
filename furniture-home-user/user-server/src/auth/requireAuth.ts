// src/auth/requireAuth.ts
import type { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import { loadKeys } from "./keyLoader.js";

const { publicKey } = loadKeys();

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.header("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) return res.sendStatus(401);
    const token = auth.split(" ")[1];

    const { payload } = await jwtVerify(token, publicKey); // throws if invalid/expired
    (req as any).auth = payload; // { sub, email, role }
    next();
  } catch {
    res.sendStatus(401);
  }
}
