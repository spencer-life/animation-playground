# Contributing

Use an existing issue where one fits; otherwise describe the proposed behavior and
acceptance criteria in a focused issue. Follow the [Git workflow](docs/git-workflow.md)
for branches, review, and delivery. Preserve unrelated edits and existing recipe IDs.

## Set up and work

Use Node.js 24 or newer and the pnpm version in `package.json`. Review dependency
changes and their lockfile together; keep one package manager and one lockfile.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm dev
```

The preview server serves `dist/`; rerun `pnpm build` after source changes. It is
a local development server, not the production hosting service.

Before writing a recipe, read [the authoring contract](docs/recipe-contract.md),
the relevant [skill guidance](docs/skills.md), and a similar existing example.
Keep the preview, copied full HTML, documentation, and agent metadata consistent.
Choose a concrete purpose for movement and document when stillness is preferable.

## Validate the change

```sh
pnpm exec playwright install chromium
pnpm check
pnpm build
pnpm test
pnpm security
```

Install the browser once for the selected Playwright version, then again when that
version requires a different browser revision. System dependencies may also be
needed; follow [Playwright's browser guide](https://playwright.dev/docs/browsers).
Do not substitute an unrelated browser version without recording that coverage.

If your environment supplies a compatible browser separately, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute executable path before
`pnpm test`. Record the actual browser version alongside the test results.
The local `mise.toml` pins Node 24.19.0 and pnpm 11.25.0.

Inspect the affected behavior at compact and expanded sizes. Exercise keyboard
and touch operation, rapid retriggering, replay, pause, speed changes, reduced
motion, and the exported standalone file. A shared runtime or build change can
affect all 36 examples. Validate copy/download and deep links when their paths
change. Check layout and accessibility beyond what automated tools can prove.

Report the exact revision, commands, and passed, failed, skipped, unavailable, or
intentionally inapplicable results. Do not claim physical-device validation from
browser emulation. Do not label a missing browser or network-blocked audit a pass.

## Prepare the pull request

Lead with the problem, what changes, and the resulting behavior. Link the issue;
include validation and any remaining limitation. Screenshots help reviewers assess
visual changes; short recordings or slowed playback help assess motion.

Commit source, reviewed dependency changes, and affected documentation. Keep
dependencies, credentials, machine configuration, generated test output, and
temporary files out of commits. Rebuild generated assets through the build script.
Retain applicable licenses and source attribution. Publication and merging follow
the user's authorization and effective repository rules.
