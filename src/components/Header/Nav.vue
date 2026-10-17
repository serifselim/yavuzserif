<template>
  <nav :aria-label="$t('common.primaryNavigation')" class="h-full">
    <ul
      class="flex flex-col divide-y divide-line lg:h-full lg:flex-row lg:items-stretch lg:divide-y-0"
    >
      <li v-for="info in navInfo" :key="info.id" class="flex">
        <a
          :href="info.path"
          :aria-current="activePath === info.path ? 'location' : undefined"
          class="group relative flex w-full items-center justify-between gap-2 whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors lg:px-5 lg:py-0"
          :class="
            activePath === info.path
              ? 'text-dark font-semibold'
              : 'text-muted hover:text-dark'
          "
          @click="onSelect(info.path)"
        >
          <span class="flex items-baseline gap-1.5">
            <span
              class="font-mono text-[10px] transition-colors"
              :class="
                activePath === info.path
                  ? 'text-primary-text font-semibold'
                  : 'text-muted/70 group-hover:text-primary-text'
              "
            >
              0{{ info.id + 1 }}
            </span>
            <span class="tracking-tight">{{ info.name }}</span>
          </span>

          <span
            class="pointer-events-none absolute inset-x-4 bottom-0 hidden h-[2px] transition-all duration-200 lg:block"
            :class="
              activePath === info.path
                ? 'bg-primary opacity-100'
                : 'bg-line opacity-0 group-hover:opacity-100'
            "
            aria-hidden="true"
          />
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
