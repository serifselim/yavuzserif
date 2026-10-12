# Dev Runner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's static profile card with a playable retro endless runner ("Dev Runner") that lights up Yavuz's tech stack as the visitor collects pickups.

**Architecture:** A pure, DOM-free game engine (`engine.mjs`) holds all rules and is unit-tested with `node --test`, including a bot that proves generated layouts are always survivable. Small helper modules handle high-score storage and Web Audio sound. A canvas drawing module (`draw.mjs`) renders engine state; `DevRunner.vue` owns lifecycle, input, HUD and overlays, and is mounted in `Introduce.vue`'s right column.

**Tech Stack:** Vue 3.2 (Composition API `setup()` inside a plain `<script>`), Tailwind 3, Vite 3, Canvas 2D, Web Audio API, `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-12-dev-runner-design.md`

**Deviations from the spec (decided while planning, all intentional):**
- Canvas drawing lives in `src/game/draw.mjs` instead of inside the Vue file, to keep the component small.
- High-score storage lives in `src/game/best.mjs` so its failure modes are unit-testable.
- Obstacle labels (`BUG`, `CONFLICT`, `404`) and pickup symbols are universal code terms drawn on the canvas; they are not in i18n. All other visible strings are in i18n (en + tr), plus `game.title` and `game.gameOver`.
- Touch input: on touch, starting or restarting a run happens on `pointerup` so a scroll gesture over the card does not start a run; jumping while running happens on `pointerdown`. The canvas allows vertical page panning while idle or over, and blocks it only while running.
- `stack` computed and the `site` import in `Introduce.vue` become unused and are removed. `hero.stack` stays in `messages.js` untouched.

## Global Constraints

- World is 640 x 360 logical units; ground at y = 300; player x = 80, 28 x 36.
- Gravity 2200 u/s², jump velocity 780 u/s, early release multiplies upward velocity by 0.5.
- Speed = `min(260 + distance * 0.035, 720)` u/s.
- Collision inset 4 units; `dt` clamped to 50 ms; restart lockout after a hit 0.12 s.
- Combo window 3 s, multiplier cap x4, pickup value 50 x multiplier.
- Palette (already applied project-wide): background `#f8fafc`, ink `#0f172a`, primary `#2563eb`, accent `#ea580c`, line `#e2e8f0`.
- No emojis anywhere in the UI. No external assets (images, audio files). Sound is off by default.
- Player-facing strings exist in both `en` and `tr` in `src/i18n/messages.js`.
- Canvas is drawn at logical coordinates; backing store scaled by `min(devicePixelRatio, 2)`.
- The working tree already contains unrelated uncommitted work (palette, projects). **Never use `git add -A` or `git commit -a`.** Stage and commit only the files named in each task.
- Work on the current branch (`feat/recruiter-first-landing`); do not create a worktree (it would lose the uncommitted work).
- Tests run with `npm test`; the final check also needs `npm run build` to exit 0.

## Review Focus

- `localStorage` blocked, throwing, or holding garbage (`"abc"`, `"-5"`, `"3.7"`): the game still runs and best score is 0. Pinned by Task 2 tests.
- Tab hidden for minutes then returned: no teleport, no instant death. Pinned by the Task 1 dt-clamp test; loop pause checked manually in Task 6.
- Mashing Space at the moment of death must not skip the game-over screen. Pinned by the Task 1 restart-lockout test.
- Browser without Web Audio: no errors, sound button hidden. Pinned by Task 3 tests (`supported === false`).
- Holding Space (key repeat) must not chain jumps or scroll the page; touch scroll gesture over the card must not start a run. Owned by Task 6 (`e.repeat` guard, touch-on-pointerup); verified by the manual checklist there.

---

### Task 1: Game engine

**Files:**
- Create: `src/game/engine.mjs`
- Create: `src/game/engine.test.mjs`
- Modify: `package.json:8` (`test` script)

**Interfaces:**
- Consumes: nothing.
- Produces (all named exports of `src/game/engine.mjs`):
  - constants: `WORLD {width,height,ground}`, `PLAYER {x,width,height}`, `PHYSICS`, `SPEED`, `COMBO`, `INSET`, `SPAWN_X`, `MAX_DT`, `OVER_LOCKOUT`, `PICKUP_SIZE`, `PICKUP_HEIGHTS`, `TECH` (`["vue","react","nestjs","postgres","typescript"]`), `OBSTACLE_KINDS` (`bug`, `conflict`, `notfound` → `{width,height}`)
  - `createGame(rng = Math.random)` → state `{ rng, phase: "idle"|"running"|"over", player:{y,vy,onGround,cut}, obstacles:[{kind,x,width,height}], pickups:[{tech,x,y}], speed, distance, bonus, score, combo:{multiplier,timer}, collected:Set<string>, techIndex, gapLeft, runTime, overFor }`
  - `jump(state)` → `boolean` (true when a jump actually started; starts idle games, restarts over games after the lockout)
  - `releaseJump(state)` → `void`
  - `step(state, dtSeconds)` → array of event strings (`"pickup"`, `"hit"`), a frozen empty array when none
  - `speedForDistance(distance)` → number
  - `titleForScore(score)` → `"junior" | "mid" | "senior"`

- [ ] **Step 1: Write the failing test**

