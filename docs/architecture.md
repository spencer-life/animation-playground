# Architecture

Animation Playground separates the browsing interface from each executable study.
The gallery is a static JavaScript application; every example is a complete HTML
document. The preview iframe, copied full example, and downloaded HTML all use the
same generated document.

## Source ownership

| Source | Responsibility |
| --- | --- |
| `src/recipes/interface.mjs` | Six feedback and six navigation recipes. |
| `src/recipes/structure.mjs` | Six layout and six text recipes. |
| `src/recipes/expressive.mjs` | Six entrance and six expressive recipes. |
| `src/demo-base.css` | Embedded typography, controls, layout helpers, motion tokens, and preference rules. |
| `src/demo-runtime.js` | Embedded playback state, WAAPI wrapper, replay/settings callbacks, and cleanup. |
| `src/motion-entry.js` | Explicit Motion exports bundled for the three spring studies. |
| `src/app.js` | Catalog browsing, workbench, routing, copying, saving, and iframe coordination. |
| `src/styles.css` and `src/index.html` | Responsive site shell, theme, markup, and loading fallback. |
| `scripts/build.mjs` | Static output, bundled Motion, executable examples, metadata, and agent references. |
| `scripts/serve.mjs` | Local HTTP server for the built `dist/` directory. |

See the [recipe contract](recipe-contract.md) for fields and helper APIs. The build
currently expects 36 recipes; changing the size of the collection requires updating
that expectation and related content and checks together.

## Build outputs

`pnpm build` replaces `dist/` and writes the website plus these generated resources:

| Output | Use |
| --- | --- |
| `catalog.json` | Compact schema-versioned metadata, IDs, categories, tags, timing, dependencies, source links, and paths. |
| `examples/{id}.html` | Complete runnable source for one study. |
| `examples/{id}.json` | Workbench metadata, full HTML, compact study source, and copyable snippets with prerequisites. |
| `examples/index.html` | A simple directory of standalone examples. |
| `llms.txt` | Entry points for agents and other automated readers. |
| `llms-full.txt` | Complete educational source, use constraints, timing, and source references for the collection. |
| `assets/` | The gallery font and favicon. |
| `.nojekyll` | Static publishing marker for hosts that recognize it. |

The build also copies license and third-party notices when present. Preserve
those files with redistributed code. Source changes belong in `src/` and scripts;
generated output should be rebuilt consistently.

## Runtime and isolation

The site shell fetches same-origin catalog and example JSON. Gallery previews are
sandboxed iframes with script permission, loaded near the viewport and paused
when out of view. A gallery overlay opens the workbench; the workbench iframe
provides the interactive example. Parent and child exchange only the documented
playback messages, with sender-window checks.

Every example embeds `window.Demo`. It provides current reduced-motion, paused,
and speed values; duration adjustment; `Demo.animate`; replay and settings hooks;
and page cleanup. CSS tokens are embedded too. Read dynamic getters at the point
of interaction rather than capturing a preference once. Cancel prior sequences
on replay and bound any timer or animation ownership.

Ordinary keyboard actions are immediate. The external Replay control deliberately
requests the educational motion even when activated by keyboard. Reduced motion
still preserves an immediate readable state. Visibility changes pause active
animations; page cleanup releases registered resources.

The 33 native studies need no third-party runtime. `spring-orb`, `magnetic-button`,
and `drag-card` use Motion 14.1.0, which esbuild embeds into their individual HTML
documents. The Motion code is not fetched from a CDN when the example runs.
Standalone files use local/system typography and make no external asset requests.

## Navigation, persistence, and reuse

Routing uses query parameters, so a static host does not need an application-route
rewrite. A focused link is `?animation={id}`; category/search and the notes page
also use query parameters. Recipe IDs also identify saved items and generated
filenames. Preserve IDs or provide a deliberate compatibility migration.

Favorites, theme, playback preference, and the user's reduced-motion choice use
browser storage. The site has no account or synchronization service. When storage
is unavailable, controls continue to work for the visit. Clipboard operations
have a selection-based fallback and then a native manual-copy dialog.

Agents can read `catalog.json` for discovery and `llms-full.txt` for explanations
and study source. The full standalone HTML is the executable authority because it
also contains the shared styles and runtime. Copying one study into another
project should preserve its behavior and constraints while adopting that project's
existing tokens and component primitives.

## Deployment boundary

Development dependencies are needed to build and validate. Production serves only
`dist/`; there is no Node server, database, API key, environment variable, or
backend required by the application. The main gallery needs HTTP hosting because
it fetches JSON. An individual complete HTML example can be opened from a file.
See [deployment](deployment.md) for host configuration and verification.
