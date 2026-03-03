import en from "../localization/en.json" assert { type: "json" };

const LOCALE = "en";

export function formatDate(date) {
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: "short" }).format(date);
}

export function formatNumber(n) {
  return new Intl.NumberFormat(LOCALE).format(n);
}

export function t(key) {
  const value = key.split(".").reduce((acc, k) => acc?.[k], en);
  return typeof value === "string" ? value : key;
}
