---
name: Animation Playground
description: A precise workspace for inspecting and reusing web motion.
colors:
  bg: '#f7f8fa'
  surface: '#fff'
  subtle: '#eceff3'
  ink: '#20242c'
  muted: '#626b79'
  faint: '#dce1e8'
  accent: '#3358d4'
  accent-soft: '#e9edfc'
  code: '#f0f2f6'
  code-comment: '#5b677b'
  code-string: '#316650'
  code-keyword: '#6743a2'
  code-number: '#954e2d'
  dark-bg: '#191c22'
  dark-surface: '#22262e'
  dark-subtle: '#2b303a'
  dark-ink: '#edf0f6'
  dark-muted: '#a8b1c1'
  dark-faint: '#3b424f'
  dark-accent: '#a0b7ff'
  dark-accent-soft: '#2e3957'
  dark-code: '#1b1f27'
  dark-code-comment: '#9aa6bd'
  dark-code-string: '#9ac7ac'
  dark-code-keyword: '#c4a8f0'
  dark-code-number: '#ecc2a0'
  lavender: '#e8e4f3'
  peach: '#f5dfd0'
  blue: '#dfe8f8'
  green: '#dfece5'
  sand: '#eee9dc'
  graphite: '#e2e5ea'
  category-feedback: '#9a7758'
  category-navigation: '#7b73b6'
  category-layout: '#588776'
  category-text: '#a25d6d'
  category-entrances: '#6184b4'
  category-expressive: '#85805d'
typography:
  display:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 42px
    fontWeight: 620
    lineHeight: '1.15'
    letterSpacing: -.035em
  headline:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 36px
    fontWeight: 620
    lineHeight: '1.15'
    letterSpacing: -.035em
  section-title:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 22px
    fontWeight: 600
    lineHeight: '1.15'
    letterSpacing: -.025em
  title:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: '1.15'
    letterSpacing: -.025em
  collection-title:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 15px
    fontWeight: 600
    lineHeight: '1.15'
    letterSpacing: -.015em
  sample-title:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 13px
    fontWeight: 600
    lineHeight: '1.4'
    letterSpacing: -.015em
  body:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: '1.5'
  intro:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: '1.65'
  navigation:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: '1.5'
  label:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: '1.5'
  metadata:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 11px
    fontWeight: 400
    lineHeight: '1.6'
  tag:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 11px
    fontWeight: 500
    lineHeight: '1.5'
  input-mobile:
    fontFamily: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: '1.5'
  code:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: 11px
    fontWeight: 400
    lineHeight: '1.85'
rounded:
  field: 4px
  tag: 5px
  compact: 6px
  control: 8px
  navigation: 9px
  specs: 12px
  radius: 14px
  circle: 50%
spacing:
  '4': 4px
  '8': 8px
  '10': 10px
  '12': 12px
  '13': 13px
  '16': 16px
  '18': 18px
  '20': 20px
  '22': 22px
  '24': 24px
  '28': 28px
  '30': 30px
  '32': 32px
  '36': 36px
  '38': 38px
  '48': 48px
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.surface}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 9px 13px
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 9px 13px
  button-quiet:
    backgroundColor: transparent
    textColor: '{colors.muted}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 9px 13px
  button-quiet-selected:
    backgroundColor: '{colors.accent-soft}'
    textColor: '{colors.accent}'
  button-icon:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    width: 38px
    height: 38px
  button-icon-selected:
    backgroundColor: '{colors.accent-soft}'
    textColor: '{colors.accent}'
  search-field:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.field}'
    padding: 13px 38px 13px 0
    width: 100%
  navigation-item:
    backgroundColor: transparent
    textColor: '{colors.ink}'
    typography: '{typography.navigation}'
    rounded: '{rounded.navigation}'
    padding: 10px 11px
    width: 100%
  navigation-item-current:
    backgroundColor: '{colors.accent-soft}'
    textColor: '{colors.accent}'
  technology-tag:
    backgroundColor: '{colors.subtle}'
    textColor: '{colors.ink}'
    typography: '{typography.tag}'
    rounded: '{rounded.tag}'
    padding: 3px 7px
  sample-stage:
    backgroundColor: '{colors.lavender}'
    rounded: '{rounded.radius}'
    height: 232px
  sample-title:
    textColor: '{colors.ink}'
    typography: '{typography.sample-title}'
    padding: '0'
  source-inspector:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.radius}'
  inspector-tab:
    backgroundColor: transparent
    textColor: '{colors.muted}'
    typography: '{typography.label}'
    padding: 0 1px
  inspector-tab-current:
    textColor: '{colors.ink}'
  code-pane:
    backgroundColor: '{colors.code}'
    textColor: '{colors.ink}'
    typography: '{typography.code}'
    rounded: '{rounded.navigation}'
  motion-specifications:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.specs}'
    padding: 20px
