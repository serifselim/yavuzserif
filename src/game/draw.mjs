import { PICKUP_SIZE, PLAYER, WORLD } from "./engine.mjs";

export const DAY_LENGTH = 48;

const INK = [15, 23, 42];
const PAPER = [255, 255, 255];
const INK_NIGHT = [226, 232, 240];
const PAPER_NIGHT = [15, 23, 42];

const SKY_TOP = [
  [0, [248, 250, 252]],
  [0.16, [255, 247, 237]],
  [0.28, [254, 215, 170]],
  [0.36, [249, 115, 22]],
  [0.44, [51, 65, 85]],
  [0.5, [15, 23, 42]],
  [0.64, [15, 23, 42]],
  [0.76, [56, 89, 122]],
  [0.88, [224, 242, 254]],
  [1, [248, 250, 252]],
];
const SKY_HORIZON = [
  [0, [241, 245, 249]],
  [0.2, [255, 237, 213]],
  [0.32, [251, 146, 60]],
  [0.4, [154, 52, 18]],
  [0.5, [30, 41, 59]],
  [0.68, [30, 41, 59]],
  [0.8, [253, 186, 166]],
  [0.92, [241, 245, 249]],
  [1, [241, 245, 249]],
];
const GROUND_STOPS = [
  [0, [237, 242, 247]],
  [0.32, [226, 201, 176]],
  [0.5, [30, 41, 59]],
  [0.72, [30, 41, 59]],
  [1, [237, 242, 247]],
];
const GRID_STOPS = [
  [0, [226, 232, 240]],
  [0.5, [51, 65, 85]],
  [1, [226, 232, 240]],
];
const TICK_STOPS = [
  [0, [203, 213, 225]],
  [0.5, [71, 85, 105]],
  [1, [203, 213, 225]],
];

const ARC_RX = WORLD.width * 0.46;
const ARC_RY = WORLD.ground * 0.62;

const COLORS = {
  primary: "#2563eb",
  accent: "#ea580c",
};
const MONO = '"Cascadia Code", SFMono-Regular, Consolas, monospace';
const LABELS = { bug: "BUG", conflict: "CONFLICT", notfound: "404" };
const SYMBOLS = { vue: "V", react: "R", nestjs: "N", postgres: "P", typescript: "TS" };

function clamp01(t) {
  if (t < 0) return 0;
  if (t > 1) return 1;
  return t;
}

function mix(a, b, t) {
  const k = clamp01(t);
  return a.map((v, i) => Math.round(v + (b[i] - v) * k));
}

function sample(stops, u) {
  let i = 0;
  while (i < stops.length - 2 && stops[i + 1][0] < u) i += 1;
  const [u0, c0] = stops[i];
  const [u1, c1] = stops[i + 1];
  const span = u1 - u0;
  return mix(c0, c1, span === 0 ? 0 : (u - u0) / span);
}

function rgb(channels) {
  return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
}

function onArc(progress) {
  const angle = Math.PI * (1 - progress);
  return {
    x: WORLD.width / 2 + Math.cos(angle) * ARC_RX,
    y: WORLD.ground - Math.sin(angle) * ARC_RY,
  };
}

// shift 0.25 puts the sun overhead at noon; 0.75 does the same for the moon.
function body(u, shift) {
  const shifted = (u + shift) % 1;
  if (shifted > 0.5) return null;
  return onArc(shifted / 0.5);
}

export function cycleAt(time) {
  const span = ((time % DAY_LENGTH) + DAY_LENGTH) % DAY_LENGTH;
  const u = span / DAY_LENGTH;
  const daylight = (Math.cos(u * Math.PI * 2) + 1) / 2;
  const night = 1 - daylight;
  return {
    daylight,
    skyTop: rgb(sample(SKY_TOP, u)),
    skyHorizon: rgb(sample(SKY_HORIZON, u)),
    ground: rgb(sample(GROUND_STOPS, u)),
    grid: rgb(sample(GRID_STOPS, u)),
    tick: rgb(sample(TICK_STOPS, u)),
    ink: rgb(mix(INK, INK_NIGHT, night)),
    paper: rgb(mix(PAPER, PAPER_NIGHT, night)),
    starAlpha: clamp01((0.42 - daylight) / 0.42),
    sun: body(u, 0.25),
    moon: body(u, 0.75),
  };
}

const STARS = (() => {
  const stars = [];
  let n = 17;
  for (let i = 0; i < 36; i += 1) {
    n = (Math.imul(n, 1103515245) + 12345) >>> 0;
    const x = ((n % 1000) / 1000) * (WORLD.width - 16) + 8;
    n = (Math.imul(n, 1103515245) + 12345) >>> 0;
    const y = ((n % 1000) / 1000) * (WORLD.ground * 0.72) + 8;
    stars.push({ x, y, size: n % 5 === 0 ? 2 : 1 });
  }
  return stars;
})();

