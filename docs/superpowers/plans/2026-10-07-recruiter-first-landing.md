# Recruiter-first landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Vue personal site into a recruiter-first Product Engineer hiring page with bilingual copy, experience, and a single email/CV conversion path.

**Architecture:** Keep the existing one-page Vue 3 + Vite + Tailwind app. Extract pure locale/mailto helpers for tests. Replace hero 3D and spinner. Add an Experience section. Rewrite i18n and SEO. Contact facts live in one constants module.

**Tech Stack:** Vue 3, Vite 3, Tailwind 3, existing i18n mixin, Node `node:test` for helpers, Playwright for visual verification.

**Spec:** `docs/superpowers/specs/2026-10-07-recruiter-first-landing-design.md`

## Global Constraints

- Primary conversion is full-time/contract hiring; no freelance pricing or calendar.
- Do not attribute NestJS, .NET Core, or PostgreSQL to the three public project cards.
- Employer name is Intime Info Software Solves; do not invent product names.
- Header solid CTA is Resume; hero solid CTA is mailto.
- No Vue Router. No new backend.
- Do not commit unrelated `package.json` / `package-lock.json` dirt that was already on disk.

## Review Focus

- First visit with `tr` browser language and empty localStorage lands in Turkish.
- Mailto subject is encoded and localized.
- 375px viewport: hero, work cards, experience, contact, header menu.
- Locale toggle updates `document.title`, `html lang`, and meta description.
- Project live/GitHub links still open the existing Vercel and GitHub URLs.

---

### Task 1: Locale and mailto helpers

**Files:**
- Create: `src/i18n/locale.mjs`
- Create: `src/i18n/locale.test.mjs`
- Modify: `src/i18n/index.js`
- Modify: `package.json` (add `"test": "node --test src/i18n/locale.test.mjs"` only)

**Interfaces:**
- Consumes: none
- Produces: `resolveLocale(savedLocale, browserLanguage, locales?)`, `mailtoHref(email, subject)`

- [ ] Write failing tests for saved locale, `tr` browser, default `en`, invalid saved, mailto encoding
- [ ] Run `node --test src/i18n/locale.test.mjs` and confirm FAIL
- [ ] Implement helpers
- [ ] Run tests PASS
- [ ] Wire `resolveLocale` into `getInitialLocale`

### Task 2: Site constants, copy, Experience, hero, SEO

**Files:**
- Create: `src/constants/site.js`
- Create: `src/components/Experience/Experience.vue`
- Modify: `src/i18n/messages.js`, `src/views/Main.vue`, `src/components/index.js`
- Modify: `src/components/Introduce/Introduce.vue`, `src/components/About/About.vue`
- Modify: `src/App.vue`, `index.html`, `src/constants/projectsInfo.js` (titles via i18n only)

**Interfaces:**
- Consumes: `mailtoHref`, `site.email`, `site.github`, `site.linkedin`
- Produces: page sections `#intro` `#work` `#experience` `#about` `#contact`

Implement spec copy, profile card instead of Model, Experience timeline, How I work, contact CTAs, JSON-LD, remove spinner.

### Task 3: Verify

- [ ] `yarn test` (or `node --test ...`)
- [ ] `yarn build`
- [ ] Browser: desktop + 375, EN/TR, mailto, resume, nav, live links
