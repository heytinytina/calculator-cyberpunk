# Presentation Guide
## Claude Starter Template — IT Staff Walkthrough

---

## Before You Start

- Have this repo open in your IDE with the file tree visible
- Have Claude Code running in a terminal tab
- Have the CTO's slide visible if needed for reference

---

## Opening (Non-Technical — 1–2 min)

Start here before touching any code or files.

> "We've been using Claude Code to help us write and manage code faster. The problem is — without any guardrails, every developer using it will get different results. This starter template is how we fix that."

Key points to land:
- Claude is only as good as the instructions you give it
- This repo is a starting point every new project clones
- It gives Claude our standards, our rules, and our workflow — out of the box

---

## File-by-File Walkthrough

### 1. `CLAUDE.md` — The Briefing Document (2–3 min)

**What it does:**
This is the first file Claude reads when it starts up in any project. It's a briefing document — not a config file, not code. Plain English. Claude reads it and uses it to understand the project before doing anything.

**Open it. Walk through each section:**

- **Project name + description** — one sentence telling Claude what this project is and who it's for. Sets the context for every decision Claude makes.
- **Commands** — tells Claude how to run, build, test, and lint the project. Without this, Claude guesses. With this, it runs the right command every time.
- **Stack** — tells Claude what technology is in use so it doesn't suggest the wrong framework, the wrong database driver, or an incompatible library.
- **Architecture** — explains patterns Claude can't infer from reading code alone. Where does business logic live? How is routing organized?
- **Important Gotchas** — the "don't forget" list. Things that burned someone before. Claude reads these so it doesn't make the same mistake.
- **Required Engineering Standards** — read a few of these out loud:
  - "All new features must include tests"
  - "Every page must have responsive design for mobile"
  - "Never commit unless the user explicitly asks"
  - "Check docker logs after any new feature"

> "These aren't suggestions. Claude treats these as non-negotiable rules every time it writes code."

**Key point to land — context rot:**
> "This file stays under 100 lines on purpose. Claude has a context window — think of it like working memory. It's large (200,000 tokens — roughly 500 pages of text), but it fills up. If CLAUDE.md is bloated, or if too many rules are crammed into a single file, Claude starts ignoring things. We call that context rot."

