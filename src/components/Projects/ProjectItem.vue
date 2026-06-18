<template>
  <article class="grid overflow-hidden rounded-lg border border-line bg-surface shadow-sm md:grid-cols-[1.15fr_0.85fr]">
    <div class="relative bg-[#ebe7dc] p-4 md:p-6">
      <img
        class="aspect-[16/10] w-full rounded-md object-cover"
        :src="project.images[imgIndex]"
        :alt="$t('projects.previewAlt', { title: title })"
        loading="lazy"
        decoding="async"
      />
      <div
        v-if="project.images.length > 1"
        class="mt-4 flex justify-center gap-2"
        :aria-label="$t('projects.previewSlides')"
      >
        <span
          v-for="(_, index) in project.images"
          :key="index"
          class="h-1.5 w-6 rounded-full transition"
          :class="index === imgIndex ? 'bg-primary' : 'bg-line'"
        />
      </div>
    </div>

    <div class="flex flex-col justify-between p-6 md:p-8">
      <div>
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {{ category }}
        </p>
        <h3 class="mt-3 text-3xl font-black leading-tight text-dark">
          {{ title }}
        </h3>
        <p class="mt-4 leading-7 text-muted">{{ desc }}</p>

        <ul class="mt-6 flex flex-wrap gap-2" :aria-label="$t('projects.technologies')">
          <li
            v-for="tech in project.technologies"
            :key="tech"
            class="rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-muted"
          >
            {{ tech }}
          </li>
        </ul>
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <a
          :href="project.liveHref"
          target="_blank"
          rel="noreferrer"
          class="rounded-full bg-dark px-5 py-3 text-sm font-semibold text-light transition hover:bg-primary"
        >
          {{ $t("projects.livePreview") }}
        </a>
        <a
          :href="project.githubHref"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"
        >
          <ion-icon name="logo-github" />
          {{ $t("projects.code") }}
        </a>
      </div>
    </div>
  </article>
</template>
<script>
export default {
  name: "ProjectItem",
  props: ["project"],
  data: () => ({
    imgIndex: 0,
    intervalId: null,
  }),
  computed: {
    title() {
      return this.$t(this.project.titleKey);
    },
    category() {
      return this.$t(this.project.categoryKey);
    },
    desc() {
      return this.$t(this.project.descKey);
    },
  },
  methods: {
    loopIndex() {
      if (this.imgIndex < this.project.images.length - 1) {
        this.imgIndex++;
      } else {
        this.imgIndex = 0;
      }
    },
  },
  mounted() {
    if (this.project.images.length > 1) {
      const randomRepeat = Math.random() * 2000 + 1000;
      this.intervalId = setInterval(() => this.loopIndex(), randomRepeat);
    }
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>