Create `src/game/engine.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_DT,
  PLAYER,
  SPEED,
  createGame,
  jump,
  releaseJump,
  speedForDistance,
  step,
  titleForScore,
} from "./engine.mjs";

const seeded = (seed) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A running game on flat ground with spawning switched off.
const running = () => {
  const s = createGame(seeded(1));
  s.phase = "running";
  s.gapLeft = 1e9;
  return s;
};

const hitObstacle = () => ({ kind: "bug", x: PLAYER.x, width: 24, height: 24 });

test("the first jump starts the run and leaves the ground", () => {
  const s = createGame(seeded(1));
  assert.equal(s.phase, "idle");
  assert.equal(jump(s), true);
  assert.equal(s.phase, "running");
  assert.equal(s.player.onGround, false);
  assert.equal(jump(s), false);
});

test("an idle game does not move", () => {
  const s = createGame(seeded(1));
  step(s, 1);
  assert.equal(s.distance, 0);
  assert.equal(s.phase, "idle");
});

test("a jump lasts about 0.71 s and peaks near 138 units", () => {
  const s = running();
  jump(s);
  let t = 0;
  let peak = 0;
  while (!s.player.onGround && t < 2) {
    step(s, 1 / 120);
    t += 1 / 120;
    peak = Math.max(peak, s.player.y);
  }
  assert.ok(Math.abs(t - 0.709) < 0.03, `air time was ${t}`);
  assert.ok(Math.abs(peak - 138) < 5, `peak was ${peak}`);
});

test("releasing the jump early gives a lower jump", () => {
  const full = running();
  const cut = running();
  jump(full);
  jump(cut);
  let fullPeak = 0;
  let cutPeak = 0;
  for (let i = 0; i < 120; i++) {
    if (i === 3) releaseJump(cut);
    step(full, 1 / 120);
    step(cut, 1 / 120);
    fullPeak = Math.max(fullPeak, full.player.y);
    cutPeak = Math.max(cutPeak, cut.player.y);
  }
  assert.ok(cutPeak < fullPeak * 0.5, `cut ${cutPeak} vs full ${fullPeak}`);
});

test("speed grows with distance and never exceeds the cap", () => {
  assert.equal(speedForDistance(0), SPEED.start);
  assert.ok(speedForDistance(1000) > speedForDistance(500));
  assert.equal(speedForDistance(1e7), SPEED.max);
});

test("running into an obstacle ends the run", () => {
  const s = running();
  s.obstacles.push(hitObstacle());
  const events = step(s, 1 / 60);
  assert.equal(s.phase, "over");
  assert.ok(events.includes("hit"));
});

test("an obstacle under a jumping player is cleared", () => {
  const s = running();
  s.player.y = 100;
  s.player.onGround = false;
  s.player.vy = 0;
  s.obstacles.push({ kind: "conflict", x: PLAYER.x, width: 28, height: 48 });
  step(s, 1 / 60);
  assert.equal(s.phase, "running");
});

test("a graze inside the 4 unit inset does not count as a hit", () => {
  const s = running();
  s.obstacles.push({ kind: "bug", x: PLAYER.x + 3 - 24, width: 24, height: 24 });
  step(s, 1 / 60);
  assert.equal(s.phase, "running");
});

const grab = (s) => {
  s.pickups.push({ tech: "vue", x: PLAYER.x, y: 0 });
  step(s, 1 / 60);
};

test("pickups score 50, 100, 150, 200 and then stay at x4", () => {
  const s = running();
  grab(s);
  assert.equal(s.bonus, 50);
  grab(s);
  assert.equal(s.bonus, 150);
  grab(s);
  assert.equal(s.bonus, 300);
  grab(s);
  assert.equal(s.bonus, 500);
  grab(s);
  assert.equal(s.bonus, 700);
  assert.equal(s.combo.multiplier, 4);
  assert.ok(s.collected.has("vue"));
  assert.ok(s.score >= 700);
});

test("the combo resets after 3 seconds without a pickup", () => {
  const s = running();
  grab(s);
  grab(s);
  assert.equal(s.combo.multiplier, 2);
  for (let i = 0; i < 190; i++) step(s, 1 / 60);
  assert.equal(s.combo.multiplier, 1);
  const before = s.bonus;
  grab(s);
  assert.equal(s.bonus - before, 50);
});

test("a huge frame gap is clamped so a tab switch cannot teleport the world", () => {
  const s = running();
  const before = s.distance;
  step(s, 5);
  assert.ok(s.distance - before <= SPEED.start * MAX_DT + 1e-9);
  step(s, -1);
  assert.ok(Number.isFinite(s.distance));
});

test("title boundaries", () => {
  assert.equal(titleForScore(0), "junior");
  assert.equal(titleForScore(149), "junior");
  assert.equal(titleForScore(150), "mid");
  assert.equal(titleForScore(399), "mid");
  assert.equal(titleForScore(400), "senior");
});

test("restart is blocked briefly after a hit, then resets everything", () => {
  const s = running();
  s.bonus = 300;
  s.collected.add("react");
  s.obstacles.push(hitObstacle());
  step(s, 1 / 60);
  assert.equal(s.phase, "over");
  assert.equal(jump(s), false);
  for (let i = 0; i < 10; i++) step(s, 1 / 60);
  assert.equal(jump(s), true);
  assert.equal(s.phase, "running");
  assert.equal(s.score, 0);
  assert.equal(s.bonus, 0);
  assert.equal(s.obstacles.length, 0);
  assert.equal(s.collected.size, 0);
  assert.equal(s.overFor, 0);
});

// Jumps when the next obstacle is 0.2 s away, never touches anything else.
const botFrame = (s) => {
  const ahead = s.obstacles.find((o) => o.x + o.width > PLAYER.x);
  if (
    ahead &&
    s.player.onGround &&
    ahead.x - (PLAYER.x + PLAYER.width) <= s.speed * 0.2
  ) {
    jump(s);
  }
};

test("a bot that jumps on time survives 60 s on every seed (layouts are fair)", () => {
  for (let seed = 1; seed <= 60; seed++) {
    const s = createGame(seeded(seed));
    jump(s);
    for (let f = 0; f < 3600; f++) {
      botFrame(s);
      step(s, 1 / 60);
      assert.equal(s.phase, "running", `seed ${seed} died at frame ${f}, speed ${s.speed}`);
    }
    assert.ok(s.speed >= SPEED.max - 1, `seed ${seed} never reached top speed`);
  }
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/game/engine.test.mjs`
Expected: FAIL with `Cannot find module './engine.mjs'` (or `ERR_MODULE_NOT_FOUND`).

- [ ] **Step 3: Write the implementation**

Create `src/game/engine.mjs`:

