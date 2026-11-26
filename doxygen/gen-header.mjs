#!/usr/bin/env node
// Renders the Doxygen HTML_HEADER of a docs site's API reference (LeviLamina) from the docs build's navigation
// (dist/_kit/nav.json, written by the kit docs engine for every docs build), so the API pages carry exactly the
// docs pages' chrome: the LeviMC bar (its language menu lists the docs' locales, Doxygen's search box sits in its search
// slot, its menu button opens the drawer), the site's column head over the tree (brand → the docs home, the sections —
// the one whose link is under <base>api/ is current) and the docs drawer (sections, the API Reference tree,
// resources, LeviMC links). kit 2.22: no header row of the docs' own.
// Every other locale's labels and URLs ride along as data-kit-l10n (kit.js applies them for the visitor's language).
//
// No dependencies: the React-rendered parts (bar, LeviMC links, footer strings, sprites) are prebuilt by
// src/kit/static/build-static.mjs into header-parts.json next to this file.
//
//   node doxygen/gen-header.mjs [--nav <dist>/_kit/nav.json] [--out .cache/doxygen/header.html]
//          [--api-path api/] [--chrome-out .cache/doxygen/kit-dox-chrome.js [--footer doxygen/footer.html
//          --footer-out .cache/doxygen/footer.html]]      (as doxygen/build.sh runs it)
//
// Without --nav the kit's fallback (header-parts.json `fallbackNav`, LeviLamina's sections) is used. Without --out
// the header is printed to stdout.
//
// With --chrome-out (kit 2.30) the chrome is written once into that script instead of into every page
// (renderDoxygenChrome): list the script in HTML_EXTRA_FILES and, with --footer-out, use that footer as HTML_FOOTER.
// Each page then is ~50 KB smaller (LeviLamina's API: ~3 GB over its ~68,000 pages).
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrJson = (v) => esc(JSON.stringify(v));

/** The kit's UI locale (chrome strings) of a BCP-47 tag — components/i18n.ts resolveUiLocale. */
export function uiLocaleOf(tag, uiLocales) {
  const t = String(tag || 'en').toLowerCase().replace(/_/g, '-');
  const exact = uiLocales.find((l) => l.toLowerCase() === t);
  if (exact) return exact;
  const base = t.split('-')[0];
  if (base === 'zh') return /^zh-(hant|tw|hk|mo)\b/.test(t) ? 'zh-HK' : 'zh-CN';
  return uiLocales.find((l) => l.toLowerCase().split('-')[0] === base) ?? 'en';
}

