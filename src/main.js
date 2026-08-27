// ============================================================
//  ANGRY BIRDS – Main Game
// ============================================================

import {
  updateBody,
  detectCollision,
  resolveCollision,
  Vec2,
  GRAVITY,
} from './physics.js';

import {
  createBird,
  createPig,
  createBlock,
  createGround,
  createParticle,
  createScorePopup,
  useBirdAbility,
} from './entities.js';

import { LEVELS, buildLevel } from './levels.js';

import {
  drawSky,
  drawGround,
  drawHills,
  drawSlingshot,
  drawSlingshotBand,
  drawSlingshotBandFront,
  drawBird,
  drawPig,
  drawBlock,
  drawTrajectory,
  drawTrail,
  drawParticles,
  drawScorePopups,
  drawBirdQueue,
  drawAimGuide,
} from './renderer.js';

// ======================== CONSTANTS ========================

const SLING_X = 180;
const MAX_PULL = 100;
const LAUNCH_MULTIPLIER = 8;
const DAMAGE_THRESHOLD = 80;
const SETTLE_TIME = 2.5;

// ======================== STATE ========================

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let W, H, GROUND_Y, SLING_Y;
let gameState = 'menu';
let currentLevel = 0;
let score = 0;
let cameraX = 0;
let targetCameraX = 0;

let birds = [];
let pigs = [];
let blocks = [];
let particles = [];
let scorePopups = [];
let currentBird = null;
let birdQueue = [];

let isDragging = false;
let dragStart = { x: 0, y: 0 };
let birdOnSling = { x: 0, y: 0 };
let pullVector = { x: 0, y: 0 };

let lastTime = 0;
let settleTimer = 0;
let birdFlyTimer = 0;

let levelProgress = JSON.parse(localStorage.getItem('angrybirds_progress') || '{}');

let extraProjectiles = [];

// ======================== INIT ========================

function resize() {
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  GROUND_Y = H * 0.82;
  SLING_Y = GROUND_Y;
}

window.addEventListener('resize', resize);
resize();

// ======================== UI REFERENCES ========================

const startScreen = document.getElementById('start-screen');
const gameHud = document.getElementById('game-hud');
const levelCompleteScreen = document.getElementById('level-complete');
const gameOverScreen = document.getElementById('game-over');
const levelSelectScreen = document.getElementById('level-select');
const levelGrid = document.getElementById('level-grid');

const scoreValue = document.getElementById('score-value');
const birdsValue = document.getElementById('birds-value');
const levelDisplay = document.getElementById('level-display');
const finalScoreValue = document.getElementById('final-score-value');
const starsContainer = document.getElementById('stars-container');

document.getElementById('play-btn').addEventListener('click', showLevelSelect);
document.getElementById('restart-btn').addEventListener('click', () => loadLevel(currentLevel));
document.getElementById('menu-btn').addEventListener('click', showMenu);
document.getElementById('next-level-btn').addEventListener('click', nextLevel);
document.getElementById('replay-btn').addEventListener('click', () => loadLevel(currentLevel));
document.getElementById('retry-btn').addEventListener('click', () => loadLevel(currentLevel));
document.getElementById('back-menu-btn').addEventListener('click', showMenu);
document.getElementById('back-btn').addEventListener('click', showMenu);

function showScreen(screen) {
  [startScreen, levelCompleteScreen, gameOverScreen, levelSelectScreen].forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('active');
  });
  if (screen) {
    screen.classList.remove('hidden');
    screen.classList.add('active');
  }
}

function showMenu() {
  gameState = 'menu';
  gameHud.classList.add('hidden');
  showScreen(startScreen);
}

function showLevelSelect() {
  showScreen(levelSelectScreen);
  buildLevelGrid();
}

function buildLevelGrid() {
  levelGrid.innerHTML = '';
  for (let i = 0; i < LEVELS.length; i++) {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    const isUnlocked = i === 0 || levelProgress[i - 1];

    if (!isUnlocked) {
      btn.classList.add('locked');
      btn.innerHTML = '<span>\uD83D\uDD12</span>';
    } else {
      const stars = levelProgress[i]?.stars || 0;
      btn.innerHTML = '<span>' + (i + 1) + '</span><span class="level-stars">' + '\u2B50'.repeat(stars) + '\u2606'.repeat(3 - stars) + '</span>';
      btn.addEventListener('click', () => {
        currentLevel = i;
        loadLevel(i);
      });
    }

    levelGrid.appendChild(btn);
  }
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= LEVELS.length) {
    showMenu();
  } else {
    loadLevel(currentLevel);
  }
}

