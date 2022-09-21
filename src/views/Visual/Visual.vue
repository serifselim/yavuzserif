<template>
  <main>
    <Header />
      <Introduce />
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
    <FooterLeft/>
    <FooterRight/>
  </main>
</template>

<script>
import { Header, Model, Introduce, FooterLeft, FooterRight } from "../../components/visualComponents";

export default {
  props: ["lang"],
  components: {
    Header,
    Model,
    Introduce,
    FooterLeft,
    FooterRight
  },
};
</script>