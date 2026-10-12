<template>
  <section class="grid min-h-[calc(100vh-7rem)] items-center gap-10 pb-14 md:grid-cols-[1.05fr_0.95fr] md:pb-20">
    <div class="order-2 flex flex-col items-start md:order-1">
      <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {{ $t("hero.eyebrow") }}
      </p>
      <h1 class="mt-5 max-w-4xl text-5xl font-black leading-[0.98] text-dark md:text-7xl">
        {{ $t("hero.title") }}
      </h1>
      <p class="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
        {{ $t("hero.body") }}
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a
          href="#work"
          class="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light transition hover:bg-primary"
        >
          {{ $t("hero.projectsCta") }}
        </a>
        <a
          :href="resumeUrl"
          target="_blank"
          rel="noreferrer"
          class="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"
        >
          {{ $t("hero.resumeCta") }}
        </a>
      </div>
      <dl class="mt-12 grid w-full max-w-2xl grid-cols-2 gap-x-6 gap-y-5">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="border-l border-line pl-4"
        >
          <dt class="text-xl font-black text-dark md:text-2xl">{{ metric.value }}</dt>
          <dd class="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{{ metric.label }}</dd>
        </div>
      </dl>
    </div>

    <div class="order-1 md:order-2">
      <dev-runner-vue />
    </div>
  </section>
</template>
<script>
import resumeUrl from "@/assets/docs/resume.pdf";
import DevRunnerVue from "./DevRunner.vue";

export default {
  name: "Introduce",
  components: {
    DevRunnerVue,
  },
  data: () => ({
    resumeUrl,
  }),
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
