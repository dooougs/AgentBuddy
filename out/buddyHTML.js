"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuddyHTML = getBuddyHTML;
function getBuddyHTML(stageAudio = {}) {
    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Agent Buddy</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

:root {
  --bg:      #07080f;
  --surface: #0d1020;
  --c0: #00f5ff;   /* cyan  – idle      */
  --c1: #bf7fff;   /* violet– thinking  */
  --c2: #ff9f43;   /* amber – planning  */
  --c3: #43ffa8;   /* mint  – success   */
  --c4: #ff4365;   /* red   – error     */
  --c5: #ffdd43;   /* gold  – terminal  */
  --c6: #43cfff;   /* sky   – searching */
  --c7: #7b8cde;   /* slate – sleeping  */
  --cur: var(--c0);
  --glow: rgba(0,245,255,0.35);
  --font-display: 'Orbitron', monospace;
  --font-mono:    'Share Tech Mono', monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  font-family: var(--font-mono);
}

/* ═══════════════════════════════════════════
   BACKGROUND GRID
═══════════════════════════════════════════ */
.grid-bg {
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}

.scanline {
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0,0,0,0.08) 3px,
    rgba(0,0,0,0.08) 4px
  );
  pointer-events: none;
  z-index: 10;
}

/* ═══════════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════════ */
.wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 12px 12px;
  gap: 0;
}

.panel-action {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 3;
}

/* ═══════════════════════════════════════════
   STAGE LABEL
═══════════════════════════════════════════ */
.stage-label {
  font-family: var(--font-display);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--cur);
  text-shadow: 0 0 10px var(--cur);
  margin-bottom: 12px;
  height: 14px;
  transition: color 0.4s, text-shadow 0.4s;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 34px;
}

.stage-label .typed { display: inline-block; }

/* ═══════════════════════════════════════════
   CHARACTER SCENE
═══════════════════════════════════════════ */
.scene {
  position: relative;
  width: 160px;
  height: 190px;
  flex-shrink: 0;
}

/* Ground glow ring */
.ground-ring {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 22px;
  background: radial-gradient(ellipse, var(--glow) 0%, transparent 70%);
  border-radius: 50%;
  transition: background 0.6s;
  animation: groundPulse 2.5s ease-in-out infinite;
}

@keyframes groundPulse {
  0%,100% { transform: translateX(-50%) scaleX(1);   opacity: 1; }
  50%      { transform: translateX(-50%) scaleX(.8);  opacity: .5; }
}

/* ── BODY SVG ── */
.buddy-svg {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 158px;
  filter: drop-shadow(0 0 18px var(--cur));
  transition: filter 0.6s;
  cursor: pointer;
}

/* Float animation */
.float-group { animation: floatUp 3s ease-in-out infinite; }
@keyframes floatUp {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}

