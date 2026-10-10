# Animation Playground — source research and motion standards

## Source and scope

Reviewed the complete [Emil Kowalski skills repository](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d) at commit `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`, dated 2026-10-02. This review covers all **14 skills**, every accompanying recipe, standards, audit, template, picker and catalog file, the README, performance cheatsheet and license: **25 files, 4,710 lines**.

The playground is an educational reference. Its demonstrations are the requested content, so explicit playback can be expressive. The interface used to find, inspect, copy and share those demonstrations should remain quiet, immediate and legible. A gallery of motion does not justify animating every navigation or filter change.

All upstream skills were reviewed. They are not all implementation dependencies: the Expo and Swift skills concern native runtimes, while the requested product is a web page. Their transferable principles inform the work; adding Expo or Swift would not help this product.

## Skills and their application

| Skill | Application to this project |
| --- | --- |
| `emil-design-eng` | Overall craft standard: intentional defaults, responsive timing, origin-aware surfaces, coherent tokens, interruption, reduced motion, ready-to-use examples. |
| `animate` | Construction order for every recipe: purpose and frequency, then the cheapest appropriate tool, properties, curve, duration, interruption and exit. |
| `review-animations` | Final motion review with concrete findings and explicit decision; regressions must be demonstrated with file and line references. |
| `improve-animations` | Audit method covering purpose, timing, physicality, interruption, performance, accessibility, cohesion and missed opportunities. Its advisory phase stays separate from implementation. |
| `find-animation-opportunities` | Restraint in the surrounding website. Focus site motion on useful feedback and contained instructional previews; reject decorative search, navigation and reading motion. |
| `animation-vocabulary` | Stable, recognizable recipe names, searchable terminology, aliases and AI handoff language. Distinguish spring, stagger, reveal, crossfade, layout and shared-element motion. |
| `apple-design` | Direct manipulation, live presentation values, momentum projection, velocity handoff, soft boundaries, immediate press feedback and continuous interruption. |
| `mobile-native` | Touch capability handling, safe-area padding, correct viewport units, selectable code, usable inputs and gesture-axis ownership. |
| `pick-ui-library` | Check installed packages first; use established accessible primitives for actual components, and avoid adding a library for a simple transition. |
| `ask-sonner` | If using Sonner: mount one root toaster, emit from actual events, use stable IDs for updates, set an explicit theme and preserve stacking/dismissal behavior. |
| `break-ui` | Validate long titles, long code lines, empty and single-result filters, large text, narrow screens, missing data and repeated interactions through real data boundaries. |
| `prototype` | Working, genuinely different motion examples with instant selection and replay. Its full choose-a-winner workflow is not needed for a final gallery the user already authorized. |
| `animate-expo` | Native-only implementation was reviewed. Transfer the principles of direct manipulation, no React render per frame, release velocity, appropriate touch targets and reduced motion. Do not install Reanimated, Expo Router or native haptics. |
| `write-swift` | Language-specific implementation is out of scope. Transfer its simplicity-first discipline, explicit state modeling, bounded work and measurement before optimization. Do not add Swift artifacts to a web app. |

## Actionable motion standards matrix

