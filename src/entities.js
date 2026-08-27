// ============================================================
//  ANGRY BIRDS – Entity Factory
// ============================================================

/**
 * Create a bird entity
 */
export function createBird(type, x, y) {
  const configs = {
    red: {
      radius: 18,
      mass: 5,
      color: '#e53935',
      outline: '#b71c1c',
      name: 'Red',
      emoji: '😠',
      ability: null,
      hp: 999,
    },
    yellow: {
      radius: 16,
      mass: 4,
      color: '#fdd835',
      outline: '#f9a825',
      name: 'Chuck',
      emoji: '😤',
      ability: 'speed_boost',
      hp: 999,
    },
    blue: {
      radius: 12,
      mass: 3,
      color: '#42a5f5',
      outline: '#1565c0',
      name: 'The Blues',
      emoji: '😡',
      ability: 'split',
      hp: 999,
    },
    black: {
      radius: 22,
      mass: 8,
      color: '#37474f',
      outline: '#263238',
      name: 'Bomb',
      emoji: '💣',
      ability: 'explode',
      hp: 999,
    },
    white: {
      radius: 20,
      mass: 6,
      color: '#eceff1',
      outline: '#b0bec5',
      name: 'Matilda',
      emoji: '🥚',
      ability: 'egg_bomb',
      hp: 999,
    },
  };

  const config = configs[type] || configs.red;

  return {
    type: 'bird',
    birdType: type,
    shape: 'circle',
    x,
    y,
    vel: { x: 0, y: 0 },
    angle: 0,
    angularVel: 0,
    radius: config.radius,
    mass: config.mass,
    color: config.color,
    outline: config.outline,
    name: config.name,
    emoji: config.emoji,
    ability: config.ability,
    abilityUsed: false,
    hp: config.hp,
    restitution: 0.3,
    isStatic: false,
    launched: false,
    sleeping: false,
    destroyed: false,
    trail: [],
    trailTimer: 0,
  };
}

/**
 * Create a pig entity
 */
export function createPig(x, y, size = 'medium') {
  const sizes = {
    small: { radius: 14, mass: 3, hp: 30, score: 5000 },
    medium: { radius: 18, mass: 5, hp: 50, score: 5000 },
    large: { radius: 24, mass: 8, hp: 80, score: 10000 },
    king: { radius: 30, mass: 12, hp: 120, score: 15000 },
  };

  const s = sizes[size] || sizes.medium;

  return {
    type: 'pig',
    pigSize: size,
    shape: 'circle',
    x,
    y,
    vel: { x: 0, y: 0 },
    angle: 0,
    angularVel: 0,
    radius: s.radius,
    mass: s.mass,
    hp: s.hp,
    maxHp: s.hp,
    score: s.score,
    color: '#76c043',
    outline: '#4a8c1e',
    restitution: 0.2,
    isStatic: false,
    sleeping: false,
    destroyed: false,
    damageLevel: 0, // 0=healthy, 1=hurt, 2=critical
  };
}

/**
 * Create a block entity
 */
export function createBlock(material, x, y, width, height, angle = 0) {
  const materials = {
    wood: {
      color: '#a67c52',
      outline: '#7a5733',
      hp: 40,
      mass: 4,
      score: 500,
      crackColor: '#5d4037',
    },
    stone: {
      color: '#9e9e9e',
      outline: '#757575',
      hp: 80,
      mass: 8,
      score: 500,
      crackColor: '#424242',
    },
    ice: {
      color: '#b3e5fc',
      outline: '#4fc3f7',
      hp: 20,
      mass: 2,
      score: 500,
      crackColor: '#81d4fa',
      opacity: 0.8,
    },
  };

  const mat = materials[material] || materials.wood;

  return {
    type: 'block',
    material,
    shape: 'rect',
    x,
    y,
    width,
    height,
    vel: { x: 0, y: 0 },
    angle,
    angularVel: 0,
    mass: mat.mass * (width * height) / 1000,
    hp: mat.hp,
    maxHp: mat.hp,
    score: mat.score,
    color: mat.color,
    outline: mat.outline,
    crackColor: mat.crackColor,
    opacity: mat.opacity || 1,
    restitution: material === 'ice' ? 0.1 : 0.25,
    isStatic: false,
    sleeping: false,
    destroyed: false,
    damageLevel: 0,
  };
}

/**
 * Create the ground body (static)
 */
