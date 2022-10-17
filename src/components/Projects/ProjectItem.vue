<template>
  <div class="flex items-center justify-center flex-col md:flex-row">
    <div class="releative img-div flex-[2]">
      <img
        class="rounded-lg md:max-w-md md:mb-0 mb-3"
        :src="project.images[imgIndex]"
        alt="item-image"
      />
    </div>
    <div class="flex-1 text-center md:text-right font-mono">
      <a :href="project.liveHref" target="_black">
        <h2
          class="
            text-[28px]
            md:text-[35px]
            font-bold
            text-primary
            md:no-underline
            underline
            hover:underline hover:text-dark
            transition-all
          "
        >
          {{ project.title }}
        </h2>
      </a>
      <p class=" text-sm md:text-lg">{{ project.desc }}</p>
      <div class="details">
        <ul class="text-sm md:text-lg">
          <li class="text-primary font-bold text-base md:text-xl">What did i use ?</li>
          <li v-for="(tech, i) in project.technologies" :key="i">{{ tech }}</li>
        </ul>
        <div>
          <a target="_blank" :href="project.githubHref">
            <ion-icon size="extra-large" name="logo-github" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ProjectItem",
  props: ["project"],
  data: () => ({
    imgIndex: 0,
  }),
  methods: {
    loogIndex() {
      if (this.imgIndex < this.project.images.length - 1) {
        this.imgIndex++;
      } else {
        this.imgIndex = 0;
      }
    },
  },
  mounted() {
    // Loop func for images of project
    if (this.project.images.length > 1) {
      const randomRepeat = Math.random() * 2000 + 1000;
      setInterval(() => this.loogIndex(), randomRepeat);
    }
  },
};
</script>
<style scoped>
.img-div {
  filter: drop-shadow(6px 8px 7px rgba(0, 0, 0, 0.2));
}
</style>