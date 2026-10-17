<template>
  <section class="grid gap-12 border-t border-line py-16 md:grid-cols-[0.85fr_1.15fr] md:py-24">
    <div>
      <div class="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary-text">
        <span>[ 03 ]</span>
        <span>{{ $t("about.eyebrow") }}</span>
      </div>
      <h2 class="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-dark md:text-5xl">
        {{ $t("about.title") }}
      </h2>
      <div class="mt-8 overflow-hidden rounded-lg border border-line bg-surface/60 p-2">
        <model-vue />
      </div>
    </div>

    <div class="flex flex-col justify-between">
      <div>
        <p class="text-base leading-8 text-muted md:text-lg">
          {{ $t("about.body") }}
        </p>

        <dl class="mt-8 divide-y divide-line border-t border-b border-line">
          <div
            v-for="(item, idx) in strengths"
            :key="item.title"
            class="grid gap-2 py-5 sm:grid-cols-[140px_1fr] sm:items-baseline sm:gap-6"
          >
            <dt class="flex items-baseline gap-2 font-display text-base font-bold text-dark">
              <span class="font-mono text-[11px] font-medium text-primary-text">0{{ idx + 1 }}</span>
              <span>{{ item.title }}</span>
            </dt>
            <dd class="text-sm leading-7 text-muted">
              {{ item.desc }}
            </dd>
          </div>
        </dl>
      </div>

      <div class="mt-8">
        <p class="font-mono text-xs leading-7 text-muted">
          <template v-for="(skill, sIdx) in skills" :key="skill">
            <span class="font-medium text-dark">{{ skill }}</span>
            <span
              v-if="sIdx < skills.length - 1"
              class="mx-2.5 text-primary-text"
              aria-hidden="true"
            >/</span>
          </template>
        </p>
      </div>
    </div>
  </section>
</template>
<script>
import ModelVue from "@/components/Model/Model.vue";

export default {
  name: "About",
  components: { ModelVue },
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
