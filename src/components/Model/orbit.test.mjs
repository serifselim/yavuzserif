import assert from "node:assert/strict";
import test from "node:test";
import {
  frameCamera,
  orbitLayout,
  orbitOffset,
  stepYaw,
  yawFromDrag,
} from "./orbit.mjs";

test("logos start evenly around the model and return after one lap", () => {
  const radius = 4;
  const height = 2;
  const first = orbitOffset(0, 4, 0, radius, height);
  const right = orbitOffset(1, 4, 0, radius, height);
  const back = orbitOffset(2, 4, 0, radius, height);
  assert.ok(Math.abs(first.x - radius) < 1e-9 && Math.abs(first.z) < 1e-9);
  assert.equal(first.y, height);
  assert.ok(Math.abs(right.z - radius) < 1e-9 && Math.abs(right.x) < 1e-9);
  assert.ok(Math.abs(back.x + radius) < 1e-9);
  const again = orbitOffset(0, 4, 18, radius, height);
  assert.ok(Math.abs(again.x - first.x) < 1e-9);
  assert.ok(Math.abs(again.z - first.z) < 1e-9);
});

test("the orbit ring clears the model", () => {
  const layout = orbitLayout(5, 2);
  assert.ok(layout.radius > 2);
  assert.ok(layout.height > 0 && layout.height < 5);
});

test("a rightward drag turns the model with the finger, and the camera looks down from the front-right", () => {
  const frame = frameCamera(5, 4);
  const rise = frame.position.y - frame.lookAt.y;
  assert.ok(frame.position.x > 1, `side offset ${frame.position.x}`);
  assert.ok(frame.position.z > frame.position.x * 0.5, "not a pure side view");
  assert.ok(rise > frame.position.z, `looking down from above, rise ${rise}`);
  assert.equal(frame.lookAt.x, 0);
  assert.equal(frame.lookAt.z, 0);
  assert.ok(yawFromDrag(0, 40) < 0);
  assert.ok(yawFromDrag(0, -40) > 0);
});

test("idle spin stops while dragging and when motion is reduced", () => {
  assert.ok(stepYaw({ yaw: 1, dt: 1, dragging: false, reducedMotion: false }) > 1);
  assert.equal(stepYaw({ yaw: 1, dt: 1, dragging: true, reducedMotion: false }), 1);
  assert.equal(stepYaw({ yaw: 1, dt: 1, dragging: false, reducedMotion: true }), 1);
});