/* Body */
.body-shape { transition: fill 0.5s, stroke 0.5s; }
.body-fill  { fill: #0d1428; stroke: var(--cur); stroke-width: 1.5; transition: stroke 0.5s; }
.body-glow  { fill: none; stroke: var(--cur); stroke-width: 0.5; opacity: 0.4; transition: stroke 0.5s; }

/* Visor */
.visor { fill: var(--cur); opacity: 0.18; transition: fill 0.5s; }
.visor-border { fill: none; stroke: var(--cur); stroke-width: 1; transition: stroke 0.5s; }
.visor-shine  { fill: rgba(255,255,255,0.12); }

/* Eyes inside visor */
.eye-l, .eye-r { transition: fill 0.4s; fill: var(--cur); }
.eye-pupil { fill: #07080f; }

/* Mouth */
.mouth-curve { fill: none; stroke: var(--cur); stroke-width: 1.5; stroke-linecap: round; transition: stroke 0.5s, d 0.4s; }

/* Core / chest gem */
.core-outer { fill: none; stroke: var(--cur); stroke-width: 1; transition: stroke 0.5s; }
.core-inner { fill: var(--cur); opacity: 0.6; transition: fill 0.5s; animation: corePulse 1.8s ease-in-out infinite; }
@keyframes corePulse {
  0%,100% { opacity: .6; r: 5; }
  50%      { opacity: 1;  r: 6.5; }
}

/* Arms */
.arm-l, .arm-r { transition: transform 0.5s ease, fill 0.5s, stroke 0.5s; fill: #0d1428; stroke: var(--cur); stroke-width: 1; }
.arm-l { transform-origin: 33px 95px; }
.arm-r { transform-origin: 77px 95px; }

/* Legs */
.leg-l, .leg-r { fill: #0d1428; stroke: var(--cur); stroke-width: 1; transition: stroke 0.5s; }

/* Antenna */
.antenna-line { stroke: var(--cur); stroke-width: 1.5; transition: stroke 0.5s; }
.antenna-orb  { fill: var(--cur); animation: orbPulse 1.5s ease-in-out infinite; transition: fill 0.5s; }
@keyframes orbPulse {
  0%,100% { r: 4;   opacity: 1; }
  50%      { r: 5.5; opacity: .7; }
}

/* Circuit lines on body */
.circuit { stroke: var(--cur); stroke-width: .5; fill: none; opacity: 0.25; transition: stroke 0.5s; }

/* ═══════════════════════════════════════════
   PARTICLES CANVAS
═══════════════════════════════════════════ */
#particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* ═══════════════════════════════════════════
   MOOD ANIMATIONS
═══════════════════════════════════════════ */

/* THINKING – slow pulse + arm raised */
.mood-thinking .float-group { animation: think 2s ease-in-out infinite; }
@keyframes think {
  0%,100% { transform: translateY(0) rotate(0deg); }
  33%      { transform: translateY(-6px) rotate(-1.5deg); }
  66%      { transform: translateY(-4px) rotate(1deg); }
}
.mood-thinking .arm-l { transform: rotate(-55deg); }

/* PLANNING – both arms up, bouncing */
.mood-planning .float-group { animation: plan 1s ease-in-out infinite; }
@keyframes plan {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-14px); }
}
.mood-planning .arm-l { transform: rotate(-80deg); }
.mood-planning .arm-r { transform: rotate(80deg); }

/* SEARCHING – side-to-side */
.mood-searching .float-group { animation: search 1.2s ease-in-out infinite; }
@keyframes search {
  0%,100% { transform: translateX(0) translateY(0); }
  25%      { transform: translateX(8px) translateY(-4px); }
  75%      { transform: translateX(-8px) translateY(-4px); }
}
.mood-searching .arm-r { transform: rotate(45deg); }

/* EDITING – fast vibrate */
.mood-editing .float-group { animation: edit .25s ease-in-out infinite; }
@keyframes edit {
  0%,100% { transform: translateY(0) rotate(0); }
  25%      { transform: translateY(-3px) rotate(-1deg); }
  75%      { transform: translateY(-1px) rotate(1deg); }
}
.mood-editing .arm-l { transform: rotate(-30deg); }
.mood-editing .arm-r { transform: rotate(-30deg); }

/* TERMINAL – tilt + arm down */
.mood-terminal .float-group { animation: term 2s ease-in-out infinite; }
@keyframes term {
  0%,100% { transform: translateY(0) rotate(-2deg); }
  50%      { transform: translateY(-8px) rotate(2deg); }
}

/* SUCCESS – spin jump */
.mood-success .float-group { animation: success .6s cubic-bezier(.17,.67,.52,1.4) 1 forwards, floatUp 3s ease-in-out 0.7s infinite; }
@keyframes success {
  0%   { transform: translateY(0) rotate(0); }
  40%  { transform: translateY(-30px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
}
.mood-success .arm-l { transform: rotate(-100deg); }
.mood-success .arm-r { transform: rotate(100deg); }

/* ERROR – shake */
.mood-error .float-group { animation: errShake .15s ease-in-out infinite; }
@keyframes errShake {
  0%,100% { transform: translateX(0); }
  25%      { transform: translateX(-5px); }
  75%      { transform: translateX(5px); }
}
.mood-error .arm-l { transform: rotate(-15deg); }
.mood-error .arm-r { transform: rotate(15deg); }

/* SLEEPING – slow sway */
.mood-sleeping .float-group { animation: sleep 5s ease-in-out infinite; }
@keyframes sleep {
  0%,100% { transform: rotate(-4deg) translateY(0); }
  50%      { transform: rotate(4deg) translateY(-5px); }
}

/* ═══════════════════════════════════════════
   INFO PANEL
═══════════════════════════════════════════ */
.info-panel {
  width: 100%;
  max-width: 200px;
  margin-top: 14px;
  background: rgba(13,16,32,0.85);
  border: 1px solid rgba(0,245,255,0.15);
  border-radius: 6px;
  padding: 10px 12px;
  transition: border-color 0.5s;
  backdrop-filter: blur(4px);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.info-row:last-child { margin-bottom: 0; }

.info-key {
  font-size: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
}

.info-val {
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--cur);
  text-shadow: 0 0 8px var(--cur);
  transition: color 0.4s, text-shadow 0.4s;
  font-family: var(--font-display);
  font-weight: 700;
}

.mute-toggle {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: linear-gradient(180deg, rgba(18,23,45,0.96), rgba(8,10,18,0.92));
  color: rgba(255,255,255,0.72);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 8px 18px rgba(0,0,0,0.28);
  backdrop-filter: blur(6px);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.3s, color 0.3s, background 0.3s, box-shadow 0.3s;
}

.mute-toggle svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mute-toggle:hover {
  border-color: rgba(255,255,255,0.3);
  transform: translateY(-1px);
}

.mute-toggle:active {
  transform: translateY(0);
}

.mute-toggle.is-muted {
  color: #ffb4c1;
  border-color: rgba(255,67,101,0.45);
  background: linear-gradient(180deg, rgba(48,16,28,0.96), rgba(22,10,14,0.92));
  box-shadow: 0 0 0 1px rgba(255,67,101,0.08), 0 0 14px rgba(255,67,101,0.18);
}

.mute-toggle:not(.is-muted) {
  color: var(--cur);
  border-color: rgba(0,245,255,0.35);
  background: linear-gradient(180deg, rgba(7,28,40,0.96), rgba(8,12,20,0.92));
  box-shadow: 0 0 0 1px rgba(0,245,255,0.08), 0 0 14px rgba(0,245,255,0.14);
}

/* ═══════════════════════════════════════════
   ACTIVITY BARS
═══════════════════════════════════════════ */
.activity-bars {
  width: 100%;
  max-width: 200px;
  margin-top: 10px;
  display: flex;
  gap: 3px;
  height: 24px;
  align-items: flex-end;
}

.bar {
  flex: 1;
  background: var(--cur);
  border-radius: 2px 2px 0 0;
  opacity: 0.7;
  transform-origin: bottom;
  animation: barBounce 0.8s ease-in-out infinite;
  transition: background 0.5s;
}

.bar:nth-child(1) { animation-delay: 0.0s; }
.bar:nth-child(2) { animation-delay: 0.1s; }
.bar:nth-child(3) { animation-delay: 0.2s; }
.bar:nth-child(4) { animation-delay: 0.3s; }
.bar:nth-child(5) { animation-delay: 0.4s; }
.bar:nth-child(6) { animation-delay: 0.5s; }
.bar:nth-child(7) { animation-delay: 0.35s; }
.bar:nth-child(8) { animation-delay: 0.15s; }

@keyframes barBounce {
  0%,100% { height: 4px; }
  50%      { height: var(--bh, 16px); }
}

/* pause bars when idle/sleeping */
.bars-paused .bar { animation-play-state: paused; height: 3px; opacity: 0.25; }

/* ═══════════════════════════════════════════
   ZZZ for sleeping
═══════════════════════════════════════════ */
.zzz {
  position: absolute;
  top: 20px;
  right: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.6s;
  pointer-events: none;
}

.zzz.visible { opacity: 1; }

.zzz span {
  font-family: var(--font-display);
  color: var(--c7);
  text-shadow: 0 0 8px var(--c7);
  animation: zFloat 2.5s ease-in-out infinite;
  font-weight: 900;
}
.zzz span:nth-child(1) { font-size: 10px; animation-delay: 0s; }
.zzz span:nth-child(2) { font-size: 14px; animation-delay: .5s; }
.zzz span:nth-child(3) { font-size: 18px; animation-delay: 1s; margin-left: 6px; }

@keyframes zFloat {
  0%   { transform: translate(0,0);      opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translate(14px,-30px); opacity: 0; }
}

/* ═══════════════════════════════════════════
   HOLOGRAPHIC RING
═══════════════════════════════════════════ */
.holo-ring {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 30px;
  border: 1.5px solid var(--cur);
  border-radius: 50%;
  opacity: 0.25;
  transition: border-color 0.5s;
  animation: ringRotate 8s linear infinite;
  pointer-events: none;
}

.holo-ring::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--cur);
  border-radius: 50%;
  opacity: 0.5;
  animation: ringRotate 5s linear infinite reverse;
}

@keyframes ringRotate {
  from { transform: translateX(-50%) rotateX(72deg) rotate(0deg); }
  to   { transform: translateX(-50%) rotateX(72deg) rotate(360deg); }
}
</style>
</head>

<body>
<div class="grid-bg"></div>
<div class="scanline"></div>

<div class="wrapper">
  <div class="panel-action">
    <button class="mute-toggle is-muted" id="muteToggle" type="button" aria-pressed="true" aria-label="Unmute Agent Buddy audio" title="Unmute Agent Buddy audio"></button>
  </div>
  <div class="stage-label"><span class="typed" id="stageText">STANDBY</span></div>

  <div class="scene" id="scene">
    <canvas id="particles" width="160" height="190"></canvas>

    <!-- Holographic base ring -->
    <div class="holo-ring"></div>

    <!-- Ground glow -->
    <div class="ground-ring" id="groundRing"></div>

    <!-- ZZZ for sleep -->
    <div class="zzz" id="zzz">
      <span>z</span><span>z</span><span>Z</span>
    </div>

    <!-- The character -->
    <svg class="buddy-svg" viewBox="0 0 110 158" xmlns="http://www.w3.org/2000/svg">
      <g class="float-group" id="floatGroup">

        <!-- Legs -->
        <rect class="leg-l" x="30" y="118" width="18" height="28" rx="9"/>
        <rect class="leg-r" x="62" y="118" width="18" height="28" rx="9"/>

        <!-- Body -->
        <rect class="body-fill" x="18" y="62" width="74" height="62" rx="22"/>
        <rect class="body-glow" x="14" y="58" width="82" height="70" rx="26"/>

        <!-- Circuit lines -->
        <path class="circuit" d="M30 80 h8 v6 h6"/>
        <path class="circuit" d="M80 80 h-8 v6 h-6"/>
        <path class="circuit" d="M38 110 h34"/>
        <circle class="circuit" cx="72" cy="86" r="2" fill="var(--cur)" opacity="0.2"/>
        <circle class="circuit" cx="38" cy="86" r="2" fill="var(--cur)" opacity="0.2"/>

        <!-- Core gem -->
        <circle class="core-outer" cx="55" cy="95" r="10"/>
        <circle class="core-inner" id="coreInner" cx="55" cy="95" r="5"/>

        <!-- Arms -->
        <rect class="arm-l" id="armL" x="6" y="68" width="14" height="36" rx="7"/>
        <rect class="arm-r" id="armR" x="90" y="68" width="14" height="36" rx="7"/>

        <!-- Head -->
        <rect class="body-fill" x="22" y="16" width="66" height="52" rx="20"/>
        <rect class="body-glow" x="18" y="12" width="74" height="60" rx="24"/>

        <!-- Visor -->
        <rect class="visor" x="28" y="24" width="54" height="34" rx="10"/>
        <rect class="visor-border" x="28" y="24" width="54" height="34" rx="10"/>
        <rect class="visor-shine" x="30" y="26" width="24" height="10" rx="5"/>

        <!-- Eyes -->
        <defs>
          <clipPath id="clipL"><ellipse cx="41" cy="38" rx="5.5" ry="5.5"/></clipPath>
          <clipPath id="clipR"><ellipse cx="69" cy="38" rx="5.5" ry="5.5"/></clipPath>
        </defs>
        <ellipse class="eye-l" id="eyeL" cx="41" cy="38" rx="6" ry="6"/>
        <ellipse class="eye-r" id="eyeR" cx="69" cy="38" rx="6" ry="6"/>
        <circle id="pupilL" class="eye-pupil" cx="41" cy="38" r="3.2" clip-path="url(#clipL)"/>
        <circle id="pupilR" class="eye-pupil" cx="69" cy="38" r="3.2" clip-path="url(#clipR)"/>
        <circle id="glintL" cx="39.5" cy="36.5" r="1.1" fill="rgba(255,255,255,0.7)" clip-path="url(#clipL)" pointer-events="none"/>
        <circle id="glintR" cx="67.5" cy="36.5" r="1.1" fill="rgba(255,255,255,0.7)" clip-path="url(#clipR)" pointer-events="none"/>

        <!-- Mouth -->
        <path class="mouth-curve" id="mouth" d="M43 52 Q55 60 67 52"/>

        <!-- Antenna -->
        <line class="antenna-line" x1="55" y1="16" x2="55" y2="4"/>
        <circle class="antenna-orb" id="antennaOrb" cx="55" cy="4" r="4"/>

      </g>
    </svg>
  </div>

  <!-- Info panel -->
  <div class="info-panel" id="infoPanel">
    <div class="info-row">
      <span class="info-key">STATUS</span>
      <span class="info-val" id="statusVal">IDLE</span>
    </div>
    <div class="info-row">
      <span class="info-key">UPTIME</span>
      <span class="info-val" id="uptimeVal">00:00</span>
    </div>
    <div class="info-row">
      <span class="info-key">EVENTS</span>
      <span class="info-val" id="eventsVal">0</span>
    </div>
  </div>

  <!-- Activity bars -->
  <div class="activity-bars" id="activityBars">
    <div class="bar" style="--bh:8px"></div>
    <div class="bar" style="--bh:14px"></div>
    <div class="bar" style="--bh:20px"></div>
    <div class="bar" style="--bh:16px"></div>
    <div class="bar" style="--bh:22px"></div>
    <div class="bar" style="--bh:12px"></div>
    <div class="bar" style="--bh:18px"></div>
    <div class="bar" style="--bh:10px"></div>
  </div>
</div>

<script>
const vscode = acquireVsCodeApi();
const STAGE_AUDIO_SOURCES = ${JSON.stringify(stageAudio)};

// ── Colour map ───────────────────────────────────────────────────────────────
const STAGE_CONFIG = {
  idle:      { color:'#00f5ff', label:'STANDBY',   status:'IDLE',      barH:[6,8,4,6,8,4,6,5],    bars:false },
  thinking:  { color:'#bf7fff', label:'THINKING…', status:'PROC',      barH:[14,18,22,16,20,12,18,14], bars:true },
  planning:  { color:'#ff9f43', label:'PLANNING',  status:'PLAN',      barH:[20,22,18,24,20,16,22,20], bars:true },
  searching: { color:'#43cfff', label:'SEARCHING', status:'SCAN',      barH:[10,16,20,14,18,22,16,12], bars:true },
  editing:   { color:'#43ffa8', label:'EDITING',   status:'WRITE',     barH:[22,20,24,22,18,24,20,22], bars:true },
  terminal:  { color:'#ffdd43', label:'TERMINAL',  status:'EXEC',      barH:[24,20,16,22,18,24,22,20], bars:true },
  success:   { color:'#43ffa8', label:'SUCCESS ✓', status:'OK',        barH:[24,24,24,24,24,24,24,24], bars:true },
  error:     { color:'#ff4365', label:'ERROR !',   status:'ERR',       barH:[8,4,20,4,8,4,16,4],   bars:true },
  sleeping:  { color:'#7b8cde', label:'SLEEPING',  status:'ZZZ',       barH:[3,3,3,3,3,3,3,3],     bars:false },
};

let currentStage = 'idle';
let eventCount = 0;
let startTime = Date.now();
let typeTimer = null;
const LOOPING_AUDIO_STAGES = new Set(['idle', 'thinking', 'planning', 'searching', 'sleeping']);
const STAGE_VOLUMES = {
  idle: 0.18,
  thinking: 0.22,
  planning: 0.26,
  searching: 0.2,
  editing: 0.14,
  terminal: 0.18,
  success: 0.28,
  error: 0.2,
  sleeping: 0.12,
};
let activeStageAudio = null;
let activeStageAudioName = '';
let audioCtx = null;
let fallbackTimer = null;
let fallbackLoopStage = '';
let fallbackNoiseBuffer = null;
let isMuted = true;
const AUDIO_ICONS = {
  muted: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 6.2H5.2L8.6 3.5V12.5L5.2 9.8H2.5Z"></path><path d="M10.8 5.2L14 8.4"></path><path d="M14 5.2L10.8 8.4"></path></svg>',
  live: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 6.2H5.2L8.6 3.5V12.5L5.2 9.8H2.5Z"></path><path d="M10.8 6.1C11.4 6.7 11.7 7.5 11.7 8.4C11.7 9.3 11.4 10.1 10.8 10.7"></path><path d="M12.4 4.7C13.3 5.7 13.8 7 13.8 8.4C13.8 9.8 13.3 11.1 12.4 12.1"></path></svg>',
};

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return null;
    audioCtx = new AudioContextCtor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function bindAudioUnlock() {
  const unlock = () => {
    ensureAudioContext();
    if (currentStage && !isMuted) playStageAudio(currentStage);
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
}
bindAudioUnlock();

function stopStageAudio() {
  if (activeStageAudio) {
    activeStageAudio.pause();
    activeStageAudio.currentTime = 0;
    activeStageAudio = null;
    activeStageAudioName = '';
  }
}

function clearFallbackLoop() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
  fallbackLoopStage = '';
}

function getNoiseBuffer(ctx) {
  if (fallbackNoiseBuffer) return fallbackNoiseBuffer;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  fallbackNoiseBuffer = buffer;
  return buffer;
}

function playTone(ctx, opts) {
  const now = ctx.currentTime + (opts.delay || 0);
  const attack = opts.attack ?? 0.01;
  const release = opts.release ?? 0.18;
  const duration = Math.max((opts.duration || 0.2), attack + release + 0.02);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = opts.type || 'sine';
  osc.frequency.setValueAtTime(opts.frequency, now);
  if (opts.detune) osc.detune.setValueAtTime(opts.detune, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(opts.gain || 0.03, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

function playNoise(ctx, opts) {
  const now = ctx.currentTime + (opts.delay || 0);
  const duration = opts.duration || 0.5;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = getNoiseBuffer(ctx);
  filter.type = opts.filterType || 'lowpass';
  filter.frequency.setValueAtTime(opts.frequency || 900, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(opts.gain || 0.012, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

function playFallbackStageSound(stage) {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  clearFallbackLoop();

  const playPattern = () => {
    switch (stage) {
      case 'idle':
        playTone(ctx, { frequency: 196, duration: 1.8, gain: 0.012, type: 'sine', attack: 0.12, release: 0.45 });
        fallbackTimer = window.setTimeout(playPattern, 2200);
        break;
      case 'thinking':
        playTone(ctx, { frequency: 174, duration: 0.45, gain: 0.018, type: 'triangle', attack: 0.03, delay: 0 });
        playTone(ctx, { frequency: 196, duration: 0.45, gain: 0.016, type: 'triangle', attack: 0.03, delay: 0.32 });
        fallbackTimer = window.setTimeout(playPattern, 1500);
        break;
      case 'planning':
        playTone(ctx, { frequency: 261.63, duration: 0.24, gain: 0.024, type: 'triangle' });
        playTone(ctx, { frequency: 329.63, duration: 0.24, gain: 0.026, type: 'triangle', delay: 0.14 });
        playTone(ctx, { frequency: 392, duration: 0.4, gain: 0.028, type: 'triangle', delay: 0.28 });
        fallbackTimer = window.setTimeout(playPattern, 2100);
        break;
      case 'searching':
        playTone(ctx, { frequency: 640, duration: 0.08, gain: 0.012, type: 'square' });
        playTone(ctx, { frequency: 760, duration: 0.08, gain: 0.01, type: 'square', delay: 0.16 });
        playTone(ctx, { frequency: 640, duration: 0.08, gain: 0.012, type: 'square', delay: 0.32 });
        fallbackTimer = window.setTimeout(playPattern, 900);
        break;
      case 'editing':
        playTone(ctx, { frequency: 1100, duration: 0.03, gain: 0.01, type: 'square', attack: 0.002, release: 0.02 });
        playTone(ctx, { frequency: 900, duration: 0.03, gain: 0.008, type: 'square', attack: 0.002, release: 0.02, delay: 0.06 });
        break;
      case 'terminal':
        playTone(ctx, { frequency: 523.25, duration: 0.07, gain: 0.012, type: 'square' });
        playTone(ctx, { frequency: 659.25, duration: 0.07, gain: 0.012, type: 'square', delay: 0.1 });
        playTone(ctx, { frequency: 783.99, duration: 0.09, gain: 0.012, type: 'square', delay: 0.22 });
        break;
      case 'success':
        playTone(ctx, { frequency: 392, duration: 0.25, gain: 0.02, type: 'triangle' });
        playTone(ctx, { frequency: 493.88, duration: 0.32, gain: 0.024, type: 'triangle', delay: 0.12 });
        playTone(ctx, { frequency: 587.33, duration: 0.52, gain: 0.028, type: 'triangle', delay: 0.24 });
        break;
      case 'error':
        playTone(ctx, { frequency: 220, duration: 0.18, gain: 0.018, type: 'sawtooth' });
        playTone(ctx, { frequency: 180, duration: 0.2, gain: 0.018, type: 'sawtooth', delay: 0.12 });
        playTone(ctx, { frequency: 140, duration: 0.28, gain: 0.02, type: 'sawtooth', delay: 0.24 });
        break;
      case 'sleeping':
        playNoise(ctx, { frequency: 420, duration: 1.4, gain: 0.008 });
        playTone(ctx, { frequency: 130.81, duration: 1.1, gain: 0.006, type: 'sine', attack: 0.16, release: 0.45 });
        fallbackTimer = window.setTimeout(playPattern, 2600);
        break;
    }
  };

  if (LOOPING_AUDIO_STAGES.has(stage)) {
    fallbackLoopStage = stage;
  }
  playPattern();
}

function playBundledStageSound(stage) {
  const sources = STAGE_AUDIO_SOURCES[stage];
  if (!sources || !sources.length) return false;

  const shouldLoop = LOOPING_AUDIO_STAGES.has(stage);
  if (shouldLoop && activeStageAudio && activeStageAudioName === stage) {
    return true;
  }

  stopStageAudio();

  const audio = new Audio();
  audio.src = sources[0];
  audio.loop = shouldLoop;
  audio.volume = STAGE_VOLUMES[stage] || 0.2;
  audio.preload = 'auto';

  audio.addEventListener('error', () => {
    if (activeStageAudio === audio) {
      activeStageAudio = null;
      activeStageAudioName = '';
    }
    playFallbackStageSound(stage);
  }, { once: true });

  activeStageAudio = audio;
  activeStageAudioName = stage;
  audio.play().catch(() => {
    if (activeStageAudio === audio) {
      activeStageAudio = null;
      activeStageAudioName = '';
    }
    playFallbackStageSound(stage);
  });
  return true;
}

function playStageAudio(stage) {
  if (isMuted) {
    clearFallbackLoop();
    stopStageAudio();
    return;
  }

  clearFallbackLoop();

  if (!LOOPING_AUDIO_STAGES.has(stage)) {
    stopStageAudio();
  } else if (activeStageAudioName && activeStageAudioName !== stage) {
    stopStageAudio();
  }

  if (playBundledStageSound(stage)) {
    return;
  }

  playFallbackStageSound(stage);
}

function setMuted(muted) {
  isMuted = Boolean(muted);
  const muteToggle = document.getElementById('muteToggle');
  muteToggle.classList.toggle('is-muted', isMuted);
  muteToggle.innerHTML = isMuted ? AUDIO_ICONS.muted : AUDIO_ICONS.live;
  muteToggle.setAttribute('aria-pressed', String(isMuted));
  muteToggle.setAttribute('aria-label', isMuted ? 'Unmute Agent Buddy audio' : 'Mute Agent Buddy audio');
  muteToggle.title = isMuted ? 'Unmute Agent Buddy audio' : 'Mute Agent Buddy audio';

  if (isMuted) {
    clearFallbackLoop();
    stopStageAudio();
  } else if (currentStage) {
    playStageAudio(currentStage);
  }
}

// ── Uptime ───────────────────────────────────────────────────────────────────
setInterval(() => {
  const s = Math.floor((Date.now() - startTime) / 1000);
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s % 60).padStart(2,'0');
  document.getElementById('uptimeVal').textContent = mm + ':' + ss;
}, 1000);

// ── Typewriter ───────────────────────────────────────────────────────────────
function typeWrite(el, text) {
  if (typeTimer) clearInterval(typeTimer);
  el.textContent = '';
  let i = 0;
  typeTimer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(typeTimer);
  }, 45);
}

// ── Apply colour everywhere ──────────────────────────────────────────────────
function applyColor(color) {
  document.documentElement.style.setProperty('--cur', color);
  const glowRgb = hexToRgba(color, 0.35);
  document.documentElement.style.setProperty('--glow', glowRgb);
}

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return 'rgba('+r+','+g+','+b+','+a+')';
}

// ── Particles system ─────────────────────────────────────────────────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function spawnParticles(count, color, type) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: 60 + (Math.random()-0.5)*60,
      y: 80 + (Math.random()-0.5)*60,
      vx: (Math.random()-0.5)*3,
      vy: -Math.random()*3 - 1,
      life: 1,
      decay: 0.015 + Math.random()*0.02,
      size: 2 + Math.random()*4,
      color,
      type, // 'circle' | 'star' | 'spark'
    });
  }
}

