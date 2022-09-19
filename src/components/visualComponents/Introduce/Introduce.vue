<template>
  <div
    class="
      flex flex-col-reverse
      md:flex-row md:mt-40
      max-w-7xl
      mx-auto
      my-auto
      h-full
    "
  >
    <div
      class="
        flex-1
        md:mt-8
        flex flex-col
        items-center
        md:items-end
        bg-red
        -mt-10
      "
    >
      <span class="text-[40px]">Hi I’m Serif.I’m</span>
      <span
        class="
          text-[60px]
          font-bold
          leading-[3.90rem]
          text-center
          md:text-right
          text-primary
        "
        >FRONTEND<br />DEVELOPER</span
      >
    </div>
    <Model />
  </div>
</template>
<script>
import Model from "../Model/Model.vue";
export default {
  components: {
    Model,
  },
};
</script>
<style lang="">
</style>