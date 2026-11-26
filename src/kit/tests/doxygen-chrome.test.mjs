// static/doxygen/gen-header.mjs: the header with the chrome inline, and the one that writes it from a shared script
// (renderDoxygenChrome), which must give the parser exactly the same HTML.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { renderDoxygenChrome, renderDoxygenHeader } from '../../../doxygen/gen-header.mjs';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const parts = JSON.parse(read('../../../doxygen/header-parts.json'));
const footerSrc = read('../../../doxygen/footer.html');
const source = 'the kit fallback nav (build-static.mjs)';
const LOGO_TOKEN = '$relpath^$projectlogo';

/** What Doxygen makes of a template: the logo's block kept (or dropped) and its path filled in. */
const doxygen = (html, logo) =>
  html.replace(/<!--BEGIN PROJECT_LOGO-->([\s\S]*?)<!--END PROJECT_LOGO-->/g, (_, b) => (logo ? b : '')).split(LOGO_TOKEN).join(logo);

/** Load the chrome script in a context whose document.write collects what it writes. */
function loadScript(script) {
  const out = { html: '' };
  const root = { classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, setAttribute() {}, getAttribute: () => null, style: {} };
  const ctx = {
    document: { write: (h) => (out.html += h), documentElement: root, cookie: '' },
    location: { hostname: 'levimc.org', search: '' },
    navigator: { languages: ['en'], language: 'en' },
    matchMedia: () => ({ matches: false }),
    localStorage: null,
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(script, ctx);
  /** the page with each kitDoxChrome(...) call replaced by what it writes */
  const run = (html) =>
    html.replace(/<script type="text\/javascript">(kitDoxChrome\([^<]*\))<\/script>/g, (_, call) => {
      out.html = '';
      vm.runInContext(call, ctx);
      return out.html;
    });
  return run;
}

test('renderDoxygenHeader: the inline header is the one build-static wrote (static/doxygen/header.html)', () => {
  assert.equal(renderDoxygenHeader(parts.fallbackNav, parts, { source }), read('../../../doxygen/header.html'));
});

for (const logo of ['../../logo.svg', '']) {
  test(`renderDoxygenChrome: the pages get the inline header's HTML (${logo ? 'with' : 'without'} a logo)`, () => {
    const r = renderDoxygenChrome(parts.fallbackNav, parts, { source, footer: footerSrc });
    const run = loadScript(r.script);
    const inline = renderDoxygenHeader(parts.fallbackNav, parts, { source });
    const head = '<script type="text/javascript" src="$relpath^kit-dox-chrome.js"></script>';
    assert.ok(r.header.includes(head), 'the head loads the script where the theme init was');
    const written = run(doxygen(r.header, logo)).replace(head, `<script type="text/javascript">${parts.themeInit}</script>`);
    assert.equal(written, doxygen(inline, logo));
    assert.equal(run(r.footer), footerSrc);
    assert.ok(r.header.length < 4000 && /** @type {string} */ (r.footer).length < 1200, 'the chrome is not in the page');
  });
}

test('renderDoxygenChrome: the script name, no footer, and a footer it cannot split', () => {
  const r = renderDoxygenChrome(parts.fallbackNav, parts, { script: 'chrome.js' });
  assert.ok(r.header.includes('src="$relpath^chrome.js"'));
  assert.equal(r.footer, undefined);
  assert.ok(!r.script.includes('kit-footer'), 'without a footer the script carries none');
  assert.throws(() => renderDoxygenChrome(parts.fallbackNav, parts, { footer: '</body>' }), /kit-dox-footer/);
});
