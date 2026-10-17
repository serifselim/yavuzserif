export const THEME_STORAGE_KEY = "portfolio-theme";

// index.html #theme-boot repeats this decision so the first paint matches.

const THEME_COLORS = {
  light: "#f8fafc",
  dark: "#0b1220",
};

export function resolveThemePreference(saved) {
  if (saved === "system" || saved === "light" || saved === "dark") {
    return saved;
  }

  return "system";
}

export function resolveAppliedTheme(preference, prefersDark) {
  if (preference === "light" || preference === "dark") {
    return preference;
  }

  return prefersDark ? "dark" : "light";
}

export function themeDocument(applied) {
  const darkClass = applied === "dark";

  return {
    darkClass,
    colorScheme: darkClass ? "dark" : "light",
    themeColor: darkClass ? THEME_COLORS.dark : THEME_COLORS.light,
  };
}
