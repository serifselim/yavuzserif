import { reactive } from "vue";
import messages from "./messages";

const STORAGE_KEY = "portfolio-locale";
const locales = Object.keys(messages);

const getInitialLocale = () => {
  const savedLocale = localStorage.getItem(STORAGE_KEY);

  if (locales.includes(savedLocale)) {
    return savedLocale;
  }

  return "en";
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

const setLocale = (locale) => {
  if (!locales.includes(locale)) {
    return;
  }

  state.locale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
  document.title = translate("meta.title");
};

export default {
  install(app) {
    document.documentElement.lang = state.locale;
    document.title = translate("meta.title");

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
