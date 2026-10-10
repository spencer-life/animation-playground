// Original examples informed by Emil Kowalski's MIT-licensed animation skills.
// The build embeds each recipe's complete markup, styles, script and runtime.

import { recipeIcon } from '../recipe-icons.mjs';

const timeline = String.raw`
// Delays use logical milliseconds: pausing keeps the remaining time, and a
// playback-rate change only changes how fast that remaining time passes.
// Every sequence is bounded. Replay and page cleanup cancel their old work.
const scheduled = new Set();
function cancelAfter(job) {
  if (!job) return;
  if (job.timer !== null) clearTimeout(job.timer);
  job.timer = null;
  scheduled.delete(job);
}
function clearTimeline() {
  for (const job of scheduled) cancelAfter(job);
}
function schedule(job) {
  if (Demo.paused || !scheduled.has(job)) return;
  job.startedAt = performance.now();
  job.speed = Demo.speed;
  job.timer = setTimeout(() => {
    job.timer = null;
    scheduled.delete(job);
    job.callback();
  }, job.remaining / job.speed);
}
function after(milliseconds, callback) {
  const job = { remaining: Math.max(0, milliseconds), callback, timer: null, startedAt: 0, speed: Demo.speed };
  scheduled.add(job);
  schedule(job);
  return job;
}
Demo.onSettings((next, previous) => {
  if (next.paused === previous.paused && next.speed === previous.speed) return;
  const now = performance.now();
  for (const job of scheduled) {
    if (job.timer !== null) {
      clearTimeout(job.timer);
      job.timer = null;
      job.remaining = Math.max(0, job.remaining - (now - job.startedAt) * job.speed);
    }
    // The runtime has already updated Demo.speed and Demo.paused. Each job's
    // stored speed above is the previous rate, so elapsed time stays accurate.
    schedule(job);
  }
});
Demo.onCleanup(clearTimeline);
`;

const hiddenText = String.raw`
.visually-hidden {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}
`;

