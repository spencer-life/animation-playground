# Architecture

Animation Playground separates the browsing interface from each executable study.
The gallery is a static JavaScript application; every example is a complete HTML
document. The preview iframe, copied full example, and downloaded HTML all use the
same generated recipe source. A shared theme resolver applies the selected color
roles to the preview and embeds those same roles in copied or downloaded HTML.

## Source ownership

| Source | Responsibility |
| --- | --- |
| `src/recipes/interface.mjs` | The original feedback and navigation recipes. |
| `src/recipes/structure.mjs` | The original layout and text recipes. |
| `src/recipes/expressive.mjs` | The original entrance and expressive recipes. |
| `src/recipes/hub.mjs` | Eight additional loading, navigation, layout, chart, reading, and signature studies. |
| `src/recipes/forms.mjs` | Twenty form, selection, upload, and request-feedback studies. |
| `src/recipes/workflows.mjs` | Twenty navigation, layout, dashboard, and contextual-control studies. |
| `src/recipes/storytelling.mjs` | Sixteen typography, reveal, native-scroll, and expressive studies. |
| `src/collections.mjs` | Five project collections, original-study curation, and required discovery metadata validation. |
| `src/catalog-contract.mjs` | Minimum catalog size, unique and retained published IDs, and featured-collection membership. |
| `src/theme.mjs` | Palette definitions, semantic color resolution, validated theme settings, URL parameters, preview installation, and token exports. |
| `src/demo-base.css` | Embedded typography, controls, layout helpers, motion tokens, and preference rules. |
| `src/demo-runtime.js` | Embedded playback state, WAAPI wrapper, replay/settings callbacks, and cleanup. |
| `src/motion-entry.js` | Explicit Motion exports bundled for the four spring studies. |
| `src/app.js` | Collection/category browsing, search and filters, gallery quick inspector, workbench, routing, palette controls, copying, saving, and iframe coordination. |
| `src/gallery-playback.js` | Near-viewport loading, visible-card playback, re-entry replay, and per-card Replay coordination. |
| `src/styles.css` and `src/index.html` | Responsive site shell, theme, markup, and loading fallback. |
| `scripts/build.mjs` | Static output, bundled Motion, executable examples, metadata, and agent references. |
| `scripts/serve.mjs` | Local HTTP server for the built `dist/` directory. |

See the [recipe contract](recipe-contract.md) for fields and helper APIs. The
collection contains 100 studies. The shared catalog contract guards against dropping
below 100, removing any of the preceding 44 published IDs, or featuring a missing
or incorrectly assigned study. Useful new studies can extend it when their complete source and
required discovery metadata are provided. Update related documentation and
applicable checks when changing the collection.

## Build outputs

`pnpm build` replaces `dist/` and writes the website plus these generated resources:

| Output | Use |
| --- | --- |
| `catalog.json` | Compact schema-versioned collection definitions and recipe metadata: IDs, category, intent, collections, complexity, added date, tags, timing, dependencies, source links, and paths. |
| `theme-presets.json` | Available palettes, accents, concrete appearance modes, defaults, semantic token names, and a link to the theming guide. |
| `examples/{id}.html` | Complete runnable source for one study. |
| `examples/{id}.json` | Workbench metadata, full HTML, compact study source, and copyable snippets with prerequisites. |
| `examples/index.html` | A simple directory of standalone examples. |
| `llms.txt` | Entry points for agents and other automated readers. |
| `llms-full.txt` | Complete educational source, use constraints, timing, and source references for the collection. |
| `assets/` | The gallery font and favicon. |
| `theme.mjs` | The browser module shared by the gallery's live palette and export controls. Its resolver is also bundled into every standalone example. |
| `.nojekyll` | Static publishing marker for hosts that recognize it. |

The build also copies license and third-party notices when present. Preserve
those files with redistributed code. Source changes belong in `src/` and scripts;
generated output should be rebuilt consistently.

## Runtime and isolation

The site shell fetches same-origin catalog and example JSON. Gallery previews are
sandboxed iframes with script permission. The gallery playback module preloads
within 360px of the viewport while paused, then starts the recipe's finite replay
once at least 25% of the stage is visible. It pauses fully offscreen studies and
replays them from the beginning on re-entry instead of adding a periodic loop.
Load and ready messages share startup coordination so a frame does not replay
twice. Each card's explicit Replay action can run that study while the global
preview preference remains paused; a hidden page or open reference/manual-copy
dialog still blocks playback.

