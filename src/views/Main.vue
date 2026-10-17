<template>
  <main class="overflow-hidden">
    <header-vue />
    <div class="mx-auto max-w-7xl px-5 pt-14 md:border-x md:border-line md:px-14">
      <div id="intro" class="scroll-mt-16">
        <introduce-vue />
      </div>
      <div id="work" class="scroll-mt-16">
        <projects-vue />
      </div>
      <div id="experience" class="scroll-mt-16">
        <experience-vue />
      </div>
      <div id="about" class="scroll-mt-16">
        <about-vue />
      </div>
      <section
        id="contact"
        class="scroll-mt-16 border-t border-line py-16 md:py-24"
      >
        <div class="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <div class="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-primary-text">
              <span>[ 04 ]</span>
              <span>{{ $t("contact.eyebrow") }}</span>
            </div>
            <h2 class="mt-3 font-display text-4xl font-bold tracking-[-0.03em] text-dark md:text-5xl">
              {{ $t("contact.title") }}
            </h2>
            <p class="mt-4 max-w-sm text-sm leading-7 text-muted md:text-base">
              {{ $t("contact.body") }}
            </p>
          </div>

          <div class="divide-y divide-line border-t border-b border-line">
            <a
              class="group flex items-center justify-between py-4 transition hover:px-2"
              :href="emailHref"
            >
              <span class="flex items-baseline gap-3">
                <span class="font-mono text-xs text-primary-text">01</span>
                <span class="font-display text-lg font-bold text-dark group-hover:text-primary-text">
                  {{ $t("contact.email") }}
                </span>
              </span>
              <span class="font-mono text-xs text-muted group-hover:text-dark">
                {{ site.email }} ↗
              </span>
            </a>

            <a
              class="group flex items-center justify-between py-4 transition hover:px-2"
              :href="site.linkedin"
              target="_blank"
              rel="noreferrer"
            >
              <span class="flex items-baseline gap-3">
                <span class="font-mono text-xs text-primary-text">02</span>
                <span class="font-display text-lg font-bold text-dark group-hover:text-primary-text">
                  {{ $t("contact.linkedin") }}
                </span>
              </span>
              <span class="font-mono text-xs text-muted group-hover:text-dark">
                /in/serifselim ↗
              </span>
            </a>

            <a
              class="group flex items-center justify-between py-4 transition hover:px-2"
              :href="site.github"
              target="_blank"
              rel="noreferrer"
            >
              <span class="flex items-baseline gap-3">
                <span class="font-mono text-xs text-primary-text">03</span>
                <span class="font-display text-lg font-bold text-dark group-hover:text-primary-text">
                  {{ $t("contact.github") }}
                </span>
              </span>
              <span class="font-mono text-xs text-muted group-hover:text-dark">
                @serifselim ↗
              </span>
            </a>

            <a
              class="group flex items-center justify-between py-4 transition hover:px-2"
              :href="resumeTr"
              :download="resumeDownloadName('tr')"
            >
              <span class="flex items-baseline gap-3">
                <span class="font-mono text-xs text-primary-text">04</span>
                <span class="font-display text-lg font-bold text-dark group-hover:text-primary-text">
                  {{ $t("contact.resumeTurkish") }}
                </span>
              </span>
              <span class="font-mono text-xs text-muted group-hover:text-dark">
                PDF ↓
              </span>
            </a>

            <a
              class="group flex items-center justify-between py-4 transition hover:px-2"
              :href="resumeEn"
              :download="resumeDownloadName('en')"
            >
              <span class="flex items-baseline gap-3">
                <span class="font-mono text-xs text-primary-text">05</span>
                <span class="font-display text-lg font-bold text-dark group-hover:text-primary-text">
                  {{ $t("contact.resumeEnglish") }}
                </span>
              </span>
              <span class="font-mono text-xs text-muted group-hover:text-dark">
                PDF ↓
              </span>
            </a>
          </div>
        </div>
      </section>
      <footer class="hidden md:block">
        <footer-left-vue />
        <footer-right-vue />
      </footer>
    </div>
  </main>
</template>

<script>
import resumeEn from "@/assets/docs/resume-en.pdf";
import resumeTr from "@/assets/docs/resume-tr.pdf";
import {
  HeaderVue,
  IntroduceVue,
  FooterLeftVue,
  FooterRightVue,
  AboutVue,
  ProjectsVue,
  ExperienceVue,
} from "@/components";
import { site } from "@/constants";
import { mailtoHref } from "@/i18n/locale.mjs";
import { resumeDownloadName } from "@/i18n/resume.mjs";

export default {
  name: "Main",
  data: () => ({
    site,
    resumeEn,
    resumeTr,
  }),
  methods: {
    resumeDownloadName,
  },
  computed: {
    emailHref() {
      return mailtoHref(site.email, this.$t("common.emailSubject"));
    },
  },
  components: {
    HeaderVue,
    IntroduceVue,
    FooterLeftVue,
    FooterRightVue,
    AboutVue,
    ProjectsVue,
    ExperienceVue,
  },
};
</script>