```js
export const WORLD = Object.freeze({ width: 640, height: 360, ground: 300 });
export const PLAYER = Object.freeze({ x: 80, width: 28, height: 36 });
export const PHYSICS = Object.freeze({ gravity: 2200, jumpVelocity: 780, jumpCut: 0.5 });
export const SPEED = Object.freeze({ start: 260, max: 720, perDistance: 0.035 });
export const COMBO = Object.freeze({ window: 3, max: 4, pickupValue: 50 });
export const INSET = 4;
export const SPAWN_X = WORLD.width + 40;
export const MAX_DT = 0.05;
export const OVER_LOCKOUT = 0.12;
export const PICKUP_SIZE = 20;
export const PICKUP_HEIGHTS = Object.freeze([8, 70, 110]);
export const TECH = Object.freeze(["vue", "react", "nestjs", "postgres", "typescript"]);
export const OBSTACLE_KINDS = Object.freeze({
  bug: Object.freeze({ width: 24, height: 24 }),
  conflict: Object.freeze({ width: 28, height: 48 }),
  notfound: Object.freeze({ width: 52, height: 28 }),
});

const KIND_IDS = Object.keys(OBSTACLE_KINDS);
const EMPTY_EVENTS = Object.freeze([]);

export function createGame(rng = Math.random) {
  return {
    rng,
    phase: "idle",
    player: { y: 0, vy: 0, onGround: true, cut: false },
    obstacles: [],
    pickups: [],
    speed: SPEED.start,
    distance: 0,
    bonus: 0,
    score: 0,
    combo: { multiplier: 1, timer: 0 },
    collected: new Set(),
    techIndex: 0,
    gapLeft: 0,
    runTime: 0,
    overFor: 0,
  };
}

export function speedForDistance(distance) {
  return Math.min(SPEED.start + distance * SPEED.perDistance, SPEED.max);
}

export function titleForScore(score) {
  if (score >= 400) return "senior";
  if (score >= 150) return "mid";
  return "junior";
}

export function jump(state) {
  if (state.phase === "over") {
    if (state.overFor < OVER_LOCKOUT) return false;
    Object.assign(state, createGame(state.rng));
  }
  if (state.phase === "idle") state.phase = "running";
  if (!state.player.onGround) return false;
  state.player.vy = PHYSICS.jumpVelocity;
  state.player.onGround = false;
  state.player.cut = false;
  return true;
}

export function releaseJump(state) {
  const p = state.player;
  if (state.phase === "running" && !p.onGround && p.vy > 0 && !p.cut) {
    p.vy *= PHYSICS.jumpCut;
    p.cut = true;
  }
}

const playerBox = (p) => ({
  left: PLAYER.x + INSET,
  right: PLAYER.x + PLAYER.width - INSET,
  bottom: p.y + INSET,
  top: p.y + PLAYER.height - INSET,
});
const obstacleBox = (o) => ({
  left: o.x + INSET,
  right: o.x + o.width - INSET,
  bottom: 0,
  top: o.height - INSET,
});
const pickupBox = (k) => ({
  left: k.x,
  right: k.x + PICKUP_SIZE,
  bottom: k.y,
  top: k.y + PICKUP_SIZE,
});
const overlaps = (a, b) =>
  a.left < b.right && a.right > b.left && a.bottom < b.top && a.top > b.bottom;

// gapLeft is the distance until the next obstacle's left edge must appear.
// Gap between obstacles is always >= 0.9 s of travel, which is longer than a
// jump (0.71 s), so every generated layout is survivable.
function spawn(state, travel) {
  state.gapLeft -= travel;
  if (state.gapLeft > 0) return;

  const kind = KIND_IDS[Math.floor(state.rng() * KIND_IDS.length)];
  const { width, height } = OBSTACLE_KINDS[kind];
  const x = SPAWN_X + state.gapLeft;
  state.obstacles.push({ kind, x, width, height });

  const gap = (0.9 + state.rng() * 0.7) * state.speed;
  state.gapLeft = width + gap;

  if (state.rng() < 0.7) {
    const level = Math.floor(state.rng() * PICKUP_HEIGHTS.length);
    state.pickups.push({
      tech: TECH[state.techIndex % TECH.length],
      x: x + width + gap / 2 - PICKUP_SIZE / 2,
      y: PICKUP_HEIGHTS[level],
    });
    state.techIndex += 1;
  }
}

export function step(state, dtRaw) {
  const dt = Math.min(Math.max(dtRaw, 0), MAX_DT);
  if (state.phase === "over") {
    state.overFor += dt;
    return EMPTY_EVENTS;
  }
  if (state.phase !== "running") return EMPTY_EVENTS;

  state.runTime += dt;
  state.speed = speedForDistance(state.distance);
  const travel = state.speed * dt;
  state.distance += travel;

  const p = state.player;
  if (!p.onGround) {
    p.vy -= PHYSICS.gravity * dt;
    p.y += p.vy * dt;
    if (p.y <= 0) {
      p.y = 0;
      p.vy = 0;
      p.onGround = true;
    }
  }

  for (const o of state.obstacles) o.x -= travel;
  for (const k of state.pickups) k.x -= travel;
  state.obstacles = state.obstacles.filter((o) => o.x + o.width > -20);
  state.pickups = state.pickups.filter((k) => k.x + PICKUP_SIZE > -20);
  spawn(state, travel);

  state.combo.timer = Math.max(0, state.combo.timer - dt);
  if (state.combo.timer === 0) state.combo.multiplier = 1;

  const events = [];
  const body = playerBox(p);

  for (let i = state.pickups.length - 1; i >= 0; i--) {
    const k = state.pickups[i];
    if (!overlaps(body, pickupBox(k))) continue;
    state.pickups.splice(i, 1);
    state.combo.multiplier =
      state.combo.timer > 0 ? Math.min(COMBO.max, state.combo.multiplier + 1) : 1;
    state.combo.timer = COMBO.window;
    state.bonus += COMBO.pickupValue * state.combo.multiplier;
    state.collected.add(k.tech);
    events.push("pickup");
  }

  for (const o of state.obstacles) {
    if (overlaps(body, obstacleBox(o))) {
      state.phase = "over";
      state.overFor = 0;
      state.combo.multiplier = 1;
      state.combo.timer = 0;
      events.push("hit");
      break;
    }
  }

  state.score = Math.floor(state.distance / 10) + state.bonus;
  return events.length ? events : EMPTY_EVENTS;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/game/engine.test.mjs`
