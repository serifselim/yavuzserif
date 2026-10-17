<template>
  <section class="grid min-h-[calc(100vh-7rem)] items-center gap-10 pb-14 md:grid-cols-[1.05fr_0.95fr] md:pb-20">
    <div class="order-2 flex flex-col items-start md:order-1">
      <div class="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-1.5 shadow-sm">
        <span class="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-text">
          {{ $t("hero.eyebrow") }}
        </p>
      </div>
      <h1 class="mt-5 max-w-4xl text-4xl font-black leading-[1.06] tracking-tight text-dark sm:text-5xl lg:text-6xl">
        {{ $t("hero.title") }}
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
        {{ $t("hero.body") }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a
          href="#work"
          class="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light transition hover:bg-primary hover:text-white"
        >
          {{ $t("hero.projectsCta") }}
        </a>
        <resume-button-vue variant="outline" />
      </div>
      <dl class="mt-12 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="rounded-xl border border-line bg-surface px-4 py-3.5 shadow-sm"
        >
          <dt class="text-base font-black text-dark md:text-lg">{{ metric.value }}</dt>
          <dd class="mt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-text">{{ metric.label }}</dd>
        </div>
      </dl>
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
  computed: {
    metrics() {
      return this.$tm("hero.metrics");
    },
  },
};
</script>
<style scoped>
@media (max-width: 420px) {
  h1 {
    font-size: clamp(2.75rem, 12vw, 3.4rem);
  }
}
</style>
