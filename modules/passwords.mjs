import crypto from "node:crypto";

export function hashPassword(plain) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(plain, salt, 64);
    return `scrypt${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyPassword(plain, stored) {
    if (typeof stored !== "string") return false;
    const parts = stored.split("$");
    if (parts.length !== 3) return false;

    const [algo, saltB64, hashB64] = parts;
    if (algo !== "scrypt") return false;

     const salt = Buffer.from(saltB64, "base64");
  const expected = Buffer.from(hashB64, "base64");
  const actual = crypto.scryptSync(plain, salt, expected.length);

  return crypto.timingSafeEqual(actual, expected);
}