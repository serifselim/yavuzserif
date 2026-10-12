# Recruiter-first personal site

Date: 2026-10-07

## Intent

Turn the existing Vue portfolio into a hiring page. A recruiter or hiring manager should understand the role, the proof, and the next step within one scroll. Primary conversion is a full-time or contract job. Freelance is out of scope.

Success: someone who lands from LinkedIn or a CV link can email or open the résumé without hunting.

## Audience and positioning

- Audience: recruiters and hiring managers in Turkey and internationally. Default language follows the browser (`tr` or `en`); the visitor can override. SEO copy exists in both languages.
- Role on the site: **Product Engineer** — ships the interface and the feature behind it (React/Vue UI, NestJS or .NET Core, PostgreSQL). Not “Junior Frontend Developer” (that title on the PDF is stale relative to 2022–present production work).
- Seniority signal: production work since 2022 at Intime Info Software Solves, plus the quality of this site (speed, accessibility, i18n). Public repos remain personal/demo projects; they are framed as case studies, never as clones, and never given fake backend stacks.

## Information architecture (single page)

Header: logo, Home, Work, Experience, Contact, EN/TR, **Resume** (only solid header button).

1. **Hero (`#intro`)** — eyebrow, H1, body, primary Email, secondary Resume, ghost Work. Metrics: 3+ yrs · UI + API + data · TR / EN. Right column: profile card (avatar, name, role, Istanbul, stack chips, availability). No 3D model. No 700ms spinner.
2. **Selected work (`#work`)** — three case studies, same card template: category, title, problem → decision → outcome, stack, Live, Code.
3. **Experience (`#experience`)** — Intime Info Software Solves, Frontend / Product Engineer, Istanbul, 2022–Present, 3–4 production bullets. Education line: Yıldız Technical University, Communication Design, 2018–2022.
4. **How I work (`#about`)** — three pillars (Product UI, Feature slice, Team-ready delivery). Honest stack list including NestJS / .NET Core / PostgreSQL. No skill bars. Not in the primary nav.
5. **Contact (`#contact`)** — one job: start a conversation. Mailto with prefilled subject, LinkedIn, GitHub, Resume repeat. Response window: one business day, Istanbul (GMT+3).

## Copy (locked)

### Hero EN

- Eyebrow: `Product Engineer · Open to full-time & contract`
- H1: `I ship the interface and the feature behind it.`
- Body: `I'm Yavuz. I take a product slice from UI to API and data — React/Vue on the surface, NestJS or .NET Core and PostgreSQL underneath — so teams get something they can ship, not a handoff.`

### Hero TR

- Eyebrow: `Product Engineer · Tam zamanlı ve sözleşmeli roller için açığım`
- H1: `Arayüzü ve arkasındaki özelliği birlikte teslim ederim.`
- Body: `Merhaba, ben Yavuz. Bir ürün dilimini arayüzden API ve veriye kadar taşırım — yüzeyde React/Vue, altında NestJS veya .NET Core ve PostgreSQL — ekipler el değiştiren bir mock değil, yayınlanabilir bir parça alır.`

### CTA rules

- Header solid button: Resume PDF.
- Hero solid button: `mailto:yavuzserifoglu@gmail.com?subject=` + localized “Role inquiry — Yavuz Serifoglu”.
- One solid button per viewport cluster. Ghost/outline for the other action.
- Do not invent NestJS/.NET/Postgres on the three public project cards.

### Experience bullets (EN)

Company remains **Intime Info Software Solves** (from the résumé). Do not invent product names or a NestJS stack for that employer.

- Shipped production web interfaces with Vue and React, from layout systems through release.
- Turned product and design intent into UI other engineers can extend.
- Integrated product surfaces with backend APIs and owned the slice past the mock.
- Held the quality bar on responsive behavior, accessibility, and readable frontend architecture.

## Visual and performance

- Keep current Tailwind tokens (primary, accent, dark, muted, line, surface, background).
- Replace Three.js hero with the profile card. `Model.vue` is unused on the page.
- Remove the forced 700ms full-screen spinner in `App.vue`.
- Keyboard focus, 375px layout, working demo links, `prefers-reduced-motion` respected for the project image cycle if easy.

## Technical

- Stack stays Vue 3 + Vite + Tailwind + existing i18n mixin. No Vue Router.
- `resolveLocale(saved, browserLanguage)`: saved `en`/`tr` wins; else `navigator.language` starting with `tr` → `tr`; else `en`. Persist to `localStorage` key `portfolio-locale`. Sync `document.documentElement.lang` and `document.title`.
- `index.html`: title, description, Open Graph, Twitter, `Person` JSON-LD (name, jobTitle, email, sameAs GitHub/LinkedIn, knowsAbout). JS updates title + description + og tags on locale change.
- Contact facts live in `src/constants/site.js` so mailto, footer, and schema do not drift.
- No new backend, form, calendar, or pricing.

## Out of scope

Freelance packages, blog, new demo apps, rewriting the PDF, custom domain, analytics.

## Key decisions

1. Job-seeking one-pager over a freelance landing — user chose full-time/contract as the primary model.
2. Product Engineer, not frontend-only — user asked to include React, Vue, PostgreSQL, NestJS, .NET Core without dropping UI as the lead skill.
3. Public demos stay, clone language goes — public proof is still personal projects; seniority is carried by Intime tenure + this site’s execution.
4. 3D hero removed — the portfolio is itself a frontend sample; load and a11y beat spectacle.
5. Dual-language auto — TR and international hiring are equal; first visit follows the browser.

## Open questions

None. Remaining content gaps (exact Intime product names) stay unnamed on purpose.
