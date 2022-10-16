<template >
  <section class="flex flex-col md:flex-row md:my-[200px]">
    <div class="flex flex-col items-center flex-1">
      <img
        src="@/assets/images/avatar.jpg"
        alt="avatar"
        class="
          w-1/2
          md:max-w-xs
          rounded-3xl
          mb-10
          grayscale
          transition-all
          hover:grayscale-0
          border-4 border-primary
        "
      />
      <p
        class="
          text-lg
          font-bold
          text-dark
          leading-6
          font-mono
          w-3/4
          mb-10
          md:mb-0
        "
      >
        I have been interested in computers since childhood and design since
        high school. When I started university I first determined my profession
        as an Interface Designer, but with the algorithm course I took last
        year, I met the software. I develop myself both in software and design.
      </p>
    </div>
    <div class="flex-1">
      <img
        src="@/assets/images/code.png"
        class="w-3/4 mx-auto"
        alt="code-img"
      />
    </div>
  </section>
</template>
<script>
export default {
  name: "About",
  computed: {
    getWidth() {
      return window.screen.width;
    },
  },
};
</script>
