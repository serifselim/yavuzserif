# Dev Runner: Hero Mini-Game Design

Date: 2026-10-12

## Intent

The portfolio should hook visitors with play instead of information overload. The hero's right column (currently a static profile card) becomes a playable endless runner. Visitors, mostly recruiters and developers, should want to "try one more time" and beat their own high score. The game doubles as a skills showcase: collecting tech pickups lights up Yavuz's stack.

Success criteria:
- A visitor can start playing within one input (Space / click / tap) without reading anything.
- Game over to restart takes under 150 ms of input latency, with no confirmation screens.
- The profile identity (name, role, location) stays visible, so the hero still answers "who is this".
- The page remains usable without playing: no sound by default, no scroll hijacking, reduced-motion respected.

Said by the user: gamification, old-school retro feel, endless loop that drives ambition, Dev Runner concept, placed in the hero's right side, "all-in-one interactive arcade terminal" variant.
Assumptions (correct me if wrong): no backend leaderboard (local high score only); no emojis in UI (drawn pixel art and text instead, to avoid a generic AI look); desktop and mobile both supported.

## Scope

In scope: one new component, one pure game-engine module, one audio module, i18n strings (en/tr), tests for the engine, hero integration.

Out of scope: online leaderboard, accounts, multiple characters, music tracks, external assets (images, mp3).

## Architecture

| Unit | File | Responsibility | Depends on |
|---|---|---|---|
| Engine | `src/game/engine.mjs` | Pure, deterministic game logic: state, step(dt), jump, collision, spawning, speed curve, title for score. No DOM, no canvas, no randomness source other than an injected `rng`. | nothing |
| Audio | `src/game/audio.mjs` | Web Audio synth: `jump()`, `pickup()`, `hit()`, mute state. Lazily creates `AudioContext` on first user gesture. | browser Web Audio |
| Renderer + UI | `src/components/Introduce/DevRunner.vue` | Canvas drawing, input listeners, requestAnimationFrame loop, HUD, tech badges, high score persistence. | engine, audio, i18n |
| Hero | `src/components/Introduce/Introduce.vue` | Replaces the right-column profile card with `<dev-runner-vue />`. | DevRunner |

The `.mjs` extension matches the existing `src/i18n/locale.mjs` pattern so `node --test` can import the engine directly.

## Engine (`engine.mjs`)

Logical world: 640 x 360 units. Ground line at y = 300. The canvas scales to its container via CSS and a devicePixelRatio-aware backing store; the engine never sees pixel sizes.

State: `{ phase: "idle" | "running" | "over", player: { y, vy, onGround }, obstacles[], pickups[], speed, distance, score, collected: Set<techId>, nextSpawnIn }`.

Rules:
- Phases: `idle` (waiting, idle animation) → `running` on first jump input → `over` on obstacle collision → `running` immediately on next jump input (state reset, no intermediate screen).
- Physics: gravity 2200 u/s², jump impulse -780 u/s, jump only when `onGround`. Variable height: releasing the key early cuts upward velocity by 50% (gives control, avoids floaty feel).
- Speed: starts at 260 u/s, `speed = min(260 + distance * 0.035, 720)`. Smooth, capped so the game stays winnable.
- Score: `floor(distance / 10)` plus 50 per pickup, with a combo multiplier: consecutive pickups with no more than 3 s between them raise the multiplier by 1 up to x4 (pickup value = 50 * multiplier); the multiplier resets after 3 s without a pickup or on game over.
- Obstacles: three kinds, `bug` (low, jump over), `conflict` (tall, jump over), `notfound` (wide, jump over). Spawn gap is randomized by `rng` between a minimum reaction distance and a larger one; the minimum gap is always at least `speed * 0.55 s` plus the jump air time distance, so every layout is survivable.
- Pickups: spawned at jumpable heights between obstacles, rotating through `TECH = [vue, react, nestjs, postgres, typescript]`. Collecting a tech marks it in `collected` (for the badge row).
- Collision: axis-aligned boxes with a 4-unit forgiving inset on both player and obstacles.
- Titles by score: 0–149 "Junior Bug Fixer", 150–399 "Full Stack Mid Dev", 400+ "Senior Architecture Wizard" (en) and Turkish equivalents "Çaylak Bug Avcısı", "Full Stack Orta Seviye", "Kıdemli Mimari Sihirbazı".
- API: `createGame(rng = Math.random)`, `jump(state)`, `releaseJump(state)`, `step(state, dtSeconds)` (dt clamped to 50 ms to survive tab switches), `titleForScore(score)`.

