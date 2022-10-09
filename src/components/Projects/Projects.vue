<template>
  <section class="bg-red md:mt-[270px]">
    <h1 class="absolute left-0 top-0 font-mono font-bold text-primary">
      Projects
    </h1>
    <div class="flex flex-col gap-y-10 mb-20">
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