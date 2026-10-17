<template>
  <div
    class="inline-flex items-center rounded-md border border-line bg-background p-0.5 font-mono text-[11px] font-semibold"
    role="group"
    :aria-label="$t('common.language')"
  >
    <a
      v-for="option in options"
      :key="option.value"
      :href="option.href"
      :hreflang="option.value"
      class="rounded-[5px] px-2.5 py-1 transition"
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
