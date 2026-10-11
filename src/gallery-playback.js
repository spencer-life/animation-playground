import { addThemeParams } from './theme.mjs';

// Loading and watching an animation are different events. A nearby iframe is
// prepared while paused; its finite demonstration starts when it can be seen.
export function createGalleryPlayback({ frames, visibleFrames, getTheme, getSettings, send }) {
  const records = new Map([...frames].map(frame => [frame, {
    loaded: frame.hasAttribute('src'), ready: false, pending: false, manual: false,
  }]));
  let disconnected = false;

  function settingsFor(frame, record) {
    const { blocked = false, ...settings } = getSettings(frame);
    return {
      ...settings,
      paused: document.hidden || blocked || !visibleFrames.has(frame) || (!record.manual && settings.paused),
    };
  }

  function syncFrame(frame) {
    const record = records.get(frame);
    if (disconnected || !record?.loaded || !frame.isConnected) return;
    const settings = settingsFor(frame, record);
    send(frame, { type: 'playground:theme', theme: getTheme() });
    if (record.ready && record.pending && !settings.paused) {
      record.pending = false;
      // Prepare the current preferences without the runtime's first-resume
      // replay, then request exactly one reset-and-play sequence.
      send(frame, { type: 'playground:settings', settings: { ...settings, paused: true } });
      send(frame, { type: 'playground:replay' });
    } else {
      send(frame, { type: 'playground:settings', settings: { ...settings, paused: !record.ready || settings.paused } });
    }
  }

  function load(frame) {
    const record = records.get(frame);
    if (disconnected || !record || record.loaded || !frame.isConnected) return;
    const settings = getSettings(frame);
    const source = addThemeParams(new URL(frame.dataset.src, location.href), getTheme());
    source.searchParams.set('reduced', String(settings.reduced));
    source.searchParams.set('paused', 'true');
    source.searchParams.set('speed', String(settings.speed));
    source.searchParams.set('preview', '1');
    record.loaded = true;
    // Proximity is already controlled here. A second browser lazy-load gate
    // would make readiness dependent on a different, hidden threshold.
    frame.loading = 'eager';
    frame.src = source.href;
    preloadObserver.unobserve(frame);
  }

  const preloadObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) load(entry.target);
  }, { rootMargin: '360px 0px', threshold: 0 });

  const viewportObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const frame = entry.target;
      const record = records.get(frame);
      if (disconnected || !record || !frame.isConnected) continue;
      if (entry.isIntersecting && entry.intersectionRatio >= .25) {
        if (!visibleFrames.has(frame)) {
          visibleFrames.add(frame);
          record.pending = true;
        }
        load(frame);
        syncFrame(frame);
      } else if (!entry.isIntersecting && visibleFrames.delete(frame)) {
        record.manual = false;
        syncFrame(frame);
      }
      // Once started, keep playing until the stage leaves completely. This
      // avoids restarting a sequence as scrolling wavers around 25 percent.
    }
  }, { threshold: [0, .25] });

  for (const [frame, record] of records) {
    // The child's verified ready message is the authority for script readiness.
    // A load event only reapplies preferences; either event order is safe.
    record.onLoad = () => syncFrame(frame);
    frame.addEventListener('load', record.onLoad);
    preloadObserver.observe(frame);
    viewportObserver.observe(frame);
  }

  return {
    ready(frame) {
      const record = records.get(frame);
      if (disconnected || !record?.loaded || !frame.isConnected) return false;
      record.ready = true;
      syncFrame(frame);
      return true;
    },
    sync() {
      for (const [frame, record] of records) {
        // A new global playback, visibility, or reduction choice supersedes a
        // one-card Replay without changing the persisted gallery preference.
        record.manual = false;
        syncFrame(frame);
      }
    },
    replay(frame) {
      const record = records.get(frame);
      if (disconnected || !record || !frame.isConnected || document.hidden || getSettings(frame).blocked) return false;
      record.manual = true;
      record.pending = true;
      if (!visibleFrames.has(frame)) frame.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      load(frame);
      syncFrame(frame);
      return true;
    },
    disconnect() {
      if (disconnected) return;
      preloadObserver.disconnect();
      viewportObserver.disconnect();
      for (const [frame, record] of records) {
        frame.removeEventListener('load', record.onLoad);
        visibleFrames.delete(frame);
        if (record.loaded && frame.isConnected) send(frame, { type: 'playground:settings', settings: { paused: true } });
      }
      disconnected = true;
      records.clear();
    },
  };
}
