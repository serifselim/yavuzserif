<template>
  <main class="overflow-hidden">
    <header-vue />
    <div class="mx-auto max-w-7xl px-5 md:px-20">
      <div id="intro" class="min-h-screen pt-24 md:pt-28">
        <introduce-vue />
      </div>
      <div id="work" class="scroll-mt-28">
        <projects-vue />
      </div>
      <div id="experience" class="scroll-mt-28">
        <experience-vue />
      </div>
      <div id="about" class="scroll-mt-28">
        <about-vue />
      </div>
      <section
        id="contact"
        class="scroll-mt-28 border-t border-line py-16 md:ml-20 md:mr-20 md:py-20"
      >
        <div class="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p class="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary-text">
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
                class="rounded-full bg-dark px-5 py-3 text-sm font-semibold text-light transition hover:bg-primary hover:text-white"
                :href="emailHref"
              >
                {{ $t("contact.email") }}
              </a>
              <a
                class="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary-text"
                :href="site.linkedin"
                target="_blank"
                rel="noreferrer"
              >
                {{ $t("contact.linkedin") }}
              </a>
              <a
                class="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary-text"
                :href="site.github"
                target="_blank"
                rel="noreferrer"
              >
                {{ $t("contact.github") }}
              </a>
              <a
                class="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary-text"
                :href="resumeTr"
                :download="resumeDownloadName('tr')"
              >
                {{ $t("contact.resumeTurkish") }}
              </a>
              <a
                class="rounded-full border border-line bg-surface px-5 py-3 text-sm font-semibold text-dark transition hover:border-primary hover:text-primary-text"
                :href="resumeEn"
                :download="resumeDownloadName('en')"
              >
                {{ $t("contact.resumeEnglish") }}
              </a>
            </div>
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
