# Calculator Web App

A simple, local calculator web app built for the hackathon learning phase. Runs entirely in the browser with no backend, no database, and no build step.

## Commands

```bash
# start: open index.html in your browser, or use VS Code Live Server extension
# No build, test, or lint step required for this stack
```

## Stack

- **Language**: HTML, CSS, JavaScript (vanilla)
- **Framework**: None
- **Database**: None
- **Auth**: None
- **Deployment**: Local — open index.html directly in the browser

## Architecture

- Single `index.html` entry point
- Calculator logic lives in `calculator.js` alongside the HTML
- All state is in-memory — nothing is persisted between page loads
- No routing, no server, no dependencies

## Important Gotchas

- No build step — changes are visible immediately on browser refresh
- If using VS Code Live Server, it auto-reloads on file save
- No user data is stored or collected — this is a fully client-side app

## Required Engineering Standards

**All new features and enhancements MUST include tests. See `.claude/rules/testing.md` for details.**

Every page designed MUST have a responsive design for mobile use.

**NEVER commit changes unless the user explicitly asks you to.**

**ALWAYS use the `frontend-design` skill when making or editing the UI.**

When creating new pages that are not full width, center the page — do not hug the left.

Standardize patterns by creating reusable components. If logic is likely to be repeated, create a new component. We do not want duplicate code.

> Add your own project standards below as you develop conventions.

## Rules

See `.claude/rules/` for detailed standards:

- @.claude/rules/code-style.md
- @.claude/rules/git-workflow.md
- @.claude/rules/testing.md
- @.claude/rules/security.md
