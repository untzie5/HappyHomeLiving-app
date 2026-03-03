import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJson(relativePath) {
  const absPath = path.join(__dirname, relativePath);
  const raw = fs.readFileSync(absPath, "utf8");
  return JSON.parse(raw);
}

const dictionaries = {
  en: loadJson("../localization/en.json"),
  no: loadJson("../localization/no.json"),
};

export function getLocaleFromRequest(req) {
  const header = (req.headers["accept-language"] ?? "").toString().toLowerCase();
  if (header.includes("nb") || header.includes("nn") || header.includes("no")) return "no";
  return "en";
}

export function t(locale, key, vars = {}) {
  const dict = dictionaries[locale] ?? dictionaries.en;

  const value = key.split(".").reduce((acc, k) => acc?.[k], dict);
  const str = typeof value === "string" ? value : key;

  return str.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

export function formatDate(locale, date) {
  const intlLocale = locale === "no" ? "nb-NO" : "en";
  return new Intl.DateTimeFormat(intlLocale, { dateStyle: "short" }).format(date);
}

export function formatNumber(locale, n) {
  const intlLocale = locale === "no" ? "nb-NO" : "en";
  return new Intl.NumberFormat(intlLocale).format(n);
}