function drawStar(ctx, x, y, r, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i*72-90)*Math.PI/180;
    const b = (i*72-90+36)*Math.PI/180;
    ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    ctx.lineTo(Math.cos(b)*(r/2.5), Math.sin(b)*(r/2.5));
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function tickParticles() {
  ctx.clearRect(0,0,160,190);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04; // slight gravity
    p.life -= p.decay;
    if (p.type === 'star') {
      drawStar(ctx, p.x, p.y, p.size, p.color, p.life);
    } else {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size/2, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
  }
  requestAnimationFrame(tickParticles);
}
tickParticles();

// ── Eye blink ────────────────────────────────────────────────────────────────
// Eye movement engine
const EYE_C = { L:{x:41,y:38}, R:{x:69,y:38} };
const MAX_TRAVEL = 2.8;
const pupilPos    = { L:{x:0,y:0}, R:{x:0,y:0} };
const pupilTarget = { L:{x:0,y:0}, R:{x:0,y:0} };
const EYE_STAGE = {
  idle:      {pattern:'idle',       speed:0.4,  amp:1.2, async:false},
  thinking:  {pattern:'upLeft',     speed:0.5,  amp:1.6, async:true },
  planning:  {pattern:'upRight',    speed:0.7,  amp:1.8, async:false},
  searching: {pattern:'scan',       speed:2.2,  amp:2.6, async:false},
  editing:   {pattern:'downCentre', speed:0.3,  amp:0.8, async:false},
  terminal:  {pattern:'downLeft',   speed:1.0,  amp:1.4, async:false},
  success:   {pattern:'wide',       speed:1.2,  amp:2.4, async:true },
  error:     {pattern:'erratic',    speed:3.5,  amp:2.8, async:true },
  sleeping:  {pattern:'sleep',      speed:0.08, amp:0.3, async:false},
};
let eyeT = 0;
const eyeRng = Math.random()*100;
function getEyeTarget(stage, t, side) {
  const cfg = EYE_STAGE[stage]||EYE_STAGE.idle;
  const s=cfg.speed, a=cfg.amp, off=(side==='L'?0:(cfg.async?0.4:0));
  switch(cfg.pattern) {
    case 'idle': { const pause=Math.sin(t*0.18+eyeRng)>0.7; if(pause) return{x:0,y:0.3}; return{x:Math.sin(t*s*0.7+off)*a*0.8,y:Math.sin(t*s*0.5+1.3+off)*a*0.5}; }
    case 'upLeft':    return{x:-a*0.7+Math.sin(t*s*0.4+off)*a*0.35, y:-a*0.75+Math.sin(t*s*0.25+off)*a*0.25};
    case 'upRight':   return{x:a*0.6+Math.sin(t*s*0.6+off)*a*0.45,  y:-a*0.65+Math.sin(t*s*0.35+off)*a*0.3};
    case 'scan':      { const ph=(t*s+off)%(Math.PI*2); const sw=Math.abs(Math.sin(ph*2))<0.15?Math.sign(Math.sin(ph))*a:Math.sin(ph)*a; return{x:sw,y:Math.sin(t*0.4+off)*0.4}; }
    case 'downCentre': return{x:Math.sin(t*s*1.1+off)*a*0.4, y:a*0.7+Math.sin(t*s*0.6+off)*a*0.2};
    case 'downLeft':  { const fl=Math.sin(t*0.5)>0.8?-a*0.5:a*0.55; return{x:-a*0.55+Math.sin(t*s*0.3+off)*a*0.3,y:fl+Math.sin(t*s*0.8+off)*0.3}; }
    case 'erratic':   return{x:Math.sin(t*s+off+eyeRng)*a+Math.sin(t*s*2.3+eyeRng*2)*a*0.4, y:Math.cos(t*s*1.7+off)*a*0.8+Math.sin(t*s*3.1)*a*0.3};
    case 'wide':      return{x:Math.sin(t*s*0.5+off)*a, y:-a*0.3+Math.abs(Math.sin(t*s*0.4+off))*-a*0.4};
    case 'sleep':     return{x:Math.sin(t*s+off)*a*0.5, y:a*0.8+Math.sin(t*s*0.3)*0.2};
    default: return{x:0,y:0};
  }
}
function clampV(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function tickEyes() {
  eyeT+=0.016;
  for(const side of ['L','R']){
    const raw=getEyeTarget(currentStage,eyeT,side);
    pupilTarget[side].x=clampV(raw.x,-MAX_TRAVEL,MAX_TRAVEL);
    pupilTarget[side].y=clampV(raw.y,-MAX_TRAVEL,MAX_TRAVEL);
    const lrp=currentStage==='erratic'?0.25:currentStage==='scan'?0.20:currentStage==='sleeping'?0.02:0.07;
    pupilPos[side].x+=(pupilTarget[side].x-pupilPos[side].x)*lrp;
    pupilPos[side].y+=(pupilTarget[side].y-pupilPos[side].y)*lrp;
  }
  const pL=document.getElementById('pupilL'),pR=document.getElementById('pupilR');
  const gL=document.getElementById('glintL'),gR=document.getElementById('glintR');
  if(pL){pL.setAttribute('cx',String(EYE_C.L.x+pupilPos.L.x));pL.setAttribute('cy',String(EYE_C.L.y+pupilPos.L.y));
         gL.setAttribute('cx',String(EYE_C.L.x+pupilPos.L.x-1.5));gL.setAttribute('cy',String(EYE_C.L.y+pupilPos.L.y-1.5));}
  if(pR){pR.setAttribute('cx',String(EYE_C.R.x+pupilPos.R.x));pR.setAttribute('cy',String(EYE_C.R.y+pupilPos.R.y));
         gR.setAttribute('cx',String(EYE_C.R.x+pupilPos.R.x-1.5));gR.setAttribute('cy',String(EYE_C.R.y+pupilPos.R.y-1.5));}
  requestAnimationFrame(tickEyes);
}
tickEyes();
function scheduleBlink(){
  const delay=currentStage==='sleeping'?8000:currentStage==='erratic'?1200:2800+Math.random()*2000;
  setTimeout(()=>{
    if(currentStage!=='sleeping'){['eyeL','eyeR'].forEach(id=>{const e=document.getElementById(id);e.setAttribute('ry','1');setTimeout(()=>e.setAttribute('ry','6'),110);});}
    scheduleBlink();
  },delay);
}
scheduleBlink();

// ── Mouth shapes per stage ───────────────────────────────────────────────────
const MOUTH = {
  idle:      'M43 52 Q55 60 67 52',  // smile
  thinking:  'M45 54 Q55 54 65 54',  // flat
  planning:  'M40 50 Q55 62 70 50',  // big smile
  searching: 'M44 54 Q55 57 66 54',  // slight smile
  editing:   'M44 54 Q55 57 66 54',
  terminal:  'M45 54 Q55 54 65 54',  // flat
  success:   'M40 49 Q55 64 70 49',  // huge smile
  error:     'M43 57 Q55 50 67 57',  // frown
  sleeping:  'M47 54 Q55 56 63 54',  // tiny smile
};

// ── Main stage handler ───────────────────────────────────────────────────────
function applyStage(stage, meta) {
  currentStage = stage;
  eventCount++;
  const cfg = STAGE_CONFIG[stage] || STAGE_CONFIG.idle;

  applyColor(cfg.color);
  typeWrite(document.getElementById('stageText'), cfg.label);
  document.getElementById('statusVal').textContent = cfg.status;
  document.getElementById('eventsVal').textContent = eventCount;

  // Mood class on scene
  const scene = document.getElementById('scene');
  scene.className = 'scene mood-' + stage;

  // Mouth
  document.getElementById('mouth').setAttribute('d', MOUTH[stage] || MOUTH.idle);

  // Eye style
  const eyeL = document.getElementById('eyeL');
  const eyeR = document.getElementById('eyeR');
  if (stage === 'sleeping') {
    eyeL.setAttribute('ry','1'); eyeR.setAttribute('ry','1');
  } else if (stage === 'error') {
    eyeL.setAttribute('ry','4'); eyeR.setAttribute('ry','4');
  } else {
    eyeL.setAttribute('ry','6'); eyeR.setAttribute('ry','6');
  }

  // Info panel border
  document.getElementById('infoPanel').style.borderColor =
    'rgba(' + hexToComponents(cfg.color) + ',0.3)';

  // Activity bars
  const barsEl = document.getElementById('activityBars');
  barsEl.className = 'activity-bars' + (cfg.bars ? '' : ' bars-paused');
  const barEls = barsEl.querySelectorAll('.bar');
  barEls.forEach((b,i) => {
    b.style.setProperty('--bh', cfg.barH[i]+'px');
  });

  // ZZZ
  document.getElementById('zzz').className = 'zzz' + (stage==='sleeping' ? ' visible' : '');

  // Particle bursts
  if (stage === 'success')  spawnParticles(24, cfg.color, 'star');
  if (stage === 'error')    spawnParticles(12, cfg.color, 'circle');
  if (stage === 'planning') spawnParticles(8,  cfg.color, 'circle');
  if (stage === 'editing')  spawnParticles(4,  cfg.color, 'spark');

  playStageAudio(stage);
}

function hexToComponents(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return r+','+g+','+b;
}

// ── Message from extension host ──────────────────────────────────────────────
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg.command === 'stage') {
    applyStage(msg.stage, msg.meta || {});
  }
  if (msg.command === 'muted') {
    setMuted(msg.muted);
  }
});

document.getElementById('muteToggle').addEventListener('click', () => {
  const nextMuted = !isMuted;
  setMuted(nextMuted);
  vscode.postMessage({ command: 'setMuted', muted: nextMuted });
});

// ── Demo cycle on click (for dev preview) ───────────────────────────────────
const stages = Object.keys(STAGE_CONFIG);
let demoIdx = 0;
document.querySelector('.buddy-svg').addEventListener('click', () => {
  demoIdx = (demoIdx + 1) % stages.length;
  applyStage(stages[demoIdx], {});
});

// ── Ready ────────────────────────────────────────────────────────────────────
vscode.postMessage({ command: 'ready' });
setMuted(true);
applyStage('idle', {});
</script>
</body>
</html>`;
}
//# sourceMappingURL=buddyHTML.js.map