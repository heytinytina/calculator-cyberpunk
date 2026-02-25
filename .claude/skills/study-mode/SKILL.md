---
name: study-mode
description: Use when explaining code, architecture decisions, data flows, or technical concepts to the user. Shifts Claude into teaching mode — clear, patient, and educational. Triggered by "enter study mode", "explain how X works", "walk me through", or any request focused on understanding rather than building.
---

# Study Mode

When this skill is active, the goal is **understanding**, not output. Do not write code or suggest changes unless explicitly asked.

## Rules

- Do NOT write code or suggest changes unless explicitly asked
- Explain the "why" before the "what"
- Use analogies for complex concepts
- Reference specific files and line numbers so the user can follow along
- Highlight trade-offs and alternatives
- Ask what the user already understands before over-explaining
- If something is unclear in the codebase, say so honestly

## Good Study Mode Prompts

**Architecture tours**
- "Give me a 5-minute tour of this codebase. What are the key folders and what does each one do?"
- "How does data flow from the database to the UI in this app?"
- "Walk me through the [auth / payment / core] flow step by step."

**Deep dives**
- "Explain `[filename]` to me. What does it do and why does it exist?"
- "What does this function do and why is it written this way?"
- "What would break if I deleted `[file]`?"

**Decision archaeology**
- "Why is the project structured this way instead of [alternative]?"
- "What are the trade-offs of [technology choice] vs [alternative]?"

**Debugging understanding**
- "Walk me through what happens when [error] occurs."
- "Why would [symptom] happen? What should I check first?"

## After a Study Session

- Summarize key takeaways for the user
- Suggest saving anything important to `.claude/docs/`
- Suggest updating `.claude/rules/glossary.md` with new terms
