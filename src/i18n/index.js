import { reactive } from "vue";
import messages from "./messages";
import {
  canonicalUrlForLocale,
  ogLocaleForLocale,
  parseQueryLocale,
  resolveLocale,
} from "./locale.mjs";

const STORAGE_KEY = "portfolio-locale";
const locales = Object.keys(messages);

const getInitialLocale = () => {
  const queryLocale =
    typeof window === "undefined"
      ? null
      : parseQueryLocale(window.location.search, locales);
  const savedLocale =
    typeof localStorage === "undefined" ? null : localStorage.getItem(STORAGE_KEY);
  const browserLanguage =
    typeof navigator === "undefined" ? "en" : navigator.language;

  return resolveLocale(savedLocale, browserLanguage, locales, queryLocale);
};

const state = reactive({
  locale: getInitialLocale(),
});

const resolvePath = (source, path) => {
  return path.split(".").reduce((value, segment) => value?.[segment], source);
};

const interpolate = (message, params = {}) => {
  if (typeof message !== "string") {
    return message;
  }

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    message
  );
};

const translate = (path, params) => {
  const currentMessage = resolvePath(messages[state.locale], path);
  const fallbackMessage = resolvePath(messages.en, path);
  return interpolate(currentMessage ?? fallbackMessage ?? path, params);
};

const translateMessage = (path) => {
  const currentMessage = resolvePath(messages[state.locale], path);
  const fallbackMessage = resolvePath(messages.en, path);
  return currentMessage ?? fallbackMessage ?? [];
};

const syncDocument = () => {
  if (typeof document === "undefined") {
    return;
  }

  const title = translate("meta.title");
  const description = translate("meta.description");
  const canonicalUrl = canonicalUrlForLocale(state.locale);
  const ogLocale = ogLocaleForLocale(state.locale);
  const alternateOgLocale = ogLocaleForLocale(state.locale === "tr" ? "en" : "tr");

  document.documentElement.lang = state.locale;
  document.title = title;

  const write = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute(attr, value);
    }
  };

  write('meta[name="description"]', "content", description);
  write('link[rel="canonical"]', "href", canonicalUrl);
  write('meta[property="og:title"]', "content", title);
  write('meta[property="og:description"]', "content", description);
  write('meta[property="og:url"]', "content", canonicalUrl);
  write('meta[property="og:locale"]', "content", ogLocale);
  write('meta[property="og:locale:alternate"]', "content", alternateOgLocale);
  write('meta[name="twitter:title"]', "content", title);
  write('meta[name="twitter:description"]', "content", description);
};

const setLocale = (locale) => {
  if (!locales.includes(locale)) {
    return;
  }

  state.locale = locale;
  localStorage.setItem(STORAGE_KEY, locale);

  if (typeof window !== "undefined" && window.history?.replaceState) {
    const url = new URL(window.location.href);
    if (locale === "tr") {
      url.searchParams.set("lang", "tr");
    } else {
      url.searchParams.delete("lang");
    }
    window.history.replaceState({}, "", url.toString());
  }

  syncDocument();
};

export default {
  install(app) {
    syncDocument();

    app.mixin({
      computed: {
        $locale() {
          return state.locale;
        },
      },
      methods: {
        $t: translate,
        $tm: translateMessage,
        $setLocale: setLocale,
      },
    });
  },
};

export { locales, setLocale, state as i18nState };
