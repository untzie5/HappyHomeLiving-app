let dictPromise = null;

function pickLocale() {
  const lang = (navigator.language || "").toLowerCase();

  if (lang.startsWith("nb") || lang.startsWith("nn") || lang.startsWith("no")) return "no";
  if (lang.startsWith("is")) return "is";

  return "en";
}

async function loadDict(locale) {
  const res = await fetch(`/localization/${locale}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load locale ${locale}`);
  return res.json();
}

function getValue(obj, key) {
  return key.split(".").reduce((acc, k) => acc?.[k], obj);
}

export async function t(key, vars = {}) {
  if (!dictPromise) dictPromise = loadDict(pickLocale());
  const dict = await dictPromise;

  const value = getValue(dict, key);
  const str = typeof value === "string" ? value : key;

  return str.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

export function getClientLocale() {
  return pickLocale();
}