| Area | Standard | Playground implementation implication |
| --- | --- | --- |
| Purpose | Feedback, spatial consistency, state indication, preventing a jarring change, explanation, or rare delight. | Every recipe states what it communicates and where to use it. Purely expressive work is marked as an experiment or marketing effect. |
| Frequency | Extremely frequent or keyboard navigation actions are immediate; repeated controls get very small feedback. | Search, filtering, inspector tab changes and keyboard navigation stay immediate. A keyboard-activated Play button still plays the animation being explicitly studied. |
| Cheapest tool | CSS transitions → `@starting-style` → CSS keyframes → WAAPI → Motion as capabilities require. | CSS for two-state and hover/press motion; keyframes for replayable timelines/loops; WAAPI for programmatic playback; Motion for physics, layout and gesture behavior. |
| Common properties | Prefer `transform` and `opacity`; enumerate transitions. | No `transition: all`, animated margins or positional offsets. Use translate/scale rather than layout changes. |
| Exceptions | `clip-path` is an intentional reveal technique; measured height is allowed for accordions; subtle blur may bridge a crossfade. | Name these tradeoffs in recipe notes. Do not imply every clip or blur is universally compositor-only: verify in the target browser. |
| Entry and exit curve | `cubic-bezier(0.23, 1, 0.32, 1)` | One shared `--ease-out` token. |
| Movement on screen | `cubic-bezier(0.77, 0, 0.175, 1)` | One `--ease-in-out` token for moving indicators and coordinated spatial changes. |
| Drawer curve | `cubic-bezier(0.32, 0.72, 0, 1)` | One `--ease-drawer` token for the sheet demonstration. |
| Hover/color | `ease` | Gate hover styles by `(hover: hover) and (pointer: fine)`. Offer tap or explicit replay on touch. |
| Continuous motion | `linear` | Progress, rotation and marquee must move at constant speed; readable numerical progress stays accurate. |
| Press | 100–160 ms; scale approximately `0.97`. | Pointer-down feedback, completion on normal activation; subtle enough for repeated controls. |
| Tooltip/popover | 125–200 ms. | An anchored origin; skip delay and animation between already-open neighboring tooltips. |
| Dropdown/select | 150–250 ms. | Fast, interruptible and anchored to the control. |
| Dialog | Usually 200–250 ms; centered origin. | Dialog and backdrop feel coordinated. A dialog is deliberately exempt from trigger-origin rules. |
| Larger sheet | Usually under 300 ms; source recipe explicitly allows 500 ms with the drawer curve. | A demonstrated 500 ms sheet must state why it is slower. Do not apply 500 ms to ordinary menus. |
| Toast | Source web recipe allows 400 ms `ease` as a Sonner-specific personality exception. | Keep ordinary site copy confirmation unobtrusive; if teaching Sonner motion, retain its documented exception. |
| Initial scale | `0.9–0.97` with opacity 0. | No entry from `scale(0)`. Progress bars scaling from zero are a different use of scale and should not be misclassified as entrances. |
| Origins | Popovers and tooltips originate at their trigger; dialogs stay centered. | Use the primitive's `--transform-origin` when available. |
| Interruption | Rapid state changes retarget from current values. | Transitions for toggles; springs for gestures. No input lock while motion finishes. Replay resets are intentional timeline controls, not a model for dynamic app state. |
| Exit path | Leave through the same edge used for entry. | Sheets and toast-like surfaces retain a clear spatial story. |
| Asymmetric timing | Deliberate phase slow; response quick. | Hold-to-confirm: 2 seconds linear fill, 200 ms release. Include cancel handling and a keyboard-accessible equivalent. |
| Spring baseline | `{ type: 'spring', duration: 0.5, bounce: 0.2 }` for playful/gesture examples; Apple default favors no overshoot. | Use bounce around 0.1–0.3 only where physics or the instructional experiment justifies it. Avoid bounce in website chrome. |
| Gestures | Pointer capture, grab offset, axis intent, extra-pointer rejection, live value on regrab. | Drag examples continue when leaving the element and avoid stealing ordinary vertical page scrolling. |
| Velocity | Preserve release velocity; prefer recent samples and projected endpoint. | A short flick should move naturally; an interrupted spring should not jump to a prior target. |
| Soft boundary | `(overshoot * dimension * 0.55) / (dimension + 0.55 * abs(overshoot))` | Rubber-band demo uses increasing resistance rather than an invisible wall. |
| Projection | `(velocity / 1000) * d / (1 - d)`, commonly `d = 0.998`. | Use consistent units (velocity in pixels/second); label any project-specific threshold. |
| Stagger | 30–80 ms between items, commonly 50 ms. | A contained instructional group can stagger; results must remain interactive and should not stagger every time a user types. |
| Blur | Around 2 px for a difficult crossfade; below 20 px. | Keep blur small and isolated; avoid full-page animated blur layers. |
| Main-thread work | No React state update per animation frame; do not drive descendant transforms through an inherited parent variable. | Write continuous values to Motion values or the actual element; React state describes discrete UI state. |
| Layers | `will-change` only when an observed issue requires it or motion is imminent. | Do not permanently promote all 40 previews. |
| Reduced motion | Replace translation, spring, parallax and overshoot with short opacity/color feedback or a static final state. | Honor OS preference by default; provide a discoverable playback preference; prevent ambient loops from starting automatically for reduced motion. |
| Playback | People control the moving demonstrations. | Play/pause, replay and slower playback; pause loops out of view or in hidden tabs. Never keep dozens of hidden timelines running. |
| Mobile | 16 px minimum inputs, zoom allowed, `dvh` for panels, safe-area padding, capability queries. | Code is selectable and horizontally scrollable inside its panel; controls work with touch and a trackpad on the same device. |
| Verification | Mechanical checks plus interaction/visual inspection. | Test rapid reversals, repeated Play, cancel during hold/drag, dialog Escape and focus return, reduced motion, 320 px layout and 200% text size. Report hardware limits honestly. |

