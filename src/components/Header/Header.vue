<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/90 backdrop-blur-xl">
    <div
      class="mx-auto flex h-14 max-w-7xl items-stretch justify-between px-4 md:border-x md:border-line md:px-0"
    >
      <!-- Left Architectural Cell: Identity -->
      <a
        href="#intro"
        :aria-label="$t('common.goToIntro')"
        class="flex items-center md:border-r md:border-line md:px-8"
      >
        <logo-vue />
      </a>

      <!-- Center Architectural Cell: Indexed Navigation -->
      <div class="hidden lg:flex lg:items-stretch">
        <nav-vue />
      </div>

      <!-- Right Architectural Cell: Utility Controls -->
      <div
        class="hidden items-center gap-2.5 lg:flex lg:border-l lg:border-line lg:px-6"
      >
        <theme-toggle-vue />
        <language-toggle-vue />
        <resume-button-vue align="end" />
      </div>

      <!-- Mobile Trigger -->
      <div v-show="!dialog" class="flex items-center lg:hidden">
        <button
          @click="dialog = true"
          type="button"
          :aria-label="$t('common.openNavigation')"
          class="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface text-dark transition hover:border-dark"
        >
          <ion-icon name="menu-outline" />
        </button>
      </div>

      <!-- Mobile Drawer Sheet -->
      <div
        v-if="dialog"
        class="fixed inset-0 z-50 bg-dialog backdrop-blur-sm lg:hidden"
        @click.self="dialog = false"
      >
        <div
          class="dialog-content mx-4 mt-3 overflow-hidden rounded-lg border border-line bg-surface shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-line px-5 py-3.5">
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
              class="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-background text-dark"
            >
              <ion-icon name="close-outline" />
            </button>
          </div>

          <nav-vue @navigate="dialog = false" />

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-well/40 px-5 py-3.5">
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
  animation: openDialogAnim 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes openDialogAnim {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
