import { recipeIcon } from '../recipe-icons.mjs';

// These helpers are concatenated into each recipe's standalone stylesheet.
// The build also embeds the documented Demo runtime and shared base styles.
const shared = `
.structure-stage { padding: 20px; gap: 16px; }
.structure-stage * { box-sizing: border-box; }
.structure-stage .demo-button { min-height: 44px; max-width: 100%; font-size: 13px; }
.study-note { margin: 0; color: var(--muted); font-size: 11px; line-height: 1.5; text-align: center; }
.study-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.structure-stage button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; user-select: none; }
.structure-stage button:focus-visible, .structure-stage summary:focus-visible { outline: 3px solid var(--accent-ink); outline-offset: 4px; }
@media (max-height: 260px) { .structure-stage { padding: 14px 20px; gap: 12px; } }
`;

export default [
  {
    id: 'accordion',
    title: 'Measured accordion',
    category: 'layout',
    description: 'A disclosure opens to its measured content height, then returns to natural layout.',
    purpose: 'Preventing a jarring change',
    useWhen: 'Occasional FAQ disclosures, help text, and compact explanatory panels.',
    avoidWhen: 'Fast keyboard navigation or long panels whose height would move a large part of the page.',
    principle: 'Height is a deliberate exception for accordions: measure it, keep it brief, and preserve native disclosure behavior.',
    duration: '200 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Toggle disclosure',
    tech: 'WAAPI',
    color: 'sand',
    tags: ['disclosure', 'details', 'height', 'measured'],
    reducedMotion: 'The native disclosure changes state immediately, with all text available.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage structure-stage accordion-stage">
  <details class="measured-details" open>
    <summary><span>Why does this feel calm?</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 8 5 5 5-5"/></svg></summary>
    <div class="accordion-copy"><p>One surface opens. The content stays connected to the question that revealed it.</p><span class="accordion-meta">Small movement. Clear relationship.</span></div>
  </details>
</main>`,
    css: `${shared}
.measured-details { width: 100%; max-width: 330px; background: var(--paper); border-radius: 16px; overflow: hidden; box-shadow: 0 2px 3px var(--shadow); }
.measured-details summary { display: flex; align-items: center; justify-content: space-between; gap: 14px; min-height: 58px; padding: 17px 19px; cursor: pointer; list-style: none; font-size: 14px; font-weight: 650; line-height: 1.4; touch-action: manipulation; }
.measured-details summary::-webkit-details-marker { display: none; }
.measured-details summary svg { flex: none; width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.6; transition: transform calc(200ms * var(--time-scale)) var(--ease-out); }
.measured-details[data-expanded="true"] summary svg { transform: rotate(180deg); }
.accordion-copy { padding: 0 19px 19px; }
.accordion-copy p { margin: 0 0 12px; color: var(--muted); font-size: 13px; line-height: 1.55; }
.accordion-meta { color: var(--muted); font-size: 10px; line-height: 1.4; }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .measured-details summary svg { transition: none; } }
`,
    js: `const details = document.querySelector('.measured-details');
const summary = details.querySelector('summary');
let expanded = details.open;
let active = null;
let revision = 0;
details.dataset.expanded = String(expanded);

function settle() {
  revision += 1;
  if (active) active.cancel();
  active = null;
  details.open = expanded;
  details.style.height = '';
  details.dataset.expanded = String(expanded);
}

function setExpanded(next) {
  // Capture the current presentation height before cancelling an interrupted run.
  const from = details.getBoundingClientRect().height;
  revision += 1;
  const ticket = revision;
  if (active) active.cancel();
  expanded = next;
  details.open = true;
  details.style.height = '';
  details.dataset.expanded = String(next);
  const to = next ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
  if (Demo.reduced || Demo.duration(200) === 0 || Demo.paused) { settle(); return; }
  active = Demo.animate(details, [{ height: from + 'px' }, { height: to + 'px' }], {
    duration: 200, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both'
  });
  active.finished.then(() => { if (ticket === revision) settle(); }).catch(() => {});
}

summary.addEventListener('click', (event) => {
  event.preventDefault();
  setExpanded(!expanded);
});
Demo.onReplay(() => { expanded = false; settle(); setExpanded(true); });
Demo.onSettings(() => { if (Demo.reduced) settle(); });
Demo.onCleanup(settle);`,
  },
  {
    id: 'layout-flip',
    title: 'FLIP reorder',
    category: 'layout',
    description: 'Four objects keep their identity as their real grid positions change.',
    purpose: 'Spatial consistency',
    useWhen: 'Small sortable collections, priority changes, or arranging a short dashboard.',
    avoidWhen: 'Frequently refreshing data, hundreds of moving cells, or any reorder that makes reading harder.',
    principle: 'Measure the first and last positions, invert with a transform, then animate to the real layout.',
    duration: '250 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Reorder grid',
    tech: 'WAAPI',
    color: 'lavender',
    tags: ['FLIP', 'reorder', 'grid', 'layout', 'solid'],
    reducedMotion: 'DOM order changes immediately; each object keeps its label and color.',
    source: 'animate/SKILL.md',
    html: `<main class="stage structure-stage">
  <ol class="flip-grid" aria-label="Four design notes">
    <li class="flip-tile tile-violet"><span class="tile-symbol" aria-hidden="true">${recipeIcon('spark', 26)}</span><span>Shape</span><small>01</small></li>
    <li class="flip-tile tile-cream"><span class="tile-symbol" aria-hidden="true">${recipeIcon('half-circle', 26)}</span><span>Space</span><small>02</small></li>
    <li class="flip-tile tile-blue"><span class="tile-symbol" aria-hidden="true">${recipeIcon('arrow', 26)}</span><span>Motion</span><small>03</small></li>
    <li class="flip-tile tile-green"><span class="tile-symbol" aria-hidden="true">${recipeIcon('diamond', 26)}</span><span>Detail</span><small>04</small></li>
  </ol>
  <button class="demo-button" type="button">Reorder grid</button>
  <span class="study-sr flip-status" role="status"></span>
</main>`,
    css: `${shared}
.flip-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; width: 100%; max-width: 300px; margin: 0; padding: 0; list-style: none; }
.flip-tile { position: relative; display: flex; align-items: center; gap: 9px; min-height: 61px; padding: 12px; border-radius: 13px; color: var(--ink); font-size: 12px; font-weight: 600; }
.flip-tile small { position: absolute; right: 9px; top: 6px; font-size: 9px; font-weight: 500; color: var(--ink); }
.tile-symbol { display: inline-flex; align-items: center; flex: none; line-height: 1; }
.tile-violet { background: color-mix(in srgb, var(--art-1) 24%, var(--paper)); } .tile-cream { background: color-mix(in srgb, var(--art-2) 24%, var(--paper)); } .tile-blue { background: color-mix(in srgb, var(--art-3) 24%, var(--paper)); } .tile-green { background: color-mix(in srgb, var(--success) 16%, var(--paper)); }
@media (min-height: 320px) { .flip-tile { min-height: 80px; padding: 18px; } }
`,
    js: `const grid = document.querySelector('.flip-grid');
