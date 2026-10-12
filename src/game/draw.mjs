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
