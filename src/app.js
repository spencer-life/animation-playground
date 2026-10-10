import { palettes, accents, defaults, normalizeTheme, resolveTheme, themeCss, themeFromParams, addThemeParams, themedCode, tokenExport } from './theme.mjs';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const paths = {
  search: '<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 4.2 4.2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  bookmark: '<path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4-6 4Z"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  external: '<path d="M14 3h7v7m0-7L10 14m-1-9H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  github: '<path d="M9 19c-4.3 1.3-4.3-2.1-6-2.6m12 5v-3.8a3.3 3.3 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.9A5.5 5.5 0 0 0 18.8 4a5.1 5.1 0 0 0-.1-3.5S17.6.2 15 2a13.4 13.4 0 0 0-7 0C5.4.2 4.3.5 4.3.5A5.1 5.1 0 0 0 4.2 4a5.5 5.5 0 0 0-1.5 4.1c0 5.4 3.2 6.6 6.2 6.9A3.3 3.3 0 0 0 8 17.6V22" transform="translate(1 1) scale(.9)"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  replay: '<path d="M3 10a9 9 0 1 1 2.5 8M3 4v6h6"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  link: '<path d="m10 13 4-4m-5 7-1.5 1.5a3.5 3.5 0 0 1-5-5L6 9m9-1 1.5-1.5a3.5 3.5 0 0 1 5 5L18 15"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
  book: '<path d="M12 6c-3-3-7-3-10-2v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/>',
  motion: '<path d="M3 7h7M3 12h4M3 17h7"/><circle cx="16" cy="12" r="5"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
};
const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
const brand = '<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span>Animation <small>Playground</small></span>';
const categories = [
  ['feedback', 'Feedback'], ['navigation', 'Navigation'], ['layout', 'Layout'],
  ['text', 'Text'], ['entrances', 'Entrances'], ['expressive', 'Expressive'],
];
const getStored = (key, fallback) => { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } };
const saveStored = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
const storedSaves = getStored('ap-saved', []);
const state = {
  recipes: [], favorites: new Set(Array.isArray(storedSaves) ? storedSaves.filter(x => typeof x === 'string') : []),
  collections: [], collection: 'all', intent: 'all', tech: 'all', complexity: 'all', sort: 'curated',
  colorTheme: normalizeTheme(getStored('ap-palette', defaults)), appearance: 'auto', tokenSystem: 'values',
  themeOpen: !matchMedia('(max-width: 780px)').matches,
  reduced: getStored('ap-reduced', systemMotion.matches) === true,
  playing: getStored('ap-playing', true) !== false,
  speed: 1, detailPaused: false, inspectorTab: 'code', codeTab: 'css',
  selected: null, category: 'all', query: '', detail: null, request: 0,
};
let lastGallery = './';
let announcementTimer;
let frameObserver;
let requestController;
const cache = new Map();
const visibleFrames = new Set();
const app = $('#app');

