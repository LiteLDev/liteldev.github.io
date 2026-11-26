#!/usr/bin/env node
// Builds levimc.org into dist/: one static site, made of
//
//   main    levimc.org itself (src/main/: home, about, community, support, the blog), its 404 page and the redirect
//           pages of the retired sites (src/legacy/)
//   mods    LeviMC Mods (src/mods/) → /mods/, /<lang>/mods/, /api/v4/mods/; and /api/v4/mc/versions/ (src/versions/)
//   docs    the docs sites (content/<Site>/, scripts/docs-sites.mjs): tutorials, FAQ and every project's docs
//   search  the site-wide search index over all of the above (scripts/search-index.mjs)
//
//   node scripts/build.mjs                 everything, in that order
//   node scripts/build.mjs main docs       only those parts (mods and docs join the dist/ that main made)
//
// LeviLamina's API reference (/LeviLamina/api/) is made by Doxygen afterwards: doxygen/build.sh.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MODS_BUILD, runMods } from './mods/run.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(REPO, 'dist');
const VITE = join(REPO, 'node_modules/vite/bin/vite.js');
const STEPS = ['main', 'mods', 'docs', 'search'];

function node(...args) {
  const r = spawnSync(process.execPath, args, { cwd: REPO, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

/** Copy a file or folder to a place in dist/ that nothing else may have written. */
function place(from, to) {
  if (existsSync(join(DIST, to))) throw new Error(`dist/${to} exists already: two builds publish it`);
  mkdirSync(dirname(join(DIST, to)), { recursive: true });
  cpSync(from, join(DIST, to), { recursive: true });
}

const steps = {
  main() {
    node(VITE, 'build', 'src/main');
    node(VITE, 'build', 'src/main', '--ssr', 'entry-server.tsx', '--outDir', join(REPO, '.kit/ssr'));
    node('src/main/prerender.mjs');
    node('src/legacy/build.mjs', 'dist');
  },
  mods() {
    runMods('build');
    // the pages and the JSON from before version 4 at /mods/, the pages in the other languages at /<lang>/mods/ (beside
    // levimc.org's own /<lang>/ pages), the JSON (version 4) at /api/v4/mods/
    place(join(MODS_BUILD, 'dist'), 'mods');
    for (const lang of readdirSync(join(MODS_BUILD, 'dist-locales'))) place(join(MODS_BUILD, 'dist-locales', lang), `${lang}/mods`);
    place(join(MODS_BUILD, 'dist-api'), 'api');
    // the release versions (kept by .github/workflows/discover.yml)
    place(join(REPO, 'src/versions/versions.json'), 'api/v4/mc/versions/index.json');
  },
  docs() {
    node('scripts/docs-sites.mjs', 'build');
    node('scripts/docs-sites.mjs', 'merge', 'dist');
  },
  search() {
    node('scripts/search-index.mjs', 'dist');
  },
};

const wanted = process.argv.slice(2);
const unknown = wanted.filter((s) => !STEPS.includes(s));
if (unknown.length) {
  console.error(`Unknown part: ${unknown.join(', ')}. Parts: ${STEPS.join(', ')}`);
  process.exit(2);
}
if (wanted.length && !wanted.includes('main') && !existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ holds no site: build main first (node scripts/build.mjs main …)');
  process.exit(2);
}
try {
  for (const step of STEPS) {
    if (wanted.length && !wanted.includes(step)) continue;
    console.log(`\n[build] ${step}`);
    steps[step]();
  }
} catch (e) {
  console.error(`[build] ${e.message}`);
  process.exit(1);
}
