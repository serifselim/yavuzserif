<template>
  <section class="grid min-h-[calc(100vh-3.5rem)] items-center gap-12 py-12 md:grid-cols-[1.08fr_0.92fr] md:py-20">
    <div class="order-2 flex flex-col items-start md:order-1">
      <div class="flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted">
        <span class="inline-block h-[1px] w-8 bg-primary" aria-hidden="true" />
        <span>{{ $t("hero.eyebrow") }}</span>
      </div>

      <h1 class="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.03] tracking-[-0.035em] text-dark sm:text-5xl lg:text-[3.65rem]">
        {{ $t("hero.title") }}
      </h1>

      <p class="mt-6 max-w-xl text-base leading-[1.8] text-muted md:text-lg">
        {{ $t("hero.body") }}
      </p>

      <div class="mt-9 flex flex-wrap items-center gap-3">
        <a
          href="#work"
          class="group inline-flex items-center gap-2.5 rounded-md bg-dark px-6 py-3 text-sm font-semibold text-light transition hover:bg-primary hover:text-white"
        >
          <span>{{ $t("hero.projectsCta") }}</span>
          <span class="font-mono text-xs transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
        </a>
        <resume-button-vue variant="outline" />
      </div>
    </div>

    <div class="order-1 md:order-2">
      <dev-runner-vue />
    </div>
  </section>
</template>
<script>
import DevRunnerVue from "./DevRunner.vue";
import ResumeButtonVue from "@/components/Header/ResumeButton.vue";

export default {
  name: "Introduce",
  components: {
    DevRunnerVue,
    ResumeButtonVue,
  },
};
</script>
<style scoped>
@media (max-width: 420px) {
  h1 {
    font-size: clamp(2.35rem, 10.5vw, 3rem);
  }
}
</style>
