// Authoring helper only: the returned SVG is embedded in each exported recipe.
// No icon package or external request is needed by a copied example.
const paths = {
  arrow: '<path d="M6 18 18 6M6 6h12v12"/>',
  replay: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  undo: '<path d="m8 4-5 5 5 5M3 9h10a7 7 0 0 1 7 7v4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  spark: '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6"/>',
  'half-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12a8.5 8.5 0 0 0 17 0Z" fill="currentColor" stroke="none"/>',
  diamond: '<path d="m12 2 10 10-10 10L2 12Z"/><path d="m12 7 5 5-5 5-5-5Z" fill="currentColor" stroke="none"/>',
  code: '<path d="m7 7-5 5 5 5m10-10 5 5-5 5m-4-13-2 16"/>',
  dots: '<circle cx="5" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.25" fill="currentColor" stroke="none"/>',
};

export function recipeIcon(name, size = 16) {
  if (!paths[name]) throw new Error(`Unknown recipe icon: ${name}`);
  if (!Number.isFinite(size) || size < 8 || size > 64) throw new Error(`Invalid icon size: ${size}`);
  return `<svg class="study-icon" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}
