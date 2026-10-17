// Tests for scripts/build-site.mjs:  node --test scripts/
// Add --live (node scripts/build-site.test.mjs --live) to also check every redirect target on the live site.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { ASSET_BASE, forwardTable, generate, globalBar, legacyForward, legacyKey, stubFile } from './build-site.mjs';
import { MOVED_SITES, ORIGIN, PROJECT_SITES } from './legacy-redirects.mjs';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..');
const D = forwardTable();
const fwd = (path, hash = '', search = '') => legacyForward(path, search, hash, D);
const files = generate();
const L = `${ORIGIN}/LeviLaunchroid/`;

test('legacyKey normalises every URL form GitHub Pages served', () => {
  assert.equal(legacyKey(''), '');
  assert.equal(legacyKey('index'), '');
  assert.equal(legacyKey('index.html'), '');
  assert.equal(legacyKey('zh-CN/'), 'zh-cn');
  assert.equal(legacyKey('zh-CN/index.html'), 'zh-cn');
  assert.equal(legacyKey('api/hook'), 'api/hook');
  assert.equal(legacyKey('api/hook.html'), 'api/hook');
  assert.equal(legacyKey('api/hook/'), 'api/hook');
  assert.equal(legacyKey('api/hook/index.html'), 'api/hook');
  assert.equal(legacyKey('API/Hook.HTML'), 'api/hook');
  assert.equal(legacyKey('myindex'), 'myindex');
});

test('404 forwarding: preloader-android pages', () => {
  assert.equal(fwd('/preloader-android'), L);
  assert.equal(fwd('/preloader-android/'), L);
  assert.equal(fwd('/preloader-android/index.html', '#x'), `${L}#x`);
  assert.equal(fwd('/preloader-android/api/hook'), `${L}api/hook`);
  assert.equal(fwd('/preloader-android/api/hook.html', '#pl_hook'), `${L}api/hook#pl_hook`);
  assert.equal(fwd('/preloader-android/api/hook/'), `${L}api/hook`);
  assert.equal(fwd('/Preloader-Android/API/hook'), `${L}api/hook`);
  assert.equal(fwd('/preloader-android/zh-CN'), `${L}zh-CN/`);
  assert.equal(fwd('/preloader-android/zh-CN/'), `${L}zh-CN/`);
  assert.equal(fwd('/preloader-android/zh-CN/api/types-and-macros.html'), `${L}zh-CN/api/types-and-macros`);
  // guide pages moved to a different page: the old #anchor is dropped
  assert.equal(fwd('/preloader-android/guide/getting-started', '#manifest-json'), `${L}guide/developer`);
  assert.equal(fwd('/preloader-android/zh-CN/guide/compatibility.html', '#abi'), `${L}zh-CN/guide/developer`);
  // aliases and fallbacks
  assert.equal(fwd('/preloader-android/api/'), `${L}api/mod`);
  assert.equal(fwd('/preloader-android/zh-CN/guide'), `${L}zh-CN/guide/developer`);
  assert.equal(fwd('/preloader-android/appicon.png'), `${L}appicon.png`);
  assert.equal(fwd('/preloader-android/assets/app.123.js'), L);
  assert.equal(fwd('/preloader-android/zh-CN/nope/deeper'), `${L}zh-CN/`);
  assert.equal(fwd('/preloader-android/zh-cnx'), L);
  // query strings of the old site carried nothing
  assert.equal(fwd('/preloader-android/api/mod', '', '?q=1'), `${L}api/mod`);
  // percent-encoded paths
  assert.equal(fwd('/preloader%2Dandroid/api/hook'), `${L}api/hook`);
  // Object.prototype names are not pages
  assert.equal(fwd('/preloader-android/constructor'), L);
  assert.equal(fwd('/preloader-android/__proto__'), L);
  assert.equal(fwd('/preloader-android/zh-CN/hasOwnProperty'), `${L}zh-CN/`);
});

test('404 forwarding: wrongly cased project paths, nothing else', () => {
  assert.equal(fwd('/levilamina/'), `${ORIGIN}/LeviLamina/`);
  assert.equal(fwd('/levilamina'), `${ORIGIN}/LeviLamina/`);
  assert.equal(fwd('/LIP/zh-CN/user-guide.html', '#a', '?x=1'), `${ORIGIN}/lip/zh-CN/user-guide.html?x=1#a`);
  assert.equal(fwd('/legacyscriptengine/apis/'), `${ORIGIN}/LegacyScriptEngine/apis/`);
  for (const p of PROJECT_SITES) assert.equal(fwd(`/${p}/missing`), null, `${p} has the right case`);
  assert.equal(fwd('/'), null);
  assert.equal(fwd('/random/path'), null);
  assert.equal(fwd('/LiteLoader.NET/'), null);
  assert.equal(fwd('/preloader'), null);
  assert.equal(fwd('/_kit/kit.css'), null);
});

