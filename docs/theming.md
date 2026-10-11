# Themes and portable color tokens

Every study uses the same semantic color contract. `src/theme.mjs` resolves a
palette and appearance into CSS custom properties; the gallery preview, standalone
example, copied full HTML, download, and AI brief use that resolver. A palette
change recolors the actual animation, including its controls and artwork.

The surrounding website keeps its own light/dark theme. A study's **Appearance**
control can match that setting or use an explicitly chosen Light or Dark mode.

## Choose a palette

| UI label | ID | Behavior |
| --- | --- | --- |
| Playground colors | `original` | Uses the study's existing lavender, peach, blue, green, sand, or graphite family. Dark mode derives a corresponding dark composition. Each study keeps its own family. |
| Radix | `radix` | Uses selected values from the Radix Slate neutral scale and a chosen accent scale, in light or dark mode. |
| Geist-inspired | `geist` | Uses portable neutral surfaces with a chosen accent. This is an authored interpretation, not the complete Vercel design system. |
| Custom accent | `custom` | Uses neutral surfaces and an exact six-digit hex accent, with derived supporting colors and a selected solid-button foreground. |

Radix and Geist-inspired previews offer **Indigo, Blue, Violet, Jade, Amber, and
Crimson**. The original Playground palette uses the recipe's family instead, so
its accent selector is disabled. Custom accent replaces the scale selector with a
color picker and hex field; invalid hex text does not replace the active palette.

**Match site** follows the current shell appearance. It does not automatically
choose a different color family. Palette and appearance preferences are remembered
in the current browser when storage is available.

## Preview, links, and offline exports

The gallery sends theme updates to loaded preview frames. The embedded resolver
validates them and changes semantic tokens; the recipe does not need its own
palette handlers. The frame accepts theme messages from its parent window.

| Action | What it preserves |
| --- | --- |
| Copy link | Recipe ID and the resolved palette, light/dark mode, and applicable accent settings. |
| Copy full example / download | Complete HTML, styles, theme resolver, playback runtime, selected palette values/configuration, and Motion when the study needs it. |
| Copy CSS | Shared and recipe styles plus the selected palette. |
| Copy color tokens | A scoped `.animation-theme` block, using standalone values or the chosen host aliases. |
| Copy for AI | Recipe and source references, usage constraints, discovery metadata, selected appearance, and scoped color values. |

Match site resolves to its current **light** or **dark** value when copying a
link, full example, or agent brief. A shared reference therefore keeps the
appearance you selected even if another visitor uses a different shell theme.

A downloaded full example works offline. Both its fallback stylesheet and
embedded theme configuration contain the selected palette, so opening the file
without the gallery does not revert to the default color family. The complete
theme resolver is embedded; a valid theme parameter in the file's URL can override
the embedded configuration. Individual CSS or HTML fragments are not complete
standalone documents.

The main gallery still requires HTTP hosting because it fetches its catalog and
example metadata. Offline portability applies to the full exported examples.

### URL parameters

| Parameter | Accepted values |
| --- | --- |
| `palette` | `original`, `radix`, `geist`, `custom` |
| `mode` | `light` or `dark`; the gallery additionally accepts `auto` for Match site. |
| `accent` | `indigo`, `blue`, `violet`, `jade`, `amber`, `crimson` |
| `custom` | A six-digit hex color, with the `#` URL-encoded as `%23`. Used by the custom palette. |

