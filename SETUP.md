# Make this your own shelf

This repo is a template. One config file gives you your own browsable catalogue
for a café, a club, or the shelf in your lounge room, with stats that keep
themselves up to date from BoardGameGeek. No backend, no hosting bill, nothing to
maintain once it's running.

Twenty minutes, six steps, and then it looks after itself.

## 1. Get your copy

Click **Use this template** on GitHub, name it, then in your new repo's settings turn
on **Pages** (Settings → Pages → deploy from branch → main, root). Your site will live
at `yourname.github.io/your-repo-name`.

**Use this template, not Fork.** They look the same and they are not. GitHub disables
scheduled workflows on a fork until somebody opens the Actions tab and presses the
green "I understand my workflows, go ahead and enable them" button. If you fork and
skip that, everything looks fine and your catalogue never updates, with nothing red
anywhere to tell you. If you have already forked, go to Actions and enable them now.

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

**Who should own this sheet: you, the venue.** Not whoever set the site up for you.
The sheet is the only thing that is genuinely yours here, everything else is a copy of
this template, and the person who owns the sheet is the person who can keep the shelf
alive. If somebody else built this for you, ask them to transfer ownership to you.

**That share setting is load-bearing, and nothing warns you.** "Anyone with the link:
Viewer" is how both the nightly build and your visitors' browsers read the sheet.
Tighten it and the site does not go down: it quietly stops updating while continuing to
show yesterday's catalogue, which is a much harder thing to notice. This exact thing
happened to the first venue running this, and it took eleven days to spot. Viewer is
read-only, so it is safe: nobody with the link can change anything.

**Two things about tabs and columns that will cost you an afternoon if you meet them
the hard way:**

- The feed URL ends in `&sheet=data`. If no tab by that name exists, Google **does not
  error**. It quietly serves your first tab instead. So if your catalogue is on a tab
  called `Sheet1` or `Copy of games`, rename it to `data` rather than assuming the URL
  is being ignored.
- **Pick one price format and use it for the whole column.** `65` everywhere, or `$65`
  everywhere, or `~$80` everywhere. Google's feed decides a single type per column, so
  a column holding both `65` and `~$80` comes back with the numbers intact and the text
  ones **blank**, silently. The nightly build now flags any game that is for sale with
  no price, so you will see it, but it is much easier to never cause it.

## 3. Edit config.js