// ======================== LEVEL LOADING ========================

function loadLevel(index) {
  showScreen(null);
  gameHud.classList.remove('hidden');

  const levelData = buildLevel(index, GROUND_Y, SLING_X, SLING_Y);
  if (!levelData) {
    showMenu();
    return;
  }

  score = 0;
  particles = [];
  scorePopups = [];
  settleTimer = 0;
  birdFlyTimer = 0;
  cameraX = 0;
  targetCameraX = 0;
  isDragging = false;
  extraProjectiles = [];

  birds = levelData.birds;
  pigs = levelData.pigs;
  blocks = levelData.blocks;
  birdQueue = birds.slice(1);
  currentBird = birds[0];

  if (currentBird) {
    currentBird.x = SLING_X;
    currentBird.y = SLING_Y - 40;
    birdOnSling = { x: currentBird.x, y: currentBird.y };
  }

  levelDisplay.textContent = 'Level ' + (index + 1);
  updateHUD();

  gameState = 'playing';
}

function updateHUD() {
  scoreValue.textContent = score.toLocaleString();
  birdsValue.textContent = birdQueue.length + (currentBird ? 1 : 0);
}

// ======================== INPUT ========================

function getInputPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left + cameraX,
    y: clientY - rect.top,
  };
}

function onPointerDown(e) {
  e.preventDefault();
  if (gameState !== 'playing' || !currentBird || currentBird.launched) return;

  const pos = getInputPos(e);
  const dist = Vec2.distance(pos, { x: currentBird.x, y: currentBird.y });

  if (dist < 50) {
    isDragging = true;
    gameState = 'aiming';
    dragStart = { x: currentBird.x, y: currentBird.y };
  }
}

function onPointerMove(e) {
  e.preventDefault();
  if (!isDragging || gameState !== 'aiming') return;

  const pos = getInputPos(e);
  const slingCenter = { x: SLING_X, y: SLING_Y - 40 };
  pullVector = Vec2.sub(pos, slingCenter);
  const pullDist = Vec2.length(pullVector);

  if (pullDist > MAX_PULL) {
    pullVector = Vec2.scale(Vec2.normalize(pullVector), MAX_PULL);
  }

  birdOnSling = Vec2.add(slingCenter, pullVector);
  currentBird.x = birdOnSling.x;
  currentBird.y = birdOnSling.y;
}

function onPointerUp(e) {
  e.preventDefault();
  if (!isDragging || gameState !== 'aiming') return;

  isDragging = false;
  const pullDist = Vec2.length(pullVector);

  if (pullDist < 10) {
    const slingCenter = { x: SLING_X, y: SLING_Y - 40 };
    currentBird.x = slingCenter.x;
    currentBird.y = slingCenter.y;
    birdOnSling = { ...slingCenter };
    gameState = 'playing';
    return;
  }

  const launchVel = Vec2.scale(pullVector, -LAUNCH_MULTIPLIER);
  currentBird.vel = launchVel;
  currentBird.launched = true;
  currentBird.sleeping = false;
  birdFlyTimer = 0;

  gameState = 'flying';
}

function onTap(e) {
  if (gameState === 'flying' && currentBird && currentBird.launched && !currentBird.abilityUsed && currentBird.ability) {
    const allBodies = [...pigs, ...blocks];
    const result = useBirdAbility(currentBird, allBodies, particles);

    if (Array.isArray(result)) {
      for (const newBird of result) {
        newBird.launched = true;
        extraProjectiles.push(newBird);
      }
    }
  }
}

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('touchstart', onPointerDown, { passive: false });
canvas.addEventListener('touchmove', onPointerMove, { passive: false });
canvas.addEventListener('touchend', onPointerUp, { passive: false });
canvas.addEventListener('click', onTap);

// ======================== GAME LOOP ========================

