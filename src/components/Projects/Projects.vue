<template>
  <section class="border-t border-line py-16 md:py-24">
    <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <div class="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary-text">
          <span>[ 01 ]</span>
          <span>{{ $t("projects.eyebrow") }}</span>
        </div>
        <h2 class="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-dark md:text-5xl">
          {{ $t("projects.title") }}
        </h2>
      </div>
      <p class="max-w-md text-sm leading-7 text-muted md:text-base">
        {{ $t("projects.body") }}
      </p>
    </div>

    <div class="grid border-t border-l border-line bg-surface/70 md:grid-cols-2">
      <article
        v-for="(item, idx) in projectsInfo"
        :key="item.id"
        class="group relative flex flex-col justify-between border-r border-b border-line p-6 transition-colors duration-200 hover:bg-surface md:p-9"
        :class="item.flagship || idx === projectsInfo.length - 1 ? 'md:col-span-2' : ''"
      >
        <!-- Corner Crosshair Accent -->
        <span
          class="pointer-events-none absolute -top-[5px] -left-[5px] select-none font-mono text-[10px] leading-none text-muted/60"
          aria-hidden="true"
        >+</span>

        <div
          :class="
            item.flagship || idx === projectsInfo.length - 1
              ? 'md:grid md:grid-cols-[1.2fr_0.8fr] md:gap-10 md:items-start'
              : ''
          "
        >
          <div>
            <!-- Top Metadata Strip -->
            <div class="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px]">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-primary-text">{{ item.index }}</span>
                <span class="text-line">/</span>
                <span class="uppercase tracking-[0.14em] text-muted">
                  {{ $t(item.categoryKey) }}
                </span>
              </div>

              <span v-if="item.roleKey" class="text-muted">
                {{ $t(item.roleKey) }}
              </span>
            </div>

            <!-- Project Title & Direct Links -->
            <div class="mt-3.5 flex flex-wrap items-baseline justify-between gap-3">
              <h3 class="font-display text-2xl font-bold tracking-[-0.025em] text-dark transition-colors group-hover:text-primary-text md:text-3xl">
                {{ $t(item.titleKey) }}
              </h3>

              <div v-if="item.liveHref || item.githubHref" class="flex items-center gap-4 font-mono text-xs font-medium">
                <a
                  v-if="item.liveHref"
                  :href="item.liveHref"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1 text-dark underline decoration-line underline-offset-4 transition hover:text-primary-text hover:decoration-primary"
                >
                  <span>{{ item.liveLabel || $t("projects.livePreview") }}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  v-if="item.githubHref"
                  :href="item.githubHref"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center gap-1 text-muted underline decoration-line underline-offset-4 transition hover:text-dark hover:decoration-dark"
                >
                  <span>{{ $t("projects.code") }}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <!-- Editorial Description -->
            <p class="mt-3 text-sm leading-7 text-muted md:text-[15px] md:leading-7">
              {{ $t(item.descKey) }}
            </p>
          </div>

          <!-- Architectural Scope & Modules Specification -->
          <div
            :class="
              item.flagship || idx === projectsInfo.length - 1
                ? 'mt-6 border-t border-dashed border-line pt-4 md:mt-0 md:border-t-0 md:border-l md:border-solid md:border-line md:pt-0 md:pl-8'
                : 'mt-6 border-t border-dashed border-line pt-4'
            "
          >
            <p class="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              {{ $t("projects.modulesLabel") }}
            </p>
            <p class="mt-2 text-xs font-medium leading-6 text-dark md:text-[13px]">
              <template v-for="(mod, mIdx) in $tm(item.modulesKey)" :key="mod">
                <span>{{ mod }}</span>
                <span
                  v-if="mIdx < $tm(item.modulesKey).length - 1"
                  class="mx-2 font-mono text-primary-text"
                  aria-hidden="true"
                >·</span>
              </template>
            </p>
          </div>
        </div>

        <!-- Inline Monospace Tech Stack Ledger -->
        <div class="mt-6 border-t border-line/80 pt-3.5">
          <p
            class="font-mono text-[11px] tracking-tight text-muted"
            :aria-label="$t('projects.technologies')"
          >
            <template v-for="(tech, tIdx) in item.technologies" :key="tech">
              <span>{{ tech }}</span>
              <span
                v-if="tIdx < item.technologies.length - 1"
                class="mx-2 text-line"
                aria-hidden="true"
              >/</span>
            </template>
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
<script>
import { projectsInfo } from "@/constants";

export default {
  name: "Projects",
  data: () => ({
    projectsInfo,
  }),
};
</script>
