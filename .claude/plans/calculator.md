# Implementation Plan: Calculator

## Files

| File | Action | Purpose |
|------|--------|---------|
| `index.html` | Modify | Replace hello-world with calculator UI + embedded cyberpunk CSS |
| `calculator.js` | Create | Calculator class (state machine), UI binding, keyboard handler |
| `calculator.test.js` | Create | Unit tests for Calculator class logic |
| `calculator.test.html` | Create | Browser test runner — open to see pass/fail |
| `sparkles.js` | Leave as-is | Orphaned after index.html replacement; not deleted unless user asks |

## Implementation Steps

1. **Create `calculator.js`**
   - `Calculator` class with state: `currentInput`, `previousValue`, `operator`, `expression`, `isError`, `justEvaluated`, `newInputStarted`
   - Methods: `inputDigit(d)`, `inputDecimal()`, `inputOperator(op)`, `calculate()`, `clear()`, `backspace()`
   - `compute(a, op, b)` helper — manual arithmetic, no `eval()`
   - `formatResult(n)` — `parseFloat(n.toPrecision(10))`, trim trailing zeros
   - `updateDisplay()` — writes to DOM elements
   - `bindKeyboard()` — `keydown` listener mapping keys to methods
   - `bindButtons()` — wires all button `click` events

2. **Rewrite `index.html`**
   - Cyberpunk layout: dark bg, centered calculator card
   - Display panel: `#expression` (upper, small) + `#current` (lower, large) with neon glow
   - Button grid: 4-column CSS grid
   - Row 1: `C` (col-span 2), `⌫` (col-span 2)
   - Rows 2–5: `7 8 9 ÷ / 4 5 6 × / 1 2 3 − / 0 . = +`
   - Operator buttons styled with magenta accent; digits with cyan
   - `<script src="calculator.js">` at bottom

3. **Create `calculator.test.js`**
   - Tests for: digit input, decimal (one per number), operator chaining, `=` and result chaining, `C` clears all, backspace logic, error on div-by-zero, operator replacement, leading zero normalization, float rounding, 12-digit cap, negative number via leading `-`
   - Uses a plain `assert(condition, message)` helper — no test framework needed

4. **Create `calculator.test.html`**
   - Imports `calculator.js` and `calculator.test.js`
   - Renders pass/fail results in browser with cyberpunk-matching style

## Risks / Notes

- Negative number entry: `-` as first input or after an operator sets a sign flag; once a digit follows, it becomes part of `currentInput` as a negative string
- Operator replacement: tracked via `newInputStarted` — if `true` when a second operator is pressed, replace rather than evaluate
- Chaining after `=`: `justEvaluated` flag determines whether to reuse result or start fresh
- `sparkles.js` becomes a dead file — note it to user after completion
