export const WORLD = Object.freeze({ width: 640, height: 360, ground: 300 });
export const PLAYER = Object.freeze({ x: 80, width: 28, height: 36 });
export const PHYSICS = Object.freeze({ gravity: 2200, jumpVelocity: 780, jumpCut: 0.5 });
export const SPEED = Object.freeze({ start: 260, max: 620, perDistance: 0.032 });
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

// 0 at the opening, 1 deep into a run. Speed does most of the work;
// distance keeps raising pressure after the speed cap.
export function pressureFor(speed, distance) {
  const span = SPEED.max - SPEED.start;
  const speedT = span <= 0 ? 1 : Math.min(Math.max((speed - SPEED.start) / span, 0), 1);
  const late = Math.min(Math.max((distance - 6000) / 24000, 0), 1);
  return Math.min(speedT * 0.6 + late * 0.4, 1);
}

// Empty time between obstacles. The late floor stays longer than one full
// jump, so a landed player can always choose the next jump.
export function gapSeconds(pressure, roll) {
  const min = 1.35 - pressure * 0.4;
  const span = 0.4 - pressure * 0.15;
  return min + roll * span;
}

export function conflictHeight(pressure) {
  return OBSTACLE_KINDS.conflict.height + Math.round(Math.min(Math.max(pressure, 0), 1) * 36);
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

function pickKind(rng, pressure) {
  const roll = rng();
  const bugCut = 0.42 - pressure * 0.2;
  if (roll < bugCut) return "bug";
  if (roll < bugCut + 0.34) return "conflict";
  return "notfound";
}

function pushObstacle(state, kind, x, pressure) {
  const { width } = OBSTACLE_KINDS[kind];
  const height = kind === "conflict" ? conflictHeight(pressure) : OBSTACLE_KINDS[kind].height;
  state.obstacles.push({ kind, x, width, height });
  return width;
}

function spawn(state, travel) {
  state.gapLeft -= travel;
  if (state.gapLeft > 0) return;

  const pressure = pressureFor(state.speed, state.distance);
  const kind = pickKind(state.rng, pressure);
  const x = SPAWN_X + state.gapLeft;
  let cursor = x;
  let span = pushObstacle(state, kind, cursor, pressure);

  const paired = pressure > 0.5 && state.rng() < (pressure - 0.5) * 0.8;
  if (paired) {
    const pairKind = pickKind(state.rng, pressure);
    const pairGap = gapSeconds(pressure, 0) * state.speed;
    cursor += span + pairGap;
    span = cursor - x + pushObstacle(state, pairKind, cursor, pressure);
  }

  const gap = gapSeconds(pressure, state.rng()) * state.speed;
  state.gapLeft = span + gap;

  if (state.rng() < 0.7) {
    const level = Math.floor(state.rng() * PICKUP_HEIGHTS.length);
    state.pickups.push({
      tech: TECH[state.techIndex % TECH.length],
      x: x + span + gap / 2 - PICKUP_SIZE / 2,
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
