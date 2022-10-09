<template>
  <main>
    <header-vue />
    <div class="max-w-7xl mx-auto">
      <div id="intro" class="h-screen">
        <introduce-vue />
      </div>
      <div id="about" class="md:flex md:items-center">
        <about-vue />
      </div>
      <div id="projects" class="px-10 flex items-center">
        <projects-vue />
      </div>
      <div class="hidden md:block">
        <footer-left-vue />
        <footer-right-vue />
      </div>
    </div>
  </main>
</template>

<script>
import {
  HeaderVue,
  ModelVue,
  IntroduceVue,
  FooterLeftVue,
  FooterRightVue,
  AboutVue,
  ProjectsVue,
} from "@/components";

export default {
  name: "Main",
  components: {
    HeaderVue,
    ModelVue,
    IntroduceVue,
    FooterLeftVue,
    FooterRightVue,
    AboutVue,
    ProjectsVue,
  },
};
</script>