function update(dt) {
  if (gameState === 'menu') return;

  dt = Math.min(dt, 0.033);

  const allBodies = [...pigs, ...blocks];

  // Update current bird
  if (currentBird && currentBird.launched && !currentBird.destroyed) {
    updateBody(currentBird, dt, GROUND_Y);

    currentBird.trailTimer += dt;
    if (currentBird.trailTimer > 0.03) {
      currentBird.trail.push({ x: currentBird.x, y: currentBird.y });
      currentBird.trailTimer = 0;
      if (currentBird.trail.length > 40) currentBird.trail.shift();
    }

    birdFlyTimer += dt;

    if (currentBird.x > W * 0.35 + cameraX) {
      targetCameraX = Math.max(0, currentBird.x - W * 0.35);
    }
  }

  // Update extra projectiles
  for (const proj of extraProjectiles) {
    if (!proj.destroyed) {
      updateBody(proj, dt, GROUND_Y);
    }
  }

  // Update blocks
  for (const block of blocks) {
    if (!block.destroyed) {
      updateBody(block, dt, GROUND_Y);
    }
  }

  // Update pigs
  for (const pig of pigs) {
    if (!pig.destroyed) {
      updateBody(pig, dt, GROUND_Y);
    }
  }

  // Collision detection
  const projectiles = [currentBird, ...extraProjectiles].filter(b => b && b.launched && !b.destroyed);

  for (const bird of projectiles) {
    for (const body of allBodies) {
      if (body.destroyed) continue;
      const col = detectCollision(bird, body);
      if (col) {
        const impact = resolveCollision(bird, body, col);
        if (impact > DAMAGE_THRESHOLD * 0.3) {
          applyDamage(body, impact * 0.5);
          body.sleeping = false;
        }
      }
    }
  }

  // Body vs body collisions
  for (let i = 0; i < allBodies.length; i++) {
    if (allBodies[i].destroyed) continue;

    for (let j = i + 1; j < allBodies.length; j++) {
      if (allBodies[j].destroyed) continue;
      const col = detectCollision(allBodies[i], allBodies[j]);
      if (col) {
        const impact = resolveCollision(allBodies[i], allBodies[j], col);
        if (impact > DAMAGE_THRESHOLD * 0.5) {
          applyDamage(allBodies[i], impact * 0.3);
          applyDamage(allBodies[j], impact * 0.3);
          allBodies[i].sleeping = false;
          allBodies[j].sleeping = false;
        }
      }
    }
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vel.x * dt;
    p.y += p.vel.y * dt;
    p.vel.y += 400 * dt;
    p.angle += p.angularVel * dt;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }

  // Update score popups
  for (let i = scorePopups.length - 1; i >= 0; i--) {
    const p = scorePopups[i];
    p.x += p.vel.x * dt;
    p.y += p.vel.y * dt;
    p.life -= dt;
    if (p.life <= 0) scorePopups.splice(i, 1);
  }

  // Smooth camera
  cameraX += (targetCameraX - cameraX) * 0.08;

  // Clean up destroyed entities
  blocks = blocks.filter(b => !b.destroyed);
  pigs = pigs.filter(p => !p.destroyed);
  extraProjectiles = extraProjectiles.filter(p => !p.destroyed);

  // Check if bird has stopped / timed out
  if (gameState === 'flying') {
    const allProjectilesDone = projectiles.every(b =>
      b.destroyed || b.sleeping || birdFlyTimer > 6
    );

    if (allProjectilesDone || birdFlyTimer > 6) {
      gameState = 'settling';
      settleTimer = 0;
    }
  }

  // Settling phase
  if (gameState === 'settling') {
    settleTimer += dt;
    if (settleTimer > SETTLE_TIME) {
      const pigsAlive = pigs.filter(p => !p.destroyed).length;

      if (pigsAlive === 0) {
        onLevelComplete();
      } else {
        loadNextBird();
      }
    }
  }

  updateHUD();
}

function applyDamage(body, amount) {
  if (!body.hp) return;

  body.hp -= amount;

  const ratio = body.hp / body.maxHp;
  if (ratio <= 0) {
    body.damageLevel = 3;
    destroyBody(body);
  } else if (ratio <= 0.3) {
    body.damageLevel = 2;
  } else if (ratio <= 0.6) {
    body.damageLevel = 1;
  }
}

function destroyBody(body) {
  body.destroyed = true;

  if (body.score) {
    score += body.score;
    scorePopups.push(createScorePopup(body.x, body.y, body.score));
  }

  const color = body.color || '#999';
  const count = body.type === 'pig' ? 10 : 6;
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(body.x, body.y, color, body.type === 'pig' ? 'poof' : 'debris'));
  }

  if (body.type === 'pig') {
    for (let i = 0; i < 5; i++) {
      particles.push(createParticle(body.x, body.y, '#fff', 'spark'));
    }
  }
}

