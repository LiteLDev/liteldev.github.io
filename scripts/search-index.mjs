#!/usr/bin/env node
// The site-wide search of levimc.org (2026-11-23): one index per language over every LeviMC site this repository
// publishes — levimc.org itself (home, about, community, support, the blog), LeviMC Mods, the tutorials, the FAQ and
// each project's docs — so the search of any page finds the pages of all of them. Before, each docs site searched
// only itself and levimc.org's own pages and Mods had no search at all.
//
//   node scripts/search-index.mjs <dist>
//
// Runs in the deploy after every build is merged into <dist> (`docs-sites.mjs merge`), and writes
//
//   <dist>/_search/manifest.json        { "version": 1, "indexes": { "en": "/_search/en.<hash>.json", "zh-Hans": … } }
//   <dist>/_search/<language>.<hash>.json   a MiniSearch index (src/kit/docs/shared/search.ts options) per language
//
// The documents:
//   * docs sites (kit 2.27+): <dist>/**/_kit/search-docs.json, the sections each docs build indexes for itself
//     (its searchExclude applied, code blocks left out);
//   * every other page: the pages of each <dist>/**/sitemap.xml that no docs site indexed, read from their
//     prerendered HTML (<main>, split at h1–h3 with an id), without the blog's tag, category and archive lists.
//
// A page's language is the first segment of its URL (zh-Hans, zh-Hant, LeviLauncher's es, ru …), else its <html
// lang> (a blog post has one URL in the language it is written in), else English. The index of a language holds
// its pages and, for every site that has no page in that language, the site's English pages.
//
// Clients (src/kit/components/site-search.ts) load the manifest, then the index of the page's language, and fall back
// to the site's own index when there is none (a docs site's dev server, a build without this step).
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import MiniSearch from 'minisearch';
import { fromHtml } from 'hast-util-from-html';
import { toString } from 'hast-util-to-string';
import { searchOptions, SNIPPET_STORE_CHARS } from '../src/kit/docs/shared/search.ts';
import { NETWORK_LANGUAGE_SEGMENTS } from '../src/kit/components/projects.ts';

export const SEARCH_DIR = '_search';
const TEXT_CHARS = 4000;
/** Pages that only list other pages. */
const SKIP_PAGE = /^\/(?:[^/]+\/)?blog\/(?:tags|categories|archives)\//;
/** Never searched: the kit's own files and the indexes themselves (pages not in a sitemap are never read either). */
const SKIP_DIR = new Set(['kit', SEARCH_DIR, 'node_modules']);

function walk(dir, base, out, match) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (dir === base && SKIP_DIR.has(name)) continue;
      walk(p, base, out, match);
    } else if (match(name, p)) out.push(p);
  }
  return out;
}

const segments = new Set(NETWORK_LANGUAGE_SEGMENTS);

/** The network language of a URL pathname: its first segment when that is one, else null. */
export function languageOfPath(pathname) {
  const first = pathname.split('/')[1] ?? '';
  return segments.has(first) ? first : null;
}

/** The network language of a BCP-47 tag (zh-CN → zh-Hans, zh-TW → zh-Hant, ja-JP → ja), else 'en'. */
export function languageOfTag(tag) {
  const t = String(tag || '').toLowerCase();
  if (!t) return 'en';
  if (/^zh-(tw|hk|mo|hant)\b/.test(t)) return 'zh-Hant';
  if (t.startsWith('zh')) return 'zh-Hans';
  const base = t.split('-')[0];
  for (const s of segments) if (s.toLowerCase() === t || s.toLowerCase() === base) return s;
  return 'en';
}

/** Which site a pathname belongs to: its first segment after the language (LeviLamina, tutorials, mods, blog), or ''. */
export function siteOfPath(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && segments.has(parts[0])) parts.shift();
  return parts[0] && !/\./.test(parts[0]) ? parts[0] : '';
}

const clean = (s) => s.replace(/\s+/g, ' ').trim();

// ------------------------------------------------------------------------------------------- docs sites

function docsSiteDocs(dist) {
  const out = [];
  for (const file of walk(dist, dist, [], (name, p) => name === 'search-docs.json' && p.split(sep).at(-2) === '_kit')) {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    for (const loc of Object.values(data.locales ?? {})) {
      for (const d of loc.docs ?? []) {
        out.push({
          url: d.url,
          lang: languageOfPath(d.url) ?? languageOfTag(loc.lang),
          site: data.title ?? '',
          siteKey: siteOfPath(d.url),
          title: d.title,
          page: d.page,
          crumbs: d.crumbs ?? '',
          text: d.text ?? '',
        });
      }
    }
  }
  return out;
}

