<template>
  <div class="flex items-center justify-center flex-col md:flex-row">
    <div class="img-div flex-[2]">
      <img
        class="rounded-lg md:max-w-md"
        :src="project.images[imgIndex]"
        alt="item-image"
      />
    </div>
    <div class="flex-1 text-center md:text-right font-mono">
      <h2 class="text-[35px] font-bold text-primary">{{ project.title }}</h2>
      <p class="text-lg">{{ project.desc }}</p>
      <ul class="text-lg">
        <li class="text-primary font-bold text-xl">What did i use ?</li>
        <li v-for="(tech, i) in project.technologies" :key="i">{{ tech }}</li>
      </ul>
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