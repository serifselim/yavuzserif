// Camera stays on +z looking toward -z, so screen-right is world +x.
// Object3D rotation.y > 0 turns counter-clockwise from above and swings a
// point on +z toward -x (screen left). A rightward drag follows the finger
// only when yaw decreases.

export const ORBIT_SPEED = (Math.PI * 2) / 18;
export const IDLE_YAW_SPEED = 0.22;
export const DRAG_SENSITIVITY = 0.008;
export const FRAME_FOV = 32;

export function orbitOffset(index, count, elapsed, radius, height) {
  const angle = elapsed * ORBIT_SPEED + (index * Math.PI * 2) / count;
  return {
    x: Math.cos(angle) * radius,
    y: height,
    z: Math.sin(angle) * radius,
  };
}

export function orbitLayout(modelHeight, halfWidth) {
  return {
    radius: Math.max(halfWidth * 1.2, modelHeight * 0.7) + 1.2,
    height: modelHeight * 0.62,
  };
}

export function yawFromDrag(yaw, deltaX) {
  return yaw - deltaX * DRAG_SENSITIVITY;
}

export function stepYaw({ yaw, dt, dragging, reducedMotion }) {
  if (dragging || reducedMotion) return yaw;
  return yaw + IDLE_YAW_SPEED * dt;
}

export function frameCamera(modelHeight, orbitRadius, spriteRadius = 0.85) {
  const halfTan = Math.tan((FRAME_FOV * Math.PI) / 360);
  const dist = ((orbitRadius + spriteRadius) / halfTan) * 1.42;
  return {
    fov: FRAME_FOV,
    position: { x: 0, y: modelHeight * 0.62, z: dist },
    lookAt: { x: 0, y: modelHeight * 0.4, z: 0 },
  };
}
