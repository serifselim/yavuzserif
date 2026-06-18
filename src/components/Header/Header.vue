<template>
  <header class="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-background/90 backdrop-blur-xl">
    <div
      class="
        mx-auto
        flex
        max-w-7xl
        items-center
        justify-between
        px-5
        py-4
        md:px-10
      "
    >
      <a href="#intro" :aria-label="$t('common.goToIntro')">
        <logo-vue />
      </a>

      <div class="hidden items-center md:flex">
        <nav-vue />
        <language-toggle-vue class="mr-3" />
        <resume-button-vue />
      </div>

      <div class="md:hidden">
        <button
          @click="dialog = true"
          type="button"
          :aria-label="$t('common.openNavigation')"
          class="
            flex
            items-center
            justify-center
            text-dark
            rounded-full
            border border-line
            bg-surface
            p-3
            shadow-sm
          "
        >
          <ion-icon name="menu-outline" size="large" />
        </button>
      </div>

      <div
        v-if="dialog"
        class="
          md:hidden
          items-center
          fixed
          z-20
          w-screen
          h-screen
          top-0
          left-0
          bg-dialog
        "
        @click.self="dialog = false"
      >
        <div
          class="
            dialog-content
            flex flex-col
            bg-background
            w-[82vw]
            max-w-sm
            h-screen
            py-5
            px-6
            relative
            border-r border-line
          "
        >
          <button
            @click="dialog = false"
            type="button"
            :aria-label="$t('common.closeNavigation')"
            class="absolute right-5 top-5 flex items-center justify-center rounded-full border border-line bg-surface p-2 text-dark"
          >
            <ion-icon name="close-circle-outline" />
          </button>

          <a href="#intro" class="w-fit" :aria-label="$t('common.goToIntro')" @click="dialog = false">
            <logo-vue />
          </a>
          <nav-vue @navigate="dialog = false" />
          <language-toggle-vue class="mt-8 w-fit" />
          <resume-button-vue class="mt-8 w-fit" />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
// Components
import LogoVue from "../Logo/Logo.vue";
import ResumeButtonVue from "./ResumeButton.vue";
import NavVue from "./Nav.vue";
import LanguageToggleVue from "./LanguageToggle.vue";
export default {
  name: "Header",
  components: {
    LogoVue,
    NavVue,
    ResumeButtonVue,
    LanguageToggleVue,
  },
  data: () => ({
    dialog: false,
  }),
};
</script>
<style scoped>
.bg-dialog {
  background-color: rgba(21, 21, 21, 0.35);
}
.dialog-content {
  animation: openDialogAnim 0.18s ease-out;
}

@keyframes openDialogAnim {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
