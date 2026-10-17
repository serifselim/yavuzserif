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
      <span>{{ $t("common.resume") }}</span>
      <span class="ml-1.5 font-mono text-[11px] opacity-75" aria-hidden="true">↓</span>
    </button>
    <ul
      v-if="open"
      class="absolute z-50 mt-1.5 min-w-[10.5rem] divide-y divide-line overflow-hidden rounded-md border border-line bg-surface shadow-lg"
      :class="align === 'end' ? 'right-0' : 'left-0'"
      role="menu"
    >
      <li v-for="item in downloads" :key="item.locale">
        <a
          class="flex items-center justify-between whitespace-nowrap px-3.5 py-2.5 text-xs font-semibold text-dark transition hover:bg-well hover:text-primary-text"
          role="menuitem"
          :href="item.href"
          :download="item.download"
          @click="open = false"
        >
          <span>{{ item.label }}</span>
          <span class="font-mono text-[10px] uppercase text-muted">{{ item.locale }}</span>
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
      if (this.variant === "outline") {
        return "inline-flex items-center justify-center rounded-md border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-dark";
      }

      return "inline-flex items-center justify-center rounded-md bg-dark px-3.5 py-1.5 text-xs font-semibold text-light transition hover:bg-primary hover:text-white";
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
