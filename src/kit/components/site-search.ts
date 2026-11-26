// levimc-kit — the site-wide search (kit 2.27). levimc.org's deploy indexes every LeviMC site it publishes — levimc.org,
// the blog, LeviMC Mods, the tutorials, the FAQ and every project's docs — into one MiniSearch index per language
// (scripts/search-index.mjs), listed by /_search/manifest.json. Each site's search loads the index of the page's
// language from there; a docs site falls back to its own index when there is none (its dev server, a build without
// the deploy's step).
import type MiniSearchType from 'minisearch';
import { searchOptions } from '../docs/shared/search';
import { NETWORK_LANGUAGE_SEGMENTS } from './projects';

/** A document of a search index: a section of a page. `path` is absolute in the site-wide index. */
export interface SearchHit {
  id: number;
  score: number;
  terms: string[];
  title: string;
  page: string;
  crumbs: string;
  path: string;
  text: string;
  /** The site's name (site-wide index only): "LeviLamina", "Tutorials", "LeviMC" … */
  site?: string;
}

export type SearchIndex = MiniSearchType<Record<string, unknown>>;

export const SITE_SEARCH_MANIFEST = '/_search/manifest.json';
const STORE = [...searchOptions.storeFields, 'site'];

/** The language of the site-wide index for a pathname: its first segment when that names a language, else 'en'. */
export function searchLanguageOf(pathname: string): string {
  const first = pathname.split('/')[1] ?? '';
  return NETWORK_LANGUAGE_SEGMENTS.includes(first) ? first : 'en';
}

/** The site a pathname belongs to (its first segment after the language: LeviLamina, tutorials, mods, blog; '' for levimc.org). */
export function searchSiteOf(pathname: string): string {
  const parts = pathname.split(/[?#]/)[0]!.split('/').filter(Boolean);
  if (parts.length && NETWORK_LANGUAGE_SEGMENTS.includes(parts[0]!)) parts.shift();
  return parts[0] && !parts[0].includes('.') ? parts[0] : '';
}

let manifest: Promise<Record<string, string> | null> | null = null;
const indexes = new Map<string, Promise<SearchIndex>>();

function fetchManifest(): Promise<Record<string, string> | null> {
  if (!manifest) {
    manifest = fetch(SITE_SEARCH_MANIFEST)
      .then((r) => (r.ok ? (r.json() as Promise<{ indexes?: Record<string, string> }>) : null))
      .then((m) => m?.indexes ?? null)
      .catch(() => null);
    // a failed request may be retried by the next open
    manifest.then((m) => {
      if (!m) manifest = null;
    });
  }
  return manifest;
}

/** Load a serialized MiniSearch index (site-wide or a docs site's own). */
export function loadSearchIndex(url: string): Promise<SearchIndex> {
  let p = indexes.get(url);
  if (!p) {
    p = Promise.all([
      import('minisearch'),
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`search index ${r.status}`);
        return r.text();
      }),
    ]).then(([mod, json]) => mod.default.loadJSON(json, { ...searchOptions, storeFields: STORE }) as SearchIndex);
    p.catch(() => indexes.delete(url));
    indexes.set(url, p);
  }
  return p;
}

/** The site-wide index of a language (or English); null when the site has none (no manifest). */
export async function loadSiteSearch(language: string): Promise<SearchIndex | null> {
  const m = await fetchManifest();
  const url = m?.[language] ?? m?.en;
  return url ? loadSearchIndex(url) : null;
}

/** Start loading the site-wide index (search button hover/focus, Ctrl held) before the dialog opens. */
export function preloadSiteSearch(language: string): void {
  void loadSiteSearch(language).catch(() => undefined);
}
