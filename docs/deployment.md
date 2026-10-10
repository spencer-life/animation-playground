# Deploying the playground

The production artifact is `dist/`. Build it once and publish it to a static host;
the application needs no server functions, database, API key, or runtime secrets.
The initial production host is Vercel, connected to this repository's `main`
branch. The public domain is
[animation-playground-murex.vercel.app](https://animation-playground-murex.vercel.app/).

## Theme-aware hub delivery record

The expansion in [issue #5](https://github.com/spencer-life/animation-playground/issues/5)
was prepared in [PR #6](https://github.com/spencer-life/animation-playground/pull/6).
Its initial validated application source was
[`445f3647cf5d4511df2eb2fa726973a9f5751a57`](https://github.com/spencer-life/animation-playground/commit/445f3647cf5d4511df2eb2fa726973a9f5751a57).
Vercel deployment
[`dpl_HQyUpSkZ4NWavw72KrvjuayaXb9Q`](https://vercel.com/spencer-schofields-projects/animation-playground/HQyUpSkZ4NWavw72KrvjuayaXb9Q)
reached `READY` as a preview with 44 studies, five project collections, and themed
standalone exports. A subsequent Codex review correction strengthened accent-text
contrast and Radix token exports; the PR and issue record the final reviewed head,
merge, and verified production deployment. The full final suite passed 153 tests.

The preview uses the project's existing Vercel Authentication setting. A
temporary share-link session verified catalog/module delivery, selected colors,
exact copy/download equality, native and Motion examples operating offline, and
a 390-pixel workbench without page errors or horizontal overflow. Full results
and limits are in the [hub validation record](hub-validation.md).

The deployment above preserves the initial hub preview evidence. The public
production domain follows reviewed merges to `main` through the existing Git
integration and [Git workflow](git-workflow.md). Use issue #5 for the hub's latest
delivery status. The initial delivery below remains a rollback reference.

## Verified initial delivery

| Item | Recorded result |
| --- | --- |
| Date | 10 October 2026 |
| Source | [`ef45f94b1e0ef1b1446ae4261978f4ad853524b7`](https://github.com/spencer-life/animation-playground/commit/ef45f94b1e0ef1b1446ae4261978f4ad853524b7), merged through [PR #2](https://github.com/spencer-life/animation-playground/pull/2) |
| Project | `animation-playground`, Git-linked to `spencer-life/animation-playground` |
| Initial deployment | [`dpl_3z5Egh9z4cArqM1W7MZhPy2sWfBo`](https://vercel.com/spencer-schofields-projects/animation-playground/3z5Egh9z4cArqM1W7MZhPy2sWfBo) |
| Deployment state | `READY`, target `production`, with the public domain verified independently |
| Build | Frozen-lockfile installation used pnpm 11.25.0; `pnpm build` produced all 36 examples |
| Verification | Public-host smoke check began at 21:03:27 UTC and passed in Chromium 153.0.8010.0 |

The public root, catalog, and agent reference returned HTTP 200 without account
authentication. The gallery rendered all 36 entries and an embedded example. A
direct [shared-element workbench](https://animation-playground-murex.vercel.app/?animation=shared-element)
opened and changed state through its actual control. Full-code copying matched
the published standalone source exactly; Copy link and Copy for AI used the
production hostname. The downloaded HTML matched the copied file and opened with
browser networking disabled. Published native and Motion example files matched
the locally validated build. The mobile workbench had no horizontal overflow,
and the smoke check produced no page errors.

The browser used the workspace's required HTTP proxy and its supplied CA for this
temporary verification session. This is test-environment setup, not a setting
required by visitors or by the application. See [validation](validation.md) for
the full 58-test source run and its browser and accessibility limits.

This commit and deployment provide a known working rollback reference. Later
delivery-documentation changes do not alter the tested application source. The
build issue records the final documentation merge and current production result.

## Build contract

| Setting | Value |
| --- | --- |
| Source repository | `spencer-life/animation-playground` |
| Build directory | Repository root |
| Node | 24.x on Vercel; the local validation used 24.19.0 |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Published directory | `dist` |
| Framework preset | Static / Other |
| Runtime environment variables | None required |

Use the package-manager version declared in `package.json`. Installation must
include build dependencies because the build embeds Motion and copies the local
font. Do not run the local preview server as the production service.

For Vercel builds, set the non-secret configuration variable
`ENABLE_EXPERIMENTAL_COREPACK=1` for production and preview. This selects the pinned
package-manager version from `package.json`, following
[Vercel's Corepack guidance](https://vercel.com/docs/builds/configure-a-build).
This is build configuration; the published static application needs no environment
variables or secrets at runtime.

## Verify the artifact before publishing

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm check
pnpm build
pnpm test
pnpm security
```

For interactive inspection:

```sh
pnpm dev
```

Open [http://localhost:4173](http://localhost:4173). This serves the existing build;
it does not watch or rebuild source. Browser installation or audit access may be
blocked in an environment; report those checks as unavailable until they can run.
Do not infer browser-test success from a successful static build.

## Reproduce the Vercel setup

Create or reuse the Vercel project linked to the specified repository, selecting
the intended existing account/team and the build settings above. Inspect existing
project state before creating another project. Confirm which branch and exact
commit will be built, and distinguish a preview deployment from production.

After the deployment completes, verify the actual production URL, the gallery,
one direct `?animation=shared-element` link, the JSON catalog, and a downloaded
standalone example. Verify copied source and its links use the final host. Record
the deployment URL, source revision, validation, and any limitations. Keep a known
working deployment or commit available as the rollback target.

The user authorized the initial end-to-end build and hosting. Future unrelated
service changes follow the [Git workflow](git-workflow.md) and their own task
scope. Merely having a connector or credentials does not establish authority.

## GitHub Pages option

GitHub Pages is also compatible with this static output. Pages must be enabled
and its publishing source selected in the repository's
[Pages settings](https://github.com/spencer-life/animation-playground/settings/pages).
The GitHub connector used for initial repository work does not expose that
settings operation. A `.nojekyll` marker or workflow file alone does not enable
Pages.

For branch publishing, place the reviewed built artifact in a dedicated publishing
branch and select that branch's root as the source. Alternatively, an explicitly
requested, manually triggered workflow can build and publish an artifact after
Pages is configured for Actions. This project does not automatically add a Pages
workflow or automatic CI. Follow [GitHub's publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
for the chosen route and verify the resulting build and URL.

The site uses relative resource paths and query-parameter routes so it can live
under `/animation-playground/` as well as a domain root. Verify that path on the
actual host; do not introduce root-absolute paths when extending the application.

## Moving to another host or Sites

Keep this repository as the editable source and generate `dist/` through the same
build. Transfer the static artifact using the target platform's supported import
or deployment process. Preserve the `examples/` directory, JSON catalog, text
references, font, and notices together. No backend data migration is needed.

Standalone example files remain individually reusable regardless of host. Saved
favorites are browser-origin storage, so a new hostname starts a separate local
collection. Existing shared links still point at the old hostname; retain it or
provide redirects when continuity matters.