**The short way:** open [the setup wizard](https://jehanbaguley.github.io/pickmark/setup.html),
fill in the form, pick your colours, and copy the two blocks it gives you into
`config.js` and the `<meta>` lines of `index.html`. Nothing you type is sent
anywhere: it all runs in your browser. The rest of this step explains what it writes.

Worth knowing, because people ask: **this site makes no third-party requests at
all.** The typefaces are committed in `fonts/` and served from your own origin, so
nothing about your customers reaches anyone else. No analytics, no trackers, no
CDN. The only outbound request a visitor's browser makes is to your own Google
Sheet, to pick up price and blurb changes since the last nightly build.

If you swap the typefaces, replace the files in `fonts/`, the `@font-face` block
at the top of the `<style>` in `index.html` and `setup.html`, and `fonts/LICENSE.md`.

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

Go to Actions and run **"Check my setup"**. It reads your config and your sheet the
same way the build does and tells you in plain words what it found. Do this before
anything else: it turns "it doesn't work" into "your sheet is not shared".

Then Actions → **"Sync catalogue data"** → Run workflow. From then on it runs itself
nightly at 3am AEST (edit the cron in `.github/workflows/sync-data.yml` for your
timezone).

Optionally, in Settings → Secrets and variables → Actions:

- A **secret** `BGG_TOKEN`, a BoardGameGeek application token, for more reliable stat
  fetching. Without it the build still works, just more gently, and BoardGameGeek has
  been moving towards requiring one.
- A **variable** `SHEET_CSV_URL`. You do not need this: the build falls back to
  `sheetCsvUrl` in config.js. Only set it if you want the build reading a different
  sheet from the one visitors' browsers read, and be aware that if the two drift apart
  the nightly and the live page will disagree with each other.

## 5. Tell the canary what normal looks like

There is a second scheduled job, **Canary**, that runs two hours after the nightly and
looks at your *live site* rather than your code. It is the only check that can catch the
catalogue being wrong rather than the code being broken, and it emails you when it
fails.

It compares the live site against `data/expected.json`. That file ships deliberately
loose, because a brand new shelf with no staff picks and nothing for sale is completely
normal and must not go red on day one. Once your shelf is real, open it and tighten it:

```json
"games": { "min": 300, "max": 420 },
"minPickLists": 1,
"minPickedGames": 10,
"minForSale": 20
```

Set the range around your actual count, and set the minimums to numbers you would want
to be told about losing. That is the whole value of it. When the canary goes red, fix
the shelf: **never widen these to make it green again**, because that is the alarm
working.

The canary also keeps your repo from going quiet. GitHub switches off scheduled
workflows after 60 days of inactivity, and the nightly only commits when something
actually changed, so a stable shelf would otherwise have its updates silently disabled
after two months.

## 6. Print a QR code

Point any QR generator at your Pages URL. That's the whole deployment.

## 7. Amber flags in the sheet (optional, ten minutes)

The nightly build writes `data/gaps.csv`: one quoted line per missing value, in the form
`"Game name|field"`, where field is `players`, `time`, `age`, `rating` or `price`. The first
four are the games BoardGameGeek genuinely has nothing for, so they are the only blanks worth
filling by hand. `price` is different: it means a game is marked for sale with no price coming
through, which is either a half-finished row or the mixed-price-format trap from step 2.

Nothing reads that file until you wire your sheet to it. Two steps, once, and then it looks
after itself.

**Pull the file in.** Add a tab called `gaps`, and put this in `gaps!A1`:

```
=IMPORTDATA("https://raw.githubusercontent.com/YOUR-NAME/YOUR-REPO/main/data/gaps.csv")
```

Google asks you to allow access the first time, and that prompt only appears on desktop.
Click it once and it refreshes by itself from then on. An empty `gaps` tab means full
coverage, which is the state you want to be in.

**Paint the cells.** On the `data` tab: Format, then Conditional formatting, then custom
formula. Both formulas below are written for the **top-left cell of whatever range you
select**, so swap the column letter to match your sheet. Both assume `name` is column A.

Required fields, amber whenever a row exists and the cell is empty. Select the `bgg_link`,
`playable` and `blurb` columns from row 2 down:

```
=AND($A2<>"", B2="")
```

BGG fields, amber only when BGG has nothing to offer. Select `rating`, `players`, `age` and
`time` from row 2 down:

```
=AND(I2="", ISNUMBER(MATCH($A2&"|"&I$1, gaps!$A:$A, 0)))
```

That second formula reads its own column's header cell, so **the header names have to match
the field names the build emits**: `rating`, `players`, `age`, `time`. Rename a header and
that column stops flagging, silently and without an error.

One thing that looks broken and isn't: when your coverage is complete, `gaps.csv` is empty,
so `gaps!A1` shows `#N/A`. That is the healthy state. The `ISNUMBER(MATCH(...))` wrapper
above is there precisely so an empty gaps tab paints nothing rather than erroring.

No script runs in the sheet, and there is nothing to maintain. A cell clears the moment
someone types in it, and the flags refresh after the next nightly build.

## Rules the template lives by

- **The sheet is the shelf.** Rows not in the sheet don't exist on the site.
- **The build fails closed.** If your sheet cannot be read, the build stops rather than
  publishing something else. If the catalogue suddenly loses every price, every for-sale
  flag or every staff pick, it stops too, because only a person can type those and losing
  all of them at once means the feed is no longer your shelf. A broken sync gives you
  yesterday's good data, never a confidently wrong site.
- Missing data flags itself amber in the sheet and clears itself when filled
  (see GUIDE.md for the two-minute staff version).
- If you display BGG data publicly, keep the BoardGameGeek attribution in the
  footer. Their API terms require it, and it's non-commercial by default.

## When something stops working

**Run "Check my setup" from the Actions tab first.** It diagnoses everything below
automatically and will usually just tell you the answer. The rest of this section is
what it is checking, and what to do about each one.

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
