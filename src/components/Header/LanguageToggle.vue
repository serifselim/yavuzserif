<template>
  <div
    class="inline-flex rounded-full border border-line bg-surface p-1 text-xs font-bold shadow-sm"
    :aria-label="$t('common.language')"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="rounded-full px-3 py-1.5 transition"
      :class="
        $locale === option.value
          ? 'bg-dark text-light'
          : 'text-muted hover:text-dark'
      "
      :aria-label="option.label"
      :aria-pressed="$locale === option.value"
      @click="$setLocale(option.value)"
    >
      {{ option.short }}
    </button>
  </div>
</template>

<script>
export default {
  name: "LanguageToggle",
  computed: {
    options() {
      return [
        {
          value: "en",
          short: "EN",
          label: this.$t("common.english"),
        },
        {
          value: "tr",
          short: "TR",
          label: this.$t("common.turkish"),
        },
      ];
    },
  },
};
</script>