/** The chrome of the header (bar, drawer, site column) and the #top row, from the nav (renderDoxygenHeader's). */
function headerPieces(nav, parts, opts) {
  const codes = Object.keys(nav);
  if (!codes.length) throw new Error('nav.json: no locales');
  const def = nav[codes[0]];
  const others = codes.slice(1);
  const base = def.home.replace(/[^/]*$/, ''); // '/LeviLamina/' (the default locale's home is the site base)
  const apiPrefix = base + (opts.apiPath ?? 'api/');
  const isApi = (link) => typeof link === 'string' && link.startsWith(apiPrefix);
  const tabs = def.tabs ?? [];
  const activeIdx = tabs.findIndex((t) => isApi(t.link));
  if (activeIdx < 0) console.warn(`gen-header: no tab links into ${apiPrefix} — no section is marked current`);
  const S = (code) => parts.strings[uiLocaleOf(nav[code].lang, parts.uiLocales)] ?? parts.strings.en;
  const T = S(codes[0]);
  const locales = codes.map((c) => ({ c, l: nav[c].lang }));
  const localesAttr = attrJson(locales);
  const ico = parts.icons;

  /** data-kit-l10n of a link: other locales' [label, url] (or just url for links without text) */
  const l10n = (pick, hrefOnly = false) => {
    const m = {};
    for (const c of others) {
      const v = pick(nav[c], c);
      if (v) m[c] = hrefOnly ? v[1] : v;
    }
    return attrJson(m);
  };
  const tabAt = (n, i) => (n.tabs ?? [])[i];
  const resAt = (n, kind, i) => (n.resources ?? []).filter((r) => r.kind === kind)[i];

  // ------------------------------------------------------------- links (docs SiteNav markup)
  const brandL10n = l10n((n) => [null, n.home], true);
  const tabLink = (t, i, cls) => {
    const on = i === activeIdx;
    const ext = t.external ? ` target="_blank" rel="noopener"` : '';
    const label = t.external ? `<span data-kit-l10n-text="">${esc(t.text)}</span>${ico.external.replace('class="', `class="${cls}-ext `)}` : esc(t.text);
    return `<a class="${cls}${on ? ' is-active' : ''}" href="${esc(t.link)}"${on ? ' aria-current="true"' : ''}${ext} data-kit-l10n="${l10n((n) => {
      const x = tabAt(n, i);
      return x ? [x.text, x.link] : null;
    })}">${label}</a>`;
  };
  const resources = def.resources ?? [];
  const resCount = {};
  const resourceItems = resources.map((r) => {
    const k = (resCount[r.kind] = (resCount[r.kind] ?? -1) + 1);
    const pick = (n) => {
      const x = resAt(n, r.kind, k);
      return x ? [x.text, x.link] : null;
    };
    return { r, pick };
  });
  const extAttrs = (link) => (/^https?:/.test(link) ? ' target="_blank" rel="noopener"' : '');
  const textL10n = (key) => l10n((n, c) => [S(c)[key], '']);

  // kit 2.22: no header row. #top stays (Doxygen closes it and puts its own menus in it, all hidden); search is in the
  // LeviMC bar (the docs' GlobalBar `search` slot), the brand and the sections head the tree's column (SiteNav).
  const row = `<div id="top" class="kit-dox-top"><!-- do not remove this div, it is closed by doxygen! -->`;
  const barSearch = `<div class="kit-gbar-search kit-dox-search" data-kit-search-trigger="" aria-keyshortcuts="Control+K Meta+K /" data-kit-site-locales="${localesAttr}">
   <span class="kit-dox-search-ph" aria-hidden="true">${ico.search}<span class="kit-gbar-search-label" data-kit-l10n="${textL10n('search')}">${esc(T.search)}</span></span>
   <span class="kit-gbar-search-keys" aria-hidden="true"><kbd>Ctrl</kbd><kbd>K</kbd></span>
  </div>`;
  const siteNav = `<nav class="kit-sitenav kit-dox-sitenav" aria-label="${esc(T.mainNav)}" data-kit-l10n-aria="${textL10n('mainNav')}">
 <a class="kit-site-brand kit-sn-brand" href="${esc(def.home)}" data-kit-l10n="${brandL10n}"><!--BEGIN PROJECT_LOGO--><img class="kit-site-logo" alt="" src="$relpath^$projectlogo" width="28" height="28"/><!--END PROJECT_LOGO--><span class="kit-site-title">${esc(def.title)}</span></a>
 <ul class="kit-sn-sections">
  ${tabs.map((t, i) => `<li class="kit-sn-section${i === activeIdx ? ' is-active' : ''}">${tabLink(t, i, 'kit-sn-section-btn kit-sn-section-link')}</li>`).join('\n  ')}
 </ul>
</nav>`;

  // ------------------------------------------------------------- the drawer (docs MobileDrawer markup)
  // the drawer's Resources section (MobileDrawer): external links get the external mark, the repository its icon
  const drawerResources = resourceItems.length
    ? `
 <nav class="kit-drawer-resources" aria-label="${esc(T.resources)}" data-kit-l10n-aria="${textL10n('resources')}">
  <p class="kit-drawer-section-title" data-kit-l10n="${textL10n('resources')}">${esc(T.resources)}</p>
  <ul>
   ${resourceItems
     .map(({ r, pick }) => {
       const ext = /^https?:/.test(r.link);
       const label = `<span class="kit-drawer-link-label">${r.kind === 'github' ? ico.github16 ?? '' : ''}<span data-kit-l10n-text="">${esc(r.text)}</span></span>`;
       return `<li><a class="kit-drawer-link" href="${esc(r.link)}"${extAttrs(r.link)} data-kit-resource="${esc(r.kind)}" data-kit-l10n="${l10n(pick)}">${label}${ext ? ico.external : ''}</a></li>`;
     })
     .join('\n   ')}
  </ul>
 </nav>`
    : '';
  const drawer = `<div class="kit-drawer-root kit-dox-drawer-root" hidden="hidden">
<div class="kit-drawer-scrim" aria-hidden="true"></div>
<div id="kit-drawer" class="kit-drawer" role="dialog" aria-modal="true" aria-label="${esc(T.menu)}" data-kit-site-locales="${localesAttr}" data-kit-l10n-aria="${textL10n('menu')}">
 <div class="kit-drawer-head">
  <a class="kit-drawer-brand" href="${esc(def.home)}" data-kit-l10n="${brandL10n}"><!--BEGIN PROJECT_LOGO--><img class="kit-site-logo" alt="" src="$relpath^$projectlogo" width="24" height="24"/><!--END PROJECT_LOGO--><span class="kit-drawer-title">${esc(def.title)}</span></a>
  <button type="button" class="mc-icon-btn kit-dox-drawer-close" aria-label="${esc(T.close)}" data-kit-l10n-aria="${textL10n('close')}">${ico.close}</button>
 </div>
 <nav class="kit-drawer-nav" aria-label="${esc(T.mainNav)}" data-kit-l10n-aria="${textL10n('mainNav')}">
  <ul>
   ${tabs.map((t, i) => `<li>${tabLink(t, i, 'kit-drawer-link')}</li>`).join('\n   ')}
  </ul>
 </nav>
 <div class="kit-drawer-sidebar kit-dox-drawer-sidebar"></div>${drawerResources}
 <nav class="kit-drawer-network kit-dox-drawer-network" aria-label="${esc(parts.strings.en.network)}" data-kit-t-aria="network" lang="en">
${parts.networkList}
 </nav>
</div>
</div>`;

  // the pane titles kit.js puts over the tree (the current tab's name, like the docs sidebar) and the outline
  const titles = `<div class="kit-dox-pane-titles" hidden="hidden" data-kit-site-locales="${localesAttr}">
 ${siteNav}
 <p class="kit-toc-title" data-kit-l10n="${textL10n('onThisPage')}">${esc(T.onThisPage)}</p>
</div>`;

  // the bar: its language menu lists the docs' locales (buttons: the API pages are the same in every locale)
  const langItems = codes
    .map((c, i) =>
      parts.langItem
        .replace(/%ON%/g, String(i === 0))
        .replace(/%ACTIVE%/g, i === 0 ? ' is-active' : '')
        .replace(/%LANG%/g, esc(nav[c].lang))
        .replace(/%LABEL%/g, esc(nav[c].label ?? nav[c].lang))
        .replace('%CHECK%', i === 0 ? parts.langCheck : ''),
    )
    .join('');
  const gbar = parts.gbar
    .replace('<!--KIT:LANG-ITEMS-->', langItems)
    .replace('<!--KIT:LANG-LABEL-->', esc(def.label ?? def.lang))
    .replace('data-kit-site-locales=""', `data-kit-site-locales="${localesAttr}"`)
    .replace('<div class="kit-gbar-end">', () => `<div class="kit-gbar-end">${barSearch}`);

  return { def, gbar, drawer, titles, row };
}