## Renderer and UI (`DevRunner.vue`)

Layout (inside the existing right column, same card footprint, `rounded-2xl border border-line bg-surface`):
1. Top bar: avatar thumbnail (existing `avatar.jpg`, 32 px, round), name (`site.name`), role line, and a sound toggle button (`aria-pressed`, default off).
2. Canvas (16:9). Sky `#f8fafc`, ground and grid lines `#e2e8f0` / `#0f172a` at low opacity, player and UI accents `#2563eb`, hazards `#ea580c` (accent) and dark `#0f172a`. Player is a small pixel figure drawn with `fillRect` run frames (2 alternating frames) plus a jump frame. Obstacles are drawn as pixel blocks with their label (`BUG`, `404`, `CONFLICT`) in the mono font. Pickups are small diamonds with the tech initials.
3. Idle overlay on the canvas: "Press Space or tap to run" (en) / "Başlamak için Space veya dokun" (tr), pulsing subtly.
4. Game over overlay: score, title, best score, "Space / tap to retry". Screen shake of 6 px for 180 ms on hit.
5. Bottom row: score, best, multiplier (when above x1), and the tech badge row (five badges: dim until collected, `bg-primary text-light` when lit). Profile location and focus line (`hero.profileLocation`, `hero.profileFocus`) sit in a compact footer so no existing identity text is lost.

Input:
- `Space` and `ArrowUp` while the canvas container is focused or the game is running and the page has no other focused input; `keydown` calls `preventDefault` only for Space/ArrowUp while the game is the active target (so page scrolling by Space elsewhere is not hijacked). The game container has `tabindex="0"` and is focused on click/tap.
- `pointerdown` on the canvas jumps; `pointerup` releases.
- Loop runs only while the component is in the viewport (IntersectionObserver) and the tab is visible; otherwise it pauses (battery and fairness).

Persistence: best score in `localStorage` key `portfolio-runner-best`, wrapped in try/catch (private mode safe).

Accessibility:
- Canvas has `role="img"` with an `aria-label` describing the game; controls described in a visible text hint.
- `prefers-reduced-motion: reduce`: no screen shake, no idle pulse; the game does not auto-start (it never auto-starts anyway) and a visible note explains it still needs input.
- Sound toggle is a real `<button>`; sound is off by default.

## Audio (`audio.mjs`)

Web Audio oscillators only, no files: jump = short square-wave rising blip (≈ 120 ms), pickup = two-step triangle chirp, hit = noise burst with downward square sweep. `AudioContext` is created on the first toggle-on gesture. If `AudioContext` is missing, the toggle is hidden.

## i18n

Add `game` namespace to both `en` and `tr` in `src/i18n/messages.js`: `ariaLabel`, `idleHint`, `retryHint`, `score`, `best`, `combo`, `sound`, `soundOn`, `soundOff`, `reducedMotionNote`, `titles` (three entries), `obstacles` (labels). Existing `hero.profile*` strings remain in use.

## Testing

`src/game/engine.test.mjs`, run by extending the `test` script to `node --test src/i18n/locale.test.mjs src/game/engine.test.mjs`:
- jump only from ground; variable-height cut works
- gravity returns player to ground in expected time
- speed grows with distance and never exceeds 720
- collision detects a hit and ignores a clear jump (with inset)
- generated layouts are survivable: with a seeded rng over many seeds, simulating a perfect-jump bot never dies in the first 60 s of game time
- pickup scoring and combo multiplier (rise, cap at x4, reset after 3 s)
- `step` clamps large dt
- `titleForScore` boundaries (149/150, 399/400)
- restart resets state but keeps nothing stale

Manual verification (documented in the plan): `npm run build` exit 0; open dev server at port 1997, play on desktop (keyboard, click) and a narrow mobile viewport (tap); toggle sound; check reduced-motion; switch tab and return (game paused, no jump in physics); confirm TR/EN strings.

## Risks and decisions

- Cross-platform input conflicts (Space scrolls page): handled by only intercepting while the game container is focused or active.
- Performance: single canvas, no allocations in the hot loop beyond small arrays, capped at 60 FPS via rAF, paused off-screen.
- The 3D `Model.vue` component is unused by the hero and untouched.
- Hero height: the card keeps roughly the same footprint so the left column layout does not shift.
