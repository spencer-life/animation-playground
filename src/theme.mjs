// One color contract for the gallery, standalone examples, and exported source.
// Radix values: radix-ui/colors, MIT. See THIRD_PARTY_NOTICES.md.
export const palettes = [
  { id: 'original', title: 'Playground colors' },
  { id: 'radix', title: 'Radix' },
  { id: 'geist', title: 'Geist-inspired' },
  { id: 'custom', title: 'Custom accent' },
];
export const accents = [
  { id: 'indigo', title: 'Indigo', color: '#3e63dd' },
  { id: 'blue', title: 'Blue', color: '#0090ff' },
  { id: 'violet', title: 'Violet', color: '#6e56cf' },
  { id: 'jade', title: 'Jade', color: '#29a383' },
  { id: 'amber', title: 'Amber', color: '#ffc53d' },
  { id: 'crimson', title: 'Crimson', color: '#e93d82' },
];
export const defaults = { palette: 'original', mode: 'light', accent: 'indigo', custom: '#7c5ce7' };
const original = {
  lavender: ['#e8e4f3', '#6550a2', '#a592d0', '#d1ab91', '#94afba'],
  peach: ['#f5dfd0', '#984c32', '#d58f72', '#b6a0cf', '#a0b9aa'],
  blue: ['#dfe8f8', '#345daf', '#89a5db', '#b5a2ce', '#d0ab8b'],
  green: ['#dfece5', '#326a55', '#83ac96', '#a4adcd', '#c7ac83'],
  sand: ['#eee9dc', '#80601e', '#c3a56c', '#a3b4a1', '#baa3c3'],
  graphite: ['#e2e5ea', '#4b566b', '#8f9cb3', '#b9a3be', '#bba789'],
};
const neutral = {
  light: ['#fcfcfd', '#f9f9fb', '#f0f0f3', '#cdced6', '#60646c', '#1c2024'],
  dark: ['#111113', '#18191b', '#212225', '#43484e', '#b0b4ba', '#edeef0'],
};
// Step 3 = subtle fill, 9/10 = solid/hover, 11 = readable accent text.
const radix = {
  indigo: { light: ['#edf2fe', '#3e63dd', '#3358d4', '#3a5bc7'], dark: ['#182449', '#3e63dd', '#5472e4', '#9eb1ff'] },
  blue: { light: ['#e6f4fe', '#0090ff', '#0588f0', '#0d74ce'], dark: ['#0d2847', '#0090ff', '#3b9eff', '#70b8ff'] },
  violet: { light: ['#f4f0fe', '#6e56cf', '#654dc4', '#6550b9'], dark: ['#291f43', '#6e56cf', '#7d66d9', '#baa7ff'] },
  jade: { light: ['#e6f7ed', '#29a383', '#26997b', '#208368'], dark: ['#0f2e22', '#29a383', '#27b08b', '#1fd8a4'] },
  amber: { light: ['#fff7c2', '#ffc53d', '#ffba18', '#ab6400'], dark: ['#302008', '#ffc53d', '#ffd60a', '#ffca16'] },
  crimson: { light: ['#ffe9f0', '#e93d82', '#df3478', '#cb1d63'], dark: ['#381525', '#e93d82', '#ee518a', '#ff92ad'] },
};

