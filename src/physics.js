// ============================================================
//  ANGRY BIRDS – Physics Engine (Simplified 2D)
// ============================================================

export const GRAVITY = 600; // pixels/s²
export const FRICTION = 0.98;
export const ANGULAR_FRICTION = 0.96;
export const RESTITUTION = 0.35;
export const MIN_VELOCITY = 2;
export const SLEEP_THRESHOLD = 1.5;

/**
 * Simple 2D Vector helpers
 */
export const Vec2 = {
  create(x = 0, y = 0) { return { x, y }; },
  add(a, b) { return { x: a.x + b.x, y: a.y + b.y }; },
  sub(a, b) { return { x: a.x - b.x, y: a.y - b.y }; },
  scale(v, s) { return { x: v.x * s, y: v.y * s }; },
  dot(a, b) { return a.x * b.x + a.y * b.y; },
  length(v) { return Math.sqrt(v.x * v.x + v.y * v.y); },
  normalize(v) {
    const len = Vec2.length(v);
    if (len === 0) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  },
  distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  rotate(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  },
  perpCW(v) { return { x: v.y, y: -v.x }; },
  perpCCW(v) { return { x: -v.y, y: v.x }; },
};

/**
 * AABB overlap check
 */
function aabbOverlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

/**
 * Get AABB for a body
 */
export function getAABB(body) {
  if (body.shape === 'circle') {
    return {
      left: body.x - body.radius,
      right: body.x + body.radius,
      top: body.y - body.radius,
      bottom: body.y + body.radius,
    };
  }
  // Rotated rectangle AABB
  const hw = body.width / 2;
  const hh = body.height / 2;
  const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ].map(c => Vec2.rotate(c, body.angle || 0));

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of corners) {
    minX = Math.min(minX, body.x + c.x);
    maxX = Math.max(maxX, body.x + c.x);
    minY = Math.min(minY, body.y + c.y);
    maxY = Math.max(maxY, body.y + c.y);
  }
  return { left: minX, right: maxX, top: minY, bottom: maxY };
}

/**
 * Circle vs Circle collision
 */
function circleVsCircle(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = a.radius + b.radius;

  if (dist >= minDist) return null;

  const normal = dist > 0 ? { x: dx / dist, y: dy / dist } : { x: 1, y: 0 };
  const overlap = minDist - dist;

  return { normal, overlap, contactPoint: { x: a.x + normal.x * a.radius, y: a.y + normal.y * a.radius } };
}

/**
 * Circle vs Rect collision (simplified – treat rect as AABB for now, with rotation approximation)
 */
function circleVsRect(circle, rect) {
  // Transform circle into rect's local space
  const angle = -(rect.angle || 0);
  const localCircle = Vec2.rotate(Vec2.sub(circle, rect), angle);

  const hw = rect.width / 2;
  const hh = rect.height / 2;

  // Closest point on rect
  const closest = {
    x: Math.max(-hw, Math.min(hw, localCircle.x)),
    y: Math.max(-hh, Math.min(hh, localCircle.y)),
  };

  const dx = localCircle.x - closest.x;
  const dy = localCircle.y - closest.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist >= circle.radius) return null;

  let normal;
  if (dist === 0) {
    // Circle center inside rect
    const overlapX = hw - Math.abs(localCircle.x);
    const overlapY = hh - Math.abs(localCircle.y);
    if (overlapX < overlapY) {
      normal = { x: localCircle.x > 0 ? 1 : -1, y: 0 };
    } else {
      normal = { x: 0, y: localCircle.y > 0 ? 1 : -1 };
    }
    const overlap = Math.min(overlapX, overlapY) + circle.radius;
    // Rotate normal back to world space
    const worldNormal = Vec2.rotate(normal, rect.angle || 0);
    return {
      normal: worldNormal,
      overlap,
      contactPoint: { x: circle.x, y: circle.y },
    };
  }

  const localNormal = { x: dx / dist, y: dy / dist };
  const overlap = circle.radius - dist;

  // Rotate back to world space
  const worldNormal = Vec2.rotate(localNormal, rect.angle || 0);
  const contactLocal = Vec2.rotate(closest, rect.angle || 0);

  return {
    normal: worldNormal,
    overlap,
    contactPoint: Vec2.add(rect, contactLocal),
  };
}

/**
 * Rect vs Rect collision (SAT – Separating Axis Theorem)
 */
function rectVsRect(a, b) {
  const cornersA = getRectCorners(a);
  const cornersB = getRectCorners(b);

  const axes = [
    ...getRectAxes(a),
    ...getRectAxes(b),
  ];

  let minOverlap = Infinity;
  let bestAxis = null;

  for (const axis of axes) {
    const projA = projectCorners(cornersA, axis);
    const projB = projectCorners(cornersB, axis);

    const overlap = Math.min(projA.max - projB.min, projB.max - projA.min);
    if (overlap <= 0) return null;

    if (overlap < minOverlap) {
      minOverlap = overlap;
      bestAxis = axis;
    }
  }

  // Ensure normal points from a to b
  const d = Vec2.sub(b, a);
  if (Vec2.dot(d, bestAxis) < 0) {
    bestAxis = Vec2.scale(bestAxis, -1);
  }

  return {
    normal: bestAxis,
    overlap: minOverlap,
    contactPoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
  };
}

function getRectCorners(r) {
  const hw = r.width / 2;
  const hh = r.height / 2;
  const angle = r.angle || 0;
  return [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ].map(c => Vec2.add(r, Vec2.rotate(c, angle)));
}

