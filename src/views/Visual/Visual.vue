<template>
  <main>
    <Header />
    <section class="flex">
      <Introduce />
    </section>
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  </main>
</template>

<script>
import { Header, Model, Introduce } from "../../components/visualComponents";

export default {
  props: ["lang"],
  components: {
    Header,
    Model,
    Introduce,
  },
};
</script>