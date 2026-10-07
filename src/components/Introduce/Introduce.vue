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
          :href="emailHref"
          class="rounded-full bg-dark px-6 py-3 text-sm font-semibold text-light transition hover:bg-primary"
        >
          {{ $t("hero.contactCta") }}
        </a>
        <a
          :href="resumeUrl"
          target="_blank"
          rel="noreferrer"
          class="rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"
        >
          {{ $t("hero.resumeCta") }}
        </a>
        <a
          href="#work"
          class="rounded-full px-6 py-3 text-sm font-semibold text-muted transition hover:text-dark"
        >
          {{ $t("hero.projectsCta") }}
        </a>
      </div>
      <dl class="mt-12 grid w-full max-w-2xl grid-cols-3 gap-3">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="border-l border-line pl-4"
        >
          <dt class="text-2xl font-black text-dark">{{ metric.value }}</dt>
          <dd class="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{{ metric.label }}</dd>
        </div>
      </dl>
    </div>

    <div class="order-1 md:order-2">
      <div class="relative mx-auto w-full max-w-[440px] rounded-2xl border border-line bg-surface p-6 shadow-sm md:p-8">
        <img
          src="@/assets/images/avatar.jpg"
          alt="Yavuz Serifoglu"
          width="96"
          height="96"
          class="h-24 w-24 rounded-full border border-line object-cover"
        />
        <p class="mt-5 text-2xl font-black text-dark">{{ site.name }}</p>
        <p class="mt-1 font-semibold text-primary">{{ $t("hero.profileRole") }}</p>
        <p class="mt-1 text-sm text-muted">{{ $t("hero.profileLocation") }}</p>
        <p class="mt-4 rounded-full bg-background px-3 py-2 text-xs font-semibold text-dark">
          {{ $t("hero.profileAvailability") }}
        </p>
        <ul class="mt-5 flex flex-wrap gap-2" :aria-label="$t('projects.technologies')">
          <li
            v-for="tech in stack"
            :key="tech"
            class="rounded-full border border-line bg-background px-3 py-1.5 text-xs font-semibold text-muted"
          >
            {{ tech }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import resumeUrl from "@/assets/docs/resume.pdf";
import { site } from "@/constants";
import { mailtoHref } from "@/i18n/locale.mjs";

export default {
  name: "Introduce",
  data: () => ({
    resumeUrl,
    site,
  }),
  computed: {
    metrics() {
      return this.$tm("hero.metrics");
    },
    stack() {
      return this.$tm("hero.stack");
    },
    emailHref() {
      return mailtoHref(site.email, this.$t("common.emailSubject"));
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
