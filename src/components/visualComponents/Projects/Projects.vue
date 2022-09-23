<template>
    <section>
        <h1 class="absolute left-0 top-0 font-mono font-bold text-primary">Projects</h1>
        <div class="flex flex-col gap-y-10">
            <ProjectItem v-for="project in projectsInfo" :key='project.id' :project="project" />
        </div>
    </section>
</template>
<script>
import ProjectItem from './ProjectItem.vue'
import { projectsInfo } from '@/constants';

export default {
    data:() => ({
        projectsInfo
    }),
    components: {
        ProjectItem
    }
}
</script>