// ------------------------------------------------------------------------------------------- other pages

const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'nav', 'aside', 'header', 'footer', 'button', 'form', 'pre', 'iframe', 'canvas', 'dialog']);

function skipped(el) {
  if (SKIP_TAGS.has(el.tagName)) return true;
  const p = el.properties ?? {};
  return p.ariaHidden === 'true' || p.ariaHidden === true || p.hidden != null;
}

function find(node, pred) {
  if (node.type === 'element' && pred(node)) return node;
  for (const c of node.children ?? []) {
    const r = find(c, pred);
    if (r) return r;
  }
  return null;
}

/** Text of an element without its skipped parts, a space between elements ("Latest posts 7", not "posts7"). */
function textOf(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'element' && skipped(node)) return '';
  return (node.children ?? []).map((c) => (c.type === 'element' ? ` ${textOf(c)} ` : textOf(c))).join('');
}

/**
 * A prerendered page: its <html lang>, title, breadcrumbs, site name, whether it names translations of itself
 * (hreflang alternates), and its sections [{ id, title, text }], split at h2/h3 with an id (the h1 is the page).
 */
export function htmlSections(html) {
  const tree = fromHtml(html);
  const htmlEl = find(tree, (e) => e.tagName === 'html');
  const lang = String(htmlEl?.properties?.lang ?? '');
  const head = find(tree, (e) => e.tagName === 'head');
  const meta = (prop) => (head ? find(head, (e) => e.tagName === 'meta' && e.properties?.property === prop)?.properties?.content : undefined);
  const site = String(meta('og:site_name') ?? '');
  const titleEl = head ? find(head, (e) => e.tagName === 'title') : null;
  // "<page> - <section …> - LeviMC" (the home page: "LeviMC - <tagline>"); without the site name, the parts between
  // the page and the site are the breadcrumbs
  const titleParts = (titleEl ? clean(toString(titleEl)) : '').split(/\s+[-–|·]\s+/)
    // not the site's name, nor a word of it ("Mods", "LeviMC" of "LeviMC Mods")
    .filter((x) => x && x !== site && !site.split(/\s+/).includes(x));
  const translated = !!head && !!find(head, (e) => e.tagName === 'link' && e.properties?.hrefLang != null && String(e.properties.hrefLang) !== 'x-default');
  const main = find(tree, (e) => e.tagName === 'main') ?? find(tree, (e) => e.tagName === 'body');
  const h1 = main ? find(main, (e) => e.tagName === 'h1') : null;
  const page = (h1 && clean(textOf(h1))) || titleParts[0] || site;
  const crumbs = titleParts.slice(1).join(' › ');
  const sections = [];
  let cur = { id: '', title: page, text: '' };
  const flush = () => {
    cur.text = clean(cur.text);
    if (cur.text || !sections.length) sections.push(cur);
  };
  const visit = (node) => {
    if (node.type === 'text') {
      cur.text += node.value;
      return;
    }
    if (node.type !== 'element') return;
    if (skipped(node)) return;
    if (node.tagName === 'h1') return; // the page's title
    if (node.tagName === 'h2' || node.tagName === 'h3') {
      const text = clean(textOf(node));
      const id = node.properties?.id;
      if (id) {
        flush();
        cur = { id: String(id), title: text, text: '' };
      } else cur.text += ` ${text} `;
      return;
    }
    // block boundaries are word boundaries
    const block = /^(p|li|div|section|article|td|th|tr|dd|dt|blockquote|h[4-6]|br|figcaption|summary|details)$/.test(node.tagName);
    if (block) cur.text += ' ';
    for (const c of node.children ?? []) visit(c);
    if (block) cur.text += ' ';
  };
  if (main) for (const c of main.children ?? []) visit(c);
  flush();
  return { lang, page, crumbs, site, translated, sections };
}

function sitemapPaths(dist) {
  const paths = new Set();
  for (const file of walk(dist, dist, [], (name) => /^sitemap.*\.xml$/.test(name))) {
    for (const m of readFileSync(file, 'utf8').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
      try {
        paths.add(decodeURIComponent(new URL(m[1].replace(/&amp;/g, '&')).pathname));
      } catch {
        /* not a URL */
      }
    }
  }
  return [...paths].sort();
}

