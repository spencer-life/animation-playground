# Working on Animation Playground

Animation Playground is a static reference hub of 100 reusable web animations.
The website uses HTML, CSS, and JavaScript; 96 studies use native browser APIs and
four spring studies embed Motion. Keep the site portable and the examples easy
to take into another project.

## Start with the relevant source

- Read [README.md](README.md), [architecture](docs/architecture.md), and a similar
  recipe before changing behavior.
- Read the [recipe contract](docs/recipe-contract.md) before authoring or changing
  a recipe. Each source module exports metadata and complete HTML/CSS/JavaScript.
- Read [theming](docs/theming.md) and `src/theme.mjs` before changing colors,
  palette controls, copied source, or export behavior. Read `src/collections.mjs`
  before changing discovery metadata or project collections.
- Select and load relevant available guidance using [skill routes](docs/skills.md).
  Emil's animation guidance informs motion; broader interface changes may also
  benefit from Impeccable. Preserve upstream invocation restrictions.
- Follow the [Git workflow](docs/git-workflow.md). Track meaningful work in an
  issue, use a focused branch, preserve unrelated edits, and carry authorized work
  through validation and delivery.

## Preserve the reusable contract

- Keep recipe IDs stable. URLs, saved items, exported filenames, and agent briefs
  depend on them. Coordinate any necessary migration rather than silently renaming.
- Edit `src/recipes/`, `src/demo-base.css`, `src/demo-runtime.js`, `src/theme.mjs`,
  or `src/collections.mjs` as appropriate; rebuild generated files instead of
  editing `dist/` by hand.
- Preserve one source for the live preview and copied full HTML. A downloaded
  example must include its selected palette, styles, theme resolver, runtime, and
  any Motion code it needs. Direct links must preserve selected colors.
- Use semantic color tokens throughout recipe markup, styles, and scripts. Raw
  palette values belong in the shared theme registry, not individual studies.
  Include light, dark, project palettes, and custom accents when checking colors.
- New recipes must declare `intent`, one to three `collections`, `complexity`, and
  `added`, following the recipe contract. Keep useful, distinct patterns ahead of
  added counts; recoloring an existing animation does not create a new recipe.
- Keep timing, easing, purpose, use limits, dependency notes, and reduced-motion
  descriptions accurate when implementation changes.
- Start with visible, coherent content. Preserve native semantics, keyboard and
  touch access, focus visibility, cancellation, and cleanup.
- Ordinary keyboard navigation and frequent UI actions stay immediate. Replay is
  an explicit request to study an animation. Respect reduced-motion preferences.
- Use platform primitives for these bounded studies. Do not turn an educational
  notification or number study into an undocumented production component.

## Validate the actual change

Use the declared pnpm version and committed lockfile. The supported commands are
in `package.json`; inspect their implementations when coverage matters.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm test
pnpm security
```

Browser tests require `pnpm exec playwright install chromium` first. Run relevant
checks rather than claiming coverage from a build alone. Changes to the shared
demo runtime, theme registry, or build pipeline can affect every exported example.
Inspect the compact preview, expanded workbench, reduced-motion state, relevant
keyboard/touch interactions, filtering, and replay. Verify that palette changes,
copied links, token aliases, full HTML, and offline downloads agree. Scope exported
`.animation-theme` aliases to a dedicated wrapper; do not overwrite a receiving
project's global `--accent` or other shared variables.

Report the exact revision and passed, failed, skipped, unavailable, or
intentionally inapplicable checks. Browser emulation does not establish physical
device behavior. Keep secrets, dependencies, test output, and machine configuration
out of commits. Use the [deployment guide](docs/deployment.md) within the user's
authorized scope; a configuration file is not evidence of a live deployment.
