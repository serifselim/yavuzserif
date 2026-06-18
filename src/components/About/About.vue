<template>
  <section class="grid gap-10 border-t border-line py-16 md:grid-cols-[0.8fr_1.2fr] md:py-24">
    <div>
      <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {{ $t("about.eyebrow") }}
      </p>
      <h2 class="mt-3 text-4xl font-black leading-tight md:text-5xl">
        {{ $t("about.title") }}
      </h2>
    </div>

    <div class="grid gap-8 md:grid-cols-[240px_1fr]">
      <img
        src="@/assets/images/avatar.jpg"
        alt="Yavuz Serifoglu"
        loading="lazy"
        decoding="async"
        class="aspect-[4/5] w-full max-w-[260px] rounded-2xl border border-line object-cover shadow-sm"
      />
      <div class="space-y-7">
        <p class="text-lg leading-8 text-muted">
          {{ $t("about.body") }}
        </p>
        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="item in strengths"
            :key="item.title"
            class="rounded-lg border border-line bg-surface p-4"
          >
            <h3 class="font-bold text-dark">{{ item.title }}</h3>
            <p class="mt-2 text-sm leading-6 text-muted">{{ item.desc }}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in skills"
            :key="skill"
            class="rounded-full border border-line bg-surface px-3 py-2 text-xs font-semibold text-muted"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "About",
  computed: {
    strengths() {
      return this.$tm("about.strengths");
    },
    skills() {
      return this.$tm("about.skills");
    },
  },
};
</script>
