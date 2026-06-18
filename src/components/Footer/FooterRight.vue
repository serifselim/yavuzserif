<template>
  <div class="fixed right-8 bottom-0 md:visible animate__fadeInUpBig">
    <button
      @click="copyEmail"
      type="button"
      class="text-vertical cursor-pointer text-center text-sm font-medium tracking-wide text-muted transition hover:text-primary"
      :aria-label="$t('common.copyEmail')"
      >yavuzserifoglu@gmail.com</button
    >
    <div class="w-px h-20 bg-dark ml-2 mx-auto mt-3" />
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
    async copyEmail() {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText("yavuzserifoglu@gmail.com");
      }
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
