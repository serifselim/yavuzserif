<template>
  <header>
    <div class="py-6 px-9 flex items-center justify-end">
      <Logo class="mr-auto" />
      <!-- Desktop -->
      <div class="hidden md:flex items-center">
        <Nav />
        <ResumeButton />
      </div>
      <!-- Desktop -->

      <!-- Mobile -->

      <!-- Hamburger Menu -->
      <div class="md:hidden">
        <button
          @click="dialog = true"
          class="navbar-burger flex items-center text-dark md:p-3"
        >
          <MenuIcon />
        </button>
      </div>
      <!-- Hamburger Menu -->
      <div
        v-if="dialog"
        class="
          md:hidden
          items-center
          fixed
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
            <CloseIcon />
          </div>
          <Logo />
          <Nav />
          <ResumeButton class="w-full mt-auto" />
        </div>
      </div>

      <!-- Mobile -->
    </div>
  </header>
</template>

<script>
// Components
import Logo from "@/assets/materials/Logo.vue";
import { MenuIcon, ExitIcon, CloseIcon } from "@/assets/icons";
import ResumeButton from "./ResumeButton.vue";
import Nav from "./Nav.vue";
export default {
  components: {
    Logo,
    MenuIcon,
    ExitIcon,
    Nav,
    ResumeButton,
    CloseIcon,
  },
  data: () => ({
    drawer: false,
    dialog: false,
  }),
  methods: {
    changeLang() {},
  },
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