/** The page around the chrome: `slots` holds the head's theme script and the bar and pane markup (or the calls that
 * write them). */
function headerShell({ def, row }, parts, opts, slots) {
  return `<!-- levimc-kit ${parts.version} Doxygen HTML_HEADER (doxygen ≥ 1.10 + doxygen-awesome-css 2.4.1) — generated by doxygen/gen-header.mjs from ${esc(opts.source ?? 'nav.json')} -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="$langISO" data-kit-doxygen="">
<head>
<meta http-equiv="Content-Type" content="text/xhtml;charset=UTF-8"/>
<meta http-equiv="X-UA-Compatible" content="IE=11"/>
<meta name="generator" content="Doxygen $doxygenversion"/>
<meta name="generator" content="${esc(parts.generator)}"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>$title - ${esc(def.title)} API</title>
<!--BEGIN PROJECT_ICON--><link rel="icon" href="$relpath^$projecticon" type="image/x-icon"/><!--END PROJECT_ICON-->
${slots.head}
${parts.fontHead}
<link href="$relpath^tabs.css" rel="stylesheet" type="text/css"/>
<!--BEGIN DISABLE_INDEX-->
  <!--BEGIN FULL_SIDEBAR-->
<script type="text/javascript">var page_layout=1;</script>
  <!--END FULL_SIDEBAR-->
<!--END DISABLE_INDEX-->
<script type="text/javascript" src="$relpath^jquery.js"></script>
<script type="text/javascript" src="$relpath^dynsections.js"></script>
<!--BEGIN COPY_CLIPBOARD-->
<script type="text/javascript" src="$relpath^clipboard.js"></script>
<!--END COPY_CLIPBOARD-->
$treeview
$search
$mathjax
$darkmode
<link href="$relpath^$stylesheet" rel="stylesheet" type="text/css" />
$extrastylesheet
<script type="text/javascript" src="$relpath^kit.js" defer="defer"></script>
</head>
<body>
<a class="kit-skip-link" href="#doc-content" data-kit-t="skipToContent">${esc(parts.strings.en.skipToContent)}</a>
<div class="kit-backdrop" aria-hidden="true"><div class="kit-backdrop-dabs"></div><div class="kit-backdrop-brush"></div><div class="kit-backdrop-grain"></div></div>
<div class="kit-backdrop-scene kit-dissolve-bottom" aria-hidden="true"></div>
<!--BEGIN DISABLE_INDEX-->
  <!--BEGIN FULL_SIDEBAR-->
<div id="side-nav" class="ui-resizable side-nav-resizable"><!-- do not remove this div, it is closed by doxygen! -->
  <!--END FULL_SIDEBAR-->
<!--END DISABLE_INDEX-->
${slots.gbar}
<!-- the docs layout (doxygen-kit.css): the drawer, the header row, the tree and the page; closed by footer.html, so
     the tree and the page-outline panel stop above the footer -->
<div class="kit-dox-page">
${slots.pane}
${row}
<!-- end header part -->
`;
}