test('every old page has a redirect page with canonical, meta refresh, location.replace and a visible link', () => {
  for (const site of MOVED_SITES) {
    for (const [from, to, lang, , keepHash] of site.pages) {
      const file = stubFile(site.from, from);
      const html = files.get(file);
      assert.ok(html, `missing ${file}`);
      const url = ORIGIN + site.to + to;
      assert.match(html, new RegExp(`^<!doctype html>\\n<html lang="${lang}">`));
      assert.ok(html.includes(`<link rel="canonical" href="${url}">`), file);
      assert.ok(html.includes(`<meta http-equiv="refresh" content="0; url=${url}">`), file);
      assert.ok(html.includes(`<script>location.replace(${JSON.stringify(url)}${keepHash ? '+location.hash' : ''});</script>`), file);
      assert.ok(html.includes(`class="mc-btn mc-btn-primary" href="${url}"`), file);
      // the redirect comes before any stylesheet so it is not blocked by CSS
      assert.ok(html.indexOf('location.replace') < html.indexOf('rel="stylesheet"'), file);
      // and the 404 forwards the same old URL to the same target
      const old = site.from + from;
      assert.equal(fwd(old), url, old);
      if (from && !from.endsWith('/')) assert.equal(fwd(`${old}.html`), url, `${old}.html`);
    }
  }
  const stubs = [...files.keys()].filter((f) => f.startsWith('preloader-android/'));
  assert.equal(stubs.length, 22);
});

test('index.html redirects instantly to levimc.org and keeps its fallback text', () => {
  const html = files.get('index.html');
  const head = html.slice(0, html.indexOf('rel="stylesheet"'));
  assert.ok(head.includes('<link rel="canonical" href="https://levimc.org/">'));
  assert.ok(head.includes('<meta http-equiv="refresh" content="0; url=https://levimc.org/">'));
  assert.ok(head.includes('<script>location.replace("https://levimc.org/");</script>'));
  assert.ok(html.includes('<title>LeviMC Docs</title>'));
  assert.ok(html.includes('Redirecting to <a href="https://levimc.org/">levimc.org</a>…'));
  assert.equal(html.match(/location\.replace/g).length, 1);
});

test('404.html runs the forwarding map before rendering', () => {
  const html = files.get('404.html');
  const script = /<script>(\(function\(\)\{function legacyKey[\s\S]*?)<\/script>/.exec(html);
  assert.ok(script, 'forward script present');
  assert.ok(html.indexOf(script[0]) < html.indexOf('rel="stylesheet"'), 'before CSS');
  assert.ok(html.includes('<meta name="robots" content="noindex">'));
  const run = (pathname, hash = '') => {
    let replaced = null;
    const style = {};
    vm.runInNewContext(script[1], {
      location: { pathname, search: '', hash, href: `${ORIGIN}${pathname}${hash}`, replace: (u) => (replaced = u) },
      document: { documentElement: { style } },
      setTimeout: () => {},
    });
    return { replaced, hidden: style.visibility === 'hidden' };
  };
  assert.deepEqual(run('/preloader-android/zh-CN/api/hook.html', '#x'), { replaced: `${L}zh-CN/api/hook#x`, hidden: true });
  assert.deepEqual(run('/Levilauncher/'), { replaced: `${ORIGIN}/LeviLauncher/`, hidden: true });
  assert.deepEqual(run('/does-not-exist'), { replaced: null, hidden: false });
});

test('kit assets: every /_kit/ reference is published, nothing else', () => {
  const refs = new Set();
  for (const [f, body] of files) if (f.endsWith('.html')) for (const m of String(body).matchAll(/\/_kit\/([^"')\s?#]+)/g)) refs.add(`_kit/${m[1]}`);
  const published = [...files.keys()].filter((f) => f.startsWith('_kit/'));
  assert.deepEqual(published.sort(), [...refs].sort());
  for (const f of ['_kit/kit.css', '_kit/kit.js', '_kit/grass.svg', '_kit/icons/compass.svg', '_kit/icons/pickaxe.svg']) assert.ok(files.has(f), f);
  assert.equal(ASSET_BASE, '/_kit/');
  for (const [f, body] of files) if (f.endsWith('.html')) assert.ok(!String(body).includes('/levimc-kit/'), f);
});

test('static GlobalBar reproduces the kit rendering for current="docs"', () => {
  const kit404 = readFileSync(join(repo, 'kit/static/pages/404.html'), 'utf8');
  assert.ok(kit404.includes(globalBar('en')), 'en GlobalBar with aria-current on Docs matches kit/static/pages/404.html');
  const zh = globalBar('zh-CN', 'LeviLaunchroid');
  assert.equal(zh.match(/aria-current="page"/g).length, 3); // Docs + LeviLaunchroid in the docs menu and the "more" menu
});

test('CLI rejects a missing --out value', () => {
  assert.throws(() => execFileSync(process.execPath, [join(repo, 'scripts/build-site.mjs'), '--out'], { stdio: 'pipe' }), (e) => e.status === 2);
});

test('the committed site/ is up to date', () => {
  const out = execFileSync(process.execPath, [join(repo, 'scripts/build-site.mjs'), '--check'], { encoding: 'utf8' });
  assert.match(out, /up to date/);
});

test('live: every redirect target answers 200 with no redirect', { skip: !process.argv.includes('--live') && !process.env.LIVE }, () => {
  const targets = new Set();
  for (const site of MOVED_SITES) {
    for (const [, to] of site.pages) targets.add(ORIGIN + site.to + to);
    for (const [, to] of site.aliases ?? []) targets.add(ORIGIN + site.to + to);
    for (const [, to] of site.fallbacks ?? []) targets.add(ORIGIN + site.to + to);
  }
  for (const p of PROJECT_SITES) targets.add(`${ORIGIN}/${p}/`);
  for (const url of targets) {
    const out = execFileSync('curl', ['-s', '-o', '/dev/null', '--max-time', '30', '-w', '%{http_code} %{num_redirects} %{redirect_url}', url], { encoding: 'utf8' });
    assert.equal(out.trim(), '200 0', url);
  }
});
