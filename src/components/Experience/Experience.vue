<template>
  <section class="border-t border-line py-16 md:py-24">
    <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {{ $t("experience.eyebrow") }}
        </p>
        <h2 class="mt-3 text-4xl font-black leading-tight md:text-5xl">
          {{ $t("experience.title") }}
        </h2>
      </div>
      <p class="max-w-md text-muted">
        {{ $t("experience.body") }}
      </p>
    </div>

    <ol class="space-y-6">
      <li
        v-for="job in jobs"
        :key="job.role + job.dates"
        class="rounded-lg border border-line bg-surface p-6 md:p-8"
      >
        <div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 class="text-2xl font-black text-dark">{{ job.role }}</h3>
            <p class="mt-1 font-semibold text-primary">{{ job.company }}</p>
          </div>
          <p class="font-mono text-sm font-semibold text-muted">
            {{ job.dates }} · {{ job.location }}
          </p>
        </div>
        <ul class="mt-6 space-y-3 text-muted">
          <li v-for="bullet in job.bullets" :key="bullet" class="flex gap-3">
            <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span class="leading-7">{{ bullet }}</span>
          </li>
        </ul>
      </li>
    </ol>

    <div class="mt-6 rounded-lg border border-line bg-surface px-6 py-5 md:px-8">
      <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        {{ $t("experience.educationEyebrow") }}
      </p>
      <p class="mt-2 text-lg font-bold text-dark">{{ $t("experience.educationTitle") }}</p>
      <p class="mt-1 text-sm text-muted">{{ $t("experience.educationMeta") }}</p>
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
