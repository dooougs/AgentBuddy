# Agent Buddy — VS Code Extension

An animated holographic AI companion that lives in your sidebar and reacts to your coding agent's activity in real time.

## Features

- 🤖 Fully animated SVG character with glowing synthwave aesthetic
- 🎨 Colour-coded reactions to 8 distinct agent stages
- ⚡ Particle burst effects on key events (success, errors)
- 📊 Live activity bars and uptime tracker
- 😴 Auto-sleeps after 4 minutes of inactivity
- 🖱️ Click the character to cycle through stages (demo mode)

## Agent Stages Detected

| Stage     | Colour   | Trigger                                      |
|-----------|----------|----------------------------------------------|
| IDLE      | Cyan     | Default / no recent activity                 |
| THINKING  | Violet   | After save, after debug ends, LM API changes |
| PLANNING  | Amber    | Debug session started                        |
| SEARCHING | Sky blue | Rapid file switching                         |
| EDITING   | Mint     | Text document changes                        |
| TERMINAL  | Gold     | Terminal open / write / active               |
| SUCCESS   | Green    | Errors cleared after error state             |
| ERROR     | Red      | Diagnostics contain errors                   |
| SLEEPING  | Slate    | 4 minutes of complete inactivity             |

## Setup

```bash
npm install
npm run compile
```

Then press **F5** in VS Code to launch the Extension Development Host.

The **Agent Buddy** icon will appear in the Activity Bar. Click it to open the panel.

## Simulate Stages

Run the command palette command:
```
Agent Buddy: Simulate Agent Stages
```
Each invocation cycles to the next stage so you can preview all animations.

Or simply **click the character** in the panel to cycle through stages.

## Publishing

```bash
npm install -g @vscode/vsce
vsce package
vsce publish
```
