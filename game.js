const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const restartBtn = document.getElementById('restart');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PLAYER_WIDTH = 42;
const PLAYER_HEIGHT = 54;
const PLAYER_SPEED = 320;
const BULLET_SPEED = 520;
const BULLET_COOLDOWN = 160;
const ENEMY_BASE_SPEED = 120;
const ENEMY_SPAWN_BASE = 950;
const ENEMY_BULLET_SPEED = 180;
const STAR_COUNT = 70;

let lastTime = 0;
let spawnTimer = 0;
let enemySpeedMultiplier = 1;
let enemySpawnRate = ENEMY_SPAWN_BASE;

const keys = new Set();

const player = {
  x: WIDTH / 2 - PLAYER_WIDTH / 2,
  y: HEIGHT - PLAYER_HEIGHT - 30,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT,
  lives: 3,
  score: 0,
  cooldown: 0,
};

const bullets = [];
const enemies = [];
const enemyBullets = [];
const particles = [];
const stars = [];
let playing = true;

function resetGame() {
  player.x = WIDTH / 2 - PLAYER_WIDTH / 2;
  player.y = HEIGHT - PLAYER_HEIGHT - 30;
  player.lives = 3;
  player.score = 0;
  player.cooldown = 0;
  bullets.length = 0;
  enemies.length = 0;
  enemyBullets.length = 0;
  particles.length = 0;
  spawnTimer = 0;
  enemySpeedMultiplier = 1;
  enemySpawnRate = ENEMY_SPAWN_BASE;
  playing = true;
  updateHud();
  hideOverlay();
}

function updateHud() {
  scoreEl.textContent = `Score: ${player.score}`;
  livesEl.textContent = `Lives: ${player.lives}`;
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

function showOverlay(title, message) {
  overlayTitle.textContent = title;
  overlayMessage.textContent = message;
  overlay.classList.remove('hidden');
}

function spawnStars() {
  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      radius: Math.random() * 1.8 + 0.2,
      speed: Math.random() * 35 + 15,
    });
  }
}

function updateStars(dt) {
  for (const star of stars) {
    star.y += star.speed * dt;
    if (star.y > HEIGHT) {
      star.y = 0;
      star.x = Math.random() * WIDTH;
      star.radius = Math.random() * 2 + 0.2;
    }
  }
}

function drawStars() {
  ctx.save();
  ctx.fillStyle = '#76a9ff';
  for (const star of stars) {
    ctx.globalAlpha = Math.min(1, 0.6 + star.radius * 0.4);
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function createBullet(x, y) {
  bullets.push({
    x,
    y,
    width: 6,
    height: 16,
    speed: BULLET_SPEED,
  });
}

function createEnemyBullet(x, y) {
  enemyBullets.push({
    x,
    y,
    width: 8,
    height: 18,
    speed: ENEMY_BULLET_SPEED,
  });
}

function spawnEnemy() {
  const width = 36 + Math.random() * 20;
  const height = 36 + Math.random() * 20;
  const health = Math.random() > 0.8 ? 3 : 1;
  const fireRate = health > 1 ? 1800 : 2600;
  const enemy = {
    x: Math.random() * (WIDTH - width),
    y: -height,
    width,
    height,
    speed: (ENEMY_BASE_SPEED + Math.random() * 60) * enemySpeedMultiplier,
    sineOffset: Math.random() * Math.PI * 2,
    amplitude: Math.random() * 40 + 20,
    health,
    fireCooldown: Math.random() * fireRate,
    fireRate,
    points: health > 1 ? 150 : 60,
  };
  enemies.push(enemy);
}

function emitParticles(x, y, count, color) {
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 140 + 40;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: Math.random() * 0.4 + 0.4,
      radius: Math.random() * 3 + 1,
      color,
    });
  }
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    p.radius *= 0.96;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life * 2);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0, p.radius), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function updatePlayer(dt) {
  let dx = 0;
  let dy = 0;
  if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
  if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
  if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
  if (keys.has('ArrowDown') || keys.has('s')) dy += 1;

  if (dx !== 0 && dy !== 0) {
    const inv = 1 / Math.sqrt(2);
    dx *= inv;
    dy *= inv;
  }

  player.x += dx * PLAYER_SPEED * dt;
  player.y += dy * PLAYER_SPEED * dt;
  player.x = clamp(player.x, 12, WIDTH - player.width - 12);
  player.y = clamp(player.y, HEIGHT * 0.45, HEIGHT - player.height - 12);

  if (player.cooldown > 0) {
    player.cooldown -= dt * 1000;
  }

  if (keys.has(' ') && player.cooldown <= 0) {
    createBullet(player.x + player.width / 2 - 4, player.y - 10);
    createBullet(player.x + player.width / 2 + 8, player.y - 16);
    emitParticles(player.x + player.width / 2, player.y + player.height, 6, '#7bf9ff');
    player.cooldown = BULLET_COOLDOWN;
  }
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const bullet = bullets[i];
    bullet.y -= bullet.speed * dt;
    if (bullet.y + bullet.height < 0) {
      bullets.splice(i, 1);
    }
  }
}

function updateEnemyBullets(dt) {
  for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
    const bullet = enemyBullets[i];
    bullet.y += bullet.speed * dt;
    if (bullet.y > HEIGHT) {
      enemyBullets.splice(i, 1);
    }
  }
}

