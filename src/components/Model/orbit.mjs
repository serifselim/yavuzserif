// Camera sits up and toward +x, looking down. Screen-right is
// (cos azimuth, 0, -sin azimuth). Object3D rotation.y > 0 turns
// counter-clockwise from above and sends +z toward +x. A rightward drag
// decreases yaw, so the side facing the camera slides toward screen left.

export const ORBIT_SPEED = (Math.PI * 2) / 18;
export const IDLE_YAW_SPEED = 0.22;
export const DRAG_SENSITIVITY = 0.008;
export const FRAME_FOV = 32;
// Radians. Azimuth swings the camera off +z toward +x; elevation looks down.
export const CAMERA_AZIMUTH = 0.9;
export const CAMERA_ELEVATION = 0.75;

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
  const dist = ((orbitRadius + spriteRadius) / halfTan) * 1.62;
  const lookAt = { x: 0, y: modelHeight * 0.32, z: 0 };
  const cosEl = Math.cos(CAMERA_ELEVATION);
  return {
    fov: FRAME_FOV,
    position: {
      x: Math.sin(CAMERA_AZIMUTH) * cosEl * dist,
      y: lookAt.y + Math.sin(CAMERA_ELEVATION) * dist,
      z: Math.cos(CAMERA_AZIMUTH) * cosEl * dist,
    },
    lookAt,
  };
}
