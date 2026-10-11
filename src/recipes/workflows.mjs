// Bounded, original workflow studies. Full markup, styles, and helpers are embedded
// in each export. Frequent data/keyboard actions stay immediate; Replay teaches motion.
import { recipeIcon } from '../recipe-icons.mjs';

const shared = String.raw`
.workflow-stage { gap: 8px; padding: 14px; }
.wf-shell { width: min(100%, 330px); padding: 12px; border-radius: 14px; background: var(--paper); color: var(--ink); }
.wf-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.wf-title { font-size: 14px; font-weight: 650; line-height: 1.25; letter-spacing: -.02em; }
.wf-kicker { color: var(--muted); font-size: 10px; line-height: 1.4; }
.wf-copy { color: var(--muted); font-size: 11px; line-height: 1.5; }
.wf-controls { display: flex; align-items: center; gap: 6px; }
.wf-button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 44px; padding: 6.5px 10.5px; border: 1.5px solid var(--ink); border-radius: 9px; background: var(--paper); color: var(--ink); font-size: 11px; font-weight: 600; line-height: 1.2; }
.wf-button.solid { background: var(--ink); color: var(--on-ink); }
.wf-button.quiet { padding: 8px 12px; border: 0; background: transparent; color: var(--muted); }
.wf-button.icon { width: 44px; padding: 6.5px; flex: none; }
.wf-button.icon.quiet { padding: 8px; }
.wf-button:disabled { cursor: default; opacity: .55; }
.wf-caption { max-width: 340px; margin: 0; color: var(--muted); font-size: 10px; line-height: 1.4; text-align: center; }
.wf-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.workflow-stage :where(button, summary, a) { -webkit-user-select: none; user-select: none; touch-action: manipulation; transition: scale calc(120ms * var(--time-scale)) var(--ease-out); }
:root:not([data-reduced="true"]):not([data-keyboard="true"]) .workflow-stage :where(button, summary, a):not(:disabled):active { scale: .97; }
.workflow-stage input, .workflow-stage select { font-size: 16px; }
.workflow-stage input[type="range"] { display: block; width: 100%; min-width: 0; height: 36px; margin: 0; accent-color: var(--accent); }
@media (hover: hover) and (pointer: fine) {
  .wf-button:not(.solid):not(:disabled):hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); color: var(--ink); }
  .wf-button.solid:not(:disabled):hover { background: color-mix(in srgb, var(--ink) 92%, var(--paper)); color: var(--on-ink); }
}
@media (min-height: 300px) { .workflow-stage { gap: 14px; padding: 24px; } .wf-shell { width: min(100%, 430px); padding: 20px; } .wf-title { font-size: 18px; } .wf-copy, .wf-button { font-size: 13px; } .wf-kicker, .wf-caption { font-size: 11px; } }
`;

const motion = String.raw`
const wfOut = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim();
const wfMove = getComputedStyle(document.documentElement).getPropertyValue('--ease-in-out').trim();
let wfAnimations = [];
function wfStop() { wfAnimations.forEach(animation => animation.cancel()); wfAnimations = []; }
function wfAnimate(element, frames, duration = 200, easing = wfOut) {
  if (Demo.duration(1) === 0 || Demo.paused) return null;
  const animation = Demo.animate(element, frames, { duration, easing, fill: 'none' });
  wfAnimations.push(animation);
  return animation;
}
function wfMeasure(elements) { return new Map([...elements].filter(element => !element.hidden).map(element => [element, element.getBoundingClientRect()])); }
function wfFlip(first, elements, duration = 240, resize = false) {
  for (const element of elements) {
    const before = first.get(element);
    const after = element.getBoundingClientRect();
    if (!before || !after.width || !after.height) continue;
    const x = before.left - after.left, y = before.top - after.top;
    const scale = resize ? ' scale(' + before.width / after.width + ',' + before.height / after.height + ')' : '';
    element.style.transformOrigin = 'top left';
    wfAnimate(element, [{ transform: 'translate(' + x + 'px,' + y + 'px)' + scale }, { transform: 'translate(0,0) scale(1)' }], duration, wfMove);
  }
}
Demo.onSettings(() => { if (Demo.reduced) wfStop(); });
window.addEventListener('resize', wfStop);
Demo.onCleanup(() => { wfStop(); window.removeEventListener('resize', wfStop); });
`;

const study = specification => ({
  intent: 'everyday', complexity: 'intermediate', added: '2026-10-10',
  easing: 'cubic-bezier(0.23, 1, 0.32, 1)', tech: 'WAAPI', source: 'animate/SKILL.md',
  ...specification,
  css: shared + specification.css,
  js: motion + specification.js,
});

