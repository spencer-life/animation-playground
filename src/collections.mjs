// Collections answer the task someone is working on. Categories continue to
// describe the motion technique, so the two navigation paths can coexist.
export const collections = [
  {
    id: 'product-ui',
    title: 'Product UI',
    description: 'Make buttons, settings, menus, and everyday actions feel clear and responsive.',
    icon: 'code',
    featured: ['press-feedback', 'field-validation', 'upload-queue'],
  },
  {
    id: 'landing-pages',
    title: 'Landing pages',
    description: 'Introduce a product or portfolio with purposeful reveals and clear calls to action.',
    icon: 'external',
    featured: ['underline-trail', 'image-curtain', 'reveal-on-view'],
  },
  {
    id: 'dashboards',
    title: 'Dashboards',
    description: 'Show progress, switch views, and keep changing information easy to follow.',
    icon: 'grid',
    featured: ['data-sort', 'bulk-selection-toolbar', 'chart-range'],
  },
  {
    id: 'storytelling',
    title: 'Storytelling',
    description: 'Pace an editorial page, explain a sequence, or introduce a short headline.',
    icon: 'book',
    featured: ['pinned-story', 'word-highlight', 'svg-draw'],
  },
  {
    id: 'signature',
    title: 'Signature motion',
    description: 'Explore distinctive gestures, dimensional cards, and optional brand moments.',
    icon: 'motion',
    featured: ['perspective-gallery', 'particle-burst', 'spring-orb'],
  },
];

// Curated from each study's purpose, use/avoid guidance, and implementation.
// Complexity includes integration work such as geometry, focus, and lifecycle
// handling. Intent describes the use of the motion, not how often to replay it.
// An expressive counter can belong to Dashboards without becoming a recommended
// animation for constantly changing production data.
const originalRecipes = {
  'press-feedback': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'starter' },
  'save-state': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'hold-confirm': { intent: 'everyday', collections: ['product-ui'], complexity: 'intermediate' },
  'toggle-switch': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'starter' },
  'progress-button': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'error-nudge': { intent: 'everyday', collections: ['product-ui'], complexity: 'starter' },
  'sliding-tabs': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'segmented-control': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'menu-icon': { intent: 'everyday', collections: ['product-ui', 'landing-pages'], complexity: 'starter' },
  'origin-popover': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'tooltip-reveal': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'underline-trail': { intent: 'everyday', collections: ['landing-pages', 'storytelling'], complexity: 'starter' },
  'accordion': { intent: 'everyday', collections: ['product-ui', 'landing-pages'], complexity: 'intermediate' },
  'layout-flip': { intent: 'everyday', collections: ['product-ui', 'dashboards'], complexity: 'intermediate' },
  'shared-element': { intent: 'everyday', collections: ['product-ui', 'storytelling'], complexity: 'intermediate' },
  'card-stack': { intent: 'expressive', collections: ['storytelling', 'signature'], complexity: 'intermediate' },
  'expandable-card': { intent: 'everyday', collections: ['product-ui', 'storytelling'], complexity: 'intermediate' },
  'notification-stack': { intent: 'everyday', collections: ['dashboards', 'product-ui'], complexity: 'intermediate' },
  'staggered-words': { intent: 'expressive', collections: ['landing-pages', 'storytelling'], complexity: 'starter' },
  'text-crossfade': { intent: 'everyday', collections: ['product-ui', 'dashboards', 'storytelling'], complexity: 'starter' },
  'rolling-number': { intent: 'expressive', collections: ['dashboards', 'landing-pages'], complexity: 'starter' },
  'clip-text': { intent: 'expressive', collections: ['landing-pages', 'storytelling'], complexity: 'starter' },
  'typewriter': { intent: 'expressive', collections: ['storytelling', 'signature'], complexity: 'intermediate' },
  'split-flap': { intent: 'expressive', collections: ['storytelling', 'signature'], complexity: 'intermediate' },
  'staggered-list': { intent: 'everyday', collections: ['product-ui'], complexity: 'starter' },
  'masked-reveal': { intent: 'expressive', collections: ['landing-pages', 'storytelling'], complexity: 'starter' },
  'scale-dialog': { intent: 'everyday', collections: ['product-ui'], complexity: 'intermediate' },
  'slide-sheet': { intent: 'everyday', collections: ['product-ui'], complexity: 'intermediate' },
  'blur-reveal': { intent: 'expressive', collections: ['landing-pages', 'signature'], complexity: 'starter' },
  'orchestrated-panel': { intent: 'everyday', collections: ['product-ui'], complexity: 'intermediate' },
  'spring-orb': { intent: 'expressive', collections: ['signature'], complexity: 'intermediate' },
  'magnetic-button': { intent: 'expressive', collections: ['landing-pages', 'signature'], complexity: 'intermediate' },
  'drag-card': { intent: 'expressive', collections: ['product-ui', 'signature'], complexity: 'intermediate' },
  'orbit': { intent: 'expressive', collections: ['landing-pages', 'signature'], complexity: 'starter' },
  'card-flip': { intent: 'expressive', collections: ['storytelling', 'signature'], complexity: 'starter' },
  'svg-draw': { intent: 'expressive', collections: ['storytelling', 'landing-pages'], complexity: 'starter' },
};

const collectionIds = new Set(collections.map(collection => collection.id));

export function enrichRecipe(recipe) {
  const curated = originalRecipes[recipe.id];
  const metadata = {
    intent: recipe.intent ?? curated?.intent,
    collections: recipe.collections ?? curated?.collections,
    complexity: recipe.complexity ?? curated?.complexity,
    added: recipe.added ?? (curated ? '2026-10-10' : undefined),
  };
  if (!['everyday', 'expressive'].includes(metadata.intent)) {
    throw new Error(`Recipe ${recipe.id} needs an everyday or expressive intent.`);
  }
  if (!Array.isArray(metadata.collections) || metadata.collections.length < 1 || metadata.collections.length > 3
    || new Set(metadata.collections).size !== metadata.collections.length
    || metadata.collections.some(id => !collectionIds.has(id))) {
    throw new Error(`Recipe ${recipe.id} needs one to three distinct, valid collections.`);
  }
  if (!['starter', 'intermediate'].includes(metadata.complexity)) {
    throw new Error(`Recipe ${recipe.id} needs a starter or intermediate complexity.`);
  }
  if (typeof metadata.added !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(metadata.added)) {
    throw new Error(`Recipe ${recipe.id} needs an added date in YYYY-MM-DD format.`);
  }
  return { ...recipe, ...metadata, collections: [...metadata.collections] };
}
