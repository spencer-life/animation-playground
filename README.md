# Animation Playground

**36 animations to explore, take apart, and reuse.** A responsive playground with
live demonstrations, practical explanations, complete copyable code, and stable
references for future ChatGPT and Codex work.

<!-- live-url -->
The live URL will be added after production deployment is verified. The initial
build and delivery are tracked in [issue #1](https://github.com/spencer-life/animation-playground/issues/1).

## Explore the collection

| Collection | Examples |
| --- | --- |
| Feedback | Press feedback, toggles, confirmation, and progress |
| Navigation | Indicators, native popovers, dialogs, and anchored transitions |
| Layout | Accordions, FLIP reorder, shared elements, cards, and activity history |
| Text | Staggered words, crossfades, rolling digits, masks, and mechanical letters |
| Entrances | Reveals and coordinated group arrivals |
| Expressive | Springs, gestures, and occasional decorative motion |

There are six recipes in each category. Search by name, purpose, technique, or
tag; save favorites in the current browser; and open any example in its workbench.
The workbench provides replay, pause, 1×/0.5×/0.25× speed, reduced motion, source
code, usage guidance, and a ready-to-copy brief for an AI assistant. Light and dark
themes apply to the surrounding interface; each study keeps its own composition.

## Take an animation into a project

1. Open an animation and try its actual control or gesture.
2. Read **How it works**, including where the effect is useful and where to leave
   it out.
3. Choose **Copy full example** or download the standalone HTML. This is the exact
   HTML file running in the preview, with its styles and behavior included.
4. Adapt its colors and typography to the receiving project while preserving its
   timing, interruption behavior, native semantics, and reduced-motion state.

The CSS and JavaScript copy buttons include their shared prerequisites. The
on-screen short snippets emphasize the recipe itself; the full HTML is the
complete runnable export. A downloaded example works without a network request.

Use **Copy for AI** to give ChatGPT or Codex the recipe ID, direct link, complete
source URL, source module, timing, dependencies, and reuse constraints. The agent
can bring the individual behavior into a project without recreating this site.

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
command. `pnpm check` validates the recipe contract, embedded-script syntax,
selected motion rules, and exact direct-dependency pins. `pnpm security` checks
runtime asset/isolation boundaries and audits production dependencies at high
severity or above; it is not a comprehensive security audit. Check results depend
on the current environment and revision. A missing browser or blocked download is
unavailable coverage, not a successful test run. See [Contributing](CONTRIBUTING.md)
for the review workflow and verification scope.

## Structure and portable references

- `src/recipes/interface.mjs`: feedback and navigation studies.
- `src/recipes/structure.mjs`: layout and text studies.
- `src/recipes/expressive.mjs`: entrances and expressive studies.
- `src/demo-base.css` and `src/demo-runtime.js`: shared styles and playback behavior
  embedded into every standalone example.
- `src/app.js`, `src/styles.css`, and `src/index.html`: the gallery and workbench.
- `scripts/build.mjs`: builds the static site, examples, catalog, and agent references.

The build produces `catalog.json`, `llms.txt`, and `llms-full.txt`, plus
`examples/{id}.html` and `examples/{id}.json`. A focused site link uses
`?animation={id}`. IDs such as `shared-element` and `staggered-words` are durable
references. Read the [architecture](docs/architecture.md) and
[recipe contract](docs/recipe-contract.md) before adding a pattern.

The main site needs static HTTP hosting because it fetches its catalog. Individual
downloaded HTML examples can be opened directly. The three Motion studies
(`spring-orb`, `magnetic-button`, and `drag-card`) embed Motion 14.1.0; the other 33
use native browser APIs. No React runtime, backend, API key, account, or external
asset request is required by a standalone example.

## Sources, hosting, and contribution

The collection contains original educational implementations informed by
[Emil Kowalski's skills](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d).
It is an independent project with no implied endorsement. The
[source review](docs/emil-research.md) records applicability, and
[skill routes](docs/skills.md) preserve the reviewed revision for future work.

Deploy `dist/` to a static host. See [deployment](docs/deployment.md) for the planned
Vercel route, GitHub Pages configuration, and later portability. No automatic
GitHub Actions validation or deployment workflow is required by this project.

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md) and the
[project Git workflow](docs/git-workflow.md). Original code is MIT licensed;
retain [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) when
redistributing the relevant code. Report security concerns using [SECURITY.md](SECURITY.md).