---

# Design System: Animation Playground

## Overview

**Creative North Star: "The Material Sample Rack"**

The Material Sample Rack gives small motion studies the clarity of objects laid out for close inspection. The surrounding workspace is cool, quiet, and matter-of-fact: graphite type on paper surfaces, compact cobalt selection cues, and generous sample fields. Precision belongs to the tools; warmth and individual character belong to the examples.

Inter supplies a consistent working voice, with system monospace reserved for code and motion values. Rounded rectangles feel handled and practical. Tonal separation carries most of the hierarchy, while the lavender, apricot, blue, green, sand, and pale graphite fields distinguish the material being studied. The samples retain their own light environment when the surrounding workspace switches to dark.

Keep the shared tools still and responsive. Motion belongs inside studies that people choose to inspect, replay, or slow down. Expressive type and playful shapes can be part of a study; the shell remains readable and consistent. Reduced-motion states preserve visible content and understandable state.

**Key Characteristics:**

- Cool paper surfaces, graphite text, and cobalt control cues.
- Compact, legible tools around generous sample stages.
- Inter for the interface; system monospace for source and precise values.
- Flat containers, restrained rounding, and small functional shadows.
- Immediate navigation with deliberate, controllable motion inside examples.

This scan-mode specification records the shipped values in [the shell stylesheet](src/styles.css), [the rendered interface](src/app.js), [the shared demo styles](src/demo-base.css), and [the sample palette](scripts/build.mjs). The YAML is normative. The sidecar extends it with preview components and metadata; its synthesized tonal ramps are panel display aids, not additional implementation tokens.

## Colors

The palette combines cool neutral tools with softly colored sample material. Preserve the source formats in the frontmatter and use the existing CSS variables for theme-aware interface elements.

### Primary

- **Cobalt control accent** (`accent`) identifies active navigation, selected playback preferences, links, the three-bar brand, and keyboard focus. **Cobalt wash** (`accent-soft`) gives those selected controls a quiet filled background.
- **Night cobalt** (`dark-accent`) and **night cobalt wash** (`dark-accent-soft`) are the corresponding dark-theme values. They replace the same shell variables when the root theme changes.
- The main “Copy full example” action uses **Graphite ink** (`ink`) with **Paper surface** (`surface`), reversing with the theme. The accent is a control cue rather than a fill applied to every button.

**The Control Accent Rule.** Use the accent pair for current navigation, selected utility controls, links, the brand mark, and visible keyboard focus. The principal copy action uses the ink and surface pair.

### Secondary

These are the six fixed sample fields from the build palette. Keep their incumbent keys: `peach` remains the source key even though its descriptive name is apricot.

| Token | Descriptive name | Use |
| --- | --- | --- |
| `lavender` | Muted lavender | Soft violet sample material; the default stage fallback. |
| `peach` | Muted apricot | Warm interaction, text, and gesture studies. |
| `blue` | Powder blue | Cool spatial, progress, and numeric studies. |
| `green` | Pale green | Calm card, state, and layout studies. |
| `sand` | Warm sand | Neutral warm material for timing and navigation studies. |
| `graphite` | Pale graphite | Neutral cool material for typographic and control studies. |

Recipe metadata chooses the field; category alone does not determine it. A stage remains visually distinct from the neutral shell in either theme.

**The Sample Material Rule.** Keep sample fields tied to the recipe palette across both shell themes. Their colors identify a study’s material, not application status or navigation selection.

### Tertiary

