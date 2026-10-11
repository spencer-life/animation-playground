# Animation Playground

**100 animations to explore, match to your project, and reuse.** A responsive hub
with live demonstrations, practical explanations, complete copyable code, and
stable references for future ChatGPT and Codex work.

<!-- live-url -->
**[Open Animation Playground](https://animation-playground-murex.vercel.app/)**

The public site is deployed on Vercel from this repository's `main` branch. The
initial build and verified delivery are recorded in
[issue #1](https://github.com/spencer-life/animation-playground/issues/1).

## Find motion for your project

Start with one of five project collections. A study can belong to more than one
collection when its use cases genuinely overlap.

| Project collection | What to look for |
| --- | --- |
| Product UI | Clear buttons, settings, menus, loading, and short setup flows. |
| Landing pages | Useful reveals, navigation details, portfolio interactions, and calls to action. |
| Dashboards | Progress, charts, changing views, loading content, and compact workspaces. |
| Storytelling | Reading position, short headlines, connected sequences, and explanatory motion. |
| Signature motion | Distinctive gestures, dimensional cards, light, and optional brand moments. |

Filter further by **Everyday UI** or **Expressive**, technology, and integration
complexity. Search includes practical use cases and collection vocabulary. Curated
ordering highlights useful starting points; A–Z makes a known title easy to find.
Favorites stay in the current browser, and related studies make it easy to keep
exploring from an open workbench.

The six motion categories remain available as another way to browse:

| Motion category | Examples |
| --- | --- |
| Feedback | Press feedback, toggles, confirmation, and progress |
| Navigation | Indicators, native popovers, dialogs, and anchored transitions |
| Layout | Accordions, FLIP reorder, shared elements, cards, and activity history |
| Text | Staggered words, crossfades, rolling digits, masks, and mechanical letters |
| Entrances | Reveals and coordinated group arrivals |
| Expressive | Springs, gestures, and occasional decorative motion |

Previews start when their cards come into view and replay when you return to
them. Offscreen studies pause. Scroll-driven examples demonstrate a short pass
inside the card; the workbench keeps the actual scroll interaction. The gallery's
**Pause previews** and **Reduced motion** controls remain available.

Each gallery card has **Replay**, **Copy code**, and **Details** actions. Copy code
takes the complete HTML with your selected colors. Details opens the source,
usage guidance, color tokens, and AI brief over the collection; closing it keeps
your place, filters, and previews. You can copy a link or download the HTML there
too. Guidance and colors are available immediately; complete source loads when
you request it.

Open the workbench when you want to try the actual controls or gestures at a
larger size. It provides replay, pause, 1×/0.5×/0.25× speed, and the same reference
and export tools as the gallery inspector.
The catalog covers everyday form feedback, upload queues, reversible actions,
navigation, tables, charts, and workspace layouts. Its expressive studies include
typographic sequences, dimensional galleries, native-scroll storytelling, image
reveals, path following, and finite celebrations. Color variants use the theme
controls; each catalog entry teaches a distinct interaction or motion behavior.

### Find a control style

Solid and outlined controls lead the collection. Accent-solid, ghost/text, icon,
segmented, surface, and selective soft treatments provide a useful range. Search
by style and task together, such as **outline hold** or **solid save**.

| Style | Starting points |
| --- | --- |
| [Solid](https://animation-playground-murex.vercel.app/?q=solid) | Press feedback, Save state, selected segments, and primary workflow actions. |
| [Outline](https://animation-playground-murex.vercel.app/?q=outline) | Hold to confirm, menu toggle, replay controls, and secondary actions. |
| [Ghost](https://animation-playground-murex.vercel.app/?q=ghost) / [text actions](https://animation-playground-murex.vercel.app/?q=text+action) | Close and back controls, inline disclosures, and underlined navigation. |
| [Soft](https://animation-playground-murex.vercel.app/?q=soft) | In-button progress, dock icon faces, and the chart replay icon. |
| [Icon](https://animation-playground-murex.vercel.app/?q=icon) / [segmented](https://animation-playground-murex.vercel.app/?q=segmented) | Compact controls and grouped choices in several surface treatments. |

Styles can overlap within an example. The palette controls change its colors;
each study keeps its authored control treatment and motion. A color or button
variant does not count as an additional animation.

## Preview in your colors

The palette controls update the actual animation and the source you take with you:

- **Playground colors** keeps each study's original color family, with light and
  dark versions.
- **Radix** uses Slate surfaces and one of six accent scales.
- **Geist-inspired** pairs neutral surfaces with a selected accent; it is a
  portable interpretation, not the complete Vercel design system.
- **Custom accent** accepts a six-digit hex color on neutral surfaces.

Choose **Light**, **Dark**, or **Match site**. Radix and Geist-inspired palettes
offer Indigo, Blue, Violet, Jade, Amber, and Crimson. The **Colors** tab exports
scoped CSS values, Radix token aliases, or Geist neutral aliases. Full HTML,
downloads, and copied links preserve the selected appearance. Read the
[theming guide](docs/theming.md) for token mappings, host-theme integration, and
contrast considerations.

## Take an animation into a project

1. Browse the gallery and use a card's **Replay** button to study its sequence.
2. Choose a project palette and appearance. Use **Copy code** on the card for
   complete, portable HTML with those colors and all required behavior included.
3. Use **Details** to read **How it works**, inspect CSS/JavaScript/HTML, copy an
   AI brief or link, or download the full file without leaving the collection.
   Read the guidance on where the effect fits and where to leave it out.
4. For an existing design system, copy the **Colors** tab's tokens onto a dedicated
   `.animation-theme` wrapper. Adapt typography and map semantic roles to the
   receiving project while preserving timing, interruption behavior, native
   semantics, and the reduced-motion state.

Choose **Open workbench** from Details, or open the preview itself, to test the
actual interaction and compare playback speeds. Its **Copy full example** action
produces the same complete export as the card's Copy code button.

The CSS and JavaScript copy buttons include their shared prerequisites. CSS copy
also includes the current palette. The on-screen short snippets emphasize the
recipe itself; the full HTML is the complete runnable export. A downloaded example
retains its chosen colors and works without a network request.

Use **Copy for AI** to give ChatGPT or Codex the recipe ID, direct link, complete
source URL, source module, timing, dependencies, selected colors, and reuse
constraints. The agent can bring the individual behavior into a project without
recreating this site.

```text
Use the shared-element recipe from my Animation Playground.
Read its complete standalone source, then adapt the behavior to this project.
Preserve keyboard access, reduced motion, cancellation, and the existing design tokens.
```

## Run locally

Use Node.js 24 or newer and the pnpm version declared in `package.json`
(`11.25.0` for this initial implementation).

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

Open [http://localhost:4173](http://localhost:4173). `pnpm dev` serves the built
`dist/` folder; it does not watch or rebuild source files. After editing, run
`pnpm build` and refresh. `PORT` can select another port. The preview server binds
to `0.0.0.0`, allowing a phone on the same reachable network to open it.

## Validate changes

Install Playwright's browser before running browser tests:

```sh
pnpm exec playwright install chromium
pnpm check
pnpm build
pnpm test
pnpm security
```

`pnpm ci` runs check, build, and browser tests in sequence; security is a separate
command. `pnpm check` validates the recipe contract, discovery metadata, semantic
color usage, embedded-script syntax, selected motion rules, and exact
direct-dependency pins. `pnpm security` checks
runtime asset/isolation boundaries and audits production dependencies at high
severity or above; it is not a comprehensive security audit. Check results depend
on the current environment and revision. A missing browser or blocked download is
unavailable coverage, not a successful test run. See [Contributing](CONTRIBUTING.md)
for the review workflow and verification scope.

The [catalog expansion record](docs/catalog-expansion.md) documents the 100-study
scope, relevant Emil guidance, validation, and review. Its
[delivery issue](https://github.com/spencer-life/animation-playground/issues/7)
tracks the reviewed revision and preview. The earlier
[hub validation record](docs/hub-validation.md) preserves the 44-study delivery,
including Codex's contrast correction and its 153-test run. The
[initial validation record](docs/validation.md) preserves the first delivery.

## Structure and portable references

- `src/recipes/interface.mjs`: feedback and navigation studies.
- `src/recipes/structure.mjs`: layout and text studies.
- `src/recipes/expressive.mjs`: entrances and expressive studies.
- `src/recipes/hub.mjs`: eight additional interface, layout, reading, and signature studies.
- `src/recipes/forms.mjs`: 20 form, selection, upload, and request-feedback studies.
- `src/recipes/workflows.mjs`: 20 navigation, layout, dashboard, and contextual-control studies.
- `src/recipes/storytelling.mjs`: 16 typography, reveal, scrolling, and expressive studies.
- `src/collections.mjs`: project collections and curated discovery metadata.
- `src/catalog-contract.mjs`: catalog size, retained IDs, and featured-collection integrity.
- `src/theme.mjs`: palette resolution, URL settings, live theme updates, and token exports.
- `src/demo-base.css` and `src/demo-runtime.js`: shared styles and playback behavior
  embedded into every standalone example.
- `src/app.js`, `src/styles.css`, and `src/index.html`: the gallery and workbench.
- `scripts/build.mjs`: builds the static site, examples, catalog, and agent references.

The build produces `catalog.json`, `theme-presets.json`, `llms.txt`, and `llms-full.txt`, plus
`examples/{id}.html` and `examples/{id}.json`. A focused site link uses
`?animation={id}`. Add `palette=radix&mode=dark&accent=indigo` to keep the
reference's colors. IDs such as `shared-element` and `staggered-words` are durable
references. Read the [architecture](docs/architecture.md) and
[recipe contract](docs/recipe-contract.md) before adding a pattern.
The [design system](DESIGN.md) records the actual palette, typography, components,
and responsive rules so new additions remain consistent with the playground.

The main site needs static HTTP hosting because it fetches its catalog. Individual
downloaded HTML examples can be opened directly. The four Motion studies
(`spring-orb`, `magnetic-button`, `drag-card`, and `dock-magnification`) embed Motion 14.1.0; the other 96
use native browser APIs. No React runtime, backend, API key, account, or external
asset request is required by a standalone example.

## Sources, hosting, and contribution

The collection contains original educational implementations informed by
[Emil Kowalski's skills](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d).
It is an independent project with no implied endorsement. The
[source review](docs/emil-research.md) records applicability, and
[skill routes](docs/skills.md) preserve the reviewed revision for future work.

Deploy `dist/` to a static host. See [deployment](docs/deployment.md) for the verified
Vercel setup, GitHub Pages configuration, and later portability. No automatic
GitHub Actions validation or deployment workflow is required by this project.

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md) and the
[project Git workflow](docs/git-workflow.md). Original code is MIT licensed;
retain [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) when
redistributing the relevant code. Report security concerns using [SECURITY.md](SECURITY.md).
