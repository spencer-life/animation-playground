# Skill and source routes

This project records versioned guidance for future agents. It does not claim that
a source link installs a skill or enables native host discovery. Read the relevant
upstream instructions and needed references before applying them. User and scoped
repository instructions remain authoritative.

## Reviewed animation source

- Repository: [emilkowalski/skills](https://github.com/emilkowalski/skills).
- Reviewed revision: `e8a175de22ae1e49370fc144c1f3bb9aeedf988d`.
- Pinned corpus: [all skills at that revision](https://github.com/emilkowalski/skills/tree/e8a175de22ae1e49370fc144c1f3bb9aeedf988d/skills).
- Applicability and source review: [emil-research.md](emil-research.md).
- Implementation contract: [recipe-contract.md](recipe-contract.md).

Each recipe's `source` points into this pinned corpus. The build converts it to a
full URL for the workbench, JSON catalog, and copied agent brief. Review a newer
source deliberately before changing the build's pinned revision.

| Skill | Use in this project |
| --- | --- |
| `animate` | Build a requested effect after the frequency/purpose gate; read `RECIPES.md` where applicable. |
| `review-animations` | Explicit motion review against `STANDARDS.md`; preserve its explicit-selection restriction. |
| `improve-animations` | Distinguish audit/planning mode from authorized implementation. |
| `find-animation-opportunities` | Read-only proposals for useful motion and deliberate stillness. |
| `emil-design-eng` | Interface craft, restraint, coherent timing, and developer experience. |
| `mobile-native` | Capability-gated hover, touch feedback, zoom, sizing, and actual device limitations. |
| `apple-design` | Transferable continuity, interruption, typography, and accessibility principles. |
| `animation-vocabulary` | Precise names and explanations for the demonstrated techniques. |
| `prototype` | Bounded interactive studies with a clear purpose and reusable behavior. |
| `pick-ui-library` | Decide when a production component needs a maintained primitive; see the native scope below. |
| `ask-sonner` | Reference the existing component's design and behavior without recreating a production toast system. |
| `break-ui` | Authorized adversarial fixture checks; keep synthetic test controls out of production. |
| `animate-expo` | Review transferable motion principles; no Expo implementation is part of this static website. |
| `write-swift` | Review native scope and transferable principles; no Swift implementation is part of this website. |

When available, Impeccable can guide broader UI layout, readability, accessibility,
and polish. It complements the focused motion guidance; avoid introducing an
unneeded second design system. Read a skill before applying it. If a relevant
provider is unavailable, use the pinned source manually and report the limitation;
do not claim that a skill was installed, invoked, or verified when it was not.

## Native component scope

The source corpus contains React-focused library recommendations. This project
deliberately uses native buttons, inputs, `<details>`, `<dialog>`, and the Popover
API where they provide the required semantics for a small standalone study.
These patterns do not require a React runtime, headless component package, or
design-system dependency merely to demonstrate their motion.

That decision does not make every study a complete production component. The
activity stack is a visible inline history, not a production toast system. The
rolling digits example is an isolated digit-strip study and recommends NumberFlow
for production formatting and counters. Complex menus, notifications, routing,
gesture surfaces, and application-level focus management should reuse the receiving
project's maintained primitives when appropriate.

## Tooling and dependency guidance

The selected stack is a static website with a small Node build helper. It uses the
declared pnpm version and a single `pnpm-lock.yaml`. The template's aube and
TanStack Intent recommendations were considered; this scoped implementation uses
pnpm and directly reviewed upstream guidance and official documentation. It does
not add a second package manager or a dependency-skill discovery layer to the
browser runtime. Reassess those choices if the application architecture changes.

The initial manifest pins these implementation dependencies:

| Package | Version | Role |
| --- | --- | --- |
| `motion` | `14.1.0` | Spring behavior in three studies, bundled into each corresponding full HTML file. |
| `esbuild` | `0.28.2` | Build-time bundling of the Motion export. |
| `@fontsource-variable/inter` | `5.3.0` | Self-hosted font for the gallery shell. |
| `@playwright/test` | `1.64.0` | Browser validation tooling. |
| `@axe-core/playwright` | `4.13.0` | Automated accessibility checks within browser validation. |

These are reproducible version choices, not a claim that they remain the newest
versions. Inspect the current manifest and lockfile when maintaining the project.
Review compatibility, release notes, and security findings before updating.

Official documentation is the fallback for implementation details:

- [pnpm frozen installation](https://pnpm.io/cli/install#--frozen-lockfile).
- [Motion JavaScript quick start](https://motion.dev/docs/quick-start).
- [esbuild API](https://esbuild.github.io/api/).
- [Playwright browser installation and supported browsers](https://playwright.dev/docs/browsers).
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
- [HTML dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog).

The original implementations and redistributed dependencies retain their notices
in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md). A source reference does not
imply endorsement by Emil Kowalski or any upstream author.