function announce(message) {
  clearTimeout(announcementTimer);
  const element = $('#announcement');
  element.textContent = message;
  element.classList.add('visible');
  announcementTimer = setTimeout(() => element.classList.remove('visible'), 3800);
}
function routeUrl(changes) {
  const url = new URL(location.href);
  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === '' || value === 'all') url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  return url;
}
function navigate(url, { replace = false, scroll = true } = {}) {
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
  renderRoute();
  $('#main')?.focus({preventScroll:true});
  if (scroll) window.scrollTo(0, 0);
}
function readRoute() {
  const params = new URLSearchParams(location.search);
  state.selected = params.get('animation');
  state.category = params.get('category') || 'all';
  if (!['all', 'saved', ...categories.map(([id]) => id)].includes(state.category)) state.category = 'all';
  state.query = params.get('q') || '';
  const choice = (key, values, fallback = 'all') => values.includes(params.get(key)) ? params.get(key) : fallback;
  state.collection = choice('collection', state.collections.map(item => item.id));
  state.intent = choice('intent', ['everyday', 'expressive']);
  state.tech = choice('tech', ['CSS', 'WAAPI', 'Motion']);
  state.complexity = choice('complexity', ['starter', 'intermediate']);
  state.sort = choice('sort', ['curated', 'az'], 'curated');
  state.colorTheme = themeFromParams(params, normalizeTheme(getStored('ap-palette', defaults)));
  const savedAppearance = getStored('ap-appearance', 'auto');
  state.appearance = choice('mode', ['auto', 'light', 'dark'], ['auto', 'light', 'dark'].includes(savedAppearance) ? savedAppearance : 'auto');
  return params.get('view') === 'notes' ? 'notes' : state.selected ? 'detail' : 'gallery';
}
function selectedTheme() {
  return normalizeTheme({ ...state.colorTheme, mode: state.appearance === 'auto' ? document.documentElement.dataset.theme : state.appearance });
}
function recipeTokens(recipe) { return resolveTheme(selectedTheme(), recipe?.color || 'lavender'); }
function exampleUrl(recipe) { return addThemeParams(new URL(`./${recipe.example || `examples/${recipe.id}.html`}`, location.href), selectedTheme()); }
function fullCode(recipe) { return themedCode(recipe.code, selectedTheme(), recipe.color); }
function clearFilterParams() { return { animation:null, category:null, collection:null, intent:null, tech:null, complexity:null, sort:null, q:null, view:null }; }
function themeStudio() {
  const theme = selectedTheme();
  const options = (items, value) => items.map(item => `<option value="${item.id}" ${item.id === value ? 'selected' : ''}>${escape(item.title)}</option>`).join('');
  const appearance = state.appearance === 'auto' ? 'Match site' : theme.mode === 'dark' ? 'Dark' : 'Light';
  const summary = [palettes.find(item => item.id === theme.palette).title, appearance, theme.palette === 'original' ? '' : theme.palette === 'custom' ? theme.custom : accents.find(item => item.id === theme.accent).title].filter(Boolean).join(' · ');
  return `<details class="theme-studio" ${state.themeOpen ? 'open' : ''}>
    <summary class="theme-studio-heading"><div><h2 id="theme-studio-title">Preview in your colors</h2><p><span class="theme-summary-value">${escape(summary)}</span><span class="theme-summary-help">One palette, from the live demo to the code you take.</span></p></div><span class="theme-summary-end"><span class="palette-swatches" aria-hidden="true"></span>${icon('arrow','theme-chevron')}</span></summary>
    <div class="theme-fields">
      <label class="theme-field">Palette<select id="palette-select">${options(palettes, theme.palette)}</select></label>
      <label class="theme-field">Appearance<select id="appearance-select">${options([{id:'auto',title:'Match site'},{id:'light',title:'Light'},{id:'dark',title:'Dark'}], state.appearance)}</select></label>
      <label class="theme-field" id="accent-field" ${theme.palette === 'custom' ? 'hidden' : ''}>Accent<select id="accent-select" ${theme.palette === 'original' ? 'disabled' : ''}>${options(accents, theme.accent)}</select></label>
      <div class="custom-field" id="custom-field" ${theme.palette === 'custom' ? '' : 'hidden'}><label class="theme-field">Accent color<input type="color" id="custom-color" value="${theme.custom}"></label><label class="theme-field">Hex<input id="custom-hex" type="text" value="${theme.custom}" maxlength="7" pattern="#[0-9a-fA-F]{6}" spellcheck="false" aria-describedby="theme-help"></label></div>
      <button class="button theme-copy" data-action="copy-tokens" ${theme.palette === 'original' && !state.detail ? 'disabled title="Open a study to copy its individual color family, or choose a project palette."' : ''}>${icon('copy')} Copy tokens</button>
    </div><p class="theme-help" id="theme-help">${theme.palette === 'original' ? 'Each study keeps its own color family. Choose a project palette to compare the whole collection.' : theme.palette === 'custom' ? 'Use a six-digit hex color. Button text automatically uses a readable foreground.' : theme.palette === 'geist' ? 'Geist-inspired neutral surfaces. The Colors tab includes mappings to your existing Geist tokens.' : 'Radix Slate surfaces with your chosen accent. The Colors tab includes native Radix token mappings.'}</p>
  </details>`;
}
function refreshThemePreview() {
  for (const sample of $$('.sample')) {
    const recipe = state.recipes.find(item => item.id === sample.dataset.recipe);
    $('.sample-stage', sample)?.style.setProperty('--sample-bg', recipeTokens(recipe)['demo-bg']);
  }
  if (state.detail) $('.detail-stage')?.style.setProperty('--sample-bg', recipeTokens(state.detail)['demo-bg']);
  const tokens = recipeTokens(state.detail);
  const swatches = $('.palette-swatches');
  if (swatches) swatches.innerHTML = ['demo-bg','paper','accent','art-2','art-3'].map(name => `<i style="background:${tokens[name]}"></i>`).join('');
  for (const frame of $$('iframe[data-preview], #detail-frame')) sendFrame(frame, { type: 'playground:theme', theme: selectedTheme() });
  if (state.detail) renderInspector();
}
function setColorTheme(patch) {
  state.themeOpen = $('.theme-studio')?.open ?? state.themeOpen;
  if (patch.appearance) state.appearance = patch.appearance;
  state.colorTheme = normalizeTheme({ ...state.colorTheme, ...patch });
  saveStored('ap-palette', state.colorTheme);
  saveStored('ap-appearance', state.appearance);
  const url = addThemeParams(new URL(location.href), selectedTheme());
  url.searchParams.set('mode', state.appearance);
  history.replaceState({}, '', url);
  const focusId = document.activeElement?.id;
  const selectionStart = document.activeElement?.selectionStart;
  $('.theme-studio')?.insertAdjacentHTML('afterend', themeStudio());
  $('.theme-studio')?.remove();
  refreshThemePreview();
  if (focusId) {
    const next = document.getElementById(focusId);
    next?.focus({ preventScroll: true });
    if (next?.type === 'text' && selectionStart !== null) next.setSelectionRange(selectionStart, selectionStart);
  }
}
function collectionLinks() {
  return `<nav class="collection-strip" aria-label="Project collections">${state.collections.map(item => `<button class="collection-link" data-collection="${item.id}" aria-pressed="${state.collection === item.id}">${icon(item.icon)}<span>${escape(item.title)}</span><span class="collection-count">${state.recipes.filter(recipe => recipe.collections.includes(item.id)).length}</span></button>`).join('')}</nav>`;
}
function filterBar() {
  const select = (id, label, values, selected) => `<label class="filter-select"><span class="sr-only">${label}</span><select id="${id}" aria-label="${label}">${values.map(([value, text]) => `<option value="${value}" ${value === selected ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`;
  const filtered = state.collection !== 'all' || state.intent !== 'all' || state.tech !== 'all' || state.complexity !== 'all' || state.category !== 'all' || state.query;
  return `<div class="discovery-filters"><div class="intent-filter" role="group" aria-label="Animation purpose">${[['all','All motion'],['everyday','Everyday UI'],['expressive','Expressive']].map(([id,title]) => `<button data-intent="${id}" aria-pressed="${state.intent === id}">${title}</button>`).join('')}</div><div class="filter-selects">
    ${select('tech-filter','Filter by technology',[['all','Any technology'],['CSS','CSS only'],['WAAPI','Web Animations API'],['Motion','Motion springs']],state.tech)}
    ${select('complexity-filter','Filter by complexity',[['all','Any complexity'],['starter','Starter friendly'],['intermediate','Intermediate']],state.complexity)}
    ${select('sort-filter','Sort animations',[['curated','Curated order'],['az','Name A–Z']],state.sort)}
    ${filtered ? `<button class="quiet-button reset-filters" data-action="reset">Clear filters ${icon('close','sm')}</button>` : ''}
  </div></div>`;
}
function renderShell() {
  app.innerHTML = `
    <header class="topbar" id="mobile-header"></header>
    <aside class="rail" aria-label="Animation categories">
      <a class="brand" href="./" data-home>${brand}</a>
      <nav class="rail-nav" id="rail-nav" aria-label="Collection"></nav>
      <div class="rail-bottom">
        <a class="nav-item" href="?view=notes" data-route="notes">${icon('book')} Motion notes</a>
        <a class="nav-item" href="./catalog.json" download>${icon('download')} Get the catalog</a>
        <p class="rail-note">Original examples, informed by <a href="https://github.com/emilkowalski/skills" target="_blank" rel="noopener noreferrer">Emil Kowalski’s skills.</a><br>Made to be taken apart.</p>
      </div>
    </aside>
    <div class="workspace">
      <header class="topbar" id="desktop-header"></header>
      <main class="main" id="main" tabindex="-1"></main>
    </div>
    <dialog class="clipboard-dialog" id="clipboard-dialog" aria-labelledby="clipboard-title">
      <h2 id="clipboard-title">Copy manually</h2><p>Your browser couldn’t grant clipboard access. Select and copy the text below.</p>
      <label class="sr-only" for="clipboard-text">Text to copy</label><textarea id="clipboard-text" readonly></textarea>
      <form method="dialog"><button class="button primary">Done</button></form>
    </dialog>`;
  const header = `<a class="brand mobile-brand" href="./" data-home>${brand}</a>
    <div class="search">${icon('search')}<label class="sr-only" for="search-input">Search animations</label><input id="search-input" type="search" placeholder="Find an animation…" autocomplete="off" spellcheck="false" maxlength="240"><kbd aria-hidden="true">/</kbd></div>
    <div class="topbar-actions"><a class="text-link" href="https://github.com/spencer-life/animation-playground" target="_blank" rel="noopener noreferrer" aria-label="View Animation Playground on GitHub">${icon('github')} GitHub ${icon('external','sm')}</a>
    <button class="icon-button" data-action="theme" aria-label="Switch color theme" title="Switch color theme">${icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon')}</button>
    <a class="icon-button mobile-notes" href="?view=notes" data-route="notes" aria-label="Read motion notes" title="Motion notes">${icon('book')}</a></div>`;
  $('#desktop-header').innerHTML = header;
  // Move one real header across the layout instead of duplicating inputs/IDs.
  const mobileMedia = matchMedia('(max-width: 780px)');
  const placeHeader = () => {
    const destination = mobileMedia.matches ? $('#mobile-header') : $('#desktop-header');
    const other = mobileMedia.matches ? $('#desktop-header') : $('#mobile-header');
    while (other.firstChild) destination.appendChild(other.firstChild);
    destination.hidden = false;
    other.hidden = true;
  };
  mobileMedia.addEventListener('change', placeHeader);
  placeHeader();
  $('#search-input').addEventListener('input', event => {
    state.query = event.target.value;
    const url = routeUrl({ animation: null, view: null, q: state.query });
    history.replaceState({}, '', url);
    state.selected = null;
    renderGallery();
    renderNav();
  });
}
function renderNav() {
  const view = readRoute();
  const nav = (id, label, glyph, count) => `<a href="${id === 'all' ? './' : `?category=${id}`}" class="nav-item" data-category="${id}" ${view === 'gallery' && state.category === id ? 'aria-current="page"' : ''}>${glyph}<span>${label}</span><span class="count">${count}</span></a>`;
  $('#rail-nav').innerHTML = nav('all','All animations',icon('grid'),state.recipes.length) + nav('saved','Saved',icon('bookmark'),state.favorites.size) + '<div class="nav-separator" aria-hidden="true"></div>' + categories.map(([id,label]) => nav(id,label,`<span class="category-dot ${id}" aria-hidden="true"></span>`,state.recipes.filter(recipe => recipe.category === id).length)).join('');
  $$('[data-route="notes"]').forEach(link => view === 'notes' ? link.setAttribute('aria-current','page') : link.removeAttribute('aria-current'));
  $('#search-input').value = state.query;
}
function selectedRecipes() {
  const words = state.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return state.recipes.filter(recipe => {
    const matchesCategory = state.category === 'all' || (state.category === 'saved' ? state.favorites.has(recipe.id) : recipe.category === state.category);
    const matchesCollection = state.collection === 'all' || recipe.collections.includes(state.collection);
    const matchesIntent = state.intent === 'all' || recipe.intent === state.intent;
    const matchesTech = state.tech === 'all' || recipe.tech === state.tech;
    const matchesComplexity = state.complexity === 'all' || recipe.complexity === state.complexity;
    const collectionWords = state.collections.filter(item => recipe.collections.includes(item.id)).map(item => item.title + ' ' + item.description);
    const haystack = [recipe.title,recipe.description,recipe.category,recipe.tech,recipe.purpose,recipe.useWhen,recipe.intent,recipe.complexity,...recipe.tags,...collectionWords].join(' ').toLowerCase();
    return matchesCategory && matchesCollection && matchesIntent && matchesTech && matchesComplexity && words.every(word => haystack.includes(word));
  }).sort((a, b) => {
    if (state.sort === 'az') return a.title.localeCompare(b.title);
    const featured = state.collections.find(item => item.id === state.collection)?.featured || [];
    const ai = featured.indexOf(a.id), bi = featured.indexOf(b.id);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
function card(recipe) {
  const saved = state.favorites.has(recipe.id);
  return `<article class="sample" data-recipe="${recipe.id}">
    <div class="sample-stage" style="--sample-bg:${recipeTokens(recipe)['demo-bg']}">
      <iframe data-preview="${recipe.id}" data-src="./${recipe.example}" title="${escape(recipe.title)} animation preview" tabindex="-1" aria-hidden="true" sandbox="allow-scripts" loading="lazy"></iframe>
      <button class="sample-open" data-open="${recipe.id}" aria-label="Explore ${escape(recipe.title)}"><span class="open-label">Try it ${icon('arrow','sm')}</span></button>
    </div>
    <div class="sample-meta"><div class="sample-copy"><button class="sample-title" data-open="${recipe.id}">${escape(recipe.title)}</button><p class="sample-description">${escape(recipe.description)}</p><div class="sample-bottom"><span>${escape(recipe.tech)}</span><span>${escape(recipe.duration)}</span><span>${recipe.intent === 'everyday' ? 'Everyday UI' : 'Expressive'}</span></div></div>
    <button class="icon-button sample-save" data-save="${recipe.id}" aria-label="${saved ? 'Unsave' : 'Save'} ${escape(recipe.title)}" aria-pressed="${saved}" title="${saved ? 'Remove from saved' : 'Save animation'}">${icon('bookmark')}</button></div>
  </article>`;
}
function footer() {
  return `<footer class="gallery-footer"><span>Good motion is a collection of small decisions.</span><div class="footer-links"><a href="?view=notes" data-route="notes">Read the motion notes</a><a href="./llms-full.txt" target="_blank">Agent reference ${icon('external','sm')}</a></div></footer>`;
}
function renderGallery() {
  clearFrames();
  requestController?.abort();
  state.detail = null;
  state.request++;
  lastGallery = location.pathname + location.search;
  const results = selectedRecipes();
  const collection = state.collections.find(item => item.id === state.collection);
  const label = collection?.title || (state.category === 'all' ? 'All animations' : state.category === 'saved' ? 'Your saved animations' : categories.find(([id]) => id === state.category)?.[1]);
  $('#main').innerHTML = `<section class="intro hub-intro"><div><h1>Motion worth borrowing.</h1><p>Everyday interactions. Distinctive details. Find the right motion for your next project, then make it yours.</p></div><div class="intro-aside">${state.recipes.length} working examples<br>Complete, portable source</div></section>
    ${collectionLinks()}${themeStudio()}
    <section aria-label="Animation library">${filterBar()}<div class="library-toolbar"><div class="library-heading"><h2>${escape(state.query ? 'Search results' : label)}</h2><span class="result-count" role="status">${results.length} ${results.length === 1 ? 'example' : 'examples'}</span></div><div class="toolbar-controls">
      <button class="quiet-button" data-action="previews" aria-pressed="${state.playing}" title="${state.playing ? 'Pause' : 'Play'} gallery previews">${icon(state.playing ? 'pause' : 'play')}<span>${state.playing ? 'Pause' : 'Play'}<span class="label-wide"> previews</span></span></button>
      <button class="quiet-button" data-action="reduced" aria-pressed="${state.reduced}" title="Toggle reduced-motion mode">${icon('motion')}<span>${state.reduced ? 'Reduced' : 'Full motion'}</span></button>
    </div></div>
    ${collection && !state.query ? `<p class="collection-description">${escape(collection.description)}</p>` : ''}
    ${results.length ? `<div class="gallery">${results.map(card).join('')}</div>` : `<div class="empty-state">${icon(state.category === 'saved' && !state.query ? 'bookmark' : 'search')}<h2>${state.category === 'saved' && !state.query ? 'Keep the good ones.' : 'No matching animations.'}</h2><p>${state.category === 'saved' && !state.query ? 'Tap the bookmark beside any animation. Your collection stays here in this browser.' : 'Try “button”, “dashboard”, or “reveal”, or clear your filters to see the whole collection.'}</p><button class="button" data-action="reset">Browse all animations ${icon('arrow')}</button></div>`}</section>${footer()}`;
  const strip = $('.collection-strip');
  const activeCollection = $('.collection-link[aria-pressed="true"]', strip);
  if (activeCollection && strip.scrollWidth > strip.clientWidth) {
    const bounds = strip.getBoundingClientRect();
    const activeBounds = activeCollection.getBoundingClientRect();
    if (activeBounds.left < bounds.left) strip.scrollLeft += activeBounds.left - bounds.left;
    else if (activeBounds.right > bounds.right) strip.scrollLeft += activeBounds.right - bounds.right;
  }
  watchFrames();
  refreshThemePreview();
}
function clearFrames() {
  frameObserver?.disconnect();
  visibleFrames.clear();
}
function frameSettings(frame, extra = {}) {
  const detail = frame.id === 'detail-frame';
  return { reduced: state.reduced, speed: detail ? state.speed : 1, paused: document.hidden || (detail ? state.detailPaused : !state.playing || !visibleFrames.has(frame)), ...extra };
}
function sendFrame(frame, message) { if (frame?.contentWindow) frame.contentWindow.postMessage(message,'*'); }
function syncFrames() { $$('iframe[data-preview], #detail-frame').forEach(frame => { sendFrame(frame,{type:'playground:settings',settings:frameSettings(frame)}); sendFrame(frame,{type:'playground:theme',theme:selectedTheme()}); }); }
function watchFrames() {
  frameObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const frame = entry.target;
      if (entry.isIntersecting) {
        visibleFrames.add(frame);
        if (!frame.hasAttribute('src')) {
          const source = addThemeParams(new URL(frame.dataset.src,location.href),selectedTheme());
          source.searchParams.set('reduced',String(state.reduced));
          source.searchParams.set('paused',String(!state.playing));
          source.searchParams.set('preview','1');
          frame.src = source.href;
          frame.addEventListener('load',() => {
            sendFrame(frame,{type:'playground:settings',settings:frameSettings(frame)});
            sendFrame(frame,{type:'playground:theme',theme:selectedTheme()});
          },{once:true});
        } else sendFrame(frame,{type:'playground:settings',settings:frameSettings(frame)});
      } else {
        visibleFrames.delete(frame);
        sendFrame(frame,{type:'playground:settings',settings:frameSettings(frame,{paused:true})});
      }
    }
  },{ rootMargin:'120px 0px',threshold:0.01 });
  $$('iframe[data-preview]').forEach(frame => frameObserver.observe(frame));
}
async function loadDetail(recipe) {
  if (cache.has(recipe.id)) return cache.get(recipe.id);
  requestController?.abort();
  requestController = new AbortController();
  const response = await fetch(`./${recipe.details}`,{signal:requestController.signal});
  if (!response.ok) throw new Error('The example file could not be loaded.');
  const detail = await response.json();
  cache.set(recipe.id,detail);
  return detail;
}
async function renderDetail() {
  clearFrames();
  const request = ++state.request;
  const recipe = state.recipes.find(item => item.id === state.selected);
  if (!recipe) {
    $('#main').innerHTML = `<div class="empty-state">${icon('search')}<h1>That animation isn’t here.</h1><p>The link may be incomplete. Open the collection to find the example you want.</p><button class="button" data-action="reset">Browse all animations</button></div>`;
    return;
  }
  document.title = `${recipe.title} — Animation Playground`;
  state.detailPaused = false;
  state.speed = 1;
  state.inspectorTab = 'code';
  state.codeTab = 'css';
  $('#main').innerHTML = `<button class="back-link" data-action="back">${icon('back','sm')} Back to the collection</button><div class="detail-loading">Opening ${escape(recipe.title)}…</div>`;
  try {
    const detail = await loadDetail(recipe);
    if (request !== state.request) return;
    state.detail = detail;
    const saved = state.favorites.has(recipe.id);
    const categoryName = categories.find(([id]) => id === recipe.category)[1];
    const related = state.recipes.filter(item => item.id !== recipe.id).sort((a,b) => {
      const score = item => item.collections.filter(id => recipe.collections.includes(id)).length * 3 + Number(item.category === recipe.category) * 2 + Number(item.intent === recipe.intent);
      return score(b) - score(a);
    }).slice(0,3);
    $('#main').innerHTML = `<button class="back-link" data-action="back">${icon('back','sm')} Back to the collection</button>
      <header class="detail-heading"><div><h1>${escape(recipe.title)}</h1><p>${escape(recipe.description)}</p><div class="detail-tags"><span class="tech">${escape(recipe.tech)}</span><span>${escape(categoryName)}</span><span>${escape(recipe.trigger)}</span></div></div>
      <div class="detail-actions"><button class="icon-button" data-save="${recipe.id}" aria-pressed="${saved}" aria-label="${saved ? 'Unsave' : 'Save'} ${escape(recipe.title)}" title="Save animation">${icon('bookmark')}</button><button class="button" data-action="copy-link">${icon('link')} Copy link</button><button class="button primary" data-action="copy-full">${icon('copy')} Copy full example</button></div></header>
      ${themeStudio()}
      <div class="workbench"><section class="demo-pane" aria-label="Interactive animation"><div class="detail-stage" style="--sample-bg:${recipeTokens(recipe)['demo-bg']}"><iframe id="detail-frame" title="Interactive ${escape(recipe.title)} demo" src="${escape(exampleUrl(recipe).href)}&reduced=${state.reduced}&speed=${state.speed}" sandbox="allow-scripts"></iframe></div>
      <div class="demo-controls"><div class="control-group"><button class="quiet-button" data-action="replay">${icon('replay')} Replay</button><button class="quiet-button" data-action="detail-pause" aria-pressed="false" aria-label="Pause animation">${icon('pause')} Pause</button></div><div class="control-group"><button class="quiet-button" data-action="reduced" aria-pressed="${state.reduced}" title="Toggle reduced-motion mode">${icon('motion')} ${state.reduced ? 'Reduced' : 'Full motion'}</button><div class="speed-control"><label for="speed">Speed</label><select id="speed" aria-label="Animation playback speed"><option value="1">1×</option><option value="0.5">0.5×</option><option value="0.25">0.25×</option></select></div></div></div>
      <p class="demo-hint">${escape(recipe.trigger)} inside the demo, or use Replay to see the sequence. ${state.reduced ? 'Reduced motion shows an immediate, readable state.' : 'Slow it down to see the small decisions.'}</p>
      <dl class="demo-specs"><div><dt>Duration</dt><dd>${escape(recipe.duration)}</dd></div><div><dt>Purpose</dt><dd>${escape(recipe.purpose)}</dd></div><div class="wide"><dt>Easing / spring</dt><dd class="code-value">${escape(recipe.easing)}</dd></div><div class="wide"><dt>Dependencies</dt><dd>${recipe.usesMotion ? 'Motion 14.1.0 · included in the HTML' : 'None · just the browser'}</dd></div></dl></section>
      <section class="inspector" aria-label="Animation reference"><div class="inspector-tabs" role="tablist" aria-label="Reference section">${[['code','Code'],['guide','How it works'],['theme','Colors'],['ai','Copy for AI']].map(([id,label]) => `<button class="tab" role="tab" id="tab-${id}" aria-selected="${id === 'code'}" aria-controls="reference-panel" tabindex="${id === 'code' ? 0 : -1}" data-tab="${id}">${label}</button>`).join('')}</div><div class="inspector-content" id="reference-panel" role="tabpanel" aria-labelledby="tab-code"></div></section></div>
      <section class="related"><div class="related-heading"><h2>Keep exploring</h2><button class="text-link" data-action="back">The whole collection ${icon('arrow','sm')}</button></div><div class="gallery">${related.map(card).join('')}</div></section>
      <footer class="detail-footer"><span>Independent examples, informed by <a href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer">Emil’s animation principles</a>.</span><button class="text-link" data-action="download-full">${icon('download')} Download standalone HTML</button></footer>`;
    $('#detail-frame').addEventListener('load',syncFrames,{once:true});
    $('#speed').title = 'Changing speed replays the animation from the beginning.';
    $('#speed').addEventListener('change',event => {
      state.speed = Number(event.target.value);
      state.detailPaused = false;
      syncFrames();
      sendFrame($('#detail-frame'),{type:'playground:replay'});
      updatePlaybackButtons();
    });
    renderInspector();
    watchFrames();
    refreshThemePreview();
  } catch (error) {
    if (error.name === 'AbortError' || request !== state.request) return;
    $('#main').innerHTML = `<div class="empty-state">${icon('code')}<h2>Couldn’t open this example.</h2><p>The source file didn’t load. Try again, or open its standalone HTML.</p><button class="button" data-action="retry-detail">Try again</button><p><a href="./${recipe.example}">Open ${escape(recipe.title)} directly</a></p></div>`;
  }
}
function highlight(code) {
  const regex = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|<!--[\s\S]*?-->)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(const|let|function|return|if|else|true|false|new|for|of|class|import|from|export|default|async|await)\b|\b(\d+(?:\.\d+)?)\b/g;
  let output = '', index = 0;
  for (const match of code.matchAll(regex)) {
    output += escape(code.slice(index,match.index));
    const type = match[1] ? 'comment' : match[2] ? 'string' : match[3] ? 'keyword' : 'number';
    output += `<span class="token-${type}">${escape(match[0])}</span>`;
    index = match.index + match[0].length;
  }
  return output + escape(code.slice(index));
}
function aiBrief(recipe) {
  const permalink = addThemeParams(routeUrl({...clearFilterParams(),animation:recipe.id}), selectedTheme()).href;
  const theme = selectedTheme();
  return `Use the “${recipe.title}” animation from my Animation Playground in this project.\n\nReference: ${permalink}\nComplete working source: ${exampleUrl(recipe).href}\nRepository: https://github.com/spencer-life/animation-playground\nRecipe ID: ${recipe.id}\nSource module: ${recipe.module}\n\nBehavior: ${recipe.description}\nPurpose: ${recipe.purpose}. Trigger: ${recipe.trigger}.\nTiming: ${recipe.duration}. Easing/spring: ${recipe.easing}.\nIntent: ${recipe.intent}. Complexity: ${recipe.complexity}. Collections: ${recipe.collections.join(', ')}.\n\nUse it for: ${recipe.useWhen}\nAvoid it when: ${recipe.avoidWhen}\nReduced motion: ${recipe.reducedMotion}\nDependencies: ${recipe.usesMotion ? 'Motion 14.1.0, already bundled in the standalone example.' : 'None; native HTML, CSS, and browser APIs.'}\n\nSelected appearance: ${theme.palette} / ${theme.mode} / ${theme.palette === 'custom' ? theme.custom : theme.accent}.\nColor tokens:\n${tokenExport(theme, recipe.color)}\n\nRead the complete source before adapting. Preserve interruption/cancellation, keyboard and touch access, and the reduced-motion state. Map the semantic color roles to the receiving project’s existing theme (Radix or Geist when present), preserving readable text in both modes. Keep its typography and existing motion tokens. Bring over only this pattern, without recreating the playground’s site chrome. Treat demo content as illustrative.\n\nGuiding principle: ${recipe.principle}\nUpstream reference: ${recipe.sourceUrl}`;
}
function renderInspector() {
  const recipe = state.detail;
  if (!recipe) return;
  const panel = $('#reference-panel');
  $$('[data-tab]').forEach(button => { const selected = button.dataset.tab === state.inspectorTab; button.setAttribute('aria-selected',String(selected)); button.tabIndex = selected ? 0 : -1; });
  panel.setAttribute('aria-labelledby',`tab-${state.inspectorTab}`);
  if (state.inspectorTab === 'theme') {
    panel.innerHTML = `<section class="guide-section"><h3>Bring your project’s palette.</h3><p>These roles color every part of the demo. Full HTML embeds the current appearance; token mappings help you reuse your project’s existing design system.</p></section>
      <label class="token-system-label" for="token-system">Export format<select id="token-system">${[['values','Standalone values'],['radix','Radix token aliases'],['geist','Geist neutral aliases']].map(([id,title]) => `<option value="${id}" ${state.tokenSystem === id ? 'selected' : ''}>${title}</option>`).join('')}</select></label>
      <div class="code-container theme-code" tabindex="0" aria-label="Theme CSS tokens"><pre><code>${highlight(tokenExport(selectedTheme(), recipe.color, state.tokenSystem))}</code></pre></div><button class="button primary token-copy" data-action="copy-tokens">${icon('copy')} Copy color tokens</button><p class="code-caption">Apply <code>animation-theme</code> to your demo wrapper. Aliases include fallback values; load your host theme first. Review foreground contrast if you swap the accent scale.</p>`;
    return;
  }
  if (state.inspectorTab === 'guide') {
    panel.innerHTML = [['The idea',recipe.principle],['Where it works',recipe.useWhen],['When to leave it out',recipe.avoidWhen],['Reduced motion',recipe.reducedMotion]].map(([title,text]) => `<section class="guide-section"><h3>${title}</h3><p>${escape(text)}</p></section>`).join('') + `<a class="source-link" href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer">Read the original principle ${icon('external','sm')}</a>`;
    return;
  }
  if (state.inspectorTab === 'ai') {
    panel.innerHTML = `<p class="ai-intro">Give ChatGPT or Codex the behavior, working source, and constraints in one brief.</p><pre class="ai-prompt">${escape(aiBrief(recipe))}</pre><button class="button primary" data-action="copy-ai">${icon('copy')} Copy for AI</button><p class="code-caption">Links point to this specific experiment. The code is public and requires no login.</p>`;
    return;
  }
  const full = state.codeTab === 'full';
  const code = full ? fullCode(recipe) : recipe.study[state.codeTab];
  panel.innerHTML = `<div class="code-toolbar"><div class="code-languages" aria-label="Code language">${[['css','CSS'],['js','JavaScript'],['html','HTML'],['full','Full file']].map(([id,label]) => `<button data-language="${id}" aria-pressed="${state.codeTab === id}">${label}</button>`).join('')}</div><button class="button code-copy" data-action="copy-section" aria-label="Copy ${full ? 'full standalone HTML' : state.codeTab === 'html' ? 'HTML markup' : `${state.codeTab.toUpperCase()} with shared prerequisites`}">${icon('copy')} Copy</button></div>
    <div class="code-container" tabindex="0" aria-label="${full ? 'Complete standalone HTML source' : 'Recipe ' + state.codeTab.toUpperCase() + ' source'}"><pre><code>${highlight(code)}</code></pre></div>
    <p class="code-caption">${full ? 'This is the exact file running on the left. Save it as .html and open it in a browser.' : `${state.codeTab === 'html' ? 'Markup shown here is the demo body.' : 'Showing the motion-specific source. Copy includes the shared tokens or runtime it needs.'} Use <strong>Copy full example</strong> for a complete, portable HTML file.`}${recipe.usesMotion ? ' Motion is embedded in the full file.' : ''}</p>`;
}
function renderNotes() {
  clearFrames();
  requestController?.abort();
  state.request++;
  state.detail = null;
  document.title = 'Motion notes — Animation Playground';
  const principles = [
    ['Give it a job.','Motion is useful when it confirms an action, explains a relationship, or keeps a change from feeling abrupt. A decorative effect belongs in an occasional experience, not in every interaction.', 'press-feedback','See press feedback'],
    ['Start with the fast part.','An ease-out entrance responds immediately, then settles. Most interface transitions need only 150–250 ms. A longer duration should have a clear reason.', 'origin-popover','See the origin-aware popover'],
    ['Keep the same object.','An indicator, card, or sheet should keep its identity as it moves. Enter from a meaningful origin and leave through the same edge.', 'shared-element','See a shared element'],
    ['Let people change their minds.','A toggle should reverse from its current position. A dragged object should retain its velocity. Don’t lock input while an animation catches up.', 'drag-card','Try an interruptible spring'],
    ['Spend attention carefully.','Search, category changes, and keyboard navigation stay immediate here. Staggers, typewriters, and expressive motion live inside the examples you choose to play.', 'staggered-list','Inspect a 50 ms stagger'],
    ['Make the still version work.','Reduced motion preserves content and state while removing unnecessary travel and bounce. Every example should still explain itself when playback is paused.', 'toggle-switch','Compare reduced motion'],
  ];
  $('#main').innerHTML = `<div class="notes"><section class="intro"><div><h1>A few useful rules.</h1><p>The small decisions behind this collection. Use them as a starting point, then tune the motion to the thing you’re building.</p></div></section><div class="principles">${principles.map(([title,body,id,label]) => `<section class="principle"><h2>${title}</h2><p>${body}</p><a href="?animation=${id}" data-open="${id}">${label} ${icon('arrow','sm')}</a></section>`).join('')}</div>
    <section class="notes-section"><h2>A timing reference</h2><table class="motion-table"><thead><tr><th>Interaction</th><th>Starting point</th><th>Character</th></tr></thead><tbody><tr><td>Button press</td><td>100–160 ms</td><td>Subtle, immediate feedback</td></tr><tr><td>Tooltip or popover</td><td>125–200 ms</td><td>Quick, origin-aware</td></tr><tr><td>Dropdown or select</td><td>150–250 ms</td><td>Crisp and interruptible</td></tr><tr><td>Dialog</td><td>200–250 ms</td><td>Centered, quiet arrival</td></tr><tr><td>Large sheet</td><td>Up to 500 ms</td><td>Deliberate travel; a documented exception</td></tr><tr><td>Group stagger</td><td>30–80 ms between items</td><td>A readable cascade</td></tr></tbody></table></section>
    <section class="notes-section"><h2>Three curves to keep close</h2><table class="motion-table"><thead><tr><th>Use</th><th>CSS easing</th></tr></thead><tbody><tr><td>Entering and leaving</td><td><code>cubic-bezier(0.23, 1, 0.32, 1)</code></td></tr><tr><td>Moving on screen</td><td><code>cubic-bezier(0.77, 0, 0.175, 1)</code></td></tr><tr><td>Drawer or sheet</td><td><code>cubic-bezier(0.32, 0.72, 0, 1)</code></td></tr></tbody></table></section>
    <section class="notes-section"><h2>Take the behavior with you.</h2><p class="notes-source">Every experiment has a stable ID, a direct link, complete HTML, and a “Copy for AI” brief. The standalone HTML includes its own styles and behavior, including Motion where a spring needs it. The public <a href="./catalog.json">JSON catalog</a> and <a href="./llms-full.txt">complete text reference</a> make the collection readable by agents too.</p><p class="notes-source">These are original educational examples informed by all 14 skills in <a href="https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d" target="_blank" rel="noopener noreferrer">Emil Kowalski’s collection</a>. They’re an independent project, with no implied endorsement. Native-only guidance was reviewed for transferable principles. See the <a href="https://github.com/spencer-life/animation-playground/blob/main/docs/emil-research.md" target="_blank" rel="noopener noreferrer">full source and applicability review</a>.</p></section>${footer()}</div>`;
}
function renderRoute() {
  const view = readRoute();
  renderNav();
  if (view === 'detail') renderDetail();
  else if (view === 'notes') renderNotes();
  else { document.title = 'Animation Playground — Motion worth borrowing'; renderGallery(); }
}
async function copyText(text, label) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    announce(`${label} copied.`);
    return;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(textarea);
    textarea.select();
    let success = false;
    try { success = document.execCommand('copy'); } catch { /* offer manual copy below */ }
    textarea.remove();
    if (success) { announce(`${label} copied.`); return; }
    const dialog = $('#clipboard-dialog');
    $('#clipboard-text').value = text;
    dialog.showModal();
    $('#clipboard-text').focus();
    $('#clipboard-text').select();
  }
}
function toggleSaved(id) {
  if (!state.recipes.some(recipe => recipe.id === id)) return;
  state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
  const persisted = saveStored('ap-saved',[...state.favorites]);
  $$(`[data-save="${id}"]`).forEach(button => { const saved = state.favorites.has(id); const recipe = state.recipes.find(item => item.id === id); button.setAttribute('aria-pressed',String(saved)); button.setAttribute('aria-label',`${saved ? 'Unsave' : 'Save'} ${recipe.title}`); });
  renderNav();
  if (state.category === 'saved' && !state.selected) renderGallery();
  announce(persisted ? state.favorites.has(id) ? 'Saved to your collection.' : 'Removed from saved.' : 'Saved for this visit. Browser storage is unavailable.');
}
function updatePlaybackButtons() {
  $$('[data-action="previews"]').forEach(button => { button.setAttribute('aria-pressed',String(state.playing)); button.innerHTML = `${icon(state.playing ? 'pause' : 'play')}<span>${state.playing ? 'Pause' : 'Play'}<span class="label-wide"> previews</span></span>`; });
  $$('[data-action="reduced"]').forEach(button => { button.setAttribute('aria-pressed',String(state.reduced)); button.innerHTML = `${icon('motion')}<span>${state.reduced ? 'Reduced' : 'Full motion'}</span>`; });
  const pause = $('[data-action="detail-pause"]');
  if (pause) { pause.setAttribute('aria-pressed',String(state.detailPaused)); pause.setAttribute('aria-label',state.detailPaused ? 'Resume animation' : 'Pause animation'); pause.innerHTML = `${icon(state.detailPaused ? 'play' : 'pause')} ${state.detailPaused ? 'Resume' : 'Pause'}`; }
}
document.addEventListener('click',async event => {
  const target = event.target.closest('button,a');
  if (!target) return;
  if (target.hasAttribute('data-home')) { event.preventDefault(); navigate(routeUrl(clearFilterParams())); return; }
  if (target.dataset.category) { event.preventDefault(); navigate(routeUrl({...(target.dataset.category === 'all' || target.dataset.category === 'saved' ? clearFilterParams() : {animation:null,view:null}),category:target.dataset.category})); return; }
  if (target.dataset.collection) { navigate(routeUrl({ ...clearFilterParams(), collection: state.collection === target.dataset.collection ? null : target.dataset.collection })); return; }
  if (target.dataset.intent) { navigate(routeUrl({animation:null,view:null,intent:target.dataset.intent}),{scroll:false}); return; }
  if (target.dataset.route === 'notes') { event.preventDefault(); navigate(routeUrl({animation:null,category:null,q:null,view:'notes'})); return; }
  if (target.dataset.open) { event.preventDefault(); navigate(routeUrl({animation:target.dataset.open,q:null,view:null})); return; }
  if (target.dataset.save) { toggleSaved(target.dataset.save); return; }
  if (target.dataset.tab) { state.inspectorTab = target.dataset.tab; renderInspector(); return; }
  if (target.dataset.language) { state.codeTab = target.dataset.language; renderInspector(); return; }
  const action = target.dataset.action;
  if (action === 'reset') navigate(routeUrl(clearFilterParams()));
  if (action === 'back') navigate(lastGallery);
  if (action === 'retry-detail') renderDetail();
  if (action === 'theme') {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('ap-theme',theme); } catch { /* preference remains effective for this visit */ }
    target.innerHTML = icon(theme === 'dark' ? 'sun' : 'moon');
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#191c22' : '#f7f8fa';
    refreshThemePreview();
  }
  if (action === 'previews') { state.playing = !state.playing; saveStored('ap-playing',state.playing); syncFrames(); updatePlaybackButtons(); }
  if (action === 'reduced') {
    state.reduced = !state.reduced;
    saveStored('ap-reduced',state.reduced);
    syncFrames();
    updatePlaybackButtons();
    announce(state.reduced ? 'Reduced motion: state changes without travel.' : 'Full motion enabled.');
  }
  if (action === 'detail-pause') { state.detailPaused = !state.detailPaused; syncFrames(); updatePlaybackButtons(); }
  if (action === 'replay') {
    state.detailPaused = false;
    syncFrames();
    sendFrame($('#detail-frame'),{type:'playground:replay'});
    updatePlaybackButtons();
  }
  if (action === 'copy-link' && state.detail) await copyText(addThemeParams(routeUrl({...clearFilterParams(),animation:state.detail.id}),selectedTheme()).href,'Link with colors');
  if (action === 'copy-full' && state.detail) await copyText(fullCode(state.detail),'Full example with colors');
  if (action === 'copy-ai' && state.detail) await copyText(aiBrief(state.detail),'AI brief');
  if (action === 'copy-tokens') await copyText(tokenExport(selectedTheme(),state.detail?.color || 'lavender',state.detail ? state.tokenSystem : 'values'),'Color tokens');
  if (action === 'download-full' && state.detail) {
    const url = URL.createObjectURL(new Blob([fullCode(state.detail)],{type:'text/html;charset=utf-8'}));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `${state.detail.id}.html`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (action === 'copy-section' && state.detail) {
    const code = state.codeTab === 'full' ? fullCode(state.detail) : state.detail.snippets[state.codeTab] + (state.codeTab === 'css' ? '\n\n' + themeCss(selectedTheme(),state.detail.color) : '');
    await copyText(code,state.codeTab === 'full' ? 'Full example' : state.codeTab.toUpperCase());
  }
});
document.addEventListener('toggle', event => {
  if (event.target.matches?.('.theme-studio')) state.themeOpen = event.target.open;
}, true);
document.addEventListener('change', event => {
  const target = event.target;
  if (target.id === 'palette-select') setColorTheme({palette:target.value});
  if (target.id === 'appearance-select') setColorTheme({appearance:target.value});
  if (target.id === 'accent-select') setColorTheme({accent:target.value});
  if (target.id === 'custom-color' || target.id === 'custom-hex') {
    if (/^#[\da-f]{6}$/i.test(target.value)) { target.removeAttribute('aria-invalid'); setColorTheme({custom:target.value}); }
    else { target.setAttribute('aria-invalid','true'); announce('Enter a six-digit hex color, such as #7c5ce7.'); }
  }
  const filters = {'tech-filter':'tech','complexity-filter':'complexity','sort-filter':'sort'};
  if (filters[target.id]) {
    const id = target.id;
    navigate(routeUrl({[filters[id]]:target.value}),{scroll:false});
    document.getElementById(id)?.focus({preventScroll:true});
  }
  if (target.id === 'token-system') { state.tokenSystem = target.value; renderInspector(); $('#token-system')?.focus({preventScroll:true}); }
});
document.addEventListener('keydown',event => {
  const editing = event.target.closest('input,textarea,select,[contenteditable="true"]');
  if (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) { event.preventDefault(); $('#search-input')?.focus(); }
  if (event.target.matches('[role="tab"]') && ['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
    event.preventDefault();
    const tabs = $$('[role="tab"]');
    const index = tabs.indexOf(event.target);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    state.inspectorTab = tabs[next].dataset.tab;
    renderInspector();
    tabs[next].focus();
  }
});
window.addEventListener('popstate',renderRoute);
document.addEventListener('visibilitychange',syncFrames);
window.addEventListener('message',event => {
  if (event.data?.type !== 'playground:ready') return;
  const frame = $$('iframe').find(candidate => candidate.contentWindow === event.source);
  if (frame) {
    sendFrame(frame,{type:'playground:settings',settings:frameSettings(frame)});
    sendFrame(frame,{type:'playground:theme',theme:selectedTheme()});
  }
});
systemMotion.addEventListener('change',event => {
  if (getStored('ap-reduced',null) === null) { state.reduced = event.matches; syncFrames(); updatePlaybackButtons(); }
});

async function start() {
  try {
    const response = await fetch('./catalog.json');
    if (!response.ok) throw new Error('Catalog unavailable');
    const catalog = await response.json();
    if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.recipes)) throw new Error('Unsupported catalog');
    state.recipes = catalog.recipes;
    state.collections = Array.isArray(catalog.collections) ? catalog.collections : [];
    state.favorites = new Set([...state.favorites].filter(id => state.recipes.some(recipe => recipe.id === id)));
    renderShell();
    renderRoute();
  } catch {
    app.innerHTML = `<div class="initial-state"><h1>The collection couldn’t load.</h1><p>Check your connection, then try again.</p><button class="button primary" id="retry-start">Reload collection</button><a class="text-link" href="./examples/">Open standalone examples ${icon('arrow')}</a></div>`;
    $('#retry-start').addEventListener('click',start,{once:true});
  }
}
start();