export function normalizeTheme(input = {}, fallback = defaults) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) input = {};
  const valid = (key, values) => values.includes(input[key]) ? input[key] : fallback[key];
  return {
    palette: valid('palette', palettes.map(item => item.id)),
    mode: valid('mode', ['light', 'dark']),
    accent: valid('accent', accents.map(item => item.id)),
    custom: typeof input.custom === 'string' && /^#[\da-f]{6}$/i.test(input.custom) ? input.custom.toLowerCase() : fallback.custom,
  };
}
function channels(color) { return [1, 3, 5].map(index => parseInt(color.slice(index, index + 2), 16)); }
export function mix(a, b, amount) {
  const second = channels(b);
  return '#' + channels(a).map((value, index) => Math.round(value * (1 - amount) + second[index] * amount).toString(16).padStart(2, '0')).join('');
}
export function luminance(color) {
  const values = channels(color).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
  return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
}
export function contrast(a, b) {
  const first = luminance(a), second = luminance(b);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
}
function readableAccent(accent, background) {
  const destination = luminance(background) < .2 ? '#ffffff' : '#111113';
  for (let step = 0; step <= 20; step++) {
    const color = mix(accent, destination, step / 20);
    if (contrast(color, background) >= 4.5) return color;
  }
  return destination;
}
export function resolveTheme(selection = defaults, color = 'lavender') {
  const config = normalizeTheme(selection);
  const dark = config.mode === 'dark';
  const n = neutral[config.mode];
  const ramp = radix[config.accent][config.mode];
  let bg = n[0], paper = n[1], ink = n[5], muted = n[4], line = n[3];
  let accent = ramp[1], hover = ramp[2], soft = ramp[0], accentInk = ramp[3];
  let art = [accent, radix.violet[config.mode][1], radix.jade[config.mode][1]];
  if (config.palette === 'original') {
    const family = original[color] || original.lavender;
    bg = dark ? mix('#17191f', family[1], .18) : family[0];
    paper = dark ? mix(bg, '#ffffff', .065) : '#ffffff';
    ink = dark ? '#edf0f6' : '#20242b';
    muted = mix(ink, bg, .28);
    line = mix(ink, bg, .69);
    accent = dark ? mix(family[1], '#ffffff', .52) : family[1];
    hover = mix(accent, dark ? '#ffffff' : '#000000', .10);
    soft = mix(paper, accent, dark ? .15 : .12);
    accentInk = readableAccent(accent, paper);
    art = family.slice(2).map(value => dark ? mix(value, '#111113', .17) : value);
  } else if (config.palette === 'geist' || config.palette === 'custom') {
    // A portable neutral preview, not a vendored copy of Vercel's design system.
    bg = dark ? '#000000' : '#fafafa';
    paper = dark ? '#151515' : '#ffffff';
    ink = dark ? '#ededed' : '#171717';
    muted = dark ? '#b0b0b0' : '#626262';
    line = dark ? '#444444' : '#d4d4d4';
    if (config.palette === 'custom') accent = config.custom;
    hover = mix(accent, dark ? '#ffffff' : '#000000', .12);
    soft = mix(paper, accent, dark ? .16 : .11);
    accentInk = readableAccent(accent, paper);
    art = [accent, mix(accent, dark ? '#ffffff' : '#171717', .28), mix(accent, '#8395a7', .60)];
  }
  // Preserve the chosen solid color first, then keep hover readable with it.
  const candidates = ['#ffffff', '#000000'];
  const onAccent = candidates.sort((a, b) => contrast(b, accent) - contrast(a, accent))[0];
  // Keep arbitrary custom colors exact; only temper hover if its contrast would fall.
  if (contrast(onAccent, hover) < 4.5) hover = accent;
  return {
    'demo-bg': bg, paper, ink, 'on-ink': dark ? '#111113' : '#ffffff', muted, line,
    accent, 'accent-hover': hover, 'accent-soft': soft, 'accent-ink': accentInk, 'on-accent': onAccent,
    success: dark ? '#72d6a0' : '#246346', danger: dark ? '#ff9c9c' : '#b12d38',
    'art-1': art[0], 'art-2': art[1], 'art-3': art[2], shadow: dark ? '#00000055' : '#17213424',
  };
}
export function themeCss(selection, color = 'lavender', selector = ':root') {
  const config = normalizeTheme(selection);
  return `${selector} {\n  color-scheme: ${config.mode};\n${Object.entries(resolveTheme(config, color)).map(([name, value]) => `  --${name}: ${value};`).join('\n')}\n}`;
}
export function themeFromParams(params, fallback = defaults) {
  return normalizeTheme(Object.fromEntries(['palette', 'mode', 'accent', 'custom'].filter(key => params.has(key)).map(key => [key, params.get(key)])), fallback);
}
export function addThemeParams(url, selection) {
  const config = normalizeTheme(selection);
  url.searchParams.set('palette', config.palette);
  url.searchParams.set('mode', config.mode);
  if (config.palette !== 'original') url.searchParams.set('accent', config.accent);
  else url.searchParams.delete('accent');
  if (config.palette === 'custom') url.searchParams.set('custom', config.custom);
  else url.searchParams.delete('custom');
  return url;
}
export function themedCode(code, selection, color) {
  const config = normalizeTheme(selection);
  return code
    .replace(/(<style id="playground-theme">)[\s\S]*?(<\/style>)/, (_, start, end) => start + '\n' + themeCss(config, color) + '\n' + end)
    .replace(/(<script id="playground-theme-config" type="application\/json">)[\s\S]*?(<\/script>)/, (_, start, end) => start + JSON.stringify({ ...config, color }) + end);
}
export function tokenExport(selection, color = 'lavender', system = 'values') {
  const config = normalizeTheme(selection);
  const tokens = resolveTheme(config, color);
  const radixName = config.accent;
  const aliases = system === 'radix' ? {
    'demo-bg': 'gray-1', paper: 'gray-2', ink: 'gray-12', muted: 'gray-11', line: 'gray-7',
    accent: `${radixName}-9`, 'accent-hover': `${radixName}-10`, 'accent-soft': `${radixName}-3`, 'accent-ink': `${radixName}-11`,
  } : system === 'geist' ? {
    'demo-bg': 'ds-background-100', paper: 'ds-background-200', ink: 'ds-gray-1000', muted: 'ds-gray-900', line: 'ds-gray-500',
  } : {};
  const note = system === 'radix' ? 'Scope inside your Radix color theme; load the matching gray/accent scales first. Values are fallbacks.'
    : system === 'geist' ? 'Scope inside your Geist theme. Neutral roles use host tokens; accent colors keep this preview’s values.'
      : 'Scoped palette for this animation. Use on the demo wrapper in your own project.';
  return `/* ${note}\n   Solid accent foreground: ${tokens['on-accent']}. Recheck it if you change the host accent scale. */\n.animation-theme {\n  color-scheme: ${config.mode};\n${Object.entries(tokens).map(([name, value]) => `  --${name}: ${aliases[name] ? `var(--${aliases[name]}, ${value})` : value};`).join('\n')}\n}`;
}
export function installTheme() {
  const node = document.getElementById('playground-theme-config');
  let saved = {};
  try { saved = JSON.parse(node?.textContent || '{}'); } catch { /* retain safe defaults */ }
  const color = Object.hasOwn(original, saved.color) ? saved.color : 'lavender';
  let selection = themeFromParams(new URLSearchParams(location.search), normalizeTheme(saved));
  function apply(next) {
    selection = normalizeTheme(next, selection);
    const root = document.documentElement;
    root.dataset.palette = selection.palette;
    root.dataset.demoMode = selection.mode;
    root.style.colorScheme = selection.mode;
    for (const [name, value] of Object.entries(resolveTheme(selection, color))) root.style.setProperty(`--${name}`, value);
  }
  apply(selection);
  window.addEventListener('message', event => {
    if (event.source === window.parent && event.data?.type === 'playground:theme') apply(event.data.theme);
  });
}
