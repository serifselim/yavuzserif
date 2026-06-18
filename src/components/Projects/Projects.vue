<template>
  <section class="border-t border-line py-16 md:py-24">
    <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          {{ $t("projects.eyebrow") }}
        </p>
        <h2 class="mt-3 text-4xl font-black leading-tight md:text-5xl">
          {{ $t("projects.title") }}
        </h2>
      </div>
      <p class="max-w-md text-muted">
        {{ $t("projects.body") }}
      </p>
    </div>
    <div class="grid gap-5">
      <project-item-vue
        v-for="project in projectsInfo"
        :key="project.id"
        :project="project"
      />
    </div>
  </section>
</template>
<script>
import ProjectItemVue from "./ProjectItem.vue";
import { projectsInfo } from "@/constants";

export default {
  name: "Projects",
  data: () => ({
    projectsInfo,
  }),
  components: {
    ProjectItemVue,
  },
};
</script>
