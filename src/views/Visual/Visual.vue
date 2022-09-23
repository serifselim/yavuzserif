<template>
  <main>
    <Header />
    <div class="max-w-7xl mx-auto">
      <div class="h-screen">
        <Introduce />
      </div>
      <div class="h-screen">
        <About />
      </div>
      <div class="h-screen mb-10">
        <Projects />
      </div>
      <div class="hidden md:block">
        <FooterLeft />
        <FooterRight />
      </div>

    </div>
  </main>
</template>

<script>
import { Header, Model, Introduce, FooterLeft, FooterRight, About, Projects } from "../../components/visualComponents";

export default {
  components: {
    Header,
    Model,
    Introduce,
    FooterLeft,
    FooterRight,
    About,
    Projects
  },
};
</script>