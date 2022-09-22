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
      <FooterLeft />
      <FooterRight />
    </div>
  </main>
</template>

<script>
import { Header, Model, Introduce, FooterLeft, FooterRight, About } from "../../components/visualComponents";

export default {
  components: {
    Header,
    Model,
    Introduce,
    FooterLeft,
    FooterRight,
    About
  },
};
</script>