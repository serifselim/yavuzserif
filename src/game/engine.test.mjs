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
