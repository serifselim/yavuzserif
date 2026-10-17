import { reactive } from "vue";
import {
  THEME_STORAGE_KEY,
  resolveAppliedTheme,
  resolveThemePreference,
  themeDocument,
} from "./theme.mjs";

const readSaved = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
};

const systemPrefersDark = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const state = reactive({
  preference: resolveThemePreference(readSaved()),
});

const apply = () => {
  if (typeof document === "undefined") {
    return;
  }

  const applied = resolveAppliedTheme(state.preference, systemPrefersDark());
  const doc = themeDocument(applied);
  const root = document.documentElement;

  root.classList.toggle("dark", doc.darkClass);
  root.style.colorScheme = doc.colorScheme;

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute("content", doc.themeColor);
  }
};

const setTheme = (preference) => {
  if (preference !== "system" && preference !== "light" && preference !== "dark") {
    return;
  }

  state.preference = preference;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // The choice still applies for this visit when storage is blocked.
  }

  apply();
};

const watchSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return;
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (state.preference === "system") {
      apply();
    }
  };

  if (media.addEventListener) {
    media.addEventListener("change", onChange);
  } else if (media.addListener) {
    media.addListener(onChange);
  }
};

export default {
  install(app) {
    apply();
    watchSystemTheme();

    app.mixin({
      computed: {
        $theme() {
          return state.preference;
        },
        $appliedTheme() {
          return resolveAppliedTheme(state.preference, systemPrefersDark());
        },
      },
      methods: {
        $setTheme: setTheme,
      },
    });
  },
};

export { setTheme, state as themeState };
