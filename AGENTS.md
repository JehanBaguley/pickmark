# AGENTS.md

## What this is
Pickmark: a free template that turns a board game cafe's shelf into a fast public game picker. Staff keep seven columns in a Google Sheet; BoardGameGeek fills in the rest overnight. Static site, no backend, no third-party requests. Demo: https://jehanbaguley.github.io/pickmark/. Instances (for example `../meeple-mug-shelf-guide`) are forks of this core.

## Stack
Single-file vanilla JS (`index.html`), no framework, no dependencies. Node 22 build scripts, GitHub Actions, GitHub Pages. PWA (`sw.js`, `manifest.webmanifest`). Playwright browser tests.

## Folders
- `index.html` the app; `setup.html` the setup page that writes a `config.js`; `config.js` identity and theme (strict JSON inside).
- `scripts/` nightly `build-data.mjs`, `fetch-bgg-cats.mjs`, `check-setup.mjs`.
- `data/` demo catalogue (`games.json`); `sheet-template.csv` the sheet contract.
- `tests/` regression harnesses (`tests/README.md`). `fonts/` self-hosted typefaces.
- Docs: `SETUP.md`, `GUIDE.md`, `BRAND.md`, `.github/copilot-instructions.md`.

## Commands
- Serve: `python3 -m http.server 8899` from the repo root.
- Test: `node tests/chkNN.mjs`, or all `tests/chk*.mjs` (needs `playwright`; see `.github/workflows/tests.yml`). chk34 and chk35 need no browser.
- Build data: `node scripts/build-data.mjs` (needs `SHEET_CSV_URL`, `BGG_TOKEN`).
- Setup check: `node scripts/check-setup.mjs`.

## Rules
Read `.github/copilot-instructions.md` before changing anything; it holds the invariants. Key ones:
- The sheet is the shelf: BGG enriches existing rows and never adds a game. A blank cell trusts the data; a typed cell wins.
- Join on `bggId`, not name. Expansion is a pill, not a genre.
- `catSlugFor` exists in both `index.html` and `scripts/build-data.mjs`; keep them identical.
- `config.js`: empty string means deliberately none; check `!== undefined`, never `||`.
- No real venue's name, address, sheet, email or collection may appear as a default anywhere; `tests/chk32-template-clean.mjs` enforces it.
- `sw.js`, `scripts/build-data.mjs`, `scripts/fetch-bgg-cats.mjs` must stay byte-identical with instances. Instances differ only in `config.js`, the head identity block, the `EMBED` line and `manifest.webmanifest`.
- Theme colour must agree in `config.js`, the `theme-color` meta tag and `manifest.webmanifest`.
- Pickmark identity (name, mark, palette) is fixed; see `BRAND.md`. Instance themes belong to the venue.
- Do not change the `"name|field"` shape of `data/gaps.csv`.
- Never publish an empty or partial catalogue. Verify in a real browser or say it is unverified.
- Never paste a token into a shell command. Never commit secrets, tokens or private data.

## Standards
- UI: WCAG 2.2 AA minimum, including focus visible, target size and reduced motion; `BRAND.md` records measured contrast. WAI-ARIA APG patterns for interactive components. Open UI names for new components where one exists.
- AGENTS.md is the agent instructions file; CLAUDE.md only points to it.
- Commits use Conventional Commits 1.0.