function updateEnemies(dt) {
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];
    enemy.y += enemy.speed * dt;
    enemy.x += Math.sin(Date.now() * 0.002 + enemy.sineOffset) * enemy.amplitude * dt;
    enemy.fireCooldown -= dt * 1000;
    if (enemy.fireCooldown <= 0) {
      createEnemyBullet(enemy.x + enemy.width / 2 - 4, enemy.y + enemy.height);
      enemy.fireCooldown = enemy.fireRate;
    }

    if (enemy.y > HEIGHT + enemy.height) {
      enemies.splice(i, 1);
      continue;
    }

    for (let j = bullets.length - 1; j >= 0; j -= 1) {
      const bullet = bullets[j];
      if (rectsOverlap(enemy, bullet)) {
        bullets.splice(j, 1);
        enemy.health -= 1;
        emitParticles(bullet.x, bullet.y, 4, '#ffd66b');
        if (enemy.health <= 0) {
          player.score += enemy.points;
          emitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 25, '#ff5f64');
          enemies.splice(i, 1);
        }
        break;
      }
    }
  }
}

function checkCollisions() {
  for (let i = enemyBullets.length - 1; i >= 0; i -= 1) {
    const bullet = enemyBullets[i];
    if (rectsOverlap(bullet, player)) {
      enemyBullets.splice(i, 1);
      damagePlayer();
      return;
    }
  }

  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const enemy = enemies[i];
    if (rectsOverlap(enemy, player)) {
      enemies.splice(i, 1);
      emitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20, '#ff5f64');
      damagePlayer();
      return;
    }
  }
}

function damagePlayer() {
  emitParticles(player.x + player.width / 2, player.y + player.height / 2, 40, '#6be0ff');
  player.lives -= 1;
  updateHud();
  if (player.lives <= 0) {
    playing = false;
    showOverlay('Game Over', `Final score: ${player.score}`);
  } else {
    player.x = WIDTH / 2 - player.width / 2;
    player.y = HEIGHT - player.height - 30;
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
  ctx.fillStyle = '#4ff5ff';
  ctx.beginPath();
  ctx.moveTo(0, -player.height / 2);
  ctx.lineTo(player.width / 2, player.height / 2);
  ctx.lineTo(0, player.height / 4);
  ctx.lineTo(-player.width / 2, player.height / 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#0c2f54';
  ctx.fillRect(-6, -player.height / 6, 12, player.height / 2);
  ctx.restore();
}

function drawBullets() {
  ctx.fillStyle = '#8cf9ff';
  for (const bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function drawEnemyBullets() {
  ctx.fillStyle = '#ff9671';
  for (const bullet of enemyBullets) {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function drawEnemies() {
  for (const enemy of enemies) {
    ctx.save();
    ctx.translate(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
    const gradient = ctx.createLinearGradient(0, -enemy.height / 2, 0, enemy.height / 2);
    gradient.addColorStop(0, '#ff6b6b');
    gradient.addColorStop(1, '#ff9e7c');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, -enemy.height / 2);
    ctx.lineTo(enemy.width / 2, enemy.height / 2);
    ctx.lineTo(-enemy.width / 2, enemy.height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(-enemy.width / 4, -enemy.height / 4, enemy.width / 2, enemy.height / 1.6);
    ctx.restore();
  }
}

function advanceDifficulty(dt) {
  const speedTarget = 1 + player.score / 4000;
  enemySpeedMultiplier += (speedTarget - enemySpeedMultiplier) * dt * 0.7;
  const spawnTarget = Math.max(380, ENEMY_SPAWN_BASE - player.score * 0.5);
  enemySpawnRate += (spawnTarget - enemySpawnRate) * dt * 2;
}

function updateGame(dt) {
  if (!playing) return;
  updateStars(dt);
  updatePlayer(dt);
  updateBullets(dt);
  updateEnemyBullets(dt);
  updateEnemies(dt);
  updateParticles(dt);
  checkCollisions();
  advanceDifficulty(dt);

  spawnTimer += dt * 1000;
  if (spawnTimer >= enemySpawnRate) {
    spawnEnemy();
    spawnTimer = 0;
  }

  updateHud();
}

function drawGame() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawStars();
  drawBullets();
  drawEnemyBullets();
  drawEnemies();
  drawPlayer();
  drawParticles();
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 1 / 30);
  lastTime = timestamp;
  updateGame(dt);
  drawGame();
  requestAnimationFrame(loop);
}

function init() {
  spawnStars();
  updateHud();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (event) => {
  keys.add(event.key);
  if (event.key === ' ') event.preventDefault();
});

window.addEventListener('keyup', (event) => {
  keys.delete(event.key);
});

canvas.addEventListener('pointermove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  player.x = clamp(x - player.width / 2, 12, WIDTH - player.width - 12);
  player.y = clamp(y - player.height / 2, HEIGHT * 0.45, HEIGHT - player.height - 12);
});

canvas.addEventListener('pointerdown', () => {
  keys.add(' ');
});

canvas.addEventListener('pointerup', () => {
  keys.delete(' ');
});

restartBtn.addEventListener('click', () => {
  resetGame();
});

init();
