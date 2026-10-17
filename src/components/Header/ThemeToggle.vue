<template>
  <div
    class="theme-toggle inline-flex rounded-full border border-line bg-surface p-1 shadow-sm"
    role="group"
    :aria-label="$t('common.theme')"
  >
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="flex h-7 w-7 items-center justify-center rounded-full transition"
      :class="
        $appliedTheme === option.value
          ? 'bg-dark text-light'
          : 'text-muted hover:text-dark'
      "
      :aria-label="option.label"
      :aria-pressed="$appliedTheme === option.value"
      @click="$setTheme(option.value)"
    >
      <ion-icon :name="option.icon" aria-hidden="true" />
    </button>
  </div>
</template>

<script>
export default {
  name: "ThemeToggle",
  computed: {
    options() {
      return [
        {
          value: "light",
          icon: "sunny-outline",
          label: this.$t("common.themeLight"),
        },
        {
          value: "dark",
          icon: "moon-outline",
          label: this.$t("common.themeDark"),
        },
      ];
    },
  },
};
</script>

<style scoped>
.theme-toggle ion-icon {
  font-size: 15px;
}
</style>
