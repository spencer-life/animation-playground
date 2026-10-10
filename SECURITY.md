# Security

## Supported scope

Security maintenance targets the current `main` source and its corresponding
built site. There is no support promise for old copied snippets, forks, or
independently modified deployments. A copied example becomes part of the
receiving project's maintenance responsibility.

This is a static demonstration site. It has no application backend, account
system, payment processing, or API-key configuration. Demonstration controls do
not perform real destructive operations. Favorites and interface preferences are
stored in the visitor's browser; they are not synced to an account.

## Reporting a vulnerability

Use [GitHub's private vulnerability reporting route](https://github.com/spencer-life/animation-playground/security/advisories/new)
if it is available for this repository. Its availability must be verified in
GitHub; this file does not enable it. If the private route is unavailable, open an
issue requesting a private reporting channel without including exploit details,
credentials, personal data, or other sensitive material.

Include the affected commit or deployed URL, browser, reproduction steps, impact,
and a minimal safe example. Keep active exploitation and sensitive findings out of
public discussions. No response-time guarantee is implied.

## Implementation boundaries

- The gallery loads its own generated catalog and example files. It does not
  accept user-supplied executable recipes.
- Embedded examples use `sandbox="allow-scripts"`; retain that isolation unless a
  concrete feature and its consequences have been reviewed.
- The full downloaded HTML intentionally contains executable JavaScript. Review
  code before incorporating it into a different application's trust boundary.
- Preserve escaping when rendering catalog text or code and the build's handling
  of closing script tags. Do not interpolate untrusted HTML into a recipe.
- The local preview server exposes `dist/` on `0.0.0.0`; use it only on a network
  appropriate for development. Production belongs on a static host.
- Keep credentials and hosting tokens outside repository files, build output,
  example source, test artifacts, and logs.

`pnpm security` checks local runtime assets, iframe isolation, and the absence of
dynamic evaluation in recipe source, then runs
`pnpm audit --prod --audit-level=high`. This dependency audit covers production
dependencies, not the development-tool supply chain. Inspect the actual script
when assessing coverage. A passing local check is not an exhaustive audit or proof
that GitHub alerts, private reporting, protection, or hosting controls are enabled.
Dependency updates require lockfile review and affected validation.
