const DEFAULT_LOCALES = ["en", "tr"];
export const SITE_URL = "https://www.yavuzserifoglu.com";

export function parseQueryLocale(search = "", locales = DEFAULT_LOCALES) {
  if (!search) {
    return null;
  }

  const raw = String(search).startsWith("?") ? String(search).slice(1) : String(search);
  const params = new URLSearchParams(raw);
  const candidate = params.get("lang")?.toLowerCase();

  return locales.includes(candidate) ? candidate : null;
}

export function resolveLocale(
  savedLocale,
  browserLanguage,
  locales = DEFAULT_LOCALES,
  queryLocale = null
) {
  if (locales.includes(queryLocale)) {
    return queryLocale;
  }

  if (locales.includes(savedLocale)) {
    return savedLocale;
  }

  const language = String(browserLanguage || "en").toLowerCase();

  if (language.startsWith("tr") && locales.includes("tr")) {
    return "tr";
  }

  return "en";
}

export function canonicalUrlForLocale(locale, baseUrl = SITE_URL) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  return locale === "tr" ? `${cleanBase}/?lang=tr` : `${cleanBase}/`;
}

export function ogLocaleForLocale(locale) {
  return locale === "tr" ? "tr_TR" : "en_US";
}

export function mailtoHref(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

