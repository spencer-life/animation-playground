// Original, bounded studies informed by Emil Kowalski's MIT-licensed skills.
// Decorative and explanatory motion belongs to rare, intentional moments.
import { recipeIcon } from '../recipe-icons.mjs';

const shared = String.raw`
.story-stage { gap: 12px; padding: 14px 16px; }
.story-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.story-control { display: inline-flex; align-items: center; justify-content: center; gap: 9px; min-height: 44px; padding: 8.5px 13.5px; border: 1.5px solid var(--ink); border-radius: 10px; color: var(--ink); background: transparent; font-size: 12px; font-weight: 600; }
.story-stage button { user-select: none; -webkit-user-select: none; touch-action: manipulation; transition: scale calc(160ms * var(--time-scale)) var(--ease-out); }
.story-stage button:active { scale: .97; }
:root[data-reduced="true"] .story-stage button:active, :root[data-keyboard="true"] .story-stage button:active { scale: 1; }
.story-note { margin: 0; font-size: 10px; line-height: 1.45; color: var(--muted); text-align: center; }
.story-scroll { scrollbar-width: thin; scrollbar-color: var(--muted) var(--paper); }
.story-scroll:focus-visible { outline-offset: -4px; }
@media (hover: hover) and (pointer: fine) { .story-control:hover { background: color-mix(in srgb, var(--ink) 6%, var(--demo-bg)); } }
@media (min-height: 320px) { .story-stage { gap: 20px; padding: 26px; } .story-note { font-size: 12px; } }
`;

// Embedded in each applicable export, not a dependency on another recipe.
const finite = String.raw`
let animations = [];
function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
function canAnimate() { return !Demo.paused && Demo.duration(1) > 0; }
function motion(element, frames, options) {
  const animation = Demo.animate(element, frames, options);
  animations.push(animation);
  return animation;
}
function wire(play) {
  const replay = document.querySelector('.story-replay');
  replay?.addEventListener('click', () => Demo.replay());
  Demo.onReplay(play);
  Demo.onSettings(() => { if (Demo.reduced) stop(); });
}
Demo.onCleanup(stop);
`;

const control = (label) => `<button class="story-control story-replay" type="button">${label}<span aria-hidden="true">${recipeIcon('replay', 15)}</span></button>`;
const defaults = {
  intent: 'expressive',
  complexity: 'starter',
  added: '2026-10-10',
  source: 'emil-design-eng/SKILL.md',
};
const recipe = (spec) => ({ ...defaults, ...spec, css: shared + spec.css });

const curtainArt = `<svg viewBox="0 0 280 144" role="img" aria-label="An original geometric study of a circle, a diagonal band, and parallel lines"><rect width="280" height="144" fill="var(--paper)"/><circle cx="177" cy="71" r="52" fill="var(--art-1)"/><path d="M-10 122 95 17h52L20 144H-10Z" fill="var(--art-2)"/><path d="M179 23h64M179 35h64M179 47h64M179 59h64M179 71h64M179 83h64M179 95h64M179 107h64M179 119h64" fill="none" stroke="var(--accent-ink)" stroke-width="3"/><circle cx="89" cy="102" r="17" fill="var(--art-3)"/></svg>`;
const apertureArt = `<svg viewBox="0 0 280 160" role="img" aria-label="An original geometric composition of nested frames and a suspended circle"><rect width="280" height="160" fill="var(--paper)"/><path d="M0 0h94v160H0Z" fill="var(--art-1)"/><path d="M184 0h96v160h-96Z" fill="var(--art-3)"/><path d="M38 22h204v116H38Z" fill="none" stroke="var(--accent-ink)" stroke-width="2"/><path d="M56 40h168v80H56Z" fill="none" stroke="var(--accent-ink)" stroke-width="2"/><circle cx="140" cy="80" r="48" fill="var(--art-2)"/><circle cx="140" cy="80" r="24" fill="var(--paper)"/><path d="M140 0v160" stroke="var(--accent-ink)" stroke-width="2"/></svg>`;
const panelArts = [
  '<circle cx="60" cy="54" r="36" fill="var(--art-1)"/><path d="M24 54h72M60 18v72" stroke="var(--accent-ink)" stroke-width="3"/>',
  '<path d="M20 90 60 14l40 76Z" fill="var(--art-2)"/><path d="M39 71 60 32l21 39Z" fill="var(--paper)"/>',
  '<rect x="24" y="18" width="72" height="72" rx="36" fill="none" stroke="var(--art-3)" stroke-width="16"/><path d="M60 14v80" stroke="var(--accent-ink)" stroke-width="3"/>',
];