- **Category markers** use the six `category-*` tokens for feedback, navigation, layout, text, entrances, and expressive work. Their muted small dots help scan the collection; labels and counts carry the information.
- **Source syntax** uses `code-string`, `code-keyword`, and `code-number`, with the matching `dark-*` values in the dark inspector. These are technical reading aids, not additional action colors.

### Neutral

- **Cool paper** (`bg`) is the full workspace canvas and rail. **Paper surface** (`surface`) is the input surface on mobile, the button surface, and the inspector or specifications panel.
- **Inset grey** (`subtle`) supports technology tags, the source-language group, and restrained hover feedback. **Graphite ink** (`ink`) is the primary reading color.
- **Slate text** (`muted`) carries descriptions, counts, controls at rest, and explanatory metadata. **Cool divider** (`faint`) separates navigation groups, source tabs, tables, and footers.
- **Code paper** (`code`) is the source and agent-brief surface. **Comment slate** (`code-comment`) keeps comments secondary while preserving readability.
- The `dark-` tokens record the actual overrides of these same variables. In implementation, switch the root theme and continue using the original variable names; do not hard-code dark values into individual components.

## Typography

**Display and body font:** Inter, followed by the system sans-serif fallbacks in the frontmatter. The app serves the variable font locally.

**Code font:** SFMono-Regular, Consolas, Liberation Mono, then monospace. Source panes use the operating system’s available member of this stack.

**Character:** Neutral, compact, and attentive to small differences. Headings use modest negative tracking and slightly stronger weights; labels remain plain sentence case. The system has an observed role scale rather than a uniform mathematical ratio.

### Hierarchy

- **Display** (`display`) is the main collection or notes heading. Its wide-layout size is (42px), with a medium-heavy variable weight (620) and tight line height (1.15). At the mobile breakpoint it becomes (36px), then (35px) in the single-column phone layout.
- **Headline** (`headline`) is a study title at (36px). It steps to (32px) in the mobile layout and (30px) on narrower phones.
- **Section title** (`section-title`) introduces larger notes sections. **Title** (`title`) introduces individual principles. **Collection title** (`collection-title`) is the compact heading above the gallery.
- **Sample title** (`sample-title`) is compact and semibold, followed by a quieter description. On the narrow phone layout, sample titles become (14px) and descriptions (12px).
- **Body** (`body`) is the base interface text. **Intro** (`intro`) adds a more open reading rhythm for the short page introduction; gallery introductions are limited to (455px) on wide screens.
- **Navigation** (`navigation`) and **label** (`label`) support category rows and utility buttons. Small technology tags use `tag`; metadata uses `metadata`. Counts and numeric results use tabular figures where shown.
- **Code** (`code`) uses a compact size (11px) with an open line height (1.85). Long source lines scroll within the source pane; explanatory copy wraps normally. Gallery descriptions use a measure of (42ch), extending to (48ch) on narrow phones.
- **Mobile input** (`input-mobile`) keeps the search text at (16px) while surrounding metadata remains compact.

**The Working Type Rule.** Use the shared Inter stack for interface hierarchy and the system mono stack for code. Expressive display treatments belong to individual demonstrations.

## Layout

The workspace is an adaptable sample rack. A fixed category rail establishes a quiet left edge on desktop, while a compact utility header and a centered main region hold the working content. The main region has a maximum width of (1600px). Its normal horizontal padding is (38px); the rail width is (222px).

The gallery uses three equal columns with separate row and column gaps (30px and 22px). Each sample is a colored, clipped stage followed by an unenclosed caption. At rest, the stage height is (232px). Preserve the distinction between generous demonstration space and compact tools; do not force all spacing into a newly invented base grid. The frontmatter includes recurring literal steps, including optical offsets such as (13px), (18px), (22px), and (38px).

The study workbench pairs a demonstration with the source inspector using near-equal columns (1.03fr and 1fr) and a shared gap (22px). Its main stage is (400px) tall at the standard wide size. Motion specifications are a two-column definition list beneath the demo controls. Notes use a narrower reading region (900px) with two columns of principles.

### Responsive behavior

