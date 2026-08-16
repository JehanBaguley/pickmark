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
