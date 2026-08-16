# Pickmark brand

The line this file draws: **Pickmark's identity is fixed, your instance's theme is yours.**
The mark, the name and the palette below belong to the project. The colours a venue picks
in `config.js` belong to that venue, and the two are deliberately separate so a café can
look like itself without touching anything here.

Source of truth: the Figma foundations file, frame **"Pickmark — Hanko Logo"**.

## The idea

A *hanko* is a Japanese personal seal, the mark you press to approve something. Pickmark is
a mark that helps you pick. The symbol is that stamp, and the palette follows it: paper,
ink, and the things on a café table.

**Tagline:** Find what fits the table.

## Palette

| Name | Hex | Where it goes |
|---|---|---|
| Vermillion Ink | `#D94F3B` | The stamp. The accent. Never large areas of it. |
| Roasted Sesame | `#3D3632` | Body text, dark surfaces |
| Rice Paper | `#F5F0E8` | Page and card backgrounds |
| Matcha Fog | `#8BA888` | Quiet supporting state, calm/easy signals |
| Toasted Wheat | `#D4B896` | Warm secondary, edges and dividers |
| Soft Charcoal | `#6B6460` | Secondary text, muted labels |

App theme colours in `manifest.webmanifest` are Vermillion Ink on Rice Paper.

## How the palette is applied

The interface is themed from six of those values. The other nine CSS variables are derived
from them by the same `shade()` and `mix()` the setup wizard uses, so the wizard's preview
and the shipped `:root` are the same theme rather than two that merely look alike.

| Variable | Value | From |
|---|---|---|
| `--bg` | `#3d3632` | Roasted Sesame |
| `--bg-deep` | `#2c2724` | derived |
| `--card` | `#f5f0e8` | Rice Paper |
| `--card-edge` | `#d3cec8` | derived |
| `--timber` | `#d4b896` | Toasted Wheat |
| `--timber-light` | `#ddc8ad` | derived |
| `--amber` (accent) | `#d4b896` | Toasted Wheat |
| `--ink` | `#3d3632` | Roasted Sesame |
| `--ink-soft` | `#6d6661` | derived, lands on Soft Charcoal |
| `--cream` | `#f5f0e8` | Rice Paper |
| `--muted` | `#a8a29c` | derived |
| `--link` | `#5f5344` | derived |
| `--red` | `#d94f3b` | Vermillion Ink |
| `--ok` / `--warn` | `#4c8f5d` / `#d08430` | availability status |

## The contrast finding

Applying the palette turned up something the brand board cannot show on its own.

**Vermillion Ink cannot carry text at WCAG AA on either surface.**

| Pair | Ratio | Verdict |
|---|---|---|
| Vermillion Ink on Rice Paper | 3.61 | UI components and large text only |
| Vermillion Ink on Roasted Sesame | 2.90 | fails everything |

That is why the interactive accent is Toasted Wheat (6.26 against the shell, both
directions) and Vermillion Ink appears only where contrast is not a text requirement: the
mark, the browser theme colour, the installed app icon, and the `--red` token.

**If you want Vermillion in the interface**, the palette needs a second token, because one
red cannot serve both surfaces:

- **On Rice Paper:** `#b84332`, Vermillion darkened 15%, gives **4.76** and passes AA for
  body text on cards.
- **On Roasted Sesame:** darkening makes it worse (2.19). A dark shell needs a *lighter*
  vermillion, which is a different colour again.

This is the ordinary shape of the problem: a brand accent is picked against white in a
presentation, then has to survive two real surfaces. Worth deciding deliberately rather
than discovering it in an audit.

## Contrast, as shipped

Every text pair in the default theme, measured:

| Pair | Ratio |
|---|---|
| Page text on shell | 10.45 |
| Card text on card | 10.45 |
| Accent text on shell | 6.26 |
| Card text on accent chip | 6.26 |
| Link on card | 6.59 |
| Secondary text on card | 4.97 |
| Muted text on shell | 4.69 |

All clear 4.5:1. axe reports zero violations on desktop, mobile, and with the mobile filter
sheet open. If you change the palette, re-run `a11y-audit` and re-measure: a brand palette
that fails AA is not a brand palette.

## The mark

`icon.svg` is the source, exported from Figma. `icon.png`, `icon-192.png` and
`icon-512.png` are generated from it.

It is built to survive being small: at 16px it is still a red stamp with a P in it. If you
redraw it, keep that test. No fine detail, one accent, one shape.

**Do not** put the mark on a busy background, recolour it, rotate it, or add a bookmark
ribbon to it. It has been checked on white, Rice Paper, dark and black.

## Naming

- **Pickmark** in prose, `pickmark` in repo, package and file contexts
- Never `PickMark`, `Pick Mark`, `Pickmark OS`, `Pickmark Catalogue`
- The product is a **shelf guide**. "Shelf guide" is the descriptor, not the brand, which
  is why a venue's `guideName` can still say "Shelf Guide", "Game Library" or "The List".
- It is installable, so "install Pickmark" is fine. "The Pickmark app" is not: it invites
  expectations (accounts, an app store) the product deliberately does not meet.

## If you forked this

Everything above is ours. Replace `icon.png` and the icon sizes with your own, set your
colours in `config.js`, and the site becomes yours. You do not need permission and you do
not need to credit Pickmark, though it is nice if you do.