Expected: PASS, 14 tests, 0 failures. If the bot test fails, the message names the seed and frame. Do not loosen the test: investigate whether the gap factor `0.9` in `spawn` is too small for the failing speed and raise it.

- [ ] **Step 5: Add the test file to the npm script**

In `package.json`, change the `test` script to:

```json
"test": "node --test src/i18n/locale.test.mjs src/game/engine.test.mjs"
```

Run: `npm test`
Expected: all tests pass (5 existing + 14 new).

- [ ] **Step 6: Commit**

```bash
git add src/game/engine.mjs src/game/engine.test.mjs package.json
git commit -m "feat(game): add pure Dev Runner engine with fairness test" -- src/game/engine.mjs src/game/engine.test.mjs package.json
```

---

### Task 2: High-score storage helpers

**Files:**
- Create: `src/game/best.mjs`
- Create: `src/game/best.test.mjs`
- Modify: `package.json:8` (`test` script)

**Interfaces:**
- Consumes: nothing.
- Produces: `BEST_KEY` (`"portfolio-runner-best"`), `loadBest(storage)` → non-negative integer (0 on missing, throwing, or invalid data), `saveBest(storage, value)` → boolean (false when storage is missing or throws).

- [ ] **Step 1: Write the failing test**

Create `src/game/best.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { BEST_KEY, loadBest, saveBest } from "./best.mjs";

const store = (value) => ({
  data: value === undefined ? {} : { [BEST_KEY]: value },
  getItem(key) {
    return key in this.data ? this.data[key] : null;
  },
  setItem(key, v) {
    this.data[key] = v;
  },
});

test("a missing or empty value is 0", () => {
  assert.equal(loadBest(store()), 0);
  assert.equal(loadBest(store("")), 0);
  assert.equal(loadBest(undefined), 0);
});

test("a stored whole number is read back", () => {
  assert.equal(loadBest(store("120")), 120);
});

test("garbage, negative and fractional values are ignored", () => {
  assert.equal(loadBest(store("abc")), 0);
  assert.equal(loadBest(store("-5")), 0);
  assert.equal(loadBest(store("3.7")), 0);
  assert.equal(loadBest(store("Infinity")), 0);
});

test("a storage that throws never breaks the game", () => {
  const broken = {
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("denied");
    },
  };
  assert.equal(loadBest(broken), 0);
  assert.equal(saveBest(broken, 50), false);
  assert.equal(saveBest(undefined, 50), false);
});

test("saving writes a whole number", () => {
  const s = store();
  assert.equal(saveBest(s, 99.9), true);
  assert.equal(s.data[BEST_KEY], "99");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/game/best.test.mjs`
Expected: FAIL with `Cannot find module './best.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `src/game/best.mjs`:

```js
export const BEST_KEY = "portfolio-runner-best";