function loadNextBird() {
  if (currentBird) {
    currentBird.destroyed = true;
  }
  extraProjectiles = [];

  if (birdQueue.length > 0) {
    currentBird = birdQueue.shift();
    currentBird.x = SLING_X;
    currentBird.y = SLING_Y - 40;
    birdOnSling = { x: currentBird.x, y: currentBird.y };
    currentBird.launched = false;
    currentBird.sleeping = false;
    currentBird.trail = [];
    birdFlyTimer = 0;
    settleTimer = 0;

    targetCameraX = 0;

    gameState = 'playing';
  } else {
    onGameOver();
  }
}

function onLevelComplete() {
  gameState = 'levelComplete';

  const birdsRemaining = birdQueue.length + (currentBird && !currentBird.launched ? 1 : 0);
  const bonusScore = birdsRemaining * 10000;
  score += bonusScore;

  let stars = 1;
  if (score > 30000) stars = 2;
  if (score > 60000) stars = 3;

  const prev = levelProgress[currentLevel];
  if (!prev || prev.stars < stars || prev.score < score) {
    levelProgress[currentLevel] = { stars, score };
    localStorage.setItem('angrybirds_progress', JSON.stringify(levelProgress));
  }

  finalScoreValue.textContent = score.toLocaleString();
  const starEls = starsContainer.querySelectorAll('.star');
  starEls.forEach((el, i) => {
    el.classList.toggle('empty', i >= stars);
  });

  setTimeout(() => {
    showScreen(levelCompleteScreen);
  }, 500);
}

function onGameOver() {
  gameState = 'gameOver';
  setTimeout(() => {
    showScreen(gameOverScreen);
  }, 500);
}

// ======================== RENDER ========================

function render() {
  ctx.clearRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Background
  drawSky(ctx, W + cameraX * 2, H, GROUND_Y);
  drawHills(ctx, W + cameraX * 2, GROUND_Y);
  drawGround(ctx, W + cameraX * 2, H, GROUND_Y);

  // Bird trail
  if (currentBird && currentBird.launched) {
    drawTrail(ctx, currentBird.trail, currentBird.color);
  }

  // Slingshot
  drawSlingshot(ctx, SLING_X, SLING_Y, GROUND_Y);

  // Draw slingshot band & bird if on sling
  if (currentBird && !currentBird.launched) {
    const band = drawSlingshotBand(ctx, SLING_X, SLING_Y, currentBird.x, currentBird.y, currentBird.radius);

    drawBird(ctx, currentBird);

    drawSlingshotBandFront(ctx, band.leftArmX, band.leftArmY, currentBird.x, currentBird.y);

    if (isDragging) {
      const pullDist = Vec2.length(pullVector);
      drawAimGuide(ctx, SLING_X, SLING_Y, currentBird.x, currentBird.y, pullDist);
    }
  }

  // Draw blocks
  for (const block of blocks) {
    if (!block.destroyed) {
      drawBlock(ctx, block);
    }
  }

  // Draw pigs
  for (const pig of pigs) {
    if (!pig.destroyed) {
      drawPig(ctx, pig);
    }
  }

  // Draw launched bird
  if (currentBird && currentBird.launched && !currentBird.destroyed) {
    drawBird(ctx, currentBird);
  }

  // Draw extra projectiles
  for (const proj of extraProjectiles) {
    if (!proj.destroyed) {
      drawBird(ctx, proj);
    }
  }

  // Bird queue
  drawBirdQueue(ctx, birdQueue, GROUND_Y);

  // Particles
  drawParticles(ctx, particles);

  // Score popups
  drawScorePopups(ctx, scorePopups);

  ctx.restore();

  // Ability hint
  if (gameState === 'flying' && currentBird && !currentBird.abilityUsed && currentBird.ability) {
    ctx.save();
    ctx.font = '600 14px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    let abilityText = 'Tap to activate ability!';
    if (currentBird.birdType === 'yellow') abilityText = 'Tap for SPEED BOOST!';
    if (currentBird.birdType === 'blue') abilityText = 'Tap to SPLIT!';
    if (currentBird.birdType === 'black') abilityText = 'Tap to EXPLODE!';
    if (currentBird.birdType === 'white') abilityText = 'Tap to drop EGG BOMB!';
    ctx.fillText(abilityText, W / 2, H - 30);
    ctx.restore();
  }
}

// ======================== MAIN LOOP ========================

function gameLoop(time) {
  const dt = (time - lastTime) / 1000;
  lastTime = time;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

lastTime = performance.now();
requestAnimationFrame(gameLoop);

showMenu();
