# Recipe authoring contract

Each module in `src/recipes/` exports a default array of recipe objects. The build uses these objects for the catalog, preview HTML, downloadable HTML, and AI reference data.

```js
{
  id: 'press-feedback',
  title: 'Press feedback',
  category: 'feedback', // feedback, navigation, layout, text, entrances, expressive
  description: 'One sentence explaining what it does.',
  purpose: 'Feedback',
  useWhen: 'Concrete use cases.',
  avoidWhen: 'Concrete frequency or context limit.',
  principle: 'The relevant Emil principle in plain language.',
  duration: '160 ms',
  easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
  trigger: 'Press',
  tech: 'CSS', // CSS, WAAPI, Motion
  color: 'lavender', // lavender, peach, blue, green, sand, graphite
  tags: ['button', 'feedback'],
  intent: 'everyday', // everyday or expressive
  collections: ['product-ui', 'dashboards'], // one to three valid collection IDs
  complexity: 'starter', // starter or intermediate
  added: '2026-10-10', // YYYY-MM-DD
  reducedMotion: 'State changes instantly; movement is removed.',
  source: 'animate/RECIPES.md',
  html: '<main class="stage">...</main>',
  css: '...',
  js: '...',
  // optional:
  usesMotion: true,
  featured: false,
}
```

## Shared demo environment

The build embeds the shared base styles, semantic theme resolver, selected color values, and complete runtime in every HTML file. A downloaded example works without the app and retains its selected appearance. Motion examples embed the pinned MIT-licensed Motion runtime too; no network request is needed.

Use `window.Demo`:

- `Demo.reduced`: current boolean reduced-motion preference. Read dynamically.
- `Demo.paused`: current playback state.
- `Demo.speed`: 1, 0.5, or 0.25.
- `Demo.duration(ms)`: milliseconds adjusted to playback speed, or zero for reduced motion / keyboard actions.
- `Demo.animate(element, keyframes, options)`: WAAPI with speed, reduced motion, and pause handling. Options use milliseconds. Final keyframes are applied instantly in reduced motion. Returned object has `finished`, `cancel`, `pause`, `play`.
- `Demo.onReplay(fn)`: register reset-and-play behavior. The runtime invokes this once initially unless paused, and on each Replay. Cancel or reset any timers in your callback.
- `Demo.onSettings(fn)`: callback on speed, reduced-motion, or pause changes.
- `Demo.onCleanup(fn)`: cleanup on pagehide.
- `window.Motion`: available only when usesMotion=true; exports animate, spring, springValue, motionValue. Import is bundled and embedded by the build.

Motion tokens supplied in each example:

`--ease-out: cubic-bezier(0.23,1,0.32,1)`; `--ease-in-out: cubic-bezier(0.77,0,0.175,1)`; `--ease-drawer: cubic-bezier(0.32,0.72,0,1)`; `--time-scale: 1` (2 for 0.5×).

Color values come from `src/theme.mjs` and change with the selected palette and
appearance. Use these roles rather than hardcoded colors:

| Role | Tokens |
| --- | --- |
| Surfaces | `--demo-bg`, `--paper` |
| Text | `--ink`, `--on-ink`, `--muted` |
| Interaction | `--accent`, `--accent-hover`, `--accent-soft`, `--accent-ink`, `--on-accent` |
| Boundaries and status | `--line`, `--success`, `--danger` |
| Decorative artwork | `--art-1`, `--art-2`, `--art-3`, `--shadow` |

Use `--accent-ink` for readable accent text on a surface and `--on-accent` over a
solid `--accent` background. Decorative colors do not carry text-contrast
guarantees. Use `currentColor`, `transparent`, and token-based color mixing where
appropriate; keep raw color values in the theme registry. The recipe check rejects
fixed hex colors in CSS and SVG/inline style attributes. Scripts must also use
semantic roles whenever they assign a color. The `color` metadata chooses the
original Playground family; it does not lock a study to that palette.

See [theming](theming.md) for token semantics, scoped host aliases, URL parameters,
and selected-palette exports. Do not add a private theme implementation to a recipe.

Use durations like `calc(200ms * var(--time-scale))`. Runtime sets document `data-reduced`, `data-paused`, and `data-keyboard`; the base stylesheet removes animation travel under reduced motion and makes keyboard transitions instant. If JS directly sets transforms or uses Motion, handle `Demo.reduced` explicitly and register settings cleanup. Do not rely on static destructuring of the reduced flag.

Shared classes: `.stage` (full-height centered flex column with gap 20px), `.demo-button` (ink-filled, compact, accessible native button), `.demo-button.secondary` (paper-filled button), `.demo-label` (small muted label), `.demo-row` (flex row centered, gap 12px). They follow the current palette and are embedded into each full example, not external app dependencies.

## Discovery metadata

`src/collections.mjs` owns the five project collections and enriches the original
36 studies with reviewed discovery metadata. Every future study must declare
`intent`, `collections`, `complexity`, and `added` directly in its recipe object.
The build rejects missing or invalid metadata instead of silently classifying a
new pattern.

| Field | Authoring rule |
| --- | --- |
| `intent` | `everyday` for restrained interface continuity or feedback; `expressive` for a deliberate brand, editorial, or occasional decorative moment. |
| `collections` | One to three distinct IDs from `product-ui`, `landing-pages`, `dashboards`, `storytelling`, and `signature`. Choose by the documented use cases. |
| `complexity` | `starter` or `intermediate`, considering integration work such as measurement, focus, interruption, and cleanup. This is not a quality ranking. |
| `added` | A `YYYY-MM-DD` date recording when the study was added. |

Categories describe the motion family; collections describe the project context.
Preserve that distinction. An expressive counter can belong to Dashboards while
its `avoidWhen` guidance still rules out repeated animation of live data. Keep
search tags concrete and include the terms a person would use for the task.

## Quality rules

- Native buttons/inputs/details/dialogs first. Native `<dialog>.showModal()` provides focus/inert behavior; do not imitate modal semantics with a div. Model visual component studies clearly where not production-ready.
- Every interactive demo must be keyboard-operable and touch-friendly. Do not prevent pinch zoom or vertical page scrolling globally. Gate hover motion at `(hover:hover) and (pointer:fine)`.
- Prefer transform and opacity; clip-path, SVG stroke drawing, and short measured accordion height are documented exceptions. No `transition: all`, no scale(0) entrance, no `ease-in` UI.
- Start at a coherent visible state, even if paused or JS fails. No forever timers. Ambient animations are CSS animations, paused through the runtime. Replayable sequences are user/preview-triggered and cancel previous work.
- Never autoplay sound, vibrate, navigate away, submit real data, or perform destructive actions. Label fictional UI content as demo content when necessary.
- Each stage must compose at 300×230 and 700×420 without horizontal overflow. Avoid viewport units for demo content sizing.
- The collection currently contains 44 studies. Useful, distinct animations take precedence over slight variants counted separately; color variations belong to the theme system.
- Check new studies in the Playground palette and at least one project palette, in light and dark modes. The full copied/downloaded example must reproduce the chosen palette offline.
- All code is original adaptation from MIT-licensed principles; preserve source attribution in metadata. Keep IDs stable.
