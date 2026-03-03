import en from "../localization/en.json" assert { type: "json" };

export function t(key) {
  const value = key.split(".").reduce((acc, k) => acc?.[k], en);
  return typeof value === "string" ? value : key;
}