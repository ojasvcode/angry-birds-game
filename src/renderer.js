// ============================================================
//  ANGRY BIRDS – Canvas Renderer
// ============================================================

/**
 * Draw the sky background
 */
export function drawSky(ctx, W, H, groundY) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, '#4ac4f7');
  skyGrad.addColorStop(0.5, '#87ceeb');
  skyGrad.addColorStop(1, '#a8e6ff');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, groundY);

  // Draw some clouds
  drawCloud(ctx, 200, 80, 1);
  drawCloud(ctx, 500, 50, 0.7);
  drawCloud(ctx, 800, 100, 1.2);
  drawCloud(ctx, 1100, 60, 0.8);
  drawCloud(ctx, 350, 130, 0.6);
}

function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.beginPath();
  ctx.arc(0, 0, 25, 0, Math.PI * 2);
  ctx.arc(25, -5, 20, 0, Math.PI * 2);
  ctx.arc(-25, 0, 18, 0, Math.PI * 2);
  ctx.arc(10, -15, 18, 0, Math.PI * 2);
  ctx.arc(-10, 5, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Draw the ground
 */
export function drawGround(ctx, W, H, groundY) {
  // Main ground
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, H);
  groundGrad.addColorStop(0, '#6abd2e');
  groundGrad.addColorStop(0.15, '#5a8c2a');
  groundGrad.addColorStop(0.5, '#4a7320');
  groundGrad.addColorStop(1, '#3d5e1a');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, W, H - groundY);

  // Grass line
  ctx.strokeStyle = '#7ecb3c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= W; x += 6) {
    ctx.lineTo(x, groundY + Math.sin(x * 0.05) * 2);
  }
  ctx.stroke();

  // Grass tufts
  ctx.fillStyle = '#7ecb3c';
  for (let x = 10; x < W; x += 30 + Math.sin(x) * 10) {
    const h = 5 + Math.sin(x * 0.3) * 3;
    ctx.beginPath();
    ctx.moveTo(x - 3, groundY);
    ctx.quadraticCurveTo(x - 1, groundY - h, x, groundY - h - 2);
    ctx.quadraticCurveTo(x + 1, groundY - h, x + 3, groundY);
    ctx.fill();
  }
}

/**
 * Draw hills in background
 */
export function drawHills(ctx, W, groundY) {
  // Far hills
  ctx.fillStyle = '#88c459';
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= W; x += 5) {
    ctx.lineTo(x, groundY - 20 - Math.sin(x * 0.005 + 1) * 30 - Math.sin(x * 0.01) * 15);
  }
  ctx.lineTo(W, groundY);
  ctx.closePath();
  ctx.fill();

  // Near hills
  ctx.fillStyle = '#72b039';
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = 0; x <= W; x += 5) {
    ctx.lineTo(x, groundY - 5 - Math.sin(x * 0.008 + 2) * 20 - Math.sin(x * 0.015) * 10);
  }
  ctx.lineTo(W, groundY);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw the slingshot
 */
