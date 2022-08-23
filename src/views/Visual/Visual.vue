<template>
  <main class="bg-iron min-h-screen">
    <Header />
    <Model/>
  </main>
</template>

<script>
import { Header, Model } from "../../components/visualComponents";

export default {
  components: {
    Header,
    Model
  },
};
</script>