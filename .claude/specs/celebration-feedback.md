# Feature: Celebration Feedback

> **Status**: Ready to implement  *(all evaluation items resolved)*
> **Spec file**: `.claude/specs/celebration-feedback.md`

## Problem

After pressing `=`, the calculator gives no positive feedback. Adding a sparkle burst and a doge-style phrase makes the experience fun and memorable for hackathon judges and teammates.

## Users & Roles

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| Visitor (anyone) | See sparkle burst and doge toast after every `=` press | Nothing restricted |

## User Stories

- As a **visitor**, I want to see a neon sparkle burst after a successful calculation so that I get a moment of delight
- As a **visitor**, I want to see a funny doge phrase based on the operator I used so that the calculator feels playful

## Acceptance Criteria

**Sparkle animation:**
- [ ] Triggers on every successful `=` press (result is a number, not Error)
- [ ] Does NOT trigger if the result is `Error`
- [ ] Neon pink (`#ff00e6`) and neon green (`#00e676`) particles only
- [ ] Short burst — animation completes and fades out within 1–1.5 seconds
- [ ] Particles originate near the display/button area
- [ ] No external libraries — canvas or pure CSS only
- [ ] Does not block interaction with the calculator during animation

**Doge toast:**
- [ ] Triggers after every `=` press, including when the result is `Error`
- [ ] Displays a small doge icon (emoji `🐕` or simple ASCII/Unicode) + speech bubble with phrase
- [ ] Phrase is determined by the operator used in the final computation:
  - `+` → `"MUCH additions"`
  - `−` → `"VERY subtract"`
  - `×` → `"SO multiply"`
  - `÷` → `"SUCH divide"`
  - Error / no operator context → `"WOW big MATHS"`
  - Any other fallback → randomly choose `"AMAZE result"` or `"WOW big MATHS"`
- [ ] Toast auto-hides after ~3 seconds
- [ ] If `=` is pressed again while a toast is already visible, the previous toast is dismissed and a new one appears immediately
- [ ] Toast is positioned at the top of the calculator card (not full-page overlay)
- [ ] Styled to match the cyberpunk theme (dark bg, neon border/text, subtle glow)
- [ ] Does not obstruct the display or buttons

**General:**
- [ ] Calculator logic and existing tests are unaffected
- [ ] Celebration logic lives in its own file: `celebration.js`
- [ ] `calculator.js` captures the operator in a local variable *before* calling `setError()` or clearing state, then passes it into `triggerCelebration(capturedOperator, isError)`
- [ ] If the operator is unknown/null at call time, `triggerCelebration(null, true)` is used — phrase falls back to `"WOW big MATHS"`
- [ ] Unit tests verify correct phrase selection for `+`, `−`, `×`, `÷`, `null` (fallback), and Error case
- [ ] Tests verify sparkles trigger only on success (not Error) and toast triggers on both success and Error

## Out of Scope

- Sound effects or audio feedback
- Different animation styles per operator
- Keeping a history of doge phrases shown
- Confetti or full-screen animations
- Accessibility announcements for the sparkle animation (toast is sufficient)

## Data Model Changes

No schema changes required.

## UI / UX Notes

**Sparkle burst:**
- Canvas element overlaid on the calculator (positioned absolute/fixed, pointer-events: none)
- Particles spawn from the display panel area and fly outward/upward briefly
- Particle colors: `#ff00e6` (neon pink) and `#00e676` (neon green) only
- No trailing effects — clean burst and fade

**Doge toast:**
- Floats **outside** the `.calculator` card, appended to `.app` and positioned above the card using absolute/relative positioning — never overlapping the display or buttons
- Small pill/banner shape: `🐕 [phrase]`
- Neon pink/magenta border with glow to match the celebratory vibe
- Fades in, auto-fades out at ~3s mark via CSS transition
- `z-index` high enough to appear above the card

**Sparkle canvas:**
- Canvas is placed in the `.app` wrapper (or `position: fixed`) — NOT inside `.calculator` (which has `overflow: hidden` and would clip particles)
- Canvas is sized and positioned programmatically to match the `.calculator` bounding box at trigger time using `getBoundingClientRect()`

## Open Questions

*(none)*

## Notes

- `celebration.js` exposes a single function: `triggerCelebration(operator, isError)`
- `calculator.js` captures the operator locally before state is cleared, then calls `triggerCelebration(capturedOp, isError)` at the end of both `calculate()` and the error path
- Canvas is positioned via `position: fixed` using `.calculator`'s `getBoundingClientRect()` at call time — no canvas inside the card
- Use `requestAnimationFrame` for sparkle loop; cancel the animation frame when burst is complete
- Toast dismiss: `setTimeout` + CSS `opacity` transition; cancel + restart on re-trigger
- Depends on: `calculator.js` (existing), `index.html` (add `<script src="celebration.js">` — after `calculator.js`; no extra HTML elements needed, both canvas and toast are created dynamically in JS)
