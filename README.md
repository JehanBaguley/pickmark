# Shelf Guide

A browsable catalogue for a shelf full of games, so that someone standing in front of it
with a coffee in their hand can find something to play in about thirty seconds.

It is a static site. There is no backend, no login, no app to install and no hosting bill.
A Google Sheet is the only thing anyone edits, and BoardGameGeek fills in the boring parts
overnight.

**[See the demo shelf](https://jehanbaguley.github.io/shelf-guide-template/)** |
**[Set up your own](https://jehanbaguley.github.io/shelf-guide-template/setup.html)** |
**[Running it day to day](GUIDE.md)**

---

## The idea

You type seven things per game:

| You type | BoardGameGeek supplies overnight |
|---|---|
| name, link, playable, for sale, price, one line blurb, staff pick | rating, players, playtime, ages, genres, complexity |

And one rule holds it together:

> **A blank cell means trust the data. A typed cell means you win.**

Nobody has to remember which columns belong to whom, because not typing is itself a
decision. If you disagree with BoardGameGeek about how long a game takes, type over it and
yours sticks permanently.

Two rules follow from that one. Rows that are not in the sheet do not exist on the site, so
the API can enrich your shelf but never invent it. And if the build cannot reach your sheet
one night, it keeps yesterday's good data rather than publishing a broken catalogue.

## What you get

- Filter by players, playtime, age, complexity, genre and how you play (co-op, competitive, teams)
- Separate views for what is playable in-house and what is for sale
- Staff and member picks
- Installable as an app, and it still works with no connection
- Missing data flags itself amber in your sheet and clears itself when filled
- Accessible: audited with axe, keyboard navigable, respects reduced motion
- Nine browser tests that run in CI on every push

## Getting started

1. Click **Use this template** at the top of this page
2. Open [the setup page](https://jehanbaguley.github.io/shelf-guide-template/setup.html),
   fill in the form, and copy what it gives you into `config.js`
3. Follow [SETUP.md](SETUP.md) for the remaining five minutes: your sheet, Pages, and the
   nightly sync

The demo shelf in `data/games.json` is nineteen well known games with real statistics, so
your fork looks alive before you have typed anything. Replace it whenever you are ready.

Have a look at `sheet-template.csv` before you start: every BoardGameGeek column in it is
deliberately blank. That is the contract, shown rather than explained.

## Not board games?

The only board-game-specific code is the enrichment step in `scripts/build-data.mjs` and
the genre vocabulary. The sheet contract, the override rules, the self-flagging, the
filters and the site are all collection-agnostic. Swapping the enricher for another
metadata source (Open Library for books, Discogs for records) is a contained change.

## Credits and licence

The code is MIT licensed, so do what you like with it.

Game data comes from [BoardGameGeek](https://boardgamegeek.com) via their XML API.
**Each instance registers its own API application and uses its own token**, so your data
relationship is directly with BGG. Their API is non-commercial by default. If you display
their data publicly, keep the attribution line in the footer.

Built by [Jehan Baguley](https://github.com/JehanBaguley), originally for
[Meeple & Mug](https://www.meepleandmug.com.au) in West End, Brisbane, who said yes to a
stranger with a spreadsheet.

If it saved you an afternoon, you are welcome to shout me a coffee. If you would rather I
just set the whole thing up for you, open an issue and say hello.