const recipes = [
  {
    id: 'press-feedback',
    title: 'Press feedback',
    category: 'feedback',
    description: 'A three-percent compression makes a button acknowledge the moment your finger lands.',
    purpose: 'Feedback',
    useWhen: 'Buttons, icon controls and other deliberate presses that need immediate acknowledgement.',
    avoidWhen: 'The target is already tiny, or scaling could make closely packed controls feel unstable.',
    principle: 'Respond on pointer-down. Keep frequently repeated feedback small and fast.',
    duration: '160 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Press or replay',
    tech: 'CSS',
    color: 'lavender',
    tags: ['button', 'press', 'tap', 'scale', 'microinteraction'],
    reducedMotion: 'The button changes color immediately; compression is removed.',
    source: 'animate/RECIPES.md',
    featured: true,
    html: String.raw`<main class="stage">
  <span class="demo-label">A little give goes a long way.</span>
  <button class="press-button" type="button">
    <span>Press me</span>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <span class="press-caption demo-label" aria-live="polite">Ready when you are</span>
</main>`,
    css: String.raw`
.press-button {
  display: inline-flex; align-items: center; justify-content: center; gap: 22px;
  min-width: 174px; min-height: 54px; padding: 14px 24px;
  border: 0; border-radius: 13px; background: var(--accent); color: var(--on-accent);
  font-size: 15px; font-weight: 600; user-select: none;
  box-shadow: 0 3px 0 var(--shadow);
  transition: transform calc(160ms * var(--time-scale)) var(--ease-out), background-color 160ms ease;
}
.press-button:active, .press-button.is-pressed { transform: scale(.97); background: var(--accent-hover); }
.press-caption { min-height: 18px; }
:root[data-reduced="true"] .press-button:active,
:root[data-reduced="true"] .press-button.is-pressed { transform: none; }
`,
    js: timeline + String.raw`
const button = document.querySelector('.press-button');
const caption = document.querySelector('.press-caption');
function reset() {
  clearTimeline();
  button.classList.remove('is-pressed');
  caption.textContent = 'Ready when you are';
}
button.addEventListener('pointerdown', () => { reset(); caption.textContent = 'Pressure received'; });
button.addEventListener('click', () => { caption.textContent = 'That is all it needs'; });
button.addEventListener('pointercancel', reset);
Demo.onReplay(() => {
  reset();
  if (Demo.reduced) return;
  after(160, () => { button.classList.add('is-pressed'); caption.textContent = 'Pointer down'; });
  after(800, () => { button.classList.remove('is-pressed'); caption.textContent = 'Release'; });
  after(1500, () => { caption.textContent = 'Ready when you are'; });
});
`,
  },
  {
    id: 'save-state',
    title: 'Save state',
    category: 'feedback',
    description: 'Ready, saving and saved share one steady button while their labels trade places.',
    purpose: 'State indication',
    useWhen: 'Saving preferences or confirming a completed action without adding a separate notification.',
    avoidWhen: 'A task needs detailed progress or a durable error message. Do not use a timer as proof that a real save succeeded.',
    principle: 'Bridge a state change with a small crossfade, while keeping the control interruptible.',
    duration: '200 ms state transition',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Click Save changes',
    tech: 'CSS',
    color: 'green',
    tags: ['save', 'success', 'button', 'crossfade', 'loading', 'state'],
    reducedMotion: 'The current label and status replace each other instantly; the spinner becomes static.',
    source: 'emil-design-eng/SKILL.md',
    html: String.raw`<main class="stage">
  <span class="demo-label">Three states. One steady surface.</span>
  <button class="save-button" data-state="ready" type="button" aria-label="Save changes">
    <span class="save-face ready" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 3h10l4 4v14H4V3h2Zm1 0v6h9V3M8 21v-7h8v7" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>Save changes</span>
    <span class="save-face saving" aria-hidden="true"><span class="save-spinner"></span>Saving…</span>
    <span class="save-face saved" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Changes saved</span>
  </button>
  <span class="save-status demo-label" role="status">Demo only · no files are written</span>
</main>`,
    css: String.raw`
.save-button {
  position: relative; width: 206px; max-width: 100%; height: 52px; padding: 0;
  border: 0; border-radius: 12px; background: var(--accent); color: var(--on-accent);
  transition: transform calc(160ms * var(--time-scale)) var(--ease-out), background-color 200ms ease;
}
.save-button:active { transform: scale(.97); }
.save-button[data-state="saved"] { background: var(--accent-hover); }
.save-face {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 9px;
  font-size: 14px; font-weight: 600; opacity: 0; transform: translateY(5px) scale(.97);
  transition: opacity calc(200ms * var(--time-scale)) var(--ease-out), transform calc(200ms * var(--time-scale)) var(--ease-out);
}
.save-button[data-state="ready"] .ready,
.save-button[data-state="saving"] .saving,
.save-button[data-state="saved"] .saved { opacity: 1; transform: translateY(0) scale(1); }
.save-spinner { width: 16px; height: 16px; border: 2px solid color-mix(in srgb, var(--on-accent) 30%, transparent); border-top-color: var(--on-accent); border-radius: 50%; }
.save-button[data-state="saving"] .save-spinner { animation: save-spin calc(650ms * var(--time-scale)) linear infinite; }
@keyframes save-spin { to { transform: rotate(360deg); } }
.save-status { min-height: 18px; }
:root[data-reduced="true"] .save-face { transform: none; }
:root[data-reduced="true"] .save-button:active { transform: none; }
`,
    js: timeline + String.raw`
const button = document.querySelector('.save-button');
const status = document.querySelector('.save-status');
const labels = { ready: 'Save changes', saving: 'Cancel simulated save', saved: 'Save changes again' };
function state(value) {
  button.dataset.state = value;
  button.setAttribute('aria-label', labels[value]);
  button.setAttribute('aria-busy', String(value === 'saving'));
  status.textContent = value === 'saving' ? 'Click again to cancel' : value === 'saved' ? 'Saved in this demonstration' : 'Demo only · no files are written';
}
function reset() { clearTimeline(); state('ready'); }
function save() {
  clearTimeline();
  if (button.dataset.state === 'saving') { state('ready'); return; }
  state('saving');
  // Replace this bounded simulation with your actual save promise.
  after(1000, () => state('saved'));
}
button.addEventListener('click', save);
Demo.onReplay(() => {
  reset();
  if (Demo.reduced) return;
  after(240, () => state('saving'));
  after(1300, () => state('saved'));
  after(2900, () => state('ready'));
});
`,
  },
  {
    id: 'hold-confirm',
    title: 'Hold to confirm',
    category: 'feedback',
    description: 'A deliberate two-second fill becomes a clear commitment, with a quick retreat if you let go.',
    purpose: 'Feedback',
    useWhen: 'A low-frequency commitment benefits from deliberate intent and an easy cancellation path.',
    avoidWhen: 'Routine actions, time-critical controls, or as the only way to confirm. Keep the non-hold alternative.',
    principle: 'Slow where a person decides; quick where the interface responds.',
    duration: '2,000 ms hold · 200 ms release',
    easing: 'linear hold · cubic-bezier(0.23, 1, 0.32, 1) release',
    trigger: 'Hold pointer, Space or Enter',
    tech: 'CSS',
    color: 'peach',
    tags: ['hold', 'confirm', 'clip-path', 'progress', 'asymmetric', 'button'],
    reducedMotion: 'The hold still takes two seconds. Only a static color and text change; the fill does not travel.',
    source: 'animate/RECIPES.md',
    featured: true,
    html: String.raw`<main class="stage hold-stage">
  <button class="hold-button" type="button" aria-describedby="hold-help">
    <span class="hold-fill" aria-hidden="true"></span><span class="hold-label">Hold to confirm</span>
  </button>
  <p id="hold-help" class="demo-label" role="status">Hold for 2 seconds. Release to cancel.</p>
  <button class="hold-alternative" type="button">Confirm without holding</button>
</main>`,
    css: String.raw`
.hold-stage { gap: 13px; }
.hold-button {
  position: relative; isolation: isolate; overflow: hidden; width: 218px; max-width: 100%; min-height: 54px;
  padding: 15px 20px; border: 0; border-radius: 12px; background: var(--accent-soft); color: var(--ink);
  font-size: 14px; font-weight: 650; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
  transition: transform calc(160ms * var(--time-scale)) var(--ease-out);
}
.hold-button[data-holding="true"] { transform: scale(.97); }
.hold-fill {
  position: absolute; inset: 0; z-index: -1; background: color-mix(in srgb, var(--accent) 22%, var(--accent-soft));
  clip-path: inset(0 100% 0 0);
  transition: clip-path calc(200ms * var(--time-scale)) var(--ease-out);
}
.hold-button[data-holding="true"] .hold-fill { clip-path: inset(0); transition-duration: calc(2000ms * var(--time-scale)); transition-timing-function: linear; }
.hold-button[data-confirmed="true"] .hold-fill { clip-path: inset(0); }
.hold-alternative { min-height: 38px; padding: 6px 12px; background: transparent; color: var(--ink); border: 0; border-radius: 7px; font-size: 12px; text-decoration: underline; text-underline-offset: 3px; }
:root[data-reduced="true"] .hold-button[data-holding="true"] { transform: none; }
:root[data-reduced="true"] .hold-fill { clip-path: none; opacity: 0; }
:root[data-reduced="true"] .hold-button[data-holding="true"] .hold-fill { opacity: .4; }
:root[data-reduced="true"] .hold-button[data-confirmed="true"] .hold-fill { opacity: 1; }
`,
    js: timeline + String.raw`
const button = document.querySelector('.hold-button');
const label = document.querySelector('.hold-label');
const help = document.querySelector('#hold-help');
const alternative = document.querySelector('.hold-alternative');
let holding = false;
let pointerId = null;
let alternativeArmed = false;
function reset() {
  clearTimeline(); holding = false; pointerId = null; alternativeArmed = false;
  button.dataset.holding = 'false'; button.dataset.confirmed = 'false';
  label.textContent = 'Hold to confirm';
  help.textContent = 'Hold for 2 seconds. Release to cancel.';
  alternative.textContent = 'Confirm without holding';
}
function confirm() {
  clearTimeline(); holding = false; pointerId = null; button.dataset.holding = 'false'; button.dataset.confirmed = 'true';
  label.textContent = 'Confirmed'; help.textContent = 'A demonstration only. Nothing was changed.';
  alternativeArmed = false; alternative.textContent = 'Reset demonstration';
}
function start() {
  reset(); holding = true; button.dataset.holding = 'true';
  label.textContent = 'Keep holding…'; help.textContent = 'You can still release to cancel.';
  // Do not use Demo.duration here: reduced motion must not remove the deliberate wait.
  after(2000, confirm);
}
function release() {
  if (!holding) return;
  clearTimeline(); holding = false; pointerId = null; button.dataset.holding = 'false';
  label.textContent = 'Hold to confirm'; help.textContent = 'Cancelled. Nothing changed.';
}
button.addEventListener('pointerdown', event => {
  if (event.button !== 0 || pointerId !== null) return;
  start(); pointerId = event.pointerId; button.setPointerCapture(event.pointerId);
});
button.addEventListener('pointermove', event => {
  if (!holding || event.pointerId !== pointerId) return;
  const rect = button.getBoundingClientRect();
  if (event.clientX < rect.left - 10 || event.clientX > rect.right + 10 || event.clientY < rect.top - 10 || event.clientY > rect.bottom + 10) release();
});
button.addEventListener('pointerup', release);
button.addEventListener('pointercancel', release);
button.addEventListener('lostpointercapture', release);
button.addEventListener('keydown', event => {
  if (event.code !== 'Space' && event.code !== 'Enter') return;
  event.preventDefault();
  if (!event.repeat && !holding) start();
});
button.addEventListener('keyup', event => {
  if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); release(); }
});
button.addEventListener('blur', release);
alternative.addEventListener('click', () => {
  if (button.dataset.confirmed === 'true') { reset(); return; }
  if (alternativeArmed) { confirm(); return; }
  reset(); alternativeArmed = true;
  alternative.textContent = 'Click again to confirm';
  help.textContent = 'A second click confirms this demonstration.';
});
Demo.onReplay(() => {
  reset();
  if (Demo.reduced) return;
  after(180, () => { holding = true; button.dataset.holding = 'true'; label.textContent = 'Keep holding…'; });
  after(2180, confirm);
});
Demo.onSettings((next, previous) => {
  const interrupted = (next.paused && !previous.paused) || next.speed !== previous.speed || next.reduced !== previous.reduced;
  if (!interrupted || (!holding && scheduled.size === 0 && !alternativeArmed)) return;
  // A confirmation is never completed by a playback setting. Start a new hold
  // after pausing, changing speed, or changing motion preference.
  reset();
  help.textContent = 'Hold cancelled. Nothing changed. Start again when ready.';
});
`,
  },
  {
    id: 'toggle-switch',
    title: 'Toggle switch',
    category: 'feedback',
    description: 'The thumb crosses a short track while the label and color confirm the new setting.',
    purpose: 'State indication',
    useWhen: 'A setting changes immediately and its on/off state needs to stay obvious.',
    avoidWhen: 'A change requires a separate Save action, or when a checkbox would express selection more clearly.',
    principle: 'Use a short, interruptible transition for a repeatedly used state change.',
    duration: '180 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Click, tap or Space',
    tech: 'CSS',
    color: 'green',
    tags: ['toggle', 'switch', 'setting', 'thumb', 'form', 'interruptible'],
    reducedMotion: 'The thumb moves instantly to its correct endpoint; the on/off labels remain explicit.',
    source: 'animate/SKILL.md',
    html: String.raw`<main class="stage">
  <label class="switch-row">
    <span class="switch-copy"><strong>Focus mode</strong><span class="switch-state">Off · open to ideas</span></span>
    <input id="focus-switch" class="visually-hidden" type="checkbox" role="switch" />
    <span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>
  </label>
  <span class="demo-label">Try reversing it mid-motion.</span>
</main>`,
    css: hiddenText + String.raw`
.switch-row { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 258px; max-width: 100%; min-height: 86px; padding: 17px; border-radius: 16px; background: var(--paper); cursor: pointer; touch-action: manipulation; }
.switch-copy { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.switch-copy strong { font-size: 14px; font-weight: 600; }
.switch-state { font-size: 11px; color: var(--muted); }
.switch-track { display: block; flex-shrink: 0; width: 47px; height: 28px; padding: 3px; border-radius: 20px; background: var(--line); transition: background-color calc(180ms * var(--time-scale)) ease; }
.switch-thumb { display: block; width: 22px; height: 22px; border-radius: 50%; background: var(--ink); box-shadow: 0 1px 3px var(--shadow); transition: transform calc(180ms * var(--time-scale)) var(--ease-out); }
#focus-switch:checked + .switch-track { background: var(--accent); }
#focus-switch:checked + .switch-track .switch-thumb { transform: translateX(19px); background: var(--on-accent); }
#focus-switch:focus-visible + .switch-track { outline: 3px solid var(--accent); outline-offset: 4px; }
`,
    js: timeline + String.raw`
const input = document.querySelector('#focus-switch');
const state = document.querySelector('.switch-state');
function render() { state.textContent = input.checked ? 'On · room to think' : 'Off · open to ideas'; }
function setChecked(checked) { input.checked = checked; render(); }
input.addEventListener('change', () => { clearTimeline(); render(); });
document.querySelector('.switch-row').addEventListener('pointerdown', clearTimeline);
function reset() { clearTimeline(); setChecked(false); }
Demo.onReplay(() => {
  reset();
  if (Demo.reduced) return;
  after(180, () => setChecked(true));
  after(1400, () => setChecked(false));
});
`,
  },
  {
    id: 'progress-button',
    title: 'Progress button',
    category: 'feedback',
    description: 'A fill advances inside the action itself, keeping progress close to the thing you started.',
    purpose: 'State indication',
    useWhen: 'An action has meaningful, measurable progress and can keep a compact footprint.',
    avoidWhen: 'The completion amount is unknown. Use an indeterminate state instead of invented progress.',
    principle: 'Progress uses linear motion; the action remains cancellable while it runs.',
    duration: '1,600 ms simulated task · 180 ms response',
    easing: 'linear progress · cubic-bezier(0.23, 1, 0.32, 1) response',
    trigger: 'Click Prepare export',
    tech: 'CSS',
    color: 'blue',
    tags: ['progress', 'loading', 'button', 'linear', 'cancel', 'scaleX'],
    reducedMotion: 'The task still runs, with a static Preparing label followed by Ready. The moving fill is hidden.',
    source: 'animate/SKILL.md',
    html: String.raw`<main class="stage">
  <span class="demo-label">Keep progress close to the action.</span>
  <button class="progress-button" data-state="idle" type="button">
    <span class="progress-fill" aria-hidden="true"></span>
    <span class="progress-label">Prepare export</span>
    <svg class="progress-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v11m-4-4 4 4 4-4M5 17v3h14v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <span class="progress-status demo-label" role="status">A simulated export, with cancel.</span>
</main>`,
    css: String.raw`
.progress-button { position: relative; isolation: isolate; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 14px; width: 222px; max-width: 100%; min-height: 54px; padding: 14px 18px; border: 0; border-radius: 12px; background: var(--accent-soft); color: var(--ink); font-size: 14px; font-weight: 600; transition: transform calc(160ms * var(--time-scale)) var(--ease-out); }
.progress-button:active { transform: scale(.97); }
.progress-fill { position: absolute; z-index: -1; inset: 0; background: color-mix(in srgb, var(--accent) 22%, var(--accent-soft)); transform: scaleX(0); transform-origin: left center; transition: transform calc(180ms * var(--time-scale)) var(--ease-out); }
.progress-button[data-state="running"] .progress-fill { transform: scaleX(1); transition-duration: calc(1600ms * var(--time-scale)); transition-timing-function: linear; }
.progress-button[data-state="done"] .progress-fill { transform: scaleX(1); }
.progress-status { min-height: 18px; }
:root[data-reduced="true"] .progress-button:active { transform: none; }
:root[data-reduced="true"] .progress-button[data-state="running"] .progress-fill { opacity: 0; }
`,
    js: timeline + String.raw`
const button = document.querySelector('.progress-button');
const label = document.querySelector('.progress-label');
const status = document.querySelector('.progress-status');
function state(value) {
  button.dataset.state = value;
  button.setAttribute('aria-busy', String(value === 'running'));
  button.setAttribute('aria-label', value === 'running' ? 'Cancel export' : value === 'done' ? 'Reset export demonstration' : 'Prepare export');
  label.textContent = value === 'running' ? 'Preparing…' : value === 'done' ? 'Export ready' : 'Prepare export';
  status.textContent = value === 'running' ? 'Click again to cancel.' : value === 'done' ? 'Done in this demo. Click to reset.' : 'A simulated export, with cancel.';
}
function reset() { clearTimeline(); state('idle'); }
button.addEventListener('click', () => {
  if (button.dataset.state !== 'idle') { reset(); return; }
  clearTimeline(); state('running');
  // A real export should drive the fill from real progress, not this timer.
  after(1600, () => state('done'));
});
Demo.onReplay(() => {
  reset();
  if (Demo.reduced) return;
  after(240, () => state('running'));
  after(1840, () => state('done'));
  after(3400, () => state('idle'));
});
`,
  },
  {
    id: 'error-nudge',
    title: 'Error nudge',
    category: 'feedback',
    description: 'A short horizontal nudge points to a field that needs attention, alongside a useful message.',
    purpose: 'Feedback',
    useWhen: 'A person explicitly submits an invalid value and the problem can be explained at that field.',
    avoidWhen: 'Every keystroke, passive validation, or errors that are not the user’s fault. Motion must never be the only signal.',
    principle: 'Keep error feedback brief and local; the message does the explaining.',
    duration: '240 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Try an incomplete code',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['error', 'shake', 'form', 'validation', 'nudge', 'WAAPI'],
    reducedMotion: 'The error text and field outline update without any side-to-side movement.',
    source: 'animation-vocabulary/SKILL.md',
    html: String.raw`<main class="stage error-stage">
  <form class="code-form" novalidate>
    <label for="sample-code">Verification code</label>
    <div class="code-entry"><input id="sample-code" type="text" inputmode="numeric" maxlength="6" value="124" autocomplete="off" aria-describedby="code-message" /><span aria-hidden="true">6 digits</span></div>
    <p id="code-message" class="code-message" aria-live="polite">Demo only. Try 123456 to pass.</p>
    <button class="demo-button" type="submit">Try code</button>
  </form>
</main>`,
    css: String.raw`
.error-stage { padding-top: 16px; padding-bottom: 16px; }
.code-form { width: 230px; max-width: 100%; display: flex; flex-direction: column; align-items: stretch; gap: 9px; }
.code-form > label { font-size: 13px; font-weight: 600; }
.code-entry { display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 0 12px; background: var(--paper); border: 2px solid transparent; border-radius: 10px; }
.code-entry[data-invalid="true"] { border-color: var(--danger); }
.code-entry[data-valid="true"] { border-color: var(--success); }
.code-entry input { min-width: 0; width: 100%; padding: 9px 0; border: 0; border-radius: 0; background: transparent; color: var(--ink); font-size: 16px; font-variant-numeric: tabular-nums; letter-spacing: .14em; }
.code-entry input:focus-visible { outline-offset: 3px; }
.code-entry > span { flex-shrink: 0; font-size: 11px; color: var(--muted); }
.code-message { min-height: 18px; font-size: 11px; color: var(--muted); }
.code-form .demo-button { align-self: flex-start; font-size: 13px; }
`,
    js: timeline + String.raw`
const form = document.querySelector('.code-form');
const input = document.querySelector('#sample-code');
const entry = document.querySelector('.code-entry');
const message = document.querySelector('#code-message');
let motion;
function validate() {
  const valid = /^\d{6}$/.test(input.value);
  entry.dataset.invalid = String(!valid); entry.dataset.valid = String(valid);
  input.setAttribute('aria-invalid', String(!valid));
  message.textContent = valid ? 'Six digits. You are good to go.' : 'Use six digits. Try 123456.';
  if (valid || Demo.reduced) { motion?.cancel(); return; }
  // A rapid repeat starts from the current presentation value, without a jump.
  const current = getComputedStyle(entry).transform;
  motion?.cancel();
  motion = Demo.animate(entry, [
    { transform: current === 'none' ? 'translateX(0)' : current },
    { transform: 'translateX(-5px)', offset: .2 },
    { transform: 'translateX(4px)', offset: .45 },
    { transform: 'translateX(-2px)', offset: .7 },
    { transform: 'translateX(0)' }
  ], { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}
function reset() {
  clearTimeline(); motion?.cancel(); entry.style.transform = '';
  entry.dataset.invalid = 'false'; entry.dataset.valid = 'false'; input.removeAttribute('aria-invalid');
  message.textContent = 'Demo only. Try 123456 to pass.';
}
form.addEventListener('submit', event => { event.preventDefault(); clearTimeline(); validate(); });
input.addEventListener('input', reset);
Demo.onReplay(() => {
  reset(); input.value = '124';
  if (Demo.reduced) return;
  after(420, validate);
});
Demo.onSettings((next, previous) => { if (next.reduced && !previous.reduced) { motion?.cancel(); entry.style.transform = ''; } });
Demo.onCleanup(() => motion?.cancel());
`,
  },
  {
    id: 'sliding-tabs',
    title: 'Sliding tabs',
    category: 'navigation',
    description: 'An underline carries the selection across a tab row while the content changes immediately.',
    purpose: 'Spatial consistency',
    useWhen: 'A small set of peer views benefits from a clearly connected selected position.',
    avoidWhen: 'Animating the page content would slow frequent navigation. Keep the contents instant and keyboard changes immediate.',
    principle: 'Move the indicator with transforms; do not make people wait for the destination.',
    duration: '220 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Select a tab',
    tech: 'CSS',
    color: 'sand',
    tags: ['tabs', 'indicator', 'underline', 'navigation', 'transform', 'keyboard'],
    reducedMotion: 'The indicator moves immediately to the chosen tab and the selected panel stays readable.',
    source: 'animate/SKILL.md',
    html: String.raw`<main class="stage">
  <section class="tab-card" aria-label="Project views">
    <div class="tab-row" role="tablist" aria-label="Project view">
      <button id="tab-overview" type="button" role="tab" aria-selected="true" aria-controls="panel-overview" tabindex="0">Overview</button>
      <button id="tab-activity" type="button" role="tab" aria-selected="false" aria-controls="panel-activity" tabindex="-1">Activity</button>
      <button id="tab-notes" type="button" role="tab" aria-selected="false" aria-controls="panel-notes" tabindex="-1">Notes</button>
      <span class="tab-indicator" aria-hidden="true"></span>
    </div>
    <div class="tab-panel" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" tabindex="0"><strong>A little more room to play.</strong><span>12 ideas in progress</span></div>
    <div class="tab-panel" id="panel-activity" role="tabpanel" aria-labelledby="tab-activity" tabindex="0" hidden><strong>Three fresh experiments.</strong><span>Updated a moment ago</span></div>
    <div class="tab-panel" id="panel-notes" role="tabpanel" aria-labelledby="tab-notes" tabindex="0" hidden><strong>Small details add up.</strong><span>Keep the useful ones close</span></div>
  </section>
</main>`,
    css: String.raw`
.tab-card { width: 260px; max-width: 100%; padding: 13px 13px 17px; border-radius: 16px; background: var(--paper); }
.tab-row { position: relative; display: flex; width: 100%; padding-bottom: 3px; }
.tab-row [role="tab"] { flex: 1; min-width: 0; min-height: 42px; padding: 8px 6px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); font-size: 12px; font-weight: 550; }
.tab-row [aria-selected="true"] { color: var(--ink); }
.tab-indicator { position: absolute; left: 0; bottom: 0; width: 1px; height: 3px; background: var(--accent); transform-origin: left center; transition: transform calc(220ms * var(--time-scale)) var(--ease-in-out); }
.tab-panel { display: flex; flex-direction: column; justify-content: center; gap: 6px; min-height: 92px; padding: 14px 5px; }
.tab-panel strong { font-size: 14px; font-weight: 550; line-height: 1.35; }
.tab-panel > span:last-child { font-size: 11px; color: var(--muted); }
`,
    js: timeline + String.raw`
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const indicator = document.querySelector('.tab-indicator');
let active = 0;
function positionIndicator() {
  const tab = tabs[active];
  indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px) scaleX(' + tab.offsetWidth + ')';
}
function select(index, focus = false) {
  active = index;
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
  positionIndicator();
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { clearTimeline(); select(index); });
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (active + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (active - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); clearTimeline(); select(next, true);
  });
});
const observer = new ResizeObserver(positionIndicator);
observer.observe(document.querySelector('.tab-row'));
select(0);
Demo.onReplay(() => {
  clearTimeline(); select(0);
  if (Demo.reduced) return;
  after(250, () => select(1));
  after(1450, () => select(2));
  after(2650, () => select(0));
});
Demo.onCleanup(() => observer.disconnect());
`,
  },
  {
    id: 'segmented-control',
    title: 'Segmented control',
    category: 'navigation',
    description: 'A clipped duplicate keeps the active background and its label perfectly in step.',
    purpose: 'State indication',
    useWhen: 'Short, mutually exclusive options such as time periods, display modes or chart views.',
    avoidWhen: 'The options have long labels or need to wrap. Use a select or a vertical group instead.',
    principle: 'Reveal one already-colored layer, rather than trying to synchronize several color transitions.',
    duration: '250 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Select a period',
    tech: 'CSS',
    color: 'graphite',
    tags: ['segmented', 'tabs', 'clip-path', 'radio', 'selection', 'mask'],
    reducedMotion: 'The active mask updates immediately. Native radio controls retain their keyboard behavior.',
    source: 'animate/RECIPES.md',
    featured: true,
    html: String.raw`<main class="stage">
  <span class="demo-label">A perfect little handover.</span>
  <fieldset class="segments">
    <legend class="visually-hidden">Time period</legend>
    <label><input class="visually-hidden" type="radio" name="period" value="Day" checked /><span>Day</span></label>
    <label><input class="visually-hidden" type="radio" name="period" value="Week" /><span>Week</span></label>
    <label><input class="visually-hidden" type="radio" name="period" value="Month" /><span>Month</span></label>
    <div class="segment-copy" aria-hidden="true"><span>Day</span><span>Week</span><span>Month</span></div>
  </fieldset>
  <span class="period-caption demo-label">Today, at a glance</span>
</main>`,
    css: hiddenText + String.raw`
.segments { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; width: 254px; max-width: 100%; margin: 0; padding: 4px; border: 0; border-radius: 14px; background: var(--paper); }
.segments > label, .segment-copy > span { display: flex; align-items: center; justify-content: center; min-height: 44px; padding: 9px 7px; border-radius: 10px; font-size: 13px; font-weight: 550; line-height: 1.3; }
.segments > label { cursor: pointer; touch-action: manipulation; color: var(--muted); }
.segments > label:has(input:focus-visible) { outline: 3px solid var(--accent); outline-offset: 4px; }
.segment-copy { pointer-events: none; position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; padding: 4px; border-radius: 14px; background: var(--ink); color: var(--on-ink); clip-path: inset(4px 66% 4px 4px round 10px); transition: clip-path calc(250ms * var(--time-scale)) var(--ease-in-out); }
.period-caption { min-height: 18px; }
`,
    js: timeline + String.raw`
const radios = [...document.querySelectorAll('input[name="period"]')];
const labels = [...document.querySelectorAll('.segments > label')];
const fieldset = document.querySelector('.segments');
const copy = document.querySelector('.segment-copy');
const caption = document.querySelector('.period-caption');
const captions = ['Today, at a glance', 'A little perspective on the week', 'The bigger picture this month'];
function render() {
  const index = Math.max(0, radios.findIndex(input => input.checked));
  const label = labels[index];
  const left = label.offsetLeft;
  const right = fieldset.clientWidth - left - label.offsetWidth;
  copy.style.clipPath = 'inset(4px ' + right + 'px 4px ' + left + 'px round 10px)';
  caption.textContent = captions[index];
}
function select(index) { radios[index].checked = true; render(); }
radios.forEach(input => input.addEventListener('change', () => { clearTimeline(); render(); }));
fieldset.addEventListener('pointerdown', clearTimeline);
const observer = new ResizeObserver(render); observer.observe(fieldset);
render();
Demo.onReplay(() => {
  clearTimeline(); select(0);
  if (Demo.reduced) return;
  after(240, () => select(1));
  after(1300, () => select(2));
  after(2400, () => select(0));
});
Demo.onCleanup(() => observer.disconnect());
`,
  },
  {
    id: 'menu-icon',
    title: 'Menu to close',
    category: 'navigation',
    description: 'Two lines rotate into a close mark, preserving the identity of the control between states.',
    purpose: 'State indication',
    useWhen: 'A compact navigation toggle should show both the open state and how to leave it.',
    avoidWhen: 'A labeled close button would be clearer. Keep an accessible name even when the visual is only an icon.',
    principle: 'A small reversible transform is enough to connect open and closed.',
    duration: '180 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Toggle the menu',
    tech: 'CSS',
    color: 'lavender',
    tags: ['menu', 'hamburger', 'close', 'icon', 'morph', 'navigation'],
    reducedMotion: 'The two-line and close states swap immediately, with the expanded state still announced.',
    source: 'animate/SKILL.md',
    html: String.raw`<main class="stage">
  <section class="menu-card" aria-label="Navigation example">
    <header><strong>Little studio</strong><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="sample-navigation"><span class="menu-lines" aria-hidden="true"><span></span><span></span></span></button></header>
    <p class="menu-note">A small gesture for opening things up.</p>
    <nav id="sample-navigation" aria-label="Sample navigation" hidden><button type="button">Projects<span aria-hidden="true">${recipeIcon('arrow')}</span></button><button type="button">Field notes<span aria-hidden="true">${recipeIcon('arrow')}</span></button></nav>
  </section>
</main>`,
    css: String.raw`
.menu-card { width: 250px; max-width: 100%; min-height: 160px; padding: 13px 16px 17px; border-radius: 16px; background: var(--paper); }
.menu-card header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.menu-card header strong { font-size: 14px; font-weight: 600; }
.menu-toggle { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 10px; background: var(--accent-soft); color: var(--ink); }
.menu-lines { position: relative; width: 20px; height: 16px; }
.menu-lines > span { position: absolute; left: 0; top: 7px; width: 20px; height: 2px; border-radius: 2px; background: currentColor; transition: transform calc(180ms * var(--time-scale)) var(--ease-out); }
.menu-lines > span:first-child { transform: translateY(-4px); }
.menu-lines > span:last-child { transform: translateY(4px); }
.menu-toggle[aria-expanded="true"] .menu-lines > span:first-child { transform: rotate(45deg); }
.menu-toggle[aria-expanded="true"] .menu-lines > span:last-child { transform: rotate(-45deg); }
.menu-note { padding: 17px 0 0; max-width: 190px; color: var(--muted); font-size: 13px; line-height: 1.55; }
#sample-navigation { padding-top: 5px; }
#sample-navigation button { display: flex; justify-content: space-between; align-items: center; width: 100%; min-height: 35px; padding: 6px 2px; border: 0; border-radius: 4px; background: none; color: var(--ink); font-size: 13px; text-align: left; }
`,
    js: timeline + String.raw`
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#sample-navigation');
const note = document.querySelector('.menu-note');
function open(value) {
  toggle.setAttribute('aria-expanded', String(value));
  toggle.setAttribute('aria-label', value ? 'Close navigation' : 'Open navigation');
  nav.hidden = !value; note.hidden = value;
}
toggle.addEventListener('click', () => { clearTimeline(); open(toggle.getAttribute('aria-expanded') !== 'true'); });
nav.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
  clearTimeline(); note.textContent = button.firstChild.textContent.trim() + ' selected in this demo.'; open(false); toggle.focus();
}));
document.querySelector('.menu-card').addEventListener('keydown', event => {
  if (event.key === 'Escape' && !nav.hidden) { clearTimeline(); open(false); toggle.focus(); }
});
Demo.onReplay(() => {
  clearTimeline(); open(false); note.textContent = 'A small gesture for opening things up.';
  if (Demo.reduced) return;
  after(200, () => open(true));
  after(1700, () => open(false));
});
`,
  },
  {
    id: 'origin-popover',
    title: 'Origin-aware popover',
    category: 'navigation',
    description: 'A small surface opens toward its trigger instead of appearing from an arbitrary center.',
    purpose: 'Spatial consistency',
    useWhen: 'A short contextual panel belongs to a visible trigger and needs an obvious spatial connection.',
    avoidWhen: 'Complex application menus require a complete menu primitive. This example uses ordinary buttons inside a native popover.',
    principle: 'Set the transform origin at the trigger; start at scale 0.95 and fade in.',
    duration: '200 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Open Quick actions',
    tech: 'CSS',
    color: 'blue',
    tags: ['popover', 'origin', 'scale', 'native', 'surface', 'context'],
    reducedMotion: 'The popover appears in place immediately, retaining its native dismissal and focus behavior.',
    source: 'animate/RECIPES.md',
    featured: true,
    html: String.raw`<main class="stage">
  <div class="popover-scene">
    <p class="popover-status demo-label" role="status">A surface with a sense of place.</p>
    <button class="demo-button popover-trigger" type="button" popovertarget="quick-actions" aria-expanded="false" aria-controls="quick-actions">Quick actions<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 14 6-6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>
  <section id="quick-actions" class="quick-actions" popover="auto" aria-label="Quick actions">
    <p>Keep this idea close</p>
    <button type="button" data-action="Pinned for later in this demo."><span aria-hidden="true">${recipeIcon('arrow', 15)}</span>Pin for later</button>
    <button type="button" data-action="Added to a collection in this demo."><span aria-hidden="true">${recipeIcon('plus', 15)}</span>Add to collection</button>
  </section>
</main>`,
    css: String.raw`
.popover-scene { position: relative; display: flex; align-items: flex-end; justify-content: center; width: 248px; max-width: 100%; min-height: 166px; }
.popover-status { position: absolute; top: 8px; left: 0; right: 0; }
.popover-trigger { background: var(--accent); color: var(--on-accent); }
.quick-actions { position: fixed; inset: auto; margin: 0; width: 216px; max-width: calc(100% - 20px); padding: 11px; border: 0; border-radius: 13px; background: var(--paper); color: var(--ink); box-shadow: 0 3px 15px var(--shadow); opacity: 0; transform: scale(.95); transform-origin: var(--popover-origin, 50% 100%); transition: opacity calc(200ms * var(--time-scale)) var(--ease-out), transform calc(200ms * var(--time-scale)) var(--ease-out), display calc(200ms * var(--time-scale)) allow-discrete, overlay calc(200ms * var(--time-scale)) allow-discrete; }
.quick-actions:popover-open { opacity: 1; transform: scale(1); }
.quick-actions.is-fallback-open { opacity: 1; transform: scale(1); }
@starting-style { .quick-actions:popover-open { opacity: 0; transform: scale(.95); } }
.quick-actions > p { padding: 2px 7px 6px; color: var(--muted); font-size: 11px; }
.quick-actions > button { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 34px; padding: 7px; border: 0; border-radius: 7px; background: transparent; color: var(--ink); text-align: left; font-size: 12px; }
.quick-actions > button > span { width: 15px; text-align: center; font-size: 16px; }
@media (hover: hover) and (pointer: fine) { .quick-actions > button:hover { background: var(--accent-soft); } }
:root[data-reduced="true"] .quick-actions { transform: none; }
`,
    js: timeline + String.raw`
const trigger = document.querySelector('.popover-trigger');
const panel = document.querySelector('#quick-actions');
const status = document.querySelector('.popover-status');
const nativePopover = typeof panel.showPopover === 'function';
function isOpen() { return nativePopover ? panel.matches(':popover-open') : !panel.hidden; }
function position() {
  const rect = trigger.getBoundingClientRect();
  const width = panel.offsetWidth || 216;
  const height = panel.offsetHeight || 115;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const left = Math.min(Math.max(10, rect.left + rect.width / 2 - width / 2), Math.max(10, viewportWidth - width - 10));
  const above = rect.top >= height + 18 || viewportHeight - rect.bottom < height + 18;
  const top = above ? Math.max(10, rect.top - height - 9) : Math.min(viewportHeight - height - 10, rect.bottom + 9);
  panel.style.left = left + 'px'; panel.style.top = Math.max(10, top) + 'px';
  panel.style.setProperty('--popover-origin', (rect.left + rect.width / 2 - left) + 'px ' + (above ? '100%' : '0%'));
}
function setOpen(value) {
  if (value === isOpen()) return;
  if (nativePopover) { if (value) panel.showPopover(); else panel.hidePopover(); }
  else { panel.hidden = !value; panel.classList.toggle('is-fallback-open', value); }
  trigger.setAttribute('aria-expanded', String(value));
  if (value) position();
}
if (nativePopover) {
  panel.addEventListener('beforetoggle', event => { if (event.newState === 'open') position(); });
  panel.addEventListener('toggle', () => { trigger.setAttribute('aria-expanded', String(isOpen())); if (isOpen()) position(); });
  trigger.addEventListener('click', clearTimeline);
} else {
  panel.removeAttribute('popover'); panel.hidden = true; trigger.removeAttribute('popovertarget');
  trigger.addEventListener('click', () => { clearTimeline(); setOpen(!isOpen()); });
  document.addEventListener('click', event => { if (!panel.contains(event.target) && !trigger.contains(event.target)) setOpen(false); });
}
panel.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  clearTimeline(); status.textContent = button.dataset.action; setOpen(false); trigger.focus();
}));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && isOpen()) { clearTimeline(); setOpen(false); trigger.focus(); } });
window.addEventListener('resize', position);
Demo.onReplay(() => {
  clearTimeline(); setOpen(false); status.textContent = 'A surface with a sense of place.';
  if (Demo.reduced) return;
  after(240, () => setOpen(true));
  after(2350, () => setOpen(false));
});
Demo.onCleanup(() => window.removeEventListener('resize', position));
`,
  },
  {
    id: 'tooltip-reveal',
    title: 'Tooltip reveal',
    category: 'navigation',
    description: 'A compact hint resolves from its control with a barely perceptible scale and fade.',
    purpose: 'Spatial consistency',
    useWhen: 'An icon benefits from a short supplemental hint. The control itself still needs an accessible name.',
    avoidWhen: 'The information is essential, interactive, or unavailable anywhere else. Keep essential instructions visible.',
    principle: 'Delay the first hover hint; respond immediately to focus and skip repeated delays in a group.',
    duration: '125 ms · 350 ms first-hover delay',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Hover, focus or tap',
    tech: 'CSS',
    color: 'sand',
    tags: ['tooltip', 'hint', 'focus', 'hover', 'popover', 'origin'],
    reducedMotion: 'The hint appears and disappears immediately without scaling.',
    source: 'animate/RECIPES.md',
    html: String.raw`<main class="stage">
  <div class="tooltip-scene">
    <button class="hint-trigger" type="button" aria-label="Keyboard shortcuts" aria-describedby="shortcut-hint"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M7 9h.01M11 9h.01M15 9h2M7 12h.01M11 12h.01M15 12h2M8 15h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>
    <span class="demo-label">Little hints, right on cue.</span>
  </div>
  <span id="shortcut-hint" class="shortcut-hint" role="tooltip" popover="manual">Keyboard shortcuts <kbd>?</kbd></span>
</main>`,
    css: String.raw`
.tooltip-scene { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 14px; width: 240px; max-width: 100%; min-height: 144px; }
.hint-trigger { display: flex; align-items: center; justify-content: center; width: 54px; height: 50px; padding: 0; border: 0; border-radius: 13px; background: var(--paper); color: var(--ink); transition: transform calc(160ms * var(--time-scale)) var(--ease-out); }
.hint-trigger:active { transform: scale(.97); }
.shortcut-hint { position: fixed; inset: auto; margin: 0; max-width: calc(100% - 16px); padding: 9px 11px; border: 0; border-radius: 8px; background: var(--ink); color: var(--on-ink); box-shadow: 0 2px 8px var(--shadow); font-size: 11px; line-height: 1.4; white-space: nowrap; opacity: 0; transform: scale(.97); transform-origin: center bottom; transition: opacity calc(125ms * var(--time-scale)) var(--ease-out), transform calc(125ms * var(--time-scale)) var(--ease-out), display calc(125ms * var(--time-scale)) allow-discrete, overlay calc(125ms * var(--time-scale)) allow-discrete; }
.shortcut-hint:popover-open { opacity: 1; transform: scale(1); }
.shortcut-hint.is-fallback-open { opacity: 1; transform: scale(1); }
@starting-style { .shortcut-hint:popover-open { opacity: 0; transform: scale(.97); } }
.shortcut-hint kbd { margin-left: 8px; padding: 1px 4px; border-radius: 3px; background: color-mix(in srgb, var(--on-ink) 13%, transparent); color: var(--on-ink); font: inherit; }
:root[data-reduced="true"] .shortcut-hint, :root[data-reduced="true"] .hint-trigger:active { transform: none; }
`,
    js: timeline + String.raw`
const trigger = document.querySelector('.hint-trigger');
const hint = document.querySelector('#shortcut-hint');
const nativePopover = typeof hint.showPopover === 'function';
const canHover = matchMedia('(hover: hover) and (pointer: fine)');
let hoverTimer;
function cancelHover() { cancelAfter(hoverTimer); hoverTimer = null; }
function isOpen() { return nativePopover ? hint.matches(':popover-open') : !hint.hidden; }
function hide() {
  cancelHover();
  if (nativePopover) { if (isOpen()) hint.hidePopover(); }
  else { hint.hidden = true; hint.classList.remove('is-fallback-open'); }
}
function show() {
  cancelHover();
  if (nativePopover) { if (!isOpen()) hint.showPopover(); }
  else { hint.hidden = false; hint.classList.add('is-fallback-open'); }
  const rect = trigger.getBoundingClientRect();
  const left = Math.max(8, Math.min(document.documentElement.clientWidth - hint.offsetWidth - 8, rect.left + (rect.width - hint.offsetWidth) / 2));
  hint.style.left = left + 'px'; hint.style.top = Math.max(8, rect.top - hint.offsetHeight - 10) + 'px';
}
if (!nativePopover) { hint.removeAttribute('popover'); hint.hidden = true; }
trigger.addEventListener('pointerenter', () => {
  if (!canHover.matches) return;
  clearTimeline(); cancelHover(); hoverTimer = after(350, show);
});
trigger.addEventListener('pointerleave', () => { if (!trigger.matches(':focus-visible')) hide(); });
trigger.addEventListener('focus', () => { clearTimeline(); if (trigger.matches(':focus-visible')) show(); });
trigger.addEventListener('blur', hide);
trigger.addEventListener('click', event => {
  clearTimeline();
  if (event.detail === 0 || canHover.matches) { show(); return; }
  if (isOpen()) hide(); else show();
});
document.addEventListener('pointerdown', event => { if (!trigger.contains(event.target)) hide(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') hide(); });
Demo.onReplay(() => {
  clearTimeline(); hide();
  if (Demo.reduced) return;
  after(300, show);
  after(2000, hide);
});
`,
  },
  {
    id: 'underline-trail',
    title: 'Underline trail',
    category: 'navigation',
    description: 'An underline arrives from the left and leaves to the right, giving a text action a quiet direction.',
    purpose: 'Feedback',
    useWhen: 'A text action on an editorial or marketing surface needs a small pointer affordance.',
    avoidWhen: 'A dense list would keep triggering the effect, or a plain persistent underline would be clearer.',
    principle: 'A small transform can establish direction without moving the words people are reading.',
    duration: '200 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Hover, focus or tap',
    tech: 'CSS',
    color: 'peach',
    tags: ['underline', 'hover', 'link', 'text', 'transform-origin', 'trail'],
    reducedMotion: 'The underline appears instantly. The text never moves.',
    source: 'emil-design-eng/SKILL.md',
    html: String.raw`<main class="stage">
  <span class="demo-label">The words stay right where they are.</span>
  <button class="text-action" type="button"><span>Read the field notes</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  <span class="underline-caption demo-label">Hover, focus, or tap to try.</span>
</main>`,
    css: String.raw`
.text-action { position: relative; display: inline-flex; align-items: center; gap: 16px; max-width: 100%; min-height: 44px; padding: 10px 0; border: 0; border-radius: 2px; background: transparent; color: var(--ink); font-size: 16px; font-weight: 550; }
.text-action::after { content: ''; position: absolute; right: 0; bottom: 4px; left: 0; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: right center; transition: transform calc(200ms * var(--time-scale)) var(--ease-out); }
.text-action.is-preview::after, .text-action.is-selected::after, .text-action:focus-visible::after { transform: scaleX(1); transform-origin: left center; }
@media (hover: hover) and (pointer: fine) { .text-action:hover::after { transform: scaleX(1); transform-origin: left center; } }
.underline-caption { min-height: 18px; }
`,
    js: timeline + String.raw`
const button = document.querySelector('.text-action');
const caption = document.querySelector('.underline-caption');
function reset() {
  clearTimeline(); button.classList.remove('is-preview', 'is-selected');
  caption.textContent = 'Hover, focus, or tap to try.';
}
button.addEventListener('pointerenter', () => { clearTimeline(); button.classList.remove('is-preview'); });
button.addEventListener('click', () => {
  clearTimeline(); button.classList.toggle('is-selected');
  caption.textContent = button.classList.contains('is-selected') ? 'Tap again to let it leave.' : 'Hover, focus, or tap to try.';
});
Demo.onReplay(() => {
  reset();
  if (Demo.reduced) return;
  after(240, () => button.classList.add('is-preview'));
  after(1700, () => button.classList.remove('is-preview'));
});
`,
  },
];

export default recipes;
