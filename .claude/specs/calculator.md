# Feature: Calculator

> **Status**: Ready to implement
> **Spec file**: `.claude/specs/calculator.md`

## Problem

Hackathon judges and teammates need a clean, reliable general-purpose calculator to perform everyday arithmetic quickly in the browser. The app must demonstrate solid UI design and correct calculation logic without any backend or installation.

## Users & Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| Visitor (anyone) | Input numbers, use +/−/×/÷, use decimals, chain calculations, clear, backspace, use keyboard | Nothing is restricted |

## User Stories

- As a **visitor**, I want to enter numbers and operators via on-screen buttons so that I can perform calculations without a keyboard
- As a **visitor**, I want to use decimal numbers so that I can calculate non-integer values
- As a **visitor**, I want to press `=` and have the result stay on screen so that I can chain it into a new calculation
- As a **visitor**, I want to press `C` to reset everything so that I can start fresh
- As a **visitor**, I want to press `⌫` to delete the last digit so that I can correct a mistake without clearing everything
- As a **visitor**, I want to see the expression I'm building above the current number so that I always know what operation is in progress
- As a **visitor**, I want to use my keyboard for input so that I don't have to click buttons

## Acceptance Criteria

- [ ] User can input multi-digit numbers using on-screen buttons
- [ ] User can perform addition (+), subtraction (−), multiplication (×), and division (÷)
- [ ] User can input decimals — one decimal point per number (e.g., `3.14`); pressing `.` again on the same number is ignored
- [ ] Pressing `=` evaluates the expression, displays the result, and keeps it available for chaining (e.g., result `×` 2)
- [ ] `C` button clears all state — display resets to `0`
- [ ] `⌫` button removes the last digit from the current input; if only one digit remains, resets to `0`; if the display shows `Error`, `⌫` behaves like `C` (resets to `0` and clears expression)
- [ ] Display shows two lines: a smaller upper line with the expression being built (e.g., `12 +`), and a large lower line with the current number or result
- [ ] After `=` is pressed, the upper line shows the full completed expression (e.g., `12 + 5 =`) and the lower line shows the result; when the user starts typing a new number, the expression line clears
- [ ] Pressing an operator immediately after `=` continues from the result (chaining works)
- [ ] Division by zero shows `Error` on the display; the next number input (or `⌫`) resets to a fresh state
- [ ] Pressing a second operator before entering a number replaces the previous operator (no stacking)
- [ ] Leading zeros are normalized (e.g., `007` → `7`); `0.x` decimals are preserved
- [ ] Floating-point results are rounded to a maximum of 10 significant digits; trailing zeros after decimal are trimmed (e.g., `0.30000000000000004` → `0.3`)
- [ ] Number entry is capped at 12 digits (excluding the decimal point); additional digit presses beyond 12 are ignored
- [ ] `-` pressed as the first input, or immediately after an operator, starts a negative number (e.g., entering `-5`); no `±` toggle needed
- [ ] Display updates in real time with each button press
- [ ] Layout is responsive — usable on both mobile and desktop
- [ ] Cyberpunk visual theme: dark background, neon accent colors (cyan, magenta, or green), subtle glow effect on display and active elements
- [ ] Hover and press effects on buttons are subtle (no heavy animations)
- [ ] Keyboard input supported: digits `0–9`, `.`, operators `+ - * /`, `Enter` for `=`, `Backspace` for `⌫`, `Escape` for `C`

## Out of Scope

- Scientific functions (sin, cos, log, exponents, square root, etc.)
- Calculation history or memory buttons (M+, MR, MC)
- Percentage button (`%`)
- Copy result to clipboard
- Theme switcher or multiple visual themes
- Persisting state between page loads

## Data Model Changes

No schema changes required — this is a fully client-side, stateless app. All calculation state lives in memory and is cleared on page reload.

## UI / UX Notes

**Button layout** (5 rows, 4-column grid):

```
[    C    ]  [    ⌫    ]   ← each spans 2 columns
[ 7 ]  [ 8 ]  [ 9 ]  [ ÷ ]
[ 4 ]  [ 5 ]  [ 6 ]  [ × ]
[ 1 ]  [ 2 ]  [ 3 ]  [ − ]
[ 0 ]  [ . ]  [ = ]  [ + ]
```

**Display** (top of calculator, above button grid):
- Small upper line: expression in progress (e.g., `12 +` or `3.5 × 2 =`)
- Large lower line: current number being entered, or final result

**Theme**:
- Background: very dark (near black)
- Display: styled like a digital/LCD panel with neon glow
- Accent color: cyan (`#00f5ff`) as primary, with magenta or green as secondary highlights
- Buttons: dark with neon border/text; operator buttons use a distinct accent color
- Subtle `box-shadow` glow on display and on hover/active states
- Font: monospace or digital-style for the display; clean sans-serif for buttons

**Responsive behavior**:
- Calculator is centered on the page (not full-width)
- On mobile, button grid scales to fill most of the viewport width
- Touch targets are large enough for comfortable tapping

## Open Questions

- [ ] Should operator buttons use a different neon color from digit buttons, or just a different brightness? *(Decide during implementation)*

## Notes

- Calculator logic lives in `calculator.js`; UI/markup in `index.html`; styles in a linked CSS file or `<style>` block
- No external libraries — plain JS, HTML, CSS only
- Keyboard support should be added as a `keydown` event listener in `calculator.js`
- Rounding should use `parseFloat(result.toPrecision(10))` or equivalent to avoid ugly float display
- **Do not use `eval()`** — all calculation logic must use tracked state: `currentValue`, `previousValue`, `operator`, computed manually
- Negative number entry: when `-` is the first key pressed (or pressed immediately after an operator), prefix the current input with `-` rather than treating it as a subtraction operator
