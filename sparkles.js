const canvas = document.getElementById('sparkles');
const ctx = canvas.getContext('2d');

const PARTICLE_COUNT = 80;
const COLORS = ['#00e676', '#69f0ae', '#ffffff', '#b9f6ca', '#ffff8d', '#ccff90'];

let particles = [];
let textRect = null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateTextRect();
}

function updateTextRect() {
  const h1 = document.querySelector('h1');
  if (h1) {
    textRect = h1.getBoundingClientRect();
  }
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnParticle() {
  if (!textRect) return null;

  const spread = 60;
  const x = randomInRange(textRect.left - spread, textRect.right + spread);
  const y = randomInRange(textRect.top - spread, textRect.bottom + spread);

  return {
    x,
    y,
    vx: randomInRange(-1.5, 1.5),
    vy: randomInRange(-2.5, -0.5),
    size: randomInRange(2, 6),
    opacity: 1,
    decay: randomInRange(0.008, 0.02),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: randomInRange(-0.1, 0.1),
  };
}

function drawStar(x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const outerX = Math.cos(angle) * size;
    const outerY = Math.sin(angle) * size;
    const innerAngle = angle + Math.PI / 4;
    const innerX = Math.cos(innerAngle) * (size * 0.3);
    const innerY = Math.sin(innerAngle) * (size * 0.3);
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function init() {
  updateTextRect();
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = spawnParticle();
    if (p) {
      p.opacity = Math.random(); // stagger so they don't all appear at once
      particles.push(p);
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.opacity -= p.decay;
    p.rotation += p.rotationSpeed;

    if (p.opacity <= 0) {
      const replacement = spawnParticle();
      if (replacement) {
        particles[i] = replacement;
      } else {
        particles.splice(i, 1);
      }
      continue;
    }

    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    drawStar(p.x, p.y, p.size, p.rotation);
  }

  // Top up if any were removed
  while (particles.length < PARTICLE_COUNT) {
    const p = spawnParticle();
    if (p) particles.push(p);
    else break;
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();

// Wait one frame for layout to settle before reading text position
requestAnimationFrame(() => {
  init();
  animate();
});