For example, open a
[dark Radix chart](https://animation-playground-murex.vercel.app/?animation=chart-bars&palette=radix&mode=dark&accent=indigo)
or its
[standalone source](https://animation-playground-murex.vercel.app/examples/chart-bars.html?palette=radix&mode=dark&accent=indigo).
A custom reference can use
`?animation=spotlight-card&palette=custom&mode=dark&custom=%237c5ce7`.

Invalid parameters fall back to valid stored or embedded settings; they are not
inserted directly into CSS. Standalone documents use concrete light/dark modes;
they do not have a surrounding site appearance to follow.

## Semantic color roles

The recipe's `color` metadata selects its original Playground family. It does not
set fixed colors in the recipe or override a selected project palette.

| Token | Intended use |
| --- | --- |
| `--demo-bg` | The overall study canvas. |
| `--paper` | Component and panel surfaces. |
| `--ink` | Primary text; also an ink-filled control background. |
| `--on-ink` | Foreground on an ink-filled surface. |
| `--muted` | Secondary readable text. |
| `--line` | Boundaries, tracks, and separators. |
| `--accent` | Solid accent fills and graphical marks. |
| `--accent-hover` | The solid accent's hover state. |
| `--accent-soft` | A quiet supporting fill. |
| `--accent-ink` | Readable accent text and foreground icons on component surfaces. |
| `--on-accent` | Foreground on the selected solid accent. |
| `--success`, `--danger` | Success and error status colors. Meaning must also be conveyed through text or semantics. |
| `--art-1`, `--art-2`, `--art-3` | Coordinated decorative colors for shapes, diagrams, and illustrations. |
| `--shadow` | A translucent color for a bounded shadow. |

Use `--accent-ink` for accent-colored text rather than assuming the solid accent
is readable on every background. The resolver checks this role against `--paper`,
`--demo-bg`, and `--accent-soft`, adjusting the palette's starting text color until
all three pairings reach 4.5:1. The selected solid accent stays unchanged. Use
`--on-accent` for text placed over `--accent`. The resolver selects that foreground
and manages the hover pairing. These checks do not establish contrast for every
possible combination of tokens.
Decorative artwork colors are not text colors.

All future recipes must consume these roles in markup, CSS, and JavaScript. Use
`currentColor`, `transparent`, and token-based mixing when appropriate. Raw color
values belong in `src/theme.mjs`, so adding a theme updates the collection without
creating separate copies of its studies.

## Reuse in an existing design system

Open a study's **Colors** tab, choose the export format, and copy its complete
token block. It uses `.animation-theme` rather than a global `:root` selector.
Apply that class to a dedicated wrapper around the imported example:

```html
<section class="animation-theme">
  <!-- Adapt the selected recipe's markup inside this wrapper. -->
</section>
```

CSS custom properties inherit from this wrapper to the example. Keep the wrapper
inside the receiving project's active theme provider so the aliases can resolve
that provider's variables. The complete standalone document uses root-level
tokens because it owns its own page; use the scoped token export when bringing a
component into a larger application.

Names such as `--accent` may already be used by the host project. Do not paste the
standalone root stylesheet over the host's global tokens. Keep the wrapper narrow;
if it contains host components that also consume these names, rename the imported
recipe's roles consistently to a project-specific namespace before integration.
The standalone base also contains page-wide rules, so adapt those rules to the
component boundary instead of applying the full page reset to the host app.

### Standalone values

The default export provides literal values for every role. It reproduces the
current preview without requiring Radix, Geist, a package, or an external request.
It remains a fixed exported appearance until the receiving project changes it.

### Radix token aliases

The Radix alias export maps these roles and keeps a literal fallback for each:

| Animation role | Host token |
| --- | --- |
| `--demo-bg` | `--gray-1` |
| `--paper` | `--gray-2` |
| `--ink` | `--gray-12` |
| `--muted` | `--gray-11` |
| `--line` | `--gray-7` |
| `--accent` | `--{accent}-9` |
| `--accent-hover` | `--{accent}-10` |
| `--accent-soft` | `--{accent}-3` |

`{accent}` is the selected scale, such as `indigo` or `jade`. The receiver must
load the **active gray scale and the chosen accent scale**, including the needed
light/dark definitions. Loading a colored scale alone does not provide gray
tokens. If the host exposes names such as `--slate-1` instead of `--gray-1`, adapt
the generated neutral aliases or provide corresponding gray aliases in the host.

The alias export is an integration option independent of the preview preset. Its
fallbacks are the selected preview values. Once host variables resolve, those
host values take precedence. Readable accent text (`--accent-ink`), solid
foreground, status, decorative, and shadow roles retain literal values; review
them when changing the host scale or mode. In particular, `--accent-ink` keeps
the resolver's contrast-adjusted value: directly binding it to a host's step 11
can make small text unreadable on mixed neutral and tinted backgrounds, as with
light Jade and Amber. Recheck text against the receiving project's actual
surfaces when overriding host scales or appearance.

The role choices follow the official
[Radix scale guidance](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale):
backgrounds use the early steps, solid controls use steps 9/10, and text starts
from steps 11/12. The Playground adjusts its accent text for the actual surfaces
it uses. It embeds selected scale values, not the Radix Themes component library.

### Geist neutral aliases

The Geist export intentionally maps only neutral roles:

| Animation role | Host token |
| --- | --- |
| `--demo-bg` | `--ds-background-100` |
| `--paper` | `--ds-background-200` |
| `--ink` | `--ds-gray-1000` |
| `--muted` | `--ds-gray-900` |
| `--line` | `--ds-gray-500` |

The selected preview's accent and remaining roles stay as literal fallback
values. This avoids pretending that six different accent families all map to one
Geist color scale. The receiver must already provide its active Geist tokens for
the neutral aliases to resolve. See the official
[Geist colors documentation](https://vercel.com/geist/colors) for the host system's
background, border, and text roles.

Neither alias format installs a design system or imports CSS. If the required
host variables are absent, the fallback values keep the animation coherent.
After integrating, check the actual component's text, focus, hover, pressed,
disabled, and status states in each supported host appearance.

## Sources and maintenance

Radix palette values were reviewed from the official
[`src/light.ts`](https://github.com/radix-ui/colors/blob/main/src/light.ts) and
[`src/dark.ts`](https://github.com/radix-ui/colors/blob/main/src/dark.ts) sources.
The upstream MIT license was retrieved on October 10, 2026 and is preserved in
[third-party notices](../THIRD_PARTY_NOTICES.md). No exact upstream commit is
asserted for these copied palette values; the checked-in `src/theme.mjs` records
the values used by this implementation.

Keep palette definitions, normalization, URL handling, preview installation, and
export resolution together in `src/theme.mjs`. Review the theme guide and the
[recipe contract](recipe-contract.md) when adding roles or palettes. Changes to
the resolver affect all 100 standalone examples, so verify both live previews and
copied/downloaded files rather than only the surrounding gallery.
