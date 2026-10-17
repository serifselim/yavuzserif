<template>
  <section class="border-t border-line py-16 md:py-24">
    <div class="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary-text">
          {{ $t("projects.eyebrow") }}
        </p>
        <h2 class="mt-3 text-4xl font-black leading-tight md:text-5xl">
          {{ $t("projects.title") }}
        </h2>
      </div>
      <p class="max-w-md text-muted">
        {{ $t("projects.body") }}
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <article
        v-for="item in projectsInfo"
        :key="item.id"
        class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 md:p-8"
        :class="item.flagship ? 'md:col-span-2' : ''"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent opacity-80 transition-opacity group-hover:opacity-100"
          aria-hidden="true"
        />

        <div :class="item.flagship ? 'md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-8 md:items-start' : ''">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="font-mono text-xs font-bold text-primary-text">
                  {{ item.index }}
                </span>
                <span class="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
                <p class="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary-text">
                  {{ $t(item.categoryKey) }}
                </p>
              </div>

              <span
                v-if="item.roleKey"
                class="rounded-full border border-line bg-well px-3 py-1 font-mono text-[11px] font-semibold text-muted"
              >
                {{ $t(item.roleKey) }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap items-baseline justify-between gap-3">
              <h3 class="text-2xl font-black tracking-tight text-dark md:text-3xl">
                {{ $t(item.titleKey) }}
              </h3>

              <div v-if="item.liveHref || item.githubHref" class="flex flex-wrap items-center gap-2">
                <a
                  v-if="item.liveHref"
                  :href="item.liveHref"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-background px-3.5 py-1.5 font-mono text-xs font-semibold text-dark transition hover:border-primary hover:text-primary-text"
                >
                  <span>{{ item.liveLabel || $t("projects.livePreview") }}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  v-if="item.githubHref"
                  :href="item.githubHref"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-background px-3.5 py-1.5 font-mono text-xs font-semibold text-dark transition hover:border-primary hover:text-primary-text"
                >
                  <ion-icon name="logo-github" class="text-sm" />
                  <span>{{ $t("projects.code") }}</span>
                </a>
              </div>
            </div>

            <p class="mt-3 text-sm leading-7 text-muted md:text-base md:leading-7">
              {{ $t(item.descKey) }}
            </p>
          </div>

          <div :class="item.flagship ? 'mt-6 md:mt-0 md:border-l md:border-line md:pl-8' : 'mt-6'">
            <p class="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              {{ $t("projects.modulesLabel") }}
            </p>
            <ul class="mt-2.5 flex flex-wrap gap-1.5">
              <li
                v-for="mod in $tm(item.modulesKey)"
                :key="mod"
                class="rounded-md border border-line/90 bg-well px-2.5 py-1 text-xs font-semibold text-dark"
              >
                {{ mod }}
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line/70 pt-4">
          <ul class="flex flex-wrap gap-2" :aria-label="$t('projects.technologies')">
            <li
              v-for="tech in item.technologies"
              :key="tech"
              class="rounded-full bg-background px-3 py-1 font-mono text-xs font-semibold text-muted"
            >
              {{ tech }}
            </li>
          </ul>
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
