// Preserve published deep links while the catalog grows. This is the 44-study
// baseline delivered by PR #6; future additions still require stable IDs.
export const retainedRecipeIds = [
  "accordion",
  "blur-reveal",
  "card-flip",
  "card-stack",
  "chart-bars",
  "clip-text",
  "drag-card",
  "error-nudge",
  "expandable-card",
  "filter-grid",
  "hold-confirm",
  "layout-flip",
  "magnetic-button",
  "masked-reveal",
  "menu-icon",
  "notification-stack",
  "orbit",
  "orchestrated-panel",
  "origin-popover",
  "press-feedback",
  "progress-button",
  "ripple-field",
  "rolling-number",
  "save-state",
  "scale-dialog",
  "scroll-progress",
  "segmented-control",
  "shared-element",
  "sidebar-collapse",
  "skeleton-reveal",
  "slide-sheet",
  "sliding-tabs",
  "split-flap",
  "spotlight-card",
  "spring-orb",
  "staggered-list",
  "staggered-words",
  "stepper-progress",
  "svg-draw",
  "text-crossfade",
  "toggle-switch",
  "tooltip-reveal",
  "typewriter",
  "underline-trail"
];

export const minimumRecipeCount = 100;

export function validateCatalog(recipes, collections) {
  if (recipes.length < minimumRecipeCount) throw new Error(`Expected at least ${minimumRecipeCount} distinct recipes, found ${recipes.length}.`);
  const ids = new Set(recipes.map(recipe => recipe.id));
  if (ids.size !== recipes.length) throw new Error('Recipe IDs must be unique.');
  for (const id of retainedRecipeIds) {
    if (!ids.has(id)) throw new Error(`Published recipe ${id} is missing; preserve its deep link.`);
  }
  for (const collection of collections) {
    for (const id of collection.featured) {
      const recipe = recipes.find(candidate => candidate.id === id);
      if (!recipe || !recipe.collections.includes(collection.id)) {
        throw new Error(`Featured recipe ${id} must belong to ${collection.id}.`);
      }
    }
  }
}