export function loadBest(storage) {
  if (!storage) return 0;
  try {
    const value = Number(storage.getItem(BEST_KEY));
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function saveBest(storage, value) {
  if (!storage) return false;
  try {
    storage.setItem(BEST_KEY, String(Math.floor(value)));
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/game/best.test.mjs`
Expected: PASS, 5 tests.

- [ ] **Step 5: Add to the npm script and run everything**

Change `package.json` `test` to:

```json
"test": "node --test src/i18n/locale.test.mjs src/game/engine.test.mjs src/game/best.test.mjs"
```

Run: `npm test`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/game/best.mjs src/game/best.test.mjs package.json
git commit -m "feat(game): add safe high-score storage helpers" -- src/game/best.mjs src/game/best.test.mjs package.json
```

---

### Task 3: Retro audio synth

**Files:**
- Create: `src/game/audio.mjs`
- Create: `src/game/audio.test.mjs`
- Modify: `package.json:8` (`test` script)

**Interfaces:**
- Consumes: nothing (takes an optional window-like object; defaults to the real `window`).
- Produces: `createAudio(win?)` → `{ supported: boolean, enabled: boolean (getter), setEnabled(value) → boolean (resulting state), jump(), pickup(), hit() }`. All three sound methods are no-ops unless enabled. No `AudioContext` is created until `setEnabled(true)`.

- [ ] **Step 1: Write the failing test**

Create `src/game/audio.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { createAudio } from "./audio.mjs";

function fakeWindow() {
  const log = { contexts: 0, oscillators: 0, sources: 0 };
  class Param {
    setValueAtTime() {}
    exponentialRampToValueAtTime() {}
  }
  class FakeContext {
    constructor() {
      log.contexts++;
      this.currentTime = 0;
      this.state = "running";
      this.destination = {};
      this.sampleRate = 8000;
    }
    resume() {}
    createOscillator() {
      log.oscillators++;
      return { type: "", frequency: new Param(), connect() {}, start() {}, stop() {} };
    }
    createGain() {
      return { gain: new Param(), connect() {} };
    }
    createBuffer(channels, length) {
      return { getChannelData: () => new Float32Array(length) };
    }
    createBufferSource() {
      log.sources++;
      return { buffer: null, connect() {}, start() {} };
    }
  }
  return { win: { AudioContext: FakeContext }, log };
}

test("without Web Audio the module reports unsupported and stays silent", () => {
  const audio = createAudio({});
  assert.equal(audio.supported, false);
  assert.equal(audio.setEnabled(true), false);
  assert.doesNotThrow(() => {
    audio.jump();
    audio.pickup();
    audio.hit();
  });
});

test("it is muted by default and creates no audio context", () => {
  const { win, log } = fakeWindow();
  const audio = createAudio(win);
  audio.jump();
  audio.hit();
  assert.equal(audio.enabled, false);
  assert.equal(log.contexts, 0);
});

test("enabling creates one context and sounds play", () => {
  const { win, log } = fakeWindow();
  const audio = createAudio(win);
  assert.equal(audio.setEnabled(true), true);
  assert.equal(log.contexts, 1);
  audio.jump();
  assert.equal(log.oscillators, 1);
  audio.pickup();
  assert.equal(log.oscillators, 3);
  audio.hit();
  assert.equal(log.oscillators, 4);
  assert.equal(log.sources, 1);
  assert.equal(log.contexts, 1);
});

test("muting again stops all sounds", () => {
  const { win, log } = fakeWindow();
  const audio = createAudio(win);
  audio.setEnabled(true);
  audio.setEnabled(false);
  audio.jump();
  audio.pickup();
  audio.hit();
  assert.equal(log.oscillators, 0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test src/game/audio.test.mjs`
Expected: FAIL with `Cannot find module './audio.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `src/game/audio.mjs`:

```js
export function createAudio(win = typeof window === "undefined" ? undefined : window) {
  const Ctx = win ? win.AudioContext || win.webkitAudioContext : undefined;
  let ctx = null;
  let enabled = false;

  const ensure = () => {
    if (!ctx) ctx = new Ctx();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const tone = (type, from, to, duration, volume, delay = 0) => {
    const c = ensure();
    const start = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(start);
    osc.stop(start + duration);
  };

  const noise = (duration, volume) => {
    const c = ensure();
    const length = Math.floor(c.sampleRate * duration);
    const buffer = c.createBuffer(1, length, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const source = c.createBufferSource();
    const gain = c.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    source.connect(gain);
    gain.connect(c.destination);
    source.start();
  };

  const play = (fn) => {
    if (enabled && Ctx) fn();
  };

  return {
    supported: Boolean(Ctx),
    get enabled() {
      return enabled;
    },
    setEnabled(value) {
      enabled = Boolean(value) && Boolean(Ctx);
      if (enabled) ensure();
      return enabled;
    },
    jump: () => play(() => tone("square", 280, 620, 0.12, 0.04)),
    pickup: () =>
      play(() => {
        tone("triangle", 660, 660, 0.07, 0.05);
        tone("triangle", 990, 990, 0.09, 0.05, 0.07);
      }),
    hit: () =>
      play(() => {
        noise(0.22, 0.06);
        tone("square", 180, 45, 0.28, 0.05);
      }),
  };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --test src/game/audio.test.mjs`
Expected: PASS, 4 tests.

- [ ] **Step 5: Add to the npm script and run everything**

Change `package.json` `test` to:

```json
"test": "node --test src/i18n/locale.test.mjs src/game/engine.test.mjs src/game/best.test.mjs src/game/audio.test.mjs"
```

Run: `npm test`
Expected: all pass (5 + 14 + 5 + 4).

- [ ] **Step 6: Commit**

```bash
git add src/game/audio.mjs src/game/audio.test.mjs package.json
git commit -m "feat(game): add Web Audio retro sound synth" -- src/game/audio.mjs src/game/audio.test.mjs package.json
```

---

### Task 4: i18n strings (en + tr)

**Files:**
- Modify: `src/i18n/messages.js` (insert a `game` block before `contact:` in both `en` and `tr`)

**Interfaces:**
- Consumes: nothing.
- Produces: translation paths used by Task 6 via `$t(...)`: `game.title`, `game.ariaLabel`, `game.idleHint`, `game.retryHint`, `game.gameOver`, `game.score`, `game.best`, `game.combo`, `game.soundOn`, `game.soundOff`, `game.reducedMotionNote`, `game.techLabel`, `game.titles.junior`, `game.titles.mid`, `game.titles.senior`.

- [ ] **Step 1: Insert the English block**

In `src/i18n/messages.js`, find this unique anchor (end of `en.projects`, start of `en.contact`):

```js
    contact: {
      eyebrow: "Contact",
```

Replace it with:

```js
    game: {
      title: "Dev Runner",
      ariaLabel:
        "Dev Runner mini game. Press Space or Arrow Up, or tap, to jump over bugs and collect tech.",
      idleHint: "Press Space or tap to run",
      retryHint: "Space or tap to retry",
      gameOver: "Game over",
      score: "Score",
      best: "Best",
      combo: "Combo",
      soundOn: "Sound on",
      soundOff: "Sound off",
      reducedMotionNote:
        "Reduced motion is on. Animations are minimal; the game still waits for your input.",
      techLabel: "Tech collected",
      titles: {
        junior: "Junior Bug Fixer",
        mid: "Full Stack Mid Dev",
        senior: "Senior Architecture Wizard",
      },
    },
    contact: {
      eyebrow: "Contact",
```

- [ ] **Step 2: Insert the Turkish block**

Find this unique anchor:

```js
    contact: {
      eyebrow: "İletişim",
```

Replace it with:

```js
    game: {
      title: "Dev Runner",
      ariaLabel:
        "Dev Runner mini oyunu. Hataların üzerinden atlamak ve teknolojileri toplamak için Space ya da Yukarı Ok'a bas veya dokun.",
      idleHint: "Başlamak için Space'e bas veya dokun",
      retryHint: "Tekrar için Space'e bas veya dokun",
      gameOver: "Oyun bitti",
      score: "Skor",
      best: "Rekor",
      combo: "Kombo",
      soundOn: "Ses açık",
      soundOff: "Ses kapalı",
      reducedMotionNote:
        "Hareket azaltma açık. Animasyonlar minimal; oyun yine de girdini bekler.",
      techLabel: "Toplanan teknolojiler",
      titles: {
        junior: "Çaylak Bug Avcısı",
        mid: "Full Stack Orta Seviye",
        senior: "Kıdemli Mimari Sihirbazı",
      },
    },
    contact: {
      eyebrow: "İletişim",
```

- [ ] **Step 3: Verify both languages have the same keys and the build still parses**

Run:

```bash
Select-String -Path src/i18n/messages.js -Pattern "reducedMotionNote|techLabel|senior:" | Measure-Object
npm run build
```

Expected: the count is 6 (three lines per language) and the build exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/i18n/messages.js
git commit -m "feat(i18n): add Dev Runner strings in English and Turkish" -- src/i18n/messages.js
```

---

### Task 5: Canvas renderer

**Files:**
- Create: `src/game/draw.mjs`

**Interfaces:**
- Consumes: from `./engine.mjs`: `PICKUP_SIZE`, `PLAYER`, `WORLD`; the engine state shape from Task 1 (`state.phase`, `state.player`, `state.obstacles`, `state.pickups`, `state.distance`).
- Produces: `draw(ctx, state, timeSeconds, options?)` where `options = { reducedMotion?: boolean, shakeX?: number, shakeY?: number }`. Draws one full frame at logical coordinates (assumes the context is already scaled by devicePixelRatio). No DOM access.

- [ ] **Step 1: Write the renderer**

Create `src/game/draw.mjs`:

```js
import { PICKUP_SIZE, PLAYER, WORLD } from "./engine.mjs";

const COLORS = {
  sky: "#f8fafc",
  band: "#edf2f7",
  grid: "#e2e8f0",
  tick: "#cbd5e1",
  ink: "#0f172a",
  primary: "#2563eb",
  accent: "#ea580c",
  paper: "#ffffff",
};
const MONO = '"Cascadia Code", SFMono-Regular, Consolas, monospace';
const LABELS = { bug: "BUG", conflict: "CONFLICT", notfound: "404" };
const SYMBOLS = { vue: "V", react: "R", nestjs: "N", postgres: "P", typescript: "TS" };

function drawBackdrop(ctx, distance) {
  ctx.fillStyle = COLORS.grid;
  const offset = (distance * 0.35) % 40;
  for (let x = -offset; x < WORLD.width; x += 40) {
    ctx.fillRect(Math.round(x), 0, 1, WORLD.ground);
  }
  for (let y = 20; y < WORLD.ground; y += 40) {
    ctx.fillRect(0, y, WORLD.width, 1);
  }
}

function drawGround(ctx, distance) {
  ctx.fillStyle = COLORS.band;
  ctx.fillRect(0, WORLD.ground, WORLD.width, WORLD.height - WORLD.ground);
  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(0, WORLD.ground, WORLD.width, 2);
  ctx.fillStyle = COLORS.tick;
  const near = distance % 32;
  for (let x = -near; x < WORLD.width; x += 32) {
    ctx.fillRect(Math.round(x), WORLD.ground + 14, 14, 2);
  }
  const far = (distance * 0.6) % 48;
  for (let x = -far; x < WORLD.width; x += 48) {
    ctx.fillRect(Math.round(x), WORLD.ground + 34, 8, 2);
  }
}

function drawObstacle(ctx, o) {
  const x = Math.round(o.x);
  const top = WORLD.ground - o.height;
  ctx.fillStyle = o.kind === "conflict" ? COLORS.ink : COLORS.accent;
  ctx.fillRect(x, top, o.width, o.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(x + 3, top + 3, o.width - 6, 3);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `bold 10px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(LABELS[o.kind], x + o.width / 2, top - 6);
}

function drawPickup(ctx, k, time, reducedMotion) {
  const bob = reducedMotion ? 0 : Math.sin(time * 4 + k.x * 0.05) * 3;
  const cx = k.x + PICKUP_SIZE / 2;
  const cy = WORLD.ground - k.y - PICKUP_SIZE / 2 + bob;
  const r = PICKUP_SIZE / 2 + 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fillStyle = COLORS.primary;
  ctx.fill();
  ctx.strokeStyle = COLORS.ink;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = COLORS.paper;
  ctx.font = `bold 9px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(SYMBOLS[k.tech], cx, cy + 1);
}

function drawPlayer(ctx, state, time, reducedMotion) {
  const p = state.player;
  const x = PLAYER.x;
  let top = WORLD.ground - p.y - PLAYER.height;
  if (state.phase === "idle" && !reducedMotion) top += Math.sin(time * 3);
  top = Math.round(top);

  const runningOnGround = state.phase === "running" && p.onGround;
  const frame = !p.onGround ? 2 : runningOnGround ? Math.floor(time * 12) % 2 : 0;

  ctx.fillStyle = COLORS.ink;
  ctx.fillRect(x + 8, top, 14, 12);
  ctx.fillStyle = state.phase === "over" ? COLORS.accent : COLORS.paper;
  ctx.fillRect(x + 16, top + 4, 4, 3);
  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(x + 6, top + 12, 18, 14);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(x + 2, top + 14, 4, 8);
  ctx.fillStyle = COLORS.ink;
  if (frame === 0) {
    ctx.fillRect(x + 8, top + 26, 6, 10);
    ctx.fillRect(x + 17, top + 26, 6, 6);
  } else if (frame === 1) {
    ctx.fillRect(x + 8, top + 26, 6, 6);
    ctx.fillRect(x + 17, top + 26, 6, 10);
  } else {
    ctx.fillRect(x + 9, top + 26, 5, 7);
    ctx.fillRect(x + 16, top + 26, 5, 7);
  }
}

export function draw(ctx, state, time, { reducedMotion = false, shakeX = 0, shakeY = 0 } = {}) {
  ctx.save();
  ctx.translate(shakeX, shakeY);
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(-8, -8, WORLD.width + 16, WORLD.height + 16);
  drawBackdrop(ctx, state.distance);
  drawGround(ctx, state.distance);
  for (const k of state.pickups) drawPickup(ctx, k, time, reducedMotion);
  for (const o of state.obstacles) drawObstacle(ctx, o);
  drawPlayer(ctx, state, time, reducedMotion);
  ctx.restore();
}
```

- [ ] **Step 2: Verify it parses and bundles**

Run: `node --check src/game/draw.mjs`
Expected: no output, exit code 0.

- [ ] **Step 3: Commit**

```bash
git add src/game/draw.mjs
git commit -m "feat(game): add canvas renderer for Dev Runner" -- src/game/draw.mjs
```

---

### Task 6: DevRunner component and hero integration

**Files:**
- Create: `src/components/Introduce/DevRunner.vue`
- Modify: `src/components/Introduce/Introduce.vue:41-66` (right column) and `:69-88` (script)

**Interfaces:**
- Consumes: `createGame, jump, releaseJump, step, titleForScore, TECH, WORLD` from `@/game/engine.mjs`; `draw` from `@/game/draw.mjs`; `createAudio` from `@/game/audio.mjs`; `loadBest, saveBest` from `@/game/best.mjs`; `site` from `@/constants`; i18n paths from Task 4 plus existing `hero.profileRole`, `hero.profileLocation`, `hero.profileFocus`.
- Produces: default-exported component named `DevRunner`, used in `Introduce.vue` as `<dev-runner-vue />`. Takes no props.

- [ ] **Step 1: Create the component**

Create `src/components/Introduce/DevRunner.vue`:

```vue
<template>
  <section
    class="mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
    :aria-label="$t('game.title')"
  >
    <header class="flex items-center gap-3 border-b border-line px-4 py-3">
      <img
        src="@/assets/images/avatar.jpg"
        alt=""
        width="32"
        height="32"
        class="h-8 w-8 rounded-full border border-line object-cover"
      />
      <div class="min-w-0 flex-1">
        <p class="truncate text-sm font-black text-dark">{{ site.name }}</p>
        <p class="truncate text-xs font-semibold text-primary">{{ $t("hero.profileRole") }}</p>
      </div>
      <button
        v-if="audioSupported"
        type="button"
        class="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wide transition hover:border-primary hover:text-primary"
        :class="soundOn ? 'border-primary text-primary' : 'text-muted'"
        :aria-pressed="soundOn"
        @click="toggleSound"
      >
        {{ soundOn ? $t("game.soundOn") : $t("game.soundOff") }}
      </button>
    </header>

    <div
      ref="stage"
      tabindex="0"
      class="relative select-none outline-none focus-visible:ring-2 focus-visible:ring-primary"
      :class="hud.phase === 'running' ? 'touch-none' : 'touch-pan-y'"
    >
      <canvas
        ref="canvas"
        class="block w-full !rounded-none"
        role="img"
        :aria-label="$t('game.ariaLabel')"
        @pointerdown.prevent="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      />

      <div
        v-if="hud.phase === 'idle'"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 px-6 text-center"
      >
        <p
          class="font-mono text-sm font-bold uppercase tracking-[0.2em] text-dark"
          :class="reducedMotion ? '' : 'animate-pulse'"
        >
          {{ $t("game.idleHint") }}
        </p>
        <p v-if="reducedMotion" class="text-xs text-muted">{{ $t("game.reducedMotionNote") }}</p>
      </div>

      <div
        v-else-if="hud.phase === 'over'"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/80 px-6 text-center"
      >
        <p class="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {{ $t("game.gameOver") }}
        </p>
        <p class="text-4xl font-black tabular-nums text-dark">{{ hud.score }}</p>
        <p class="text-sm font-bold text-primary">{{ $t("game.titles." + hud.title) }}</p>
        <p class="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-muted">
          {{ $t("game.retryHint") }}
        </p>
      </div>
    </div>

    <div class="flex items-end justify-between gap-4 border-t border-line px-4 py-3">
      <dl class="flex gap-6">
        <div>
          <dt class="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            {{ $t("game.score") }}
          </dt>
          <dd class="text-2xl font-black tabular-nums text-dark">{{ hud.score }}</dd>
        </div>
        <div>
          <dt class="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
            {{ $t("game.best") }}
          </dt>
          <dd class="text-2xl font-black tabular-nums text-dark">{{ Math.max(best, hud.score) }}</dd>
        </div>
      </dl>
      <p
        v-if="hud.multiplier > 1"
        class="rounded-full bg-accent px-3 py-1 font-mono text-xs font-bold text-light"
      >
        {{ $t("game.combo") }} x{{ hud.multiplier }}
      </p>
    </div>

    <ul class="flex flex-wrap gap-2 border-t border-line px-4 py-3" :aria-label="$t('game.techLabel')">
      <li
        v-for="tech in techLabels"
        :key="tech.id"
        class="rounded-full border px-3 py-1 text-xs font-semibold transition"
        :class="
          hud.collected.includes(tech.id)
            ? 'border-primary bg-primary text-light'
            : 'border-line bg-background text-muted'
        "
      >
        {{ tech.label }}
      </li>
    </ul>

    <p class="border-t border-line px-4 py-2 text-xs text-muted">
      {{ $t("hero.profileLocation") }} · {{ $t("hero.profileFocus") }}
    </p>
  </section>
</template>

<script>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { site } from "@/constants";
import { createAudio } from "@/game/audio.mjs";
import { loadBest, saveBest } from "@/game/best.mjs";
import { draw } from "@/game/draw.mjs";
import { TECH, WORLD, createGame, jump, releaseJump, step, titleForScore } from "@/game/engine.mjs";

const TECH_LABELS = {
  vue: "Vue",
  react: "React",
  nestjs: "NestJS",
  postgres: "PostgreSQL",
  typescript: "TypeScript",
};
const SHAKE_MS = 180;

const getStorage = () => {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

export default {
  name: "DevRunner",
  setup() {
    const stage = ref(null);
    const canvas = ref(null);
    const best = ref(0);
    const soundOn = ref(false);
    const reducedMotion = ref(false);
    const hud = reactive({
      phase: "idle",
      score: 0,
      multiplier: 1,
      collected: [],
      title: "junior",
    });

    const audio = createAudio();
    const game = createGame();
    let ctx = null;
    let rafId = 0;
    let lastTime = 0;
    let inView = true;
    let observer = null;
    let shakeUntil = 0;
    let hudKey = "";
    let downPhase = "idle";

    const syncHud = () => {
      const key = `${game.phase}|${game.score}|${game.combo.multiplier}|${game.collected.size}`;
      if (key === hudKey) return;
      hudKey = key;
      hud.phase = game.phase;
      hud.score = game.score;
      hud.multiplier = game.combo.multiplier;
      hud.collected = Array.from(game.collected);
      hud.title = titleForScore(game.score);
    };

    const render = (now) => {
      const shaking = !reducedMotion.value && now < shakeUntil;
      const amplitude = shaking ? 6 * ((shakeUntil - now) / SHAKE_MS) : 0;
      draw(ctx, game, now / 1000, {
        reducedMotion: reducedMotion.value,
        shakeX: Math.sin(now * 0.09) * amplitude,
        shakeY: Math.cos(now * 0.11) * amplitude,
      });
    };

    const onHit = (now) => {
      audio.hit();
      shakeUntil = now + SHAKE_MS;
      if (game.score > best.value) {
        best.value = game.score;
        saveBest(getStorage(), best.value);
      }
    };

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      const dt = lastTime ? (now - lastTime) / 1000 : 0;
      lastTime = now;
      const events = step(game, dt);
      for (const event of events) {
        if (event === "pickup") audio.pickup();
        else if (event === "hit") onHit(now);
      }
      render(now);
      syncHud();
    };

    // The loop only runs while the card is on screen and the tab is visible.
    const sync = () => {
      const shouldRun = inView && !document.hidden;
      if (shouldRun && !rafId) {
        lastTime = 0;
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const press = () => {
      if (jump(game)) audio.jump();
      syncHud();
    };

    const isJumpKey = (e) => e.code === "Space" || e.code === "ArrowUp";
    const isInteractive = (el) =>
      Boolean(el) &&
      (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(el.tagName));

    // Only take the key when the game is focused, or while a run is in progress
    // on screen and nothing else (a field, a button, a link) has focus. Space
    // keeps scrolling the page everywhere else.
    const shouldHandle = (e) => {
      if (stage.value && stage.value.contains(e.target)) return true;
      if (isInteractive(e.target)) return false;
      return game.phase === "running" && inView;
    };

    const onKeyDown = (e) => {
      if (!isJumpKey(e) || e.metaKey || e.ctrlKey || e.altKey || !shouldHandle(e)) return;
      e.preventDefault();
      if (e.repeat) return;
      press();
    };
    const onKeyUp = (e) => {
      if (isJumpKey(e)) releaseJump(game);
    };

    // Touch: jumping while running reacts on pointerdown; starting or
    // restarting waits for pointerup so a scroll gesture does not start a run.
    const onPointerDown = (e) => {
      stage.value?.focus({ preventScroll: true });
      downPhase = game.phase;
      if (e.pointerType !== "touch" || game.phase === "running") press();
    };
    const onPointerUp = (e) => {
      if (e.pointerType === "touch" && downPhase !== "running") press();
      releaseJump(game);
    };
    const onPointerCancel = () => releaseJump(game);

    const toggleSound = () => {
      soundOn.value = audio.setEnabled(!audio.enabled);
    };

    onMounted(() => {
      const el = canvas.value;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = WORLD.width * dpr;
      el.height = WORLD.height * dpr;
      ctx = el.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      reducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      best.value = loadBest(getStorage());

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      document.addEventListener("visibilitychange", sync);
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            sync();
          },
          { threshold: 0.15 }
        );
        observer.observe(stage.value);
      }

      render(performance.now());
      sync();
    });

    onBeforeUnmount(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", sync);
      if (observer) observer.disconnect();
    });

    return {
      stage,
      canvas,
      hud,
      best,
      soundOn,
      reducedMotion,
      site,
      audioSupported: audio.supported,
      techLabels: TECH.map((id) => ({ id, label: TECH_LABELS[id] })),
      toggleSound,
      onPointerDown,
      onPointerUp,
      onPointerCancel,
    };
  },
};
</script>
```

- [ ] **Step 2: Replace the hero's right column**

In `src/components/Introduce/Introduce.vue`, replace the whole right column block (the `<div class="order-1 md:order-2">` element, lines 41 to 66, which contains the avatar card) with:

```vue
    <div class="order-1 md:order-2">
      <dev-runner-vue />
    </div>
```

- [ ] **Step 3: Update the hero script**

Replace the `<script>` block (lines 69 to 88) with:

```vue
<script>
import resumeUrl from "@/assets/docs/resume.pdf";
import DevRunnerVue from "./DevRunner.vue";

export default {
  name: "Introduce",
  components: {
    DevRunnerVue,
  },
  data: () => ({
    resumeUrl,
  }),
  computed: {
    metrics() {
      return this.$tm("hero.metrics");
    },
  },
};
</script>
```

- [ ] **Step 4: Run tests and build**

Run: `npm test`
Expected: all tests pass.

Run: `npm run build`
Expected: exit 0, no unresolved import errors (`@/game/*.mjs`, `@/constants`).

- [ ] **Step 5: Manual verification in the browser**

Run `npm run dev` (serves on port 1997) and check each item. Report anything that fails instead of working around it.

- [ ] Idle: the card shows the pulsing "Press Space or tap to run" overlay; the name, role, location and focus line are visible; the avatar thumbnail renders.
- [ ] Click the canvas or press Space: the run starts and the runner jumps; obstacles scroll in; speed visibly increases over ~30 s.
- [ ] Holding Space does not chain jumps; releasing early gives a shorter hop.
- [ ] Space scrolls the page normally when the game is not focused and not running, and when a button or link has focus.
- [ ] Collecting a diamond lights the matching badge; collecting several in a row shows a `Combo xN` chip.
- [ ] Hitting an obstacle shakes the canvas briefly and shows score, title, best and the retry hint. Mashing Space at the moment of death still shows the overlay for an instant, then the next press restarts at once.
- [ ] The best score survives a page reload; it also works with site data blocked (no console errors).
- [ ] Sound is off by default; the toggle turns on jump, pickup and hit sounds and turns them off again.
- [ ] Switch to another tab for ~10 s and return: the runner is where it was and not dead; scroll the card off screen and back: same.
- [ ] Narrow the window to ~375 px (or device mode): the card fits; scrolling the page by dragging over the idle card does not start a run; tapping starts it; a tap while running jumps.
- [ ] Turn on "reduce motion" in the OS or devtools: no pulse, no shake, the note is shown, the game still waits for input.
- [ ] Switch the site language to Turkish and back: every string on the card changes; no raw keys like `game.idleHint` appear.

- [ ] **Step 6: Commit**

```bash
git add src/components/Introduce/DevRunner.vue src/components/Introduce/Introduce.vue
git commit -m "feat(hero): replace profile card with playable Dev Runner" -- src/components/Introduce/DevRunner.vue src/components/Introduce/Introduce.vue
```

---

### Task 7: Final verification

**Files:** none changed (verification only).

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: all tests pass, 0 failures (5 existing locale tests + 14 engine + 5 best + 4 audio = 28).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: exit code 0.

- [ ] **Step 3: Check the history only contains this work**

Run: `git log --oneline -8` and `git status --short`
Expected: the six feature commits from Tasks 1 to 6 are present; remaining modified files are the unrelated pre-existing ones (palette, projects, resume), not accidentally committed or lost.

- [ ] **Step 4: Report**

Summarize for the user with evidence: test count, build exit code, the manual checklist results, and any item that could not be checked.
