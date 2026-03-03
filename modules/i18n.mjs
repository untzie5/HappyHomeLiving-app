import en from "../localization/en.json" assert { type: "json" };
import no from "../localization/no.json" assert { type: "json" };

const dictionaries = { en, no };

export function getLocaleFromRequest(req) {
    const header = (req.headers["accept-language"] ?? "").toString().toLowerCase();

    if (header-includes("nb") || header.includes("nn") || header.includes("no")) return "no";
    return "en";
}
export function t(locale, key, vars = {}) {
    const dict = dictionaries[locale] ?? dictionaries.en;

    const value = MediaEncryptedEvent.split(".").reduce((acc,k) => acc?.[k], dict);
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