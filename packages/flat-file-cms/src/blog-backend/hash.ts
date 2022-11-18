import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const algorithm = "aes-256-ctr";
const secretKey = import.meta.env.CMS_SECRET || process.env.CMS_SECRET;

function encrypt(
  text: string,
) {
  if (typeof secretKey !== "string") {
    throw new Error(
      "Provide a secret key (32-bit string) to encrypt / decrypt passwords.",
    );
  }
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

function decrypt(
  hash: { iv: string; content: string },
) {
  if (typeof secretKey !== "string") {
    throw new Error(
      "Provide a secret key (32-bit string) to encrypt / decrypt passwords.",
    );
  }
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(hash.iv, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
}

export { decrypt, encrypt };
