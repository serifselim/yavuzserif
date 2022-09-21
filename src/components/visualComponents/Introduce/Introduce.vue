<template>
  <section class="flex">
    <div class="
      flex flex-col-reverse
      md:flex-row md:mt-40
      max-w-7xl
      mx-auto
      my-auto
      h-full
    ">
      <div class="
        flex-1
        z-10
        md:mt-8
        flex flex-col
        items-center
        md:items-end
        bg-red
        -mt-10
      ">
        <span class="text-[40px]">Hi I’m Serif.I’m</span>
        <span class="
          relative
          text-[60px]
          font-mono
          font-bold
          leading-[3.90rem]
          text-center
          md:text-right
          text-primary
        ">FRONTEND
          <br />DEVELOP<span class="box">E</span>R</span>
      </div>
      <Model />
    </div>
  </section>
</template>
<script>
import Model from "../Model/Model.vue";
export default {
  components: {
    Model,
  },
};
</script>
<style scoped>
.box {
  background: transparent;
  color: #828C6D;
  animation: 1s closeOpen infinite ;
}

@keyframes closeOpen {
  0%{
    background: #1F2426;
    color: #D2D8D9;
  }
  90%{
    background: #1F2426;
    color: #D2D8D9;
  }
  100%{
    background: transparent;
    color: #828C6D;
  }
}
</style>