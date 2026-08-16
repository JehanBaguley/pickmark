# Make this your own shelf

This repo is a template. One config file gives you your own browsable catalogue
for a café, a club, or the shelf in your lounge room, with stats that keep
themselves up to date from BoardGameGeek. No backend, no hosting bill, nothing to
maintain once it's running.

Fifteen minutes, five steps.

## 1. Get your copy

Click **Use this template** (or Fork) on GitHub, name it, then in your new repo's
settings turn on **Pages** (Settings → Pages → deploy from branch → main, root).
Your site will live at `yourname.github.io/your-repo-name`.

## 2. Make your sheet

Create a Google Sheet with a tab named `data`. Copy the header row from
[the template sheet](https://github.com/JehanBaguley/pickmark/blob/main/sheet-template.csv):

```
name, bgg_link, playable, for_sale, price, blurb, pick_by, pick_note, rating,
play_style, expansion, players, age, time, category
```

You only ever type the first seven kinds of thing (name, BGG link, playable,
for sale, price, blurb, picks). Everything else arrives from BoardGameGeek
overnight. Blank cell = trust BGG; typed cell = you win.

Then File → Share → **Anyone with the link: Viewer**, and note your sheet id
(the long string in the URL).

## 3. Edit config.js

**The short way:** open [the setup wizard](https://jehanbaguley.github.io/pickmark/setup.html),
fill in the form, pick your colours, and copy the two blocks it gives you into
`config.js` and the `<meta>` lines of `index.html`. Nothing you type is sent
anywhere: it all runs in your browser. The rest of this step explains what it writes.

One thing worth knowing, because it is the only third party in the whole project:
both pages load two typefaces from Google Fonts, so every visitor's browser makes
a request to `fonts.googleapis.com`. If that matters for your venue, download the
two `.woff2` files, drop them next to `index.html`, and replace the `@import` at
the top of the `<style>` block with a local `@font-face`.

The only file you need to touch. Every field is explained in its comments:
your name, the small line above the title, the tagline, contact link, your
sheet's CSV feed (swap your sheet id into the URL pattern already there), and
optional theme colours. Set `"sheetCsvUrl": ""` if you just want a static list
with no sheet, and `"bggUser": ""` if you don't have a BGG collection.

Also replace `icon.png` with your own favicon, and (optional, for nice social
link previews) update the half-dozen `<meta>` lines at the top of `index.html`.
They're the only identity strings the config can't reach, because social
crawlers don't run JavaScript.

## 4. Wire the nightly build

In your repo: Settings → Secrets and variables → Actions.
Add a **variable** `SHEET_CSV_URL` with the same CSV URL from config.js.
Optionally add a **secret** `BGG_TOKEN` (a BoardGameGeek application token) for
more reliable stat fetching; without it the build still works, just more gently.

Then Actions → "Sync catalogue data" → **Run workflow**. From then on it runs
itself nightly at 3am AEST (edit the cron in
`.github/workflows/sync-data.yml` for your timezone).

## 5. Print a QR code

Point any QR generator at your Pages URL. That's the whole deployment.

## Rules the template lives by

- **The sheet is the shelf.** Rows not in the sheet don't exist on the site.
- The build refuses to publish if data coverage collapses. A broken sync gives
  you yesterday's good data, not a broken site.
- Missing data flags itself amber in the sheet and clears itself when filled
  (see GUIDE.md for the two-minute staff version).
- If you display BGG data publicly, keep the BoardGameGeek attribution in the
  footer. Their API terms require it, and it's non-commercial by default.

## When something stops working

Almost every problem is one of five things, and all five are visible from your own repo.

**New games in the sheet aren't appearing on the site.**
The nightly build didn't run, or it ran and failed. Go to your repo's **Actions** tab and
look at the most recent "Sync catalogue data" run. A red cross tells you what broke. You can
always press **Run workflow** to try again straight away rather than waiting for 3am.

**Prices or blurbs are stale, but the rest is fine.**
Those come live from your sheet on every page load, so this means the browser can't read
your sheet. Check that it is still shared as **Anyone with the link: Viewer**, and that
`sheetCsvUrl` in `config.js` still matches the sheet id in your address bar. Paste the
`sheetCsvUrl` value straight into a browser tab: you should get a CSV download, not a login
page.

**A whole column is empty or wrong.**
Columns are matched by heading name, not position. Renaming or deleting a heading silently
breaks that column, while reordering columns is completely safe. Compare your headings
against `sheet-template.csv`.

**The site is blank.**
Open your browser's console. If it says something about `config.js`, you have a JSON syntax
error, usually a trailing comma or a stray quote inside a name. Run your file through any
JSON validator, or just re-run the setup wizard and paste a clean copy.

**Ratings are missing for lots of games at once.**
BoardGameGeek was slow or down when the build ran. The build deliberately keeps yesterday's
good data rather than publishing a half-empty catalogue, so this fixes itself on the next
run. If it persists for more than a couple of nights, add a `BGG_TOKEN` secret: unauthenticated
requests are rate-limited far more aggressively.

**Still stuck?** Open an issue with your repo URL and what you see. See the support note in
the README for what I can and can't help with.

## Not board games?

The only BGG-specific code is the enrichment in `scripts/build-data.mjs` and the
genre vocabulary. Everything else (the sheet contract, overrides, self-flagging,
filters, the site) is collection-agnostic. Swapping the enricher for another
metadata API (Open Library for books, Discogs for records) is a contained change.