export function drawSlingshot(ctx, x, y, groundY) {
  const baseY = groundY;
  const topY = y - 10;

  // Back fork
  ctx.fillStyle = '#5d4037';
  ctx.strokeStyle = '#3e2723';
  ctx.lineWidth = 2;

  // Left arm
  ctx.beginPath();
  ctx.moveTo(x - 15, topY);
  ctx.lineTo(x - 12, topY - 30);
  ctx.lineTo(x - 6, topY - 32);
  ctx.lineTo(x - 8, topY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(x + 8, topY);
  ctx.lineTo(x + 6, topY - 30);
  ctx.lineTo(x + 12, topY - 32);
  ctx.lineTo(x + 15, topY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Main trunk
  ctx.beginPath();
  ctx.moveTo(x - 10, topY);
  ctx.lineTo(x - 8, baseY);
  ctx.lineTo(x + 8, baseY);
  ctx.lineTo(x + 10, topY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * Draw slingshot band (rubber band)
 */
export function drawSlingshotBand(ctx, slingX, slingY, birdX, birdY, birdRadius, drawBack = true) {
  const leftArmX = slingX - 11;
  const leftArmY = slingY - 38;
  const rightArmX = slingX + 9;
  const rightArmY = slingY - 38;

  ctx.strokeStyle = '#5d3a1a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  if (drawBack) {
    // Back band (behind bird)
    ctx.beginPath();
    ctx.moveTo(rightArmX, rightArmY);
    ctx.lineTo(birdX, birdY);
    ctx.stroke();
  }

  // Front band (in front of bird, drawn after bird)
  return { leftArmX, leftArmY, rightArmX, rightArmY };
}

export function drawSlingshotBandFront(ctx, leftArmX, leftArmY, birdX, birdY) {
  ctx.strokeStyle = '#5d3a1a';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(leftArmX, leftArmY);
  ctx.lineTo(birdX, birdY);
  ctx.stroke();
}

/**
 * Draw a bird
 */
export function drawBird(ctx, bird) {
  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate(bird.angle || 0);

  const r = bird.radius;

  // Body
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = bird.color;
  ctx.fill();
  ctx.strokeStyle = bird.outline;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Highlight
  ctx.beginPath();
  ctx.arc(-r * 0.2, -r * 0.3, r * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fill();

  // Eyes
  const eyeSize = r * 0.22;
  const eyeY = -r * 0.15;

  // Left eye white
  ctx.beginPath();
  ctx.arc(-r * 0.22, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Right eye white
  ctx.beginPath();
  ctx.arc(r * 0.22, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.stroke();

  // Pupils
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.arc(-r * 0.18, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.26, eyeY, eyeSize * 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, eyeY - eyeSize * 1.2);
  ctx.lineTo(-r * 0.05, eyeY - eyeSize * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(r * 0.05, eyeY - eyeSize * 0.5);
  ctx.lineTo(r * 0.45, eyeY - eyeSize * 1.2);
  ctx.stroke();

  // Beak
  ctx.fillStyle = '#ff8f00';
  ctx.beginPath();
  ctx.moveTo(r * 0.1, r * 0.15);
  ctx.lineTo(r * 0.55, r * 0.05);
  ctx.lineTo(r * 0.1, r * 0.35);
  ctx.closePath();
  ctx.fill();

  // Tail feathers
  if (bird.birdType !== 'blue') {
    ctx.fillStyle = bird.outline;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.6);
    ctx.lineTo(-r * 1.2, -r * 0.9);
    ctx.lineTo(-r * 0.9, -r * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-r * 0.85, -r * 0.3);
    ctx.lineTo(-r * 1.3, -r * 0.4);
    ctx.lineTo(-r * 0.9, 0);
    ctx.closePath();
    ctx.fill();
  }

  // Special markings based on type
  if (bird.birdType === 'yellow') {
    // Crest
    ctx.fillStyle = bird.outline;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(-r * 0.15, -r * 1.4);
    ctx.lineTo(r * 0.15, -r);
    ctx.closePath();
    ctx.fill();
  }

  if (bird.birdType === 'black') {
    // Fuse
    ctx.strokeStyle = '#8d6e63';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(r * 0.3, -r * 1.3, r * 0.1, -r * 1.4);
    ctx.stroke();
    // Spark
    ctx.fillStyle = '#ff6f00';
    ctx.beginPath();
    ctx.arc(r * 0.1, -r * 1.4, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw a pig
 */
export function drawPig(ctx, pig) {
  ctx.save();
  ctx.translate(pig.x, pig.y);
  ctx.rotate(pig.angle || 0);

  const r = pig.radius;
  const dmg = pig.damageLevel;

  // Body
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  const pigColor = dmg >= 2 ? '#558b2f' : dmg >= 1 ? '#689f38' : '#76c043';
  ctx.fillStyle = pigColor;
  ctx.fill();
  ctx.strokeStyle = '#4a8c1e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Highlight
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.3, r * 0.35, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fill();

  // Snout
  ctx.beginPath();
  ctx.ellipse(0, r * 0.2, r * 0.35, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#8bc34a';
  ctx.fill();
  ctx.strokeStyle = '#558b2f';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Nostrils
  ctx.fillStyle = '#4a8c1e';
  ctx.beginPath();
  ctx.ellipse(-r * 0.12, r * 0.2, r * 0.06, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.12, r * 0.2, r * 0.06, r * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeY = -r * 0.2;
  const eyeSize = r * 0.2;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-r * 0.25, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(r * 0.25, eyeY, eyeSize, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  if (dmg >= 2) {
    // X eyes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    [-r * 0.25, r * 0.25].forEach(ex => {
      ctx.beginPath();
      ctx.moveTo(ex - 4, eyeY - 4);
      ctx.lineTo(ex + 4, eyeY + 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex + 4, eyeY - 4);
      ctx.lineTo(ex - 4, eyeY + 4);
      ctx.stroke();
    });
  } else if (dmg >= 1) {
    // Worried eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-r * 0.25, eyeY + 2, eyeSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.25, eyeY + 2, eyeSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Normal eyes
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-r * 0.22, eyeY, eyeSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(r * 0.28, eyeY, eyeSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Damage cracks
  if (dmg >= 1) {
    ctx.strokeStyle = '#33691e';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(r * 0.3, -r * 0.5);
    ctx.lineTo(r * 0.5, -r * 0.2);
    ctx.lineTo(r * 0.35, 0);
    ctx.stroke();
  }

  // Crown for king pig
  if (pig.pigSize === 'king') {
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.75);
    ctx.lineTo(-r * 0.6, -r * 1.1);
    ctx.lineTo(-r * 0.3, -r * 0.9);
    ctx.lineTo(0, -r * 1.2);
    ctx.lineTo(r * 0.3, -r * 0.9);
    ctx.lineTo(r * 0.6, -r * 1.1);
    ctx.lineTo(r * 0.5, -r * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Ears
  ctx.fillStyle = pigColor;
  ctx.beginPath();
  ctx.ellipse(-r * 0.75, -r * 0.4, r * 0.15, r * 0.2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4a8c1e';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(r * 0.75, -r * 0.4, r * 0.15, r * 0.2, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw a block
 */
export function drawBlock(ctx, block) {
  ctx.save();
  ctx.translate(block.x, block.y);
  ctx.rotate(block.angle || 0);

  const hw = block.width / 2;
  const hh = block.height / 2;

  ctx.globalAlpha = block.opacity || 1;

  // Block body
  ctx.fillStyle = block.color;
  ctx.fillRect(-hw, -hh, block.width, block.height);

  // Texture based on material
  if (block.material === 'wood') {
    // Wood grain lines
    ctx.strokeStyle = 'rgba(90, 55, 30, 0.3)';
    ctx.lineWidth = 1;
    for (let i = -hh + 4; i < hh; i += 6) {
      ctx.beginPath();
      ctx.moveTo(-hw, i);
      ctx.lineTo(hw, i + Math.sin(i * 0.5) * 2);
      ctx.stroke();
    }
  } else if (block.material === 'stone') {
    // Stone texture dots
    ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
    for (let i = 0; i < 5; i++) {
      const sx = (Math.sin(i * 7.3 + block.x) * 0.4) * block.width;
      const sy = (Math.cos(i * 5.1 + block.y) * 0.4) * block.height;
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (block.material === 'ice') {
    // Ice shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(-hw + 2, -hh + 2, block.width * 0.3, block.height * 0.3);
    // Ice sparkle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(hw * 0.3, -hh * 0.3, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Border
  ctx.strokeStyle = block.outline;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-hw, -hh, block.width, block.height);

  // Damage cracks
  const dmg = block.damageLevel;
  if (dmg >= 1) {
    ctx.strokeStyle = block.crackColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = (block.opacity || 1) * 0.7;

    ctx.beginPath();
    ctx.moveTo(-hw * 0.2, -hh);
    ctx.lineTo(0, -hh * 0.3);
    ctx.lineTo(hw * 0.3, hh * 0.2);
    ctx.stroke();

    if (dmg >= 2) {
      ctx.beginPath();
      ctx.moveTo(hw, -hh * 0.5);
      ctx.lineTo(hw * 0.2, 0);
      ctx.lineTo(-hw * 0.4, hh);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-hw * 0.6, -hh * 0.3);
      ctx.lineTo(-hw * 0.1, hh * 0.5);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;
  ctx.restore();
}

/**
 * Draw trajectory dots
 */
export function drawTrajectory(ctx, points) {
  for (let i = 0; i < points.length; i++) {
    const alpha = 1 - i / points.length;
    const size = 3 - (i / points.length) * 2;
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, Math.max(1, size), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
    ctx.fill();
  }
}

/**
 * Draw bird trail
 */
export function drawTrail(ctx, trail, color) {
  if (trail.length < 2) return;

  for (let i = 0; i < trail.length - 1; i++) {
    const alpha = (i / trail.length) * 0.4;
    const size = (i / trail.length) * 3;
    ctx.beginPath();
    ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();
  }
}

/**
 * Draw particles
 */
export function drawParticles(ctx, particles) {
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.globalAlpha = alpha;

    if (p.type === 'explosion') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'spark') {
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      // Debris
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

/**
 * Draw score popups
 */
export function drawScorePopups(ctx, popups) {
  for (const p of popups) {
    const alpha = p.life / p.maxLife;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 18px "Luckiest Guy", cursive';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.strokeText(`+${p.score}`, p.x, p.y);
    ctx.fillText(`+${p.score}`, p.x, p.y);
    ctx.globalAlpha = 1;
    ctx.restore();
  }
}

/**
 * Draw waiting birds queue
 */
export function drawBirdQueue(ctx, birds, groundY) {
  const startX = 60;
  const y = groundY - 8;

  for (let i = 0; i < birds.length; i++) {
    const bird = birds[i];
    const x = startX + i * 30;
    const r = bird.radius * 0.6;

    ctx.save();
    ctx.translate(x, y);

    // Simple mini bird
    ctx.beginPath();
    ctx.arc(0, -r, r, 0, Math.PI * 2);
    ctx.fillStyle = bird.color;
    ctx.fill();
    ctx.strokeStyle = bird.outline;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-r * 0.2, -r - r * 0.15, r * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r - r * 0.15, r * 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

/**
 * Draw aiming line when pulling the slingshot
 */
export function drawAimGuide(ctx, slingX, slingY, birdX, birdY, power) {
  // Draw power indicator arc
  const maxPull = 100;
  const pullRatio = Math.min(power / maxPull, 1);

  // Direction arrow
  const dx = slingX - birdX;
  const dy = slingY - birdY;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len > 5) {
    const dirX = dx / len;
    const dirY = dy / len;

    // Dotted trajectory preview
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + pullRatio * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(slingX, slingY - 40);

    let px = slingX;
    let py = slingY - 40;
    let vx = dirX * power * 6;
    let vy = dirY * power * 6;

    for (let t = 0; t < 15; t++) {
      px += vx * 0.04;
      py += vy * 0.04;
      vy += 600 * 0.04; // gravity
      ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
