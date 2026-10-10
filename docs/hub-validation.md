# Theme-aware hub validation

This record covers the expansion tracked in [issue #5](https://github.com/spencer-life/animation-playground/issues/5)
and reviewed in [PR #6](https://github.com/spencer-life/animation-playground/pull/6).
The validated application, export pipeline, and test sources are preserved in
[`445f3647cf5d4511df2eb2fa726973a9f5751a57`](https://github.com/spencer-life/animation-playground/commit/445f3647cf5d4511df2eb2fa726973a9f5751a57).
Subsequent design and delivery documentation does not change those sources.
These are observed results from 10 October 2026.

## Runtime and commands

| Item | Observed result |
| --- | --- |
| Node.js / pnpm | 24.19.0 / 11.25.0, using the committed frozen lockfile |
| Playwright / browser | 1.64.0 / Chromium 153.0.8010.0 |
| `pnpm check` | Passed: 44 unique recipes, discovery metadata, syntax, motion rules, pinned dependencies, and the literal-hex recipe guard |
| `pnpm build` | Passed: 44 standalone HTML examples, 44 JSON references, searchable catalog, theme presets, shared theme module, and agent references |
| `pnpm test` | **151 passed, 0 failed, 0 skipped, 0 flaky**, in 38.2 seconds; run began at 22:49:03 UTC |
| `pnpm security` | Passed structural asset/isolation checks; production dependency audit reported no known vulnerabilities |
| `git diff --check` | Passed |

The standard Playwright Chromium 156 download failed in this environment.
The run used Chromium 153 through the existing
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` configuration. No dependency versions were
changed to accommodate that environment limitation.

## What the browser suite establishes

- All 44 standalone studies run at 300 × 230 pixels with meaningful content,
  replay, speed, and reduced-motion behavior, without page errors or external
  runtime requests. Axe checks their default light state and their Radix dark /
  Indigo state against automated WCAG A/AA rules.
- Shared token tests cover all four palettes in light and dark modes, six named
  accents, the six original material families, and 17 custom accent values that
  include black, white, saturated primaries, and contrast-boundary grays. They
  check the documented text/surface and button/hover contrast pairs.
- Discovery tests exercise all five collections, curated ordering, combined
  purpose/technology/complexity/search filters, A–Z order, back/forward history,
  saved items, invalid routes, and blocked storage.
- A 390 × 1000 touch viewport checks the initially collapsed native color
  disclosure, reachable filters, a first sample inside the viewport, and keeping
  the selected collection visible in its horizontally scrolling strip. General
  page-overflow checks cover 320, 390, 768, 1024, and 1440 pixels.
- Color controls update existing previews and the route. A deliberately delayed
  gallery HTML response verifies that a palette changed during loading still
  reaches the loaded iframe.
- Copy, download, source tabs, color aliases, AI briefs, and shared links preserve
  the chosen theme. Copied full HTML opens and responds with networking disabled.
- Keyboard checks cover application navigation and new studies. Custom black /
  dark and Radix amber / light cases verify actual visible focus outlines on four
  control patterns, their contrast, and stable reduced-motion geometry.
- The new dark workbench regression checks the related-collection control's
  accessibility and keyboard navigation after scrolling it into view.
- Playback regressions verify explicit motion overrides at first load, freezing
  active transitions during Pause, resuming them without jumps, and preserving
  outgoing activity rows until their transitions really finish. Earlier timer,
  keyboard, lifecycle, hold-to-confirm, and reduced-motion tests remain in the run.

## Review corrections

The implementation review identified stale palette delivery during iframe loading
and raw-accent focus outlines with insufficient contrast. Both were corrected and
covered by behavior tests. The visual review identified a browser-default button
fill in the related-collection link; its explicit transparent surface is covered
by the dark workbench regression. The mobile color controls were made a native
disclosure so browsing begins before the expanded configuration form.

Visual evidence includes the light and dark desktop galleries, a dark phone
gallery, and a dark desktop workbench. Full-content captures show all 44 settled
studies at the same widths. For full-content capture only, the browser viewport
height was expanded to make Chromium paint offscreen sandboxed iframes; ordinary
viewport captures were used to inspect the fixed navigation and first screen.

The design documentation records the authorized semantic light/dark sample
contract while retaining the incumbent Inter workspace and Material Sample Rack.
The final independent visual-review verdict was **ship**: its three requested
corrections (related-link contrast, the persisted theme contract, and targeted
focus verification) were all resolved. That verdict covers the correction batch;
it does not claim a new general audit beyond the recorded review and tests.

## Hosted preview verification

The application source above produced Vercel deployment
[`dpl_HQyUpSkZ4NWavw72KrvjuayaXb9Q`](https://vercel.com/spencer-schofields-projects/animation-playground/HQyUpSkZ4NWavw72KrvjuayaXb9Q),
which reached `READY` as a preview. This is separate from the existing production
deployment on `main`.

An authenticated share-link browser session verified:

- HTTP 200 for the catalog with 44 recipes and five collections.
- HTTP 200 and JavaScript MIME type for `theme.mjs`, with the actual gallery
  module and embedded previews running.
- Live palette changes; exact equality between copied custom-theme HTML and the
  locally generated counterpart; downloaded HTML equal to that copied file.
- The selected custom color in both the shared link and AI brief.
- A copied native example that opens and responds offline, and a copied Motion
  spring example that selects its target offline with no runtime errors.
- A 390-pixel workbench with a collapsed theme disclosure, no horizontal page
  overflow, and no page errors across the hosted smoke check.

The verification browser used this environment's HTTP proxy and explicitly
trusted only its supplied CA public key for the temporary session. Those settings
are not part of the application. Vercel's existing preview authentication remains
in place; share links are temporary and are not committed as credentials.

## Limits

This run covers Chromium, not Firefox, Safari/WebKit, physical devices, or actual
assistive technologies. Automated Axe checks and token contrast calculations are
bounded evidence; they do not establish every interaction state across every
study/palette combination. Receiving projects must check their own host-token
overrides and supported browsers. Geist-inspired colors are an authored neutral
preview with documented host aliases, not a complete copy of Vercel's system.

The production dependency audit and structural checks are not a comprehensive
security assessment. Initial delivery and rollback evidence remain in
[deployment](deployment.md) and the [initial validation record](validation.md).
Merge and production delivery follow the standing [Git workflow](git-workflow.md).