const original = Array.from(grid.children);
const button = document.querySelector('button');
const status = document.querySelector('.flip-status');
let alternate = false;
let animations = [];
function stop() { animations.forEach((animation) => animation.cancel()); animations = []; }
function reorder(next) {
  const first = new Map(original.map((item) => [item, item.getBoundingClientRect()]));
  stop();
  alternate = next;
  const order = next ? [original[2], original[0], original[3], original[1]] : original;
  order.forEach((item) => grid.append(item));
  status.textContent = 'Order: ' + order.map((item) => item.querySelectorAll('span')[1].textContent).join(', ');
  if (Demo.reduced || Demo.duration(250) === 0 || Demo.paused) return;
  animations = order.map((item) => {
    const before = first.get(item);
    const after = item.getBoundingClientRect();
    const animation = Demo.animate(item, [
      { transform: 'translate(' + (before.left - after.left) + 'px,' + (before.top - after.top) + 'px)' },
      { transform: 'translate(0,0)' }
    ], { duration: 250, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
    animation.finished.catch(() => {});
    return animation;
  });
}
button.addEventListener('click', () => reorder(!alternate));
Demo.onReplay(() => { stop(); original.forEach((item) => grid.append(item)); alternate = false; reorder(true); });
Demo.onSettings(() => { if (Demo.reduced) stop(); });
window.addEventListener('resize', stop);
Demo.onCleanup(() => { stop(); window.removeEventListener('resize', stop); });`,
  },
  {
    id: 'shared-element',
    title: 'Shared element',
    category: 'layout',
    description: 'A single artwork travels from its collection thumbnail into a larger detail position.',
    purpose: 'Spatial consistency',
    useWhen: 'A small master/detail transition where preserving the identity of an image helps orientation.',
    avoidWhen: 'Complex routing, clipping, or focus changes that need a complete transition architecture.',
    principle: 'Move the same object between two measured positions so its origin remains obvious.',
    duration: '250 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Open detail',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['shared element', 'FLIP', 'master detail', 'identity', 'solid'],
    reducedMotion: 'The artwork changes location immediately without travel or scaling.',
    source: 'animate/SKILL.md',
    html: `<main class="stage structure-stage">
  <div class="shared-board">
    <section class="shared-panel"><p>Collection</p><div class="shared-slot list-slot"><div class="shared-art" role="img" aria-label="Abstract sunset artwork"><i></i><b></b><em></em></div></div><span>Study no. 04</span></section>
    <section class="shared-panel detail-panel"><p>Detail</p><div class="shared-slot detail-slot"></div><span>Same object</span></section>
  </div>
  <button class="demo-button" type="button" aria-pressed="false">Open detail</button>
</main>`,
    css: `${shared}
.shared-board { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 314px; }
.shared-panel { min-width: 0; background: var(--paper); border-radius: 13px; padding: 12px; }
.shared-panel p { margin: 0 0 8px; color: var(--ink); font-size: 10px; font-weight: 600; }
.shared-panel > span { display: block; margin-top: 8px; color: var(--muted); font-size: 9px; }
.shared-slot { display: flex; align-items: center; height: 64px; border-radius: 8px; background: var(--accent-soft); }
.detail-slot { justify-content: center; }
.shared-art { position: relative; flex: none; width: 44px; height: 44px; border-radius: 7px; background: var(--art-1); overflow: hidden; transform-origin: top left; }
.detail-slot .shared-art { width: 64px; height: 64px; }
.shared-art i { position: absolute; width: 30%; height: 30%; border-radius: 50%; background: var(--on-accent); left: 15%; top: 14%; }
.shared-art b { position: absolute; width: 90%; height: 75%; background: var(--art-2); border-radius: 50% 50% 0 0; left: -26%; top: 52%; transform: rotate(17deg); }
.shared-art em { position: absolute; width: 90%; height: 70%; background: var(--art-3); border-radius: 50% 50% 0 0; right: -32%; top: 49%; transform: rotate(-16deg); }
`,
    js: `const art = document.querySelector('.shared-art');
const listSlot = document.querySelector('.list-slot');
const detailSlot = document.querySelector('.detail-slot');
const button = document.querySelector('button');
let detailed = false;
let active = null;
function stop() { if (active) active.cancel(); active = null; }
function move(next) {
  const first = art.getBoundingClientRect();
  stop();
  detailed = next;
  (next ? detailSlot : listSlot).append(art);
  button.textContent = next ? 'Back to collection' : 'Open detail';
  button.setAttribute('aria-pressed', String(next));
  const last = art.getBoundingClientRect();
  if (Demo.reduced || Demo.duration(250) === 0 || Demo.paused) return;
  active = Demo.animate(art, [
    { transform: 'translate(' + (first.left - last.left) + 'px,' + (first.top - last.top) + 'px) scale(' + (first.width / last.width) + ',' + (first.height / last.height) + ')' },
    { transform: 'translate(0,0) scale(1)' }
  ], { duration: 250, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
  active.finished.catch(() => {});
}
button.addEventListener('click', () => move(!detailed));
Demo.onReplay(() => { stop(); listSlot.append(art); detailed = false; move(true); });
Demo.onSettings(() => { if (Demo.reduced) stop(); });
window.addEventListener('resize', stop);
Demo.onCleanup(() => { stop(); window.removeEventListener('resize', stop); });`,
  },
  {
    id: 'card-stack',
    title: 'Card stack',
    category: 'layout',
    description: 'A small deck rotates through three notes while the remaining cards retain their depth.',
    purpose: 'Spatial consistency',
    useWhen: 'A short editorial collection, onboarding cards, or a playful preview of a few objects.',
    avoidWhen: 'Large collections, critical content, or any task that requires comparing every card at once.',
    principle: 'Depth explains the collection; CSS transitions retarget smoothly when the next action arrives early.',
    duration: '250 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Next card',
    tech: 'CSS',
    color: 'lavender',
    tags: ['cards', 'stack', 'depth', 'transition', 'solid'],
    reducedMotion: 'The next card becomes visible immediately; the static stacked arrangement remains.',
    source: 'review-animations/STANDARDS.md',
    html: `<main class="stage structure-stage">
  <div class="stack-deck">
    <article class="stack-card" data-slot="0"><span>Field notes / 01</span><h3>Small details.<br>Lasting impressions.</h3><b aria-hidden="true">${recipeIcon('arrow', 21)}</b></article>
    <article class="stack-card" data-slot="1" aria-hidden="true"><span>Field notes / 02</span><h3>Make space<br>for a little quiet.</h3><b aria-hidden="true">${recipeIcon('half-circle', 21)}</b></article>
    <article class="stack-card" data-slot="2" aria-hidden="true"><span>Field notes / 03</span><h3>A clear path<br>to what comes next.</h3><b aria-hidden="true">${recipeIcon('spark', 21)}</b></article>
  </div>
  <button class="demo-button" type="button">Next card <span aria-hidden="true">${recipeIcon('arrow')}</span></button>
  <span class="study-sr stack-status" role="status">Card 1 of 3</span>
</main>`,
    css: `${shared}
.stack-deck { position: relative; width: 100%; max-width: 232px; height: 130px; }
.stack-card { position: absolute; inset: 4px 10px 13px; padding: 15px 17px; border-radius: 14px; background: var(--paper); box-shadow: 0 2px 3px var(--shadow); transform-origin: center bottom; transition: transform calc(250ms * var(--time-scale)) var(--ease-in-out), opacity calc(200ms * var(--time-scale)) var(--ease-out); }
.stack-card:nth-child(2) { background: color-mix(in srgb, var(--art-1) 18%, var(--paper)); } .stack-card:nth-child(3) { background: color-mix(in srgb, var(--art-1) 32%, var(--paper)); }
.stack-card[data-slot="0"] { transform: translateY(0) rotate(0); z-index: 3; opacity: 1; }
.stack-card[data-slot="1"] { transform: translateY(8px) rotate(-5deg) scale(.97); z-index: 2; opacity: 1; }
.stack-card[data-slot="2"] { transform: translateY(14px) rotate(5deg) scale(.94); z-index: 1; opacity: 1; }
.stack-card > span { color: var(--ink); font-size: 9px; } .stack-card h3 { margin: 13px 0 0; font-size: 17px; font-weight: 600; line-height: 1.17; letter-spacing: -.015em; }
.stack-card b { position: absolute; display: inline-flex; top: 12px; right: 14px; }
.stack-deck[data-static="true"] .stack-card, .stack-deck.is-reset .stack-card { transition: none; }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .stack-card { transition: none; } }
`,
    js: `const deck = document.querySelector('.stack-deck');
const cards = Array.from(deck.children);
const status = document.querySelector('.stack-status');
let front = 0;
function settings() { deck.dataset.static = String(Demo.reduced || Demo.duration(1) === 0); }
function render() {
  settings();
  cards.forEach((card, index) => {
    const slot = (index - front + cards.length) % cards.length;
    card.dataset.slot = String(slot);
    card.setAttribute('aria-hidden', String(slot !== 0));
  });
  status.textContent = 'Card ' + (front + 1) + ' of 3. ' + cards[front].querySelector('h3').textContent;
}
function next() { front = (front + 1) % cards.length; render(); }
document.querySelector('button').addEventListener('click', next);
Demo.onReplay(() => {
  deck.classList.add('is-reset'); front = 0; render();
  void deck.offsetHeight;
  deck.classList.remove('is-reset'); next();
});
Demo.onSettings(settings);`,
  },
  {
    id: 'expandable-card',
    title: 'Expandable card',
    category: 'layout',
    description: 'A compact note opens in place while its background expands independently of the text.',
    purpose: 'Spatial consistency',
    useWhen: 'Inline object details where a small preview can become a fuller explanation.',
    avoidWhen: 'A modal or route change requiring focus management, navigation, or a larger component primitive.',
    principle: 'Animate the measured surface with FLIP and translate the heading separately so the text never stretches.',
    duration: '250 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Expand note',
    tech: 'WAAPI',
    color: 'green',
    tags: ['card', 'expansion', 'FLIP', 'inline detail', 'ghost'],
    reducedMotion: 'The inline note expands immediately, retaining its button and focus.',
    source: 'animate/SKILL.md',
    html: `<main class="stage structure-stage">
  <article class="expand-note">
    <div class="expand-surface" aria-hidden="true"></div>
    <div class="expand-heading"><div class="expand-mark" aria-hidden="true">${recipeIcon('half-circle', 25)}</div><div><p>Field note 017</p><h3>Soft geometry</h3></div></div>
    <div class="expand-copy" id="note-detail" hidden><p>Keep one familiar shape as the anchor. Let the extra detail arrive around it.</p></div>
    <button class="expand-trigger" type="button" aria-expanded="false" aria-controls="note-detail">Read note <span aria-hidden="true">${recipeIcon('arrow')}</span></button>
  </article>
  <p class="study-note">One note, a little more room.</p>
</main>`,
    css: `${shared}
.expand-note { position: relative; width: 100%; max-width: 278px; padding: 17px 19px 6px; }
.expand-surface { position: absolute; inset: 0; background: var(--paper); border-radius: 17px; transform-origin: top left; }
.expand-heading, .expand-copy, .expand-trigger { position: relative; }
.expand-heading { display: flex; align-items: center; gap: 12px; }
.expand-mark { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; color: var(--ink); background: var(--accent-soft); flex: none; }
.expand-heading p { margin: 0 0 4px; color: var(--muted); font-size: 9px; }
.expand-heading h3 { margin: 0; font-size: 17px; font-weight: 600; letter-spacing: -.012em; }
.expand-copy p { margin: 13px 0 0; color: var(--muted); font-size: 12px; line-height: 1.5; }
.expand-trigger { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; min-height: 44px; margin: 4px 0 0; padding: 0; border: 0; color: var(--ink); background: transparent; font: inherit; font-size: 11px; font-weight: 600; cursor: pointer; }
.expand-trigger:active { opacity: .65; }
`,
    js: `const card = document.querySelector('.expand-note');
const surface = card.querySelector('.expand-surface');
const heading = card.querySelector('.expand-heading');
const copy = card.querySelector('.expand-copy');
const button = card.querySelector('button');
let expanded = false;
let animations = [];
function stop() { animations.forEach((animation) => animation.cancel()); animations = []; }
function render(next, animate = true) {
  const firstSurface = surface.getBoundingClientRect();
  const firstHeading = heading.getBoundingClientRect();
  stop(); expanded = next;
  copy.hidden = !next;
  button.setAttribute('aria-expanded', String(next));
  button.firstChild.textContent = next ? 'Close note ' : 'Read note ';
  const lastSurface = surface.getBoundingClientRect();
  const lastHeading = heading.getBoundingClientRect();
  if (!animate || Demo.reduced || Demo.duration(250) === 0 || Demo.paused) return;
  animations.push(Demo.animate(surface, [
    { transform: 'translate(' + (firstSurface.left - lastSurface.left) + 'px,' + (firstSurface.top - lastSurface.top) + 'px) scale(' + (firstSurface.width / lastSurface.width) + ',' + (firstSurface.height / lastSurface.height) + ')' },
    { transform: 'translate(0,0) scale(1)' }
  ], { duration: 250, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }));
  animations.push(Demo.animate(heading, [
    { transform: 'translate(' + (firstHeading.left - lastHeading.left) + 'px,' + (firstHeading.top - lastHeading.top) + 'px)' },
    { transform: 'translate(0,0)' }
  ], { duration: 250, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }));
  if (next) animations.push(Demo.animate(copy, [{ opacity: 0 }, { opacity: 1 }], {
    duration: 150, delay: 50, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both'
  }));
  animations.forEach((animation) => animation.finished.catch(() => {}));
}
button.addEventListener('click', () => render(!expanded));
Demo.onReplay(() => { render(false, false); render(true); });
Demo.onSettings(() => { if (Demo.reduced) stop(); });
window.addEventListener('resize', stop);
Demo.onCleanup(() => { stop(); window.removeEventListener('resize', stop); });`,
  },
  {
    id: 'notification-stack',
    title: 'Activity stack',
    category: 'layout',
    description: 'New entries settle into a persistent inline history as older entries move down.',
    purpose: 'State indication',
    useWhen: 'Teaching stacked arrival motion in a bounded, visible activity history.',
    avoidWhen: 'Production toast notifications: use a maintained accessible notification primitive such as Sonner.',
    principle: 'Rapid arrivals use retargetable CSS transitions; the latest state remains readable without a disappearing toast.',
    duration: '200 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Add activity',
    tech: 'CSS',
    color: 'green',
    tags: ['activity', 'history', 'stack', 'status', 'solid'],
    reducedMotion: 'The latest three history entries update immediately without travel.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage structure-stage activity-stage">
  <section class="activity-card" aria-labelledby="activity-title"><h3 id="activity-title">Activity history <span>Demo</span></h3>
    <ol class="activity-list">
      <li class="activity-entry" style="transform: translateY(0)"><i aria-hidden="true">${recipeIcon('check', 11)}</i><span>Draft saved</span><small>01</small></li>
      <li class="activity-entry" style="transform: translateY(32px)"><i aria-hidden="true">${recipeIcon('check', 11)}</i><span>Colors checked</span><small>02</small></li>
      <li class="activity-entry" style="transform: translateY(64px)"><i aria-hidden="true">${recipeIcon('check', 11)}</i><span>Collection created</span><small>03</small></li>
    </ol>
  </section>
  <button class="demo-button" type="button">Add activity <span aria-hidden="true">${recipeIcon('plus')}</span></button>
  <span class="study-sr activity-status" role="status"></span>
</main>`,
    css: `${shared}
.activity-card { width: 100%; max-width: 300px; padding: 13px 16px 10px; border-radius: 15px; background: var(--paper); }
.activity-card h3 { display: flex; align-items: center; justify-content: space-between; margin: 0 0 8px; color: var(--ink); font-size: 12px; font-weight: 650; }
.activity-card h3 span { color: var(--muted); font-size: 9px; font-weight: 450; }
.activity-list { position: relative; height: 96px; overflow: hidden; margin: 0; padding: 0; list-style: none; }
.activity-entry { position: absolute; inset: 0 0 auto; display: flex; align-items: center; gap: 8px; height: 30px; color: var(--ink); opacity: 1; transition: transform calc(200ms * var(--time-scale)) var(--ease-out), opacity calc(200ms * var(--time-scale)) var(--ease-out); }
.activity-entry i { display: grid; place-items: center; width: 17px; height: 17px; border-radius: 50%; color: var(--success); background: var(--accent-soft); font-size: 10px; font-style: normal; flex: none; }
.activity-entry > span { min-width: 0; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.activity-entry small { margin-left: auto; color: var(--muted); font-size: 9px; font-variant-numeric: tabular-nums; }
.activity-card[data-static="true"] .activity-entry { transition: none; }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .activity-entry { transition: none; } }
`,
    js: `const card = document.querySelector('.activity-card');
const list = card.querySelector('ol');
const status = document.querySelector('.activity-status');
const initial = list.innerHTML;
const messages = ['Timing refined', 'Preview checked', 'Note attached', 'Ready to share'];
let items = Array.from(list.children);
let count = 0;
let retired = null;

function clearRetired() {
  if (retired) retired.remove();
  retired = null;
}
function settings() {
  card.dataset.static = String(Demo.reduced || Demo.duration(1) === 0);
  if (Demo.reduced) clearRetired();
}
function add() {
  clearRetired(); settings();
  const entry = document.createElement('li');
  entry.className = 'activity-entry';
  const icon = document.createElement('i'); icon.innerHTML = ${JSON.stringify(recipeIcon('check', 11))}; icon.setAttribute('aria-hidden', 'true');
  const message = document.createElement('span'); message.textContent = messages[count % messages.length];
  const number = document.createElement('small'); number.textContent = String(++count).padStart(2, '0');
  entry.append(icon, message, number);
  entry.style.transform = 'translateY(-32px)'; entry.style.opacity = '0';
  list.prepend(entry);
  void entry.offsetHeight;
  items.unshift(entry);
  if (items.length > 3) {
    retired = items.pop();
    retired.setAttribute('aria-hidden', 'true');
    retired.style.transform = 'translateY(96px)'; retired.style.opacity = '0';
  }
  items.forEach((item, index) => { item.style.transform = 'translateY(' + index * 32 + 'px)'; item.style.opacity = '1'; });
  if (retired) {
    const outgoing = retired;
    // Transition completion follows pause/resume; elapsed wall time does not.
    const transitions = outgoing.getAnimations();
    if (Demo.reduced || Demo.duration(200) === 0 || transitions.length === 0) clearRetired();
    else Promise.allSettled(transitions.map((animation) => animation.finished)).then(() => {
      if (retired === outgoing) clearRetired();
    });
  }
  status.textContent = message.textContent + '. Latest three demo events shown.';
}
document.querySelector('button').addEventListener('click', add);
Demo.onReplay(() => { clearRetired(); list.innerHTML = initial; items = Array.from(list.children); count = 0; add(); });
Demo.onSettings(settings);
Demo.onCleanup(clearRetired);`,
  },
  {
    id: 'staggered-words',
    title: 'Staggered words',
    category: 'text',
    description: 'A short headline arrives one word at a time with a compact, readable rhythm.',
    purpose: 'Explanation',
    useWhen: 'A first-view editorial headline, onboarding moment, or occasional presentation.',
    avoidWhen: 'Navigation, frequently visited screens, form labels, or essential information users need immediately.',
    principle: 'A 50 ms stagger adds rhythm without turning each word into a separate wait.',
    duration: '300 ms + 50 ms stagger',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Replay words',
    tech: 'WAAPI',
    color: 'lavender',
    tags: ['headline', 'words', 'stagger', 'typography', 'outline'],
    reducedMotion: 'The full headline is readable immediately; word travel and delay are removed.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage structure-stage word-stage">
  <h2 class="word-heading"><span class="study-sr">Make room for the details.</span><span class="word-visual" aria-hidden="true"><i>Make</i> <i>room</i> <i>for</i> <i>the</i> <i>details.</i></span></h2>
  <button class="demo-button secondary" type="button">Replay words <span aria-hidden="true">${recipeIcon('replay')}</span></button>
</main>`,
    css: `${shared}
.word-heading { width: 100%; max-width: 380px; margin: 0; color: var(--ink); font-size: 34px; font-weight: 560; line-height: 1.04; letter-spacing: -.025em; font-optical-sizing: auto; }
.word-visual { display: flex; flex-wrap: wrap; column-gap: .22em; row-gap: .04em; }
.word-visual i { display: inline-block; font-style: normal; }
.word-visual i:last-child { color: var(--accent-ink); }
@media (min-width: 480px) and (min-height: 320px) { .word-heading { font-size: 54px; } }
`,
    js: `const words = Array.from(document.querySelectorAll('.word-visual i'));
let animations = [];
function stop() { animations.forEach((animation) => animation.cancel()); animations = []; }
function play() {
  stop();
  if (Demo.reduced || Demo.duration(300) === 0 || Demo.paused) return;
  animations = words.map((word, index) => {
    const animation = Demo.animate(word, [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 300, delay: index * 50, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' });
    animation.finished.catch(() => {});
    return animation;
  });
}
document.querySelector('button').addEventListener('click', play);
Demo.onReplay(play);
Demo.onSettings(() => { if (Demo.reduced) stop(); });
Demo.onCleanup(stop);`,
  },
  {
    id: 'text-crossfade',
    title: 'Text crossfade',
    category: 'text',
    description: 'Two short messages exchange emphasis without shifting their shared baseline.',
    purpose: 'Preventing a jarring change',
    useWhen: 'Occasional changes to a short status, label, or editorial message with reserved space.',
    avoidWhen: 'Continuous headline carousels, long paragraphs, or text that someone is actively selecting.',
    principle: 'Reserve the layout and transition only opacity; rapidly repeated changes simply retarget.',
    duration: '200 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Change phrase',
    tech: 'CSS',
    color: 'sand',
    tags: ['crossfade', 'text', 'opacity', 'status', 'outline'],
    reducedMotion: 'The new phrase appears immediately in the same reserved space.',
    source: 'review-animations/STANDARDS.md',
    html: `<main class="stage structure-stage crossfade-stage">
  <div class="crossfade-block" data-state="0"><div class="copy-frame" aria-hidden="true"><span class="copy-line copy-first">Less friction.</span><span class="copy-line copy-second">More flow.</span></div><span class="crossfade-dot" aria-hidden="true"></span></div>
  <button class="demo-button secondary" type="button">Change phrase</button>
  <span class="study-sr crossfade-status" role="status">Less friction.</span>
</main>`,
    css: `${shared}
.crossfade-block { width: 100%; max-width: 350px; }
.copy-frame { position: relative; min-height: 57px; }
.copy-line { position: absolute; inset: 0 auto auto 0; white-space: nowrap; color: var(--ink); font-size: 33px; font-weight: 550; line-height: 1.1; letter-spacing: -.025em; transition: opacity calc(200ms * var(--time-scale)) var(--ease-out); }
.copy-second { color: var(--accent-ink); opacity: 0; }
.crossfade-block[data-state="1"] .copy-first { opacity: 0; }
.crossfade-block[data-state="1"] .copy-second { opacity: 1; }
.crossfade-dot { display: block; width: 24px; height: 4px; border-radius: 2px; background: var(--line); }
.crossfade-block.is-reset .copy-line, .crossfade-block[data-static="true"] .copy-line { transition: none; }
@media (min-width: 480px) and (min-height: 320px) { .copy-line { font-size: 49px; } .copy-frame { min-height: 79px; } }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .copy-line { transition: none; } }
`,
    js: `const block = document.querySelector('.crossfade-block');
const status = document.querySelector('.crossfade-status');
let state = 0;
function settings() { block.dataset.static = String(Demo.reduced || Demo.duration(1) === 0); }
function set(next) {
  settings(); state = next; block.dataset.state = String(next);
  status.textContent = next ? 'More flow.' : 'Less friction.';
}
document.querySelector('button').addEventListener('click', () => set(1 - state));
Demo.onReplay(() => { block.classList.add('is-reset'); set(0); void block.offsetHeight; block.classList.remove('is-reset'); set(1); });
Demo.onSettings(settings);`,
  },
  {
    id: 'rolling-number',
    title: 'Rolling digits',
    category: 'text',
    description: 'Three isolated digit strips show how a number can roll to a new value.',
    purpose: 'Explanation',
    useWhen: 'Learning the digit-strip technique or a small, infrequent decorative counter.',
    avoidWhen: 'Production counters with localization or live data: use NumberFlow for formatting, digit transitions, and accessibility.',
    principle: 'Tabular figures preserve width; only the isolated reels move while the accessible value changes once.',
    duration: '250 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Next value',
    tech: 'CSS',
    color: 'blue',
    tags: ['number', 'digit strip', 'tabular figures', 'counter study', 'outline'],
    reducedMotion: 'Each reel goes straight to the new digit; the full number is announced once.',
    source: 'review-animations/STANDARDS.md',
    html: `<main class="stage structure-stage">
  <div class="number-surface"><div class="number-display" aria-hidden="true">
    <span class="digit-window"><span class="digit-reel" style="transform: translateY(-10%)"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
    <span class="digit-window"><span class="digit-reel" style="transform: translateY(-20%)"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
    <span class="digit-window"><span class="digit-reel" style="transform: translateY(-80%)"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span></span>
  </div><p class="number-caption">Digit-strip demo</p></div>
  <button class="demo-button secondary" type="button">Next value <span aria-hidden="true">${recipeIcon('plus')}</span></button>
  <output class="study-sr number-status" aria-live="polite" aria-atomic="true">128</output>
</main>`,
    css: `${shared}
.number-surface { text-align: center; }
.number-display { display: flex; justify-content: center; gap: 1px; margin: 0 0 4px; color: var(--ink); font-size: 63px; line-height: 1; font-weight: 550; font-variant-numeric: tabular-nums; letter-spacing: -.035em; }
.digit-window { display: block; height: 1em; width: .64em; overflow: hidden; }
.digit-reel { display: block; transition: transform calc(250ms * var(--time-scale)) var(--ease-in-out); }
.digit-reel i { display: block; height: 1em; font-style: normal; line-height: 1; }
.number-caption { margin: 0; color: var(--muted); font-size: 10px; }
.number-surface.is-reset .digit-reel, .number-surface[data-static="true"] .digit-reel { transition: none; }
@media (min-width: 480px) and (min-height: 320px) { .number-display { font-size: 88px; } }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .digit-reel { transition: none; } }
`,
    js: `const surface = document.querySelector('.number-surface');
const reels = Array.from(document.querySelectorAll('.digit-reel'));
const output = document.querySelector('.number-status');
const values = [128, 256, 384, 512, 640];
let index = 0;
function settings() { surface.dataset.static = String(Demo.reduced || Demo.duration(1) === 0); }
function render() {
  settings();
  const digits = String(values[index]).padStart(3, '0');
  reels.forEach((reel, position) => { reel.style.transform = 'translateY(-' + Number(digits[position]) * 10 + '%)'; });
  output.textContent = String(values[index]);
}
function next() { index = (index + 1) % values.length; render(); }
document.querySelector('button').addEventListener('click', next);
Demo.onReplay(() => { surface.classList.add('is-reset'); index = 0; render(); void surface.offsetHeight; surface.classList.remove('is-reset'); next(); });
Demo.onSettings(settings);`,
  },
  {
    id: 'clip-text',
    title: 'Clipped headline',
    category: 'text',
    description: 'A headline emerges through a clean horizontal mask, one line behind the next.',
    purpose: 'Explanation',
    useWhen: 'A first-view portfolio or editorial headline where the reveal reinforces its composition.',
    avoidWhen: 'Functional screens, repeated scroll reveals, or content that cannot wait for an entrance.',
    principle: 'The mask is the composition: keep the type intact and reveal it once along a clear edge.',
    duration: '600 ms + 60 ms stagger',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Reveal headline',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['clip-path', 'headline', 'mask', 'reveal', 'outline'],
    reducedMotion: 'Both complete lines are visible immediately without clipping or travel.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage structure-stage clip-stage">
  <h2 class="clip-heading"><span class="study-sr">Quietly confident.</span><span class="clip-line" aria-hidden="true"><i>Quietly</i></span><span class="clip-line" aria-hidden="true"><i>confident.</i></span></h2>
  <button class="demo-button secondary" type="button">Reveal headline <span aria-hidden="true">${recipeIcon('arrow')}</span></button>
</main>`,
    css: `${shared}
.clip-heading { width: 100%; max-width: 376px; margin: 0; color: var(--ink); font-size: 39px; font-weight: 540; line-height: 1.06; letter-spacing: -.025em; font-optical-sizing: auto; }
.clip-line { display: block; overflow: hidden; padding-bottom: .06em; }
.clip-line i { display: block; font-style: normal; }
.clip-line:last-child { color: var(--accent-ink); }
@media (min-width: 480px) and (min-height: 320px) { .clip-heading { font-size: 61px; } }
`,
    js: `const lines = Array.from(document.querySelectorAll('.clip-line i'));
let animations = [];
function stop() { animations.forEach((animation) => animation.cancel()); animations = []; }
function reveal() {
  stop();
  if (Demo.reduced || Demo.duration(600) === 0 || Demo.paused) return;
  animations = lines.map((line, index) => {
    const animation = Demo.animate(line, [
      { clipPath: 'inset(0 0 100% 0)', transform: 'translateY(12%)' },
      { clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' }
    ], { duration: 600, delay: index * 60, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', fill: 'both' });
    animation.finished.catch(() => {});
    return animation;
  });
}
document.querySelector('button').addEventListener('click', reveal);
Demo.onReplay(reveal);
Demo.onSettings(() => { if (Demo.reduced) stop(); });
Demo.onCleanup(stop);`,
  },
  {
    id: 'typewriter',
    title: 'Finite typewriter',
    category: 'text',
    description: 'One short line is typed with a stepped mask and a caret that stops after the sentence.',
    purpose: 'Explanation',
    useWhen: 'A short, optional storytelling moment or a finite demonstration of generated text.',
    avoidWhen: 'Navigation, form labels, essential instructions, looping marketing copy, or simulated waiting.',
    principle: 'A predetermined sequence belongs in the animation engine, not a character-by-character timer loop.',
    duration: '1,520 ms typing + 1,000 ms caret',
    easing: 'steps(19, end)',
    trigger: 'Type again',
    tech: 'WAAPI',
    color: 'graphite',
    tags: ['typewriter', 'steps', 'caret', 'finite', 'outline'],
    reducedMotion: 'The complete sentence is shown immediately and the decorative caret is removed.',
    source: 'animate/SKILL.md',
    html: `<main class="stage structure-stage type-stage">
  <div class="type-page"><p class="type-line" aria-hidden="true"><span class="type-copy">Make the next move.</span><i class="type-caret"></i></p><p class="study-sr">Make the next move.</p><span class="type-rule" aria-hidden="true"></span></div>
  <button class="demo-button secondary" type="button">Type again <span aria-hidden="true">${recipeIcon('replay')}</span></button>
</main>`,
    css: `${shared}
.type-page { width: 100%; max-width: 410px; }
.type-line { position: relative; width: max-content; max-width: 100%; margin: 0 0 16px; color: var(--ink); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 19px; line-height: 1.3; font-weight: 450; letter-spacing: 0; }
.type-copy { display: inline-block; white-space: nowrap; }
.type-caret { position: absolute; top: .13em; left: 0; width: 2px; height: 1em; background: var(--accent); transform: translateX(19ch); }
.type-rule { display: block; width: 38px; height: 3px; border-radius: 2px; background: var(--line); }
html[data-reduced="true"] .type-caret { display: none; }
@media (min-width: 480px) and (min-height: 320px) { .type-line { font-size: 28px; } }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .type-caret { display: none; } }
`,
    js: `const copy = document.querySelector('.type-copy');
const caret = document.querySelector('.type-caret');
const length = copy.textContent.length;
let animations = [];
caret.style.transform = 'translateX(' + length + 'ch)';
function stop() {
  animations.forEach((animation) => animation.cancel()); animations = [];
  copy.style.clipPath = 'inset(0 0 0 0)';
  caret.style.transform = 'translateX(' + length + 'ch)';
  caret.style.opacity = '0';
}
function play() {
  stop();
  if (Demo.reduced || Demo.duration(1520) === 0 || Demo.paused) return;
  caret.style.opacity = '1';
  const easing = 'steps(' + length + ', end)';
  animations.push(Demo.animate(copy, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
    duration: 1520, easing, fill: 'both'
  }));
  animations.push(Demo.animate(caret, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + length + 'ch)' }], {
    duration: 1520, easing, fill: 'both'
  }));
  animations.push(Demo.animate(caret, [{ opacity: 1 }, { opacity: 0 }], {
    duration: 500, delay: 1520, iterations: 2, easing: 'steps(2, end)', fill: 'forwards'
  }));
  animations.forEach((animation) => animation.finished.catch(() => {}));
}
document.querySelector('button').addEventListener('click', play);
Demo.onReplay(play);
Demo.onSettings(() => { if (Demo.reduced) stop(); });
Demo.onCleanup(stop);`,
  },
  {
    id: 'split-flap',
    title: 'Split-flap letters',
    category: 'text',
    description: 'Four mechanical letter tiles flip through a few short words with a restrained ripple.',
    purpose: 'Delight',
    useWhen: 'An occasional wordmark or a tactile editorial moment where the physical metaphor belongs.',
    avoidWhen: 'Rapid status updates, long readable text, or any interface requiring instant comparisons.',
    principle: 'Use a real hinge and two short halves; reserve the 30 ms ripple for a rare decorative moment.',
    duration: '250 ms per flap + 30 ms stagger',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Next word',
    tech: 'WAAPI',
    color: 'graphite',
    tags: ['split flap', '3D', 'letters', 'hinge', 'outline'],
    reducedMotion: 'The complete next word appears immediately without a 3D flip or stagger.',
    source: 'review-animations/STANDARDS.md',
    html: `<main class="stage structure-stage">
  <div class="flap-board" aria-hidden="true"><div class="flap"><span class="flap-base">F</span></div><div class="flap"><span class="flap-base">L</span></div><div class="flap"><span class="flap-base">O</span></div><div class="flap"><span class="flap-base">W</span></div></div>
  <button class="demo-button secondary" type="button">Next word <span aria-hidden="true">${recipeIcon('arrow')}</span></button>
  <span class="study-sr flap-status" role="status">FLOW</span>
</main>`,
    css: `${shared}
.flap-board { display: flex; gap: 7px; max-width: 100%; }
.flap { position: relative; width: 48px; height: 69px; perspective: 300px; border-radius: 7px; background: var(--ink); color: var(--on-ink); font-size: 41px; font-weight: 500; line-height: 1; }
.flap::after { content: ''; position: absolute; z-index: 8; left: 0; right: 0; top: calc(50% - 1px); height: 2px; background: color-mix(in srgb, var(--ink) 75%, var(--on-ink)); pointer-events: none; }
.flap-base { position: absolute; inset: 0; display: grid; place-items: center; }
.flap-layer { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: var(--ink); backface-visibility: hidden; }
.flap-layer > span { position: absolute; left: 0; right: 0; height: 200%; display: grid; place-items: center; }
.flap-old-bottom { bottom: 0; border-radius: 0 0 7px 7px; }
.flap-old-bottom > span { bottom: 0; }
.flap-top { top: 0; z-index: 3; transform-origin: center bottom; border-radius: 7px 7px 0 0; }
.flap-top > span { top: 0; }
.flap-bottom { bottom: 0; z-index: 4; transform-origin: center top; border-radius: 0 0 7px 7px; transform: rotateX(90deg); }
.flap-bottom > span { bottom: 0; }
@media (min-width: 480px) and (min-height: 320px) { .flap { width: 65px; height: 88px; font-size: 53px; } .flap-board { gap: 9px; } }
`,
    js: `const flaps = Array.from(document.querySelectorAll('.flap'));
const status = document.querySelector('.flap-status');
const words = ['FLOW', 'CALM', 'FORM', 'PLAY'];
let current = 'FLOW';
let index = 0;
let revision = 0;
let animations = [];

function settle() {
  revision += 1;
  animations.forEach((animation) => animation.cancel()); animations = [];
  flaps.forEach((flap, position) => {
    flap.querySelector('.flap-base').textContent = current[position];
    flap.querySelectorAll('.flap-layer').forEach((layer) => layer.remove());
  });
}
function layer(className, letter) {
  const element = document.createElement('span'); element.className = 'flap-layer ' + className;
  const text = document.createElement('span'); text.textContent = letter; element.append(text);
  return element;
}
function show(next) {
  // A repeated request cancels the old sequence and settles its intended word.
  // No previous completion callback is allowed to overwrite the new request.
  settle();
  const previous = current;
  current = next; status.textContent = next;
  const ticket = revision;
  if (Demo.reduced || Demo.duration(250) === 0 || Demo.paused) { settle(); return; }
  flaps.forEach((flap, position) => {
    flap.querySelector('.flap-base').textContent = next[position];
    if (previous[position] === next[position]) return;
    const oldBottom = layer('flap-old-bottom', previous[position]);
    const top = layer('flap-top', previous[position]);
    const bottom = layer('flap-bottom', next[position]);
    flap.append(oldBottom, top, bottom);
    const first = Demo.animate(top, [{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], {
      duration: 125, delay: position * 30, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both'
    });
    const second = Demo.animate(bottom, [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], {
      duration: 125, delay: 125 + position * 30, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both'
    });
    animations.push(first, second);
    first.finished.catch(() => {});
    second.finished.then(() => {
      if (ticket !== revision) return;
      oldBottom.remove(); top.remove(); bottom.remove();
    }).catch(() => {});
  });
}
document.querySelector('button').addEventListener('click', () => { index = (index + 1) % words.length; show(words[index]); });
Demo.onReplay(() => { current = 'FLOW'; index = 0; settle(); index = 1; show(words[index]); });
Demo.onSettings(() => { if (Demo.reduced) settle(); });
Demo.onCleanup(settle);`,
  },
];