export default [
  study({
    id: 'directional-pagination', title: 'Pages with a direction', category: 'navigation',
    description: 'A bounded page frame uses the direction of travel to connect the previous and next piece of content.',
    purpose: 'Spatial consistency',
    useWhen: 'An occasional editorial sequence or onboarding chapter benefits from a clear forward and backward relationship.',
    avoidWhen: 'Search results, tables, or frequently paged records. Keep those changes immediate instead of borrowing the chapter transition.',
    principle: 'Let direction explain sequence, keep the frame steady, and never make navigation wait for an animation.',
    duration: '200 ms · keyboard navigation is immediate', trigger: 'Previous / Next or Replay',
    color: 'sand', tags: ['pagination', 'page', 'forward', 'back', 'sequence', 'direction', 'solid', 'outline'], collections: ['product-ui', 'storytelling'],
    reducedMotion: 'The chosen page and page count change immediately inside the same frame.',
    html: `<main class="stage workflow-stage"><section class="wf-shell page-shell" aria-label="Demo field guide">
  <div class="wf-top"><span class="wf-kicker">FIELD GUIDE</span><span class="page-count wf-kicker" aria-live="polite">1 / 3</span></div>
  <div class="page-window"><article class="page-sheet"><span class="page-mark" aria-hidden="true"></span><div><h2 class="wf-title">Make a little space.</h2><p class="wf-copy">Start with the one thing the page needs to say.</p></div></article></div>
  <div class="wf-top"><button class="wf-button page-back" type="button" disabled>Previous</button><button class="wf-button solid page-next" type="button">Next page ${recipeIcon('arrow', 14)}</button></div>
</section><p class="wf-caption">Move through three short chapters.</p></main>`,
    css: String.raw`
.page-window { overflow: hidden; margin: 8px 0; }
.page-sheet { display: flex; align-items: center; gap: 14px; min-height: 78px; }
.page-sheet > div { min-width: 0; }
.page-sheet p { margin-top: 5px; }
.page-mark { flex: none; width: 39px; height: 53px; border: 8px solid var(--art-1); border-right-color: var(--art-2); border-radius: 4px 18px 18px 4px; }
@media (min-height: 300px) { .page-sheet { min-height: 145px; gap: 24px; } .page-mark { width: 63px; height: 83px; border-width: 12px; } }
`,
    js: String.raw`
const sheet = document.querySelector('.page-sheet');
const back = document.querySelector('.page-back'), next = document.querySelector('.page-next');
const chapters = [['Make a little space.', 'Start with the one thing the page needs to say.'], ['Give it a rhythm.', 'Let related ideas sit together, with room between them.'], ['Leave a clear ending.', 'The next action should feel like a natural next step.']];
let page = 0;
function show(index, animate = false, initiator = null) {
  const transferFocus = initiator && document.activeElement === initiator;
  const direction = index >= page ? 1 : -1;
  const interrupted = sheet.getAnimations().some(animation => animation.playState === 'running');
  const visible = getComputedStyle(sheet), start = { opacity: visible.opacity, transform: visible.transform };
  wfStop(); page = Math.max(0, Math.min(chapters.length - 1, index));
  sheet.querySelector('h2').textContent = chapters[page][0];
  sheet.querySelector('p').textContent = chapters[page][1];
  document.querySelector('.page-count').textContent = (page + 1) + ' / ' + chapters.length;
  back.disabled = page === 0; next.disabled = page === chapters.length - 1;
  if (initiator?.disabled && transferFocus) (back.disabled ? next : back).focus({ preventScroll: true });
  if (animate) wfAnimate(sheet, [interrupted ? start : { opacity: .35, transform: 'translateX(' + direction * 24 + 'px)' }, { opacity: 1, transform: 'translateX(0)' }]);
}
back.addEventListener('click', () => show(page - 1, true, back));
next.addEventListener('click', () => show(page + 1, true, next));
Demo.onReplay(() => {
  const focused = [back, next].includes(document.activeElement) ? document.activeElement : null;
  show(0); show(1, true);
  if (focused && !focused.disabled) focused.focus({ preventScroll: true });
});
`,
  }),
  study({
    id: 'breadcrumb-collapse', title: 'Room for the whole path', category: 'navigation',
    description: 'An ellipsis reveals the hidden ancestors of a breadcrumb while the current location keeps its place in the path.',
    purpose: 'Spatial consistency',
    useWhen: 'A deep project or document hierarchy needs a compact path with an explicit way to inspect the omitted ancestors.',
    avoidWhen: 'A short path already fits. These are illustrative locations, not a replacement for a production routing component.',
    principle: 'Disclose the omitted context without replacing the current location or hiding the control that closes it.',
    duration: '200 ms', trigger: 'Show or collapse the full path',
    color: 'peach', tags: ['breadcrumb', 'disclosure', 'path', 'hierarchy', 'overflow', 'ghost', 'icon'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The full path appears or collapses immediately; the current location remains labeled.',
    html: `<main class="stage workflow-stage"><section class="wf-shell crumb-shell">
  <nav aria-label="Demo breadcrumb"><ol class="crumbs"><li>Workspace</li><li><button class="crumb-toggle wf-button icon quiet" type="button" aria-label="Show full path" aria-expanded="false" aria-controls="crumb-project crumb-client">${recipeIcon('dots', 18)}</button></li><li id="crumb-project" class="crumb-extra" hidden>Projects</li><li id="crumb-client" class="crumb-extra" hidden>Studio</li><li class="crumb-current" aria-current="page">Brand kit</li></ol></nav>
  <div class="crumb-preview"><span aria-hidden="true">${recipeIcon('diamond', 30)}</span><div><h2 class="wf-title">Brand kit</h2><p class="wf-copy">Six assets, one home.</p></div><span class="crumb-file-count">06</span></div>
</section><p class="wf-caption">Reveal the ancestry. Keep your bearings.</p></main>`,
    css: String.raw`
.crumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 2px 5px; min-height: 44px; margin: 0; padding: 0; list-style: none; color: var(--muted); font-size: 10px; }
.crumbs > li { display: flex; align-items: center; gap: 5px; }
.crumbs > li:not(:last-child)::after { content: '/'; color: var(--muted); }
.crumbs .crumb-current { color: var(--ink); font-weight: 600; }
.crumbs .crumb-toggle { width: 44px; min-width: 44px; padding: 5px; }
.crumb-preview { display: flex; align-items: center; gap: 11px; min-height: 88px; margin-top: 8px; padding: 13px; border-radius: 10px; background: var(--accent-soft); }
.crumb-preview > span:first-child { color: var(--accent-ink); }
.crumb-preview p { margin-top: 3px; }
.crumb-file-count { margin-left: auto; color: var(--accent-ink); font-size: 28px; font-weight: 500; font-variant-numeric: tabular-nums; }
@media (min-height: 300px) { .crumbs { font-size: 12px; gap: 4px 8px; } .crumb-preview { min-height: 134px; padding: 20px; } .crumb-file-count { font-size: 42px; } }
`,
    js: String.raw`
const toggle = document.querySelector('.crumb-toggle');
const crumbs = [...document.querySelectorAll('.crumbs > li')];
const extras = [...document.querySelectorAll('.crumb-extra')];
let expanded = false;
function disclose(next, animate = true) {
  const first = wfMeasure(crumbs);
  wfStop(); expanded = next;
  extras.forEach(element => { element.hidden = !expanded; });
  toggle.setAttribute('aria-expanded', String(expanded));
  toggle.setAttribute('aria-label', expanded ? 'Collapse path' : 'Show full path');
  if (animate) {
    wfFlip(first, crumbs.filter(element => !element.hidden), 200);
    if (expanded) extras.forEach(element => wfAnimate(element, [{ opacity: 0 }, { opacity: 1 }], 160));
  }
}
toggle.addEventListener('click', () => disclose(!expanded));
Demo.onReplay(() => { disclose(false, false); disclose(true); });
`,
  }),
  study({
    id: 'tab-panel-transition', title: 'A steady frame for tabs', category: 'navigation',
    description: 'Three accessible tabs fade in their incoming content inside a fixed frame while keyboard navigation stays immediate.',
    purpose: 'Preventing a jarring change',
    useWhen: 'Occasional related views share one place in the layout, and a brief opacity bridge helps explain the replacement.',
    avoidWhen: 'Frequently switched work views or data that must be read continuously. Use immediate panel replacement for those cases.',
    principle: 'Keep selection, focus, and the content relationship correct before adding a contained, optional fade.',
    duration: '180 ms · keyboard selection is immediate', trigger: 'Select tabs, use arrow keys, or Replay',
    color: 'blue', tags: ['tabs', 'tabpanel', 'content fade', 'roving focus', 'content', 'navigation', 'solid', 'ghost'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The selected panel is shown immediately with the same tab and focus semantics.',
    html: `<main class="stage workflow-stage"><section class="wf-shell panel-tabs">
  <div class="panel-tablist" role="tablist" aria-label="Demo project views"><button id="view-overview" type="button" role="tab" aria-controls="panel-overview" aria-selected="true" tabindex="0">Overview</button><button id="view-notes" type="button" role="tab" aria-controls="panel-notes" aria-selected="false" tabindex="-1">Notes</button><button id="view-activity" type="button" role="tab" aria-controls="panel-activity" aria-selected="false" tabindex="-1">Activity</button></div>
  <div class="panel-viewport"><section id="panel-overview" class="content-panel" role="tabpanel" aria-labelledby="view-overview" tabindex="0"><span class="panel-emblem" aria-hidden="true">${recipeIcon('half-circle', 27)}</span><h2 class="wf-title">Ready for a closer look.</h2><p class="wf-copy">8 components · 3 contributors</p></section><section id="panel-notes" class="content-panel" role="tabpanel" aria-labelledby="view-notes" tabindex="0" hidden><span class="panel-emblem" aria-hidden="true">${recipeIcon('code', 27)}</span><h2 class="wf-title">The details live here.</h2><p class="wf-copy">Keep the reading rhythm calm.</p></section><section id="panel-activity" class="content-panel" role="tabpanel" aria-labelledby="view-activity" tabindex="0" hidden><span class="panel-emblem" aria-hidden="true">${recipeIcon('check', 27)}</span><h2 class="wf-title">A little progress.</h2><p class="wf-copy">The spacing review is complete.</p></section></div>
</section><p class="wf-caption">Arrow keys move directly between views.</p></main>`,
    css: String.raw`
.panel-tablist { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3px; padding-bottom: 5px; border-bottom: 1px solid var(--line); }
.panel-tablist button { min-height: 44px; border: 0; border-radius: 7px; background: transparent; color: var(--muted); font-size: 11px; font-weight: 550; }
.panel-tablist button[aria-selected="true"] { color: var(--on-ink); background: var(--ink); }
.panel-viewport { position: relative; min-height: 104px; }
.content-panel { display: flex; min-height: 104px; flex-direction: column; align-items: flex-start; justify-content: center; gap: 6px; padding: 9px 6px; border-radius: 6px; }
.panel-emblem { color: var(--accent-ink); }
@media (hover: hover) and (pointer: fine) { .panel-tablist button[aria-selected="false"]:hover { color: var(--ink); background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } .panel-tablist button[aria-selected="true"]:hover { color: var(--on-ink); background: color-mix(in srgb, var(--ink) 92%, var(--paper)); } }
@media (min-height: 300px) { .panel-tablist button { font-size: 13px; } .panel-viewport, .content-panel { min-height: 180px; } .content-panel { gap: 12px; padding: 15px 8px; } }
`,
    js: String.raw`
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
let selected = 0;
function choose(index, animate = false) {
  if (index === selected) return;
  wfStop(); selected = index;
  tabs.forEach((tab, position) => { tab.setAttribute('aria-selected', String(position === index)); tab.tabIndex = position === index ? 0 : -1; panels[position].hidden = position !== index; });
  if (animate) wfAnimate(panels[index], [{ opacity: 0 }, { opacity: 1 }], 180);
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => choose(index, true));
  tab.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next === null) return;
    event.preventDefault(); choose(next); tabs[next].focus();
  });
});
Demo.onReplay(() => { choose(0); choose(1, true); });
`,
  }),
  study({
    id: 'drilldown-navigation', title: 'One level deeper', category: 'navigation',
    description: 'A small resource browser moves from a collection into its contents, retaining a clear route back to the parent.',
    purpose: 'Spatial consistency',
    useWhen: 'A bounded mobile resource picker or occasional hierarchical browser needs to explain parent and child views.',
    avoidWhen: 'High-frequency settings navigation or a deep tree that would be easier to scan in one view. Production routing is outside this study.',
    principle: 'Make the return route obvious and preserve keyboard focus when a parent view is replaced.',
    duration: '200 ms · keyboard navigation is immediate', trigger: 'Open a collection and go back, or Replay',
    color: 'green', tags: ['drilldown', 'hierarchy', 'back', 'resource picker', 'mobile navigation', 'outline', 'ghost'], collections: ['product-ui'],
    reducedMotion: 'Parent and child views replace each other immediately, including their focus targets.',
    html: `<main class="stage workflow-stage"><section class="wf-shell drill-shell" aria-label="Demo resource browser">
  <div class="drill-parent"><p class="wf-kicker">YOUR LIBRARY</p><h2 class="wf-title">Keep the good pieces.</h2><div class="drill-folders"><button type="button" class="drill-folder" data-folder="Color"><span>${recipeIcon('half-circle', 22)} Color studies</span><span aria-hidden="true">›</span></button><button type="button" class="drill-folder" data-folder="Type"><span>${recipeIcon('code', 22)} Type studies</span><span aria-hidden="true">›</span></button></div></div>
  <div class="drill-child" hidden><button class="wf-button quiet drill-back" type="button">‹ All collections</button><h2 class="wf-title drill-heading">Color studies</h2><ul class="drill-items"><li>Soft contrast</li><li>A quieter accent</li><li>Room for the details</li></ul></div>
</section><p class="wf-caption">A parent, a child, and a reliable way back.</p></main>`,
    css: String.raw`
.drill-shell { min-height: 180px; overflow: hidden; }
.drill-parent > h2 { margin-top: 4px; }
.drill-folders { display: grid; gap: 4px; margin-top: 12px; }
.drill-folder { display: flex; justify-content: space-between; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 5.5px 8.5px; border: 1.5px solid var(--ink); border-radius: 9px; background: var(--paper); color: var(--ink); font-size: 12px; }
.drill-folder > span:first-child { display: flex; align-items: center; gap: 9px; }
.wf-button.drill-back { padding-left: 0; min-height: 44px; }
.drill-heading { margin: 5px 0 8px; }
.drill-items { margin: 0; padding-left: 17px; color: var(--muted); font-size: 11px; line-height: 1.7; }
@media (hover: hover) and (pointer: fine) { .drill-folder:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } }
@media (min-height: 300px) { .drill-shell { min-height: 246px; } .drill-folders { margin-top: 22px; gap: 8px; } .drill-folder { min-height: 56px; font-size: 14px; } .drill-items { font-size: 14px; line-height: 1.9; } }
`,
    js: String.raw`
const parent = document.querySelector('.drill-parent'), child = document.querySelector('.drill-child');
const back = document.querySelector('.drill-back');
let origin = document.querySelector('.drill-folder');
const items = { Color: ['Soft contrast', 'A quieter accent', 'Room for the details'], Type: ['A strong opening', 'The reading rhythm', 'A useful caption'] };
function open(folder, animate = false, focus = false) {
  wfStop(); parent.hidden = true; child.hidden = false;
  document.querySelector('.drill-heading').textContent = folder + ' studies';
  document.querySelectorAll('.drill-items li').forEach((item, index) => { item.textContent = items[folder][index]; });
  if (animate) wfAnimate(child, [{ opacity: .4, transform: 'translateX(12%)' }, { opacity: 1, transform: 'translateX(0)' }]);
  if (focus) back.focus({ preventScroll: true });
}
function close(focus = false, animate = false) { wfStop(); child.hidden = true; parent.hidden = false; if (animate) wfAnimate(parent, [{ opacity: .4, transform: 'translateX(-12%)' }, { opacity: 1, transform: 'translateX(0)' }]); if (focus) origin.focus({ preventScroll: true }); }
document.querySelectorAll('.drill-folder').forEach(button => button.addEventListener('click', event => { origin = button; open(button.dataset.folder, true, event.detail === 0); }));
back.addEventListener('click', event => close(event.detail === 0, true));
Demo.onReplay(() => { close(); open('Color', true); });
`,
  }),
  study({
    id: 'expanding-search', title: 'Search when you need it', category: 'navigation',
    description: 'A compact search affordance reveals a properly labeled field and filters a small asset list without delaying input.',
    purpose: 'State indication',
    useWhen: 'A compact asset browser needs an optional search field without making that field the main visual element.',
    avoidWhen: 'Search is the primary task, or a command palette is used constantly. Keep that field visible and its interactions immediate.',
    principle: 'Reveal the input, move focus intentionally, and keep typed filtering immediate. Replay alone demonstrates the arrival.',
    duration: '180 ms on Replay · search and typing are immediate', trigger: 'Toggle Search and type an asset name',
    color: 'graphite', tags: ['search', 'input', 'disclosure', 'filter', 'assets', 'outline', 'icon'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The search field appears immediately; matching assets and the result count update without animation.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell search-shell"><div class="wf-top"><div><p class="wf-kicker">ASSET LIBRARY</p><h2 class="wf-title">Find the right piece.</h2></div><button class="wf-button icon search-toggle" type="button" aria-label="Open search" aria-expanded="false" aria-controls="asset-search">${recipeIcon('spark', 20)}</button></div>
  <form id="asset-search" class="asset-search" role="search" hidden><label class="wf-sr" for="asset-query">Search demo assets</label><input id="asset-query" type="search" autocomplete="off" enterkeyhint="search" placeholder="Try “icon”" /></form>
  <ul class="search-items" tabindex="0" aria-label="Matching demo assets"><li data-name="wordmark">${recipeIcon('code', 17)}<span>Wordmark</span><span>SVG</span></li><li data-name="cover image">${recipeIcon('diamond', 17)}<span>Cover image</span><span>PNG</span></li><li data-name="app icon">${recipeIcon('half-circle', 17)}<span>App icon</span><span>SVG</span></li></ul><p class="search-count wf-kicker" role="status">3 assets</p>
</section></main>`,
    css: String.raw`
.asset-search { margin-top: 5px; }
.asset-search input { width: 100%; height: 40px; min-width: 0; padding: 7px 10px; border: 1px solid var(--line); border-radius: 8px; background: var(--demo-bg); color: var(--ink); }
.asset-search input::placeholder { color: var(--muted); opacity: 1; }
.search-items { display: grid; gap: 2px; max-height: 60px; overflow: auto; margin: 6px 0 2px; padding: 0; list-style: none; }
.search-items:focus-visible { outline-offset: -2px; border-radius: 4px; }
.search-items li { display: flex; gap: 8px; align-items: center; min-height: 28px; font-size: 11px; }
.search-items li > svg { color: var(--accent-ink); }
.search-items li > span:last-child { margin-left: auto; color: var(--muted); font-size: 9px; }
.search-count { min-height: 14px; }
@media (min-height: 300px) { .asset-search { margin-top: 12px; } .asset-search input { height: 46px; } .search-items { margin-top: 12px; max-height: 130px; } .search-items li { min-height: 37px; font-size: 13px; } .search-items li > span:last-child { font-size: 11px; } }
`,
    js: String.raw`
const toggle = document.querySelector('.search-toggle'), form = document.querySelector('.asset-search'), input = document.querySelector('#asset-query');
const assets = [...document.querySelectorAll('.search-items li')];
function filter() {
  const query = input.value.trim().toLocaleLowerCase();
  assets.forEach(asset => { asset.hidden = !asset.dataset.name.includes(query); });
  const count = assets.filter(asset => !asset.hidden).length;
  document.querySelector('.search-count').textContent = count ? count + (count === 1 ? ' asset' : ' assets') : 'No matching assets';
}
function disclose(open, animate = false, focus = false) {
  wfStop(); form.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close search' : 'Open search');
  if (!open) { input.value = ''; filter(); }
  if (open && animate) wfAnimate(form, [{ opacity: 0, transform: 'translateY(-6px)' }, { opacity: 1, transform: 'translateY(0)' }], 180);
  if (focus) (open ? input : toggle).focus({ preventScroll: true });
}
toggle.addEventListener('click', () => disclose(form.hidden, false, true));
input.addEventListener('input', filter);
input.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); disclose(false, false, true); } });
form.addEventListener('submit', event => { event.preventDefault(); filter(); });
Demo.onReplay(() => { input.value = ''; filter(); disclose(false); disclose(true, true); });
`,
  }),
  study({
    id: 'dock-magnification', title: 'A dock that leans closer', category: 'expressive',
    description: 'A small group of tool faces grows toward a fine pointer while its real button targets remain stationary.',
    purpose: 'Delight',
    useWhen: 'An optional creative-tool showcase or a playful, infrequently visited navigation surface can support a little physical personality.',
    avoidWhen: 'Dense productivity navigation, critical targets, or touch-only navigation. Keyboard and touch selection stay static and fully labeled.',
    principle: 'Spring the decorative faces as a group, preserve their velocity when retargeted, and keep every hit area fixed.',
    duration: 'Physics-driven · finite Replay', easing: 'Spring · duration 0.5 · bounce 0.2',
    trigger: 'Move a fine pointer across the dock, or choose a tool', tech: 'Motion', usesMotion: true,
    color: 'lavender', tags: ['dock', 'magnification', 'spring', 'pointer', 'navigation', 'tools', 'soft', 'solid', 'icon'], intent: 'expressive', collections: ['signature', 'landing-pages'],
    reducedMotion: 'Tool faces stay at their natural size. Selection, native focus, and tool labels remain available.',
    source: 'apple-design/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell dock-scene" aria-label="Demo creative tools"><p class="wf-kicker">A SMALL CREATIVE DESKTOP</p><div class="dock-tools" role="group" aria-label="Choose a demo tool"><button class="dock-tool" type="button" data-tool="Draw" aria-pressed="true"><span class="dock-face" aria-hidden="true">${recipeIcon('spark', 22)}</span><span>Draw</span></button><button class="dock-tool" type="button" data-tool="Notes" aria-pressed="false"><span class="dock-face" aria-hidden="true">${recipeIcon('code', 22)}</span><span>Notes</span></button><button class="dock-tool" type="button" data-tool="Files" aria-pressed="false"><span class="dock-face" aria-hidden="true">${recipeIcon('diamond', 22)}</span><span>Files</span></button><button class="dock-tool" type="button" data-tool="Inbox" aria-pressed="false"><span class="dock-face" aria-hidden="true">${recipeIcon('check', 22)}</span><span>Inbox</span></button></div><p class="dock-status wf-copy" role="status">Draw is open</p></section><p class="wf-caption">A moving face. A steady target.</p></main>`,
    css: String.raw`
.dock-scene { text-align: center; padding-top: 17px; }
.dock-tools { display: flex; align-items: flex-end; justify-content: center; gap: 5px; min-height: 109px; padding: 20px 6px 8px; }
.dock-tool { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 7px; width: 51px; min-height: 68px; padding: 8px 0 2px; border: 0; border-radius: 8px; color: var(--muted); background: transparent; font-size: 10px; }
.dock-face { display: grid; place-items: center; width: 38px; height: 40px; flex: none; border-radius: 11px; background: var(--accent-soft); color: var(--accent-ink); transform-origin: center bottom; pointer-events: none; }
.dock-tool[aria-pressed="true"] .dock-face { background: var(--accent); color: var(--on-accent); }
.dock-status { min-height: 17px; }
@media (min-height: 300px) { .dock-tools { min-height: 176px; gap: 14px; padding-bottom: 18px; } .dock-tool { width: 65px; font-size: 12px; gap: 12px; } .dock-face { width: 48px; height: 51px; border-radius: 14px; } .dock-status { padding-bottom: 10px; } }
`,
    js: String.raw`
const dock = document.querySelector('.dock-tools'), tools = [...document.querySelectorAll('.dock-tool')];
const fine = matchMedia('(hover: hover) and (pointer: fine)');
let version = 0;
const springs = tools.map(button => {
  const face = button.querySelector('.dock-face');
  const value = Motion.motionValue(1);
  let animation = null;
  const unsubscribe = value.on('change', scale => { face.style.transform = 'translateY(' + (1 - scale) * 12 + 'px) scale(' + scale + ')'; });
  function jump(next = 1) { animation?.stop(); animation = null; value.jump(next); }
  function to(next) {
    if (Demo.duration(1) === 0 || !fine.matches) { jump(); return Promise.resolve(); }
    const current = Motion.animate(value, next, { type: 'spring', duration: .5, bounce: .2 });
    animation = current; current.speed = Demo.speed;
    if (Demo.paused || document.hidden) current.pause();
    return Promise.resolve(current).then(() => { if (animation === current) animation = null; });
  }
  function sync() { if (Demo.reduced || !fine.matches) { jump(); return; } if (animation) { animation.speed = Demo.speed; if (Demo.paused || document.hidden) animation.pause(); else animation.play(); } }
  return { to, jump, sync, destroy() { animation?.stop(); unsubscribe(); value.destroy(); } };
});
function settle() { version++; springs.forEach(spring => spring.to(1)); }
function point(event) {
  if (!fine.matches || event.pointerType === 'touch' || Demo.reduced || Demo.paused) return;
  version++;
  const centers = tools.map(button => { const bounds = button.getBoundingClientRect(); return bounds.left + bounds.width / 2; });
  const spacing = centers[1] - centers[0];
  springs.forEach((spring, index) => spring.to(1 + .28 * Math.max(0, 1 - Math.abs(event.clientX - centers[index]) / (spacing * 1.5))));
}
function sync() { springs.forEach(spring => spring.sync()); }
dock.addEventListener('pointermove', point);
dock.addEventListener('pointerleave', settle);
dock.addEventListener('keydown', () => { version++; springs.forEach(spring => spring.jump()); });
tools.forEach(button => button.addEventListener('click', () => {
  tools.forEach(tool => tool.setAttribute('aria-pressed', String(tool === button)));
  document.querySelector('.dock-status').textContent = button.dataset.tool + ' is open';
}));
Demo.onReplay(() => {
  const run = ++version;
  springs.forEach(spring => spring.jump());
  if (Demo.reduced || !fine.matches) return;
  Promise.all(springs.map((spring, index) => spring.to(index === 1 ? 1.28 : index === 0 || index === 2 ? 1.1 : 1))).then(() => { if (run === version) settle(); });
});
Demo.onSettings(sync);
document.addEventListener('visibilitychange', sync);
fine.addEventListener('change', sync);
Demo.onCleanup(() => { version++; springs.forEach(spring => spring.destroy()); document.removeEventListener('visibilitychange', sync); fine.removeEventListener('change', sync); });
`,
  }),
  study({
    id: 'floating-toolbar', title: 'Tools follow the selection', category: 'navigation',
    description: 'A compact formatting toolbar stays near the selected text block while its controls apply real local text formatting.',
    purpose: 'Spatial consistency',
    useWhen: 'A bounded block editor needs contextual controls close to the selected object. Replay illustrates the toolbar changing its anchor.',
    avoidWhen: 'A production rich-text editor needs selection, composition, and accessibility behavior beyond this two-block study.',
    principle: 'Keep the tool near what it changes, preserve native buttons, and make frequent selection and keyboard formatting immediate.',
    duration: '200 ms on Replay · selection and formatting are immediate', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Choose a line; toggle Bold, Italic, or Underline',
    color: 'sand', tags: ['toolbar', 'selection', 'contextual', 'formatting', 'editor', 'anchor', 'solid', 'outline', 'ghost'], collections: ['product-ui'],
    reducedMotion: 'The toolbar moves to the selected block immediately; formatting and focus remain unchanged.',
    html: `<main class="stage workflow-stage"><section class="wf-shell format-shell" aria-label="Demo block formatting"><div class="format-toolbar" role="toolbar" aria-label="Text formatting"><button type="button" data-format="bold" aria-label="Bold" aria-pressed="false" tabindex="0">B</button><button type="button" data-format="italic" aria-label="Italic" aria-pressed="false" tabindex="-1"><i>I</i></button><button type="button" data-format="underline" aria-label="Underline" aria-pressed="false" tabindex="-1"><u>U</u></button></div><div class="format-lines"><button class="format-line" type="button" aria-pressed="true"><span>Good ideas need room.</span></button><button class="format-line" type="button" aria-pressed="false"><span>Give the details a little care.</span></button></div></section><p class="wf-caption">Choose a line, then format it.</p></main>`,
    css: String.raw`
.format-shell { position: relative; padding-top: 66px; }
.format-toolbar { position: absolute; z-index: 2; left: 12px; top: 10px; display: flex; padding: 0 4px; border: 1px solid var(--line); border-radius: 9px; background: var(--paper); box-shadow: 0 4px 10px var(--shadow); }
.format-toolbar button { width: 44px; height: 44px; padding: 8px; border: 0; border-radius: 7px; background: transparent; color: var(--ink); font-size: 14px; font-weight: 650; }
.format-toolbar button[aria-pressed="true"] { background: var(--ink); color: var(--on-ink); }
.format-lines { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.format-line { min-width: 0; min-height: 78px; padding: 9.5px; border: 1.5px solid var(--ink); border-radius: 8px; background: var(--paper); color: var(--ink); font-size: 12px; line-height: 1.5; text-align: left; }
.format-line[aria-pressed="true"] { box-shadow: inset 0 0 0 1px var(--ink); }
@media (hover: hover) and (pointer: fine) { .format-toolbar button[aria-pressed="false"]:hover, .format-line:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } .format-toolbar button[aria-pressed="true"]:hover { background: color-mix(in srgb, var(--ink) 92%, var(--paper)); color: var(--on-ink); } }
@media (min-height: 300px) { .format-shell { padding-top: 83px; } .format-toolbar { left: 20px; top: 20px; } .format-line { min-height: 112px; padding: 14.5px; font-size: 15px; } .format-lines { gap: 12px; } }
`,
    js: String.raw`
const shell = document.querySelector('.format-shell'), toolbar = document.querySelector('.format-toolbar'), controls = [...toolbar.querySelectorAll('button')], lines = [...document.querySelectorAll('.format-line')];
const formatting = lines.map(() => ({ bold: false, italic: false, underline: false }));
let selected = 0;
function refresh() {
  controls.forEach(button => button.setAttribute('aria-pressed', String(formatting[selected][button.dataset.format])));
  lines.forEach((line, index) => { const text = line.firstElementChild, state = formatting[index]; text.style.fontWeight = state.bold ? '700' : '400'; text.style.fontStyle = state.italic ? 'italic' : 'normal'; text.style.textDecoration = state.underline ? 'underline' : 'none'; });
}
function select(index, animate = false) {
  const from = getComputedStyle(toolbar).transform;
  wfStop(); selected = index;
  lines.forEach((line, position) => line.setAttribute('aria-pressed', String(position === index)));
  const inset = parseFloat(getComputedStyle(shell).paddingLeft);
  const centered = lines[index].offsetLeft + lines[index].offsetWidth / 2 - toolbar.offsetWidth / 2;
  const left = Math.max(inset, Math.min(shell.clientWidth - inset - toolbar.offsetWidth, centered));
  const target = 'translateX(' + (left - toolbar.offsetLeft) + 'px)';
  toolbar.style.transform = target; refresh();
  if (animate) wfAnimate(toolbar, [{ transform: from }, { transform: target }], 200, wfMove);
}
lines.forEach((line, index) => line.addEventListener('click', () => select(index)));
controls.forEach((button, index) => {
  button.addEventListener('click', () => { formatting[selected][button.dataset.format] = !formatting[selected][button.dataset.format]; refresh(); });
  button.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % controls.length : event.key === 'ArrowLeft' ? (index + controls.length - 1) % controls.length : event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : null;
    if (next === null) return; event.preventDefault(); controls.forEach((control, position) => { control.tabIndex = position === next ? 0 : -1; }); controls[next].focus();
  });
});
function resize() { select(selected); }
window.addEventListener('resize', resize);
Demo.onCleanup(() => window.removeEventListener('resize', resize));
Demo.onReplay(() => { select(0); select(1, true); });
select(0);
`,
  }),
  study({
    id: 'anchor-scrollspy', title: 'A place in the document', category: 'navigation',
    description: 'A section marker follows the actual reading pane and keeps its links in sync with the visible part of the document.',
    purpose: 'State indication',
    useWhen: 'A documentation page or long product story needs a compact table of contents that reflects the reader’s location.',
    avoidWhen: 'Short documents, decorative scroll hijacking, or a nested reading pane in the final page. This pane bounds the study only.',
    principle: 'Follow native scroll position, keep anchors meaningful, and let the marker explain location without delaying navigation.',
    duration: '200 ms marker movement on Replay · reading and links are immediate', trigger: 'Scroll or select a section link',
    color: 'blue', tags: ['scrollspy', 'anchors', 'table of contents', 'reading', 'section', 'native scroll', 'ghost'], collections: ['landing-pages', 'storytelling'],
    reducedMotion: 'Section links, scroll position, and the current marker update immediately.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell spy-shell"><nav class="spy-nav" aria-label="Demo article sections"><a href="#spy-start" aria-current="location">Start</a><a href="#spy-details">Details</a><a href="#spy-finish">Finish</a><span class="spy-indicator" aria-hidden="true"></span></nav><article class="spy-pane" tabindex="0" aria-label="Demo article"><section id="spy-start"><h2>Start with a reason.</h2><p>Give the page one clear job. The rest of the design should help it do that job.</p></section><section id="spy-details"><h2>Make the details useful.</h2><p>Good spacing and clear labels make an interface easier to understand before anything moves.</p></section><section id="spy-finish"><h2>Leave a clear next step.</h2><p>Finish with a decision the reader can make confidently. Let them choose their own pace.</p></section></article></section></main>`,
    css: String.raw`
.spy-shell { padding: 6px 12px 10px; }
.spy-nav { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-bottom: 1px solid var(--line); }
.spy-nav a { display: grid; place-items: center; min-height: 44px; color: var(--muted); text-decoration: none; font-size: 11px; border-radius: 6px; }
.spy-nav a[aria-current] { color: var(--ink); font-weight: 650; }
.spy-indicator { position: absolute; bottom: -1px; left: 0; width: 33.333%; height: 3px; border-radius: 2px; background: var(--accent); pointer-events: none; }
@media (hover: hover) and (pointer: fine) { .spy-nav a:hover { color: var(--ink); background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } }
.spy-pane { position: relative; height: 136px; overflow: auto; scrollbar-width: thin; scrollbar-color: var(--muted) var(--paper); border-radius: 5px; }
.spy-pane:focus-visible { outline-offset: -3px; }
.spy-pane section { min-height: 126px; padding: 17px 8px; }
.spy-pane h2 { font-size: 15px; line-height: 1.25; font-weight: 650; letter-spacing: -.025em; }
.spy-pane p { margin-top: 8px; color: var(--muted); font-size: 11px; line-height: 1.55; }
@media (min-height: 300px) { .spy-shell { padding: 10px 18px 16px; } .spy-nav a { font-size: 13px; } .spy-pane { height: 233px; } .spy-pane section { min-height: 211px; padding: 28px 14px; } .spy-pane h2 { font-size: 23px; } .spy-pane p { font-size: 14px; line-height: 1.65; } }
`,
    js: String.raw`
const pane = document.querySelector('.spy-pane'), links = [...document.querySelectorAll('.spy-nav a')], sections = [...pane.querySelectorAll('section')], indicator = document.querySelector('.spy-indicator');
let current = 0;
function update() {
  current = Math.max(0, sections.findLastIndex(section => section.offsetTop <= pane.scrollTop + 26));
  links.forEach((link, index) => { if (index === current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  indicator.style.transform = 'translateX(' + current * 100 + '%)';
}
links.forEach((link, index) => link.addEventListener('click', event => { event.preventDefault(); wfStop(); pane.scrollTop = sections[index].offsetTop; update(); }));
pane.addEventListener('scroll', update, { passive: true });
const observer = new ResizeObserver(update); observer.observe(pane);
Demo.onReplay(() => { wfStop(); pane.scrollTop = sections[1].offsetTop; update(); wfAnimate(indicator, [{ transform: 'translateX(0)' }, { transform: 'translateX(' + current * 100 + '%)' }], 200, wfMove); });
Demo.onCleanup(() => { pane.removeEventListener('scroll', update); observer.disconnect(); });
update();
`,
  }),
  study({
    id: 'sticky-header', title: 'The title stays with you', category: 'navigation',
    description: 'A document title takes a compact place in a native sticky header as its larger opening scrolls out of view.',
    purpose: 'Spatial consistency',
    useWhen: 'A longer article or project document benefits from a quiet title that remains available while the reader scrolls.',
    avoidWhen: 'Headers that chase scroll direction, repeatedly hide controls, or occupy too much of a small screen.',
    principle: 'Let the browser own scrolling and stickiness. Keep the compact title supplementary and ordinary scrolling immediate.',
    duration: '180 ms title arrival on Replay · native scrolling is immediate', trigger: 'Scroll the article or continue reading',
    color: 'peach', tags: ['sticky', 'header', 'scroll', 'title', 'document', 'orientation', 'ghost'], collections: ['landing-pages', 'storytelling'],
    reducedMotion: 'The compact title appears without travel as the article scrolls; the browser’s native sticky behavior is unchanged.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell sticky-shell"><div class="sticky-pane" tabindex="0" aria-label="Demo scrolling article"><header class="sticky-bar"><span class="sticky-brand">Fieldwork</span><span class="sticky-small-title">Space to think</span></header><article class="sticky-article"><p class="wf-kicker">A NOTE ON MAKING THINGS</p><h2>Space<br>to think.</h2><p>A clear page starts with a little room around the important things.</p><button class="wf-button quiet sticky-jump" type="button">Continue reading ↓</button><h3>Leave the edges quiet.</h3><p>When everything asks for attention, nothing feels clear. Give the ideas enough room to stand on their own.</p><h3>Keep the useful parts close.</h3><p>A small, steady title can remind you where you are without getting in the way.</p></article></div></section></main>`,
    css: String.raw`
.sticky-shell { padding: 0; overflow: hidden; }
.sticky-pane { height: 198px; overflow: auto; scrollbar-width: thin; scrollbar-color: var(--muted) var(--paper); }
.sticky-pane:focus-visible { outline-offset: -4px; }
.sticky-bar { position: sticky; z-index: 1; top: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 38px; padding: 8px 14px; background: var(--paper); box-shadow: 0 3px 8px var(--shadow); }
.sticky-brand { font-size: 11px; font-weight: 700; color: var(--accent-ink); }
.sticky-small-title { color: var(--muted); font-size: 10px; opacity: 0; }
.sticky-bar[data-reading="true"] .sticky-small-title { opacity: 1; }
.sticky-article { padding: 15px 20px 24px; }
.sticky-article h2 { margin: 5px 0 9px; font-size: 28px; line-height: .98; font-weight: 600; letter-spacing: -.04em; }
.sticky-article h3 { margin-top: 18px; font-size: 13px; }
.sticky-article p:not(.wf-kicker) { margin-top: 7px; color: var(--muted); font-size: 11px; line-height: 1.6; }
.sticky-jump { margin-top: 7px; padding-left: 0; }
@media (min-height: 300px) { .sticky-pane { height: 324px; } .sticky-bar { min-height: 45px; padding: 10px 20px; } .sticky-brand, .sticky-small-title { font-size: 12px; } .sticky-article { padding: 25px 32px 36px; } .sticky-article h2 { font-size: 44px; } .sticky-article p:not(.wf-kicker) { font-size: 14px; } .sticky-article h3 { font-size: 16px; } }
`,
    js: String.raw`
const pane = document.querySelector('.sticky-pane'), header = document.querySelector('.sticky-bar'), title = document.querySelector('.sticky-small-title'), heading = document.querySelector('.sticky-article h2');
function boundary() { return Math.max(0, pane.scrollTop + heading.getBoundingClientRect().bottom - header.getBoundingClientRect().bottom); }
function update() { header.dataset.reading = String(heading.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom + .5); }
function continueReading() { wfStop(); pane.scrollTop = boundary() + 1; update(); }
pane.addEventListener('scroll', update, { passive: true });
document.querySelector('.sticky-jump').addEventListener('click', continueReading);
const observer = new ResizeObserver(update); [pane, header, heading].forEach(element => observer.observe(element));
Demo.onReplay(() => { continueReading(); wfAnimate(title, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], 180); });
Demo.onCleanup(() => { pane.removeEventListener('scroll', update); observer.disconnect(); });
update();
`,
  }),
  study({
    id: 'data-sort', title: 'Keep track of the row', category: 'layout',
    description: 'A small table sorts real rows while Replay shows how measured movement can preserve each row’s identity.',
    purpose: 'Spatial consistency',
    useWhen: 'An occasional reorder needs explanation, such as a teaching example or a user-requested priority arrangement.',
    avoidWhen: 'Frequently sorted or live tables. Ordinary sorting is immediate here, and data values never animate or change for the effect.',
    principle: 'Sort the real DOM first and make data available immediately; use measured transforms only when the motion is explicitly requested.',
    duration: '240 ms on Replay · header sorting is immediate', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Sort by Name or Tasks; Replay studies row continuity',
    color: 'green', tags: ['table', 'sort', 'FLIP', 'data', 'rows', 'reorder', 'ghost'], collections: ['dashboards', 'product-ui'],
    reducedMotion: 'Rows move directly into their sorted order, with accurate column sort semantics and unchanged data.',
    html: `<main class="stage workflow-stage"><section class="wf-shell sort-shell"><table class="sort-table"><caption>Weekly contributors · demo data</caption><thead><tr><th scope="col" aria-sort="ascending"><button type="button" data-sort="name">Name <span aria-hidden="true">↕</span></button></th><th scope="col" aria-sort="none"><button type="button" data-sort="tasks">Tasks <span aria-hidden="true">↕</span></button></th></tr></thead><tbody><tr data-name="Alex" data-tasks="34"><th scope="row"><span class="sort-avatar">A</span> Alex</th><td>34</td></tr><tr data-name="June" data-tasks="56"><th scope="row"><span class="sort-avatar">J</span> June</th><td>56</td></tr><tr data-name="Mira" data-tasks="21"><th scope="row"><span class="sort-avatar">M</span> Mira</th><td>21</td></tr></tbody></table></section><p class="wf-caption sort-status" role="status">Name · ascending</p></main>`,
    css: String.raw`
.sort-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.sort-table caption { padding: 0 0 3px; color: var(--muted); font-size: 10px; text-align: left; }
.sort-table thead th { padding: 0; border-bottom: 1px solid var(--line); }
.sort-table thead button { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: 44px; padding: 7px; border: 0; border-radius: 5px; background: transparent; color: var(--muted); font-size: 10px; text-align: left; }
.sort-table thead th[aria-sort="ascending"] button, .sort-table thead th[aria-sort="descending"] button { color: var(--ink); font-weight: 600; }
.sort-table tbody th, .sort-table tbody td { height: 31px; padding: 4px 7px; font-weight: 500; }
.sort-table tbody th { text-align: left; }
.sort-table td { text-align: right; font-variant-numeric: tabular-nums; }
.sort-avatar { display: inline-grid; place-items: center; width: 20px; height: 20px; margin-right: 5px; border-radius: 6px; background: var(--accent-soft); color: var(--accent-ink); font-size: 10px; }
@media (hover: hover) and (pointer: fine) { .sort-table thead button:hover { color: var(--ink); background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } }
@media (min-height: 300px) { .sort-table { font-size: 14px; } .sort-table caption, .sort-table thead button { font-size: 12px; } .sort-table tbody th, .sort-table tbody td { height: 49px; padding: 7px 10px; } .sort-avatar { width: 30px; height: 30px; font-size: 12px; margin-right: 9px; } }
`,
    js: String.raw`
const body = document.querySelector('.sort-table tbody'), rows = [...body.querySelectorAll('tr')], buttons = [...document.querySelectorAll('[data-sort]')];
let column = 'name', ascending = true;
function sort(key, direction, animate = false) {
  const first = wfMeasure(rows); wfStop(); column = key; ascending = direction;
  const ordered = [...rows].sort((a, b) => (key === 'name' ? a.dataset.name.localeCompare(b.dataset.name) : Number(a.dataset.tasks) - Number(b.dataset.tasks)) * (ascending ? 1 : -1));
  ordered.forEach(row => body.append(row));
  buttons.forEach(button => button.parentElement.setAttribute('aria-sort', button.dataset.sort === column ? ascending ? 'ascending' : 'descending' : 'none'));
  document.querySelector('.sort-status').textContent = (key === 'name' ? 'Name' : 'Tasks') + ' · ' + (ascending ? 'ascending' : 'descending');
  if (animate) wfFlip(first, rows);
}
buttons.forEach(button => button.addEventListener('click', () => sort(button.dataset.sort, button.dataset.sort === column ? !ascending : button.dataset.sort === 'name')));
Demo.onReplay(() => { sort('name', true); sort('tasks', false, true); });
`,
  }),
  study({
    id: 'table-row-expand', title: 'The detail behind a row', category: 'layout',
    description: 'A real table row opens its supporting detail while the following record keeps a visible relationship to its new position.',
    purpose: 'Spatial consistency',
    useWhen: 'A short order or project table occasionally reveals supporting information without navigating to another page.',
    avoidWhen: 'Large virtualized tables, multiple complex disclosures, or live rows that would move beneath the reader. Use a maintained table primitive there.',
    principle: 'Keep row and header semantics intact, make disclosure explicit, and animate the measured position of neighboring rows rather than table height.',
    duration: '200 ms', easing: 'Position: shared ease-in-out · detail: shared ease-out', trigger: 'Open or close either record',
    color: 'graphite', tags: ['table', 'row', 'disclosure', 'details', 'FLIP', 'records', 'ghost'], collections: ['dashboards', 'product-ui'],
    reducedMotion: 'Detail rows and disclosure labels change immediately, with the real table structure preserved.',
    html: `<main class="stage workflow-stage"><section class="wf-shell row-detail-shell"><table class="detail-table"><caption>Project estimates · demo data</caption><thead><tr><th scope="col">Work</th><th scope="col">Hours</th></tr></thead><tbody><tr class="detail-summary"><th scope="row"><button type="button" data-record="0" aria-expanded="false" aria-controls="record-brand"><span class="row-chevron" aria-hidden="true">›</span> Brand direction</button></th><td>12</td></tr><tr id="record-brand" class="detail-record" hidden><td colspan="2"><div>Two visual directions, a palette, and a compact reference guide.</div></td></tr><tr class="detail-summary"><th scope="row"><button type="button" data-record="1" aria-expanded="false" aria-controls="record-web"><span class="row-chevron" aria-hidden="true">›</span> Web foundations</button></th><td>18</td></tr><tr id="record-web" class="detail-record" hidden><td colspan="2"><div>Responsive type, reusable spacing, and three core page layouts.</div></td></tr></tbody></table></section></main>`,
    css: String.raw`
.detail-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.detail-table caption { padding-bottom: 8px; color: var(--muted); font-size: 10px; text-align: left; }
.detail-table thead th { padding: 0 6px 5px; color: var(--muted); font-size: 10px; font-weight: 500; text-align: left; }
.detail-table thead th:last-child { text-align: right; }
.detail-summary th { padding: 0; text-align: left; }
.detail-summary button { display: flex; align-items: center; gap: 7px; width: 100%; min-height: 44px; padding: 7px 6px; border: 0; border-radius: 6px; background: transparent; color: var(--ink); font-size: 11px; font-weight: 550; text-align: left; }
.detail-summary td { padding: 6px; font-variant-numeric: tabular-nums; text-align: right; }
.row-chevron { display: inline-block; width: 8px; color: var(--accent-ink); font-size: 17px; }
.detail-summary button[aria-expanded="true"] .row-chevron { transform: rotate(90deg); }
.detail-record td { padding: 0; }
.detail-record div { padding: 8px 10px; border-radius: 7px; background: var(--accent-soft); color: var(--accent-ink); font-size: 10px; line-height: 1.5; }
@media (hover: hover) and (pointer: fine) { .detail-summary button:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } }
@media (min-height: 300px) { .detail-table { font-size: 14px; } .detail-table caption, .detail-table thead th { font-size: 12px; } .detail-summary button { min-height: 55px; font-size: 14px; } .detail-record div { padding: 15px; font-size: 12px; } }
`,
    js: String.raw`
const summaries = [...document.querySelectorAll('.detail-summary')], records = [...document.querySelectorAll('.detail-record')], buttons = [...document.querySelectorAll('[data-record]')];
let opened = -1;
function disclose(index, animate = true) {
  const first = wfMeasure(summaries); wfStop(); opened = index;
  records.forEach((record, position) => { record.hidden = position !== index; buttons[position].setAttribute('aria-expanded', String(position === index)); });
  if (animate) { wfFlip(first, summaries, 200); if (index >= 0) wfAnimate(records[index].querySelector('div'), [{ opacity: 0 }, { opacity: 1 }], 160); }
}
buttons.forEach((button, index) => button.addEventListener('click', () => disclose(opened === index ? -1 : index)));
Demo.onReplay(() => { disclose(-1, false); disclose(0); });
`,
  }),
  study({
    id: 'density-switch', title: 'The same list, less space', category: 'layout',
    description: 'A density preference changes real row spacing while measured movement keeps the names and values connected.',
    purpose: 'Spatial consistency',
    useWhen: 'An occasional display preference switches a small workspace between comfortable and compact row spacing.',
    avoidWhen: 'Live data, a large virtualized list, or automatic density changes while someone reads. Keep those layout updates immediate.',
    principle: 'Change the actual layout once, then connect the old and new row positions with short transforms.',
    duration: '200 ms', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Choose Comfortable or Compact',
    color: 'blue', tags: ['density', 'compact', 'comfortable', 'list', 'layout', 'preference', 'outline', 'solid'], collections: ['dashboards', 'product-ui'],
    reducedMotion: 'Row spacing and the selected density change immediately; names and values remain readable.',
    html: `<main class="stage workflow-stage"><section class="wf-shell density-shell" data-density="comfortable"><div class="density-controls" role="group" aria-label="List density"><button type="button" data-density="comfortable" aria-pressed="true">Comfortable</button><button type="button" data-density="compact" aria-pressed="false">Compact</button></div><ul class="density-list" aria-label="Demo projects"><li><span class="density-dot" aria-hidden="true"></span><span>Studio site<small>Design review</small></span><strong>08</strong></li><li><span class="density-dot" aria-hidden="true"></span><span>Field notes<small>Content ready</small></span><strong>12</strong></li><li><span class="density-dot" aria-hidden="true"></span><span>Pattern book<small>In progress</small></span><strong>06</strong></li></ul></section><p class="wf-caption">The information stays. The spacing changes.</p></main>`,
    css: String.raw`
.density-shell { padding: 10px 12px; }
.density-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 6px; }
.density-controls button { min-height: 44px; padding: 5.5px; border: 1.5px solid var(--ink); border-radius: 8px; background: var(--paper); color: var(--ink); font-size: 11px; }
.density-controls button[aria-pressed="true"] { background: var(--ink); color: var(--on-ink); font-weight: 600; }
.density-list { display: grid; gap: 2px; min-height: 108px; align-content: start; margin: 0; padding: 0; list-style: none; }
.density-list li { display: flex; align-items: center; gap: 9px; min-height: 35px; padding: 3px 7px; border-radius: 6px; color: var(--ink); font-size: 11px; line-height: 1.25; }
.density-list small { display: block; margin-top: 2px; color: var(--muted); font-size: 9px; }
.density-list strong { margin-left: auto; font-size: 11px; font-weight: 500; font-variant-numeric: tabular-nums; }
.density-dot { width: 8px; height: 8px; border-radius: 3px; background: var(--accent); flex: none; }
.density-shell[data-density="compact"] .density-list li { min-height: 27px; padding-block: 5px; }
.density-shell[data-density="compact"] .density-list small { display: none; }
@media (hover: hover) and (pointer: fine) { .density-controls button[aria-pressed="false"]:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } .density-controls button[aria-pressed="true"]:hover { background: color-mix(in srgb, var(--ink) 92%, var(--paper)); color: var(--on-ink); } }
@media (min-height: 300px) { .density-shell { padding: 18px; } .density-controls { margin-bottom: 12px; } .density-controls button, .density-list li, .density-list strong { font-size: 13px; } .density-list { min-height: 165px; gap: 4px; } .density-list li { min-height: 52px; padding: 7px 10px; } .density-list small { font-size: 11px; } .density-shell[data-density="compact"] .density-list li { min-height: 34px; } }
`,
    js: String.raw`
const shell = document.querySelector('.density-shell'), rows = [...document.querySelectorAll('.density-list li')], choices = [...document.querySelectorAll('.density-controls button')];
function setDensity(value, animate = true) {
  const first = wfMeasure(rows); wfStop(); shell.dataset.density = value;
  choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.density === value)));
  if (animate) wfFlip(first, rows, 200);
}
choices.forEach(button => button.addEventListener('click', () => setDensity(button.dataset.density)));
Demo.onReplay(() => { setDensity('comfortable', false); setDensity('compact'); });
`,
  }),
  study({
    id: 'list-grid-morph', title: 'A collection, two views', category: 'layout',
    description: 'The same asset cards move between a compact list and a visual grid without replacing their DOM identity.',
    purpose: 'Spatial consistency',
    useWhen: 'An occasional view preference switches a small collection between scanning names and recognizing visual assets.',
    avoidWhen: 'Hundreds of records, frequent view switching, or a layout morph that would obscure active reading or editing.',
    principle: 'Update the native card surfaces immediately, then move the actual artwork and labels above them without scaling or clipping. Separate columns before joining a grid row, and separate rows before joining a list column; sample live positions when the choice changes mid-flight.',
    duration: '240 ms', easing: 'Two phases: shared ease-in-out · surfaces: shared ease-out', trigger: 'Choose List or Grid',
    color: 'lavender', tags: ['list', 'grid', 'morph', 'FLIP', 'view', 'assets', 'outline', 'solid'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The existing asset cards change directly to their new list or grid arrangement.',
    html: `<main class="stage workflow-stage"><section class="wf-shell view-shell" data-view="grid"><div class="wf-top"><span class="wf-kicker">THREE GOOD PIECES</span><div class="view-controls" role="group" aria-label="Asset view"><button type="button" data-view="list" aria-pressed="false">List</button><button type="button" data-view="grid" aria-pressed="true">Grid</button></div></div><ul class="asset-views" aria-label="Demo assets"><li><span class="asset-view-surface" aria-hidden="true"></span><span class="asset-view-art" aria-hidden="true">${recipeIcon('diamond', 26)}</span><span class="asset-view-copy"><strong>Mark</strong><small>Brand</small></span></li><li><span class="asset-view-surface" aria-hidden="true"></span><span class="asset-view-art" aria-hidden="true">${recipeIcon('half-circle', 26)}</span><span class="asset-view-copy"><strong>Cover</strong><small>Image</small></span></li><li><span class="asset-view-surface" aria-hidden="true"></span><span class="asset-view-art" aria-hidden="true">${recipeIcon('code', 26)}</span><span class="asset-view-copy"><strong>Type</strong><small>System</small></span></li></ul></section><p class="wf-caption">New arrangement. The same three objects.</p></main>`,
    css: String.raw`
.view-controls { display: flex; gap: 3px; }
.view-controls button { min-width: 44px; min-height: 44px; padding: 5.5px; border: 1.5px solid var(--ink); border-radius: 8px; background: var(--paper); color: var(--ink); font-size: 10px; }
.view-controls button[aria-pressed="true"] { background: var(--ink); color: var(--on-ink); }
@media (hover: hover) and (pointer: fine) { .view-controls button[aria-pressed="false"]:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } .view-controls button[aria-pressed="true"]:hover { background: color-mix(in srgb, var(--ink) 92%, var(--paper)); color: var(--on-ink); } }
.asset-views { position: relative; isolation: isolate; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; min-height: 103px; margin: 8px 0 0; padding: 0; list-style: none; }
.asset-views li { position: relative; display: flex; align-items: center; justify-content: center; gap: 6px; min-width: 0; min-height: 103px; padding: 8px; border-radius: 9px; }
.asset-view-surface { position: absolute; inset: 0; z-index: 0; border-radius: inherit; background: var(--accent-soft); }
.asset-view-art, .asset-views strong, .asset-views small { position: relative; z-index: 1; }
.asset-view-art { display: block; flex: none; width: 22px; height: 22px; color: var(--accent-ink); }
.asset-view-art svg { display: block; width: 100%; height: 100%; }
.asset-view-copy { display: grid; flex: none; width: max-content; gap: 2px; white-space: nowrap; }
.asset-views strong { font-size: 11px; font-weight: 600; line-height: 1.25; }
.asset-views small { color: var(--muted); font-size: 9px; line-height: 1.25; }
.view-shell[data-view="list"] .asset-views { grid-template-columns: 1fr; gap: 5px; }
.view-shell[data-view="list"] .asset-views li { justify-content: flex-start; min-height: 31px; padding: 2px 9px; }
@media (min-height: 300px) { .asset-views { min-height: 176px; gap: 10px; margin-top: 16px; } .asset-views li { min-height: 176px; gap: 10px; } .asset-view-art { width: 36px; height: 36px; } .asset-view-copy { gap: 3px; } .asset-views strong { font-size: 15px; } .asset-views small { font-size: 11px; } .view-shell[data-view="list"] .asset-views li { min-height: 54px; padding: 9px 14px; } .view-controls button { font-size: 12px; } }
`,
    js: String.raw`
const shell = document.querySelector('.view-shell'), foreground = [...document.querySelectorAll('.asset-view-art, .asset-views strong, .asset-views small')], surfaces = [...document.querySelectorAll('.asset-view-surface')], controls = [...document.querySelectorAll('.view-controls button')];
function choose(view, animate = true) {
  if (animate && shell.dataset.view === view) return;
  const first = wfMeasure(foreground), opacity = surfaces.map(surface => getComputedStyle(surface).opacity);
  const interrupted = foreground.some(element => element.getAnimations().some(animation => animation.playState === 'running' || animation.playState === 'paused'));
  wfStop(); shell.dataset.view = view;
  controls.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  if (!animate || Demo.duration(1) === 0 || Demo.paused) return;
  const last = wfMeasure(foreground);
  // All nine real content nodes share one layer above every native card surface.
  // Separate the destination columns (grid) or rows (list) before converging on
  // the other axis, keeping each unscaled label and artwork clear of its neighbors.
  foreground.forEach(element => {
    const before = first.get(element), after = last.get(element);
    const x = before.left - after.left, y = before.top - after.top;
    const corner = view === 'grid' ? 'translate(0,' + y + 'px)' : 'translate(' + x + 'px,0)';
    // The master timeline only schedules the two phases; each movement uses the shared custom curve.
    wfAnimate(element, [{ transform: 'translate(' + x + 'px,' + y + 'px)', offset: 0, easing: wfMove }, { transform: corner, offset: .5, easing: wfMove }, { transform: 'translate(0,0)', offset: 1 }], 240, 'linear');
  });
  surfaces.forEach((surface, index) => wfAnimate(surface, [{ opacity: interrupted ? opacity[index] : .45 }, { opacity: 1 }], 140));
}
controls.forEach(button => button.addEventListener('click', () => choose(button.dataset.view)));
Demo.onReplay(() => { choose('list', false); choose('grid'); });
`,
  }),
  study({
    id: 'metric-drilldown', title: 'From the total to its parts', category: 'layout',
    description: 'A headline metric keeps its identity as it makes room for the three sources that explain the total.',
    purpose: 'Spatial consistency',
    useWhen: 'An occasional explanatory dashboard view connects a summary figure to a short, accurate breakdown.',
    avoidWhen: 'Frequently changing metrics, financial trading views, or animations that invent intermediate data. The total and values here remain exact.',
    principle: 'Keep the number stable and reveal the relationship between the total and its parts, with a clear route back.',
    duration: '200 ms', easing: 'Position: shared ease-in-out · breakdown: shared ease-out', trigger: 'Explore sources or return to the overview',
    color: 'green', tags: ['metric', 'drilldown', 'breakdown', 'dashboard', 'data', 'explanation', 'outline'], collections: ['dashboards', 'storytelling'],
    reducedMotion: 'The metric takes its compact position and the exact source values appear immediately.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell metric-shell" data-expanded="false"><div class="wf-top"><span class="wf-kicker">WEEKLY VISITS · DEMO</span><button class="metric-toggle wf-button" type="button" aria-expanded="false" aria-controls="metric-sources">Explore sources</button></div><div class="metric-overview"><strong class="metric-total">1,280</strong><span class="metric-summary wf-copy">Three paths to your work.</span></div><ul id="metric-sources" class="metric-sources" hidden><li><span>Direct</span><span class="metric-track"><i style="transform:scaleX(.594)"></i></span><strong>760</strong></li><li><span>Search</span><span class="metric-track"><i style="transform:scaleX(.25)"></i></span><strong>320</strong></li><li><span>Referral</span><span class="metric-track"><i style="transform:scaleX(.156)"></i></span><strong>200</strong></li></ul></section><p class="wf-caption">A total with a story you can inspect.</p></main>`,
    css: String.raw`
.metric-shell { min-height: 180px; }
.metric-toggle { padding-inline: 5.5px; font-size: 10px; }
.metric-overview { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 112px; }
.metric-total { display: block; font-size: 43px; font-weight: 550; line-height: 1; letter-spacing: -.045em; font-variant-numeric: tabular-nums; }
.metric-shell[data-expanded="true"] .metric-overview { align-items: flex-start; justify-content: flex-start; min-height: 0; padding: 2px 0 8px; }
.metric-shell[data-expanded="true"] .metric-total { font-size: 28px; }
.metric-shell[data-expanded="true"] .metric-summary { display: none; }
.metric-sources { display: grid; gap: 6px; margin: 0; padding: 0; list-style: none; }
.metric-sources li { display: grid; grid-template-columns: 45px 1fr 28px; align-items: center; gap: 9px; font-size: 10px; }
.metric-sources strong { font-size: 10px; font-weight: 500; text-align: right; font-variant-numeric: tabular-nums; }
.metric-track { height: 5px; overflow: hidden; border-radius: 3px; background: var(--accent-soft); }
.metric-track i { display: block; width: 100%; height: 100%; transform-origin: left; border-radius: 3px; background: var(--accent); }
@media (min-height: 300px) { .metric-shell { min-height: 262px; } .metric-overview { min-height: 172px; } .metric-total { font-size: 68px; } .metric-shell[data-expanded="true"] .metric-total { font-size: 39px; } .metric-shell[data-expanded="true"] .metric-overview { padding-bottom: 20px; } .metric-sources { gap: 13px; } .metric-sources li { grid-template-columns: 60px 1fr 40px; font-size: 13px; } .metric-sources strong { font-size: 13px; } .metric-toggle { font-size: 12px; } }
`,
    js: String.raw`
const shell = document.querySelector('.metric-shell'), total = document.querySelector('.metric-total'), sources = document.querySelector('.metric-sources'), toggle = document.querySelector('.metric-toggle');
let expanded = false;
function reveal(next, animate = true) {
  const first = wfMeasure([total]); wfStop(); expanded = next;
  shell.dataset.expanded = String(next); sources.hidden = !next;
  toggle.setAttribute('aria-expanded', String(next)); toggle.textContent = next ? 'Overview' : 'Explore sources';
  if (animate) { wfFlip(first, [total], 200, true); if (next) wfAnimate(sources, [{ opacity: 0 }, { opacity: 1 }], 180); }
}
toggle.addEventListener('click', () => reveal(!expanded));
Demo.onReplay(() => { reveal(false, false); reveal(true); });
`,
  }),
  study({
    id: 'chart-tooltip', title: 'The value under the point', category: 'navigation',
    description: 'An anchored data label follows five real chart points, with the same values available through focus and tap.',
    purpose: 'State indication',
    useWhen: 'A small chart needs a legible point inspector that works with mouse, touch, and keyboard input.',
    avoidWhen: 'Treating a functional data tooltip as decoration. Point inspection is immediate; only Replay demonstrates anchor movement.',
    principle: 'Keep the exact value attached to its point, make every point reachable, and avoid trailing movement while someone reads data.',
    duration: '180 ms label movement on Replay · point inspection is immediate', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Hover, focus, or tap a chart point',
    color: 'blue', tags: ['chart', 'tooltip', 'data', 'inspector', 'focus', 'points', 'ghost'], collections: ['dashboards'],
    reducedMotion: 'The data label moves immediately to its selected point and retains the accurate value.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell point-shell"><div class="wf-top"><h2 class="wf-title">A week of visits</h2><span class="wf-kicker">DEMO</span></div><div class="point-chart"><svg viewBox="0 0 260 100" preserveAspectRatio="none" aria-hidden="true"><path d="M20 80H240M20 50H240M20 20H240"/><polyline points="26,67 78,42 130,54 182,20 234,33"/></svg><button class="chart-point" type="button" data-index="0" style="left:10%;top:67%" aria-label="Monday, 42 visits" aria-describedby="point-value"><span></span></button><button class="chart-point" type="button" data-index="1" style="left:30%;top:42%" aria-label="Tuesday, 68 visits"><span></span></button><button class="chart-point" type="button" data-index="2" style="left:50%;top:54%" aria-label="Wednesday, 55 visits"><span></span></button><button class="chart-point" type="button" data-index="3" style="left:70%;top:20%" aria-label="Thursday, 91 visits"><span></span></button><button class="chart-point" type="button" data-index="4" style="left:90%;top:33%" aria-label="Friday, 76 visits"><span></span></button><div id="point-value" class="point-value" role="tooltip">Mon · 42</div></div><div class="point-axis" aria-hidden="true"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div></section><p class="wf-caption">The same data, however you reach it.</p></main>`,
    css: String.raw`
.point-chart { position: relative; height: 102px; margin-top: 15px; }
.point-chart > svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.point-chart path { fill: none; stroke: var(--line); stroke-width: .7; }
.point-chart polyline { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.chart-point { position: absolute; z-index: 1; display: grid; place-items: center; width: 44px; height: 44px; margin-left: -22px; margin-top: -22px; padding: 0; border: 0; border-radius: 50%; background: transparent; }
.chart-point > span { width: 8px; height: 8px; border: 2px solid var(--paper); border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.point-value { position: absolute; z-index: 2; top: 0; left: 0; min-width: 68px; padding: 5px 7px; border: 1px solid var(--line); border-radius: 7px; background: var(--paper); color: var(--ink); font-size: 10px; text-align: center; font-variant-numeric: tabular-nums; pointer-events: none; }
.point-axis { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); color: var(--muted); font-size: 9px; text-align: center; }
@media (min-height: 300px) { .point-chart { height: 180px; margin-top: 30px; } .point-value { min-width: 82px; font-size: 12px; padding: 7px 10px; } .point-axis { font-size: 11px; } .chart-point > span { width: 10px; height: 10px; } }
`,
    js: String.raw`
const chart = document.querySelector('.point-chart'), bubble = document.querySelector('.point-value'), points = [...document.querySelectorAll('.chart-point')];
const values = [['Mon', 42], ['Tue', 68], ['Wed', 55], ['Thu', 91], ['Fri', 76]];
const fine = matchMedia('(hover: hover) and (pointer: fine)');
let selected = 0;
function inspect(index, animate = false) {
  const from = getComputedStyle(bubble).transform; wfStop(); selected = index;
  bubble.textContent = values[index][0] + ' · ' + values[index][1];
  points.forEach((point, position) => { if (position === index) point.setAttribute('aria-describedby', 'point-value'); else point.removeAttribute('aria-describedby'); });
  const point = points[index], width = bubble.offsetWidth;
  const x = Math.max(0, Math.min(chart.clientWidth - width, point.offsetLeft + 22 - width / 2));
  const y = Math.max(-15, point.offsetTop - bubble.offsetHeight - 4);
  const target = 'translate(' + x + 'px,' + y + 'px)'; bubble.style.transform = target;
  if (animate) wfAnimate(bubble, [{ transform: from }, { transform: target }], 180, wfMove);
}
points.forEach((point, index) => { point.addEventListener('focus', () => inspect(index)); point.addEventListener('click', () => inspect(index)); point.addEventListener('pointerenter', event => { if (fine.matches && event.pointerType !== 'touch') inspect(index); }); });
function resize() { inspect(selected); }
window.addEventListener('resize', resize);
Demo.onCleanup(() => window.removeEventListener('resize', resize));
Demo.onReplay(() => { inspect(0); inspect(3, true); });
inspect(0);
`,
  }),
  study({
    id: 'chart-range', title: 'A different window on the data', category: 'layout',
    description: 'Three time ranges show their actual chart values immediately; Replay demonstrates a bounded reveal of the selected series.',
    purpose: 'State indication',
    useWhen: 'A small dashboard lets readers choose the period that answers their question, with an optional explanatory series reveal.',
    avoidWhen: 'Live or financial data, misleading interpolation between unrelated ranges, or delaying a reader who is comparing values.',
    principle: 'Replace the range and its values together, keep the data exact, and reserve the graphical reveal for explicit Replay.',
    duration: '240 ms on Replay · range selection is immediate', trigger: 'Choose Week, Month, or Year; Replay studies the reveal',
    color: 'green', tags: ['chart', 'range', 'time', 'series', 'data', 'dashboard', 'outline', 'ghost'], collections: ['dashboards', 'storytelling'],
    reducedMotion: 'The selected series, its total, and its axis label appear immediately without a reveal.',
    source: 'emil-design-eng/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell range-shell"><div class="wf-top"><div><p class="wf-kicker">VISITS · DEMO</p><h2 class="range-total">420</h2></div><div class="range-choices" role="group" aria-label="Chart range"><button type="button" data-range="week" aria-pressed="true">Week</button><button type="button" data-range="month" aria-pressed="false">Month</button><button type="button" data-range="year" aria-pressed="false">Year</button></div></div><svg class="range-chart" viewBox="0 0 300 108" preserveAspectRatio="none" role="img" aria-labelledby="range-chart-label"><title id="range-chart-label">Week: 420 visits across seven days</title><path class="range-grid" d="M8 24H292M8 60H292M8 96H292"/><g class="range-series"><path class="range-area" d="M8 75L55 59L102 68L149 28L197 43L244 59L292 49V99H8Z"/><path class="range-line" d="M8 75L55 59L102 68L149 28L197 43L244 59L292 49"/></g></svg><div class="range-axis"><span class="range-start">Monday</span><span class="range-scale">Maximum 100</span><span class="range-end">Sunday</span></div></section><p class="wf-caption">The range changes. The values stay honest.</p></main>`,
    css: String.raw`
.range-total { font-size: 25px; font-weight: 600; line-height: 1.1; letter-spacing: -.04em; font-variant-numeric: tabular-nums; }
.range-choices { display: flex; gap: 2px; }
.range-choices button { min-width: 44px; min-height: 44px; padding: 4.5px; border: 1.5px solid transparent; border-radius: 7px; background: transparent; color: var(--muted); font-size: 10px; }
.range-choices button[aria-pressed="true"] { border-color: var(--ink); background: var(--paper); color: var(--ink); font-weight: 600; }
@media (hover: hover) and (pointer: fine) { .range-choices button:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); color: var(--ink); } }
.range-chart { display: block; width: 100%; height: 92px; margin-top: 4px; overflow: visible; }
.range-grid { fill: none; stroke: var(--line); stroke-width: .65; }
.range-area { fill: var(--accent-soft); }
.range-line { fill: none; stroke: var(--accent); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
.range-axis { display: flex; justify-content: space-between; gap: 5px; color: var(--muted); font-size: 9px; }
@media (min-height: 300px) { .range-total { font-size: 39px; } .range-choices button { min-width: 54px; font-size: 12px; } .range-chart { height: 183px; margin-top: 13px; } .range-axis { font-size: 11px; } }
`,
    js: String.raw`
const datasets = {
  week: { label: 'Week', unit: 'days', first: 'Monday', last: 'Sunday', values: [42, 60, 50, 91, 75, 47, 55] },
  month: { label: 'Month', unit: 'weeks', first: 'Week 1', last: 'Week 4', values: [320, 480, 420, 610] },
  year: { label: 'Year', unit: 'months', first: 'January', last: 'December', values: [920, 1120, 980, 1400, 1280, 1530, 1710, 1630, 1900, 2010, 1880, 2240] },
};
const series = document.querySelector('.range-series'), buttons = [...document.querySelectorAll('[data-range]')];
function choose(key, animate = false) {
  wfStop(); const data = datasets[key], total = data.values.reduce((sum, value) => sum + value, 0);
  const maximum = Math.ceil(Math.max(...data.values) / 100) * 100;
  const points = data.values.map((value, index) => (8 + index / (data.values.length - 1) * 284) + ' ' + (96 - value / maximum * 84));
  const path = 'M' + points.join('L');
  document.querySelector('.range-line').setAttribute('d', path); document.querySelector('.range-area').setAttribute('d', path + 'L292 99H8Z');
  document.querySelector('.range-total').textContent = total.toLocaleString('en-US');
  document.querySelector('#range-chart-label').textContent = data.label + ': ' + total + ' visits. ' + data.values.join(', ') + ' across ' + data.unit + '.';
  document.querySelector('.range-start').textContent = data.first; document.querySelector('.range-end').textContent = data.last;
  document.querySelector('.range-scale').textContent = 'Maximum ' + maximum.toLocaleString('en-US');
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.range === key)));
  if (animate) wfAnimate(series, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], 240);
}
buttons.forEach(button => button.addEventListener('click', () => choose(button.dataset.range)));
Demo.onReplay(() => { choose('week'); choose('month', true); });
choose('week');
`,
  }),
  study({
    id: 'timeline-cursor', title: 'A cursor through the story', category: 'navigation',
    description: 'A native timeline scrubber keeps the selected time and chapter visible, with an explicit Replay study of the seek cursor.',
    purpose: 'State indication',
    useWhen: 'A compact media or story editor needs a direct, keyboard-accessible way to inspect a position along a timeline.',
    avoidWhen: 'Adding easing behind a user’s scrub gesture or presenting this illustrative track as a complete media player.',
    principle: 'Track the native range control directly. The chosen time is exact, and only explicit Replay animates the visual seek cue.',
    duration: '200 ms on Replay · scrubbing is direct', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Drag the range control or use its arrow keys',
    color: 'peach', tags: ['timeline', 'scrubber', 'cursor', 'range', 'media', 'chapters', 'native'], collections: ['product-ui', 'storytelling'],
    reducedMotion: 'The seek cue, selected time, and current chapter update immediately with the range control.',
    source: 'apple-design/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell timeline-shell"><div class="wf-top"><div><p class="wf-kicker">A ONE-MINUTE STORY</p><h2 class="wf-title timeline-chapter">Opening</h2></div><output class="timeline-time" for="timeline-range">00:00</output></div><div class="timeline-ruler" aria-hidden="true"><span>0s</span><span>20s</span><span>40s</span><span>60s</span></div><div class="timeline-track" aria-hidden="true"><div class="timeline-clip" data-current="true">Opening</div><div class="timeline-clip">The detail</div><div class="timeline-clip">Finish</div><span class="timeline-cursor"><i></i></span></div><label class="wf-sr" for="timeline-range">Selected time in seconds</label><input id="timeline-range" type="range" min="0" max="60" step="1" value="0" aria-valuetext="0 seconds, Opening" /></section><p class="wf-caption">Native scrubbing. A visible place in the story.</p></main>`,
    css: String.raw`
.timeline-time { min-width: 56px; color: var(--accent-ink); font-size: 22px; font-weight: 550; font-variant-numeric: tabular-nums; letter-spacing: -.035em; text-align: right; }
.timeline-ruler { display: flex; justify-content: space-between; margin: 10px 0 5px; color: var(--muted); font-size: 9px; }
.timeline-track { position: relative; display: grid; grid-template-columns: 1fr 1.4fr .6fr; gap: 4px; height: 44px; margin-bottom: 10px; }
.timeline-clip { display: grid; place-items: center; min-width: 0; padding: 5px; border: 1px solid var(--line); border-radius: 6px; background: var(--demo-bg); color: var(--muted); font-size: 9px; text-align: center; }
.timeline-clip[data-current="true"] { background: var(--accent-soft); color: var(--accent-ink); border-color: var(--accent-ink); }
.timeline-cursor { position: absolute; z-index: 1; top: -5px; left: 0; bottom: -5px; width: 2px; background: var(--ink); pointer-events: none; }
.timeline-cursor i { position: absolute; left: -4px; top: -1px; width: 10px; height: 7px; border-radius: 2px; background: var(--ink); }
@media (min-height: 300px) { .timeline-time { font-size: 32px; } .timeline-ruler { margin-top: 28px; font-size: 11px; } .timeline-track { height: 90px; margin-bottom: 18px; } .timeline-clip { font-size: 12px; } }
`,
    js: String.raw`
const slider = document.querySelector('#timeline-range'), track = document.querySelector('.timeline-track'), cursor = document.querySelector('.timeline-cursor'), clips = [...document.querySelectorAll('.timeline-clip')];
const names = ['Opening', 'The detail', 'Finish'];
function seek(value, animate = false) {
  const from = getComputedStyle(cursor).transform; wfStop();
  const seconds = Math.max(0, Math.min(60, Number(value))), chapter = seconds < 20 ? 0 : seconds < 48 ? 1 : 2;
  slider.value = String(seconds); slider.setAttribute('aria-valuetext', seconds + ' seconds, ' + names[chapter]);
  document.querySelector('.timeline-time').textContent = String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  document.querySelector('.timeline-chapter').textContent = names[chapter];
  clips.forEach((clip, index) => { clip.dataset.current = String(index === chapter); });
  const target = 'translateX(' + (track.clientWidth - 2) * seconds / 60 + 'px)'; cursor.style.transform = target;
  if (animate) wfAnimate(cursor, [{ transform: from }, { transform: target }], 200, wfMove);
}
slider.addEventListener('input', () => seek(slider.value));
function resize() { seek(slider.value); }
window.addEventListener('resize', resize);
Demo.onCleanup(() => window.removeEventListener('resize', resize));
Demo.onReplay(() => { seek(0); seek(43, true); });
seek(0);
`,
  }),
  study({
    id: 'kanban-move', title: 'A task finds its next home', category: 'layout',
    description: 'A selected task moves between two real board columns while its card and neighboring tasks retain their identity.',
    purpose: 'Spatial consistency',
    useWhen: 'An occasional, deliberate status change needs to explain which task moved and where it belongs next.',
    avoidWhen: 'Large collaborative boards or production drag-and-drop. This bounded study uses native selection and move buttons; use a maintained drag primitive if dragging is required.',
    principle: 'Move the real task, keep both column counts accurate, and connect measured positions without blocking the next action.',
    duration: '240 ms', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Select a task, then move it to the other column',
    color: 'sand', tags: ['kanban', 'task', 'board', 'move', 'FLIP', 'status', 'outline', 'solid'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The selected task changes columns immediately, with its counts and move destination updated.',
    html: `<main class="stage workflow-stage"><section class="wf-shell kanban-shell" aria-label="Demo task board"><div class="kanban-columns"><section data-column="Backlog"><h2>Backlog <span class="kanban-count">2</span></h2><ul tabindex="0" aria-label="Backlog tasks"><li data-task="Navigation"><button type="button" aria-pressed="true"><strong>Navigation</strong><span>Interface</span><span class="kanban-selection" aria-hidden="true">${recipeIcon('check', 10)}</span></button></li><li data-task="Type scale"><button type="button" aria-pressed="false"><strong>Type scale</strong><span>Foundation</span><span class="kanban-selection" aria-hidden="true">${recipeIcon('check', 10)}</span></button></li></ul></section><section data-column="Ready"><h2>Ready <span class="kanban-count">1</span></h2><ul tabindex="0" aria-label="Ready tasks"><li data-task="Copy review"><button type="button" aria-pressed="false"><strong>Copy review</strong><span>Content</span><span class="kanban-selection" aria-hidden="true">${recipeIcon('check', 10)}</span></button></li></ul></section></div><div class="kanban-footer"><span class="kanban-status wf-kicker" role="status">Navigation selected</span><button class="kanban-move wf-button solid" type="button">Move to Ready</button></div></section></main>`,
    css: String.raw`
.kanban-shell { padding: 10px; }
.kanban-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.kanban-columns section { min-width: 0; }
.kanban-columns h2 { display: flex; align-items: center; justify-content: space-between; padding: 0 3px; margin-bottom: 6px; color: var(--muted); font-size: 10px; font-weight: 600; }
.kanban-count { font-variant-numeric: tabular-nums; font-weight: 500; }
.kanban-columns ul { display: grid; gap: 5px; align-content: start; height: 96px; overflow: auto; margin: 0; padding: 1px 2px; list-style: none; scrollbar-width: thin; scrollbar-color: var(--muted) var(--paper); }
.kanban-columns ul:focus-visible { outline-offset: -2px; border-radius: 7px; }
.kanban-flight { position: fixed; z-index: 3; margin: 0; list-style: none; pointer-events: none; }
.kanban-columns li { min-width: 0; }
.kanban-columns button { position: relative; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 3px; width: 100%; min-height: 44px; padding: 6.5px 25px 6.5px 7.5px; border: 1.5px solid var(--ink); border-radius: 7px; background: var(--paper); color: var(--ink); text-align: left; }
.kanban-columns button[aria-pressed="true"] { box-shadow: inset 0 0 0 1px var(--ink); }
.kanban-columns strong { font-size: 10px; font-weight: 600; line-height: 1.2; }
.kanban-columns button > span { color: var(--muted); font-size: 9px; line-height: 1.2; }
.kanban-columns button > .kanban-selection { position: absolute; display: grid; place-items: center; right: 7px; top: 7px; width: 14px; height: 14px; border-radius: 50%; background: var(--ink); color: var(--on-ink); opacity: 0; pointer-events: none; }
.kanban-columns button[aria-pressed="true"] > .kanban-selection { opacity: 1; }
.kanban-footer { display: flex; align-items: center; justify-content: space-between; gap: 7px; margin-top: 7px; }
.kanban-status { max-width: 115px; font-size: 9px; }
.kanban-move { flex: none; padding-inline: 7.5px; font-size: 10px; }
@media (hover: hover) and (pointer: fine) { .kanban-columns button:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } }
@media (min-height: 300px) { .kanban-shell { padding: 18px; } .kanban-columns { gap: 17px; } .kanban-columns h2 { font-size: 12px; margin-bottom: 12px; } .kanban-columns ul { height: 156px; gap: 9px; } .kanban-columns button { min-height: 68px; padding: 12.5px 30px 12.5px 12.5px; } .kanban-columns button > .kanban-selection { right: 12px; top: 12px; } .kanban-columns strong { font-size: 13px; } .kanban-columns button > span { font-size: 11px; } .kanban-footer { margin-top: 17px; } .kanban-status { max-width: 180px; font-size: 11px; } .kanban-move { font-size: 12px; } }
`,
    js: String.raw`
const columns = [...document.querySelectorAll('.kanban-columns section')], lists = columns.map(column => column.querySelector('ul')), cards = [...document.querySelectorAll('[data-task]')], move = document.querySelector('.kanban-move');
let selected = cards[0];
const flights = new Map();
let scrollPositions = lists.map(list => list.scrollTop);
function clearFlight(card, snapshot) {
  if (flights.get(card) !== snapshot) return;
  snapshot.remove(); card.style.removeProperty('opacity'); flights.delete(card);
}
function clearFlights() {
  flights.forEach((snapshot, card) => { snapshot.remove(); card.style.removeProperty('opacity'); });
  flights.clear();
}
function revealCard(card) {
  card.getAnimations().forEach(animation => animation.cancel());
  const snapshot = flights.get(card);
  if (!snapshot) return;
  snapshot.getAnimations().forEach(animation => animation.cancel());
  clearFlight(card, snapshot);
}
function refresh(message) {
  cards.forEach(card => {
    const pressed = String(card === selected);
    card.querySelector('button').setAttribute('aria-pressed', pressed);
    flights.get(card)?.querySelector('button')?.setAttribute('aria-pressed', pressed);
  });
  columns.forEach(column => { column.querySelector('.kanban-count').textContent = String(column.querySelectorAll('li').length); });
  const destination = selected.parentElement === lists[0] ? 'Ready' : 'Backlog';
  move.textContent = 'Move to ' + destination; move.setAttribute('aria-label', 'Move ' + selected.dataset.task + ' to ' + destination);
  document.querySelector('.kanban-status').textContent = message || selected.dataset.task + ' selected';
}
function transfer(animate = true) {
  const first = wfMeasure(cards);
  const traveling = new Set([...flights.keys(), selected]);
  flights.forEach((snapshot, card) => first.set(card, snapshot.getBoundingClientRect()));
  wfStop(); clearFlights();
  const destination = selected.parentElement === lists[0] ? 1 : 0; lists[destination].append(selected);
  lists[destination].scrollTop = lists[destination].scrollHeight;
  scrollPositions = lists.map(list => list.scrollTop);
  refresh(selected.dataset.task + ' → ' + columns[destination].dataset.column);
  if (animate) {
    wfFlip(first, cards.filter(card => !traveling.has(card)));
    if (Demo.duration(1) > 0 && !Demo.paused) {
      // At most one inert snapshot per real task bridges the clipped panes.
      // A different task can move before the previous one arrives: both resume
      // from their live visual boxes, while the real DOM and counts stay current.
      for (const card of traveling) {
        const before = first.get(card), after = card.getBoundingClientRect(), snapshot = card.cloneNode(true);
        snapshot.removeAttribute('data-task'); snapshot.dataset.flight = card.dataset.task;
        snapshot.classList.add('kanban-flight'); snapshot.setAttribute('aria-hidden', 'true'); snapshot.inert = true;
        Object.assign(snapshot.style, { left: after.left + 'px', top: after.top + 'px', width: after.width + 'px', height: after.height + 'px' });
        document.querySelector('.kanban-columns').append(snapshot);
        card.style.opacity = '0'; flights.set(card, snapshot);
        const animation = wfAnimate(snapshot, [{ transform: 'translate(' + (before.left - after.left) + 'px,' + (before.top - after.top) + 'px)' }, { transform: 'translate(0,0)' }], 240, wfMove);
        animation.finished.then(() => clearFlight(card, snapshot)).catch(() => clearFlight(card, snapshot));
      }
    }
  }
}
cards.forEach(card => {
  const button = card.querySelector('button');
  button.addEventListener('click', () => { selected = card; refresh(); });
  // Focus must be visible at the real destination, even while playback is paused.
  button.addEventListener('focus', () => revealCard(card));
});
const scrollListeners = lists.map((list, index) => () => {
  if (list.scrollTop === scrollPositions[index]) return;
  // Programmatic destination scrolling was recorded synchronously in transfer.
  // A subsequent native scroll is a new user action, so settle the visual copies.
  scrollPositions = lists.map(element => element.scrollTop); wfStop(); clearFlights();
});
lists.forEach((list, index) => list.addEventListener('scroll', scrollListeners[index], { passive: true }));
move.addEventListener('click', () => transfer());
Demo.onReplay(() => { wfStop(); clearFlights(); lists[0].append(cards[0], cards[1]); lists[1].append(cards[2]); lists.forEach(list => { list.scrollTop = 0; }); selected = cards[0]; refresh(); transfer(); });
Demo.onSettings(() => { if (Demo.reduced) clearFlights(); });
window.addEventListener('resize', clearFlights);
Demo.onCleanup(() => { clearFlights(); window.removeEventListener('resize', clearFlights); lists.forEach((list, index) => list.removeEventListener('scroll', scrollListeners[index])); });
refresh();
`,
  }),
  study({
    id: 'notification-center', title: 'An inbox within reach', category: 'navigation',
    description: 'A small notification center opens from its trigger and lets the reader mark two illustrative messages read or unread.',
    purpose: 'State indication',
    useWhen: 'An occasional message-center disclosure needs a clear origin, a stable unread count, and explicit local triage actions.',
    avoidWhen: 'Production toast delivery, timers, background announcements, or a full notification system. This study contains two fictional messages only.',
    principle: 'Keep disclosure and message state separate, preserve symmetric open/close paths, and make triage immediate.',
    duration: '180 ms open · 160 ms close', trigger: 'Toggle Inbox; mark either message read or unread',
    color: 'lavender', tags: ['notifications', 'inbox', 'disclosure', 'unread', 'message center', 'origin', 'outline', 'ghost'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The center opens or closes immediately. Read states and the unread count remain accurate.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell inbox-shell"><div class="wf-top"><p class="wf-kicker">STUDIO UPDATES</p><button class="wf-button inbox-toggle" type="button" aria-expanded="true" aria-controls="demo-inbox">Inbox <span class="inbox-count">2</span></button></div><section id="demo-inbox" class="inbox-panel" aria-label="Demo inbox"><p class="wf-kicker">TWO RECENT MESSAGES</p><ul><li><button type="button" data-message="Navigation review" aria-label="Mark Navigation review as read" aria-pressed="false"><span class="inbox-dot" aria-hidden="true"></span><span><strong>Navigation review</strong><small>Unread · ready for your eyes</small></span></button></li><li><button type="button" data-message="Type scale approved" aria-label="Mark Type scale approved as read" aria-pressed="false"><span class="inbox-dot" aria-hidden="true"></span><span><strong>Type scale approved</strong><small>Unread · one detail settled</small></span></button></li></ul></section></section></main>`,
    css: String.raw`
.inbox-shell { min-height: 194px; }
.inbox-toggle { min-width: 87px; }
.inbox-count { display: inline-grid; place-items: center; min-width: 17px; min-height: 17px; padding: 2px; border-radius: 5px; background: var(--accent); color: var(--on-accent); font-size: 9px; font-variant-numeric: tabular-nums; }
.inbox-panel { margin-top: 8px; padding-top: 7px; border-top: 1px solid var(--line); transform-origin: right top; }
.inbox-panel > p { font-size: 9px; }
.inbox-panel ul { display: grid; gap: 3px; margin: 3px 0 0; padding: 0; list-style: none; }
.inbox-panel li button { display: flex; align-items: center; gap: 9px; width: 100%; min-height: 44px; padding: 6px; border: 0; border-radius: 7px; background: transparent; color: var(--ink); text-align: left; }
.inbox-panel strong { display: block; font-size: 11px; font-weight: 600; line-height: 1.3; }
.inbox-panel small { display: block; margin-top: 3px; color: var(--muted); font-size: 9px; line-height: 1.3; }
.inbox-dot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.inbox-panel button[aria-pressed="true"] .inbox-dot { background: var(--line); }
@media (hover: hover) and (pointer: fine) { .inbox-panel li button:hover { background: color-mix(in srgb, var(--paper) 92%, var(--ink)); } }
@media (min-height: 300px) { .inbox-shell { min-height: 276px; } .inbox-panel { margin-top: 16px; padding-top: 13px; } .inbox-panel > p { font-size: 11px; } .inbox-panel li button { min-height: 63px; padding: 10px; } .inbox-panel strong { font-size: 14px; } .inbox-panel small { font-size: 11px; } }
`,
    js: String.raw`
const trigger = document.querySelector('.inbox-toggle'), panel = document.querySelector('.inbox-panel'), messages = [...panel.querySelectorAll('button')];
let opened = true, generation = 0;
function disclose(next, animate = true) {
  const wasHidden = panel.hidden, visible = getComputedStyle(panel), from = { opacity: visible.opacity, transform: visible.transform };
  const run = ++generation; wfStop(); opened = next;
  trigger.setAttribute('aria-expanded', String(next)); panel.inert = !next;
  if (!next && panel.contains(document.activeElement)) trigger.focus({ preventScroll: true });
  if (next) {
    panel.hidden = false;
    if (animate) wfAnimate(panel, [wasHidden ? { opacity: 0, transform: 'translateY(-8px) scale(.97)' } : from, { opacity: 1, transform: 'translateY(0) scale(1)' }], 180);
  } else {
    const animation = animate && !wasHidden ? wfAnimate(panel, [from, { opacity: 0, transform: 'translateY(-8px) scale(.97)' }], 160) : null;
    if (animation) animation.finished.then(() => { if (run === generation && !opened) panel.hidden = true; }).catch(() => {});
    else panel.hidden = true;
  }
}
trigger.addEventListener('click', () => disclose(!opened));
messages.forEach(button => button.addEventListener('click', () => {
  const read = button.getAttribute('aria-pressed') !== 'true'; button.setAttribute('aria-pressed', String(read));
  button.setAttribute('aria-label', 'Mark ' + button.dataset.message + ' as ' + (read ? 'unread' : 'read'));
  button.querySelector('small').textContent = read ? 'Read · click to mark unread' : 'Unread · click to mark read';
  document.querySelector('.inbox-count').textContent = String(messages.filter(message => message.getAttribute('aria-pressed') !== 'true').length);
}));
function settle() { generation++; panel.hidden = !opened; }
Demo.onSettings(() => { if (Demo.reduced) settle(); });
window.addEventListener('resize', settle);
Demo.onReplay(() => { disclose(false, false); disclose(true); });
Demo.onCleanup(() => { generation++; window.removeEventListener('resize', settle); });
`,
  }),
  study({
    id: 'split-pane', title: 'Room on either side', category: 'layout',
    description: 'A native range control changes the real proportions of a two-pane workspace, with a separate Replay study of layout continuity.',
    purpose: 'Spatial consistency',
    useWhen: 'A small editor or preview workspace lets people choose how much room to give its navigation and content panes.',
    avoidWhen: 'A production resizable-panel system with nested panes, persistence, or custom drag separators. Use an established primitive for that larger scope.',
    principle: 'Keep pointer and keyboard resizing direct and one-to-one. Replay connects pane origins with translation; text reflows immediately without nonuniform scaling.',
    duration: '220 ms on Replay · native resizing is direct', easing: 'cubic-bezier(0.77, 0, 0.175, 1)', trigger: 'Adjust the navigation-width range control',
    color: 'graphite', tags: ['split pane', 'resize', 'range', 'workspace', 'panels', 'layout', 'native'], collections: ['product-ui', 'dashboards'],
    reducedMotion: 'The pane proportions change immediately; the native range control retains its full keyboard behavior.',
    source: 'apple-design/SKILL.md',
    html: `<main class="stage workflow-stage"><section class="wf-shell split-shell"><div class="wf-top"><span class="wf-kicker">MAKE ROOM FOR YOUR WORK</span><output class="split-value wf-kicker" for="split-range">40%</output></div><div class="split-workspace" style="grid-template-columns:40% minmax(0,1fr)"><aside class="split-navigation" aria-label="Demo workspace files"><strong>Files</strong><ul><li>Notes</li><li>Assets</li><li>Outline</li></ul></aside><section class="split-preview"><span class="split-preview-symbol" aria-hidden="true">${recipeIcon('half-circle', 24)}</span><h2>Outline</h2><p>Plan the next idea.</p></section></div><label class="wf-sr" for="split-range">Navigation width, percent</label><input id="split-range" type="range" min="25" max="65" value="40" step="1" aria-valuetext="Navigation 40 percent" /></section><p class="wf-caption">Drag or use arrow keys. The layout follows.</p></main>`,
    css: String.raw`
.split-shell { padding: 10px 12px; }
.split-workspace { display: grid; min-width: 0; height: 89px; margin: 8px 0 7px; overflow: hidden; border: 1px solid var(--line); border-radius: 9px; }
.split-navigation { min-width: 0; overflow: hidden; padding: 8px; background: var(--accent-soft); color: var(--accent-ink); }
.split-navigation > strong { display: block; margin-bottom: 5px; font-size: 10px; font-weight: 650; line-height: 1.2; }
.split-navigation ul { display: grid; gap: 3px; margin: 0; padding: 0; list-style: none; font-size: 10px; line-height: 1.25; white-space: nowrap; }
.split-navigation li { overflow: hidden; text-overflow: ellipsis; }
.split-preview { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 4px; min-width: 0; overflow: hidden; padding: 8px; background: var(--paper); }
.split-preview-symbol { display: none; color: var(--accent-ink); }
.split-preview h2 { font-size: 12px; font-weight: 600; line-height: 1.25; }
.split-preview p { color: var(--muted); font-size: 9px; line-height: 1.4; }
@media (min-height: 300px) { .split-shell { padding: 18px; } .split-workspace { height: 208px; margin-top: 15px; margin-bottom: 13px; } .split-navigation { padding: 20px 17px; } .split-navigation > strong { font-size: 14px; margin-bottom: 15px; } .split-navigation ul { gap: 11px; font-size: 12px; } .split-preview { gap: 12px; padding: 19px; } .split-preview h2 { font-size: 20px; } .split-preview p { font-size: 12px; } .split-preview-symbol { display: block; } .split-preview-symbol svg { width: 37px; height: 37px; } }
`,
    js: String.raw`
const input = document.querySelector('#split-range'), workspace = document.querySelector('.split-workspace'), panes = [...workspace.children];
function resize(value, animate = false) {
  const first = wfMeasure(panes); wfStop(); const percent = Math.max(25, Math.min(65, Number(value)));
  input.value = String(percent); input.setAttribute('aria-valuetext', 'Navigation ' + percent + ' percent');
  document.querySelector('.split-value').textContent = percent + '%'; workspace.style.gridTemplateColumns = percent + '% minmax(0,1fr)';
  if (animate) wfFlip(first, panes, 220);
}
input.addEventListener('input', () => resize(input.value));
Demo.onReplay(() => { resize(40); resize(62, true); });
`,
  }),
];
