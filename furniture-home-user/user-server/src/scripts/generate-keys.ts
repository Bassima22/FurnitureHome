import { generateKeyPair } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

generateKeyPair(
  "rsa",
  {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  },
  (err, publicKey, privateKey) => {
    if (err) throw err;
    writeFileSync(resolve(process.cwd(), "public.pem"), publicKey);
    writeFileSync(resolve(process.cwd(), "private.pem"), privateKey);
    console.log("✔ Wrote public.pem & private.pem in project root");
  }
);
