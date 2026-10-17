<template>
  <section class="border-t border-line py-16 md:py-24">
    <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <div class="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary-text">
          <span>[ 02 ]</span>
          <span>{{ $t("experience.eyebrow") }}</span>
        </div>
        <h2 class="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-dark md:text-5xl">
          {{ $t("experience.title") }}
        </h2>
      </div>
      <p class="max-w-md text-sm leading-7 text-muted md:text-base">
        {{ $t("experience.body") }}
      </p>
    </div>

    <ol class="divide-y divide-line border-t border-b border-line">
      <li
        v-for="job in jobs"
        :key="job.role + job.dates"
        class="grid gap-6 py-8 md:grid-cols-[280px_1fr] md:gap-12 md:py-10"
      >
        <div class="flex flex-col justify-between">
          <div>
            <p class="font-mono text-xs font-medium text-primary-text">
              {{ job.dates }}
            </p>
            <h3 class="mt-2 font-display text-2xl font-bold tracking-tight text-dark">
              {{ job.role }}
            </h3>
            <p class="mt-1 text-sm font-semibold text-dark/90">
              {{ job.company }}
            </p>
          </div>
          <p class="mt-3 font-mono text-xs text-muted md:mt-6">
            {{ job.location }}
          </p>
        </div>

        <ul class="divide-y divide-line/60">
          <li
            v-for="(bullet, bIdx) in job.bullets"
            :key="bullet"
            class="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span class="font-mono text-[11px] font-semibold text-muted/70">
              0{{ bIdx + 1 }}
            </span>
            <span class="text-sm leading-7 text-muted md:text-[15px]">
              {{ bullet }}
            </span>
          </li>
        </ul>
      </li>
    </ol>

    <div class="grid gap-4 border-b border-line py-7 md:grid-cols-[280px_1fr] md:items-baseline md:gap-12">
      <p class="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-primary-text">
        {{ $t("experience.educationEyebrow") }}
      </p>
      <div class="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
        <p class="font-display text-lg font-bold text-dark">
          {{ $t("experience.educationTitle") }}
        </p>
        <p class="font-mono text-xs text-muted">
          {{ $t("experience.educationMeta") }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Experience",
  computed: {
    jobs() {
      return this.$tm("experience.items");
    },
  },
};
</script>
