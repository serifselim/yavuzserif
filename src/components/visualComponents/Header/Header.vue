<template>
  <header class="w-full">
    <section class="w-full bg-red p-10 flex justify-between">
      <div>
        <Logo />
      </div>
      <div class="flex items-center">
        <ul class="flex mr-6 gap-6">
          <li class="hover:text-green text-lg cursor-pointer">
            [<span class="text-green">0</span>]About
          </li>
          <li class="hover:text-green text-lg cursor-pointer">
            [<span class="text-green">1</span>]Projects
          </li>
          <li class="hover:text-green text-lg cursor-pointer">
            [<span class="text-green">2</span>]Source
          </li>
        </ul>
        <div>
          <button
            class="
              font-medium
              rounded
              transition-colors
              border-[3px] border-green
              px-5
              py-1
              hover:bg-green hover:text-iron
            "
          >
            Resume
          </button>
        </div>
      </div>
    </section>
  </header>
</template>
<script>
import Logo from "../../../assets/Logo.vue";
export default {
  components: {
    Logo,
  },
};
</script>