Opening a preview or title leads to the workbench, whose iframe provides the
interactive example. Parent and child exchange only the documented playback and
theme messages, with sender-window checks. The five native-scroll studies mark
their pane with `data-preview-scroll`; only gallery URLs with `preview=1` perform
a bounded demonstration scroll. Reduced motion goes directly to a readable
endpoint. Standalone examples and the workbench preserve user-controlled scroll.

Card-level Copy code and Details actions do not navigate or replace the gallery.
One native dialog provides the quick inspector and pauses the covered previews
while it is open. Closing restores focus to its invoking control and preserves
the gallery's scroll position, filters, and frame nodes. The workbench and quick
inspector share reference rendering and export helpers while keeping their view
state, tab IDs, and keyboard tab navigation separate.

The catalog already carries the usage guidance, timing, dependencies, and other
reference metadata. Details initially renders that information without fetching
complete source; Colors and the AI brief use the same metadata. Code, full HTML
copy, and downloads fetch example JSON on demand. Resolved source is cached by
recipe ID, concurrent requests for the same recipe share their load, and failed
loads can retry. A completed request must not reopen a closed inspector or replace
a more recently selected study.

Every example embeds the theme resolver and `window.Demo`. The resolver validates
its embedded configuration and URL overrides, then installs semantic CSS custom
properties. Parent messages can update the same properties while a preview is
open. All recipe colors consume those roles; raw palette values stay in the
shared registry. The standalone fallback stylesheet supplies a coherent appearance
before scripts run. See [theming](theming.md) for the complete color contract.

`window.Demo` provides current reduced-motion, paused,
and speed values; duration adjustment; `Demo.animate`; replay and settings hooks;
and page cleanup. CSS tokens are embedded too. Read dynamic getters at the point
of interaction rather than capturing a preference once. Cancel prior sequences
on replay and bound any timer or animation ownership.

Ordinary keyboard actions are immediate. The external Replay control deliberately
requests the educational motion even when activated by keyboard. Reduced motion
still preserves an immediate readable state. Visibility changes pause active
animations; page cleanup releases registered resources.

The 96 native studies need no third-party animation runtime. `spring-orb`, `magnetic-button`,
`drag-card`, and `dock-magnification` use Motion 14.1.0, which esbuild embeds into their individual HTML
documents. The Motion code is not fetched from a CDN when the example runs.
Standalone files use local/system typography and make no external asset requests.

## Navigation, persistence, and reuse

Routing uses query parameters, so a static host does not need an application-route
rewrite. A focused link is `?animation={id}`. Category, collection, intent,
technology, complexity, sort order, search, and the notes page also use query
parameters. Recipe IDs identify saved items and generated filenames. Preserve IDs
or provide a deliberate compatibility migration.

Collections describe five practical project contexts while categories describe
the motion family. `src/collections.mjs` supplies reviewed metadata for the
original 36 studies; new recipes declare their own intent, one to three valid
collections, complexity, and added date. The build validates this metadata before
producing the catalog. Search includes use cases and collection vocabulary.

Theme parameters are `palette`, `mode`, `accent`, and `custom`. The gallery offers
Match site in addition to Light and Dark. Copying a link or full example resolves
Match site to the current concrete appearance, so another person's site setting
does not change that reference. The chosen appearance is embedded in both the
standalone stylesheet and its configuration; a valid URL override takes precedence.

Favorites, the shell theme, palette/appearance preference, playback preference,
and the user's reduced-motion choice use browser storage. The site has no account
or synchronization service. When storage is unavailable, controls continue to
work for the visit. Copy and download actions capture the selected appearance
when invoked, including while source is still loading. Clipboard writes with
asynchronous source initiate a promise-backed plain-text item during the user
action where the browser supports it. Clipboard operations retain a selection
fallback and a native manual-copy dialog. Recovery stays within the active modal
and returns focus to the corresponding copy control.

Agents can read `catalog.json` for discovery, `theme-presets.json` for palette
options, and `llms-full.txt` for explanations and study source. The full standalone
HTML is the executable authority because it also contains the shared styles,
theme resolver, and runtime. Copying one study into another project should
preserve its behavior and constraints while adopting that project's existing
tokens and component primitives. The Colors tab exports `.animation-theme`
wrappers with literal values or scoped host aliases. Radix aliases require active
gray and selected-accent scales; Geist aliases map neutral roles and retain the
selected accent's fallback values.

## Deployment boundary

Development dependencies are needed to build and validate. Production serves only
`dist/`; there is no Node server, database, API key, environment variable, or
backend required by the application. The main gallery needs HTTP hosting because
it fetches JSON. An individual complete HTML example can be opened from a file.
See [deployment](deployment.md) for host configuration and verification.
