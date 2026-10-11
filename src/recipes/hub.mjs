// Original, portable studies informed by Emil Kowalski's MIT-licensed skills.
// Every color comes from the receiving example's semantic theme tokens.
import { recipeIcon } from '../recipe-icons.mjs';

const shared = String.raw`
.hub-stage { gap: 10px; padding: 16px; }
.hub-stage button { transition: scale calc(120ms * var(--time-scale)) var(--ease-out); }
:root:not([data-keyboard="true"]):not([data-reduced="true"]) .hub-stage button:active:not(:disabled) { scale: .97; }
.hub-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.hub-action { min-height: 44px; padding: 10px 16px; border: 0; border-radius: 10px; background: var(--accent); color: var(--on-accent); font-size: 12px; font-weight: 600; }
.hub-action.secondary { padding: 8.5px 14.5px; border: 1.5px solid var(--ink); background: transparent; color: var(--ink); }
.hub-action:disabled { opacity: .55; cursor: default; }
@media (hover: hover) and (pointer: fine) { .hub-action:not(.secondary):not(:disabled):hover { background: var(--accent-hover); color: var(--on-accent); } .hub-action.secondary:not(:disabled):hover { background: color-mix(in srgb, var(--paper), var(--ink) 6%); } }
`;

export default [
  {
    id: 'skeleton-reveal',
    title: 'Skeleton to content',
    category: 'feedback',
    description: 'A reserved content shape crossfades into the real card without moving the surrounding layout.',
    purpose: 'State indication',
    useWhen: 'A known card or panel shape is waiting for a real data request to complete.',
    avoidWhen: 'Instant content, unknown layouts, or an artificial loading delay. Replace this bounded demonstration with the real request lifecycle.',
    principle: 'Reserve space before data arrives, keep loading finite, and reveal the result without a layout jump.',
    duration: '900 ms simulated load · 200 ms reveal',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Load again or replay',
    tech: 'WAAPI',
    color: 'green',
    tags: ['skeleton', 'loading', 'content', 'crossfade', 'data', 'card', 'solid'],
    intent: 'everyday',
    collections: ['product-ui', 'dashboards'],
    complexity: 'starter',
    added: '2026-10-10',
    reducedMotion: 'The complete content appears immediately; pulsing and the crossfade are removed.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage hub-stage skeleton-stage">
  <section class="skeleton-card" aria-label="Demo project card" aria-busy="false">
    <div class="loaded-card">
      <div class="loaded-title"><span class="loaded-mark" aria-hidden="true">${recipeIcon('check', 18)}</span><div><h2>Launch checklist</h2><p>Ready for a second look</p></div></div>
      <div class="loaded-row"><span>Hero layout</span><span>Reviewed</span></div>
      <div class="loaded-row"><span>Mobile navigation</span><span>Reviewed</span></div>
    </div>
    <div class="skeleton-layer" aria-hidden="true" hidden><span class="skeleton-dot"></span><span class="skeleton-line skeleton-name"></span><span class="skeleton-line skeleton-subtitle"></span><span class="skeleton-line skeleton-first"></span><span class="skeleton-line skeleton-last"></span></div>
  </section>
  <div class="skeleton-controls"><span class="skeleton-status demo-label" role="status">Demo content loaded</span><button class="hub-action" type="button">Load again</button></div>
</main>`,
    css: shared + String.raw`
.skeleton-stage { gap: 14px; }
.skeleton-card { position: relative; width: min(100%, 290px); padding: 14px; overflow: hidden; border-radius: 14px; background: var(--paper); }
.loaded-title { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.loaded-title h2 { font-size: 13px; font-weight: 650; line-height: 1.3; }
.loaded-title p { margin-top: 2px; font-size: 10px; color: var(--muted); }
.loaded-mark { display: grid; place-items: center; width: 32px; height: 32px; flex: none; border-radius: 9px; background: var(--accent-soft); color: var(--accent-ink); }
.loaded-row { display: flex; justify-content: space-between; gap: 12px; padding-top: 7px; font-size: 10px; }
.loaded-row span:last-child { color: var(--muted); }
.skeleton-layer { position: absolute; inset: 0; background: var(--paper); }
.skeleton-layer span { position: absolute; display: block; background: var(--line); }
.skeleton-dot { top: 14px; left: 14px; width: 32px; height: 32px; border-radius: 9px; }
.skeleton-line { height: 8px; border-radius: 4px; }
.skeleton-name { top: 18px; left: 56px; width: 48%; }
.skeleton-subtitle { top: 33px; left: 56px; width: 36%; }
.skeleton-first { top: 66px; left: 14px; right: 14px; }
.skeleton-last { top: 87px; left: 14px; right: 40px; }
.skeleton-controls { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: min(100%, 290px); }
.skeleton-status { max-width: 130px; text-align: left; font-size: 10px; }
@media (min-height: 300px) { .skeleton-card { padding: 18px; } .loaded-title { margin-bottom: 16px; } .loaded-title h2 { font-size: 15px; } .loaded-title p, .loaded-row { font-size: 12px; } .loaded-row { padding-top: 10px; } .skeleton-dot { top: 18px; left: 18px; } .skeleton-name { top: 22px; left: 60px; } .skeleton-subtitle { top: 40px; left: 60px; } .skeleton-first { top: 88px; left: 18px; right: 18px; } .skeleton-last { top: 115px; left: 18px; right: 44px; } }
`,
    js: String.raw`
const card = document.querySelector('.skeleton-card');
const content = document.querySelector('.loaded-card');
const skeleton = document.querySelector('.skeleton-layer');
const status = document.querySelector('.skeleton-status');
let animations = [];
let generation = 0;
function stop() { generation += 1; animations.forEach(animation => animation.cancel()); animations = []; }
function settle() {
  stop();
  skeleton.hidden = true;
  skeleton.style.opacity = '1';
  content.style.opacity = '1';
  content.removeAttribute('aria-hidden');
  card.setAttribute('aria-busy', 'false');
  status.textContent = 'Demo content loaded';
}
function load() {
  settle();
  if (Demo.duration(1) === 0 || Demo.paused) return;
  const run = generation;
  skeleton.hidden = false;
  content.style.opacity = '0';
  content.setAttribute('aria-hidden', 'true');
  card.setAttribute('aria-busy', 'true');
  status.textContent = 'Loading demo content…';
  // This finite animation stands in for a request; real content must follow its promise.
  const waiting = Demo.animate(skeleton, [{ opacity: .65 }, { opacity: 1 }, { opacity: .65 }], { duration: 900, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
  animations.push(waiting);
  waiting.finished.then(() => {
    if (run !== generation) return;
    content.removeAttribute('aria-hidden');
    card.setAttribute('aria-busy', 'false');
    status.textContent = 'Demo content loaded';
    content.style.opacity = '1';
    const reveal = Demo.animate(content, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    const dismiss = Demo.animate(skeleton, [{ opacity: .65 }, { opacity: 0 }], { duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    animations.push(reveal, dismiss);
    dismiss.finished.then(() => { if (run === generation) settle(); }).catch(() => {});
  }).catch(() => {});
}
document.querySelector('.hub-action').addEventListener('click', load);
Demo.onReplay(load);
Demo.onSettings(() => { if (Demo.reduced) settle(); });
Demo.onCleanup(stop);
`,
  },
  {
    id: 'stepper-progress',
    title: 'Connected steps',
    category: 'navigation',
    description: 'A short progress line connects three real steps while the current step keeps a clear label.',
    purpose: 'Spatial consistency',
    useWhen: 'Short setup flows, checkout stages, or publishing steps whose order and current position matter.',
    avoidWhen: 'A single action, a branching journey with no stable sequence, or a process where a completed marker could falsely imply saved data.',
    principle: 'Show the relationship between steps, keep the current position explicit, and make every destination available by keyboard.',
    duration: '240 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Select a step, Back, Next, or replay',
    tech: 'CSS',
    color: 'blue',
    tags: ['stepper', 'progress', 'onboarding', 'checkout', 'wizard', 'navigation', 'solid', 'outline'],
    intent: 'everyday',
    collections: ['product-ui'],
    complexity: 'starter',
    added: '2026-10-10',
    reducedMotion: 'The line, current step, and panel update immediately with the same labels.',
    source: 'animate/SKILL.md',
    html: `<main class="stage hub-stage">
  <section class="stepper" aria-label="Demo publishing steps">
    <div class="stepper-track" aria-hidden="true"><span></span></div>
    <ol class="stepper-list">
      <li><button type="button" data-step="0" aria-current="step"><span class="step-dot">1</span><span>Details</span></button></li>
      <li><button type="button" data-step="1"><span class="step-dot">2</span><span>Review</span></button></li>
      <li><button type="button" data-step="2"><span class="step-dot">3</span><span>Publish</span></button></li>
    </ol>
    <div class="stepper-copy" aria-live="polite" aria-atomic="true"><h2>Give it a name.</h2><p>Step 1 of 3 · Details</p></div>
    <div class="stepper-actions"><button class="stepper-back" type="button" disabled>Back</button><button class="stepper-next" type="button">Next step ${recipeIcon('arrow', 15)}</button></div>
  </section>
</main>`,
    css: shared + String.raw`
.stepper { position: relative; width: min(100%, 310px); padding: 12px 14px; border-radius: 14px; background: var(--paper); }
.stepper-list { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 0; padding: 0; list-style: none; }
.stepper-list button { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; width: 100%; min-height: 54px; padding: 0; border: 0; background: transparent; color: var(--muted); font-size: 10px; }
.step-dot { display: grid; place-items: center; width: 26px; height: 26px; border: 1.5px solid var(--muted); border-radius: 50%; background: var(--paper); color: var(--ink); font-size: 11px; font-variant-numeric: tabular-nums; transition: background-color calc(180ms * var(--time-scale)) var(--ease-out), color calc(180ms * var(--time-scale)) var(--ease-out); }
.stepper-list button[data-reached="true"] .step-dot, .stepper-list button[aria-current="step"] .step-dot { border-color: var(--accent-ink); background: var(--accent); color: var(--on-accent); }
.stepper-list button[aria-current="step"] { color: var(--ink); font-weight: 650; }
.stepper-track { position: absolute; left: calc(16.666% + 9px); right: calc(16.666% + 9px); top: 27px; height: 2px; background: var(--line); }
.stepper-track span { display: block; width: 100%; height: 100%; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform calc(240ms * var(--time-scale)) var(--ease-out); }
.stepper-copy { padding: 13px 0 8px; text-align: center; }
.stepper-copy h2 { font-size: 15px; font-weight: 600; }
.stepper-copy p { margin-top: 2px; color: var(--muted); font-size: 10px; }
.stepper-actions { display: flex; justify-content: space-between; gap: 12px; }
.stepper-actions button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 6.5px 10.5px; border: 1.5px solid transparent; border-radius: 9px; background: var(--accent); color: var(--on-accent); font-size: 11px; font-weight: 600; }
.stepper-actions .stepper-back { border-color: var(--ink); background: transparent; color: var(--ink); }
.stepper-actions button:disabled { opacity: .55; cursor: default; }
@media (hover: hover) and (pointer: fine) { .stepper-list button:hover .step-dot { outline: 1.5px solid var(--accent-ink); outline-offset: 1px; } .stepper-next:not(:disabled):hover { background: var(--accent-hover); } .stepper-back:not(:disabled):hover { background: color-mix(in srgb, var(--paper), var(--ink) 6%); } }
@media (min-height: 300px) { .stepper { padding: 20px; } .stepper-track { top: 35px; } .stepper-copy { padding: 24px 0 18px; } .stepper-copy h2 { font-size: 20px; } .stepper-copy p, .stepper-list button { font-size: 12px; } }
`,
    js: String.raw`
const steps = [...document.querySelectorAll('[data-step]')];
const progress = document.querySelector('.stepper-track span');
const heading = document.querySelector('.stepper-copy h2');
const label = document.querySelector('.stepper-copy p');
const back = document.querySelector('.stepper-back');
const next = document.querySelector('.stepper-next');
const titles = ['Give it a name.', 'Check the details.', 'Ready to publish.'];
const names = ['Details', 'Review', 'Publish'];
let current = 0;
function select(index) {
  current = Math.max(0, Math.min(2, index));
  steps.forEach((button, position) => {
    button.dataset.reached = String(position <= current);
    if (position === current) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  progress.style.transform = 'scaleX(' + current / 2 + ')';
  heading.textContent = titles[current];
  label.textContent = 'Step ' + (current + 1) + ' of 3 · ' + names[current];
  back.disabled = current === 0;
  next.firstChild.textContent = current === 2 ? 'Start again ' : 'Next step ';
}
steps.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.step))));
back.addEventListener('click', () => select(current - 1));
next.addEventListener('click', () => select(current === 2 ? 0 : current + 1));
Demo.onReplay(() => {
  progress.style.transition = 'none';
  select(0);
  void progress.offsetWidth;
  progress.style.removeProperty('transition');
  select(1);
});
`,
  },
  {
    id: 'sidebar-collapse',
    title: 'A roomier workspace',
    category: 'layout',
    description: 'An app rail changes from labels to icons while its workspace keeps a continuous position.',
    purpose: 'Spatial consistency',
    useWhen: 'A persistent desktop app rail needs to make room for a canvas, dashboard, or document.',
    avoidWhen: 'Icons are unfamiliar, essential destinations have no accessible names, or a mobile drawer needs modal focus behavior.',
    principle: 'Change real layout first, then animate the measured difference. Keep navigation names available in both sizes.',
    duration: '260 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Collapse or expand navigation',
    tech: 'WAAPI',
    color: 'graphite',
    tags: ['sidebar', 'rail', 'collapse', 'layout', 'FLIP', 'dashboard', 'workspace', 'solid', 'ghost'],
    intent: 'everyday',
    collections: ['product-ui', 'dashboards'],
    complexity: 'intermediate',
    added: '2026-10-10',
    reducedMotion: 'Navigation width and workspace layout change immediately; labels remain available to assistive technology.',
    source: 'animate/SKILL.md',
    html: `<main class="stage hub-stage rail-stage">
  <section class="rail-shell" data-compact="false" aria-label="Demo workspace">
    <nav class="rail-nav" id="demo-navigation" aria-label="Demo app navigation"><span class="rail-surface" aria-hidden="true"></span>
      <button class="rail-toggle" type="button" aria-label="Collapse navigation" aria-expanded="true" aria-controls="demo-navigation"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16m6-11-3 3 3 3"/></svg><span class="rail-word">Collapse</span></button>
      <button type="button" class="rail-destination" data-view="Overview" aria-label="Overview" aria-current="page">${recipeIcon('half-circle', 18)}<span class="rail-word">Overview</span></button>
      <button type="button" class="rail-destination" data-view="Activity" aria-label="Activity">${recipeIcon('spark', 18)}<span class="rail-word">Activity</span></button>
    </nav>
    <div class="rail-view"><h2>Overview</h2><p class="rail-view-copy">A little more room<br>for your work.</p><div class="rail-chart" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><span class="rail-view-note">Demo workspace</span></div>
  </section>
  <p class="rail-status demo-label" role="status">Expanded navigation</p>
</main>`,
    css: shared + String.raw`
.rail-stage { gap: 8px; }
.rail-shell { display: grid; grid-template-columns: 108px minmax(0, 1fr); width: min(100%, 340px); height: 170px; overflow: hidden; border-radius: 14px; background: var(--paper); }
.rail-shell[data-compact="true"] { grid-template-columns: 52px minmax(0, 1fr); }
.rail-nav { position: relative; display: flex; flex-direction: column; align-items: stretch; gap: 3px; padding: 7px 6px; min-width: 0; }
.rail-surface { position: absolute; inset: 0; border-radius: 14px 0 0 14px; background: color-mix(in srgb, var(--paper), var(--ink) 6%); transform-origin: left; }
.rail-nav button { position: relative; display: flex; align-items: center; gap: 8px; width: 100%; min-height: 44px; padding: 10px 8px; border: 0; border-radius: 8px; background: transparent; color: var(--muted); text-align: left; font-size: 10px; white-space: nowrap; }
.rail-nav button svg { flex: none; }
.rail-nav button:focus-visible { outline-offset: -3px; }
.rail-nav button[aria-current="page"] { background: var(--ink); color: var(--on-ink); }
.rail-nav button[aria-current="page"]:focus-visible { outline-color: var(--on-ink); }
.rail-nav .rail-toggle { color: var(--ink); }
.rail-shell[data-compact="true"] .rail-word { display: none; }
.rail-view { min-width: 0; padding: 17px 13px 12px; }
.rail-view h2 { font-size: 13px; font-weight: 650; }
.rail-view-copy { margin-top: 6px; font-size: 10px; color: var(--muted); }
.rail-chart { display: flex; align-items: end; gap: 5px; height: 37px; margin-top: 9px; }
.rail-chart i { width: 12px; height: 45%; border-radius: 3px 3px 0 0; background: var(--art-1); }
.rail-chart i:nth-child(2) { height: 70%; background: var(--art-2); } .rail-chart i:nth-child(3) { height: 60%; } .rail-chart i:nth-child(4) { height: 100%; background: var(--art-3); } .rail-chart i:nth-child(5) { height: 82%; }
.rail-view-note { display: block; margin-top: 7px; color: var(--muted); font-size: 9px; }
.rail-status { font-size: 10px; }
@media (hover: hover) and (pointer: fine) { .rail-nav button:not([aria-current="page"]):hover { background: var(--paper); color: var(--ink); } }
@media (min-height: 300px) { .rail-shell { grid-template-columns: 120px minmax(0, 1fr); height: 218px; } .rail-nav { padding-top: 12px; gap: 5px; } .rail-nav button { font-size: 11px; } .rail-view { padding: 21px 18px; } .rail-view h2 { font-size: 16px; } .rail-view-copy { font-size: 12px; } .rail-chart { height: 55px; margin-top: 15px; } .rail-view-note { font-size: 10px; } }
`,
    js: String.raw`
const shell = document.querySelector('.rail-shell');
const nav = document.querySelector('.rail-nav');
const surface = document.querySelector('.rail-surface');
const view = document.querySelector('.rail-view');
const toggle = document.querySelector('.rail-toggle');
const status = document.querySelector('.rail-status');
let animations = [];
function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
function compact(next, animate = true) {
  const first = view.getBoundingClientRect();
  const oldWidth = surface.getBoundingClientRect().width;
  stop();
  shell.dataset.compact = String(next);
  toggle.setAttribute('aria-expanded', String(!next));
  toggle.setAttribute('aria-label', next ? 'Expand navigation' : 'Collapse navigation');
  toggle.querySelector('.rail-word').textContent = next ? 'Expand' : 'Collapse';
  status.textContent = next ? 'Compact navigation · more room' : 'Expanded navigation';
  if (!animate || Demo.duration(1) === 0 || Demo.paused) return;
  const last = view.getBoundingClientRect();
  animations = [
    Demo.animate(view, [{ transform: 'translateX(' + (first.left - last.left) + 'px)' }, { transform: 'translateX(0)' }], { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }),
    Demo.animate(surface, [{ transform: 'scaleX(' + oldWidth / nav.getBoundingClientRect().width + ')' }, { transform: 'scaleX(1)' }], { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }),
  ];
}
toggle.addEventListener('click', () => compact(shell.dataset.compact !== 'true'));
document.querySelectorAll('.rail-destination').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.rail-destination').forEach(item => item.removeAttribute('aria-current'));
  button.setAttribute('aria-current', 'page');
  view.querySelector('h2').textContent = button.dataset.view;
  view.querySelector('.rail-view-copy').textContent = button.dataset.view === 'Activity' ? 'Your recent work, in one place.' : 'A little more room for your work.';
  status.textContent = button.dataset.view + ' selected';
}));
Demo.onReplay(() => { compact(false, false); compact(true); });
Demo.onSettings(() => { if (Demo.reduced) stop(); });
window.addEventListener('resize', stop);
Demo.onCleanup(() => { stop(); window.removeEventListener('resize', stop); });
`,
  },
  {
    id: 'chart-bars',
    title: 'A measured chart reveal',
    category: 'entrances',
    description: 'Five bars rise from the same baseline in one short sequence while their values remain readable.',
    purpose: 'Hierarchy',
    useWhen: 'The first appearance of a small, static dashboard chart benefits from a brief visual introduction.',
    avoidWhen: 'Live data, rapidly changing filters, or comparisons where motion would delay reading. Never change the encoded values for the effect.',
    principle: 'Keep data labels visible, animate only the graphical marks, and cap the whole chart entrance.',
    duration: '560 ms total · 40 ms stagger',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Replay chart reveal',
    tech: 'WAAPI',
    color: 'blue',
    tags: ['chart', 'bar', 'data', 'dashboard', 'stagger', 'entrance', 'soft'],
    intent: 'everyday',
    collections: ['dashboards', 'storytelling'],
    complexity: 'starter',
    added: '2026-10-10',
    reducedMotion: 'All bars appear at their full data values immediately; the readable labels remain unchanged.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage hub-stage">
  <figure class="bars-card">
    <div class="bars-heading"><div><h2>Page views</h2><p>Illustrative weekly data</p></div><button type="button" aria-label="Replay chart reveal">${recipeIcon('replay', 17)}</button></div>
    <ul class="bars-plot" aria-label="Page views by day">
      <li><span class="hub-sr">Monday: </span><span class="bar-value">42</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="height:42%"></span></span><span aria-hidden="true">Mon</span></li>
      <li><span class="hub-sr">Tuesday: </span><span class="bar-value">68</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="height:68%"></span></span><span aria-hidden="true">Tue</span></li>
      <li><span class="hub-sr">Wednesday: </span><span class="bar-value">55</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="height:55%"></span></span><span aria-hidden="true">Wed</span></li>
      <li><span class="hub-sr">Thursday: </span><span class="bar-value">91</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="height:91%"></span></span><span aria-hidden="true">Thu</span></li>
      <li><span class="hub-sr">Friday: </span><span class="bar-value">76</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="height:76%"></span></span><span aria-hidden="true">Fri</span></li>
    </ul>
    <figcaption>One entrance. The data stays put.</figcaption>
  </figure>
</main>`,
    css: shared + String.raw`
.bars-card { width: min(100%, 310px); margin: 0; padding: 12px 16px; border-radius: 14px; background: var(--paper); }
.bars-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 5px; }
.bars-heading h2 { font-size: 14px; font-weight: 650; }
.bars-heading p { color: var(--muted); font-size: 10px; margin-top: 2px; }
/* A localized soft utility control keeps attention on the chart's data. */
.bars-heading button { display: grid; place-items: center; flex: none; width: 44px; height: 44px; border: 0; border-radius: 10px; color: var(--accent-ink); background: var(--accent-soft); }
.bars-plot { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; }
.bars-plot li { display: grid; grid-template-rows: 14px 66px 14px; gap: 3px; min-width: 0; text-align: center; color: var(--muted); font-size: 9px; font-variant-numeric: tabular-nums; }
.bar-value { color: var(--ink); font-size: 10px; font-weight: 600; }
.bar-track { display: flex; align-items: end; justify-content: center; height: 100%; }
.bar-fill { display: block; width: min(100%, 29px); border-radius: 5px 5px 0 0; background: var(--art-1); transform-origin: center bottom; }
.bars-plot li:nth-child(2) .bar-fill, .bars-plot li:nth-child(5) .bar-fill { background: var(--art-2); }
.bars-plot li:nth-child(4) .bar-fill { background: var(--art-3); }
.bars-card figcaption { margin-top: 9px; font-size: 9px; color: var(--muted); }
@media (min-height: 300px) { .bars-card { padding: 18px 22px; } .bars-plot li { grid-template-rows: 18px 126px 18px; font-size: 11px; } .bar-value { font-size: 12px; } .bars-card figcaption { font-size: 10px; margin-top: 12px; } .bars-heading { margin-bottom: 14px; } .bars-heading h2 { font-size: 16px; } }
`,
    js: String.raw`
const bars = [...document.querySelectorAll('.bar-fill')];
let animations = [];
function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
function reveal() {
  stop();
  bars.forEach(bar => bar.style.removeProperty('transform'));
  if (Demo.duration(1) === 0 || Demo.paused) return;
  animations = bars.map((bar, index) => Demo.animate(bar, [{ transform: 'scaleY(.08)' }, { transform: 'scaleY(1)' }], { duration: 400, delay: index * 40, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }));
}
document.querySelector('.bars-heading button').addEventListener('click', reveal);
Demo.onReplay(reveal);
Demo.onSettings(() => { if (Demo.reduced) stop(); });
Demo.onCleanup(stop);
`,
  },
  {
    id: 'filter-grid',
    title: 'Keep your place',
    category: 'layout',
    description: 'A filtered collection closes its gaps while the remaining items keep their visual identity.',
    purpose: 'Spatial consistency',
    useWhen: 'A short collection has useful filters and a small layout shift helps people track the remaining items.',
    avoidWhen: 'Large result sets, rapid live updates, or any filtering that hides the currently focused item without a focus plan.',
    principle: 'Use the real filtered layout, animate the remaining items from measured positions, and announce the result count.',
    duration: '240 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Choose All, UI, or Brand',
    tech: 'WAAPI',
    color: 'lavender',
    tags: ['filter', 'grid', 'FLIP', 'collection', 'search', 'layout', 'solid', 'ghost'],
    intent: 'everyday',
    collections: ['product-ui', 'landing-pages'],
    complexity: 'intermediate',
    added: '2026-10-10',
    reducedMotion: 'Filtering changes the real list immediately. The selected filter and result count remain visible.',
    source: 'animate/SKILL.md',
    html: `<main class="stage hub-stage filter-stage">
  <div class="filter-controls" role="group" aria-label="Filter demo assets"><button type="button" data-filter="all" aria-pressed="true">All</button><button type="button" data-filter="ui" aria-pressed="false">UI</button><button type="button" data-filter="brand" aria-pressed="false">Brand</button></div>
  <ul class="filter-grid" aria-label="Demo assets">
    <li class="filter-item" data-kind="brand"><span aria-hidden="true">${recipeIcon('diamond', 21)}</span><span>Mark</span></li>
    <li class="filter-item" data-kind="ui"><span aria-hidden="true">${recipeIcon('plus', 21)}</span><span>Button</span></li>
    <li class="filter-item" data-kind="brand"><span aria-hidden="true">${recipeIcon('spark', 21)}</span><span>Pattern</span></li>
    <li class="filter-item" data-kind="ui"><span aria-hidden="true">${recipeIcon('half-circle', 21)}</span><span>Card</span></li>
    <li class="filter-item" data-kind="brand"><span aria-hidden="true">${recipeIcon('replay', 21)}</span><span>Loop</span></li>
    <li class="filter-item" data-kind="ui"><span aria-hidden="true">${recipeIcon('check', 21)}</span><span>Badge</span></li>
  </ul>
  <p class="filter-count demo-label" role="status">6 assets · All</p>
</main>`,
    css: shared + String.raw`
.filter-stage { gap: 8px; }
.filter-controls { display: flex; gap: 5px; width: min(100%, 294px); }
.filter-controls button { flex: 1; min-height: 44px; padding: 9px 12px; border: 0; border-radius: 9px; background: transparent; color: var(--muted); font-size: 11px; font-weight: 600; }
.filter-controls button[aria-pressed="true"] { color: var(--on-ink); background: var(--ink); }
.filter-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 52px; align-content: start; gap: 7px; width: min(100%, 294px); min-height: 111px; margin: 0; padding: 0; list-style: none; }
.filter-item { display: flex; align-items: center; justify-content: center; gap: 6px; min-width: 0; padding: 6px; border-radius: 10px; background: var(--paper); color: var(--ink); font-size: 10px; }
.filter-item > span:first-child { display: flex; flex: none; color: var(--accent-ink); }
.filter-item[data-kind="brand"] { background: var(--accent-soft); }
.filter-count { font-size: 10px; }
@media (hover: hover) and (pointer: fine) { .filter-controls button:not([aria-pressed="true"]):hover { background: var(--paper); color: var(--ink); } }
@media (min-height: 300px) { .filter-grid { grid-auto-rows: 82px; min-height: 171px; gap: 9px; } .filter-item { flex-direction: column; gap: 8px; font-size: 12px; } .filter-controls button, .filter-count { font-size: 12px; } }
`,
    js: String.raw`
const items = [...document.querySelectorAll('.filter-item')];
const buttons = [...document.querySelectorAll('[data-filter]')];
const count = document.querySelector('.filter-count');
let animations = [];
function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
function filter(kind, animate = true) {
  const first = new Map(items.filter(item => !item.hidden).map(item => [item, item.getBoundingClientRect()]));
  stop();
  items.forEach(item => { item.hidden = kind !== 'all' && item.dataset.kind !== kind; });
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === kind)));
  const visible = items.filter(item => !item.hidden);
  const label = kind === 'all' ? 'All' : kind === 'ui' ? 'UI' : 'Brand';
  count.textContent = visible.length + ' assets · ' + label;
  if (!animate || Demo.duration(1) === 0 || Demo.paused) return;
  animations = visible.map(item => {
    const before = first.get(item);
    const after = item.getBoundingClientRect();
    const frames = before
      ? [{ transform: 'translate(' + (before.left - after.left) + 'px,' + (before.top - after.top) + 'px)' }, { transform: 'translate(0,0)' }]
      : [{ opacity: 0 }, { opacity: 1 }];
    return Demo.animate(item, frames, { duration: 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  });
}
buttons.forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
Demo.onReplay(() => { filter('all', false); filter('ui'); });
Demo.onSettings(() => { if (Demo.reduced) stop(); });
window.addEventListener('resize', stop);
Demo.onCleanup(() => { stop(); window.removeEventListener('resize', stop); });
`,
  },
  {
    id: 'scroll-progress',
    title: 'Follow the reading',
    category: 'navigation',
    description: 'A small progress line follows the actual scroll position of a readable, keyboard-accessible pane.',
    purpose: 'Orientation',
    useWhen: 'Long articles, product stories, or documentation benefit from a quiet indication of reading position.',
    avoidWhen: 'Short pages, nested scroll areas in a real reading layout, or a percentage that could be mistaken for comprehension or completion.',
    principle: 'Connect motion to the person’s scroll, keep native scrolling intact, and make the visual indicator supplementary.',
    duration: 'Directly follows scroll · 80 ms settling',
    easing: 'linear',
    trigger: 'Scroll the reading pane with touch, wheel, or keyboard',
    tech: 'CSS',
    color: 'sand',
    tags: ['scroll', 'progress', 'reading', 'article', 'storytelling', 'navigation'],
    intent: 'everyday',
    collections: ['landing-pages', 'storytelling'],
    complexity: 'starter',
    added: '2026-10-10',
    reducedMotion: 'The reading percentage and progress line update without a trailing transition. Native scrolling stays available.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage hub-stage reading-stage">
  <section class="reading-shell" aria-label="Reading progress demonstration">
    <div class="reading-toolbar"><span>Field notes</span><span class="reading-percent" aria-hidden="true">0%</span></div>
    <div class="reading-progress" role="progressbar" aria-label="Reading position" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>
    <article class="reading-pane" tabindex="0" aria-label="Demo article: Make space for motion"><h2>Make space<br>for motion.</h2><p>The useful details are often quiet. A change in position can explain what just happened without asking for more attention.</p><h3>Start with a reason</h3><p>Show where something came from, what changed, or where it went. If the interface is already clear, let it stay still.</p><h3>Keep the reader in charge</h3><p>Scrolling belongs to the reader. This line follows the position of the article; it never takes over the page.</p><h3>Leave a clear ending</h3><p>The final state should make sense with or without the journey. A calm result is part of the animation.</p></article>
  </section>
  <p class="demo-label reading-help">Scroll inside · or focus and use arrow keys</p>
</main>`,
    css: shared + String.raw`
.reading-stage { gap: 8px; }
.reading-shell { width: min(100%, 320px); overflow: hidden; border-radius: 14px; background: var(--paper); }
.reading-toolbar { display: flex; justify-content: space-between; gap: 12px; padding: 9px 14px; color: var(--muted); font-size: 10px; }
.reading-percent { font-variant-numeric: tabular-nums; }
.reading-progress { height: 3px; background: var(--line); }
.reading-progress span { display: block; width: 100%; height: 100%; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform calc(80ms * var(--time-scale)) linear; }
.reading-pane { height: 135px; overflow: auto; padding: 12px 16px; scrollbar-width: thin; scrollbar-color: var(--muted) var(--paper); }
.reading-pane:focus-visible { outline-offset: -4px; }
.reading-pane h2 { margin-bottom: 12px; font-size: 23px; font-weight: 600; line-height: 1.08; letter-spacing: -.03em; }
.reading-pane h3 { margin: 20px 0 7px; font-size: 13px; font-weight: 650; }
.reading-pane p { font-size: 11px; line-height: 1.65; color: var(--muted); }
.reading-pane p:last-child { padding-bottom: 10px; }
.reading-help { font-size: 9px; }
@media (min-height: 300px) { .reading-pane { height: 244px; padding: 20px 24px; } .reading-pane h2 { font-size: 30px; } .reading-pane p { font-size: 13px; } .reading-pane h3 { font-size: 15px; } .reading-toolbar, .reading-help { font-size: 11px; } }
`,
    js: String.raw`
const pane = document.querySelector('.reading-pane');
const bar = document.querySelector('.reading-progress');
const fill = bar.querySelector('span');
const percent = document.querySelector('.reading-percent');
function update() {
  const range = pane.scrollHeight - pane.clientHeight;
  const value = range > 0 ? Math.max(0, Math.min(1, pane.scrollTop / range)) : 1;
  const rounded = Math.round(value * 100);
  fill.style.transform = 'scaleX(' + value + ')';
  bar.setAttribute('aria-valuenow', String(rounded));
  percent.textContent = rounded + '%';
}
pane.addEventListener('scroll', update, { passive: true });
const resize = new ResizeObserver(update);
resize.observe(pane);
Demo.onReplay(() => { pane.scrollTop = 0; update(); });
Demo.onSettings(update);
Demo.onCleanup(() => { resize.disconnect(); pane.removeEventListener('scroll', update); });
update();
`,
  },
  {
    id: 'spotlight-card',
    title: 'A little light',
    category: 'expressive',
    description: 'A contained spotlight follows a fine pointer, with an equally clear centered light for focus and touch.',
    purpose: 'Delight',
    useWhen: 'An occasional portfolio tile or feature card benefits from a restrained, theme-aware light treatment.',
    avoidWhen: 'Dense interfaces, essential feedback, moving light behind long passages, or touch interactions that would capture scrolling.',
    principle: 'Give a decorative pointer effect an equivalent static focus and touch state. Confine its paint cost to one small surface.',
    duration: '120 ms pointer settling · 900 ms replay',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Hover with a fine pointer, focus, or tap to keep the light',
    tech: 'WAAPI',
    color: 'graphite',
    tags: ['spotlight', 'pointer', 'focus', 'card', 'hover', 'portfolio', 'light'],
    intent: 'expressive',
    collections: ['landing-pages', 'signature'],
    complexity: 'intermediate',
    added: '2026-10-10',
    reducedMotion: 'Pointer tracking and replay travel stop. A centered static light still responds to focus and the toggle.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage hub-stage spotlight-stage">
  <button class="spotlight-card" type="button" aria-label="Keep spotlight on" aria-pressed="false">
    <span class="spotlight-beam" aria-hidden="true"></span>
    <span class="spotlight-symbol" aria-hidden="true">${recipeIcon('spark', 42)}</span>
    <span class="spotlight-title">Make room<br>for ideas.</span>
    <span class="spotlight-caption">Tap to keep the light</span>
  </button>
  <p class="spotlight-status demo-label" role="status">A small spotlight. Your colors.</p>
</main>`,
    css: shared + String.raw`
.spotlight-stage { gap: 9px; }
.spotlight-card { position: relative; isolation: isolate; width: min(100%, 292px); height: 166px; overflow: hidden; padding: 17px 20px; border: 0; border-radius: 14px; background: var(--paper); color: var(--ink); text-align: left; }
.spotlight-beam { position: absolute; z-index: -1; left: calc(50% - 105px); top: calc(50% - 105px); width: 210px; height: 210px; border-radius: 50%; background: radial-gradient(circle, var(--accent-soft) 0%, var(--accent-soft) 12%, transparent 68%); opacity: 0; transition: opacity calc(160ms * var(--time-scale)) var(--ease-out), transform calc(120ms * var(--time-scale)) var(--ease-out); pointer-events: none; }
.spotlight-card[data-lit="true"] .spotlight-beam, .spotlight-card:focus-visible .spotlight-beam { opacity: 1; }
.spotlight-symbol { position: absolute; display: block; top: 22px; right: 23px; color: var(--art-2); }
.spotlight-title { position: absolute; display: block; left: 20px; bottom: 42px; font-size: 25px; font-weight: 580; line-height: 1.06; letter-spacing: -.035em; }
.spotlight-caption { position: absolute; left: 20px; bottom: 17px; color: var(--muted); font-size: 10px; }
.spotlight-status { font-size: 10px; }
:root[data-reduced="true"] .spotlight-beam { transform: none !important; }
@media (min-height: 300px) { .spotlight-card { height: 242px; } .spotlight-title { bottom: 57px; font-size: 34px; } .spotlight-caption { bottom: 23px; font-size: 11px; } .spotlight-symbol { top: 26px; right: 27px; } .spotlight-beam { width: 280px; height: 280px; left: calc(50% - 140px); top: calc(50% - 140px); } }
`,
    js: String.raw`
const card = document.querySelector('.spotlight-card');
const beam = document.querySelector('.spotlight-beam');
const status = document.querySelector('.spotlight-status');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let animation = null;
let pinned = false;
let hovering = false;
function stop() { animation?.cancel(); animation = null; beam.style.removeProperty('opacity'); }
function light() { card.dataset.lit = String(pinned || hovering || card.matches(':focus-visible')); }
function center() { beam.style.transform = 'translate(0,0)'; }
function track(event) {
  if (!finePointer.matches || event.pointerType === 'touch' || Demo.reduced || Demo.paused) return;
  stop();
  const bounds = card.getBoundingClientRect();
  const x = Math.max(-bounds.width / 2, Math.min(bounds.width / 2, event.clientX - bounds.left - bounds.width / 2));
  const y = Math.max(-bounds.height / 2, Math.min(bounds.height / 2, event.clientY - bounds.top - bounds.height / 2));
  beam.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  hovering = true;
  light();
}
card.addEventListener('pointermove', track);
card.addEventListener('pointerleave', () => { hovering = false; center(); light(); });
card.addEventListener('focus', () => { stop(); center(); light(); });
card.addEventListener('blur', () => { light(); });
card.addEventListener('click', () => {
  stop();
  pinned = !pinned;
  center();
  light();
  card.setAttribute('aria-pressed', String(pinned));
  status.textContent = pinned ? 'Spotlight stays on' : 'Spotlight follows your pointer or focus';
});
Demo.onReplay(() => {
  stop(); center();
  pinned = false; hovering = false;
  card.setAttribute('aria-pressed', 'false');
  light();
  status.textContent = 'A small spotlight. Your colors.';
  if (Demo.reduced) { card.dataset.lit = 'true'; return; }
  animation = Demo.animate(beam, [{ transform: 'translate(-55px,-15px)', opacity: 0 }, { transform: 'translate(30px,12px)', opacity: 1, offset: .6 }, { transform: 'translate(0,0)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
});
function settings() { if (Demo.reduced) { stop(); center(); } light(); }
function pointerCapability() { hovering = false; center(); light(); }
Demo.onSettings(settings);
finePointer.addEventListener('change', pointerCapability);
Demo.onCleanup(() => { stop(); finePointer.removeEventListener('change', pointerCapability); });
`,
  },
  {
    id: 'ripple-field',
    title: 'Send a ripple',
    category: 'expressive',
    description: 'Three concentric waves travel from an intentional tap, then settle into a still graphic composition.',
    purpose: 'Delight',
    useWhen: 'A one-off brand interaction, creative playground, or an optional response on an expressive landing page.',
    avoidWhen: 'Routine button feedback, animation behind reading content, or an effect that would fire continually as someone moves the pointer.',
    principle: 'Make one deliberate action produce one bounded response, and give the final frame its own visual value.',
    duration: '1,000 ms total · 100 ms stagger',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Press the field or replay',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['ripple', 'svg', 'rings', 'tap', 'illustration', 'brand', 'finite'],
    intent: 'expressive',
    collections: ['landing-pages', 'signature'],
    complexity: 'starter',
    added: '2026-10-10',
    reducedMotion: 'A complete set of rings appears at the chosen point immediately, without expansion or fading.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage hub-stage ripple-stage">
  <button class="ripple-field" type="button" aria-label="Send a ripple">
    <svg class="ripple-art" viewBox="0 0 280 162" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g class="ripple-origin" transform="translate(140 81)"><circle class="ripple-ring" r="29"/><circle class="ripple-ring" r="52"/><circle class="ripple-ring" r="75"/><circle class="ripple-center" r="4"/></g></svg>
    <span class="ripple-instruction">Send a ripple</span>
  </button>
  <p class="ripple-status demo-label" role="status">Tap anywhere in the field</p>
</main>`,
    css: shared + String.raw`
.ripple-stage { gap: 9px; }
.ripple-field { position: relative; display: block; width: min(100%, 310px); height: 164px; overflow: hidden; padding: 0; border: 0; border-radius: 14px; background: var(--paper); color: var(--ink); }
.ripple-art { width: 100%; height: 100%; overflow: hidden; }
.ripple-ring { fill: none; stroke: var(--art-1); stroke-width: 2; transform-box: fill-box; transform-origin: center; opacity: .7; }
.ripple-ring:nth-child(2) { stroke: var(--art-2); stroke-width: 3; opacity: .6; }
.ripple-ring:nth-child(3) { stroke: var(--art-3); opacity: .5; }
.ripple-center { fill: var(--accent); }
.ripple-instruction { position: absolute; left: 12px; bottom: 10px; padding: 4px 7px; border-radius: 5px; background: var(--paper); color: var(--muted); font-size: 10px; }
.ripple-status { font-size: 10px; }
@media (min-height: 300px) { .ripple-field { height: 242px; } .ripple-instruction { left: 16px; bottom: 14px; font-size: 11px; } }
`,
    js: String.raw`
const field = document.querySelector('.ripple-field');
const svg = document.querySelector('.ripple-art');
const origin = document.querySelector('.ripple-origin');
const rings = [...document.querySelectorAll('.ripple-ring')];
const status = document.querySelector('.ripple-status');
let animations = [];
let point = null;
let sent = 0;
function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
function send(x = 140, y = 81) {
  stop();
  origin.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
  sent += 1;
  status.textContent = sent === 1 ? 'One ripple, then stillness' : 'Ripple ' + sent + ' · then stillness';
  if (Demo.duration(1) === 0 || Demo.paused) return;
  animations = rings.map((ring, index) => Demo.animate(ring, [{ transform: 'scale(.12)', opacity: .9 }, { transform: 'scale(1)', opacity: .7 - index * .1 }], { duration: 800, delay: index * 100, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }));
}
field.addEventListener('pointerdown', event => {
  if (!event.isPrimary || event.button !== 0) return;
  const matrix = svg.getScreenCTM();
  if (!matrix) return;
  const local = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  // Keep the origin inside the art; do not capture the pointer or block touch scrolling.
  point = { x: Math.max(28, Math.min(252, local.x)), y: Math.max(26, Math.min(136, local.y)) };
});
field.addEventListener('pointercancel', () => { point = null; });
field.addEventListener('click', event => {
  const next = event.detail > 0 ? point : null;
  point = null;
  send(next?.x, next?.y);
});
Demo.onReplay(() => { point = null; sent = 0; send(); });
Demo.onSettings(() => { if (Demo.reduced) stop(); });
Demo.onCleanup(stop);
`,
  },
];