/** The file GitHub Pages serves for a pathname. */
function fileOf(dist, pathname) {
  const rel = pathname.replace(/^\/+/, '');
  for (const f of [rel.endsWith('/') || !rel ? join(rel, 'index.html') : rel, `${rel}.html`, join(rel, 'index.html')]) {
    const p = join(dist, f);
    if (existsSync(p) && statSync(p).isFile() && p.endsWith('.html')) return p;
  }
  return null;
}

function pageDocs(dist, covered) {
  const out = [];
  for (const pathname of sitemapPaths(dist)) {
    if (covered.has(pathname) || SKIP_PAGE.test(pathname) || SKIP_DIR.has(pathname.split('/')[1])) continue;
    const file = fileOf(dist, pathname);
    if (!file) continue;
    const html = readFileSync(file, 'utf8');
    if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) continue;
    const { lang, page, crumbs, site, translated, sections } = htmlSections(html);
    const language = languageOfPath(pathname) ?? languageOfTag(lang);
    // a page with one URL in one language (a blog post) and no translations: found in every language
    const everywhere = !translated && !languageOfPath(pathname);
    for (const s of sections) {
      out.push({
        url: pathname + (s.id ? `#${s.id}` : ''),
        lang: language,
        site,
        siteKey: siteOfPath(pathname),
        title: s.title || page,
        page,
        crumbs,
        text: s.text,
        ...(everywhere ? { everywhere: true } : {}),
      });
    }
  }
  return out;
}

// ------------------------------------------------------------------------------------------- the indexes

const pagePath = (url) => url.split('#')[0];

/**
 * Group the documents by language: a language's own, the pages in one language only (everywhere), and the English
 * pages of each site that has no page in that language.
 */
export function byLanguage(docs) {
  const langs = new Set(['en', ...docs.map((d) => d.lang)]);
  const sitesIn = new Map();
  for (const d of docs) {
    if (!sitesIn.has(d.lang)) sitesIn.set(d.lang, new Set());
    sitesIn.get(d.lang).add(d.siteKey);
  }
  const out = new Map();
  for (const lang of langs) {
    const own = sitesIn.get(lang) ?? new Set();
    out.set(
      lang,
      docs.filter((d) => d.lang === lang || d.everywhere || (lang !== 'en' && d.lang === 'en' && !own.has(d.siteKey))),
    );
  }
  return out;
}

export function buildIndex(docs) {
  const ms = new MiniSearch({ ...searchOptions, storeFields: [...searchOptions.storeFields, 'site'] });
  ms.addAll(docs.map((d, id) => ({ id, title: d.title, page: d.page, crumbs: d.crumbs, path: d.url, site: d.site, text: d.text.slice(0, TEXT_CHARS) })));
  const json = JSON.parse(JSON.stringify(ms));
  for (const v of Object.values(json.storedFields)) if (v.text && v.text.length > SNIPPET_STORE_CHARS) v.text = v.text.slice(0, SNIPPET_STORE_CHARS);
  return JSON.stringify(json);
}

export function buildSearch(dist) {
  const docsDocs = docsSiteDocs(dist);
  const covered = new Set(docsDocs.map((d) => pagePath(d.url)));
  const all = [...docsDocs, ...pageDocs(dist, covered)];
  const dir = join(dist, SEARCH_DIR);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const indexes = {};
  const report = [];
  for (const [lang, docs] of byLanguage(all)) {
    if (!docs.length) continue;
    const json = buildIndex(docs);
    const name = `${lang}.${createHash('sha256').update(json).digest('hex').slice(0, 8)}.json`;
    writeFileSync(join(dir, name), json);
    indexes[lang] = `/${SEARCH_DIR}/${name}`;
    report.push(`${lang}: ${docs.length} sections, ${new Set(docs.map((d) => pagePath(d.url))).size} pages, ${(json.length / 1024).toFixed(0)} KiB`);
  }
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify({ version: 1, indexes }) + '\n');
  return { docs: all.length, docsSites: docsDocs.length, report };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const dist = resolve(process.argv[2] ?? 'dist');
  if (!existsSync(dist)) {
    console.error(`search-index: ${relative(process.cwd(), dist) || dist} does not exist`);
    process.exit(1);
  }
  const r = buildSearch(dist);
  console.log(`search-index: ${r.docs} sections (${r.docsSites} from docs sites)`);
  for (const line of r.report) console.log(`  ${line}`);
}