function getRectAxes(r) {
  const angle = r.angle || 0;
  const a1 = Vec2.rotate({ x: 1, y: 0 }, angle);
  const a2 = Vec2.rotate({ x: 0, y: 1 }, angle);
  return [a1, a2];
}

function projectCorners(corners, axis) {
  let min = Infinity, max = -Infinity;
  for (const c of corners) {
    const proj = Vec2.dot(c, axis);
    min = Math.min(min, proj);
    max = Math.max(max, proj);
  }
  return { min, max };
}

/**
 * Detect collision between two bodies
 */
export function detectCollision(a, b) {
  // Quick AABB check
  if (!aabbOverlap(getAABB(a), getAABB(b))) return null;

  if (a.shape === 'circle' && b.shape === 'circle') {
    return circleVsCircle(a, b);
  }
  if (a.shape === 'circle' && b.shape === 'rect') {
    return circleVsRect(a, b);
  }
  if (a.shape === 'rect' && b.shape === 'circle') {
    const result = circleVsRect(b, a);
    if (result) result.normal = Vec2.scale(result.normal, -1);
    return result;
  }
  if (a.shape === 'rect' && b.shape === 'rect') {
    return rectVsRect(a, b);
  }
  return null;
}

/**
 * Resolve collision between two bodies
 */
export function resolveCollision(a, b, collision) {
  const { normal, overlap } = collision;

  // Separate bodies
  const totalMass = (a.isStatic ? 0 : a.mass) + (b.isStatic ? 0 : b.mass);
  if (totalMass === 0) return;

  const aRatio = a.isStatic ? 0 : (b.isStatic ? 1 : b.mass / totalMass);
  const bRatio = b.isStatic ? 0 : (a.isStatic ? 1 : a.mass / totalMass);

  a.x -= normal.x * overlap * aRatio;
  a.y -= normal.y * overlap * aRatio;
  b.x += normal.x * overlap * bRatio;
  b.y += normal.y * overlap * bRatio;

  // Relative velocity
  const relVel = Vec2.sub(a.vel || { x: 0, y: 0 }, b.vel || { x: 0, y: 0 });
  const velAlongNormal = Vec2.dot(relVel, normal);

  // Only resolve if objects are approaching
  if (velAlongNormal > 0) return;

  const restitution = Math.min(a.restitution || RESTITUTION, b.restitution || RESTITUTION);
  const j = -(1 + restitution) * velAlongNormal / totalMass;

  if (!a.isStatic && a.vel) {
    a.vel.x += j * normal.x * (b.isStatic ? 1 : b.mass / totalMass) * a.mass;
    a.vel.y += j * normal.y * (b.isStatic ? 1 : b.mass / totalMass) * a.mass;
    // Add some angular velocity based on impact
    const cross = normal.x * (collision.contactPoint.y - a.y) - normal.y * (collision.contactPoint.x - a.x);
    a.angularVel = (a.angularVel || 0) + cross * j * 0.01;
  }

  if (!b.isStatic && b.vel) {
    b.vel.x -= j * normal.x * (a.isStatic ? 1 : a.mass / totalMass) * b.mass;
    b.vel.y -= j * normal.y * (a.isStatic ? 1 : a.mass / totalMass) * b.mass;
    const cross = normal.x * (collision.contactPoint.y - b.y) - normal.y * (collision.contactPoint.x - b.x);
    b.angularVel = (b.angularVel || 0) - cross * j * 0.01;
  }

  // Calculate impact force for damage
  const impactSpeed = Math.abs(velAlongNormal);
  return impactSpeed;
}

/**
 * Update physics for a single body
 */
export function updateBody(body, dt, groundY) {
  if (body.isStatic || body.sleeping) return;

  // Apply gravity
  if (!body.isStatic) {
    body.vel.y += GRAVITY * dt;
  }

  // Apply velocity
  body.x += body.vel.x * dt;
  body.y += body.vel.y * dt;

  // Apply angular velocity
  if (body.angularVel) {
    body.angle = (body.angle || 0) + body.angularVel * dt;
    body.angularVel *= ANGULAR_FRICTION;
    if (Math.abs(body.angularVel) < 0.01) body.angularVel = 0;
  }

  // Friction
  body.vel.x *= FRICTION;

  // Ground collision
  const bottom = body.shape === 'circle' ? body.y + body.radius : body.y + body.height / 2;
  if (bottom >= groundY) {
    if (body.shape === 'circle') {
      body.y = groundY - body.radius;
    } else {
      body.y = groundY - body.height / 2;
    }
    body.vel.y *= -RESTITUTION;
    body.vel.x *= 0.9; // ground friction

    if (Math.abs(body.vel.y) < 5) {
      body.vel.y = 0;
    }
  }

  // Sleep check
  const speed = Vec2.length(body.vel);
  if (speed < SLEEP_THRESHOLD && Math.abs(body.vel.y) < 1 && bottom >= groundY - 2) {
    body.sleepTimer = (body.sleepTimer || 0) + dt;
    if (body.sleepTimer > 0.5) {
      body.vel.x = 0;
      body.vel.y = 0;
      body.angularVel = 0;
      body.sleeping = true;
    }
  } else {
    body.sleepTimer = 0;
  }

  // Out of bounds
  if (body.x < -200 || body.x > 3000 || body.y > groundY + 200) {
    body.destroyed = true;
  }
}
