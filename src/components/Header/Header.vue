<template>
  <header>
    <div
      class="
        pt-6
        px-9
        flex
        items-center
        fixed
        w-screen
        justify-end
        z-50
        bg-light
      "
    >
      <logo-vue class="mr-auto" />
      <!-- Desktop -->
      <div class="hidden md:flex items-center">
        <nav-vue />
        <resume-button-vue />
      </div>
      <!-- Desktop -->

      <!-- Mobile -->

      <!-- Hamburger Menu -->
      <div class="md:hidden">
        <button
          @click="dialog = true"
          class="
            navbar-burger
            flex
            items-center
            text-dark
            md:p-3
            outline
            rounded-sm
          "
        >
          <ion-icon name="menu-outline" size="large" />
        </button>
      </div>
      <!-- Hamburger Menu -->

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
      >
        <div
          class="
            dialog-content
            flex flex-col
            bg-white
            w-2/3
            h-screen
            py-6
            px-9
            relative
          "
        >
          <div
            @click="dialog = false"
            class="absolute right-5 top-7 cursor-pointer"
          >
            <ion-icon name="close-circle-outline" />
          </div>
          <logo-vue />
          <nav-vue />
        </div>
      </div>

      <!-- Mobile -->
    </div>
  </header>
</template>

<script>
// Components
import LogoVue from "../Logo/Logo.vue";
import ResumeButtonVue from "./ResumeButton.vue";
import NavVue from "./Nav.vue";
export default {
  name: "Header",
  components: {
    LogoVue,
    NavVue,
    ResumeButtonVue,
  },
  data: () => ({
    drawer: false,
    dialog: false,
  }),
};
</script>
<style scoped>
.bg-dialog {
  background-color: rgba(0, 0, 0, 0.3);
}
.dialog-content {
  animation: openDialogAnim 0.2s linear;
}

@keyframes openDialogAnim {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

