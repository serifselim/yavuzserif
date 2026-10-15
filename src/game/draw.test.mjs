import assert from "node:assert/strict";
import test from "node:test";
import { WORLD, createGame } from "./engine.mjs";
import { DAY_LENGTH, draw } from "./draw.mjs";

const NOON = 0;
const SUNSET = DAY_LENGTH / 4;
const MIDNIGHT = DAY_LENGTH / 2;
const SUNRISE = DAY_LENGTH * 0.75;

function channels(color) {
  if (typeof color !== "string") return [255, 255, 255];
  if (color.startsWith("#")) {
    const n = Number.parseInt(color.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return color.match(/\d+/g).slice(0, 3).map(Number);
}

function luminance(color) {
  const [r, g, b] = channels(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function fakeCtx() {
  const ops = [];
  const ctx = {
    ops,
    fillStyle: "",
    strokeStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
    lineWidth: 1,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    _arc: null,
    _stack: [],
    save() {
      ctx._stack.push({
        globalAlpha: ctx.globalAlpha,
        globalCompositeOperation: ctx.globalCompositeOperation,
        fillStyle: ctx.fillStyle,
      });
    },
    restore() {
      const prev = ctx._stack.pop();
      ctx.globalAlpha = prev.globalAlpha;
      ctx.globalCompositeOperation = prev.globalCompositeOperation;
      ctx.fillStyle = prev.fillStyle;
    },
    translate() {},
    beginPath() {
      ctx._arc = null;
    },
    moveTo() {},
    lineTo() {},
    closePath() {},
    arc(x, y, r) {
      ctx._arc = { x, y, r };
    },
    clip() {},
    fill() {
      ops.push({ op: "fill", fillStyle: ctx.fillStyle, arc: ctx._arc, alpha: ctx.globalAlpha });
    },
    stroke() {},
    fillText() {
      ops.push({ op: "text", fillStyle: ctx.fillStyle });
    },
    fillRect(x, y, w, h) {
      ops.push({ op: "fillRect", x, y, w, h, fillStyle: ctx.fillStyle, alpha: ctx.globalAlpha });
    },
    createLinearGradient() {
      return {
        stops: [],
        addColorStop(offset, color) {
          this.stops.push({ offset, color });
        },
      };
    },
  };
  return ctx;
}

function skyColor(ctx) {
  const sky = ctx.ops.find((op) => op.op === "fillRect" && op.w > WORLD.width);
  const style = sky.fillStyle;
  return style?.stops?.[0]?.color ?? style;
}

function disks(ctx) {
  return ctx.ops.filter((op) => op.op === "fill" && op.arc && op.arc.r <= 16 && op.alpha > 0.9);
}

function isWarm(color) {
  const [r, , b] = channels(color);
  return r > 180 && r > b + 40;
}

const scene = () => {
  const state = createGame(() => 0);
  state.phase = "running";
  state.player.onGround = true;
  return state;
};

const paint = (time, state = scene()) => {
  const ctx = fakeCtx();
  draw(ctx, state, time, { reducedMotion: true });
  return ctx;
};

test("midnight sky is dark and noon sky stays light", () => {
  const noon = skyColor(paint(NOON));
  const night = skyColor(paint(MIDNIGHT));
  assert.ok(luminance(noon) > 200, `noon sky ${noon}`);
  assert.ok(luminance(night) < 40, `midnight sky ${night}`);
});

test("the sun is overhead at noon and the moon replaces it at midnight", () => {
  const noonSun = disks(paint(NOON)).find((d) => d.arc.y < 180 && isWarm(d.fillStyle));
  assert.ok(noonSun, "noon sun missing");
  assert.ok(Math.abs(noonSun.arc.x - WORLD.width / 2) < 2, `sun x ${noonSun.arc.x}`);

  const night = paint(MIDNIGHT);
  const nightSun = disks(night).find((d) => d.arc.y < WORLD.ground - 40 && isWarm(d.fillStyle));
  assert.equal(nightSun, undefined);
  const moon = disks(night).find((d) => d.arc.y < 180 && !isWarm(d.fillStyle));
  assert.ok(moon, "midnight moon missing");
  assert.ok(Math.abs(moon.arc.x - WORLD.width / 2) < 2, `moon x ${moon.arc.x}`);
});

test("the sun sets on the right and rises on the left", () => {
  const sunset = disks(paint(SUNSET)).find((d) => isWarm(d.fillStyle));
  const sunrise = disks(paint(SUNRISE)).find((d) => isWarm(d.fillStyle));
  assert.ok(sunset, "sunset sun missing");
  assert.ok(sunrise, "sunrise sun missing");
  assert.ok(sunset.arc.x > WORLD.width * 0.85, `sunset x ${sunset.arc.x}`);
  assert.ok(sunset.arc.y > WORLD.ground - 30, `sunset y ${sunset.arc.y}`);
  assert.ok(sunrise.arc.x < WORLD.width * 0.15, `sunrise x ${sunrise.arc.x}`);
  assert.ok(sunrise.arc.y > WORLD.ground - 30, `sunrise y ${sunrise.arc.y}`);
});

test("a conflict stays readable on the midnight sky", () => {
  const state = scene();
  state.obstacles.push({ kind: "conflict", x: 200, width: 28, height: 48 });
  const ctx = paint(MIDNIGHT, state);
  const body = ctx.ops.find((op) => op.op === "fillRect" && op.x === 200 && op.w === 28 && op.h === 48);
  assert.ok(body, "conflict body was not drawn");
  assert.ok(luminance(body.fillStyle) > 180, `conflict ${body.fillStyle}`);
  const ground = ctx.ops.find(
    (op) => op.op === "fillRect" && op.y === WORLD.ground && op.h === WORLD.height - WORLD.ground
  );
  assert.ok(luminance(ground.fillStyle) < 80, `ground ${ground.fillStyle}`);
});

test("the same clock time a day later, or a negative wrap, paints the same sky", () => {
  const midnight = skyColor(paint(MIDNIGHT));
  assert.ok(luminance(midnight) < 40, `midnight sky ${midnight}`);
  assert.equal(skyColor(paint(MIDNIGHT + DAY_LENGTH)), midnight);
  assert.equal(skyColor(paint(-MIDNIGHT)), midnight);
});
