'use strict';

// ============================================================
// getPhrase — phrase mapping logic
// ============================================================

it('getPhrase: + → MUCH additions', () => {
  expect(getPhrase('+', false)).toBe('MUCH additions');
});

it('getPhrase: − → VERY subtract', () => {
  expect(getPhrase('−', false)).toBe('VERY subtract');
});

it('getPhrase: × → SO multiply', () => {
  expect(getPhrase('×', false)).toBe('SO multiply');
});

it('getPhrase: ÷ → SUCH divide', () => {
  expect(getPhrase('÷', false)).toBe('SUCH divide');
});

it('getPhrase: null operator → WOW big MATHS', () => {
  expect(getPhrase(null, false)).toBe('WOW big MATHS');
});

it('getPhrase: isError=true overrides operator → WOW big MATHS', () => {
  expect(getPhrase('+', true)).toBe('WOW big MATHS');
  expect(getPhrase('×', true)).toBe('WOW big MATHS');
});

it('getPhrase: undefined operator → WOW big MATHS', () => {
  expect(getPhrase(undefined, false)).toBe('WOW big MATHS');
});

it('getPhrase: unknown operator → AMAZE result or WOW big MATHS', () => {
  const phrase = getPhrase('?', false);
  const valid = ['AMAZE result', 'WOW big MATHS'];
  if (!valid.includes(phrase)) {
    throw new Error(`Expected one of ${JSON.stringify(valid)}, got "${phrase}"`);
  }
});

// ============================================================
// triggerCelebration — toast DOM tests
// (requires .calculator stub in the test HTML)
// ============================================================

it('toast appears in DOM on success', () => {
  document.querySelectorAll('.doge-toast').forEach(el => el.remove());
  triggerCelebration('+', false);
  const toast = document.querySelector('.doge-toast');
  if (!toast) throw new Error('Toast element not found in DOM');
  expect(toast.textContent.includes('MUCH additions')).toBe(true);
  toast.remove();
});

it('toast appears in DOM on error', () => {
  document.querySelectorAll('.doge-toast').forEach(el => el.remove());
  triggerCelebration(null, true);
  const toast = document.querySelector('.doge-toast');
  if (!toast) throw new Error('Toast element not found in DOM');
  expect(toast.textContent.includes('WOW big MATHS')).toBe(true);
  toast.remove();
});

it('toast uses correct operator phrase', () => {
  document.querySelectorAll('.doge-toast').forEach(el => el.remove());
  triggerCelebration('÷', false);
  const toast = document.querySelector('.doge-toast');
  if (!toast) throw new Error('Toast not found');
  expect(toast.textContent.includes('SUCH divide')).toBe(true);
  toast.remove();
});

it('re-triggering replaces existing toast immediately', () => {
  document.querySelectorAll('.doge-toast').forEach(el => el.remove());
  triggerCelebration('+', false);
  triggerCelebration('×', false);
  const toasts = document.querySelectorAll('.doge-toast');
  if (toasts.length !== 1) throw new Error(`Expected 1 toast, found ${toasts.length}`);
  expect(toasts[0].textContent.includes('SO multiply')).toBe(true);
  toasts[0].remove();
});

// ============================================================
// triggerCelebration — sparkle canvas tests
// ============================================================

it('sparkle canvas is created on success', () => {
  document.querySelectorAll('canvas.sparkle-canvas').forEach(el => el.remove());
  triggerCelebration('+', false);
  const canvas = document.querySelector('canvas.sparkle-canvas');
  if (!canvas) throw new Error('Sparkle canvas not found in DOM after success');
  canvas.remove();
});

it('sparkle canvas is NOT created on error', () => {
  document.querySelectorAll('canvas.sparkle-canvas').forEach(el => el.remove());
  triggerCelebration(null, true);
  const canvas = document.querySelector('canvas.sparkle-canvas');
  if (canvas) {
    canvas.remove();
    throw new Error('Sparkle canvas should NOT be created when isError=true');
  }
});
