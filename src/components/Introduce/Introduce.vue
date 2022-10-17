<template>
  <section class="flex relative top-2/4 -translate-y-2/4 flex-wrap">
    <div
      class="
        flex flex-col-reverse
        md:flex-row
        max-w-7xl
        mx-auto
        my-auto
        h-full
        -mt-38
        md:mt-0
      "
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
          px-12
          -mt-10
        "
      >
        <span class="text-center md:text-left text-[26px] md:text-[40px]"
          >Hey, I’m Yavuz and I'm a
        </span>
        <span
          class="
            relative
            md:text-[60px]
            text-[50px]
            font-mono 
            font-bold
            leading-[3.90rem]
            text-center
            md:text-right
            text-primary
          "
          >FRONTEND DEVELOPE<span class="box">R</span></span
        >
      </div>
      <Model />
    </div>
    <p class="mx-auto text-right font-mono hidden md:block">
      “The design is not just what it looks like and feels like. <br />
      The design is how it works” <br />
      <span class="italic text-primary">— Steve Jobs</span>
      <hr class="mt-3 border-primary border-2 rounded"/>
    </p>
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