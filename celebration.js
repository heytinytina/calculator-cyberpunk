'use strict';

// ============================================================
// Phrase mapping
// ============================================================

const DOGE_PHRASES = {
  '+': 'MUCH additions',
  '−': 'VERY subtract',
  '×': 'SO multiply',
  '÷': 'SUCH divide',
};

const FALLBACK_PHRASES = ['AMAZE result', 'WOW big MATHS'];

function getPhrase(operator, isError) {
  if (isError || operator === null || operator === undefined) return 'WOW big MATHS';
  return DOGE_PHRASES[operator] ?? FALLBACK_PHRASES[Math.floor(Math.random() * FALLBACK_PHRASES.length)];
}

// ============================================================
// Doge Toast
// ============================================================

let _toastEl = null;
let _toastTimeout = null;

function showToast(operator, isError) {
  if (_toastEl) {
    clearTimeout(_toastTimeout);
    _toastEl.remove();
    _toastEl = null;
  }

  const calcEl = document.querySelector('.calculator');
  if (!calcEl) return;
  const rect = calcEl.getBoundingClientRect();

  _toastEl = document.createElement('div');
  _toastEl.className = 'doge-toast';
  _toastEl.textContent = `\uD83D\uDC15 ${getPhrase(operator, isError)}`;

  // Position off-screen initially so we can measure height before showing
  _toastEl.style.cssText = `position:fixed;left:${rect.left}px;width:${rect.width}px;top:-9999px;`;
  document.body.appendChild(_toastEl);

  // Measure, then snap into place above the calculator
  const toastH = _toastEl.offsetHeight;
  _toastEl.style.top = `${Math.max(8, rect.top - toastH - 8)}px`;

  // Fade in (double-RAF so the initial opacity:0 from CSS is applied first)
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (_toastEl) _toastEl.classList.add('doge-toast--visible');
    });
  });

  // Auto-dismiss after 3 s
  _toastTimeout = setTimeout(() => {
    if (!_toastEl) return;
    _toastEl.classList.remove('doge-toast--visible');
    _toastEl.addEventListener('transitionend', () => {
      if (_toastEl) { _toastEl.remove(); _toastEl = null; }
    }, { once: true });
  }, 3000);
}

// ============================================================
// Sparkle Canvas
// ============================================================

const SPARK_COLORS = ['#ff00e6', '#00e676'];
const PARTICLE_COUNT = 40;
const CANVAS_BUFFER = 60;

let _sparkCanvas = null;
let _sparkCtx = null;
let _sparkAnimId = null;
let _particles = [];

function _spawnParticles(canvasW, canvasH) {
  _particles = [];
  const cx = canvasW / 2;
  const cy = canvasH * 0.25; // spawn near the display area (upper portion)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.8 + Math.random() * 3.2;
    _particles.push({
      x:  cx + (Math.random() - 0.5) * canvasW * 0.5,
      y:  cy + (Math.random() - 0.5) * canvasH * 0.2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,   // upward bias
      size:    2 + Math.random() * 4,
      color:   SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      opacity: 1,
      decay:   0.015 + Math.random() * 0.025,
    });
  }
}

function _animateSparks() {
  if (!_sparkCanvas || !_sparkCtx) return;
  _sparkCtx.clearRect(0, 0, _sparkCanvas.width, _sparkCanvas.height);

  let alive = false;
  for (const p of _particles) {
    p.x  += p.vx;
    p.y  += p.vy;
    p.vy += 0.1;          // gravity
    p.opacity -= p.decay;
    if (p.opacity <= 0) continue;
    alive = true;

    _sparkCtx.globalAlpha = Math.max(0, p.opacity);
    _sparkCtx.fillStyle   = p.color;
    _sparkCtx.beginPath();
    _sparkCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    _sparkCtx.fill();
  }
  _sparkCtx.globalAlpha = 1;

  if (alive) {
    _sparkAnimId = requestAnimationFrame(_animateSparks);
  } else {
    _teardownCanvas();
  }
}

function _teardownCanvas() {
  if (_sparkAnimId) { cancelAnimationFrame(_sparkAnimId); _sparkAnimId = null; }
  if (_sparkCanvas) { _sparkCanvas.remove(); _sparkCanvas = null; _sparkCtx = null; }
}

function showSparks() {
  const calcEl = document.querySelector('.calculator');
  if (!calcEl) return;
  const rect = calcEl.getBoundingClientRect();

  _teardownCanvas();

  const w = rect.width  + CANVAS_BUFFER * 2;
  const h = rect.height + CANVAS_BUFFER * 2;

  _sparkCanvas = document.createElement('canvas');
  _sparkCanvas.className = 'sparkle-canvas';
  _sparkCanvas.width  = w;
  _sparkCanvas.height = h;
  _sparkCanvas.style.cssText = [
    'position:fixed',
    `top:${rect.top  - CANVAS_BUFFER}px`,
    `left:${rect.left - CANVAS_BUFFER}px`,
    `width:${w}px`,
    `height:${h}px`,
    'pointer-events:none',
    'z-index:999',
  ].join(';');

  document.body.appendChild(_sparkCanvas);
  _sparkCtx = _sparkCanvas.getContext('2d');

  _spawnParticles(w, h);
  _sparkAnimId = requestAnimationFrame(_animateSparks);
}

// ============================================================
// Public API
// ============================================================

function triggerCelebration(operator, isError) {
  showToast(operator, isError);
  if (!isError) showSparks();
}
