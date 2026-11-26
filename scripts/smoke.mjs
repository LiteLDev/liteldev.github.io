#!/usr/bin/env node
// Browser smoke test for levimc.org (a plain Vite app on levimc-kit), served like GitHub Pages:
//
//   npm run build && npm run preview      # serve-pages.mjs on :4173
//   node scripts/smoke.mjs --url http://127.0.0.1:4173/
//
// Part of `npm run smoke` (scripts/smoke-all.mjs), which serves the site itself.
//
// The kit's own smoke test checks the unified LeviMC chrome contract (`node src/kit/scripts/smoke.mjs --app …`, see
// the README); this one checks what this site does on top: its pages and languages, the blog, the 404 handling.
// Needs Playwright's Chromium (`npx playwright install chromium`); $LEVIMC_PW_DIR names another node_modules
// directory to take Playwright from.
import { createRequire } from 'node:module';

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const base = (opt('--url', 'http://127.0.0.1:4173/') || '').replace(/\/?$/, '/');
const require = createRequire(process.env.LEVIMC_PW_DIR ? process.env.LEVIMC_PW_DIR + '/' : import.meta.url);
const { chromium } = require('playwright');

const ROUTES = ['', 'community/', 'about/', 'support/'];
const LANG = { en: 'en', zh: 'zh-Hans', 'zh-Hant': 'zh-Hant' };
/** Each language's pages: English at the site's paths, the others under their prefix (src/main/i18n/config.ts). */
const PREFIX = { en: '', zh: 'zh-Hans/', 'zh-Hant': 'zh-Hant/' };
const H1 = {
  en: { '': 'Mod Bedrock', 'community/': 'Get Involved', 'about/': 'The story of a small team.', 'support/': 'Support LeviMC' },
  zh: { '': '随心所欲', 'community/': '参与进来', 'about/': '一个小团队的故事。', 'support/': '支持 LeviMC' },
  'zh-Hant': { '': '隨心所欲', 'community/': '參與進來', 'about/': '一個小團隊的故事。', 'support/': '支持 LeviMC' },
};

/** The window of a page, with the mark that a full page load would wipe. @typedef {Window & { __lmMarker?: number }} MarkedWindow */

