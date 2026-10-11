# Expanding the animation catalog

This pass is tracked in [issue #7](https://github.com/spencer-life/animation-playground/issues/7).
It builds on the 44-study hub delivered in PR #6. The user approved a larger
catalog with a practical majority, distinctive expressive examples, complete
theme support, and explicit use of Emil's relevant guidance.

## Scope and curation

The catalog contains 100 distinct studies: the existing 44 plus 56 additions.
There are 67 everyday studies and 33 expressive studies. Recoloring or renaming
an existing effect does not count as an addition. Ninety-six use native browser
APIs; the four spring studies reuse the existing bundled Motion dependency.

| Source module | Additions | Intended use |
| --- | --- | --- |
| `src/recipes/forms.mjs` | 20 | Native form controls, validation, uploads, request states, selection, and reversible feedback. |
| `src/recipes/workflows.mjs` | 20 | Navigation, changing layouts, tables, charts, contextual controls, and spatial continuity. |
| `src/recipes/storytelling.mjs` | 16 | Typographic sequences, art reveals, native-scroll storytelling, dimensional compositions, and occasional effects. |

The practical studies explain when frequent actions should update immediately.
Expressive studies reserve their longer timelines for a deliberate illustrative
or brand moment. Educational Replay is an explicit request for motion, including
when activated by keyboard. It is not a recommendation to replay that sequence
on every production interaction.

A proposed line reveal repeated the existing `clip-text` study and was replaced
with a bounded typographic marquee. Other related studies must teach a distinct
behavior: sorting preserves table-row identity, a list/grid switch preserves
item identity across two layouts, and a Kanban move communicates a change of
workflow state. Their shared use of transforms does not make their integration
problems identical.

## Guidance used for this pass

The source revision remains
[`e8a175de22ae1e49370fc144c1f3bb9aeedf988d`](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d).
Relevant files are read directly before application. This is manual application
of pinned guidance; source references do not install host-native skills.

| Guidance | Application |
| --- | --- |
| `emil-design-eng` | Purpose and frequency, clear defaults, shared curves, press feedback, interruption, reduced motion, and portable source. |
| `animate` and `RECIPES.md` | Construction decisions in order: whether to animate, purpose, simplest sufficient tool, properties, timing, interruption, and input handling. |
| `review-animations` and `STANDARDS.md` | Explicit review of the new motion and corrections, with concrete findings and a recorded verdict. |
| `improve-animations` audit reference | Prioritize actual motion defects and respect documented tradeoffs; implementation is already authorized by the user. |
| `mobile-native` | Native inputs, 16px text fields, press feedback, pointer-capability queries, scroll/zoom ownership, and honest device-testing limits. |
| `apple-design` | Current presentation values, measured layout continuity, direct manipulation, and interruption where relevant. |
| `animation-vocabulary` | Distinguish masks, staggers, marquees, parallax, spatial transitions, and dimensional effects in searchable metadata. |
| `pick-ui-library` | Keep the existing native educational architecture and reuse bundled Motion for spring behavior; receiving production apps should use their established primitives. |
| `break-ui` | Exercise real input/data boundaries, long values, empty/one states, repeated actions, and narrow containers; keep fixtures out of the product flow. |

The earlier [research record](emil-research.md) documents the initial complete
corpus review. This pass does not claim every upstream workflow was freshly
invoked. Expo and Swift implementation, a choose-a-prototype flow, and installing
a production toast framework are outside this web catalog's scope. The relevant
construction and review standards still apply to every addition.

## Corrections carried into the expansion

| Before | After | Why |
| --- | --- | --- |
| Skeleton dismissal used built-in `ease-out`. | It uses `cubic-bezier(0.23, 1, 0.32, 1)`, matching the paired reveal. | Use the prescribed deliberate-motion curve consistently. |
| The skeleton's finite waiting pulse used built-in `ease-in-out`. | It uses the shared `cubic-bezier(0.77, 0, 0.175, 1)` curve. | Deliberate transitions use the shared curves; the check now rejects all three weak built-in easing shortcuts in recipe JavaScript. |
| The eight hub studies had pressable controls without a press treatment. | Their scoped controls use a 120ms independent scale transition to `.97`, gated out of ordinary keyboard and reduced-motion travel. | Immediate press feedback composes with other transforms. |

The preceding Codex correction to Radix Jade/Amber accent-text contrast remains
part of the baseline. All additions consume the same semantic roles and export
pipeline, including the corrected `--accent-ink`.

## Catalog and reuse contract

`src/catalog-contract.mjs` validates the minimum count, unique IDs, retained
published IDs, and featured collection membership. The five collections have
refreshed starting points so the new studies are discoverable. The gallery keeps
its existing layout and viewport-based preview loading/pausing.

Every new example must provide full metadata and HTML/CSS/JavaScript; a coherent
initial state; native input semantics; safe rapid reactivation and cleanup;
reduced-motion handling; semantic colors; and complete offline source. It must
compose at both 300 by 230 and 700 by 420 pixels. Native scrolling inside a study
is intentional where it teaches reading or scroll behavior; the outer preview
must remain within its stage.

## Validation and review status

### Concrete review corrections

| Before | After | Why |
| --- | --- | --- |
| A dropped filename could disagree with the native file input's selected file. | Local selection, drops, the demo file, and clearing all update the same native `FileList`. | The visible feedback and the reusable form control must describe the same state. No file contents are uploaded. |
| Canceling partial simulated progress could report zero percent, and completion could leave focus on a newly disabled Cancel button. | Processing is explicitly indeterminate, canceled/completed states have accurate labels, and completion moves focus only when Cancel still owns it. | Preserve truthful feedback and keyboard continuity without taking focus from other controls. |
| Editing during simulated synchronization could accept an older result. | Editing invalidates the old run; a later sync saves the current revision. | An interrupted asynchronous illustration must not present stale success. |
| Pause reset parallax and aperture presentations, and scroll entry could hide already visible artwork. | Pause preserves the current scene; entry arms only while fully offscreen and reveals once. Reduced motion keeps the artwork visible. | Pause should freeze motion, and content must not flash out when it enters view. |
| After keyboard input, wheel and hover could remain in the keyboard motion mode until a click. | Passive wheel and real fine-pointer movement restore pointer input; the next keyboard event restores immediate keyboard behavior. | Moving between input methods should work without an unrelated click or interference with native scrolling. |
| Dedicated story play controls relied on their label beginning with “Replay.” | Every dedicated play control invokes the shared explicit-play path. Ordinary navigation retains its immediate keyboard behavior. | Keyboard users can deliberately study a sequence regardless of the button's wording. |
| Six compact workflow panels exceeded their outer canvas, and contextual tools could cover the selected text. | The compact layouts fit their actual 300 by 230 canvas; the toolbar has a reserved row and measured horizontal position. | Useful controls and captions must remain visible in gallery previews. |
| The sticky title used a fixed threshold, and a result scroller lacked keyboard access. | The title follows the measured heading boundary; the result pane supports native keyboard scrolling and visible focus. | Match the actual layout and retain native reading controls. |
| Repeated tab selection could replay an unnecessary transition; pagination endpoints could disable the focused control. | Selecting the active tab is a no-op, and endpoint focus recovery is conditional. | Frequent actions stay direct, and focus follows the user's action. |
| Timeline End displayed `00:60`; an interrupted inbox exit could leave a visible inert panel. | The endpoint reads `01:00`, and resize/reduced-motion settlement completes the inbox's actual open/closed state. | Labels and interactivity must remain consistent with the current state. |
| List/grid scaling distorted text, while a position-only version grew cards over the caption during travel. | Three temporary card shells interpolate measured width, height, and position together for 240ms, with generation-guarded cleanup. | Keep every edge inside the collection without scaling text or artwork. This is an explicit, bounded layout-property exception for three cards. |
| Moving a second Kanban task could clip the first task's remaining travel. | A map bounded by the three real tasks retains one inert visual snapshot for each task in flight and retargets from its current rectangle. | Simultaneous transfers preserve continuity while the real DOM, counts, and selection remain authoritative. |
| A paused task transfer could hide its real button's focus, and native column scrolling could leave visual copies detached from their destinations. | Focusing a real task reveals it immediately; native scrolling settles the visual copies. Identity guards protect teardown and replacement. | Pause must not hide keyboard focus or interfere with native navigation. |
| Some keyboard-immediacy assertions started while playback was paused. | The tests explicitly enable playback before ordinary keyboard actions. | Verify the keyboard behavior independently of the Pause setting. |

The revised ten-case workflow suite passed after these corrections. It samples
both list/grid directions at five intermediate fractions in both canvas sizes,
checks live position and dimensions on interruption, and verifies cleanup. Task
tests cover multiple simultaneous transfers, native keyboard focus during Pause,
native column scrolling, and teardown of all visual copies.

### Verification scope

The final complete browser suite passed **301 tests, with zero failed, skipped,
or flaky results**, after all source-review corrections. The run began at
01:13:55 UTC on 11 October 2026 and completed in 78.7 seconds. Validation used
Node 24.19.0, pnpm 11.25.0, Playwright 1.64.0, and the available Chromium
153.0.8010.0 executable. The frozen lockfile and existing dependencies are
unchanged.

| Check | Result |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed; the committed lockfile and dependency choices remain unchanged. |
| `pnpm check` | Passed: 100 unique complete studies, retained published IDs, valid featured membership, parseable scripts, semantic color rules, and pinned dependencies. |
| `pnpm build` | Passed: 100 standalone examples, the catalog, and portable agent references. |
| `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=… pnpm test` | 301 passed; 0 failed, 0 skipped, 0 flaky. The separately revised workflow suite also passed all 10 cases. |
| `pnpm security` | Passed runtime asset/isolation checks; production dependency audit reported no known vulnerabilities. This is a focused check, not a comprehensive security audit. |
| `git diff --cached --check` | Passed. |

The suite covers all 100 examples in light and dark modes; discovery, history,
saved items, keyboard and emulated touch use; reduced motion, replay, pause,
interruption, and input-method changes; palette/token contrast contracts; and
native, Motion, and expressive standalone exports running offline with their
selected colors. A focused gallery check verifies that a 100-card catalog loads
nearby previews and pauses previews left behind rather than running every frame.

Visual inspection covers all 56 additions at 300 by 230 pixels in Playground
light and Radix Indigo dark, and at 700 by 420 in Playground light. The second
capture pass produced 175 images across 16 contact sheets with no browser errors
or outer geometry flags: 168 settled states and seven real paused motion samples.
Still images supplement the interaction tests; they do not establish temporal
quality by themselves. The later task-transfer correction receives its own
interaction and visual verification.

The actual hub was also inspected at 1440 by 1000 and 390 by 1000 pixels, along
with a 1440 by 1000 Geist Dark/Violet workbench. Both galleries rendered all 100
cards, the workbench's selected colors matched its real iframe, and all three
views had no outer overlap, horizontal overflow, browser errors, or external
requests. The corrected motion frames receive a separate final visual check.

Independent source review has approved the forms, storytelling, workflows, and
shared catalog/export integration within the documented scope. No material source
finding remains open. Codex review is pending on the published PR. Exact
reviewed revisions, hosted deployment evidence, and the final verdict are tracked
in [issue #7](https://github.com/spencer-life/animation-playground/issues/7).

These are bounded educational examples, not complete production upload,
notification, charting, or drag-and-drop systems. Automated accessibility checks
and Chromium viewport/touch emulation do not establish physical-device, Safari,
Firefox, or assistive-technology coverage. Those environments were not available
for this pass. No unrelated native-app workflow or fresh full-site Impeccable
audit is claimed.