This is why the template is designed the way it is:
- `CLAUDE.md` stays short — just the essentials Claude needs every session
- Detail lives in separate rules files so it stays modular and scannable
- One-off things (like a specific feature's data model) go into `specs/` or `docs/`, not rules — because rules are loaded on *every* message, whether relevant or not

> "If Claude is giving you worse results over a long conversation, context rot is usually why. Start a new session."

---

### 2. `.claude/rules/` — The Standards (2–3 min)

**What it does:**
Rules files are loaded into Claude's context on every single message. Think of it like a developer who read our entire internal handbook before writing their first line of code.

**Open the folder. Show the files. Pick one or two to open.**

#### `code-style.md`
Tells Claude how we name things, how we structure files, how we write comments. Naming conventions (`camelCase` vs `snake_case`), import ordering, boolean variable prefixes (`isLoading`, `hasPermission`). Without this, every developer's Claude writes differently-styled code.

#### `git-workflow.md`
Conventional Commits format. Branch naming (`feature/`, `fix/`, `chore/`). The rule at the bottom: "Never commit unless the user explicitly asks." This is what stops Claude from auto-committing your work without permission.

#### `testing.md`
Every new feature and enhancement must include tests — this is described as non-negotiable. It defines what to test (API endpoints, business logic, auth boundaries), what not to test (third-party internals, static UI), and the test structure: Arrange / Act / Assert.

#### `security.md`
Security rules that apply to all code, no exceptions. Session checks must happen server-side. Never trust client-supplied user IDs. All input validated before use. Secrets in environment variables, never in source code. If a vulnerability is found, it gets documented in `.claude/docs/security-audit-report.md` and fixed completely before committing.

#### `glossary.md`
Project-specific terminology. When Claude and developers use the same words to mean the same things, miscommunication drops significantly. This gets filled in as the project evolves.

> "Every time you send Claude a message, it has already read all of these. It's not a lookup — it's loaded context."

---

### 3. `.claude/commands/` — Slash Commands (3–4 min)

**What it does:**
Commands are invoked by typing `/command-name` in Claude Code. Each one is a markdown file that tells Claude to follow a specific process. Not just a shortcut — a structured workflow.

**Open each file briefly and explain what it does:**

#### `/choose-stack`
Claude interviews you about your project — what you're building, who it's for, what cloud you're on, what compliance requirements exist. It asks one question at a time. At the end, it delivers a single decisive stack recommendation with rationale. It doesn't give you three options and ask you to choose — that's its job. Then it updates `CLAUDE.md` automatically with the chosen stack and commands.

> "You don't need to know anything about technology to run this. You just describe what you need."

#### `/gather-requirements`
Turns a vague idea into a written spec. Claude interviews you through eight areas: the problem, user roles, user stories, acceptance criteria, edge cases, what's out of scope, data model changes, and UI/UX notes. It saves the result as a `.md` file in `.claude/specs/`. Nothing gets built until this exists.

#### `/evaluate-spec`
Before any code is written, Claude reviews the spec for completeness, clarity, technical feasibility, and security. It flags anything ambiguous or missing and gives a readiness score: "Ready to implement," "Needs minor clarification," or "Needs major revision." This is the gate before building starts.

#### `/implement-spec`
Claude reads the spec, writes a step-by-step plan, and saves it to `.claude/plans/` before showing it to you. The plan lives in the repo — it's committed alongside the code, so you always have a record of what was intended and why. You approve the plan, then Claude builds the feature task by task, marking each step complete as it goes. It never writes a line of code before you've seen the plan.

> "This is the review gate. If you don't like the plan, you say so before Claude touches any files. And six months from now, if someone asks why something was built a certain way — the plan file tells that story."

#### `/commit-push`
Checks git status, reviews staged and unstaged changes, checks for anything that shouldn't be committed (like `.env` files), writes a Conventional Commits message that describes *why* the change was made, and pushes. It will not commit secrets. It flags anything suspicious and asks first.

#### `/security-audit`
Runs a structured scan across authentication/authorization, input validation, API security, data exposure, secrets, and dependencies. Every finding is tagged 🔴 Critical / 🟡 Medium / 🟢 Low / ✅ Passed with the specific file and line number. The report is saved to `.claude/docs/security-audit-report.md`.

#### `/update-erd`
After any database schema change, this reads the schema file, generates a Mermaid ERD diagram, and saves it to `.claude/specs/erd.md`. The data model document stays current automatically.

---

### 4. `.claude/skills/` — Background Context (1–2 min)

**What it does:**
Skills are loaded automatically when Claude detects the context matches. They're not invoked manually — Claude pulls them in when relevant.

#### `frontend-design/`
Any time Claude is creating or editing UI, this skill activates. Mobile-first layout, accessible by default, consistent spacing, three required states for every async UI (loading, error, empty), form validation patterns, destructive action confirmations. Claude applies all of this without being asked.

#### `explaining-code/`
When you ask Claude to explain something, this shifts it into teaching mode. It leads with the *why* before the *what*, gives the big picture before zooming in, names trade-offs, references specific file paths and line numbers. It's also told never to use the word "simply" or "obviously."

---

### 5. `.claude/specs/` — Feature Specifications (1 min)

**What it does:**
Every feature that gets built has a spec file here first. The `TEMPLATE.md` shows the structure: problem statement, user roles table, user stories, acceptance criteria (checkboxes), out-of-scope list, data model changes, UI/UX notes, and open questions.

Completed feature specs move to `specs/complete/` as an archive.

> "Specs before code, always. The most common mistake is asking Claude to build something without a spec. Even a rough spec prevents hours of rework."

---

### 6. `.claude/docs/` — Living Documentation (30 sec)

- **`data-model.md`** — human-readable overview of every database entity, updated after schema changes
- **`security-audit-report.md`** — the latest security scan output, with findings and severity ratings
- **`study-mode.md`** — a guide for using Claude to *understand* the codebase rather than build in it. Useful for onboarding or getting back up to speed after time away.

---

## Live Demo (when ready)

Do these in order. Each one builds on the last.

### Demo 1 — `/choose-stack`
Type `/choose-stack` in Claude Code. Let it ask questions. Answer them honestly based on a hypothetical project. Show how it delivers a recommendation and updates `CLAUDE.md`.

**What to point out:** Claude asked one question at a time. It made the decision — you didn't have to.

### Demo 2 — `/gather-requirements`
Type `/gather-requirements`. Walk through the interview for a simple feature (e.g., "a login page"). Let it generate and save the spec.

**What to point out:** A written spec exists now. Nothing was built yet.

### Demo 3 — `/evaluate-spec`
Type `/evaluate-spec [filename]`. Show it flag anything incomplete in the spec just written.

**What to point out:** This is the gate. Claude caught a gap before any code was written.

### Demo 4 — `/implement-spec`
Type `/implement-spec [filename]`. Show the plan it generates. Point out that it stopped and asked for approval before touching any files.

**What to point out:** You are always in control. Claude shows you what it's going to do before it does it.

### Demo 5 — `/security-audit` (optional)
Run a quick audit on the project. Show the output format — colored severity ratings, specific file paths.

---

## How a New Project Uses This (1 min)

> "When someone on the team starts a new project, they clone this repo. They fill in the project name and run `/choose-stack`. Claude already knows our engineering standards, our rules, how we commit, how we test — everything. Day one, it's already working the way we want."

---

## For Teams (1 min)

A few things worth knowing if multiple people are working on the same project:

- **Everything in `.claude/` is committed to the repo.** It's shared context for the whole team. Every developer's Claude reads the same rules, standards, and specs.
- **`CLAUDE.local.md`** is personal and gitignored. Each developer can create this file in the project root for their own preferences — preferred output format, personal reminders, anything that shouldn't affect everyone else. It doesn't get committed.
- **`.claude/settings.local.json`** is also gitignored. Personal permission overrides live here.
- **Specs are the source of truth.** If two developers are working on the same feature, the spec file in `.claude/specs/` is what keeps them aligned — not Slack messages or memory.

> "The team config is shared. The personal config is private. That split is intentional."

---

## What to Do Next

Give the audience a concrete first step before you close.

> "Here's what I'd like each of you to do this week:"

1. **Clone this repo** into your next project — or into a sandbox if you want to explore it first
2. **Run `/choose-stack`** — even if you already know your stack, it's worth seeing how it works
3. **Run `/gather-requirements`** for one feature you're currently planning
4. **Come back with questions** — this works better once you've used it once

---

## Closing (30 sec)

> "The goal is consistency. Every developer using Claude Code in this org should be working the same way, with the same guardrails. This is how we make that happen."

---

## Likely Questions

**"Can developers change the rules?"**
> Yes — within their project. But this starter sets the baseline everyone begins from.

**"Is Claude writing all the code?"**
> It's a tool, like any other. Developers still review and own everything it produces. These rules make sure it's producing the right kind of code.

**"What if Claude ignores the rules?"**
> The rules are loaded into context at the start of every message. In practice it follows them reliably — and developers catch anything it misses during their review.

**"What's the difference between a rule and a command?"**
> Rules are always loaded — Claude reads them before every response. Commands are workflows you invoke on purpose with a slash command. Rules shape how Claude writes; commands define a process it walks through.

**"What's a skill vs a command?"**
> A command is something you explicitly invoke (like `/gather-requirements`). A skill is background knowledge Claude loads automatically when the context fits — like design principles when it's working on UI.
