<template>
  <section class="flex relative top-2/4 -translate-y-2/4">
    <div
      class="flex flex-col-reverse md:flex-row max-w-7xl mx-auto my-auto h-full"
    >
      <div
        class="
          flex-1
          z-10
          md:mt-8
          flex flex-col
          items-center
          md:items-end
          bg-red
          -mt-10
        "
      >
        <span class="text-center md:text-left text-[40px]"
          >Hey, I’m Yavuz and I'm a
        </span>
        <span
          class="
            relative
            text-[60px]
            font-mono font-bold
            leading-[3.90rem]
            text-center
            md:text-right
            text-primary
          "
          >FRONTEND DEVELOP<span class="box">E</span>R</span
        >
      </div>
      <Model />
    </div>
  </section>
</template>
<script>
import Model from "../Model/Model.vue";
export default {
  name: "Introduce",
  components: {
    Model,
  },
};
</script>
<style scoped>
.box {
  background: transparent;
  color: #828c6d;
  animation: 1s closeOpen infinite;
}

@keyframes closeOpen {
  0% {
    background: #1f2426;
    color: #d2d8d9;
  }
  90% {
    background: #1f2426;
    color: #d2d8d9;
  }
  100% {
    background: transparent;
    color: #828c6d;
  }
}
</style>