## A diverse 40-demo collection

These are original implementation directions organized by what a future project needs. The set deliberately mixes frequent practical details with less common expressive studies. The taxonomy can be adjusted while implementing; stable IDs should not change after release.

| ID | Name | What it demonstrates | Suitable tool |
| --- | --- | --- | --- |
| `press-feedback` | Press feedback | A control physically acknowledges pointer-down. | CSS transition |
| `arrow-nudge` | Directional arrow | A small affordance clarifies the destination of a link. | CSS transition |
| `link-underline` | Underline reveal | A transform-driven line emphasizes an interactive label. | CSS transition |
| `icon-swap` | Icon crossfade | Two symbols communicate a changed state without jumping. | CSS transition |
| `submit-success` | Submit to success | A button moves through ready, pending and confirmed states. | CSS + discrete React state |
| `hold-confirm` | Hold to confirm | Deliberate linear progress with fast cancellation. | CSS clip + pointer/keyboard events |
| `error-shake` | Error shake | A one-shot, restrained rejection signal paired with visible text. | WAAPI |
| `success-check` | Success check | A short path-drawing confirmation for a completed action. | SVG + CSS/WAAPI |
| `origin-popover` | Origin-aware popover | A surface grows from the thing that opened it. | Base UI + CSS |
| `tooltip-group` | Instant neighboring tooltips | Delayed first hint, immediate subsequent hints. | Base UI + CSS |
| `dialog-scale` | Dialog entrance | Centered scale/fade coordinated with a backdrop. | Base UI + CSS |
| `bottom-sheet` | Bottom sheet | A content-sized sheet enters and leaves the same edge. | Accessible primitive + CSS/Motion |
| `toast-stack` | Toast stack | New notifications arrive without restarting an in-flight stack. | Sonner |
| `accordion` | Accordion collapse | Measured content height avoids an abrupt disclosure. | Base UI + measured-height transition |
| `segmented-control` | Clipped active tab | Active text and background move as one clipped layer. | Accessible tabs + clip-path |
| `notification-peek` | Notification peek | A compact status surface briefly expands to show context. | CSS transition |
| `stagger-list` | Staggered entrance | A 50 ms sequence makes a small group readable. | CSS keyframes |
| `layout-filter` | Filtered layout | Remaining items keep identity while moving to new positions. | Motion layout |
| `shared-card` | Shared element | A thumbnail and expanded preview read as the same object. | View Transition/Motion |
| `directional-stepper` | Direction-aware steps | Forward and backward progress use consistent spatial directions. | CSS/WAAPI |
| `content-crossfade` | Content crossfade | A subtle blur bridges difficult text or icon state changes. | CSS opacity/filter |
| `number-roll` | Number ticker | Fixed-width digits preserve readable alignment during updates. | NumberFlow |
| `reorder-list` | Reorder a list | Surrounding items visibly make room for a move. | dnd kit + transforms |
| `inline-expand` | Inline detail | Extra context appears without losing the selected item's identity. | CSS or Motion layout |
| `spring-drag` | Spring drag | A freely grabbed element settles while preserving its velocity. | Motion |
| `rubber-band` | Rubber-banding | Dragging past a boundary adds resistance and snaps back. | Pointer events + spring |
| `swipe-dismiss` | Swipe to dismiss | Distance or an intentional flick dismisses a surface. | Pointer events + spring |
| `magnetic-target` | Magnetic target | A restrained, spring-following decorative button effect. | Motion, fine pointer only |
| `tilt-card` | 3D tilt | Decorative perspective follows a pointer with a soft settle. | Motion + transform |
| `comparison-wipe` | Comparison wipe | A directly manipulated clip exposes one of two states. | Native range input + clip-path |
| `mask-reveal` | Mask reveal | Content is uncovered without moving its final layout. | CSS/WAAPI clip-path |
| `word-stagger` | Word stagger | A small editorial heading appears in readable word groups. | CSS keyframes |
| `letter-cascade` | Letter cascade | A short, one-shot display treatment for a rare title. | CSS keyframes |
| `scroll-progress` | Scroll progress | A linear indicator follows a contained scroll area's position. | Scroll timeline + fallback |
| `depth-parallax` | Shallow parallax | A contained scene explains different layers of depth. | Scroll timeline or Motion |
| `card-flip` | Card flip | Two faces exchange through a controlled 3D rotation. | CSS transition |
| `orbit` | Orbit study | Transform composition creates a consistent circular path. | CSS keyframes |
| `marquee` | Seamless marquee | Duplicate content loops at a constant speed with pause control. | CSS keyframes |
| `skeleton-shimmer` | Skeleton shimmer | A low-contrast sheen explains pending content. | CSS transform/opacity |
| `celebration` | Completion burst | A finite, user-triggered celebratory sequence. | CSS/WAAPI, limited particles |

