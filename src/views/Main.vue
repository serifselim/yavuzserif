<template>
  <main>
    <header-vue />
    <div class="max-w-7xl mx-auto">
      <div id="intro" class="h-screen">
        <introduce-vue />
      </div>
      <div id="about" class="md:flex md:items-center flex-wrap">
        <h1
          class="
            hidden
            md:block
            text-primary
            -rotate-12
            font-black
            text-[50px]
            ml-14
            -mb-[280px]
            transition-all
            hover:text-dark
          "
        >
          About
        </h1>
        <about-vue />
      </div>
      <div id="projects" class="px-10 flex items-center flex-wrap pt-32">
        <h1
          class="
            hidden
            md:block
            text-primary
            -rotate-12
            font-black
            text-[50px]
            -mb-[170px]
            transition-all
            hover:text-dark
          "
        >
          Projects
        </h1>
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