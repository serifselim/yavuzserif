<template >
  <a
    :href="resumeUrl"
    target="_blank"
    rel="noreferrer"
    class="
      transition-all
      text-light
      bg-dark
      border border-dark
      rounded-full
      text-center
      py-2
      px-5
      text-sm
      font-semibold
      shadow-sm
      hover:bg-primary
      hover:border-primary
    "
  >
    {{ $t("common.resume") }}
  </a>
</template>
<script>
import resumeUrl from "@/assets/docs/resume.pdf";

export default {
  name: "ResumeButton",
  data: () => ({
    resumeUrl,
  }),
};
</script>
