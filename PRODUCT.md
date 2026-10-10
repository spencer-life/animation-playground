# Animation Playground

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by the user: a static HTML, CSS, and JavaScript application, with complete standalone HTML examples. A small build script publishes the same example sources that the app displays and copies. Hosting must remain portable to GitHub Pages, another static host, or ChatGPT Sites.

## Users

Flint and other designers or developers who want to discover, inspect, and reuse web animation in future projects. ChatGPT and Codex also consume the repository as a reference.

## Product Purpose

A practical animation hub where every entry is a real interactive demonstration, a concise explanation, copyable running source, and a stable reference. Success means finding motion appropriate to a project, previewing it in that project's colors, and carrying its implementation and constraints into the project without reconstructing it from a screenshot.

## Operating Context

Desktop browsing and touch use on phones and tablets. Visitors browse by project, compare everyday and expressive effects, preview light and dark palettes, replay studies slowly, bookmark useful patterns, and copy code or an agent brief. No accounts, backend, API keys, or external data are required. Downloaded examples retain their selected palette and work offline.

## Capabilities and Constraints

- 44 distinct animation patterns, including practical interface feedback, loading, layout, charts, reading progress, text, entrances, and expressive experiments. 41 use native browser APIs; three spring studies embed Motion.
- Five project collections: Product UI, Landing pages, Dashboards, Storytelling, and Signature motion. Six motion categories remain available, alongside search, intent, technology, complexity, curated ordering, and A–Z ordering.
- Bookmarks, related studies, stable deep links, code copy, source download, and an AI handoff with the selected color tokens.
- One semantic color contract for live previews and exported code. Playground colors retain each study's family; Radix, Geist-inspired, and custom-accent palettes let the actual demonstrations fit other projects. Appearance can be Light, Dark, or Match site; the project palettes offer six accents.
- Scoped token exports support standalone values, Radix aliases, and Geist neutral aliases. A host design system remains responsible for its active token scales and contrast when those aliases replace fallback values.
- Apply all relevant principles in Emil Kowalski's skills at revision e8a175de22ae1e49370fc144c1f3bb9aeedf988d. Read native-only skills for transferable principles without introducing native runtimes.
- Keep runtime dependencies proportionate to the individual pattern. CSS and browser APIs first; use Motion only for actual spring behavior where needed.
- Public GitHub repository: spencer-life/animation-playground. The user authorized design, implementation, and hosting end to end and explicitly requested no questions.

## Brand Commitments

Name: Animation Playground. Avoid generic AI interface styling, ornamental gradients, unnecessary hero marketing, and animation on the navigation itself. Plain, useful descriptions and visible demonstrations take priority.

## Evidence on Hand

The linked Emil Kowalski skills repository and its MIT license; official Radix color scale documentation and MIT-licensed palette values; and the official Geist color documentation. The app's examples are authored demonstrations, not claims of endorsement or copied production components. Geist-inspired previews are portable neutral adaptations, not the complete Vercel design system. Source references and integration details are recorded in `docs/theming.md` and `THIRD_PARTY_NOTICES.md`.

## Product Principles

- Motion has an identifiable job; explain the conditions where it belongs.
- The visible demo and copied implementation share one source of truth.
- Color variation belongs to a shared semantic theme system, so future studies can match a receiving project's palette without duplicating recipes.
- Collections describe useful project contexts; an expressive example in a dashboard collection is not a recommendation to animate every data update.
- Stable identifiers and complete implementation context make references reusable.
- Navigation remains fast while motion is intentionally studied inside demos.

## Accessibility & Inclusion

Keyboard access, visible focus, readable contrast, touch-friendly controls, and an OS-respecting reduced-motion mode. Spatial movement is removed in reduced mode while state remains understandable. No essential information depends on animation.
