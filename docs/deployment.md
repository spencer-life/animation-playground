# Deploying the playground

The production artifact is `dist/`. Build it once and publish it to a static host;
the application needs no server functions, database, API key, or runtime secrets.
Vercel is the planned initial route. Deployment is not established by this
document: record the verified production URL and delivered revision in the README
and build issue after publishing.

## Build contract

| Setting | Value |
| --- | --- |
| Source repository | `spencer-life/animation-playground` |
| Build directory | Repository root |
| Node | 24 or a compatible newer version permitted by `package.json` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Published directory | `dist` |
| Framework preset | Static / Other |
| Runtime environment variables | None required |

Use the package-manager version declared in `package.json`. Installation must
include build dependencies because the build embeds Motion and copies the local
font. Do not run the local preview server as the production service.

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

## Initial Vercel route

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
