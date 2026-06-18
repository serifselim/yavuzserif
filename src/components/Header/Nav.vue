<template>
  <nav :aria-label="$t('common.primaryNavigation')">
    <ul
      class="
        flex flex-col
        md:flex-row
        gap-3
        md:mr-7 md:mt-0 md:gap-x-2
        mt-12
        text-base
        font-medium
      "
    >
      <li v-for="info in navInfo" :key="info.id">
        <a
          :href="info.path"
          class="block rounded-full px-4 py-2 text-muted transition hover:bg-surface hover:text-dark"
          @click="$emit('navigate')"
        >
          <span class="font-mono text-xs text-primary">0{{ info.id + 1 }}</span>
          {{ info.name }}
        </a>
      </li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: "Nav",
  emits: ["navigate"],
  computed: {
    navInfo() {
      return this.$tm("nav.items");
    },
  },
};
</script>