/**
 * The Doxygen HTML_HEADER with the chrome inline (~40 KB in every page).
 * @param {Record<string, {lang:string,label:string,prefix:string,title:string,home:string,
 *   tabs:{text:string,link:string,external?:boolean}[], resources?:{kind:string,text:string,link:string}[]}>} nav
 * @param {object} parts header-parts.json
 * @param {{ apiPath?: string, source?: string }} [opts]
 */
export function renderDoxygenHeader(nav, parts, opts = {}) {
  const p = headerPieces(nav, parts, opts);
  return headerShell(p, parts, opts, {
    head: `<script type="text/javascript">${parts.themeInit}</script>`,
    gbar: p.gbar,
    pane: `${p.drawer}\n${p.titles}`,
  });
}

const LOGO_TOKEN = '$relpath^$projectlogo';
const FOOTER_RE = /(<div class="kit-dox-footer">)\n([\s\S]*?)\n(<\/div>\n<\/body>)/;

/**
 * The same header with the chrome in one shared script (kit 2.30). The script (HTML_EXTRA_FILES, loaded blocking in
 * the head where the inline theme init was) runs the theme init and defines kitDoxChrome(part, logo); each page calls
 * it where the bar, the pane (drawer and site column) and, with `opts.footer` (the kit's doxygen/footer.html), the
 * LeviMC footer go, and it writes their markup there with document.write — the parser reads the same HTML as with
 * the inline header, before kit.js (deferred) runs.
 * @param {Parameters<typeof renderDoxygenHeader>[0]} nav
 * @param {object} parts header-parts.json
 * @param {{ apiPath?: string, source?: string, script?: string, footer?: string }} [opts] `script`: the script's file
 *   name in the output (default kit-dox-chrome.js)
 * @returns {{ header: string, script: string, footer?: string }}
 */
