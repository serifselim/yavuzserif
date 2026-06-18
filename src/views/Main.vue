<template>
  <main class="overflow-hidden">
    <header-vue />
    <div class="mx-auto max-w-7xl px-5 md:px-10">
      <div id="intro" class="min-h-screen pt-24 md:pt-28">
        <introduce-vue />
      </div>
      <div id="about" class="scroll-mt-28">
        <about-vue />
      </div>
      <div id="projects" class="scroll-mt-28">
        <projects-vue />
      </div>
      <section
        id="contact"
        class="scroll-mt-28 border-t border-line py-16 md:ml-20 md:mr-20 md:py-20"
      >
        <div class="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {{ $t("contact.eyebrow") }}
            </p>
            <h2 class="mt-3 text-3xl font-black leading-tight md:text-5xl">
              {{ $t("contact.title") }}
            </h2>
          </div>
          <div class="space-y-5 text-muted">
            <p>
              {{ $t("contact.body") }}
            </p>
            <div class="flex flex-wrap gap-3">
              <a
                class="rounded-full bg-dark px-5 py-3 text-sm font-semibold text-light transition hover:bg-primary"
                href="mailto:yavuzserifoglu@gmail.com"
              >
                {{ $t("contact.email") }}
              </a>
              <a
                class="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"
                href="https://www.linkedin.com/in/serifselim/"
                target="_blank"
                rel="noreferrer"
              >
                {{ $t("contact.linkedin") }}
              </a>
              <a
                class="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary"
                href="https://github.com/serifselim"
                target="_blank"
                rel="noreferrer"
              >
                {{ $t("contact.github") }}
              </a>
            </div>
          </div>
        </div>
      </section>
      <div class="hidden md:block">
        <footer-left-vue />
        <footer-right-vue />
      </div>
    </div>
  </main>
</template>

<script>
import {
  HeaderVue,
  IntroduceVue,
  FooterLeftVue,
  FooterRightVue,
  AboutVue,
  ProjectsVue,
} from "@/components";

export default {
  name: "Main",
  components: {
    HeaderVue,
    IntroduceVue,
    FooterLeftVue,
    FooterRightVue,
    AboutVue,
    ProjectsVue,
  },
};
</script>
