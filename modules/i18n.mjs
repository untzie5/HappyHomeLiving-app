import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localizationDir = path.join(__dirname, "..", "localization");

const dict = JSON.parse(fs.readFileSync(path.jpin(localizationDir, "en.json"), "utf8"));

export const locale = "en";

export function t(key, vars = {}) {
    const value = key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), dict);
    const str = typeof value === "string" ? value : key;

    return str.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}