export function renderDoxygenChrome(nav, parts, opts = {}) {
  const name = opts.script ?? 'kit-dox-chrome.js';
  const p = headerPieces(nav, parts, opts);
  const chunks = { gbar: p.gbar, pane: `${p.drawer}\n${p.titles}` };
  let footer;
  if (opts.footer != null) {
    const src = opts.footer.replace(/\r\n/g, '\n');
    const m = FOOTER_RE.exec(src);
    if (!m) throw new Error('gen-header: the footer has no <div class="kit-dox-footer"> closed right before </body>');
    chunks.footer = m[2];
    footer = src.replace(FOOTER_RE, (_, open, __, close) => `${open}\n<script type="text/javascript">kitDoxChrome("footer")</script>\n${close}`);
  }
  for (const [k, html] of Object.entries(chunks)) {
    // the logo's path is the one Doxygen keyword the chrome uses (the page passes it in); any other would stay
    // unexpanded in the script, which Doxygen copies as it is
    const kw = /\$[a-z]\w*/i.exec(html.split(LOGO_TOKEN).join(''));
    if (kw) throw new Error(`gen-header: the ${k} markup uses the Doxygen keyword ${kw[0]}`);
  }
  const header = headerShell(p, parts, opts, {
    head: `<script type="text/javascript" src="$relpath^${name}"></script>`,
    gbar: `<script type="text/javascript">kitDoxChrome("gbar")</script>`,
    pane: `<script type="text/javascript">kitDoxChrome("pane","<!--BEGIN PROJECT_LOGO-->${LOGO_TOKEN}<!--END PROJECT_LOGO-->")</script>`,
  });
  const script = `/* levimc-kit ${parts.version} Doxygen chrome — generated by doxygen/gen-header.mjs from ${opts.source ?? 'nav.json'}:
   the theme init, then the bar, the drawer and site column and the footer, which every API page writes in place
   (kitDoxChrome) instead of carrying their markup. */
${parts.themeInit}
(function(){var P=${JSON.stringify(chunks)};
window.kitDoxChrome=function(k,logo){var h=P[k];if(!h)return;document.write(h.replace(/<!--BEGIN PROJECT_LOGO-->([\\s\\S]*?)<!--END PROJECT_LOGO-->/g,function(m,img){return logo?img.split(${JSON.stringify(LOGO_TOKEN)}).join(logo):""}))};})();
`;
  return { header, script, footer };
}

// ------------------------------------------------------------------ CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const opt = (k) => (args.includes(k) ? args[args.indexOf(k) + 1] : undefined);
  const parts = JSON.parse(readFileSync(join(here, 'header-parts.json'), 'utf8'));
  const navFile = opt('--nav');
  const nav = navFile ? JSON.parse(readFileSync(navFile, 'utf8')) : parts.fallbackNav;
  const base = { apiPath: opt('--api-path'), source: navFile ? '_kit/nav.json' : 'the kit fallback nav' };
  const out = opt('--out');
  const chromeOut = opt('--chrome-out');
  const footerIn = opt('--footer');
  const footerOut = opt('--footer-out');
  const from = `${navFile ? navFile : 'fallback nav'}; ${Object.keys(nav).length} locales`;
  if (chromeOut) {
    if (!out) throw new Error('gen-header: --chrome-out needs --out');
    if (!footerIn !== !footerOut) throw new Error('gen-header: --footer and --footer-out go together');
    const r = renderDoxygenChrome(nav, parts, { ...base, script: basename(chromeOut), footer: footerIn ? readFileSync(footerIn, 'utf8') : undefined });
    writeFileSync(out, r.header);
    writeFileSync(chromeOut, r.script);
    if (footerOut) writeFileSync(footerOut, /** @type {string} */ (r.footer));
    console.log(`gen-header: ${[out, chromeOut, footerOut].filter(Boolean).join(', ')} (${from})`);
  } else {
    const html = renderDoxygenHeader(nav, parts, base);
    if (out) {
      writeFileSync(out, html);
      console.log(`gen-header: ${out} (${from})`);
    } else process.stdout.write(html);
  }
}
