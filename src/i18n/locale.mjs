const DEFAULT_LOCALES = ["en", "tr"];

export function resolveLocale(
  savedLocale,
  browserLanguage,
  locales = DEFAULT_LOCALES
) {
  if (locales.includes(savedLocale)) {
    return savedLocale;
  }

  const language = String(browserLanguage || "en").toLowerCase();

  if (language.startsWith("tr") && locales.includes("tr")) {
    return "tr";
  }

  return "en";
}

export function mailtoHref(email, subject) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
