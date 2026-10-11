/* Animation Playground runtime. Embedded in every portable example. MIT. */
(() => {
  const root = document.documentElement;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const params = new URLSearchParams(location.search);
  const settings = {
    reduced: params.has('reduced') ? params.get('reduced') === 'true' : media.matches,
    paused: params.get('paused') === 'true',
    speed: [0.25, 0.5, 1].includes(Number(params.get('speed'))) ? Number(params.get('speed')) : 1,
  };
  const replayCallbacks = [];
  const settingsCallbacks = [];
  const cleanups = [];
  const owned = new Set();
  let keyboard = false;
  let initializing = true;
  let hasPlayed = false;
  let explicitlyReduced = params.has('reduced');
  let previewScroll = null;
  let previewScrollFrame = 0;

  function suspendPreviewScroll() {
    cancelAnimationFrame(previewScrollFrame);
    previewScrollFrame = 0;
    if (previewScroll) previewScroll.lastTime = null;
  }
  function stopPreviewScroll() {
    suspendPreviewScroll();
    previewScroll = null;
  }
  function previewScrollEnd({ pane, target }) {
    const range = pane.scrollHeight - pane.clientHeight;
    if (!target) return range;
    const frame = pane.getBoundingClientRect();
    const content = target.getBoundingClientRect();
    const centered = pane.scrollTop + content.top - frame.top - pane.clientTop - (pane.clientHeight - content.height) / 2;
    return Math.max(0, Math.min(range, centered));
  }
  function syncPreviewScroll() {
    if (!previewScroll) return;
    if (settings.reduced) {
      const pane = previewScroll.pane;
      const end = previewScrollEnd(previewScroll);
      stopPreviewScroll();
      pane.scrollTop = end;
    } else if (settings.paused || document.hidden) {
      suspendPreviewScroll();
    } else if (!previewScrollFrame) {
      previewScrollFrame = requestAnimationFrame(advancePreviewScroll);
    }
  }
  function advancePreviewScroll(now) {
    previewScrollFrame = 0;
    const sequence = previewScroll;
    if (!sequence) return;
    if (settings.paused || settings.reduced || document.hidden) { syncPreviewScroll(); return; }
    if (sequence.lastTime !== null) sequence.elapsed += (now - sequence.lastTime) * settings.speed;
    sequence.lastTime = now;
    // A short look at the opening, followed by one linear native-scroll pass.
    // This drives the real scroll listeners/observers and then stops completely.
    const progress = Math.max(0, Math.min(1, (sequence.elapsed - 240) / 1800));
    sequence.pane.scrollTop = previewScrollEnd(sequence) * progress;
    if (progress === 1) stopPreviewScroll();
    else syncPreviewScroll();
  }
  function startPreviewScroll() {
    stopPreviewScroll();
    if (params.get('preview') !== '1') return;
    const pane = document.querySelector('[data-preview-scroll]');
    if (!pane || pane.scrollHeight <= pane.clientHeight) return;
    previewScroll = { pane, target: pane.querySelector('[data-preview-scroll-target]'), elapsed: 0, lastTime: null };
    syncPreviewScroll();
  }
  function cssState() {
    root.dataset.reduced = String(settings.reduced);
    root.dataset.paused = String(settings.paused);
    root.dataset.keyboard = String(keyboard);
    root.style.setProperty('--time-scale', String(1 / settings.speed));
  }
  function syncAnimations() {
    for (const animation of document.getAnimations()) {
      if (settings.reduced) {
        try { animation.finish(); } catch { animation.cancel(); }
      } else if (settings.paused) {
        if (animation.playState === 'running') animation.pause();
      } else if (animation.playState === 'paused') {
        animation.play();
      }
    }
  }
  const inertAnimation = () => ({ finished: Promise.resolve(), cancel() {}, pause() {}, play() {} });
  function finalFrame(frames) {
    if (Array.isArray(frames)) return frames.at(-1) || {};
    return Object.fromEntries(Object.entries(frames).map(([key, value]) => [key, Array.isArray(value) ? value.at(-1) : value]));
  }
  function animate(element, frames, options = {}) {
    if (!element) return inertAnimation();
    if (settings.reduced || keyboard) {
      const final = finalFrame(frames);
      for (const [property, value] of Object.entries(final)) {
        if (!['offset', 'easing', 'composite'].includes(property) && value !== undefined && value !== null) element.style[property] = value;
      }
      return inertAnimation();
    }
    const animation = element.animate(frames, {
      fill: 'both', ...options,
      duration: (options.duration ?? 200) / settings.speed,
      delay: (options.delay ?? 0) / settings.speed,
    });
    owned.add(animation);
    animation.finished.catch(() => {}).finally(() => owned.delete(animation));
    if (settings.paused) animation.pause();
    return animation;
  }
  function replay() {
    // Replay is an explicit request to study motion, including from a keyboard.
    keyboard = false;
    hasPlayed = true;
    stopPreviewScroll();
    for (const animation of owned) animation.cancel();
    owned.clear();
    settings.paused = false;
    cssState();
    for (const callback of replayCallbacks) callback();
    startPreviewScroll();
    syncAnimations();
  }
  function setSettings(next, { explicit = true } = {}) {
    const previous = { ...settings };
    if (typeof next.reduced === 'boolean') { settings.reduced = next.reduced; if (explicit) explicitlyReduced = true; }
    if (typeof next.paused === 'boolean') settings.paused = next.paused;
    if ([0.25, 0.5, 1].includes(next.speed)) settings.speed = next.speed;
    const changed = Object.keys(settings).some(key => settings[key] !== previous[key]);
    if (!changed) { cssState(); syncAnimations(); syncPreviewScroll(); return; }
    // Existing WAAPI timelines retain their position when the speed changes.
    if (previous.speed !== settings.speed) {
      for (const animation of owned) animation.updatePlaybackRate(animation.playbackRate * settings.speed / previous.speed);
    }
    cssState();
    for (const callback of settingsCallbacks) callback({ ...settings }, previous);
    // Frames loaded in a paused gallery have not created a sequence yet.
    // Existing scenes resume their native animations and remaining timers.
    if (previous.paused && !settings.paused && !hasPlayed) { replay(); return; }
    syncAnimations();
    syncPreviewScroll();
  }
  window.Demo = {
    get reduced() { return settings.reduced; },
    get paused() { return settings.paused; },
    get speed() { return settings.speed; },
    duration(ms) { return settings.reduced || keyboard ? 0 : ms / settings.speed; },
    animate,
    onReplay(callback) { replayCallbacks.push(callback); },
    onSettings(callback) { settingsCallbacks.push(callback); },
    onCleanup(callback) { cleanups.push(callback); },
    replay, setSettings,
  };
  cssState();
  document.addEventListener('keydown', () => { stopPreviewScroll(); keyboard = true; cssState(); }, true);
  function pointerInput() {
    if (!keyboard) return;
    keyboard = false;
    cssState();
  }
  document.addEventListener('pointerdown', () => { stopPreviewScroll(); pointerInput(); }, true);
  // A wheel or a deliberate hover movement can follow keyboard navigation
  // without a click. Recognize that input while leaving native scrolling alone.
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch' && (event.movementX || event.movementY)) pointerInput();
  }, { capture: true, passive: true });
  document.addEventListener('wheel', () => { stopPreviewScroll(); pointerInput(); }, { capture: true, passive: true });
  for (const name of ['animationstart', 'transitionrun']) document.addEventListener(name, () => {
    if (settings.paused || settings.reduced) requestAnimationFrame(syncAnimations);
  }, true);
  window.addEventListener('message', event => {
    if (event.source !== window.parent || !event.data || typeof event.data !== 'object') return;
    if (event.data.type === 'playground:settings') setSettings(event.data.settings || {});
    if (event.data.type === 'playground:replay') replay();
  });
  media.addEventListener('change', () => { if (!explicitlyReduced) setSettings({ reduced: media.matches }, { explicit: false }); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      for (const animation of document.getAnimations()) if (animation.playState === 'running') animation.pause();
    } else syncAnimations();
    syncPreviewScroll();
  });
  window.addEventListener('pagehide', event => {
    if (event.persisted) return; // The browser freezes back/forward-cache pages.
    stopPreviewScroll();
    cleanups.forEach(callback => callback());
    owned.forEach(animation => animation.cancel());
  });
  window.addEventListener('load', () => {
    if (!initializing) return;
    initializing = false;
    if (!settings.paused) replay();
    else syncAnimations();
    if (window.parent !== window) window.parent.postMessage({ type: 'playground:ready' }, '*');
  }, { once: true });
})();