const results = [];
const check = async (name, fn) => {
  try {
    const detail = await fn();
    results.push({ name, ok: true });
    console.log(`  ✔ ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (e) {
    results.push({ name, ok: false });
    console.log(`  ✘ ${name} — ${String(e?.message ?? e).split('\n')[0]}`);
  }
};
const assert = (c, msg) => {
  if (!c) throw new Error(msg);
};

// LEVIMC_CHROME: a browser executable to use instead of Playwright's own download (e.g. an installed Chrome).
// Use the environment's proxy when there is one (for the live-data checks); loopback always goes direct.
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;
const browser = await chromium.launch({
  executablePath: process.env.LEVIMC_CHROME || undefined,
  ...(proxy ? { proxy: { server: proxy, bypass: '<-loopback>,localhost,127.0.0.1' } } : {}),
});
/** @param {{ locale?: string, width?: number, height?: number, scheme?: 'light' | 'dark', mobile?: boolean, userAgent?: string }} [options] */
const newContext = async ({ locale, width = 1440, height = 900, scheme = 'light', mobile = false, userAgent } = {}) => {
  const ctx = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, userAgent });
  // the visitor's cross-site LeviMC language preference (cookie levimc_lang, host-only on 127.0.0.1)
  if (locale) await ctx.addCookies([{ name: 'levimc_lang', value: LANG[locale] ?? locale, url: base }]);
  return ctx;
};
// Third-party hosts whose failures the site tolerates: web fonts, GitHub avatars and the blog's comments (Waline).
// The site shows no live data: nothing else is fetched from another host.
const TOLERATED = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|avatars\.githubusercontent\.com|waline\.levimc\.org|unpkg\.com)\//;
const watch = (page) => {
  const errs = [];
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    // Chromium's "Failed to load resource" text has no URL; the request listeners below report it with one
    if (/^Failed to load resource/.test(m.text())) return;
    errs.push(`${m.type()}: ${m.text()}`);
  });
  page.on('requestfailed', (r) => {
    if (!TOLERATED.test(r.url())) errs.push(`request failed: ${r.url()} (${r.failure()?.errorText})`);
  });
  page.on('response', (r) => {
    // the page's own status is asserted by each check (the 404 page answers 404 on purpose)
    if (r.request().isNavigationRequest() && r.request().frame() === page.mainFrame()) return;
    if (r.status() >= 400 && !TOLERATED.test(r.url())) errs.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  return errs;
};

console.log(`smoke: ${base}`);

for (const locale of ['en', 'zh', 'zh-Hant']) {
  await check(`/${PREFIX[locale]}…: every route renders in ${locale} (200, h1, lang, nothing hidden, no console/hydration errors, no sideways scroll)`, async () => {
    // a stored preference of another language never changes a Chinese URL (and / redirects only by it)
    const ctx = await newContext({ locale: locale === 'en' ? undefined : 'en' });
    for (const r of ROUTES) {
      for (const width of [1440, 390]) {
        const page = await ctx.newPage();
        await page.setViewportSize({ width, height: 900 });
        const errs = watch(page);
        const res = await page.goto(base + PREFIX[locale] + r, { waitUntil: 'networkidle' });
        assert(res?.status() === 200, `${r || '/'} → ${res?.status()}`);
        const h1 = (await page.locator('h1').first().innerText()).replace(/\s+/g, ' ').trim();
        assert(h1.startsWith(H1[locale][r]), `${r || '/'}: h1 "${h1}"`);
        const state = await page.evaluate(() => ({ path: location.pathname, lang: document.documentElement.lang, pending: /kit-(content|chrome)-pending/.test(document.documentElement.className), sideways: document.documentElement.scrollWidth > window.innerWidth + 1 }));
        assert(state.path === '/' + PREFIX[locale] + r, `${r || '/'}: moved to ${state.path}`);
        assert(state.lang === LANG[locale], `${r || '/'}: <html lang="${state.lang}">`);
        assert(!state.pending, `${r || '/'}: page hidden (kit-*-pending)`);
        assert(!state.sideways, `${r || '/'}: horizontal scroll at ${width}px`);
        assert(!errs.length, `${r || '/'} @${width}: ${errs.join(' | ')}`);
        await page.close();
      }
    }
    await ctx.close();
    return `${ROUTES.length} routes × 2 widths`;
  });
}

await check('prerendered HTML: every route in every language is real static HTML with lang, canonical, hreflang, description and content', async () => {
  for (const locale of Object.keys(PREFIX)) {
    for (const r of ROUTES) {
      const path = PREFIX[locale] + r;
      const html = await (await fetch(base + path)).text();
      assert(html.includes(`<html lang="${LANG[locale]}"`), `${path || '/'}: <html lang>`);
      assert(html.includes(`<link rel="canonical" href="https://levimc.org/${path}"`), `${path || '/'}: canonical`);
      for (const l of Object.keys(PREFIX)) assert(html.includes(`<link rel="alternate" hreflang="${LANG[l]}" href="https://levimc.org/${PREFIX[l]}${r}"`), `${path || '/'}: hreflang ${LANG[l]}`);
      assert(html.includes(`<link rel="alternate" hreflang="x-default" href="https://levimc.org/${r}"`), `${path || '/'}: x-default`);
      assert(/<meta name="description" content="[^"]+"/.test(html), `${path || '/'}: description`);
      assert(!/class="[^"]*kit-(content|chrome)-pending/.test(html), `${path || '/'}: hidden until hydrated`);
      assert(html.includes(H1[locale][r].replace(/&/g, '&amp;').replace(/'/g, '&#x27;')), `${path || '/'}: h1 text not in the static HTML`);
    }
  }
  const support = await (await fetch(base + 'support/')).text();
  const csv = await (await fetch(base + 'donors.csv')).text();
  const rows = csv.split(/\r?\n/).filter((l) => l.trim()).length - 1;
  const cards = (support.match(/class="lm-donor"/g) || []).length;
  assert(cards === rows, `support/: ${cards} donor cards prerendered, donors.csv has ${rows} rows`);
  return `${ROUTES.length} routes × ${Object.keys(PREFIX).length} languages; ${cards} supporters prerendered`;
});

await check('unknown path → 404 status, themed page, in the language of the URL', async () => {
  for (const locale of ['en', 'zh']) {
    const ctx = await newContext();
    const page = await ctx.newPage();
    const errs = watch(page);
    const res = await page.goto(base + PREFIX[locale] + 'no/such/page/', { waitUntil: 'networkidle' });
    assert(res?.status() === 404, `status ${res?.status()}`);
    await page.waitForSelector('.kit-notfound');
    const title = await page.locator('.kit-notfound-title').innerText();
    assert(locale === 'zh' ? title.includes('走丢') : title.includes('wandered off'), `${locale}: "${title}"`);
    assert(!errs.length, errs.join(' | '));
    await ctx.close();
  }
  return 'en + zh';
});

await check('/index.html and /<route>/index.html show their page at the canonical URL (no 404, no hydration error)', async () => {
  const ctx = await newContext();
  for (const [path, r] of [['index.html', ''], ['about/index.html', 'about/'], ['community/index.html?ref=x#top', 'community/'], ['support//', 'support/']]) {
    const page = await ctx.newPage();
    const errs = watch(page);
    const res = await page.goto(base + path, { waitUntil: 'networkidle' });
    assert(res?.status() === 200, `${path} → ${res?.status()}`);
    const h1 = (await page.locator('h1').first().innerText()).replace(/\s+/g, ' ').trim();
    assert(h1.startsWith(H1.en[r]), `${path}: h1 "${h1}"`);
    assert(!(await page.title()).startsWith('Page not found'), `${path}: title "${await page.title()}"`);
    const u = new URL(page.url());
    assert(u.pathname === new URL(base + r).pathname, `${path}: URL ${u.pathname}`);
    if (path.includes('?')) assert(u.search === '?ref=x' && u.hash === '#top', `${path}: query/hash lost (${u.search}${u.hash})`);
    assert(!errs.length, `${path}: ${errs.join(' | ')}`);
    await page.close();
  }
  await ctx.close();
  return '/index.html, /about/index.html, /community/index.html?…#…, /support//';
});

await check('client-side navigation from the header (no full reload, canonical URL)', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => (/** @type {MarkedWindow} */ (window).__lmMarker = 1));
  await page.click('.kit-gbar-nav a[href="/community/"]');
  await page.waitForURL((u) => u.pathname === '/community/');
  await page.waitForSelector('h1:has-text("Get Involved")');
  assert((await page.evaluate(() => /** @type {MarkedWindow} */ (window).__lmMarker)) === 1, 'page reloaded');
  await page.click('.kit-gbar-nav a[href="/about/"]');
  await page.waitForURL((u) => u.pathname === '/about/');
  assert((await page.evaluate(() => /** @type {MarkedWindow} */ (window).__lmMarker)) === 1, 'page reloaded');
  assert(!errs.length, errs.join(' | '));
  await ctx.close();
  return '/ → /community/ → /about/';
});

await check('theme menu: Auto (default) / Light / Dark, stored in the cross-site cookie levimc_theme, survives reload', async () => {
  const ctx = await newContext({ scheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const pref = () => page.evaluate(() => ({ pref: document.documentElement.getAttribute('data-theme-pref'), dark: document.documentElement.classList.contains('dark') }));
  const s0 = await pref();
  assert(s0.pref === 'auto' && s0.dark, `default ${JSON.stringify(s0)} (expected Auto following the dark system theme)`);
  await page.click('[data-kit-theme-toggle]');
  await page.click('[data-kit-theme-value="light"]');
  const s1 = await pref();
  assert(s1.pref === 'light' && !s1.dark, `after Light: ${JSON.stringify(s1)}`);
  const cookie = (await ctx.cookies()).find((c) => c.name === 'levimc_theme');
  assert(cookie?.value === 'light', `cookie levimc_theme=${cookie?.value}`);
  // the cookie alone decides after a reload (localStorage cleared)
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  const s2 = await pref();
  assert(s2.pref === 'light' && !s2.dark, `after reload: ${JSON.stringify(s2)}`);
  await ctx.close();
  return 'auto (dark system) → light → cookie → reload → light';
});

await check('legacy localStorage "theme" is migrated once to the cross-site theme before first paint', async () => {
  const ctx = await newContext({ scheme: 'light' });
  await ctx.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('theme', 'dark');
    }
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const s = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), kit: localStorage.getItem('levimc-theme'), old: localStorage.getItem('theme') }));
  const cookie = (await ctx.cookies()).find((c) => c.name === 'levimc_theme')?.value;
  assert(s.dark && s.kit === 'dark' && s.old === null && cookie === 'dark', JSON.stringify({ ...s, cookie }));
  await ctx.close();
  return 'theme=dark → cookie levimc_theme=dark';
});

await check('legacy localStorage "locale" = zh is migrated once to the cross-site language (zh-Hans), and / follows it', async () => {
  const ctx = await newContext();
  await ctx.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('locale', 'zh');
    }
  });
  const page = await ctx.newPage();
  await page.goto(base + 'community/', { waitUntil: 'networkidle' });
  const cookie = (await ctx.cookies()).find((c) => c.name === 'levimc_lang')?.value;
  const old = await page.evaluate(() => localStorage.getItem('locale'));
  assert(cookie === 'zh-Hans' && old === null, JSON.stringify({ cookie, old }));
  // a deep link is shown as asked; the root goes to the stored language
  assert(new URL(page.url()).pathname === '/community/', `moved to ${page.url()}`);
  await page.goto(base, { waitUntil: 'networkidle' });
  assert(new URL(page.url()).pathname === '/zh-Hans/', `/ → ${page.url()}`);
  await ctx.close();
  return 'locale=zh → cookie levimc_lang=zh-Hans; / → /zh-Hans/';
});

await check('language switcher: links to the same page in the other language, stored in the cross-site cookie levimc_lang', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base + 'community/', { waitUntil: 'networkidle' });
  await page.evaluate(() => (/** @type {MarkedWindow} */ (window).__lmMarker = 1));
  assert((await page.locator('[data-kit-locale-switcher]').innerText()).trim() === 'English', 'trigger label is not "English"');
  await page.click('[data-kit-locale-switcher]');
  await page.click('.kit-locale [role="menuitemradio"][data-locale="zh-Hans"]');
  await page.waitForURL((u) => u.pathname === '/zh-Hans/community/');
  await page.waitForFunction(() => document.documentElement.lang === 'zh-Hans');
  assert((await page.evaluate(() => /** @type {MarkedWindow} */ (window).__lmMarker)) === 1, 'page reloaded');
  assert((await page.locator('[data-kit-locale-switcher]').innerText()).trim() === '简体中文', 'trigger label is not "简体中文"');
  assert(!(await page.locator('.kit-locale').evaluate((/** @type {HTMLDetailsElement} */ d) => d.open)), 'language menu still open');
  await page.waitForFunction(() => document.querySelector('h1')?.textContent.includes('参与进来'), null, { timeout: 5000 });
  assert((await page.locator('.lm-qq-group').count()) === 3, 'QQ groups missing in zh');
  assert((await ctx.cookies()).find((c) => c.name === 'levimc_lang')?.value === 'zh-Hans', 'not stored in the cookie');
  await page.reload({ waitUntil: 'networkidle' });
  assert((await page.locator('h1').innerText()).includes('参与进来'), 'not kept after reload');
  // links keep the language
  await page.click('.kit-gbar-nav a[href="/zh-Hans/about/"]');
  await page.waitForURL((u) => u.pathname === '/zh-Hans/about/');
  await page.waitForFunction(() => document.title === '关于 - LeviMC', null, { timeout: 5000 });
  await page.click('[data-kit-locale-switcher]');
  await page.click('.kit-locale [role="menuitemradio"][data-locale="en"]');
  await page.waitForURL((u) => u.pathname === '/about/');
  await page.waitForFunction(() => document.documentElement.lang === 'en');
  assert((await ctx.cookies()).find((c) => c.name === 'levimc_lang')?.value === 'en', 'English not stored');
  assert(!errs.length, errs.join(' | '));
  await ctx.close();
  return '/community/ → 中文 /zh-Hans/community/ → reload → /zh-Hans/about/ → English /about/';
});

await check('root redirect: / follows the stored language, else the browser language; deep links never redirect', async () => {
  /** @type {[{ locale?: string, browserLocale?: string }, string, string][]} */
  const cases = [
    [{ locale: 'zh' }, '', '/zh-Hans/'],
    [{ browserLocale: 'zh-TW' }, '', '/zh-Hant/'],
    [{ locale: 'en', browserLocale: 'zh-CN' }, '', '/'],
    [{ locale: 'de' }, '', '/'],
    [{ locale: 'zh' }, 'about/', '/about/'],
    [{ browserLocale: 'zh-CN' }, 'blog/', '/blog/'],
  ];
  for (const [o, path, want] of cases) {
    const ctx = o.browserLocale ? await browser.newContext({ locale: o.browserLocale }) : await newContext();
    if (o.locale) await ctx.addCookies([{ name: 'levimc_lang', value: LANG[o.locale] ?? o.locale, url: base }]);
    const page = await ctx.newPage();
    await page.goto(base + path, { waitUntil: 'networkidle' });
    const got = new URL(page.url()).pathname;
    assert(got === want, `${JSON.stringify(o)} /${path} → ${got}, expected ${want}`);
    await ctx.close();
  }
  return `${cases.length} cases`;
});

await check('hero roles ("I want to…"): three rows at once, each leads to an Install page; no download button; #hash picks the card', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  const rows = page.locator('.lm-roles .lm-path');
  assert((await rows.count()) === 3, 'expected 3 rows');
  for (let i = 0; i < 3; i++) assert(await rows.nth(i).isVisible(), `row ${i} is not visible`);
  const go = (/** @type {string} */ role) => page.locator(`.lm-path[data-role="${role}"] .lm-path-go`);
  const pathOf = async (/** @type {string} */ role) => new URL((await go(role).getAttribute('href')) ?? '', base).pathname;
  assert((await go('play').innerText()).includes('Install LeviLauncher'), 'no "Install LeviLauncher"');
  assert((await pathOf('play')) === '/LeviLauncher/install', `play leads to ${await pathOf('play')}`);
  assert((await go('host').innerText()).includes('Install lip'), 'no "Install lip"');
  assert((await pathOf('host')) === '/lip/install.html', `host leads to ${await pathOf('host')}`);
  assert((await go('develop').innerText()).includes('Create your first mod'), 'no developer action');
  // the home page starts no download: no filled button in the hero, no link to a release's files
  assert((await page.locator('.lm-hero .mc-btn-primary').count()) === 0, 'a primary button in the hero');
  assert((await page.locator('.lm-hero a[href*="/releases/latest/download/"]').count()) === 0, 'a direct download in the hero');
  // the card beside the list: LeviLauncher by default, lip for #host, and the row a visitor points at
  const aside = page.locator('.kit-hero-aside');
  assert((await aside.innerText()).includes('Windows · Android'), 'no LeviLauncher introduction by default');
  await page.goto(base + '#host', { waitUntil: 'networkidle' });
  assert((await aside.innerText()).includes('Windows · Linux · macOS'), 'no lip introduction for #host');
  assert((await page.locator('.lm-path[data-role="host"]').getAttribute('data-current')) !== null, '#host is not the current row');
  await page.locator('.lm-path[data-role="develop"]').hover();
  await page.waitForSelector('.kit-hero-aside [role="tab"]', { timeout: 5000 });
  assert(!errs.length, errs.join(' | '));
  await ctx.close();
  return 'play, host, develop → Install pages; #host and hover pick the card';
});

await check('hero roles: the three rows fit a phone (390px), in one column', async () => {
  const ctx = await newContext({ width: 390, height: 844, mobile: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36' });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  const rows = page.locator('.lm-roles .lm-path');
  assert((await rows.count()) === 3, 'expected 3 rows');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert(overflow <= 0, `the page scrolls sideways by ${overflow}px`);
  const first = page.locator('.lm-path[data-role="play"] .lm-path-go');
  assert(new URL((await first.getAttribute('href')) ?? '', base).pathname === '/LeviLauncher/install', 'play does not lead to the Install page');
  await ctx.close();
  return '3 rows, no sideways scroll';
});

await check('no live data: the home and community pages ask no other host for data', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  /** @type {string[]} */
  const asked = [];
  page.on('request', (r) => {
    const u = new URL(r.url());
    // the site's own files (absolute https://levimc.org/… URLs of the kit's registry), fonts and avatars are no data
    if (u.origin !== new URL(base).origin && !/^(levimc\.org|fonts\.googleapis\.com|fonts\.gstatic\.com|avatars\.githubusercontent\.com)$/.test(u.hostname)) asked.push(r.url());
  });
  for (const path of ['', 'community/']) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    // what used to start when the main thread was idle
    await page.waitForTimeout(2500);
  }
  await ctx.close();
  assert(!asked.length, `requests to other hosts: ${asked.join(', ')}`);
  return 'home, community: none';
});

await check('hero code tabs (hotbar, developers): click and arrow keys switch the sample', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  await page.goto(base + '#develop', { waitUntil: 'networkidle' });
  const tabs = page.locator('.kit-hero-aside [role="tab"]');
  const sample = page.locator('.kit-hero-aside [role="tabpanel"]');
  assert((await tabs.count()) === 3, 'expected 3 tabs');
  await tabs.nth(1).click();
  assert((await tabs.nth(1).getAttribute('aria-selected')) === 'true', 'second tab not selected');
  assert((await sample.innerText()).includes('mc.listen("onJoin", (player) => {'), 'JS sample not shown');
  await tabs.nth(1).press('ArrowRight');
  assert((await tabs.nth(2).getAttribute('aria-selected')) === 'true', 'ArrowRight did not move to main.lua');
  assert((await sample.innerText()).includes('player:tell("Welcome!")'), 'Lua sample not shown');
  await ctx.close();
  return 'main.cpp → main.js → main.lua';
});

await check('mobile (390px): the bar folds its entries into its menu; it closes on Escape and after navigating', async () => {
  const ctx = await newContext({ width: 390, height: 844, mobile: true });
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base, { waitUntil: 'networkidle' });
  assert(!(await page.locator('.kit-gbar-nav').isVisible()), 'inline nav still visible');
  const toggle = page.locator('.kit-gbar-more > summary');
  assert(await toggle.isVisible(), 'menu button hidden');
  await toggle.click();
  const panel = page.locator('.kit-gbar-more-panel');
  await panel.waitFor({ state: 'visible' });
  const labels = await panel.locator('.kit-gbar-more-link').allInnerTexts();
  assert(labels.join('|') === 'Home|Tutorials|FAQ|Projects|Mods|Blog|Community|About', `menu entries: ${labels.join('|')}`);
  await page.keyboard.press('Escape');
  await panel.waitFor({ state: 'hidden' });
  assert(await page.evaluate(() => !!document.activeElement?.closest('.kit-gbar-more')), 'focus not returned to the menu button');
  await page.evaluate(() => (/** @type {MarkedWindow} */ (window).__lmMarker = 1));
  await toggle.click();
  await page.click('.kit-gbar-more-panel a[href="/about/"]');
  await page.waitForURL((u) => u.pathname === '/about/');
  await panel.waitFor({ state: 'hidden' });
  assert((await page.evaluate(() => /** @type {MarkedWindow} */ (window).__lmMarker)) === 1, 'page reloaded');
  assert(!errs.length, errs.join(' | '));
  await ctx.close();
  return 'ok';
});

await check('header: one bar, every destination once; Projects menu opens; cross-site links are canonical', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  await page.goto(base + 'about/', { waitUntil: 'networkidle' });
  assert((await page.locator('[data-kit-globalbar]').count()) === 1, 'expected one GlobalBar');
  const hrefs = await page.locator('[data-kit-globalbar] .kit-gbar-nav > ul > li > a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  assert(new Set(hrefs).size === hrefs.length, `duplicate destinations: ${hrefs.join(' ')}`);
  assert(hrefs.includes('/blog/'), `Blog is not an in-site link: ${hrefs.join(' ')}`);
  assert((await page.locator('[data-kit-globalbar] .kit-gbar-github[href="https://github.com/LiteLDev"]').count()) === 1, 'GitHub button missing or repeated');
  assert((await page.locator('[data-kit-globalbar] .kit-gbar-brand .kit-brand-mark').count()) === 1, 'LeviMC mark missing from the bar');
  assert((await page.locator('.kit-gbar-link[aria-current="page"]').innerText()) === 'About', 'About not current');
  await page.click('.kit-gbar-projects > summary');
  const panel = page.locator('.kit-gbar-projects-panel');
  assert(await panel.locator('a.kit-proj-main[href="https://levimc.org/LeviLamina/"]').isVisible(), 'LeviLamina leads to its docs');
  assert((await panel.locator('a.kit-proj-main').evaluateAll((/** @type {HTMLAnchorElement[]} */ as) => as.every((a) => /^https:\/\/levimc\.org\/(LeviLamina|LegacyScriptEngine|lip|LeviLauncher|BeDD|bedboo)\/$/.test(a.href)))), 'Projects menu lists a project without docs');
  assert((await panel.locator('.kit-proj-link').count()) === 0, 'Projects menu rows carry extra links');
  await page.keyboard.press('Escape');
  await ctx.close();
  return 'ok';
});

await check('header fits: inline tabs from 961 px up (en, zh) with room before the controls; folded below', async () => {
  const seen = [];
  for (const locale of ['en', 'zh']) {
    for (const width of [960, 961, 1100, 1280]) {
      const ctx = await newContext({ width });
      const page = await ctx.newPage();
      await page.goto(base + PREFIX[locale], { waitUntil: 'networkidle' });
      const s = await page.evaluate(() => {
        const inner = /** @type {Element} */ (document.querySelector('.kit-gbar-inner'));
        const nav = /** @type {Element} */ (document.querySelector('.kit-gbar-nav'));
        const end = /** @type {Element} */ (document.querySelector('.kit-gbar-end'));
        const shown = getComputedStyle(nav).display !== 'none';
        return { shown, overflow: inner.scrollWidth > inner.clientWidth, room: shown ? Math.round(end.getBoundingClientRect().left - nav.getBoundingClientRect().right) : null };
      });
      assert(!s.overflow, `${locale}@${width}: the bar overflows`);
      assert(s.shown === width > 960, `${locale}@${width}: inline nav ${s.shown ? 'shown' : 'hidden'}`);
      if (s.shown) {
        assert(/** @type {number} */ (s.room) >= 16, `${locale}@${width}: only ${s.room}px between the tabs and the controls`);
        seen.push(`${locale}@${width} ${s.room}px`);
      }
      await ctx.close();
    }
  }
  return `room left: ${seen.join(', ')}`;
});


// ------------------------------------------------------------------ the blog (/blog/)
const sitemap = await (await fetch(base + 'sitemap.xml')).text();
const BLOG = [...sitemap.matchAll(/<loc>https:\/\/levimc\.org(\/blog\/[^<]*)<\/loc>/g)].map((m) => decodeURI(m[1]));

await check('blog: every blog URL in the sitemap is prerendered (200, h1, zh-CN content) and hydrates cleanly', async () => {
  assert(BLOG.length >= 15, `only ${BLOG.length} blog URLs in sitemap.xml`);
  const ctx = await newContext();
  for (const path of BLOG) {
    const page = await ctx.newPage();
    const errs = watch(page);
    const res = await page.goto(base + path.slice(1), { waitUntil: 'networkidle' });
    assert(res?.status() === 200, `${path} → ${res?.status()}`);
    assert((await page.locator('h1').count()) === 1, `${path}: ${await page.locator('h1').count()} h1`);
    assert(!(await page.title()).startsWith('Page not found'), `${path}: 404 title`);
    if (/\/\d{4}\/\d{2}\/\d{2}\//.test(path)) {
      assert((await page.locator('[data-doc-content][lang="zh-CN"]').count()) === 1, `${path}: post content not marked zh-CN`);
      // a post is shown in its own language (it has one URL): the chrome is Chinese
      assert((await page.locator('.kit-gbar-link[aria-current="page"]').innerText()) === '博客', `${path}: Blog tab not current`);
      assert((await page.evaluate(() => document.documentElement.lang)) === 'zh-Hans', `${path}: <html lang> is not the post's`);
    }
    assert(!errs.length, `${path}: ${errs.join(' | ')}`);
    await page.close();
  }
  await ctx.close();
  return `${BLOG.length} URLs`;
});

