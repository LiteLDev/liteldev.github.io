#!/usr/bin/env node
// Every browser check of the built site (`npm run build` first), in Chromium (Playwright, a devDependency:
// `npx playwright install chromium` once per machine). The site is served like GitHub Pages on free local ports.
//
//   node scripts/smoke-all.mjs               all of them
//   node scripts/smoke-all.mjs docs mods     only those
//
//   main    levimc.org's own pages, languages, blog and 404 handling                    scripts/smoke.mjs
//   chrome  the LeviMC bar, footer, theme and language on levimc.org's pages            src/kit/scripts/smoke.mjs --app
//   docs    the same, and the docs' navigation, search, tabs and copy buttons, on every docs site
//                                                                                       src/kit/scripts/smoke.mjs
//   mods    LeviMC Mods, served by its own preview (.build/mods/)                       scripts/mods/smoke.mjs
//   prefs   theme and language shared between levimc.org and a docs site, under the browser's cookie rules
//                                                                                       src/kit/tests/cross-site.e2e.mjs
//
// Exit code 1 when a check fails.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { basename, join } from 'node:path';
import { createPagesServer } from '../src/kit/scripts/serve-pages.mjs';
import { REPO, docsRoots } from './docs-sites.mjs';
import { MODS_BUILD } from './mods/run.mjs';

const GROUPS = ['main', 'chrome', 'docs', 'mods', 'prefs'];
const wanted = process.argv.slice(2);
const unknown = wanted.filter((g) => !GROUPS.includes(g));
if (unknown.length) {
  console.error(`Unknown check: ${unknown.join(', ')}. Checks: ${GROUPS.join(', ')}`);
  process.exit(2);
}
const runs = (group) => !wanted.length || wanted.includes(group);
const DIST = join(REPO, 'dist');
if (!existsSync(join(DIST, 'index.html'))) {
  console.error('dist/ holds no site: npm run build first');
  process.exit(2);
}

/** @returns {Promise<number>} a port nothing listens on */
const freePort = () =>
  new Promise((done, fail) => {
    const probe = createServer();
    probe.once('error', fail);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = /** @type {import('node:net').AddressInfo} */ (probe.address());
      probe.close(() => done(port));
    });
  });

/** @type {{ name: string, ok: boolean }[]} */
const results = [];
/** Run one check and wait for it (not spawnSync: this process serves the site meanwhile). */
async function run(name, script, ...args) {
  console.log(`
[smoke] ${name}`);
  const child = spawn(process.execPath, [join(REPO, script), ...args], { cwd: REPO, stdio: 'inherit' });
  const status = await new Promise((done) => child.once('exit', done));
  results.push({ name, ok: status === 0 });
}

const port = await freePort();
const site = createPagesServer({ dist: DIST, base: '/', log: false });
await new Promise((done) => site.listen(port, '127.0.0.1', () => done(undefined)));
const url = `http://127.0.0.1:${port}/`;
const KIT_SMOKE = 'src/kit/scripts/smoke.mjs';

if (runs('main')) await run('main', 'scripts/smoke.mjs', '--url', url);
if (runs('chrome')) {
  await run('chrome: pages', KIT_SMOKE, '--app', '--url', url, '--pages', 'about/,community/,support/', '--current', 'about');
  await run('chrome: blog', KIT_SMOKE, '--app', '--url', url, '--pages', 'blog/,blog/2023/07/31/machine-learning-killaura-detect/,blog/archives/', '--current', 'blog');
}
if (runs('docs')) for (const root of docsRoots()) await run(`docs: ${basename(root)}`, KIT_SMOKE, '--url', `${url}${basename(root)}/`);
if (runs('prefs')) await run('prefs', 'src/kit/tests/cross-site.e2e.mjs', '--app', DIST, '--docs', DIST, '--docs-base', '/lip/');
site.close();
site.closeAllConnections();

if (runs('mods')) {
  if (!existsSync(join(MODS_BUILD, 'dist/index.html'))) {
    console.error('\n[smoke] mods: .build/mods/dist/ holds no site: npm run build first');
    results.push({ name: 'mods', ok: false });
  } else {
    const modsPort = await freePort();
    const preview = spawn(process.execPath, [join(REPO, 'scripts/mods/preview.mjs'), '--port', String(modsPort)], { cwd: MODS_BUILD, stdio: 'ignore' });
    const modsUrl = `http://127.0.0.1:${modsPort}/mods/`;
    let up = false;
    for (let i = 0; i < 100 && !up; i++) {
      up = await fetch(modsUrl).then(
        (r) => r.ok,
        () => false,
      );
      if (!up) await new Promise((done) => setTimeout(done, 100));
    }
    if (up) await run('mods', 'scripts/mods/smoke.mjs', '--url', modsUrl);
    else {
      console.error('\n[smoke] mods: the preview did not start');
      results.push({ name: 'mods', ok: false });
    }
    preview.kill();
  }
}

console.log('\n[smoke] summary');
for (const r of results) console.log(`  ${r.ok ? '✔' : '✘'} ${r.name}`);
if (results.some((r) => !r.ok)) process.exitCode = 1;
