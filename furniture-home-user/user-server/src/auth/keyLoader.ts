// src/auth/keyLoader.ts
import { createPrivateKey, createPublicKey, type KeyObject } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

let cached: { privateKey: KeyObject; publicKey: KeyObject } | null = null;

export function loadKeys() {
  if (cached) return cached;
  const privPem = readFileSync(resolve(process.cwd(), "private.pem"), "utf8");
  const pubPem  = readFileSync(resolve(process.cwd(), "public.pem"), "utf8");
  cached = {
    privateKey: createPrivateKey(privPem),
    publicKey: createPublicKey(pubPem),
  };
  return cached;
}