function disk(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawSky(ctx, cycle) {
  const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.ground);
  gradient.addColorStop(0, cycle.skyTop);
  gradient.addColorStop(1, cycle.skyHorizon);
  ctx.fillStyle = gradient;
  ctx.fillRect(-8, -8, WORLD.width + 16, WORLD.height + 16);
}

function drawStars(ctx, cycle, time, reducedMotion) {
  if (cycle.starAlpha <= 0) return;
  ctx.fillStyle = "rgb(248, 250, 252)";
  for (let i = 0; i < STARS.length; i += 1) {
    const star = STARS[i];
    const twinkle = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(time * 1.7 + i);
    ctx.globalAlpha = cycle.starAlpha * twinkle;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  }
  ctx.globalAlpha = 1;
}

function drawSun(ctx, sun) {
  if (!sun) return;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "rgb(251, 191, 36)";
  disk(ctx, sun.x, sun.y, 34);
  ctx.restore();
  ctx.fillStyle = "rgb(253, 224, 71)";
  disk(ctx, sun.x, sun.y, 14);
}

function drawMoon(ctx, moon) {
  if (!moon) return;
  ctx.fillStyle = "rgb(241, 245, 249)";
  disk(ctx, moon.x, moon.y, 12);
  ctx.save();
  ctx.beginPath();
  ctx.arc(moon.x, moon.y, 12, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(moon.x + 5, moon.y - 2, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBackdrop(ctx, distance, cycle) {
  ctx.fillStyle = cycle.grid;
  const offset = (distance * 0.35) % 40;
  for (let x = -offset; x < WORLD.width; x += 40) {
    ctx.fillRect(Math.round(x), 0, 1, WORLD.ground);
  }
  for (let y = 20; y < WORLD.ground; y += 40) {
    ctx.fillRect(0, y, WORLD.width, 1);
  }
}

function drawGround(ctx, distance, cycle) {
  ctx.fillStyle = cycle.ground;
  ctx.fillRect(0, WORLD.ground, WORLD.width, WORLD.height - WORLD.ground);
  ctx.fillStyle = cycle.ink;
  ctx.fillRect(0, WORLD.ground, WORLD.width, 2);
  ctx.fillStyle = cycle.tick;
  const near = distance % 32;
  for (let x = -near; x < WORLD.width; x += 32) {
    ctx.fillRect(Math.round(x), WORLD.ground + 14, 14, 2);
  }
  const far = (distance * 0.6) % 48;
  for (let x = -far; x < WORLD.width; x += 48) {
    ctx.fillRect(Math.round(x), WORLD.ground + 34, 8, 2);
  }
}

function drawObstacle(ctx, o, cycle) {
  const x = Math.round(o.x);
  const top = WORLD.ground - o.height;
  ctx.fillStyle = o.kind === "conflict" ? cycle.ink : COLORS.accent;
  ctx.fillRect(x, top, o.width, o.height);
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(x + 3, top + 3, o.width - 6, 3);
  ctx.fillStyle = cycle.ink;
  ctx.font = `bold 10px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(LABELS[o.kind], x + o.width / 2, top - 6);
}

function drawPickup(ctx, k, time, reducedMotion, cycle) {
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
  ctx.strokeStyle = cycle.ink;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = `bold 9px ${MONO}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(SYMBOLS[k.tech], cx, cy + 1);
}

function drawPlayer(ctx, state, time, reducedMotion, cycle) {
  const p = state.player;
  const x = PLAYER.x;
  let top = WORLD.ground - p.y - PLAYER.height;
  if (state.phase === "idle" && !reducedMotion) top += Math.sin(time * 3);
  top = Math.round(top);

  const runningOnGround = state.phase === "running" && p.onGround;
  const frame = !p.onGround ? 2 : runningOnGround ? Math.floor(time * 12) % 2 : 0;

  ctx.fillStyle = cycle.ink;
  ctx.fillRect(x + 8, top, 14, 12);
  ctx.fillStyle = state.phase === "over" ? COLORS.accent : cycle.paper;
  ctx.fillRect(x + 16, top + 4, 4, 3);
  ctx.fillStyle = COLORS.primary;
  ctx.fillRect(x + 6, top + 12, 18, 14);
  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(x + 2, top + 14, 4, 8);
  ctx.fillStyle = cycle.ink;
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
  const cycle = cycleAt(time);
  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawSky(ctx, cycle);
  drawStars(ctx, cycle, time, reducedMotion);
  drawSun(ctx, cycle.sun);
  drawMoon(ctx, cycle.moon);
  drawBackdrop(ctx, state.distance, cycle);
  drawGround(ctx, state.distance, cycle);
  for (const k of state.pickups) drawPickup(ctx, k, time, reducedMotion, cycle);
  for (const o of state.obstacles) drawObstacle(ctx, o, cycle);
  drawPlayer(ctx, state, time, reducedMotion, cycle);
  ctx.restore();
}