export default [
  recipe({
    id: 'text-marquee',
    title: 'A passing thought',
    category: 'text',
    description: 'A large typographic strip makes two measured passes, then returns to a readable resting composition.',
    purpose: 'Delight',
    useWhen: 'An optional brand strip or first-view portfolio moment can carry a short, nonessential phrase.',
    avoidWhen: 'Body copy, navigation, required information, repeated page visits, or an endless strip with no pause control.',
    principle: 'Let a short decorative phrase establish rhythm, keep its accessible text still, and bound the number of passes.',
    duration: '4 s per pass · 2 passes',
    easing: 'linear',
    trigger: 'Replay strip',
    tech: 'WAAPI',
    color: 'graphite',
    tags: ['marquee', 'typography', 'loop', 'banner', 'brand', 'finite', 'outline'],
    collections: ['landing-pages', 'signature'],
    reducedMotion: 'The strip stays in its readable starting composition; both passes are skipped.',
    html: `<main class="stage story-stage marquee-stage"><h2 class="story-sr">Form. Motion. Feeling.</h2><div class="marquee-window" aria-hidden="true"><div class="marquee-track">${Array.from({ length: 2 }, () => `<span class="marquee-group"><b>Form.</b><b>Motion.</b><b>Feeling.</b><span class="marquee-symbol">${recipeIcon('spark', 32)}</span></span>`).join('')}</div></div><p class="story-note">A little rhythm. Then room to breathe.</p>${control('Replay strip')}</main>`,
    css: String.raw`
.marquee-stage { gap: 15px; }
.marquee-window { width: min(100%, 540px); padding: 17px 0; overflow: hidden; border-block: 1px solid var(--line); }
.marquee-track { display: flex; width: max-content; }
.marquee-group { display: flex; align-items: center; gap: 22px; padding-right: 22px; white-space: nowrap; }
.marquee-group b { color: var(--ink); font-size: 44px; font-weight: 600; line-height: 1; letter-spacing: -.035em; }
.marquee-group b:nth-child(2) { color: var(--accent-ink); }
.marquee-group b:nth-child(3) { font-weight: 400; }
.marquee-symbol { color: var(--accent-ink); }
@media (min-width: 480px) and (min-height: 320px) { .marquee-window { padding: 28px 0; } .marquee-group b { font-size: 76px; } .marquee-group { gap: 32px; padding-right: 32px; } }
`,
    js: finite + String.raw`
const track = document.querySelector('.marquee-track');
function play() {
  stop();
  if (!canAnimate()) return;
  motion(track, [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: 4000, iterations: 2, easing: 'linear', fill: 'none' });
}
wire(play);
`,
  }),
  recipe({
    id: 'word-highlight',
    title: 'Underline the point',
    category: 'text',
    description: 'A broad marker crosses the important phrase while every word remains available to read.',
    purpose: 'Explanation',
    useWhen: 'A short editorial statement or product explanation has one phrase that deserves emphasis.',
    avoidWhen: 'Long passages, repeated highlights throughout a page, or using movement as the only way to identify important information.',
    principle: 'Animate the emphasis behind the words, not the words themselves; the complete statement never disappears.',
    duration: '600 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Highlight phrase',
    tech: 'WAAPI',
    color: 'sand',
    tags: ['highlight', 'marker', 'editorial', 'text', 'emphasis', 'outline'],
    collections: ['storytelling', 'landing-pages'],
    reducedMotion: 'The phrase is highlighted immediately; the complete statement remains still.',
    html: `<main class="stage story-stage highlight-stage"><h2 class="highlight-heading">Make the<br><mark><span class="highlight-mark" aria-hidden="true"></span>useful parts</mark><br>unforgettable.</h2>${control('Highlight phrase')}</main>`,
    css: String.raw`
.highlight-heading { width: min(100%, 410px); color: var(--ink); font-size: 31px; font-weight: 530; line-height: 1.14; letter-spacing: -.03em; }
.highlight-heading mark { position: relative; isolation: isolate; display: inline-block; color: var(--ink); background: transparent; }
.highlight-mark { position: absolute; z-index: -1; inset: 10% -4px 2%; background: var(--accent-soft); transform: rotate(-1.5deg); transform-origin: left center; }
@media (min-width: 480px) and (min-height: 320px) { .highlight-heading { font-size: 51px; } }
`,
    js: finite + String.raw`
const marker = document.querySelector('.highlight-mark');
function play() {
  stop();
  if (!canAnimate()) return;
  motion(marker, [{ transform: 'rotate(-1.5deg) scaleX(.02)' }, { transform: 'rotate(-1.5deg) scaleX(1)' }], { duration: 600, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}
wire(play);
`,
  }),
  recipe({
    id: 'text-scramble',
    title: 'Find the signal',
    category: 'text',
    description: 'A finite sequence of decorative character strips resolves into a single stable word.',
    purpose: 'Delight',
    useWhen: 'A creative-tech title, launch ident, or occasional brand reveal can use a short decoding metaphor.',
    avoidWhen: 'Passwords, actual processing status, long text, frequently changing values, or content that must be read during the effect.',
    principle: 'Keep the accessible word complete, bound the visual substitutions, and reserve the effect for an optional title.',
    duration: '500 ms + 40 ms stagger · 780 ms total',
    easing: 'steps(3, end)',
    trigger: 'Resolve the word',
    tech: 'WAAPI',
    color: 'graphite',
    tags: ['scramble', 'decode', 'letters', 'text', 'stepped', 'brand', 'outline'],
    collections: ['signature', 'landing-pages'],
    reducedMotion: 'The final word is readable immediately; character substitutions are skipped.',
    html: `<main class="stage story-stage scramble-stage"><h2 class="scramble-heading" aria-label="Resonate"><span class="scramble-word" aria-hidden="true">${[...'RESONATE'].map((letter, index) => `<span class="scramble-cell"><span class="scramble-strip"><i>${'X7Q9M2K4'[index]}</i><i>${'A8R3F6P5'[index]}</i><i>${'N4V2W9B7'[index]}</i><i>${letter}</i></span></span>`).join('')}</span></h2><p class="story-note">From noise to something that stays.</p>${control('Resolve the word')}</main>`,
    css: String.raw`
.scramble-heading { margin: 0; max-width: 100%; color: var(--ink); font-size: 34px; font-weight: 650; letter-spacing: -.025em; line-height: 1.1; }
.scramble-word { display: flex; }
.scramble-cell { display: block; width: .73em; height: 1.1em; overflow: hidden; text-align: center; }
.scramble-strip { display: block; transform: translateY(-75%); }
.scramble-strip i { display: block; height: 1.1em; line-height: 1.1; font-style: normal; }
.scramble-cell:nth-child(3n) { color: var(--accent-ink); }
.scramble-stage .story-note { max-width: 230px; }
@media (min-width: 480px) and (min-height: 320px) { .scramble-heading { font-size: 67px; } }
`,
    js: finite + String.raw`
const strips = [...document.querySelectorAll('.scramble-strip')];
function play() {
  stop();
  if (!canAnimate()) return;
  strips.forEach((strip, index) => motion(strip, [{ transform: 'translateY(0)' }, { transform: 'translateY(-75%)' }], { duration: 500, delay: index * 40, easing: 'steps(3, end)' }));
}
wire(play);
`,
  }),
  recipe({
    id: 'text-wave',
    title: 'A word with a pulse',
    category: 'text',
    description: 'A single wave passes through four letters and leaves them resting on the same baseline.',
    purpose: 'Delight',
    useWhen: 'A playful, optional title gets one brief gesture of personality during a first-view brand moment.',
    avoidWhen: 'Reading text, persistent oscillation, navigation, or repeatedly animating a word whenever someone hovers nearby.',
    principle: 'Send one bounded gesture through the letters, then restore the shared baseline and leave it alone.',
    duration: '600 ms + 60 ms stagger · 780 ms total',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Send a wave',
    tech: 'WAAPI',
    color: 'blue',
    tags: ['wave', 'letters', 'typography', 'stagger', 'finite', 'outline'],
    collections: ['signature', 'storytelling'],
    reducedMotion: 'All four letters remain still on their baseline.',
    html: `<main class="stage story-stage wave-stage"><h2 class="wave-heading" aria-label="Flow"><span aria-hidden="true">${[...'FLOW'].map(letter => `<i>${letter}</i>`).join('')}</span></h2><div class="wave-baseline" aria-hidden="true"></div>${control('Send a wave')}</main>`,
    css: String.raw`
.wave-stage { gap: 15px; }
.wave-heading { width: min(100%, 365px); padding-top: 16px; font-size: 70px; font-weight: 560; line-height: 1; letter-spacing: -.04em; text-align: center; }
.wave-heading > span { display: inline-flex; }
.wave-heading i { display: inline-block; font-style: normal; transform-origin: center 80%; }
.wave-heading i:nth-child(2) { color: var(--accent-ink); }
.wave-baseline { width: min(100%, 256px); height: 2px; background: var(--line); }
@media (min-width: 480px) and (min-height: 320px) { .wave-heading { font-size: 110px; padding-top: 23px; } .wave-baseline { width: 365px; } }
`,
    js: finite + String.raw`
const letters = [...document.querySelectorAll('.wave-heading i')];
function play() {
  stop();
  if (!canAnimate()) return;
  letters.forEach((letter, index) => motion(letter, [{ transform: 'translateY(0)' }, { transform: 'translateY(-18%)', offset: .5 }, { transform: 'translateY(0)' }], { duration: 600, delay: index * 60, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }));
}
wire(play);
`,
  }),
  recipe({
    id: 'image-curtain',
    title: 'Lift the curtains',
    category: 'entrances',
    description: 'Three colored shutters lift in sequence to reveal one uninterrupted graphic underneath.',
    purpose: 'Explanation',
    useWhen: 'A featured portfolio image, campaign artwork, or first-view visual has a deliberate unveiling moment.',
    avoidWhen: 'Image-heavy grids, repeated scroll reveals, functional content, or covering information while someone is already using it.',
    principle: 'Move the covering layers while the artwork stays still, preserving a clear frame and a finite reveal.',
    duration: '600 ms + 60 ms stagger · 720 ms total',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Lift curtains',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['curtain', 'shutter', 'image', 'reveal', 'portfolio', 'stagger', 'outline'],
    collections: ['landing-pages', 'storytelling', 'signature'],
    reducedMotion: 'The full artwork is visible immediately; the covering shutters stay out of view.',
    html: `<main class="stage story-stage curtain-stage"><div class="curtain-frame">${curtainArt}<div class="curtain-shutters" aria-hidden="true"><span></span><span></span><span></span></div></div>${control('Lift curtains')}</main>`,
    css: String.raw`
.curtain-frame { position: relative; width: min(100%, 420px); height: 144px; overflow: hidden; border-radius: 12px; background: var(--paper); }
.curtain-frame > svg { width: 100%; height: 100%; }
.curtain-shutters { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); pointer-events: none; }
.curtain-shutters span { background: var(--art-1); transform: translateY(-101%); }
.curtain-shutters span:nth-child(2) { background: var(--art-2); }
.curtain-shutters span:nth-child(3) { background: var(--art-3); }
@media (min-height: 320px) { .curtain-frame { height: 240px; } }
`,
    js: finite + String.raw`
const shutters = [...document.querySelectorAll('.curtain-shutters span')];
function play() {
  stop();
  if (!canAnimate()) return;
  shutters.forEach((shutter, index) => motion(shutter, [{ transform: 'translateY(0)' }, { transform: 'translateY(-101%)' }], { duration: 600, delay: index * 60, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }));
}
wire(play);
`,
  }),
  recipe({
    id: 'image-zoom-reveal',
    title: 'Settle into the frame',
    category: 'entrances',
    description: 'A gently enlarged artwork settles into its crop while the frame opens around it.',
    purpose: 'Explanation',
    useWhen: 'An occasional campaign image or portfolio cover needs a quiet sense of arrival and framing.',
    avoidWhen: 'Repeated image loading, essential diagrams, rapid gallery navigation, or strong zooms across large portions of the screen.',
    principle: 'Keep the image frame fixed, limit magnification, and coordinate the crop with one restrained arrival.',
    duration: '800 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Reveal the frame',
    tech: 'WAAPI',
    color: 'green',
    tags: ['image', 'zoom', 'crop', 'clip-path', 'reveal', 'portfolio', 'outline'],
    collections: ['landing-pages', 'storytelling'],
    reducedMotion: 'The complete artwork remains at its final crop and scale with no zoom or moving mask.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage story-stage zoom-stage"><div class="zoom-window"><div class="zoom-art">${apertureArt}</div></div>${control('Reveal the frame')}</main>`,
    css: String.raw`
.zoom-window { width: min(100%, 420px); height: 144px; overflow: hidden; border-radius: 12px; background: var(--paper); clip-path: inset(0); }
.zoom-art { height: 100%; transform-origin: 50% 50%; }
.zoom-art svg { width: 100%; height: 100%; }
@media (min-height: 320px) { .zoom-window { height: 240px; } }
`,
    js: finite + String.raw`
const frame = document.querySelector('.zoom-window');
const art = document.querySelector('.zoom-art');
function play() {
  stop();
  if (!canAnimate()) return;
  motion(frame, [{ clipPath: 'inset(10% 16% 10% 16% round 12px)' }, { clipPath: 'inset(0% 0% 0% 0% round 12px)' }], { duration: 800, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  motion(art, [{ transform: 'scale(1.14)' }, { transform: 'scale(1)' }], { duration: 800, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
}
wire(play);
`,
  }),
  recipe({
    id: 'perspective-gallery',
    title: 'A change of perspective',
    category: 'expressive',
    description: 'Three graphic panels trade the central position with a short, reversible turn in depth.',
    purpose: 'Spatial consistency',
    useWhen: 'A small, occasional portfolio selector benefits from a visible relationship between neighboring works.',
    avoidWhen: 'Large carousels, commerce comparison, hidden essential content, or replacing ordinary tab and list navigation with a 3D effect.',
    principle: 'Keep neighboring works visible and controls available; reversible CSS transitions preserve continuity through quick changes.',
    duration: '260 ms',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Select a panel or use Previous and Next',
    tech: 'CSS',
    color: 'lavender',
    tags: ['gallery', 'perspective', '3d', 'portfolio', 'selection', 'outline'],
    collections: ['signature', 'landing-pages'],
    complexity: 'intermediate',
    reducedMotion: 'The selected panel changes immediately; neighboring previews remain visible without turning.',
    html: `<main class="stage story-stage perspective-stage"><div class="perspective-gallery" aria-label="Three graphic studies">${['Arc', 'Peak', 'Loop'].map((name, index) => `<button class="perspective-panel" type="button" data-panel="${index}" data-slot="${index === 0 ? 'center' : index === 1 ? 'right' : 'left'}" aria-label="Show ${name}" aria-pressed="${index === 0}"><svg viewBox="0 0 120 110" aria-hidden="true">${panelArts[index]}</svg><span>${name}</span></button>`).join('')}</div><div class="perspective-controls"><button class="story-control" type="button" data-prev aria-label="Previous graphic">${recipeIcon('undo', 17)}</button><p class="story-note perspective-status" role="status">1 of 3 · Arc</p><button class="story-control" type="button" data-next aria-label="Next graphic">${recipeIcon('arrow', 17)}</button></div></main>`,
    css: String.raw`
.perspective-stage { gap: 7px; }
.perspective-gallery { position: relative; width: min(100%, 330px); height: 147px; perspective: 600px; }
.perspective-panel { position: absolute; left: calc(50% - 56px); top: 3px; width: 112px; height: 134px; padding: 7px 7px 9px; border: 0; border-radius: 12px; background: var(--paper); color: var(--ink); transform-style: preserve-3d; transition: transform calc(260ms * var(--time-scale)) var(--ease-in-out), opacity calc(200ms * var(--time-scale)) var(--ease-out), scale calc(160ms * var(--time-scale)) var(--ease-out) !important; }
.perspective-panel svg { width: 100%; height: 101px; }
.perspective-panel > span { font-size: 11px; font-weight: 600; }
.perspective-panel[data-slot="center"] { z-index: 3; transform: translateX(0) rotateY(0); opacity: 1; }
.perspective-panel[data-slot="left"] { z-index: 1; transform: translateX(-73px) rotateY(35deg) scale(.92); opacity: .75; }
.perspective-panel[data-slot="right"] { z-index: 1; transform: translateX(73px) rotateY(-35deg) scale(.92); opacity: .75; }
.perspective-gallery[data-reset="true"] .perspective-panel, :root[data-reduced="true"] .perspective-panel, :root[data-keyboard="true"] .perspective-panel { transition: none !important; }
.perspective-controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: min(100%, 280px); }
.perspective-controls .story-control { width: 44px; padding: 10px; }
@media (min-width: 480px) and (min-height: 320px) { .perspective-gallery { height: 238px; width: 440px; } .perspective-panel { left: calc(50% - 85px); top: 4px; width: 170px; height: 219px; padding: 12px; } .perspective-panel svg { height: 171px; } .perspective-panel > span { font-size: 14px; } .perspective-panel[data-slot="left"] { transform: translateX(-116px) rotateY(35deg) scale(.92); } .perspective-panel[data-slot="right"] { transform: translateX(116px) rotateY(-35deg) scale(.92); } }
`,
    js: String.raw`
const gallery = document.querySelector('.perspective-gallery');
const panels = [...document.querySelectorAll('.perspective-panel')];
const status = document.querySelector('.perspective-status');
const names = ['Arc', 'Peak', 'Loop'];
let selected = 0;
function select(index) {
  selected = (index + panels.length) % panels.length;
  panels.forEach((panel, position) => {
    const difference = (position - selected + panels.length) % panels.length;
    panel.dataset.slot = difference === 0 ? 'center' : difference === 1 ? 'right' : 'left';
    panel.setAttribute('aria-pressed', String(position === selected));
  });
  status.textContent = (selected + 1) + ' of 3 · ' + names[selected];
}
panels.forEach(panel => panel.addEventListener('click', () => select(Number(panel.dataset.panel))));
document.querySelector('[data-prev]').addEventListener('click', () => select(selected - 1));
document.querySelector('[data-next]').addEventListener('click', () => select(selected + 1));
Demo.onReplay(() => { gallery.dataset.reset = 'true'; select(0); void gallery.offsetWidth; gallery.dataset.reset = 'false'; select(1); });
`,
  }),
  recipe({
    id: 'parallax-layers',
    title: 'Near and far',
    category: 'expressive',
    description: 'Three geometric layers move at different rates as you scroll through a contained scene.',
    purpose: 'Explanation',
    useWhen: 'A small, optional editorial illustration needs to explain depth or a layered construction.',
    avoidWhen: 'Full-screen backgrounds, functional charts, long reading passages, or pointer tracking that competes with native scrolling.',
    principle: 'Let native scrolling remain in charge; apply bounded depth offsets only to the decorative layers.',
    duration: 'Directly follows native scroll',
    easing: 'linear',
    trigger: 'Scroll the scene with touch or wheel; keyboard keeps the scene still',
    tech: 'CSS',
    color: 'blue',
    tags: ['parallax', 'scroll', 'layers', 'depth', 'illustration'],
    collections: ['storytelling', 'landing-pages'],
    complexity: 'intermediate',
    reducedMotion: 'The geometric layers remain still while the native scroll area and reading-position label continue to work.',
    html: `<main class="stage story-stage depth-stage"><div class="depth-scroll story-scroll" tabindex="0" role="region" aria-label="Scroll to compare near and far layers"><div class="depth-document"><div class="depth-scene"><svg viewBox="0 0 280 164" role="img" aria-label="Three original geometric planes, with a distant circle and two closer arches"><rect width="280" height="164" fill="var(--paper)"/><g class="depth-far"><circle cx="190" cy="57" r="33" fill="var(--art-2)"/></g><g class="depth-middle"><path d="M18 180V88a75 75 0 0 1 150 0v92Z" fill="var(--art-1)"/><path d="M51 180V90a42 42 0 0 1 84 0v90Z" fill="var(--paper)"/></g><g class="depth-near"><path d="M127 190v-74a61 61 0 0 1 122 0v74Z" fill="var(--art-3)"/><path d="M158 190v-72a30 30 0 0 1 60 0v72Z" fill="var(--paper)"/></g></svg><span class="depth-hint">Scroll to feel the distance</span></div></div></div><p class="story-note depth-status" aria-live="off">Foreground travels farther · 0%</p></main>`,
    css: String.raw`
.depth-scroll { width: min(100%, 400px); height: 164px; overflow-y: auto; overflow-x: hidden; border-radius: 12px; background: var(--paper); }
.depth-document { height: 360px; }
.depth-scene { position: sticky; top: 0; height: 164px; overflow: hidden; }
.depth-scene svg { width: 100%; height: 100%; }
.depth-hint { position: absolute; left: 12px; bottom: 11px; padding: 4px 7px; border-radius: 5px; background: var(--paper); color: var(--muted); font-size: 9px; }
@media (min-height: 320px) { .depth-scroll, .depth-scene { height: 250px; } .depth-document { height: 530px; } .depth-hint { left: 18px; bottom: 16px; font-size: 11px; } }
`,
    js: String.raw`
const pane = document.querySelector('.depth-scroll');
const far = document.querySelector('.depth-far');
const middle = document.querySelector('.depth-middle');
const near = document.querySelector('.depth-near');
const status = document.querySelector('.depth-status');
function update() {
  const range = pane.scrollHeight - pane.clientHeight;
  const value = range > 0 ? Math.max(0, Math.min(1, pane.scrollTop / range)) : 0;
  status.textContent = 'Foreground travels farther · ' + Math.round(value * 100) + '%';
  if (Demo.paused && !Demo.reduced) return;
  const travel = Demo.reduced || Demo.duration(1) === 0 ? 0 : value;
  far.style.transform = 'translateY(' + (-travel * 5) + 'px)';
  middle.style.transform = 'translateY(' + (-travel * 15) + 'px)';
  near.style.transform = 'translateY(' + (-travel * 32) + 'px)';
}
pane.addEventListener('scroll', update, { passive: true });
pane.addEventListener('keydown', update);
const resize = new ResizeObserver(update);
resize.observe(pane);
Demo.onReplay(() => { pane.scrollTop = 0; update(); });
Demo.onSettings(update);
Demo.onCleanup(() => { resize.disconnect(); pane.removeEventListener('scroll', update); pane.removeEventListener('keydown', update); });
update();
`,
  }),
  recipe({
    id: 'pinned-story',
    title: 'Stay with the story',
    category: 'layout',
    description: 'A small sticky diagram holds its place while three native-scrolling chapters explain its transformation.',
    purpose: 'Explanation',
    useWhen: 'An editorial feature or product explanation benefits from a stable visual beside a short sequence of ideas.',
    avoidWhen: 'Long pinned sections, short mobile screens with no room for text, or intercepting wheel and touch input to advance chapters.',
    principle: 'Keep the explanation in normal document flow; a sticky visual can connect the chapters without taking over scrolling.',
    duration: '240 ms chapter transition',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Scroll through the three chapters',
    tech: 'CSS',
    color: 'green',
    tags: ['sticky', 'pinned', 'story', 'scroll', 'chapters', 'diagram'],
    collections: ['storytelling', 'landing-pages'],
    complexity: 'intermediate',
    reducedMotion: 'Each chapter updates the diagram immediately; the text remains in native scroll flow.',
    html: `<main class="stage story-stage pinned-stage"><div class="pinned-scroll story-scroll" tabindex="0" role="region" aria-label="A three-chapter story about connection"><div class="pinned-layout"><div class="pinned-visual"><div class="pinned-diagram" data-chapter="0" role="img" aria-label="A point becomes a connection, then a small network"><span class="pinned-line"></span><i></i><i></i><i></i></div></div><div class="pinned-chapters"><section><h2>A point.</h2><p>Every idea starts somewhere.</p><span>Scroll to connect it.</span></section><section><h2>A connection.</h2><p>Bring a second point into the picture.</p></section><section><h2>A possibility.</h2><p>One relationship makes room for another.</p></section></div></div></div><p class="story-note pinned-status" aria-live="off">Chapter 1 of 3</p></main>`,
    css: String.raw`
.pinned-scroll { width: min(100%, 430px); height: 169px; overflow-y: auto; overflow-x: hidden; border-radius: 12px; background: var(--paper); }
.pinned-layout { display: grid; grid-template-columns: 42% minmax(0, 1fr); padding: 0 14px 0 8px; }
.pinned-visual { position: sticky; top: 0; height: 169px; display: grid; place-items: center; }
.pinned-diagram { position: relative; width: 90px; height: 90px; }
.pinned-diagram i { position: absolute; top: 31px; left: 31px; width: 28px; height: 28px; border-radius: 50%; background: var(--art-1); transition: transform calc(240ms * var(--time-scale)) var(--ease-in-out), opacity calc(200ms * var(--time-scale)) var(--ease-out); }
.pinned-diagram i:nth-of-type(2) { background: var(--art-2); opacity: 0; }
.pinned-diagram i:nth-of-type(3) { background: var(--art-3); opacity: 0; }
.pinned-line { position: absolute; top: 44px; left: 13px; width: 64px; height: 2px; background: var(--line); transform: scaleX(.1); opacity: 0; transition: transform calc(240ms * var(--time-scale)) var(--ease-in-out), opacity calc(200ms * var(--time-scale)) var(--ease-out); }
.pinned-diagram[data-chapter="1"] i:first-of-type { transform: translateX(-25px); }
.pinned-diagram[data-chapter="1"] i:nth-of-type(2) { transform: translateX(25px); opacity: 1; }
.pinned-diagram[data-chapter="1"] .pinned-line { opacity: 1; transform: scaleX(1); }
.pinned-diagram[data-chapter="2"] i:first-of-type { transform: translate(-25px,17px); }
.pinned-diagram[data-chapter="2"] i:nth-of-type(2) { transform: translate(25px,17px); opacity: 1; }
.pinned-diagram[data-chapter="2"] i:nth-of-type(3) { transform: translate(0,-26px); opacity: 1; }
.pinned-diagram[data-chapter="2"] .pinned-line { opacity: 1; transform: translateY(17px) scaleX(1); }
.pinned-chapters section { display: flex; flex-direction: column; justify-content: center; min-height: 169px; padding: 19px 0; }
.pinned-chapters h2 { font-size: 20px; line-height: 1.12; font-weight: 600; letter-spacing: -.025em; }
.pinned-chapters p { margin-top: 9px; font-size: 11px; line-height: 1.5; color: var(--muted); }
.pinned-chapters section > span { margin-top: 13px; font-size: 9px; color: var(--muted); }
@media (min-height: 320px) { .pinned-scroll, .pinned-visual { height: 265px; } .pinned-chapters section { min-height: 265px; } .pinned-chapters h2 { font-size: 29px; } .pinned-chapters p { font-size: 13px; } .pinned-diagram { scale: 1.25; } .pinned-layout { padding-right: 22px; } }
`,
    js: String.raw`
const pane = document.querySelector('.pinned-scroll');
const diagram = document.querySelector('.pinned-diagram');
const sections = [...document.querySelectorAll('.pinned-chapters section')];
const status = document.querySelector('.pinned-status');
function update() {
  const height = sections[0].offsetHeight;
  const chapter = Math.max(0, Math.min(2, Math.floor((pane.scrollTop + pane.clientHeight * .5) / height)));
  diagram.dataset.chapter = String(chapter);
  status.textContent = 'Chapter ' + (chapter + 1) + ' of 3';
}
pane.addEventListener('scroll', update, { passive: true });
const resize = new ResizeObserver(update);
resize.observe(pane);
Demo.onReplay(() => { pane.scrollTop = 0; update(); });
Demo.onSettings(update);
Demo.onCleanup(() => { resize.disconnect(); pane.removeEventListener('scroll', update); });
update();
`,
  }),
  recipe({
    id: 'scroll-mask',
    title: 'A wider view',
    category: 'expressive',
    description: 'A geometric aperture opens in direct proportion to native scroll, uncovering a complete artwork.',
    purpose: 'Explanation',
    useWhen: 'A short editorial visual uses the move from a narrow crop to a wider view to support its story.',
    avoidWhen: 'Required content, long pinned sections, scrolljacking, or placing reading text inside the moving mask.',
    principle: 'Map a bounded mask directly to native scroll, keep instructions outside it, and reveal the complete artwork in reduced motion.',
    duration: 'Directly follows native scroll',
    easing: 'linear',
    trigger: 'Scroll to open the aperture',
    tech: 'CSS',
    color: 'sand',
    tags: ['scroll', 'mask', 'clip-path', 'aperture', 'artwork'],
    collections: ['storytelling', 'signature'],
    complexity: 'intermediate',
    reducedMotion: 'The full artwork is visible at every scroll position; the native scroll area remains available.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage story-stage mask-stage"><div class="mask-scroll story-scroll" tabindex="0" role="region" aria-label="Scroll to open the artwork frame"><div class="mask-document"><div class="mask-sticky"><div class="mask-art">${apertureArt}</div><span class="mask-label">Scroll for a wider view</span></div></div></div><p class="story-note mask-status" aria-live="off">Reading position · 0%</p></main>`,
    css: String.raw`
.mask-scroll { width: min(100%, 410px); height: 168px; overflow-y: auto; overflow-x: hidden; border-radius: 12px; background: var(--paper); }
.mask-document { height: 360px; }
.mask-sticky { position: sticky; top: 0; height: 168px; overflow: hidden; }
.mask-art { height: 142px; clip-path: inset(0); }
.mask-art svg { width: 100%; height: 100%; }
.mask-label { position: absolute; bottom: 8px; left: 0; width: 100%; color: var(--muted); font-size: 10px; text-align: center; }
@media (min-height: 320px) { .mask-scroll, .mask-sticky { height: 270px; } .mask-document { height: 540px; } .mask-art { height: 238px; } .mask-label { bottom: 11px; font-size: 12px; } }
`,
    js: String.raw`
const pane = document.querySelector('.mask-scroll');
const art = document.querySelector('.mask-art');
const status = document.querySelector('.mask-status');
function update() {
  const range = pane.scrollHeight - pane.clientHeight;
  const value = range > 0 ? Math.max(0, Math.min(1, pane.scrollTop / range)) : 1;
  status.textContent = 'Reading position · ' + Math.round(value * 100) + '%';
  if (Demo.paused && !Demo.reduced) return;
  const inset = Demo.reduced || Demo.duration(1) === 0 ? 0 : (1 - value) * 36;
  art.style.clipPath = 'inset(' + inset * .65 + '% ' + inset + '% round 10px)';
}
pane.addEventListener('scroll', update, { passive: true });
pane.addEventListener('keydown', update);
const resize = new ResizeObserver(update);
resize.observe(pane);
Demo.onReplay(() => { pane.scrollTop = 0; update(); });
Demo.onSettings(update);
Demo.onCleanup(() => { resize.disconnect(); pane.removeEventListener('scroll', update); pane.removeEventListener('keydown', update); });
update();
`,
  }),
  recipe({
    id: 'reveal-on-view',
    title: 'Once, when it matters',
    category: 'entrances',
    description: 'An artwork enters once when it reaches the reading pane, then stays visible on every return.',
    purpose: 'Explanation',
    useWhen: 'A first-view editorial or portfolio illustration deserves a small introduction as it enters view.',
    avoidWhen: 'Functional lists, every section of a marketing page, or repeatedly hiding and replaying content as people scroll back.',
    principle: 'Arm the reveal only while the artwork is outside view, start at the first intersection, and leave completed content visible thereafter.',
    duration: '300 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Scroll the artwork into view; Replay resets the observation',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['intersection-observer', 'scroll', 'reveal', 'once', 'entrance'],
    collections: ['landing-pages', 'storytelling'],
    complexity: 'intermediate',
    reducedMotion: 'The artwork appears fully visible as it enters the native scroll area, with no travel or fade.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage story-stage once-stage"><div class="once-scroll story-scroll" tabindex="0" role="region" aria-label="Scroll to reveal an artwork once"><div class="once-intro"><h2>Good things<br>come into view.</h2><p>Scroll a little. Come back as often as you like.</p></div><figure class="once-target">${curtainArt}<figcaption>Still here when you return.</figcaption></figure><div class="once-after">The reveal happens once per replay.</div></div><p class="story-note once-status" aria-live="off">Waiting for the artwork to enter</p></main>`,
    css: String.raw`
.once-scroll { width: min(100%, 400px); height: 168px; overflow-y: auto; overflow-x: hidden; padding: 0 16px; border-radius: 12px; background: var(--paper); }
.once-intro { display: flex; flex-direction: column; justify-content: center; min-height: 176px; }
.once-intro h2 { font-size: 26px; font-weight: 550; line-height: 1.1; letter-spacing: -.03em; }
.once-intro p { margin-top: 12px; max-width: 190px; font-size: 11px; color: var(--muted); line-height: 1.5; }
.once-target { margin: 0; width: 100%; }
.once-target[data-armed="true"] { opacity: 0; transform: translateY(8px); }
.once-target svg { width: 100%; height: 120px; }
.once-target figcaption { margin-top: 8px; color: var(--ink); font-size: 11px; }
.once-after { min-height: 105px; padding-top: 22px; font-size: 10px; color: var(--muted); }
@media (min-height: 320px) { .once-scroll { height: 270px; padding: 0 24px; } .once-intro { min-height: 283px; } .once-intro h2 { font-size: 38px; } .once-intro p { max-width: 260px; font-size: 13px; } .once-target svg { height: 182px; } .once-target figcaption { font-size: 13px; } .once-after { min-height: 140px; } }
`,
    js: finite + String.raw`
const pane = document.querySelector('.once-scroll');
const target = document.querySelector('.once-target');
const status = document.querySelector('.once-status');
let revealed = false;
function armOutsideView() {
  target.dataset.armed = 'false';
  if (revealed || !canAnimate()) return;
  const frame = pane.getBoundingClientRect();
  const bounds = target.getBoundingClientRect();
  if (bounds.top >= frame.bottom || bounds.bottom <= frame.top) target.dataset.armed = 'true';
}
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.target !== target || !entry.isIntersecting || revealed) continue;
    const animate = target.dataset.armed === 'true' && canAnimate();
    revealed = true;
    target.dataset.armed = 'false';
    status.textContent = 'Revealed once · stays visible';
    observer.unobserve(target);
    if (animate) motion(target, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
}, { root: pane, threshold: [0] });
function reset() {
  stop();
  observer.disconnect();
  revealed = false;
  pane.scrollTop = 0;
  status.textContent = 'Waiting for the artwork to enter';
  armOutsideView();
  observer.observe(target);
}
Demo.onReplay(reset);
Demo.onSettings(() => {
  if (Demo.reduced) stop();
  if (!revealed) {
    armOutsideView();
    observer.disconnect();
    observer.observe(target);
  }
});
Demo.onCleanup(() => observer.disconnect());
reset();
`,
  }),
  recipe({
    id: 'path-follower',
    title: 'Follow the route',
    category: 'expressive',
    description: 'A small directional marker follows a real SVG curve and turns with the route before stopping at its destination.',
    purpose: 'Explanation',
    useWhen: 'A compact onboarding diagram or editorial illustration needs to explain movement along a route.',
    avoidWhen: 'Live navigation, large paths with hundreds of moving objects, or treating the illustration as real tracking data.',
    principle: 'Sample the existing path once, include its direction, and let a finite compositor animation carry the marker.',
    duration: '1,600 ms',
    easing: 'linear',
    trigger: 'Trace the journey',
    tech: 'WAAPI',
    color: 'blue',
    tags: ['svg', 'path', 'follower', 'route', 'motion-path', 'diagram', 'outline'],
    collections: ['storytelling', 'signature'],
    complexity: 'intermediate',
    reducedMotion: 'The marker is placed at the destination immediately; the complete route remains visible.',
    html: `<main class="stage story-stage follower-stage"><svg class="follower-art" viewBox="0 0 280 145" role="img" aria-label="An illustrative route from a starting point on the left to a destination on the right"><path class="follower-guide" d="M22 112C66 112 47 29 105 37S146 131 188 94 212 40 253 43"/><circle cx="22" cy="112" r="5" class="follower-end"/><circle cx="253" cy="43" r="8" class="follower-end"/><g class="follower-marker" transform="translate(253 43)"><circle r="13"/><path d="m-4-4 8 4-8 4"/></g></svg>${control('Trace the journey')}</main>`,
    css: String.raw`
.follower-art { width: min(100%, 420px); height: 145px; overflow: visible; }
.follower-guide { fill: none; stroke: var(--line); stroke-width: 3; stroke-linecap: round; }
.follower-end { fill: var(--paper); stroke: var(--accent-ink); stroke-width: 2; }
.follower-marker { transform-origin: 0 0; }
.follower-marker circle { fill: var(--accent); }
.follower-marker path { fill: none; stroke: var(--on-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
@media (min-height: 320px) { .follower-art { height: 242px; } }
`,
    js: finite + String.raw`
const path = document.querySelector('.follower-guide');
const marker = document.querySelector('.follower-marker');
function play() {
  stop();
  if (!canAnimate()) return;
  const length = path.getTotalLength();
  const frames = Array.from({ length: 81 }, (_, index) => {
    const distance = length * index / 80;
    const point = path.getPointAtLength(distance);
    const before = path.getPointAtLength(Math.max(0, distance - .5));
    const after = path.getPointAtLength(Math.min(length, distance + .5));
    const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
    return { transform: 'translate(' + point.x + 'px,' + point.y + 'px) rotate(' + angle + 'deg)', offset: index / 80 };
  });
  motion(marker, frames, { duration: 1600, easing: 'linear' });
}
wire(play);
`,
  }),
  recipe({
    id: 'orbit-menu',
    title: 'Around the idea',
    category: 'navigation',
    description: 'Three optional destinations expand from a central trigger into a compact radial navigation.',
    purpose: 'Spatial consistency',
    useWhen: 'A playful portfolio or creative microsite has just a few optional sections and an obvious central trigger.',
    avoidWhen: 'Core app navigation, many destinations, keyboard shortcuts, or a menu needing production menu semantics and advanced focus behavior.',
    principle: 'Anchor every destination to the trigger, preserve native buttons, and make collapse immediately remove hidden targets from navigation.',
    duration: '240 ms opening · 180 ms closing',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Open or close the radial navigation; select a destination',
    tech: 'CSS',
    color: 'lavender',
    tags: ['radial', 'orbit', 'navigation', 'menu', 'origin-aware', 'portfolio', 'solid', 'outline'],
    collections: ['signature', 'landing-pages'],
    complexity: 'intermediate',
    reducedMotion: 'Destinations appear and disappear immediately at their fixed positions; focus and selected labels remain available.',
    source: 'animate/RECIPES.md',
    html: `<main class="stage story-stage orbit-nav-stage"><nav class="orbit-navigation" data-open="true" aria-label="Demo creative sections"><svg class="orbit-nav-guide" viewBox="0 0 280 158" aria-hidden="true"><path d="M140 26 68 126h144Z"/></svg><button class="orbit-nav-toggle" type="button" aria-expanded="true" aria-controls="orbit-destinations" aria-label="Close radial navigation">${recipeIcon('close', 21)}</button><div id="orbit-destinations"><button class="orbit-destination" type="button" data-destination="Work" aria-current="page">Work</button><button class="orbit-destination" type="button" data-destination="About">About</button><button class="orbit-destination" type="button" data-destination="Notes">Notes</button></div></nav><p class="story-note orbit-nav-status" role="status">Work selected · demo navigation</p></main>`,
    css: String.raw`
.orbit-nav-stage { gap: 8px; }
.orbit-navigation { position: relative; width: min(100%, 300px); height: 162px; }
.orbit-nav-guide { position: absolute; inset: 0; width: 100%; height: 100%; fill: none; stroke: var(--line); stroke-width: 1.5; }
.orbit-nav-toggle { position: absolute; z-index: 3; left: calc(50% - 26px); top: 62px; display: grid; place-items: center; width: 52px; height: 52px; padding: 0; border: 0; border-radius: 50%; background: var(--accent); color: var(--on-accent); }
.orbit-destination { position: absolute; z-index: 2; top: 64px; left: calc(50% - 24px); width: 48px; height: 48px; padding: 0; border: 1.5px solid var(--ink); border-radius: 50%; background: var(--paper); color: var(--ink); font-size: 10px; font-weight: 600; opacity: 1; transition: transform calc(240ms * var(--time-scale)) var(--ease-out), opacity calc(180ms * var(--time-scale)) var(--ease-out), scale calc(160ms * var(--time-scale)) var(--ease-out) !important; }
.orbit-destination[aria-current="page"] { background: var(--ink); color: var(--on-ink); }
.orbit-destination:nth-child(1) { transform: translateY(-64px); }
.orbit-destination:nth-child(2) { transform: translate(-72px,36px); }
.orbit-destination:nth-child(3) { transform: translate(72px,36px); }
.orbit-navigation[data-open="false"] .orbit-destination { opacity: 0; transform: translate(0,0); pointer-events: none; transition-duration: calc(180ms * var(--time-scale)) !important; }
.orbit-navigation[data-open="false"] .orbit-nav-guide { opacity: 0; }
.orbit-navigation[data-reset="true"] .orbit-destination, :root[data-reduced="true"] .orbit-destination, :root[data-keyboard="true"] .orbit-destination { transition: none !important; }
@media (min-width: 480px) and (min-height: 320px) { .orbit-navigation { height: 230px; width: 380px; } .orbit-nav-toggle { top: 100px; } .orbit-destination { top: 102px; } .orbit-destination:nth-child(1) { transform: translateY(-82px); } .orbit-destination:nth-child(2) { transform: translate(-104px,44px); } .orbit-destination:nth-child(3) { transform: translate(104px,44px); } .orbit-destination { width: 56px; height: 56px; left: calc(50% - 28px); font-size: 12px; } }
`,
    js: String.raw`
const navigation = document.querySelector('.orbit-navigation');
const toggle = document.querySelector('.orbit-nav-toggle');
const destinations = document.getElementById('orbit-destinations');
const buttons = [...destinations.querySelectorAll('button')];
const status = document.querySelector('.orbit-nav-status');
function open(value) {
  if (!value && destinations.contains(document.activeElement)) toggle.focus({ preventScroll: true });
  navigation.dataset.open = String(value);
  toggle.setAttribute('aria-expanded', String(value));
  toggle.setAttribute('aria-label', value ? 'Close radial navigation' : 'Open radial navigation');
  destinations.inert = !value;
  destinations.setAttribute('aria-hidden', String(!value));
  toggle.querySelector('svg').style.rotate = value ? '0deg' : '45deg';
}
toggle.addEventListener('click', () => open(navigation.dataset.open !== 'true'));
buttons.forEach(button => button.addEventListener('click', () => {
  buttons.forEach(item => item.removeAttribute('aria-current'));
  button.setAttribute('aria-current', 'page');
  status.textContent = button.dataset.destination + ' selected · demo navigation';
}));
navigation.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); open(false); } });
Demo.onReplay(() => { navigation.dataset.reset = 'true'; open(false); void navigation.offsetWidth; navigation.dataset.reset = 'false'; open(true); });
`,
  }),
  recipe({
    id: 'particle-burst',
    title: 'A small celebration',
    category: 'expressive',
    description: 'Twelve small pieces spread from a central point, fade away, and leave the message calm again.',
    purpose: 'Delight',
    useWhen: 'A rare, confirmed milestone or optional creative interaction has earned one small celebration.',
    avoidWhen: 'Routine saves, unverified success, full-screen confetti, persistent particles, or motion that covers the next action.',
    principle: 'Keep celebration finite and contained, preserve the message, and leave the next action available throughout.',
    duration: '900 ms',
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    trigger: 'Celebrate',
    tech: 'WAAPI',
    color: 'peach',
    tags: ['particles', 'confetti', 'celebration', 'success', 'finite', 'burst', 'outline'],
    collections: ['signature', 'landing-pages'],
    reducedMotion: 'A still arrangement of colorful pieces surrounds the message; no particles travel or flash.',
    html: `<main class="stage story-stage burst-stage"><div class="burst-scene"><div class="burst-particles" aria-hidden="true">${Array.from({ length: 12 }, (_, index) => { const angle = index / 12 * Math.PI * 2; return `<i style="transform:translate(${Math.cos(angle) * 103}px,${Math.sin(angle) * 51}px) rotate(${index * 31}deg)"></i>`; }).join('')}</div><h2>Small win.<br><span>Big feeling.</span></h2></div>${control('Celebrate')}</main>`,
    css: String.raw`
.burst-scene { position: relative; display: grid; place-items: center; width: min(100%, 350px); height: 138px; }
.burst-scene h2 { position: relative; margin: 0; font-size: 27px; font-weight: 570; line-height: 1.1; letter-spacing: -.03em; text-align: center; }
.burst-scene h2 span { color: var(--accent-ink); }
.burst-particles { position: absolute; inset: 0; pointer-events: none; }
.burst-particles i { position: absolute; top: calc(50% - 4px); left: calc(50% - 3px); display: block; width: 6px; height: 8px; border-radius: 2px; background: var(--art-1); }
.burst-particles i:nth-child(3n) { background: var(--art-2); border-radius: 50%; }
.burst-particles i:nth-child(3n+1) { background: var(--art-3); }
@media (min-width: 480px) and (min-height: 320px) { .burst-scene { height: 226px; } .burst-scene h2 { font-size: 41px; } .burst-particles { scale: 1.45; } }
`,
    js: finite + String.raw`
const particles = [...document.querySelectorAll('.burst-particles i')];
function play() {
  stop();
  if (!canAnimate()) return;
  particles.forEach((particle, index) => {
    const angle = index / particles.length * Math.PI * 2;
    const x = Math.cos(angle) * 103;
    const y = Math.sin(angle) * 51;
    motion(particle, [{ transform: 'translate(0,0) rotate(0deg) scale(.95)', opacity: 0 }, { transform: 'translate(' + x * .75 + 'px,' + y * .75 + 'px) rotate(' + index * 22 + 'deg) scale(1)', opacity: 1, offset: .35 }, { transform: 'translate(' + x + 'px,' + (y + 15) + 'px) rotate(' + index * 31 + 'deg) scale(1)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  });
}
wire(play);
`,
  }),
  recipe({
    id: 'ribbon-fold',
    title: 'One continuous surface',
    category: 'expressive',
    description: 'Three connected panels unfold from their shared edges into a flat, readable ribbon.',
    purpose: 'Explanation',
    useWhen: 'A brief brand reveal or explanatory illustration can use a folding surface to communicate connection.',
    avoidWhen: 'Long reading content, frequently opened navigation, essential controls on turning faces, or large full-screen rotations.',
    principle: 'Hinge each panel at its real connection, keep the sequence finite, and make the final flat state fully readable.',
    duration: '600 ms + 60 ms stagger · 720 ms total',
    easing: 'cubic-bezier(0.77, 0, 0.175, 1)',
    trigger: 'Unfold ribbon',
    tech: 'WAAPI',
    color: 'green',
    tags: ['fold', 'ribbon', '3d', 'perspective', 'origin', 'paper', 'outline'],
    collections: ['storytelling', 'signature'],
    complexity: 'intermediate',
    reducedMotion: 'All connected panels remain flat and readable; folding is removed.',
    html: `<main class="stage story-stage ribbon-stage"><div class="ribbon-scene" role="img" aria-label="Three connected graphic panels spelling One, shared, surface"><div class="ribbon-panel ribbon-first"><span>One.</span><div class="ribbon-panel ribbon-second"><span>Shared.</span><div class="ribbon-panel ribbon-third"><span>Surface.</span></div></div></div></div>${control('Unfold ribbon')}</main>`,
    css: String.raw`
.ribbon-scene { position: relative; width: 246px; max-width: 100%; height: 142px; perspective: 700px; }
.ribbon-panel { position: absolute; top: 0; width: 82px; height: 120px; transform-style: preserve-3d; transform-origin: left center; backface-visibility: hidden; }
.ribbon-first { left: 0; top: 11px; background: var(--accent); color: var(--on-accent); border-radius: 9px 0 0 9px; }
.ribbon-second { left: 100%; background: var(--accent-soft); color: var(--ink); }
.ribbon-third { left: 100%; background: var(--paper); color: var(--ink); border-radius: 0 9px 9px 0; }
.ribbon-panel > span { position: absolute; left: 10px; bottom: 15px; font-size: 15px; font-weight: 600; letter-spacing: -.025em; }
.ribbon-panel::before { content: ''; position: absolute; top: 20px; left: 24px; width: 34px; height: 34px; border: 2px solid currentColor; border-radius: 50%; opacity: .7; }
.ribbon-second::before { border-radius: 0; rotate: 45deg; }
.ribbon-third::before { border-radius: 16px 16px 0 0; }
@media (min-width: 480px) and (min-height: 320px) { .ribbon-scene { width: 372px; height: 230px; } .ribbon-panel { width: 124px; height: 196px; } .ribbon-first { top: 17px; } .ribbon-panel > span { left: 15px; bottom: 22px; font-size: 23px; } .ribbon-panel::before { top: 35px; left: 35px; width: 54px; height: 54px; } }
`,
    js: finite + String.raw`
const panels = [...document.querySelectorAll('.ribbon-panel')];
function play() {
  stop();
  if (!canAnimate()) return;
  panels.forEach((panel, index) => motion(panel, [{ transform: 'rotateY(' + [-18, 82, -82][index] + 'deg)' }, { transform: 'rotateY(0deg)' }], { duration: 600, delay: index * 60, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' }));
}
wire(play);
`,
  }),
  recipe({
    id: 'radar-scan',
    title: 'Find what is out there',
    category: 'expressive',
    description: 'One narrow sweep crosses an illustrative signal field and leaves three visible points behind.',
    purpose: 'Explanation',
    useWhen: 'An optional product story or creative illustration needs a brief discovery or scanning metaphor.',
    avoidWhen: 'Real security status, location tracking, fake progress, endless scans, or implying that illustrative signals are live data.',
    principle: 'Make the scan one deliberate pass, keep the result legible, and clearly label the field as an illustration.',
    duration: '1,800 ms',
    easing: 'linear scan · cubic-bezier(0.23, 1, 0.32, 1) signal reveal',
    trigger: 'Scan once',
    tech: 'WAAPI',
    color: 'green',
    tags: ['radar', 'scan', 'signals', 'svg', 'discovery', 'finite', 'outline'],
    collections: ['signature', 'storytelling'],
    reducedMotion: 'All three illustrative signals are visible immediately; the sweeping sector is removed.',
    html: `<main class="stage story-stage radar-stage"><div class="radar-composition"><svg class="radar-art" viewBox="0 0 180 166" role="img" aria-label="An illustrative radar diagram with three signals; no live data"><g class="radar-rings"><circle cx="90" cy="83" r="68"/><circle cx="90" cy="83" r="44"/><circle cx="90" cy="83" r="20"/><path d="M90 10v146M17 83h146"/></g><g class="radar-sector"><path d="M90 83 90 15a68 68 0 0 1 40 13Z"/><path d="M90 83V15"/></g><circle class="radar-signal" cx="117" cy="43" r="5"/><circle class="radar-signal" cx="130" cy="111" r="5"/><circle class="radar-signal" cx="52" cy="91" r="5"/><circle class="radar-center" cx="90" cy="83" r="4"/></svg><p><strong>Three signals.</strong><span>One clear picture.</span><small>Illustrative data</small></p></div>${control('Scan once')}</main>`,
    css: String.raw`
.radar-composition { display: flex; align-items: center; gap: 5px; width: min(100%, 370px); }
.radar-art { flex: none; width: 155px; height: 145px; }
.radar-rings { fill: none; stroke: var(--line); stroke-width: 1; }
.radar-sector { transform-origin: 90px 83px; opacity: 0; }
.radar-sector path:first-child { fill: var(--accent-soft); }
.radar-sector path:last-child { fill: none; stroke: var(--accent-ink); stroke-width: 2; }
.radar-signal { fill: var(--accent); stroke: var(--paper); stroke-width: 2; }
.radar-signal:nth-of-type(2) { fill: var(--art-2); }
.radar-signal:nth-of-type(3) { fill: var(--art-3); }
.radar-center { fill: var(--accent-ink); }
.radar-composition > p { min-width: 0; }
.radar-composition strong { display: block; font-size: 15px; font-weight: 600; line-height: 1.15; letter-spacing: -.02em; }
.radar-composition p > span { display: block; margin-top: 7px; font-size: 11px; color: var(--muted); line-height: 1.5; }
.radar-composition small { display: block; margin-top: 13px; font-size: 9px; color: var(--muted); }
@media (min-width: 480px) and (min-height: 320px) { .radar-composition { width: 450px; gap: 22px; } .radar-art { width: 255px; height: 242px; } .radar-composition strong { font-size: 25px; } .radar-composition p > span { font-size: 14px; } .radar-composition small { font-size: 11px; } }
`,
    js: finite + String.raw`
const sector = document.querySelector('.radar-sector');
const signals = [...document.querySelectorAll('.radar-signal')];
function play() {
  stop();
  if (!canAnimate()) return;
  motion(sector, [{ transform: 'rotate(0deg)', opacity: 0 }, { transform: 'rotate(18deg)', opacity: 1, offset: .05 }, { transform: 'rotate(342deg)', opacity: 1, offset: .95 }, { transform: 'rotate(360deg)', opacity: 0 }], { duration: 1800, easing: 'linear' });
  signals.forEach((signal, index) => motion(signal, [{ opacity: .25 }, { opacity: 1 }], { duration: 200, delay: [120, 620, 1220][index], easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }));
}
wire(play);
`,
  }),
];
