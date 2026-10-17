<template>
  <div class="fixed right-8 bottom-0 md:visible animate__fadeInUpBig">
    <a
      :href="emailHref"
      class="text-vertical cursor-pointer text-center text-sm font-medium tracking-wide text-muted transition hover:text-primary-text"
      >{{ site.email }}</a
    >
    <div class="w-px h-20 bg-dark ml-2 mx-auto mt-3" />
  </div>
</template>

<script>
import { site } from "@/constants";
import { mailtoHref } from "@/i18n/locale.mjs";

export default {
  name: "FooterRight",
  data: () => ({
    site,
  }),
  computed: {
    emailHref() {
      return mailtoHref(site.email, this.$t("common.emailSubject"));
    },
  },
};
</script>    

<style scoped>
.text-vertical {
  writing-mode: vertical-lr;
}
</style>
