/* Original, portable motion studies. MIT. See each recipe's source field for the upstream principle. */
import { recipeIcon } from '../recipe-icons.mjs';

export default [
  {
    id: "staggered-list",
    title: "A little stagger",
    category: "entrances",
    description: "Three rows arrive 50 ms apart, giving a small group a clear reading order.",
    purpose: "Preventing a jarring change",
    useWhen: "First visits, onboarding checklists, or an occasional small group entering together.",
    avoidWhen: "Repeated list navigation, search results, or content someone is already reading. Never delay interaction until the stagger finishes.",
    principle: "Short 30–80 ms offsets make a group feel coordinated without making the interface wait.",
    duration: "300 ms + 50 ms stagger",
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    trigger: "Replay",
    tech: "WAAPI",
    color: "lavender",
    tags: ["stagger","list","onboarding","entrance"],
    reducedMotion: "All rows appear together in their final positions.",
    source: "animate/RECIPES.md",
    html: `<main class="stage list-stage">
  <ol class="arrival-list" aria-label="Three motion principles">
    <li><span class="step-dot" aria-hidden="true">1</span><span>Start with a purpose</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg></li>
    <li><span class="step-dot" aria-hidden="true">2</span><span>Keep it responsive</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg></li>
    <li><span class="step-dot" aria-hidden="true">3</span><span>Leave room to breathe</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7"/></svg></li>
  </ol>
  <p class="demo-label">A rhythm, without a wait.</p>
</main>`,
    css: `.list-stage { gap: 15px; }
.arrival-list { width: min(100%, 270px); display: grid; gap: 9px; padding: 0; margin: 0; list-style: none; }
.arrival-list li { min-height: 44px; display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 12px; background: var(--paper); font-size: 12px; font-weight: 550; color: var(--ink); box-shadow: 0 2px 2px var(--shadow); }
.step-dot { width: 23px; height: 23px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; background: var(--accent-soft); color: var(--ink); font-size: 10px; font-weight: 650; }
.arrival-list svg { width: 13px; height: 13px; margin-left: auto; fill: none; stroke: var(--accent); stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }`,
    js: `(function(specs) {
  let animations = [];
  function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
  function showFinal() {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach(element => {
        const frame = spec.frames[spec.frames.length - 1];
        Object.entries(frame).forEach(([property, value]) => { element.style[property] = value; });
      });
    }
  }
  Demo.onReplay(() => {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach((element, index) => {
        animations.push(Demo.animate(element, spec.frames, {
          duration: spec.duration,
          delay: (spec.delay || 0) + index * (spec.stagger || 0),
          easing: spec.easing || 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'both',
        }));
      });
    }
  });
  Demo.onSettings(() => { if (Demo.reduced) showFinal(); });
  Demo.onCleanup(stop);
})([
  {
    "selector": ".arrival-list li",
    "frames": [
      {
        "opacity": 0,
        "transform": "translateY(8px)"
      },
      {
        "opacity": 1,
        "transform": "translateY(0)"
      }
    ],
    "duration": 300,
    "stagger": 50
  }
]);`
  },
  {
    id: "masked-reveal",
    title: "Uncover the scene",
    category: "entrances",
    description: "A crisp clipping mask reveals a graphic without moving the surrounding layout.",
    purpose: "Explanation",
    useWhen: "An editorial image, portfolio project, or a first-view marketing scene. In a real page, trigger it once with IntersectionObserver.",
    avoidWhen: "Hiding essential text, delaying a working interface, or replaying the reveal every time someone scrolls past.",
    principle: "Clip the visual itself, keep the layout stable, and reserve the longer duration for a rare explanatory moment.",
    duration: "600 ms",
    easing: "cubic-bezier(0.77, 0, 0.175, 1)",
    trigger: "Replay",
    tech: "WAAPI",
    color: "peach",
    tags: ["clip-path","reveal","image","marketing"],
    reducedMotion: "The complete scene is shown immediately; no mask travels across it.",
    source: "animate/RECIPES.md",
    html: `<main class="stage scene-stage">
  <figure class="postcard">
    <div class="landscape" role="img" aria-label="An original illustration of a sun rising over rounded hills">
      <span class="sun"></span><span class="ridge ridge-back"></span><span class="ridge ridge-front"></span>
      <span class="scene-mark" aria-hidden="true">06:24</span>
    </div>
    <figcaption><span>A slower morning</span><span>01 / 03</span></figcaption>
  </figure>
</main>`,
    css: `.postcard { width: min(100%, 256px); margin: 0; padding: 9px; border-radius: 5px; background: var(--paper); box-shadow: 0 4px 0 var(--shadow); transform: rotate(-3deg); }
.landscape { position: relative; height: 143px; overflow: hidden; background: color-mix(in srgb, var(--art-1) 30%, var(--paper)); border-radius: 2px; }
.sun { position: absolute; width: 54px; height: 54px; top: 23px; left: 54%; border-radius: 50%; background: var(--art-2); }
.ridge { position: absolute; display: block; }
.ridge-back { width: 240px; height: 140px; bottom: -82px; left: -24px; border-radius: 55% 70% 0 0; background: var(--art-3); transform: rotate(-17deg); }
.ridge-front { width: 210px; height: 95px; bottom: -32px; right: -45px; border-radius: 55% 45% 0 0; background: var(--accent); transform: rotate(-10deg); }
.scene-mark { position: absolute; top: 13px; left: 14px; font-size: 10px; color: var(--ink); font-variant-numeric: tabular-nums; }
.postcard figcaption { display: flex; justify-content: space-between; gap: 15px; padding: 9px 2px 2px; font-size: 10px; color: var(--ink); }
.postcard figcaption span:last-child { color: var(--muted); font-variant-numeric: tabular-nums; }`,
    js: `(function(specs) {
  let animations = [];
  function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
  function showFinal() {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach(element => {
        const frame = spec.frames[spec.frames.length - 1];
        Object.entries(frame).forEach(([property, value]) => { element.style[property] = value; });
      });
    }
  }
  Demo.onReplay(() => {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach((element, index) => {
        animations.push(Demo.animate(element, spec.frames, {
          duration: spec.duration,
          delay: (spec.delay || 0) + index * (spec.stagger || 0),
          easing: spec.easing || 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'both',
        }));
      });
    }
  });
  Demo.onSettings(() => { if (Demo.reduced) showFinal(); });
  Demo.onCleanup(stop);
})([
  {
    "selector": ".landscape",
    "frames": [
      {
        "clipPath": "inset(0 0 100% 0)"
      },
      {
        "clipPath": "inset(0 0 0 0)"
      }
    ],
    "duration": 600,
    "easing": "cubic-bezier(0.77, 0, 0.175, 1)"
  }
]);`
  },
  {
    id: "scale-dialog",
    title: "Room to think",
    category: "entrances",
    description: "A centered dialog settles in from 96% scale, then leaves along the same path.",
    purpose: "Preventing a jarring change",
    useWhen: "An occasional decision that needs a focused modal surface. Open dialog uses the native modal API, Escape, and focus restoration.",
    avoidWhen: "Command palettes, keyboard shortcuts, or tiny anchored menus. Automatic previews stay nonmodal so they never steal focus.",
    principle: "A dialog is centered, so its transform origin stays centered; it should arrive with a small scale change, never from zero.",
    duration: "250 ms in · 200 ms out",
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    trigger: "Open / close",
    tech: "WAAPI",
    color: "sand",
    tags: ["dialog","modal","scale","entrance","native","solid","outline"],
    reducedMotion: "Opening and closing happen immediately; native focus and Escape behavior remain.",
    source: "animate/RECIPES.md",
    html: `<main class="stage dialog-stage">
  <button class="demo-button secondary dialog-launch" data-launch>Open dialog</button>
  <dialog class="study-dialog" open aria-labelledby="dialog-title" aria-describedby="dialog-description">
    <span class="dialog-emblem" aria-hidden="true">${recipeIcon("spark", 18)}</span>
    <h2 id="dialog-title">Room to think.</h2>
    <p id="dialog-description">One small decision. Everything else can wait.</p>
    <button class="demo-button" data-dismiss>Got it</button>
  </dialog>
</main>`,
    css: `.dialog-stage { position: relative; overflow: hidden; min-height: 230px; height: 100%; }
.dialog-launch { position: absolute; bottom: 8px; min-height: 36px; padding: 8px 14px; font-size: 12px; }
.study-dialog { position: fixed; top: 44%; left: 50%; translate: -50% -50%; margin: 0; width: min(240px, calc(100% - 40px)); max-height: calc(100% - 64px); overflow: auto; padding: 15px 18px; border: 0; border-radius: 17px; background: var(--paper); color: var(--ink); box-shadow: 0 5px 16px var(--shadow); transform-origin: center; text-align: center; }
.dialog-emblem { display: inline-grid; place-items: center; width: 25px; height: 25px; margin-bottom: 6px; border-radius: 9px; background: var(--accent-soft); font-size: 20px; color: var(--ink); }
.study-dialog h2 { font-size: 17px; line-height: 1.2; letter-spacing: -.025em; }
.study-dialog p { max-width: 180px; margin: 6px auto 11px; font-size: 11px; line-height: 1.4; color: var(--muted); }
.study-dialog .demo-button { min-height: 32px; padding: 7px 18px; font-size: 11px; }
.study-dialog::backdrop { background: var(--shadow); opacity: 1; transition: opacity calc(250ms * var(--time-scale)) var(--ease-out); }
.study-dialog[data-closing]::backdrop { opacity: 0; }
@starting-style { .study-dialog::backdrop { opacity: 0; } }
:root[data-reduced="true"] .study-dialog::backdrop, :root[data-keyboard="true"] .study-dialog::backdrop { transition: none; }
@media (min-height: 300px) { .study-dialog { padding: 22px; } .study-dialog .demo-button, .dialog-launch { min-height: 44px; } .study-dialog p { font-size: 12px; margin-bottom: 14px; } }`,
    js: `(function(selector, offscreen, duration) {
  const dialog = document.querySelector(selector);
  const launch = document.querySelector('[data-launch]');
  let animation;
  let generation = 0;
  let closing = false;
  function stop() { animation?.cancel(); animation = null; }
  function open(modal) {
    generation++;
    closing = false;
    stop();
    dialog.removeAttribute('data-closing');
    dialog.style.opacity = '1';
    dialog.style.transform = 'none';
    // Automatic previews keep focus where it is. Explicit Open uses the modal API.
    if (modal) {
      if (dialog.open) dialog.close();
      dialog.showModal();
    } else if (!dialog.open) {
      dialog.setAttribute('open', '');
    }
    animation = Demo.animate(dialog, [
      { opacity: 0, transform: offscreen },
      { opacity: 1, transform: 'none' },
    ], { duration, easing: selector.includes('sheet') ? 'cubic-bezier(0.32, 0.72, 0, 1)' : 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
  function close() {
    if (!dialog.open || closing) return;
    const version = ++generation;
    const visible = getComputedStyle(dialog);
    const start = { opacity: visible.opacity, transform: visible.transform };
    stop();
    closing = true;
    dialog.setAttribute('data-closing', '');
    animation = Demo.animate(dialog, [
      start,
      { opacity: 0, transform: offscreen },
    ], { duration: Math.min(duration, 200), easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    animation.finished.then(() => {
      if (version !== generation) return;
      closing = false;
      dialog.close();
    }).catch(() => {});
  }
  launch.addEventListener('click', () => open(true));
  dialog.querySelectorAll('[data-dismiss]').forEach(button => button.addEventListener('click', close));
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) close();
  });
  Demo.onReplay(() => open(false));
  Demo.onSettings(() => {
    if (!Demo.reduced) return;
    generation++;
    stop();
    if (closing) { dialog.close(); closing = false; }
    dialog.style.opacity = '1';
    dialog.style.transform = 'none';
  });
  Demo.onCleanup(stop);
})(".study-dialog", "scale(0.96)", 250);`
  },
  {
    id: "slide-sheet",
    title: "Up from the edge",
    category: "entrances",
    description: "A compact sheet rises from below and returns to the same edge on dismissal.",
    purpose: "Spatial consistency",
    useWhen: "An occasional set of choices that belongs to the bottom edge. The explicit Open sheet button creates a native modal.",
    avoidWhen: "Adding drag handles without drag support, blocking frequent keyboard actions, or sliding the same choice into view repeatedly. The preview is a nonmodal study.",
    principle: "Use a percentage translation so the travel adapts to the sheet’s content, and keep entry and exit spatially consistent.",
    duration: "300 ms in · 200 ms out",
    easing: "cubic-bezier(0.32, 0.72, 0, 1)",
    trigger: "Open / close",
    tech: "WAAPI",
    color: "blue",
    tags: ["drawer","sheet","slide","native","entrance","outline","ghost"],
    reducedMotion: "The sheet opens and closes without sliding; focus, buttons, and Escape still work.",
    source: "animate/RECIPES.md",
    html: `<main class="stage sheet-stage">
  <button class="demo-button secondary sheet-launch" data-launch>Open sheet</button>
  <dialog class="study-sheet" open aria-labelledby="sheet-title">
    <header><h2 id="sheet-title">Make it yours</h2><button class="sheet-close" data-dismiss aria-label="Close sheet">${recipeIcon("close", 16)}</button></header>
    <p>Choose a format. This is a motion demo.</p>
    <button class="sheet-option" data-dismiss><span class="file-symbol" aria-hidden="true">${recipeIcon("code", 17)}</span><span>Standalone HTML<small>One file, ready to explore</small></span><span class="option-arrow" aria-hidden="true">${recipeIcon("arrow", 16)}</span></button>
  </dialog>
</main>`,
    css: `.sheet-stage { position: relative; overflow: hidden; min-height: 230px; height: 100%; }
.sheet-launch { position: absolute; bottom: 8px; min-height: 36px; padding: 8px 14px; font-size: 12px; }
.study-sheet { position: fixed; left: 50%; bottom: 57px; top: auto; translate: -50% 0; width: min(280px, calc(100% - 34px)); margin: 0; padding: 16px; border: 0; border-radius: 19px; background: var(--paper); color: var(--ink); box-shadow: 0 5px 14px var(--shadow); max-height: calc(100% - 72px); overflow: auto; }
.study-sheet header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.study-sheet h2 { font-size: 16px; line-height: 1.3; letter-spacing: -.02em; }
.sheet-close { width: 30px; height: 30px; flex-shrink: 0; display: grid; place-items: center; padding: 0; background: transparent; border: 0; border-radius: 50%; color: var(--muted); font-size: 21px; line-height: 1; }
.study-sheet p { margin: 1px 0 13px; font-size: 10px; color: var(--muted); }
.sheet-option { width: 100%; min-height: 50px; padding: 7.5px; display: flex; align-items: center; gap: 10px; border: 1.5px solid var(--ink); border-radius: 11px; text-align: left; background: transparent; color: var(--ink); font-size: 11px; font-weight: 600; }
.file-symbol { display: grid; place-items: center; width: 29px; height: 32px; border-radius: 6px; background: var(--paper); color: var(--ink); font-size: 15px; }
.sheet-option small { display: block; margin-top: 2px; color: var(--muted); font-size: 9px; font-weight: 400; }
.option-arrow { margin-left: auto; font-size: 17px; color: var(--ink); }
.study-sheet::backdrop { background: var(--shadow); opacity: 1; transition: opacity calc(300ms * var(--time-scale)) var(--ease-drawer); }
.study-sheet[data-closing]::backdrop { opacity: 0; }
@starting-style { .study-sheet::backdrop { opacity: 0; } }
:root[data-reduced="true"] .study-sheet::backdrop, :root[data-keyboard="true"] .study-sheet::backdrop { transition: none; }
@media (min-height: 300px) { .study-sheet { bottom: 74px; padding: 22px; } .sheet-close { width: 44px; height: 44px; } .sheet-launch { min-height: 44px; bottom: 14px; } .study-sheet p { font-size: 12px; } .sheet-option { min-height: 64px; font-size: 13px; } .sheet-option small { font-size: 11px; } }`,
    js: `(function(selector, offscreen, duration) {
  const dialog = document.querySelector(selector);
  const launch = document.querySelector('[data-launch]');
  let animation;
  let generation = 0;
  let closing = false;
  function stop() { animation?.cancel(); animation = null; }
  function open(modal) {
    generation++;
    closing = false;
    stop();
    dialog.removeAttribute('data-closing');
    dialog.style.opacity = '1';
    dialog.style.transform = 'none';
    // Automatic previews keep focus where it is. Explicit Open uses the modal API.
    if (modal) {
      if (dialog.open) dialog.close();
      dialog.showModal();
    } else if (!dialog.open) {
      dialog.setAttribute('open', '');
    }
    animation = Demo.animate(dialog, [
      { opacity: 0, transform: offscreen },
      { opacity: 1, transform: 'none' },
    ], { duration, easing: selector.includes('sheet') ? 'cubic-bezier(0.32, 0.72, 0, 1)' : 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
  function close() {
    if (!dialog.open || closing) return;
    const version = ++generation;
    const visible = getComputedStyle(dialog);
    const start = { opacity: visible.opacity, transform: visible.transform };
    stop();
    closing = true;
    dialog.setAttribute('data-closing', '');
    animation = Demo.animate(dialog, [
      start,
      { opacity: 0, transform: offscreen },
    ], { duration: Math.min(duration, 200), easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    animation.finished.then(() => {
      if (version !== generation) return;
      closing = false;
      dialog.close();
    }).catch(() => {});
  }
  launch.addEventListener('click', () => open(true));
  dialog.querySelectorAll('[data-dismiss]').forEach(button => button.addEventListener('click', close));
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) close();
  });
  Demo.onReplay(() => open(false));
  Demo.onSettings(() => {
    if (!Demo.reduced) return;
    generation++;
    stop();
    if (closing) { dialog.close(); closing = false; }
    dialog.style.opacity = '1';
    dialog.style.transform = 'none';
  });
  Demo.onCleanup(stop);
})(".study-sheet", "translateY(100%)", 300);`
  },
  {
    id: "blur-reveal",
    title: "From soft to sharp",
    category: "entrances",
    description: "A tiny two-pixel blur resolves as a graphic fades into focus.",
    purpose: "Preventing a jarring change",
    useWhen: "A small brand visual or an occasional image transition where a hard crossfade leaves a visible seam.",
    avoidWhen: "Body text, large full-screen surfaces, heavy blur, or using filters by default. Blur repaints; keep this effect small.",
    principle: "Use a little blur to soften a visible seam, then remove it completely. The final state should be crisp.",
    duration: "200 ms",
    easing: "ease",
    trigger: "Replay",
    tech: "WAAPI",
    color: "lavender",
    tags: ["blur","filter","reveal","graphic"],
    reducedMotion: "The graphic appears sharp immediately. The surrounding caption never moves.",
    source: "animate/RECIPES.md",
    html: `<main class="stage focus-stage">
  <div class="focus-art" role="img" aria-label="An abstract folded ribbon over a colored circle">
    <span class="focus-disc"></span><span class="ribbon-piece ribbon-one"></span><span class="ribbon-piece ribbon-two"></span><span class="ribbon-piece ribbon-three"></span><span class="focus-dot"></span>
  </div>
  <p class="demo-label">A softer arrival. A sharper finish.</p>
</main>`,
    css: `.focus-stage { gap: 16px; }
.focus-art { position: relative; width: 166px; height: 145px; }
.focus-disc { position: absolute; width: 139px; height: 139px; top: 3px; left: 13px; border-radius: 50%; background: var(--art-1); }
.ribbon-piece { display: block; position: absolute; width: 78px; height: 30px; background: var(--paper); }
.ribbon-one { top: 35px; left: 39px; transform: rotate(-33deg); border-radius: 5px 5px 2px 2px; }
.ribbon-two { top: 65px; left: 41px; transform: rotate(33deg); background: var(--accent-soft); }
.ribbon-three { top: 94px; left: 41px; transform: rotate(-33deg); border-radius: 2px 2px 5px 5px; }
.focus-dot { position: absolute; top: 16px; right: 5px; width: 18px; height: 18px; background: var(--accent); border-radius: 50%; }`,
    js: `(function(specs) {
  let animations = [];
  function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
  function showFinal() {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach(element => {
        const frame = spec.frames[spec.frames.length - 1];
        Object.entries(frame).forEach(([property, value]) => { element.style[property] = value; });
      });
    }
  }
  Demo.onReplay(() => {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach((element, index) => {
        animations.push(Demo.animate(element, spec.frames, {
          duration: spec.duration,
          delay: (spec.delay || 0) + index * (spec.stagger || 0),
          easing: spec.easing || 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'both',
        }));
      });
    }
  });
  Demo.onSettings(() => { if (Demo.reduced) showFinal(); });
  Demo.onCleanup(stop);
})([
  {
    "selector": ".focus-art",
    "frames": [
      {
        "opacity": 0,
        "filter": "blur(2px)"
      },
      {
        "opacity": 1,
        "filter": "blur(0px)"
      }
    ],
    "duration": 200,
    "easing": "ease"
  }
]);`
  },
  {
    id: "orchestrated-panel",
    title: "A coordinated entrance",
    category: "entrances",
    description: "A surface, its emblem, and its content arrive in one short, overlapping sequence.",
    purpose: "Explanation",
    useWhen: "A first-run setup panel or a rare welcome moment where visual hierarchy helps explain what appeared.",
    avoidWhen: "Animating an entire working dashboard or adding waits before the action becomes clickable.",
    principle: "Overlap the parts instead of chaining long delays. The whole composition should settle in roughly a third of a second.",
    duration: "250 ms + 50 ms offsets",
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    trigger: "Replay",
    tech: "WAAPI",
    color: "green",
    tags: ["sequence","orchestration","onboarding","stagger","solid"],
    reducedMotion: "All parts appear immediately. The action stays available throughout.",
    source: "animate/RECIPES.md",
    html: `<main class="stage">
  <section class="welcome-panel" aria-labelledby="welcome-title">
    <div class="welcome-emblem" aria-hidden="true"><span></span><span></span><span></span></div>
    <div class="welcome-copy"><h2 id="welcome-title">Space for good ideas.</h2><p>A little structure. A lot of possibility.</p></div>
    <button class="welcome-action" type="button" aria-pressed="false">Make some room <span aria-hidden="true">${recipeIcon("arrow", 14)}</span></button>
  </section>
</main>`,
    css: `.welcome-panel { position: relative; display: flex; flex-direction: column; align-items: center; width: min(100%, 258px); padding: 15px 18px 13px; border-radius: 18px; background: var(--paper); color: var(--ink); box-shadow: 0 3px 0 var(--shadow); }
.welcome-emblem { position: relative; width: 58px; height: 48px; margin: 6px 0 9px; }
.welcome-emblem span { position: absolute; bottom: 0; width: 21px; border-radius: 6px; background: var(--art-1); }
.welcome-emblem span:nth-child(1) { height: 31px; left: 0; transform: rotate(-12deg); background: var(--art-2); }
.welcome-emblem span:nth-child(2) { height: 43px; left: 19px; transform: rotate(6deg); }
.welcome-emblem span:nth-child(3) { height: 30px; right: 0; transform: rotate(17deg); background: var(--art-3); }
.welcome-copy { text-align: center; }
.welcome-copy h2 { font-size: 17px; line-height: 1.3; letter-spacing: -.025em; font-weight: 650; }
.welcome-copy p { margin-top: 4px; font-size: 10px; color: var(--muted); }
.welcome-action { display: flex; align-items: center; justify-content: space-between; gap: 35px; min-height: 35px; padding: 9px 12px; margin-top: 13px; width: 100%; border: 0; border-radius: 8px; background: var(--ink); color: var(--on-ink); font-size: 10px; font-weight: 600; transition: transform calc(160ms * var(--time-scale)) var(--ease-out); }
.welcome-action:active { transform: scale(.97); }
@media (min-height: 300px) { .welcome-panel { padding: 24px; } .welcome-action { min-height: 44px; font-size: 12px; } .welcome-copy p { font-size: 11px; } }`,
    js: `(function(specs) {
  let animations = [];
  function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
  function showFinal() {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach(element => {
        const frame = spec.frames[spec.frames.length - 1];
        Object.entries(frame).forEach(([property, value]) => { element.style[property] = value; });
      });
    }
  }
  Demo.onReplay(() => {
    stop();
    for (const spec of specs) {
      document.querySelectorAll(spec.selector).forEach((element, index) => {
        animations.push(Demo.animate(element, spec.frames, {
          duration: spec.duration,
          delay: (spec.delay || 0) + index * (spec.stagger || 0),
          easing: spec.easing || 'cubic-bezier(0.23, 1, 0.32, 1)',
          fill: 'both',
        }));
      });
    }
  });
  Demo.onSettings(() => { if (Demo.reduced) showFinal(); });
  Demo.onCleanup(stop);
})([
  {
    "selector": ".welcome-panel",
    "frames": [
      {
        "opacity": 0,
        "transform": "scale(.96)"
      },
      {
        "opacity": 1,
        "transform": "scale(1)"
      }
    ],
    "duration": 250
  },
  {
    "selector": ".welcome-emblem",
    "frames": [
      {
        "opacity": 0,
        "transform": "translateY(8px)"
      },
      {
        "opacity": 1,
        "transform": "translateY(0)"
      }
    ],
    "duration": 250,
    "delay": 50
  },
  {
    "selector": ".welcome-copy, .welcome-action",
    "frames": [
      {
        "opacity": 0
      },
      {
        "opacity": 1
      }
    ],
    "duration": 200,
    "delay": 100,
    "stagger": 50
  }
]);
const action = document.querySelector('.welcome-action');
action.addEventListener('click', () => {
  const selected = action.getAttribute('aria-pressed') !== 'true';
  action.setAttribute('aria-pressed', String(selected));
  action.firstChild.textContent = selected ? 'Room made. Your move. ' : 'Make some room ';
});`
  },
  {
    id: "spring-orb",
    title: "Catch the spring",
    category: "expressive",
    description: "A spring carries a warm little orb between three points, even when you reverse it halfway.",
    purpose: "Explanation",
    useWhen: "Studying physical interpolation or adding a small, occasional playful interaction. Try rapidly choosing opposite targets.",
    avoidWhen: "Reading data, menus, or any high-frequency action where oscillation adds delay. This is a physics study, not a loading indicator.",
    principle: "Retarget the same motion value so position and velocity stay continuous. Springs earn their place when the motion is interruptible.",
    duration: "Physics-driven",
    easing: "Spring · mass 1 · stiffness 100 · damping 10",
    trigger: "Choose a target",
    tech: "Motion",
    color: "sand",
    tags: ["spring","physics","interruptible","playful","segmented"],
    reducedMotion: "The orb moves directly to the selected point without travel or bounce.",
    source: "apple-design/SKILL.md",
    usesMotion: true,
    featured: true,
    html: `<main class="stage spring-stage">
  <div class="spring-track" aria-hidden="true"><span class="track-line"></span><span class="target target-left"></span><span class="target target-center"></span><span class="target target-right"></span><span class="spring-orb"><span></span></span></div>
  <div class="spring-controls" aria-label="Orb position"><button data-target="-1" aria-pressed="false">Left</button><button data-target="0" aria-pressed="true">Center</button><button data-target="1" aria-pressed="false">Right</button></div>
  <p class="demo-label">Change your mind halfway.</p>
</main>`,
    css: `.spring-stage { gap: 16px; }
.spring-track { position: relative; width: 236px; max-width: 100%; height: 76px; }
.track-line { position: absolute; top: 38px; left: 40px; right: 40px; height: 2px; background: var(--line); }
.target { position: absolute; top: 20px; width: 36px; height: 36px; border: 2px solid var(--line); border-radius: 50%; left: calc(50% - 18px); background: var(--accent-soft); }
.target-left { transform: translateX(-76px); }.target-right { transform: translateX(76px); }
.spring-orb { position: absolute; left: calc(50% - 23px); top: 15px; width: 46px; height: 46px; border-radius: 50%; background: var(--accent); box-shadow: inset 0 -3px 0 var(--shadow); display: grid; place-items: center; }
.spring-orb span { width: 8px; height: 8px; border-radius: 50%; background: var(--on-accent); }
.spring-controls { display: flex; gap: 6px; padding: 4px; border-radius: 13px; background: color-mix(in srgb, var(--paper) 55%, transparent); }
.spring-controls button { min-height: 36px; padding: 7px 15px; background: transparent; color: var(--muted); border: 0; border-radius: 9px; font-size: 11px; font-weight: 550; }
.spring-controls button[aria-pressed="true"] { background: var(--paper); color: var(--ink); box-shadow: 0 2px 4px var(--shadow); }
@media (min-height: 300px) { .spring-controls button { min-height: 44px; padding-inline: 18px; font-size: 12px; } }`,
    js: `function createSpring(initial, render) {
  const value = Motion.motionValue(initial);
  let target = initial;
  let animation = null;
  const unsubscribe = value.on('change', render);
  render(initial);
  function jump(next) {
    target = next;
    animation?.stop();
    animation = null;
    value.jump(next);
  }
  function to(next, velocity) {
    target = next;
    if (Demo.duration(1) === 0) { jump(next); return Promise.resolve(); }
    // A physics spring retains the motion value's velocity when retargeted.
    const options = { type: 'spring', mass: 1, stiffness: 100, damping: 10 };
    if (Number.isFinite(velocity)) options.velocity = velocity;
    const current = Motion.animate(value, next, options);
    animation = current;
    current.speed = Demo.speed;
    if (Demo.paused || document.hidden) current.pause();
    current.then(() => { if (animation === current) animation = null; });
    return current;
  }
  function sync() {
    if (Demo.reduced) { jump(target); return; }
    if (!animation) return;
    animation.speed = Demo.speed;
    if (Demo.paused || document.hidden) animation.pause();
    else animation.play();
  }
  document.addEventListener('visibilitychange', sync);
  Demo.onSettings(sync);
  Demo.onCleanup(() => {
    animation?.stop();
    unsubscribe();
    value.destroy();
    document.removeEventListener('visibilitychange', sync);
  });
  return {
    to, jump,
    get: () => value.get(),
    set: next => { target = next; value.set(next); },
    stop: () => { animation?.stop(); animation = null; value.stop(); },
  };
}

(function() {
  const orb = document.querySelector('.spring-orb');
  const controls = [...document.querySelectorAll('[data-target]')];
  const spring = createSpring(0, value => { orb.style.transform = 'translateX(' + value + 'px)'; });
  function select(position) {
    controls.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.target) === position)));
    spring.to(position * 76);
  }
  controls.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.target))));
  Demo.onReplay(() => { spring.jump(-76); select(1); });
 })();`
  },
  {
    id: "magnetic-button",
    title: "A gentle attraction",
    category: "expressive",
    description: "A stationary button hit area contains a face that softly follows a nearby pointer.",
    purpose: "Delight",
    useWhen: "A restrained, optional detail on a portfolio or a rarely used marketing action. Only precise hover pointers trigger the tracking.",
    avoidWhen: "Forms, frequently used controls, touch-only interfaces, and primary actions whose hit area needs to feel completely still.",
    principle: "Keep the real hit area stable and spring only the decorative face. Gate pointer tracking and offer the same action to every input.",
    duration: "Physics-driven",
    easing: "Spring · mass 1 · stiffness 100 · damping 10",
    trigger: "Hover / press",
    tech: "Motion",
    color: "graphite",
    tags: ["magnetic","pointer","spring","button","hover","solid"],
    reducedMotion: "Pointer tracking is disabled; the native button and its pressed state remain fully usable.",
    source: "emil-design-eng/SKILL.md",
    usesMotion: true,
    html: `<main class="stage magnetic-stage">
  <button class="magnetic-hit" aria-pressed="false"><span class="magnetic-face"><span class="magnetic-label">Stay curious</span><span class="magnetic-arrow" aria-hidden="true">${recipeIcon("arrow", 15)}</span></span></button>
  <p class="demo-label">A little pull. A steady target.</p>
</main>`,
    css: `.magnetic-stage { gap: 5px; }
.magnetic-hit { width: 246px; max-width: 100%; height: 120px; display: flex; align-items: center; justify-content: center; padding: 20px; background: transparent; border: 0; border-radius: 35px; }
.magnetic-face { min-width: 184px; min-height: 53px; padding: 14px 16px; border-radius: 16px; display: flex; align-items: center; justify-content: space-between; gap: 25px; color: var(--on-ink); background: var(--ink); font-size: 13px; font-weight: 550; pointer-events: none; box-shadow: 0 4px 0 var(--shadow); }
.magnetic-arrow { width: 23px; height: 23px; border-radius: 50%; background: color-mix(in srgb, currentColor 14%, transparent); display: grid; place-items: center; font-size: 14px; line-height: 1; }
.magnetic-hit[aria-pressed="true"] .magnetic-face { background: var(--accent); color: var(--on-accent); }
.magnetic-hit:active .magnetic-arrow { background: color-mix(in srgb, currentColor 24%, transparent); }`,
    js: `function createSpring(initial, render) {
  const value = Motion.motionValue(initial);
  let target = initial;
  let animation = null;
  const unsubscribe = value.on('change', render);
  render(initial);
  function jump(next) {
    target = next;
    animation?.stop();
    animation = null;
    value.jump(next);
  }
  function to(next, velocity) {
    target = next;
    if (Demo.duration(1) === 0) { jump(next); return Promise.resolve(); }
    // A physics spring retains the motion value's velocity when retargeted.
    const options = { type: 'spring', mass: 1, stiffness: 100, damping: 10 };
    if (Number.isFinite(velocity)) options.velocity = velocity;
    const current = Motion.animate(value, next, options);
    animation = current;
    current.speed = Demo.speed;
    if (Demo.paused || document.hidden) current.pause();
    current.then(() => { if (animation === current) animation = null; });
    return current;
  }
  function sync() {
    if (Demo.reduced) { jump(target); return; }
    if (!animation) return;
    animation.speed = Demo.speed;
    if (Demo.paused || document.hidden) animation.pause();
    else animation.play();
  }
  document.addEventListener('visibilitychange', sync);
  Demo.onSettings(sync);
  Demo.onCleanup(() => {
    animation?.stop();
    unsubscribe();
    value.destroy();
    document.removeEventListener('visibilitychange', sync);
  });
  return {
    to, jump,
    get: () => value.get(),
    set: next => { target = next; value.set(next); },
    stop: () => { animation?.stop(); animation = null; value.stop(); },
  };
}

(function() {
  const button = document.querySelector('.magnetic-hit');
  const face = document.querySelector('.magnetic-face');
  const label = document.querySelector('.magnetic-label');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let x = 0, y = 0, replayVersion = 0;
  function paint() { face.style.transform = 'translate(' + x + 'px, ' + y + 'px)'; }
  const sx = createSpring(0, value => { x = value; paint(); });
  const sy = createSpring(0, value => { y = value; paint(); });
  function neutral() { replayVersion++; sx.to(0); sy.to(0); }
  button.addEventListener('pointermove', event => {
    if (!fine.matches || event.pointerType === 'touch' || Demo.reduced || Demo.paused) return;
    replayVersion++;
    const rect = button.getBoundingClientRect();
    sx.to(Math.max(-12, Math.min(12, (event.clientX - rect.left - rect.width / 2) * .15)));
    sy.to(Math.max(-8, Math.min(8, (event.clientY - rect.top - rect.height / 2) * .15)));
  });
  button.addEventListener('pointerleave', neutral);
  button.addEventListener('pointercancel', neutral);
  button.addEventListener('blur', neutral);
  button.addEventListener('click', () => {
    const selected = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(selected));
    label.textContent = selected ? 'Keep exploring' : 'Stay curious';
  });
  Demo.onReplay(() => {
    const version = ++replayVersion;
    sx.jump(0); sy.jump(0);
    if (Demo.reduced) return;
    sx.to(12).then(() => { if (version === replayVersion) sx.to(0); });
    sy.to(-6).then(() => { if (version === replayVersion) sy.to(0); });
  });
  Demo.onSettings(() => {
    if (Demo.reduced) { replayVersion++; sx.jump(0); sy.jump(0); }
  });
 })();`
  },
  {
    id: "drag-card",
    title: "Flick, catch, repeat",
    category: "expressive",
    description: "A draggable note follows your finger, resists the edges, and springs to a projected snap point.",
    purpose: "Spatial consistency",
    useWhen: "A small horizontal direct-manipulation control, teaching gesture physics, or prototyping a snap behavior before using an established carousel primitive.",
    avoidWhen: "Replacing normal page scrolling, dragging essential reading content for decoration, or shipping a full carousel from this study alone.",
    principle: "Track the pointer directly, preserve the grab offset, project the release velocity, and let a spring finish the gesture.",
    duration: "Direct drag + physics settle",
    easing: "Spring · mass 1 · stiffness 100 · damping 10",
    trigger: "Drag / arrow keys / buttons",
    tech: "Motion",
    color: "peach",
    tags: ["drag","gesture","momentum","spring","snap","touch","segmented"],
    reducedMotion: "Dragging remains a direct response to your finger; release and keyboard changes snap without an animated settle.",
    source: "apple-design/SKILL.md",
    usesMotion: true,
    featured: true,
    html: `<main class="stage drag-stage">
  <div class="drag-track"><span class="snap-guide guide-left" aria-hidden="true"></span><span class="snap-guide guide-middle" aria-hidden="true"></span><span class="snap-guide guide-right" aria-hidden="true"></span>
    <button class="drag-note" aria-label="Move note. Drag sideways, use arrow keys, or press to cycle positions." aria-describedby="drag-help"><span class="note-top"><span>No. 07</span><span aria-hidden="true">${recipeIcon("spark", 16)}</span></span><span class="note-title">Good things<br>take shape.</span></button>
  </div>
  <div class="drag-controls" aria-label="Note position"><button data-snap="-1" aria-pressed="false">Left</button><button data-snap="0" aria-pressed="true">Center</button><button data-snap="1" aria-pressed="false">Right</button></div>
  <p class="demo-label" id="drag-help">Drag sideways, or choose a position.</p>
</main>`,
    css: `.drag-stage { gap: 9px; }
.drag-track { width: 266px; max-width: 100%; height: 116px; position: relative; }
.snap-guide { position: absolute; left: calc(50% - 4px); bottom: 1px; width: 8px; height: 3px; border-radius: 2px; background: var(--line); }
.guide-left { left: 24%; }.guide-right { left: 73%; }
.drag-note { position: absolute; left: calc(50% - 68px); top: 0; width: 136px; height: 103px; padding: 12px 14px; border: 0; border-radius: 12px; color: var(--on-accent); background: var(--accent); box-shadow: 0 3px 0 var(--shadow); text-align: left; cursor: grab; user-select: none; touch-action: pan-y pinch-zoom; }
.drag-note[data-dragging] { cursor: grabbing; background: var(--accent-hover); }
.note-top { display: flex; align-items: center; justify-content: space-between; font-size: 8px; color: var(--on-accent); }
.note-top span:last-child { display: inline-flex; align-items: center; line-height: 1; }
.note-title { display: block; margin-top: 7px; font-size: 16px; line-height: 1.14; letter-spacing: -.025em; font-weight: 600; }
.drag-controls { display: flex; gap: 5px; }
.drag-controls button { min-height: 35px; padding: 7px 14px; border: 0; border-radius: 9px; background: color-mix(in srgb, var(--paper) 60%, transparent); color: var(--muted); font-size: 10px; }
.drag-controls button[aria-pressed="true"] { background: var(--paper); color: var(--ink); box-shadow: 0 2px 0 var(--shadow); }
@media (min-height: 300px) { .drag-track { height: 142px; } .drag-note { top: 13px; } .drag-controls button { min-height: 44px; font-size: 12px; } }`,
    js: `function createSpring(initial, render) {
  const value = Motion.motionValue(initial);
  let target = initial;
  let animation = null;
  const unsubscribe = value.on('change', render);
  render(initial);
  function jump(next) {
    target = next;
    animation?.stop();
    animation = null;
    value.jump(next);
  }
  function to(next, velocity) {
    target = next;
    if (Demo.duration(1) === 0) { jump(next); return Promise.resolve(); }
    // A physics spring retains the motion value's velocity when retargeted.
    const options = { type: 'spring', mass: 1, stiffness: 100, damping: 10 };
    if (Number.isFinite(velocity)) options.velocity = velocity;
    const current = Motion.animate(value, next, options);
    animation = current;
    current.speed = Demo.speed;
    if (Demo.paused || document.hidden) current.pause();
    current.then(() => { if (animation === current) animation = null; });
    return current;
  }
  function sync() {
    if (Demo.reduced) { jump(target); return; }
    if (!animation) return;
    animation.speed = Demo.speed;
    if (Demo.paused || document.hidden) animation.pause();
    else animation.play();
  }
  document.addEventListener('visibilitychange', sync);
  Demo.onSettings(sync);
  Demo.onCleanup(() => {
    animation?.stop();
    unsubscribe();
    value.destroy();
    document.removeEventListener('visibilitychange', sync);
  });
  return {
    to, jump,
    get: () => value.get(),
    set: next => { target = next; value.set(next); },
    stop: () => { animation?.stop(); animation = null; value.stop(); },
  };
}

(function() {
  const card = document.querySelector('.drag-note');
  const track = document.querySelector('.drag-track');
  const buttons = [...document.querySelectorAll('[data-snap]')];
  const spring = createSpring(0, x => { card.style.transform = 'translateX(' + x + 'px)'; });
  let pointer = null, selected = 0, suppressClick = false;
  const bound = () => Math.max(20, (track.clientWidth - card.offsetWidth) / 2 - 12);
  function select(index, velocity) {
    selected = Math.max(-1, Math.min(1, index));
    buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.snap) === selected)));
    return spring.to(selected * bound(), velocity);
  }
  function rubberband(x) {
    const edge = bound();
    if (Math.abs(x) <= edge) return x;
    const over = Math.abs(x) - edge;
    return Math.sign(x) * (edge + (over * 12 * .55) / (12 + .55 * over));
  }
  function release(event, cancelled = false) {
    if (!pointer || (event && event.pointerId !== pointer.id)) return;
    const drag = pointer;
    pointer = null;
    card.removeAttribute('data-dragging');
    if (card.hasPointerCapture(drag.id)) card.releasePointerCapture(drag.id);
    if (!drag.committed) { select(selected, 0); return; }
    suppressClick = !cancelled;
    const history = drag.history;
    const first = history[0], last = history[history.length - 1];
    const stale = performance.now() - last.t > 90;
    const velocity = cancelled || stale ? 0 : Math.max(-1400, Math.min(1400, (last.x - first.x) / Math.max(1, last.t - first.t) * 1000));
    const decay = .99;
    const projected = spring.get() + (velocity / 1000) * decay / (1 - decay);
    const index = Math.abs(projected) < bound() / 2 ? 0 : Math.sign(projected);
    select(index, velocity);
  }
  card.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || pointer) return;
    suppressClick = false;
    spring.stop();
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, start: spring.get(), committed: false, history: [{x: spring.get(), t: performance.now()}] };
    card.setPointerCapture(event.pointerId);
  });
  card.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (!pointer.committed) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { release(event, true); return; }
      if (Math.abs(dx) < 8) return;
      pointer.committed = true;
      card.setAttribute('data-dragging', '');
    }
    const x = rubberband(pointer.start + dx);
    spring.set(x);
    const now = performance.now();
    pointer.history.push({x, t: now});
    while (pointer.history.length > 2 && pointer.history[0].t < now - 80) pointer.history.shift();
  });
  card.addEventListener('pointerup', event => release(event));
  card.addEventListener('pointercancel', event => release(event, true));
  card.addEventListener('lostpointercapture', event => release(event, true));
  card.addEventListener('click', () => {
    if (suppressClick) { suppressClick = false; return; }
    select(selected === 1 ? -1 : selected + 1);
  });
  card.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(event.key)) return;
    event.preventDefault();
    suppressClick = false;
    if (pointer) release(null, true);
    if (event.key === 'ArrowLeft') select(selected - 1);
    if (event.key === 'ArrowRight') select(selected + 1);
    if (event.key === 'Home') select(-1);
    if (event.key === 'End') select(1);
    if (event.key === 'Escape') select(0);
  });
  buttons.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.snap))));
  Demo.onReplay(() => {
    if (pointer) release(null, true);
    spring.jump(-bound());
    select(1, 170);
  });
  Demo.onSettings(() => { if (pointer) release(null, true); });
  let previousWidth = track.clientWidth;
  const resize = new ResizeObserver(() => {
    if (track.clientWidth === previousWidth) return;
    previousWidth = track.clientWidth;
    if (!pointer) spring.jump(selected * bound());
  });
  resize.observe(track);
  Demo.onCleanup(() => {
    resize.disconnect();
    if (!pointer) return;
    const id = pointer.id;
    pointer = null;
    if (card.hasPointerCapture(id)) card.releasePointerCapture(id);
  });
 })();`
  },
  {
    id: "orbit",
    title: "Objects in orbit",
    category: "expressive",
    description: "Three small satellites circle a still center using only CSS transforms and perspective.",
    purpose: "Delight",
    useWhen: "A contained brand illustration, an explanatory hero detail, or a decorative placeholder that is clearly not real progress.",
    avoidWhen: "Full-screen moving backgrounds, behind reading content, or as an endless animation without a pause control.",
    principle: "Use CSS for predetermined motion, linear timing for a constant orbit, and a still composition for reduced motion.",
    duration: "7 s loop",
    easing: "linear",
    trigger: "Ambient / pause / Replay",
    tech: "CSS",
    color: "blue",
    tags: ["3d","orbit","ambient","css","perspective","outline"],
    reducedMotion: "The orbit stops in a deliberate arrangement; all three satellites remain visible.",
    source: "emil-design-eng/SKILL.md",
    html: `<main class="stage orbit-stage">
  <div class="orbit-scene" role="img" aria-label="Three small spheres orbiting a stationary central sphere">
    <div class="orbit-plane"><span class="orbit-track"></span><span class="orbit-satellite satellite-a"></span><span class="orbit-satellite satellite-b"></span><span class="orbit-satellite satellite-c"></span></div>
    <span class="orbit-core"><span></span></span>
  </div>
  <div class="orbit-controls"><p class="demo-label">A small world.</p><button class="orbit-toggle" type="button">Pause orbit</button></div>
</main>`,
    css: `.orbit-stage { gap: 10px; }
.orbit-controls { display: flex; align-items: center; justify-content: center; gap: 12px; max-width: 100%; }
.orbit-toggle { min-height: 44px; padding: 7.5px 10.5px; border: 1.5px solid var(--ink); border-radius: 10px; background: transparent; color: var(--ink); font-size: 11px; font-weight: 550; white-space: nowrap; }
.orbit-toggle:disabled { cursor: default; border-color: var(--line); color: var(--muted); }
.orbit-scene { position: relative; width: 242px; max-width: 100%; height: 138px; perspective: 500px; transform-style: preserve-3d; }
.orbit-plane { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateX(-24deg) rotateZ(-17deg); }
.orbit-track { position: absolute; left: 50%; top: 50%; width: 168px; height: 168px; border: 2px solid var(--line); border-radius: 50%; transform: translate(-50%, -50%) rotateX(90deg); }
.orbit-core { position: absolute; left: calc(50% - 34px); top: calc(50% - 34px); width: 68px; height: 68px; border-radius: 50%; background: var(--accent); display: grid; place-items: center; box-shadow: inset -5px -5px 0 var(--shadow); transform: translateZ(0); }
.orbit-core span { width: 17px; height: 17px; border: 4px solid var(--on-accent); border-radius: 50%; }
.orbit-satellite { position: absolute; top: 50%; left: 50%; width: 22px; height: 22px; border-radius: 50%; animation: small-orbit calc(7s * var(--time-scale)) linear infinite; }
.satellite-a { background: var(--art-1); animation-delay: calc(-.5s * var(--time-scale)); transform: translate(-50%, -50%) rotateY(20deg) translateZ(83px) rotateY(-20deg); }
.satellite-b { background: var(--art-2); width: 15px; height: 15px; animation-delay: calc(-2.83s * var(--time-scale)); transform: translate(-50%, -50%) rotateY(140deg) translateZ(83px) rotateY(-140deg); }
.satellite-c { background: var(--art-3); width: 27px; height: 27px; animation-delay: calc(-5.16s * var(--time-scale)); transform: translate(-50%, -50%) rotateY(260deg) translateZ(83px) rotateY(-260deg); }
@keyframes small-orbit {
  from { transform: translate(-50%, -50%) rotateY(0deg) translateZ(83px) rotateY(0deg); }
  to { transform: translate(-50%, -50%) rotateY(360deg) translateZ(83px) rotateY(-360deg); }
}
:root[data-reduced="true"] .orbit-satellite { animation: none !important; }
@media (prefers-reduced-motion: reduce) { :root:not([data-reduced="false"]) .orbit-satellite { animation: none !important; } }`,
    js: `const satellites = [...document.querySelectorAll('.orbit-satellite')];
const orbitToggle = document.querySelector('.orbit-toggle');
const orbitScene = document.querySelector('.orbit-scene');
function syncOrbitControl() {
  orbitToggle.disabled = Demo.reduced;
  orbitToggle.textContent = Demo.reduced ? 'Motion reduced' : Demo.paused ? 'Play orbit' : 'Pause orbit';
  orbitScene.setAttribute('aria-label', Demo.reduced || Demo.paused
    ? 'Three spheres in a still orbital arrangement around a central sphere'
    : 'Three small spheres orbiting a stationary central sphere');
}
orbitToggle.addEventListener('click', () => {
  if (!Demo.reduced) Demo.setSettings({ paused: !Demo.paused });
});
Demo.onSettings(syncOrbitControl);
Demo.onReplay(() => {
  satellites.forEach(satellite => { satellite.style.animationName = 'none'; });
  void orbitScene.offsetWidth;
  satellites.forEach(satellite => { satellite.style.removeProperty('animation-name'); });
  syncOrbitControl();
});
syncOrbitControl();`
  },
  {
    id: "card-flip",
    title: "Another side to it",
    category: "expressive",
    description: "A small card rotates in depth to reveal a second face, and can reverse mid-turn.",
    purpose: "Spatial consistency",
    useWhen: "An occasional collectible, product preview, or educational study where the front/back metaphor helps explain the relationship.",
    avoidWhen: "Flashcard drilling, essential controls, dense reading content, or frequent navigation. A hidden back must also be easy to discover.",
    principle: "Make the metaphor clear, preserve depth with backface visibility, and use a retargetable transition instead of a restarting keyframe.",
    duration: "500 ms",
    easing: "cubic-bezier(0.77, 0, 0.175, 1)",
    trigger: "Press card",
    tech: "CSS",
    color: "green",
    tags: ["3d","flip","card","transition","perspective"],
    reducedMotion: "The selected face replaces the other without rotating. The button announces which side is available.",
    source: "emil-design-eng/SKILL.md",
    html: `<main class="stage flip-stage">
  <button class="flip-card" data-flipped="false" aria-pressed="false" aria-label="Show the reverse side" aria-describedby="flip-front-content">
    <span class="flip-turn">
      <span class="flip-face flip-front" id="flip-front-content" aria-hidden="false"><span class="flip-heading">There’s more<br>to the story.</span><span class="flip-corner" aria-hidden="true">${recipeIcon("arrow", 18)}</span><span class="flip-footer">Tap to turn</span></span>
      <span class="flip-face flip-back" id="flip-back-content" aria-hidden="true"><span class="flip-kicker">The other side</span><span class="flip-heading">Same object.<br>New perspective.</span><span class="flip-footer">180° · 800px perspective</span><span class="flip-corner" aria-hidden="true">${recipeIcon("undo", 18)}</span></span>
    </span>
  </button>
  <p class="demo-label">Turn it. Turn it back.</p>
</main>`,
    css: `.flip-stage { gap: 17px; }
.flip-card { width: 244px; max-width: 100%; height: 146px; padding: 0; border: 0; background: transparent; border-radius: 15px; perspective: 800px; text-align: left; }
.flip-turn { position: relative; display: block; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform calc(500ms * var(--time-scale)) var(--ease-in-out); }
.flip-card[data-flipped="true"] .flip-turn { transform: rotateY(180deg); }
.flip-face { position: absolute; inset: 0; display: block; padding: 17px 18px; border-radius: 15px; backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden; }
.flip-front { background: var(--accent); color: var(--on-accent); }
.flip-back { background: var(--accent-soft); color: var(--ink); transform: rotateY(180deg); }
.flip-kicker { display: block; font-size: 9px; opacity: .85; }
.flip-heading { display: block; margin-top: 11px; font-size: 21px; font-weight: 550; line-height: 1.12; letter-spacing: -.025em; }
.flip-front .flip-heading { margin-top: 24px; }
.flip-corner { position: absolute; top: 17px; right: 18px; display: grid; place-items: center; width: 18px; height: 18px; color: var(--on-accent); }
.flip-back .flip-corner { color: var(--ink); }
.flip-footer { position: absolute; left: 18px; bottom: 15px; font-size: 9px; opacity: .85; }
:root[data-reduced="true"] .flip-turn { transform: none !important; }
:root[data-reduced="true"] .flip-face { backface-visibility: visible; }
:root[data-reduced="true"] .flip-back { transform: none; display: none; }
:root[data-reduced="true"] .flip-card[data-flipped="true"] .flip-back { display: block; }
:root[data-reduced="true"] .flip-card[data-flipped="true"] .flip-front { visibility: hidden; }`,
    js: `const card = document.querySelector('.flip-card');
const turn = document.querySelector('.flip-turn');
const frontFace = document.querySelector('.flip-front');
const backFace = document.querySelector('.flip-back');
function setFace(flipped) {
  card.dataset.flipped = String(flipped);
  card.setAttribute('aria-pressed', String(flipped));
  card.setAttribute('aria-label', flipped ? 'Show the front side' : 'Show the reverse side');
  frontFace.setAttribute('aria-hidden', String(flipped));
  backFace.setAttribute('aria-hidden', String(!flipped));
  card.setAttribute('aria-describedby', flipped ? backFace.id : frontFace.id);
}
card.addEventListener('click', () => setFace(card.dataset.flipped !== 'true'));
Demo.onReplay(() => {
  turn.style.transition = 'none';
  setFace(false);
  void turn.offsetWidth;
  turn.style.removeProperty('transition');
  setFace(true);
});`
  },
  {
    id: "svg-draw",
    title: "Draw the route",
    category: "expressive",
    description: "A short SVG route draws itself with a normalized stroke, then reveals its destination.",
    purpose: "Explanation",
    useWhen: "A small instructional path, a brand mark reveal, or an illustration that explains a direction.",
    avoidWhen: "Animating live chart data for decoration or painting large, complex paths every frame. Stroke drawing is a deliberate paint-cost exception.",
    principle: "Use a small SVG path and a finite sequence. pathLength keeps the stroke setup independent of the actual curve length.",
    duration: "900 ms",
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    trigger: "Replay",
    tech: "WAAPI",
    color: "sand",
    tags: ["svg","path","drawing","stroke","illustration"],
    reducedMotion: "The complete route, arrow, and destination are visible immediately.",
    source: "emil-design-eng/SKILL.md",
    html: `<main class="stage route-stage">
  <svg class="route-art" viewBox="0 0 260 137" role="img" aria-label="A hand-drawn curved route travels from a starting point to a star">
    <path class="route-guide" d="M24 110 C67 124 54 58 95 69 S106 121 147 87 S177 26 224 35"/>
    <circle class="route-start" cx="24" cy="110" r="5"/>
    <path class="route-line" pathLength="1" d="M24 110 C67 124 54 58 95 69 S106 121 147 87 S177 26 224 35"/>
    <path class="route-arrow" pathLength="1" d="m214 25 12 10-13 8"/>
    <g class="route-star"><path d="M226 8v12m-6-6h12"/><circle cx="244" cy="31" r="2"/></g>
  </svg>
  <div class="route-caption"><span>A starting point</span><span>Somewhere new</span></div>
</main>`,
    css: `.route-stage { gap: 7px; }
.route-art { width: 260px; max-width: 100%; height: 137px; overflow: visible; fill: none; }
.route-guide { stroke: var(--line); stroke-width: 2; stroke-dasharray: 3 6; stroke-linecap: round; }
.route-start { fill: var(--paper); stroke: var(--accent); stroke-width: 2.5; }
.route-line { stroke: var(--accent); stroke-width: 4; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.route-arrow { stroke: var(--accent); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 0; }
.route-star { stroke: var(--art-1); stroke-width: 2; stroke-linecap: round; }
.route-star circle { fill: var(--art-1); stroke: none; }
.route-caption { width: min(100%, 246px); display: flex; justify-content: space-between; gap: 20px; font-size: 10px; color: var(--muted); }`,
    js: `(function() {
  const line = document.querySelector('.route-line');
  const arrow = document.querySelector('.route-arrow');
  const star = document.querySelector('.route-star');
  let animations = [];
  function stop() { animations.forEach(animation => animation.cancel()); animations = []; }
  Demo.onReplay(() => {
    stop();
    animations = [
      Demo.animate(line, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }),
      Demo.animate(arrow, [{ strokeDashoffset: 1, opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }], { duration: 180, delay: 650, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }),
      Demo.animate(star, [{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: 700, easing: 'ease' }),
    ];
  });
  Demo.onSettings(() => {
    if (!Demo.reduced) return;
    stop();
    line.style.strokeDashoffset = '0';
    arrow.style.strokeDashoffset = '0';
    arrow.style.opacity = '1';
    star.style.opacity = '1';
  });
  Demo.onCleanup(stop);
 })();`
  }
];
