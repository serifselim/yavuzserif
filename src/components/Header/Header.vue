<template>
  <header class="pointer-events-none fixed inset-x-0 top-0 z-50 pt-3 md:pt-5">
    <div
      class="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-20"
    >
      <!-- Left: Floating Brand Pill -->
      <a
        href="#intro"
        :aria-label="$t('common.goToIntro')"
        class="pointer-events-auto inline-flex items-center rounded-full border border-line/90 bg-surface/85 px-4 py-2 shadow-sm backdrop-blur-xl transition hover:border-primary/50"
      >
        <logo-vue />
      </a>

      <!-- Center: 2026 Floating Glass Island Dock (Desktop) -->
      <div
        class="pointer-events-auto hidden lg:flex lg:items-center lg:rounded-full lg:border lg:border-line/90 lg:bg-surface/85 lg:p-1.5 lg:shadow-lg lg:shadow-dark/5 lg:backdrop-blur-2xl"
      >
        <nav-vue />
      </div>

      <!-- Right: Floating Controls Cluster (Desktop) -->
      <div
        class="pointer-events-auto hidden items-center gap-2 rounded-full border border-line/90 bg-surface/85 p-1.5 shadow-sm backdrop-blur-xl lg:flex"
      >
        <theme-toggle-vue />
        <language-toggle-vue />
        <resume-button-vue align="end" />
      </div>

      <!-- Mobile Trigger Pill -->
      <div v-show="!dialog" class="pointer-events-auto flex items-center gap-2 lg:hidden">
        <button
          @click="dialog = true"
          type="button"
          :aria-label="$t('common.openNavigation')"
          class="flex items-center justify-center rounded-full border border-line/90 bg-surface/90 p-2.5 text-dark shadow-sm backdrop-blur-xl transition hover:border-primary"
        >
          <ion-icon name="menu-outline" size="large" />
        </button>
      </div>

      <!-- Mobile Floating Sheet -->
      <div
        v-if="dialog"
        class="pointer-events-auto fixed inset-0 z-50 bg-dialog backdrop-blur-sm lg:hidden"
        @click.self="dialog = false"
      >
        <div
          class="dialog-content mx-4 mt-3 flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-line/80 pb-4">
            <a
              href="#intro"
              class="w-fit"
              :aria-label="$t('common.goToIntro')"
              @click="dialog = false"
            >
              <logo-vue />
            </a>
            <button
              @click="dialog = false"
              type="button"
              :aria-label="$t('common.closeNavigation')"
              class="flex items-center justify-center rounded-full border border-line bg-background p-2 text-dark transition hover:border-primary"
            >
              <ion-icon name="close-circle-outline" />
            </button>
          </div>

          <div class="mt-4">
            <nav-vue @navigate="dialog = false" />
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line/80 pt-4">
            <div class="flex items-center gap-2">
              <theme-toggle-vue />
              <language-toggle-vue />
            </div>
            <resume-button-vue align="end" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LogoVue from "../Logo/Logo.vue";
import ResumeButtonVue from "./ResumeButton.vue";
import NavVue from "./Nav.vue";
import LanguageToggleVue from "./LanguageToggle.vue";
import ThemeToggleVue from "./ThemeToggle.vue";

export default {
  name: "Header",
  components: {
    LogoVue,
    NavVue,
    ResumeButtonVue,
    LanguageToggleVue,
    ThemeToggleVue,
  },
  data: () => ({
    dialog: false,
  }),
};
</script>
<style scoped>
.bg-dialog {
  background-color: var(--dialog-overlay);
}
.dialog-content {
  animation: openDialogAnim 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes openDialogAnim {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
