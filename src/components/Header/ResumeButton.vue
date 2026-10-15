<template>
  <div class="relative" @keydown.escape="open = false">
    <button
      type="button"
      :class="buttonClass"
      :aria-expanded="open ? 'true' : 'false'"
      :aria-haspopup="true"
      :aria-label="$t('common.resumeMenu')"
      @click="open = !open"
    >
      {{ $t("common.resume") }}
      <span class="ml-1 text-xs" aria-hidden="true">▾</span>
    </button>
    <ul
      v-if="open"
      class="absolute z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lg"
      :class="align === 'end' ? 'right-0' : 'left-0'"
      role="menu"
    >
      <li v-for="item in downloads" :key="item.locale">
        <a
          class="block whitespace-nowrap px-4 py-2 text-sm font-semibold text-dark transition hover:bg-background hover:text-primary"
          role="menuitem"
          :href="item.href"
          :download="item.download"
          @click="open = false"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
import resumeEn from "@/assets/docs/resume-en.pdf";
import resumeTr from "@/assets/docs/resume-tr.pdf";
import {
  orderedResumeLocales,
  resumeDownloadName,
} from "@/i18n/resume.mjs";

const files = {
  en: resumeEn,
  tr: resumeTr,
};

export default {
  name: "ResumeButton",
  props: {
    variant: {
      type: String,
      default: "solid",
    },
    align: {
      type: String,
      default: "start",
    },
  },
  data: () => ({
    open: false,
  }),
  computed: {
    downloads() {
      return orderedResumeLocales(this.$locale).map((locale) => ({
        locale,
        href: files[locale],
        download: resumeDownloadName(locale),
        label:
          locale === "tr"
            ? this.$t("common.resumeTurkish")
            : this.$t("common.resumeEnglish"),
      }));
    },
    buttonClass() {
      const base =
        "inline-flex items-center justify-center rounded-full px-5 py-2 text-center text-sm font-semibold transition-all";

      if (this.variant === "outline") {
        return `${base} border border-line bg-surface px-6 py-3 text-dark hover:border-primary hover:text-primary`;
      }

      return `${base} border border-dark bg-dark text-light shadow-sm hover:border-primary hover:bg-primary`;
    },
  },
  methods: {
    onDocumentClick(event) {
      if (!this.$el.contains(event.target)) {
        this.open = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.onDocumentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocumentClick);
  },
};
</script>