## Recipe and reuse contract

Each published example should include a stable slug and direct URL, a clear title, short explanation, category and searchable vocabulary aliases. The inspector should make its default duration, curve or spring, trigger, animated properties and dependency requirements visible. It should state the appropriate context, a meaningful caution where needed, and its reduced-motion behavior.

Provide complete copyable code with imports, markup, styles and required helper functions. Any shared tokens used by a copied example must be included or explicitly named alongside a copyable prerequisite. Prefer copying the very same source that renders the preview; separate hand-maintained snippets drift. Test copied snippets at least through compilation when they are substantial or include dependencies.

Add **Copy code**, **Copy link** and **Copy AI prompt**. The AI prompt should name the recipe and stable URL, describe the visible behavior, include timing and reduced-motion requirements, and identify its dependencies. That gives a later ChatGPT or Codex conversation enough information to implement the effect without guessing from a screenshot. A generated machine-readable manifest and a concise repository guide can give agents the same catalog without scraping the visual page.

Useful live controls are replay, pause and playback rate. Do not overload the inspector with independent stiffness/mass/damping controls for every CSS recipe. Expose only controls that materially change the example; use a dedicated easing or spring study for deeper tuning.

## Source nuances and conflict handling

The upstream rules are opinionated design defaults, not universal platform laws. Use the narrow recipe when it intentionally documents an exception: measured height for accordion, clip-path for reveal, 500 ms drawer, 400 ms Sonner toast, and a centered modal origin. The audit should not report those as accidental violations.

The main skill's broad wording about hardware acceleration is a useful reason to prefer transform/opacity, but actual compositing depends on the property, animation API and browser. Avoid public claims of guaranteed GPU-only performance for all effects. The source's gesture dismissal example uses distance divided by total gesture time; its Apple guidance offers more useful recent velocity and momentum projection for an interactive example. Use recent velocity and preserve units explicitly.

The rule against animated keyboard navigation applies to interface overhead. It should not prevent a keyboard user from playing the educational animation they have explicitly selected. Keep focus, search and catalog navigation immediate while giving Play the same demonstration behavior for every input method.

Some skill workflows normally stop for a user choice or ask another agent to execute an audit plan. The current user explicitly authorized end-to-end autonomous design and asked for no questions. Use the useful construction, review and stress-test principles without introducing an unnecessary approval stop.

## Attribution and licensing

The source repository is licensed under **MIT**, copyright **(c) 2026 Emil Kowalski**. Include its copyright and complete MIT permission/warranty notice with copied or substantially adapted code/documentation. A `THIRD_PARTY_NOTICES.md` containing the upstream notice and pinned revision is an appropriate place; a link alone is not a replacement for the notice when substantial source material is redistributed.

Use visible source credit such as: “Original examples informed by Emil Kowalski's animation skills.” Link the upstream repository and, in detailed recipe metadata, the relevant pinned source file. Describe adaptations accurately and avoid implying the playground is Emil's official product. Each additional package retains its own license and notice requirements; record installed dependencies rather than copying third-party demo assets without checking provenance.

## Exact files read

All paths below are relative to the pinned source revision above.

```text
LICENSE
README.md
performance-cheatsheet.md
skills/animate-expo/RECIPES.md
skills/animate-expo/SKILL.md
skills/animate/RECIPES.md
skills/animate/SKILL.md
skills/animation-vocabulary/SKILL.md
skills/apple-design/SKILL.md
skills/ask-sonner/API.md
skills/ask-sonner/SKILL.md
skills/break-ui/CATALOG.md
skills/break-ui/SKILL.md
skills/emil-design-eng/SKILL.md
skills/find-animation-opportunities/SKILL.md
skills/improve-animations/AUDIT.md
skills/improve-animations/PLAN-TEMPLATE.md
skills/improve-animations/SKILL.md
skills/mobile-native/SKILL.md
skills/pick-ui-library/SKILL.md
skills/prototype/PICKER.md
skills/prototype/SKILL.md
skills/review-animations/SKILL.md
skills/review-animations/STANDARDS.md
skills/write-swift/SKILL.md
```
