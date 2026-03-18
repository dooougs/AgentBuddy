---
title: Vibe Coding in Parallel Was Chaos—So I Built Agent Buddy for VS Code
published: false
tags: vscode, ai, productivity, devtools
cover_image: https://raw.githubusercontent.com/dooougs/AgentBuddy/main/media/devto-cover.png
---

# I Built a Tiny AI Buddy for VS Code Because Vibe Coding in Parallel Gets Chaotic

When you run multiple AI coding sessions at once, context switching gets expensive.

I kept finding myself asking:
- Which session is actively editing?
- Which one is stuck thinking?
- Did that terminal run finish?
- Is this session healthy or silently failing?

So I built a small VS Code extension: **Agent Buddy** — an animated sidebar companion that reacts to coding activity in real time.

It’s basically a status dashboard disguised as a character.

And honestly? It makes long, text-heavy vibe coding sessions feel lighter.

---

## Why I built it

Two reasons:

1. **Parallel AI sessions need fast visual feedback**
   - I often have several AI workflows running in parallel.
   - Reading logs or scanning text for each session is slow.
   - I wanted an at-a-glance signal for “what’s happening now.”

2. **Vibe coding can be textually intense**
   - Constant walls of text are mentally fatiguing.
   - A simple visual layer breaks that up.
   - It turns monitoring from “reading everything” into “glancing and deciding.”

---

## What Agent Buddy does

Agent Buddy lives in the VS Code Activity Bar and updates based on editor behavior.

It reacts to 9 states:

- `idle`
- `thinking`
- `planning`
- `searching`
- `editing`
- `terminal`
- `success`
- `error`
- `sleeping`

Each state has its own color, expression, and animation profile.

So instead of parsing status from text, I can infer state instantly:
- green + energetic = good
- red + alert = fix now
- low activity = waiting or idle

Here’s the full state strip rendered as a horizontal banner (using scaled screenshots):

![Agent Buddy state banner](https://raw.githubusercontent.com/dooougs/AgentBuddy/main/media/devto-states-banner.png)

*All 9 states in order: idle, thinking, planning, searching, editing, terminal, success, error, sleeping.*

---

## How it works (high level)

- Built as a **VS Code extension** with a custom **webview panel**.
- Extension listens to workspace/editor signals (edits, diagnostics, terminal, etc.).
- Signals map to a small state machine.
- Webview receives state updates and animates the buddy in SVG/CSS.
- Includes an inactivity timeout that moves to `sleeping`.

I also added a screenshot generation flow so docs/marketplace assets stay aligned with actual states.

---

## Unexpected benefit

I originally built this for utility, but it also improved flow.

The UI gives me:
- less cognitive load
- faster context recovery after interruptions
- a little emotional pacing during long coding runs

It sounds small, but in long sessions the difference is real.

---

## If you’re building with AI a lot

If your workflow is mostly text and you’re juggling multiple agents, add one visual signal layer.

It doesn’t have to be a character.
It can be dots, bars, badges, whatever.

The key is this:
> **Use visuals to compress status, so your brain can spend cycles on decisions instead of parsing.**

---

## What I’d add next

- Per-workspace buddy instances
- Session labels for parallel agent runs
- Optional compact mode
- Better metrics around task duration and success/error ratios

---

## Try Agent Buddy

If you want to install it and use it in your own workflow, grab it from the VS Code Marketplace:

👉 [Agent Buddy on the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=dougs.vscode-agent-buddy)

If it helps your flow, I’d love feedback on what state or signal you’d want added next.

---

If you’re curious, I can share a follow-up post with the exact event-to-state mapping and webview animation approach.
