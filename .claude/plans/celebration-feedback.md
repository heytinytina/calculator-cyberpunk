# Implementation Plan: Celebration Feedback

## Files

| File | Action | Notes |
|------|--------|-------|
| `celebration.js` | Create | Sparkle canvas + doge toast + `triggerCelebration()` public API |
| `calculator.css` | Modify | Add doge toast styles |
| `calculator.js` | Modify | Capture operator locally in `calculate()`, call `triggerCelebration` in both success and error paths |
| `index.html` | Modify | Add `<script src="celebration.js">` after `calculator.js` |
| `celebration.test.js` | Create | Unit tests: phrase mapping, trigger conditions |
| `calculator.test.html` | Modify | Add `<script src="celebration.js">` + `<script src="celebration.test.js">` |

## Implementation Steps

### 1. Create `celebration.js`
- `getPhrase(operator, isError)` — maps operator to doge phrase; error/null → `"WOW big MATHS"`; unknown operator → random fallback
- `showToast(operator, isError)` — creates `.doge-toast` div, appends to `.app`, triggers CSS fade-in; auto-dismisses via `setTimeout` at 3s with fade-out; cancels/replaces previous toast on re-trigger
- `showSparks()` — reads `.calculator` bounding box via `getBoundingClientRect()`; creates `position:fixed` canvas on `document.body` (NOT inside `.calculator`); spawns 40 pink/green particles with gravity + opacity decay; runs `requestAnimationFrame` loop; cleans up canvas when all particles fade
- `triggerCelebration(operator, isError)` — always calls `showToast`; calls `showSparks` only if `!isError`

### 2. Add toast CSS to `calculator.css`
- `.doge-toast` — positioned above `.calculator` card using absolute offset from `.app`; pill shape; dark bg + magenta border + glow; `opacity: 0`, `transition: opacity 0.3s`
- `.doge-toast--visible` — `opacity: 1`
- Mobile-safe: centered, max-width matches `.app`

### 3. Modify `calculator.js` — `calculate()`
- Add `const capturedOp = this.operator;` at top of method (before any state mutation)
- Replace `this.compute(this.previousValue, this.operator, ...)` with `this.compute(this.previousValue, capturedOp, ...)`
- Error path: after `this.setError()`, add `if (typeof triggerCelebration === 'function') triggerCelebration(capturedOp, true);`
- Success path: after `this.updateDisplay()`, add `if (typeof triggerCelebration === 'function') triggerCelebration(capturedOp, false);`

### 4. Modify `index.html`
- Add `<script src="celebration.js"></script>` after `<script src="calculator.js"></script>`

### 5. Create `celebration.test.js`
- Tests for `getPhrase`: each operator (+, −, ×, ÷), null fallback, error override, unknown operator fallback
- DOM tests: toast element exists in `.app` after `triggerCelebration('+', false)` and `triggerCelebration(null, true)`
- Sparkle test: canvas created on success, NOT created on error

### 6. Update `calculator.test.html`
- Add `<script src="celebration.js"></script>` (before test scripts, after `calculator.js`)
- Add `<script src="celebration.test.js"></script>`
- Add minimal DOM stubs (`.app`, `.calculator`) for toast/sparkle DOM tests

## Risks / Notes

- `triggerCelebration` is guarded with `typeof` check so calculator tests that don't load `celebration.js` still pass cleanly
- Canvas uses `position: fixed` so it avoids `.calculator`'s `overflow: hidden`; sized via `getBoundingClientRect()` at call time
- Toast is appended to `.app` and uses CSS to float above the `.calculator` card — no layout shift
- Load order: `calculator.js` → `celebration.js` (both in `index.html`)