await check('blog: old Hexo permalinks, tag/category slugs and archives are kept under /blog/', async () => {
  for (const p of [
    'blog/2023/07/31/machine-learning-killaura-detect/',
    'blog/2023/07/31/machine-learning-killaura-detect/',
    
    'blog/tags/Bedrock-Dedicated-Server/',
    'blog/tags/LeviLamina/',
    'blog/tags/LiteLoaderBDS/',
    'blog/categories/Bedrock-Dedicated-Server/',
    'blog/archives/2023/07/',
    'blog/archives/2024/',
    'blog/about/',
    'blog/friends/',
  ]) {
    const r = await fetch(base + p, { redirect: 'manual' });
    assert(r.status === 200, `${p} → ${r.status}`);
  }
  const html = await (await fetch(base + 'blog/2023/07/31/machine-learning-killaura-detect/')).text();
  assert(html.includes('<details>') && html.includes('当时的崩服Log:'), 'the <details> block is not rendered');
  assert(html.includes('<del>再加上当初闲得无聊</del>'), 'strikethrough missing');
  assert(/id="起因"/.test(html), 'old heading id #起因 missing');
  const ml = await (await fetch(base + 'blog/2023/07/31/machine-learning-killaura-detect/')).text();
  assert(ml.includes('src="/blog/images/2023/07/31/3RwnGp9VqgZby8t.jpg"') && ml.includes('alt="MATLAB绘制的散点图"'), 'image not self-hosted');
  assert((await fetch(base + 'blog/images/2023/07/31/3RwnGp9VqgZby8t.jpg')).status === 200, 'self-hosted image missing');
  return 'posts, tags, categories, archives, pages';
});