| Condition | Implemented behavior |
| --- | --- |
| At least (1600px) | Four gallery columns, horizontal main and header padding of (48px), sample stages of (250px), and detail stages of (450px). Related samples retain three columns. |
| At most (1190px) | The rail narrows to (198px), main and header insets to (28px), and the gallery to two columns. The workbench stacks; demo specifications occupy a side column of (220px). |
| At most (780px) | The rail becomes a horizontally scrollable category strip. The single real header moves above it, the search gains a paper surface, and the main insets become (22px). The gallery remains two columns. The detail demo becomes a single block, with its specifications below. |
| At most (520px) | The main gallery becomes one column with stages of (262px). Detail stages become (330px). Notes principles stack. Related samples remain a compact two-column strip. |
| At most (360px) | Horizontal main and header insets narrow to (16px), sample stages to (245px), and detail stages to (310px). |

Mobile sample actions remain available through the stage button, title, and save control. The hover-only “Try it” label is suppressed on the mobile layout. The category strip can scroll; do not wrap it into a large multi-row header. Bottom padding accounts for the device safe area.

## Elevation & Depth

Ordinary shell surfaces are flat. Tone, padding, clipping, and space establish the hierarchy: a colored sample stage, a white or dark inspector, a subdued source inset, and fine dividers where a boundary matters. Shadows are functional and localized. Individual animation studies may use other shadows as part of the effect being demonstrated; those values are local to the recipe.

### Shadow Vocabulary

- **Temporary overlay** (`extensions.shadows: overlay`) is the exact shared shell shadow for announcements and the manual-copy dialog. Its dark-theme counterpart is `overlay-dark`.
- **Shortcut key** (`shortcut-key`) gives the search keyboard hint a slight raised edge.
- **Preview action** (`preview-action`) lifts the small “Try it” label over a sample when it is revealed.

The sidecar carries the literal shadow values because the frontmatter component schema has no shadow property. The manual-copy dialog also uses a translucent backdrop; focus uses an outline rather than a glow.

**The Surface Before Shadow Rule.** Separate ordinary containers with tone and spacing. Reserve shell shadows for the shortcut key, the revealed preview action, and temporary overlays.

## Shapes

Use softly rounded rectangles with scale-appropriate corners. The shared `radius` token controls sample stages (14px) and matches the inspector and dialog corners. Utility buttons and icon controls use `control` (8px); category rows and code insets use `navigation` (9px). Specification panels use `specs` (12px). Smaller fields, technology tags, and compact selector pieces use the lower radius steps.

Sample stages clip the embedded work, while captions remain open on the page canvas. Category dots and small indicators are circular. Icons are light outline SVGs with rounded caps and joins, normally (18px), with smaller (15–16px) versions inside buttons and metadata. The brand consists of three rising rounded bars. Preserve these simple silhouettes without adding ornamental badges or pill shapes to every label.

## Components

### Buttons

Compact, legible, and immediate.

- **Primary:** Ink fill and surface-colored text, the shared control corner, padding (9px 13px), and a minimum height of (38px). This is the principal copy action.
- **Secondary:** The same dimensions and type on a surface-colored background with ink text. Use it for adjacent actions such as copying a link.
- **Quiet:** Transparent at rest with muted text. Selected playback and reduction preferences use the accent pair through their pressed state.
- **Icon controls:** A square target (38px) with the shared control corner. Theme and detail save actions use outline icons; a saved gallery bookmark fills its icon. Save controls expose their pressed state. Gallery save targets have their own compact desktop and larger phone sizing.
- **Hover:** On devices with a fine hover pointer, ordinary buttons subtly brighten or darken through the implemented filter; quiet and icon controls gain an inset-grey fill. The principal ink button uses its established brighter hover filter. There is no shell hover animation.
- **Focus:** A visible accent outline (3px) sits outside the control with an offset of (4px). Disabled shell buttons become partially opaque and show a waiting cursor. Do not add a press transform to the shared tools simply because a recipe demonstrates one.

### Chips / Tags

Small pieces of information, with no simulated button behavior.

Technology tags use the subtle surface, ink text, compact tag corners, and padding (3px 7px). They sit with category and trigger metadata beneath a detail description. They are static labels and do not gain hover, focus, or selected states. The mobile category items are navigation links styled as compact rectangular controls, not metadata tags.

