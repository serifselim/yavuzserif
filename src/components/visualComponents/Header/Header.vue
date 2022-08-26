<template>
  <header class="bg-lime-500 dark:bg-zinc-900">
    Header
    <button @click='changeTheme'>{{  }}</button>
  </header>
</template>

<script>
// Components
import Logo from "@/assets/materials/Logo.vue";
import { MenuIcon, ExitIcon } from "@/assets/icons";
import Nav from "./Nav.vue";
export default {
  components: {
    Logo,
    MenuIcon,
    ExitIcon,
    Nav,
  },
  data: () => ({
    drawer: false,
    theme: 
  }),
  methods: {
    changeLang(){

    } 
  },
};
</script>

