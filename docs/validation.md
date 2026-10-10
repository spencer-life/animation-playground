# Initial implementation validation

For the current 44-study hub expansion and its 151-test run, see the
[theme-aware hub validation](hub-validation.md). This page preserves the initial
36-study delivery as historical evidence.

This record covers the application delivered through [PR #2](https://github.com/spencer-life/animation-playground/pull/2).
The pull request records its exact reviewed head and the resulting merge revision.
These are observed results from 10 October 2026, not a promise that future changes
or other browser engines have the same coverage.

The validated application, export pipeline, and tests are preserved in source
commit [`733c6f4c40861234453235d7f3bdb2a17a1450dc`](https://github.com/spencer-life/animation-playground/commit/733c6f4c40861234453235d7f3bdb2a17a1450dc).
Subsequent design and delivery documentation does not change that application
source.

## Runtime and commands

| Item | Observed result |
| --- | --- |
| Node.js | 24.19.0 |
| pnpm | 11.25.0, with the committed lockfile |
| Playwright | 1.64.0 |
| Browser used | Chromium 153.0.8010.0, supplied through `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` |
| `pnpm check` | Passed: recipe contract, embedded JavaScript syntax, selected motion rules, and pinned direct dependencies |
| `pnpm build` | Passed: 36 standalone HTML examples, 36 JSON references, catalog, agent references, and static application |
| `pnpm test` | 58 passed, 0 failed, 0 skipped, 0 flaky; final source run began at 20:43:22 UTC and completed in 16.0 seconds |
| `pnpm security` | Passed structural asset/isolation checks; production dependency audit reported no known vulnerabilities |
| `git diff --check` | Passed |

The standard Playwright Chromium download failed in the working environment.
Testing used the explicitly supplied Chromium version above; it did not use
Playwright's default Chromium 156 revision. The executable override is supported
by the committed test configuration and documented in [Contributing](../CONTRIBUTING.md).

## Browser coverage

The suite exercises all 36 exported examples at a compact 300 × 230 viewport,
checks for runtime errors and external requests, and verifies replay, speed,
reduced-motion rendering, and automated WCAG A/AA rules through Axe. The gallery,
workbench, and motion notes receive their own automated accessibility checks.

Application coverage includes exact equality between copied full HTML and the
generated example, AI reference fields, direct links, search,
category filters, favorites and reload, empty states, themes, history, and
keyboard navigation. Responsive checks cover widths of 320, 390, 768, 1024, and
1440 pixels without horizontal page overflow.

Twelve targeted regression tests cover the functional review findings: starting
an initially paused preview, preserving timed callbacks through pause and speed
changes, keyboard activation timing, the standalone orbit pause control, flip-card
accessibility, route focus, system reduced-motion changes, persisted page lifecycle
events, and deliberate hold-to-confirm cancellation.

## Visual and code review

An independent code review identified playback, timer, focus, reduced-motion,
standalone-control, and lifecycle issues. The fixes were reviewed and exercised by
the targeted regression tests. A subsequent read-only review approved the final
SVG and export-related diff against that functional baseline, including all 36
generated HTML/JSON pairs and the authoring helper's inclusion in the source.

Visual inspection covers desktop, tablet, and phone galleries; desktop and phone
workbenches; dark theme; motion notes; and a contact sheet of all 36 examples.
Additional compact and expanded captures cover both flip-card faces and the drag
card during its active state. The final corrections address low-contrast secondary
text, optional labels, font-dependent symbol icons, and a flip-card corner overlap.
The independent finish reviewer inspected the refreshed evidence, marked all four
findings resolved, and returned a ship disposition. The design documentation
records the resulting visual system.

## Limits of this evidence

- Chromium coverage does not establish Firefox, Safari/WebKit, or physical-device
  compatibility. Native popover, dialog, and animation behavior should be checked
  in the receiving project's supported browsers.
- Automated accessibility checks and keyboard inspection do not replace actual
  assistive-technology testing.
- The persisted lifecycle regression dispatches a persisted page event. It checks
  the cleanup branch, not actual browser back/forward-cache admission.
- The structural security check and dependency audit are bounded checks, not a
  comprehensive security assessment.
- Public hosting is verified separately after deployment and recorded in
  [deployment](deployment.md) and [issue #1](https://github.com/spencer-life/animation-playground/issues/1).

Re-run relevant checks when the shared runtime, export pipeline, recipe sources,
or dependencies change. Documentation-only updates do not change the tested
application artifact.