### Cards / Containers

A sample has a stage and an open caption, rather than a second enclosing card.

- **Stage:** The shared sample corner, recipe-selected field, clipped content, and isolated visual stacking. The gallery embeds a preview; the workbench exposes the live controls inside the larger stage.
- **Caption:** A semibold title, one concise muted description, then small technology and duration metadata. A save action aligns to the right.
- **Open state:** A transparent stage button opens the study. Fine-pointer hover and visible keyboard focus reveal the small “Try it” label on desktop. Its focus outline is inset so clipping does not hide it.
- **Containers:** The inspector and specification panels use a surface fill without a shell shadow. Fine dividers separate source navigation and longer tabular content.

### Inputs / Fields

The search field is quiet and integrated on desktop: transparent fill, a leading outline search icon, and a small slash-key hint. On the mobile layout its container gains a surface fill and rounded corners, the keyboard hint disappears, and the text grows to the mobile input role. Keep a real accessible search label even when the visible prompt is a placeholder.

Input focus keeps the same accent outline vocabulary; the search input uses the existing larger outline offset (6px). The speed selector stays a native select with a surface fill, compact corners, and visible keyboard focus. The manual-copy fallback uses a readable textarea on the code surface with a fine border. No shared search error styling is currently defined.

### Navigation

The collection rail uses left-aligned icon or category-dot rows, labels, and right-aligned tabular counts. A current row combines the accent text and accent wash through `aria-current`. On fine-pointer hover, inactive rows receive the subtle fill while the current row retains its selection treatment. The mobile layout turns these same links into a single horizontal strip with smaller icons and counts.

Keep active-route state separate from hover. Category changes, search results, and keyboard navigation update immediately. The shell has no entrance sequence or animated navigation indicator.

### Source Inspector

A calm reading surface beside the material being studied.

The top row uses plain text tabs, a fine divider, and a short ink underline for the selected section. Selection and focus are distinct: the underline records selection and the accent outline records keyboard focus. The source-language selector uses a subtle group surface and a surface-colored selected item. The code inset uses its dedicated paper, restrained syntax colors, and the code type role. It scrolls locally so a long line does not widen the workbench.

The source section, explanation, and agent brief share the same container. Their state changes are immediate. The live application owns tab interaction and copy behavior; sidecar snippets show the visual states without supplying the application runtime.

### Motion Specifications and Demo Behavior

The definition list presents duration, purpose, easing or spring, and dependencies in a lightly structured surface panel. Short labels use muted text; values use ink, with system mono for the precise curve. Long values may wrap.

Shared demo motion uses the existing ease-out, ease-in-out, and drawer curves in the sidecar. The demo base button uses its established short press response, while recipe-specific durations remain with the recipe. Replay, pause, speed, and reduction controls are explicit tools for studying the effect. Respect the operating-system preference and the user’s chosen reduction setting; the still version must preserve the meaningful content and state. Keyboard-triggered changes remain immediate.

## Do's and Don'ts

### Do:

- Do keep the shell’s background, surfaces, text, selection colors, and source colors bound to the current theme.
- Do preserve the six established sample fields and their light appearance inside either shell theme.
- Do use Inter for interface copy and system monospace for source and exact motion values.
- Do keep category changes, search, keyboard navigation, and source-tab changes immediate.
- Do give each sample a generous clipped stage with its name, concise explanation, technology, and duration below.
- Do retain visible keyboard focus, readable labels, and a coherent reduced-motion state.
- Do use the existing responsive grid and horizontal mobile category strip before inventing a new navigation pattern.

### Don't:

- Don't add ornamental gradients, glow, or unnecessary marketing decoration to the shared workspace.
- Don't add animation to the navigation or make repeated utility actions wait for a transition.
- Don't replace the sample-specific palette with application selection or status colors.
- Don't surround every sample with an extra border, shadow, or enclosing card surface.
- Don't hide essential meaning behind hover, playback, or spatial movement.
- Don't treat an individual recipe’s expressive colors, type, shadows, or timings as universal shell tokens.
