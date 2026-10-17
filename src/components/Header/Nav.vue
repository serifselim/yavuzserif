<template>
  <nav :aria-label="$t('common.primaryNavigation')">
    <ul
      class="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:gap-1"
    >
      <li v-for="info in navInfo" :key="info.id">
        <a
          :href="info.path"
          :aria-current="activePath === info.path ? 'location' : undefined"
          class="group relative flex items-center justify-between gap-2.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 lg:justify-center lg:px-4 lg:py-1.5"
          :class="
            activePath === info.path
              ? 'bg-dark text-light shadow-sm'
              : 'text-muted hover:bg-well/80 hover:text-dark'
          "
          @click="onSelect(info.path)"
        >
          <span class="flex items-center gap-2">
            <span
              class="h-1.5 w-1.5 rounded-full transition-all duration-200"
              :class="
                activePath === info.path
                  ? 'scale-100 bg-primary'
                  : 'scale-0 bg-primary/50 group-hover:scale-75'
              "
              aria-hidden="true"
            />
            <span>{{ info.name }}</span>
          </span>
          <span
            class="font-mono text-[10px] tracking-wider transition-opacity lg:hidden"
            :class="
              activePath === info.path ? 'text-light/70' : 'text-primary-text'
            "
          >
            0{{ info.id + 1 }}
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Nav",
  emits: ["navigate"],
  data: () => ({
    activePath: "#intro",
  }),
  computed: {
    navInfo() {
      return this.$tm("nav.items");
    },
  },
  methods: {
    onSelect(path) {
      this.activePath = path;
      this.$emit("navigate");
    },
    updateActiveSection() {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return;
      }

      const items = this.navInfo || [];
      const triggerLine = window.innerHeight * 0.32;
      let current = items[0]?.path || "#intro";

      for (const item of items) {
        const el = document.querySelector(item.path);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerLine) {
          current = item.path;
        }
      }

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 48;
      if (nearBottom && items.length > 0) {
        current = items[items.length - 1].path;
      }

      this.activePath = current;
    },
  },
  mounted() {
    this.updateActiveSection();
    window.addEventListener("scroll", this.updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", this.updateActiveSection, {
      passive: true,
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.updateActiveSection);
    window.removeEventListener("resize", this.updateActiveSection);
  },
};
</script>