await check('blog: feeds (rss.xml, atom.xml, feed.json) list the latest posts with absolute links; <link rel="alternate">', async () => {
  // Feeds publish at most the latest 20 posts (src/main/blog/feeds.ts).
  const expectedItems = Math.min(BLOG.filter((path) => /^\/blog\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/.test(path)).length, 20);
  const rss = await (await fetch(base + 'blog/rss.xml')).text();
  const items = (rss.match(/<item>/g) || []).length;
  assert(items === expectedItems, `rss.xml: ${items} items`);
  assert(rss.includes('<link>https://levimc.org/blog/2023/07/31/machine-learning-killaura-detect/</link>'), 'rss link');
  assert(!/(src|href)="[/#](?!\/)/.test(rss.replace(/<!\[CDATA\[|\]\]>/g, '')), 'relative URL or bare #anchor in rss.xml');
  for (const item of rss.split('<item>').slice(1)) {
    const cats = [...item.matchAll(/<category>([^<]*)<\/category>/g)].map((m) => m[1]);
    assert(new Set(cats).size === cats.length, `rss.xml: repeated <category> in ${cats.join(', ')}`);
  }
  const atom = await (await fetch(base + 'blog/atom.xml')).text();
  assert((atom.match(/<entry>/g) || []).length === expectedItems, 'atom.xml entries');
  for (const entry of atom.split('<entry>').slice(1)) {
    const terms = [...entry.matchAll(/<category term="([^"]*)"/g)].map((m) => m[1]);
    assert(new Set(terms).size === terms.length, `atom.xml: repeated category in ${terms.join(', ')}`);
  }
  const json = await (await fetch(base + 'blog/feed.json')).json();
  assert(json.items.length === expectedItems, 'feed.json items');
  for (const it of json.items) assert(new Set(it.tags).size === it.tags.length, `feed.json: repeated tag in ${it.tags}`);
  // a post hydrates after its markdown chunk: the prerendered page preloads it
  const post = await (await fetch(base + 'blog/2023/07/31/machine-learning-killaura-detect/')).text();
  assert(/<link rel="modulepreload" crossorigin href="\/assets\/blog\/_levimc-blog-doc_machine-learning-killaura-detect\.[^"]+\.js">/.test(post), 'post chunk not modulepreloaded');
  // the old blog's assets keep their paths under /blog/
  for (const a of ['avatar.png', 'icon.png', 'favicon.ico']) assert((await fetch(base + 'blog/assets/' + a)).status === 200, `blog/assets/${a}`);
  const home = await (await fetch(base + 'blog/')).text();
  assert(home.includes('<link rel="alternate" type="application/rss+xml"'), 'no rss <link rel="alternate">');
  assert(sitemap.includes('<loc>https://levimc.org/blog/</loc>'), 'blog not in sitemap.xml');
  const robots = await (await fetch(base + 'robots.txt')).text();
  assert(robots.includes('Sitemap: https://levimc.org/sitemap.xml'), 'robots.txt');
  return `${items} posts in each feed`;
});

await check('blog: navigating between posts stays in the app and loads the next post', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  const errs = watch(page);
  await page.goto(base + 'blog/', { waitUntil: 'networkidle' });
  await page.evaluate(() => (/** @type {MarkedWindow} */ (window).__lmMarker = 1));
  await page.click('.lm-blog-card-title a[href="/blog/2023/07/31/machine-learning-killaura-detect/"]');
  await page.waitForURL((u) => u.pathname === '/blog/2023/07/31/machine-learning-killaura-detect/');
  await page.waitForSelector('[data-doc-content] h2#引言');
  await page.click('.lm-blog-pager a[rel="prev"]');
  await page.waitForURL((u) => u.pathname === '/blog/2023/07/31/machine-learning-killaura-detect/');
  await page.waitForSelector('[data-doc-content] h3#起因');
  assert((await page.evaluate(() => /** @type {MarkedWindow} */ (window).__lmMarker)) === 1, 'page reloaded');
  await page.waitForFunction(() => document.title.startsWith('蜂巢崩服问题的解决'), null, { timeout: 5000 });
  assert(!errs.length, errs.join(' | '));
  await ctx.close();
  return 'index → post → previous post';
});

await check('blog: Waline comments of the old blog load (old path as the key)', async () => {
  const ctx = await newContext();
  const page = await ctx.newPage();
  await page.goto(base + 'blog/2023/07/31/machine-learning-killaura-detect/', { waitUntil: 'networkidle' });
  await page.locator('.lm-blog-comments').scrollIntoViewIfNeeded();
  try {
    await page.waitForSelector('.wl-card-item', { timeout: 20000 });
  } catch {
    await ctx.close();
    return 'skipped: waline.levimc.org not reachable from here';
  }
  const n = await page.locator('.wl-card-item').count();
  assert(n >= 1, 'no comments');
  await ctx.close();
  return `${n} comments`;
});

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\nsmoke: ${results.length - failed.length}/${results.length} passed`);
if (failed.length) process.exitCode = 1;
