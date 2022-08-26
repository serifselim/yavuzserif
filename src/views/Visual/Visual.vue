<template>
  <main class="bg-slate-50">
    <Header :lang='lang' />
    <Model/>
  </main>
</template>

<script>
import { Header, Model } from "../../components/visualComponents";

export default {
  props:['lang'],
  components: {
    Header,
    Model
  },
};
</script>