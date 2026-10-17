<template>
  <div
    class="inline-flex rounded-full border border-line bg-surface p-1 text-xs font-bold shadow-sm"
    role="group"
    :aria-label="$t('common.language')"
  >
    <a
      v-for="option in options"
      :key="option.value"
      :href="option.href"
      :hreflang="option.value"
      class="rounded-full px-3 py-1.5 transition"
      :class="
        $locale === option.value
          ? 'bg-dark text-light'
          : 'text-muted hover:text-dark'
      "
      :aria-label="option.label"
      :aria-current="$locale === option.value ? 'true' : undefined"
      @click.prevent="$setLocale(option.value)"
    >
      {{ option.short }}
    </a>
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
          href: "/",
          label: this.$t("common.english"),
        },
        {
          value: "tr",
          short: "TR",
          href: "/?lang=tr",
          label: this.$t("common.turkish"),
        },
      ];
    },
  },
};
</script>
