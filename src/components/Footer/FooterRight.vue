<template>
  <div class="fixed right-11 bottom-0 md:visible animate__fadeInUpBig">
    <span
      @click="copyEmail"
      class="text-vertical hover:text-primary text-center cursor-pointer"
      >yavuzserifoglu@gmail.com</span
    >
    <div class="w-1 h-20 bg-dark ml-2 mx-auto mt-2" />
    <toast-vue v-if="isCopied" />
  </div>
</template>

<script>
import ToastVue from "../Global/Toast.vue";
export default {
  name: "FooterRight",
  data: () => ({
    isCopied: false,
  }),
  methods: {
    copyEmail() {
      navigator.clipboard.writeText("yavuzserifoglu@gmail.com");
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 1000);
    },
  },

  components: {
    ToastVue,
  },
};
</script>    

<style scoped>
.text-vertical {
  writing-mode: vertical-lr;
}
</style>