export function createGround(canvasWidth, groundY) {
  return {
    type: 'ground',
    shape: 'rect',
    x: canvasWidth / 2,
    y: groundY + 250,
    width: canvasWidth * 3,
    height: 500,
    angle: 0,
    mass: 999999,
    isStatic: true,
    vel: { x: 0, y: 0 },
    restitution: 0.3,
  };
}

/**
 * Apply bird ability
 */
export function useBirdAbility(bird, bodies, particles) {
  if (bird.abilityUsed || !bird.ability || !bird.launched) return null;
  bird.abilityUsed = true;

  switch (bird.ability) {
    case 'speed_boost':
      // Yellow bird – boost speed in current direction
      const speed = Math.sqrt(bird.vel.x * bird.vel.x + bird.vel.y * bird.vel.y);
      if (speed > 0) {
        const factor = 2.5;
        bird.vel.x *= factor;
        bird.vel.y *= factor;
      }
      // Visual feedback
      for (let i = 0; i < 12; i++) {
        particles.push(createParticle(bird.x, bird.y, bird.color, 'spark'));
      }
      return 'speed_boost';

    case 'split':
      // Blue bird – split into 3
      const splitBirds = [];
      for (let i = -1; i <= 1; i++) {
        if (i === 0) continue; // Original bird continues
        const clone = { ...bird };
        clone.x = bird.x + i * 10;
        clone.y = bird.y + i * 15;
        clone.vel = { x: bird.vel.x + i * 80, y: bird.vel.y + i * 60 };
        clone.radius = bird.radius * 0.8;
        clone.mass = bird.mass * 0.6;
        clone.ability = null;
        clone.abilityUsed = true;
        clone.trail = [];
        splitBirds.push(clone);
      }
      bird.radius *= 0.8;
      bird.mass *= 0.6;
      for (let i = 0; i < 8; i++) {
        particles.push(createParticle(bird.x, bird.y, bird.color, 'poof'));
      }
      return splitBirds;

    case 'explode':
      // Black bird – explode, pushing everything nearby
      const explosionRadius = 120;
      for (const body of bodies) {
        if (body === bird || body.isStatic || body.type === 'ground') continue;
        const dx = body.x - bird.x;
        const dy = body.y - bird.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < explosionRadius && dist > 0) {
          const force = (1 - dist / explosionRadius) * 600;
          body.vel.x += (dx / dist) * force;
          body.vel.y += (dy / dist) * force - 100;
          body.sleeping = false;
          if (body.hp) {
            body.hp -= force * 0.3;
          }
        }
      }
      // Create explosion particles
      for (let i = 0; i < 30; i++) {
        particles.push(createParticle(bird.x, bird.y, '#ff6f00', 'explosion'));
        particles.push(createParticle(bird.x, bird.y, '#ffab00', 'explosion'));
      }
      bird.destroyed = true;
      return 'explode';

    case 'egg_bomb':
      // White bird – drop an egg bomb downward
      const egg = createBird('red', bird.x, bird.y + 30);
      egg.radius = 10;
      egg.mass = 6;
      egg.vel = { x: 0, y: 400 };
      egg.color = '#fff';
      egg.outline = '#ccc';
      egg.ability = null;
      egg.abilityUsed = true;
      egg.launched = true;
      egg.trail = [];
      // Bird gets boost upward
      bird.vel.y -= 200;
      for (let i = 0; i < 8; i++) {
        particles.push(createParticle(bird.x, bird.y, '#fff', 'poof'));
      }
      return [egg];

    default:
      return null;
  }
}

/**
 * Create a particle for visual effects
 */
export function createParticle(x, y, color, type = 'debris') {
  const angle = Math.random() * Math.PI * 2;
  const speed = type === 'explosion' ? 100 + Math.random() * 300 : 50 + Math.random() * 150;

  return {
    x,
    y,
    vel: {
      x: Math.cos(angle) * speed * (type === 'spark' ? 2 : 1),
      y: Math.sin(angle) * speed - (type === 'explosion' ? 100 : 50),
    },
    color,
    size: type === 'explosion' ? 3 + Math.random() * 6 : 2 + Math.random() * 4,
    life: type === 'explosion' ? 0.6 + Math.random() * 0.4 : 0.4 + Math.random() * 0.6,
    maxLife: 1,
    type,
    angle: Math.random() * Math.PI * 2,
    angularVel: (Math.random() - 0.5) * 10,
  };
}

/**
 * Create a score popup
 */
export function createScorePopup(x, y, score) {
  return {
    x,
    y,
    score,
    life: 1.2,
    maxLife: 1.2,
    vel: { x: (Math.random() - 0.5) * 20, y: -60 },
  };
}
