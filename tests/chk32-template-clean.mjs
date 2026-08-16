// Guards the one thing a template can get wrong that its own instance never will:
// shipping somebody else's identity as a default.
//
// Pickmark was extracted from a live cafe's site. config.js was cleaned, so everything
// looked right, but the *fallbacks* still said Meeple & Mug: the BGG_USER default, the
// social meta tags, the footer links, the first-paint snapshot, and every prefilled
// field in the setup wizard including the cafe's live Google Sheet id. A fork that left
// any field blank published the cafe's details as its own.
//
// The rule this enforces: the cafe may be credited in prose, and nowhere else.
// No playwright, no server. Just reads the files.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

// The café's live sheet id is not written here. Publishing the string you are banning, in
// the public repo whose job is to not contain it, is its own small leak. Any Google sheet
// id found in a scanned file is hashed and compared instead.
const BANNED_SHEET_SHA = '1faea91b4d0e0af5f353ff854da35af4af43e045eb6d114d933354e50b770086';
const sha = (x) => createHash('sha256').update(x).digest('hex');

const FILES = [
  'index.html',
  'setup.html',
  'config.js',
  'sw.js',
  'manifest.webmanifest',
  'scripts/build-data.mjs',
  'scripts/fetch-bgg-cats.mjs',
  'data/games.json',
  'sheet-template.csv',
  'GUIDE.md',
  'SETUP.md',
];

// README.md and BRAND.md are deliberately excluded: crediting the cafe that said yes is
// the point, and prose cannot leak into a fork's output. tests/ is excluded because the
// assertions below have to name the strings they are banning.
const BANNED = [
  [/meepleandmug/i, 'the cafe domain or BGG username'],
  [/meeple\s*(&amp;|&|and)\s*mug/i, 'the cafe name'],
  [/meeple-mug-shelf-guide/i, "the cafe's repo"],
  [/Hardgrave/i, "the cafe's street address"],
];

const fail = [];
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail.push(m); };

for (const f of FILES) {
  let src;
  try { src = readFileSync(f, 'utf8'); }
  catch { ok(false, `${f} is missing`); continue; }

  const hits = [];
  for (const [re, what] of BANNED) {
    const lines = src.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) hits.push(`${f}:${i + 1} ${what}`);
    }
  }
  for (const id of src.match(/[a-zA-Z0-9-_]{40,50}/g) || []) {
    if (sha(id) === BANNED_SHEET_SHA) hits.push(`${f} contains the café's live Google Sheet id`);
  }
  ok(hits.length === 0, `${f} carries no venue identity` + (hits.length ? ` -> ${hits.slice(0, 4).join('; ')}` : ''));
}

// The shipped config must be a blank slate, not a worked example. An empty string here is
// the documented "deliberately none"; a real value would be somebody else's shelf.
const cfg = readFileSync('config.js', 'utf8');
const obj = JSON.parse(cfg.slice(cfg.indexOf('{'), cfg.lastIndexOf('}') + 1));
for (const k of ['sheetCsvUrl', 'bggUser', 'contactUrl', 'contactEmail']) {
  ok(obj[k] === '', `config.${k} ships blank`);
}

if (fail.length) { console.log('FAILURES: ' + fail.join(' | ')); process.exit(1); }
console.log('ALL PASS');
