// levimc-kit — the search dialog of every LeviMC site (kit 2.27; before, the docs' SearchModal). It searches a
// MiniSearch index of src/kit/docs/shared/search.ts's shape: the site-wide one (src/kit/components/site-search.ts, absolute
// paths, every LeviMC site) or a docs site's own. Styles: src/kit/theme/search.css.
import { useDeferredValue, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode, type UIEvent } from 'react';
import { tokenizeQuery } from '../docs/shared/search';
import { useFocusTrap } from './focus';
import { PixelIcon } from './PixelIcon';
import type { UiStrings } from './i18n';
import { searchSiteOf, type SearchHit, type SearchIndex } from './site-search';

/** Results shown at first, and added each time the list is scrolled (or arrowed) to its end. */
const PAGE = 10;
const MAX_RESULTS = 40;
/** Results of the site the reader is on rank a little higher in the site-wide index. */
const SAME_SITE_BOOST = 1.4;

export type SearchStrings = Pick<UiStrings, 'search' | 'searchPlaceholder' | 'searchNoResults' | 'searchLoading' | 'searchNavigate' | 'searchSelect' | 'searchClose' | 'close'>;

export interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  t: SearchStrings;
  /** Loads the index; called each time the dialog opens or `indexKey` changes while it is open. */
  load: () => Promise<{ index: SearchIndex; siteWide: boolean }>;
  /** What `load` loads (a language, a locale): a change reloads the index. */
  indexKey: string;
  /** The URL of a result's path: identity for the site-wide index, the site's own resolution for a site's index. */
  hrefOf: (path: string, siteWide: boolean) => string;
  /** Go to a result (client-side when the URL is one of this app's pages). The dialog closes first. */
  onNavigate: (url: string) => void;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function highlight(text: string, terms: string[]): ReactNode[] {
  const clean = [...new Set(terms.filter((t) => t.length > 0))].sort((a, b) => b.length - a.length);
  if (!clean.length) return [text];
  const re = new RegExp(`(${clean.map(escapeRe).join('|')})`, 'giu');
  return text.split(re).map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

function snippet(text: string, terms: string[], len = 150): string {
  if (!text) return '';
  const lower = text.toLowerCase();
  let pos = -1;
  for (const t of terms) {
    const i = lower.indexOf(t.toLowerCase());
    if (i >= 0 && (pos < 0 || i < pos)) pos = i;
  }
  if (pos < 0) return text.slice(0, len) + (text.length > len ? '…' : '');
  const start = Math.max(0, pos - 50);
  const s = text.slice(start, start + len);
  return (start > 0 ? '…' : '') + s + (start + len < text.length ? '…' : '');
}

const tooShort = (q: string) => q.length < 2 && /^[\x00-\x7f]$/.test(q);

export function SearchDialog({ open, onClose, t, load, indexKey, hrefOf, onNavigate }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  // typing stays responsive: the query runs on the deferred value, in a render React can interrupt
  const deferred = useDeferredValue(query);
  const [shown, setShown] = useState(PAGE);
  const [loaded, setLoaded] = useState<{ index: SearchIndex; siteWide: boolean } | null>(null);
  const [error, setError] = useState(false);
  const [sel, setSel] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const loadRef = useRef(load);
  // eslint-disable-next-line react-hooks/refs -- the latest `load`, for the effect below, which must not restart when it changes
  loadRef.current = load;
  useFocusTrap(panel, open, onClose);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a dialog that opens (or a new index) starts empty, then loads
    setLoaded(null);
    setError(false);
    let live = true;
    loadRef.current().then(
      (l) => live && setLoaded(l),
      () => live && setError(true),
    );
    document.documentElement.classList.add('kit-search-open');
    return () => {
      live = false;
      document.documentElement.classList.remove('kit-search-open');
    };
  }, [open, indexKey]);

  const results: SearchHit[] = useMemo(() => {
    const q = deferred.trim();
    // one Latin letter matches half the index: wait for a second one (a single CJK character is a word)
    if (!loaded || !q || tooShort(q)) return [];
    const here = typeof window === 'undefined' ? '' : searchSiteOf(window.location.pathname);
    const opts = {
      prefix: (term: string) => term.length > 1,
      fuzzy: (term: string) => (term.length > 4 && /^[\x00-\x7f]+$/.test(term) ? 0.2 : false),
      boost: { title: 3, page: 1.6, crumbs: 0.6 },
      tokenize: tokenizeQuery,
      ...(loaded.siteWide
        ? { boostDocument: (_id: unknown, _term: string, stored?: Record<string, unknown>) => (searchSiteOf(String(stored?.path ?? '')) === here ? SAME_SITE_BOOST : 1) }
        : {}),
    };
    let r = loaded.index.search(q, { ...opts, combineWith: 'AND' });
    if (!r.length) r = loaded.index.search(q, { ...opts, combineWith: 'OR' });
    return r.slice(0, MAX_RESULTS) as unknown as SearchHit[];
  }, [loaded, deferred]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a new query starts at its first result
    setSel(0);
    setShown(PAGE);
  }, [deferred]);
  const visible = results.length > shown ? results.slice(0, shown) : results;
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${sel}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  if (!open) return null;

  const urlOf = (r: SearchHit) => hrefOf(r.path, !!loaded?.siteWide);
  const go = (r: SearchHit) => {
    const url = urlOf(r);
    onClose();
    onNavigate(url);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSel((s) => {
        const n = Math.min(results.length - 1, s + 1);
        if (n >= shown - 1) setShown((v) => Math.min(results.length, v + PAGE));
        return n;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (e.key === 'Enter' && results[sel]) {
      e.preventDefault();
      go(results[sel]!);
    }
  };
  const optionId = (i: number) => `kit-search-opt-${i}`;
  const q = deferred.trim();
  const terms = tokenizeQuery(q).concat(q.split(/\s+/));
  const onBodyScroll = (e: UIEvent<HTMLDivElement>) => {
    const b = e.currentTarget;
    if (shown < results.length && b.scrollTop + b.clientHeight >= b.scrollHeight - 120) setShown((v) => Math.min(results.length, v + PAGE));
  };

  return (
    <div className="kit-search-root">
      <div className="kit-search-scrim" onClick={onClose} aria-hidden="true" />
      <div ref={panel} className="kit-search" role="dialog" aria-modal="true" aria-label={t.search} onKeyDown={onKeyDown}>
        <div className="kit-search-field mc-input">
          <PixelIcon name="search" />
          <input
            data-autofocus=""
            type="search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="kit-search-list"
            aria-activedescendant={results.length ? optionId(sel) : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="mc-icon-btn kit-search-close" onClick={onClose} aria-label={t.close}>
            <kbd className="mc-kbd">Esc</kbd>
          </button>
        </div>
        <div className="kit-search-body" onScroll={onBodyScroll}>
          {!loaded && !error ? <p className="kit-search-status">{t.searchLoading}</p> : null}
          {error ? <p className="kit-search-status">Search index unavailable.</p> : null}
          {loaded && q && !results.length && !tooShort(q) ? (
            <p className="kit-search-status">
              {t.searchNoResults} “{q}”
            </p>
          ) : null}
          {results.length ? (
            <ul id="kit-search-list" ref={list} role="listbox" aria-label={t.search} className="kit-search-list">
              {visible.map((r, i) => {
                const crumbs = [r.site, r.crumbs, r.title !== r.page ? r.page : ''].filter((c): c is string => !!c && c !== r.title);
                return (
                  <li
                    key={r.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === sel}
                    data-index={i}
                    className={i === sel ? 'kit-search-item is-active' : 'kit-search-item'}
                    onMouseMove={() => setSel(i)}
                    onClick={() => go(r)}
                  >
                    <a href={urlOf(r)} tabIndex={-1} onClick={(e) => e.preventDefault()}>
                      {crumbs.length ? (
                        <span className="kit-search-crumbs">
                          {crumbs.map((c, j) => (
                            <span key={j} className="kit-search-crumb">
                              {j ? <PixelIcon name="chevronRight" /> : null}
                              <span>{c}</span>
                            </span>
                          ))}
                        </span>
                      ) : null}
                      <span className="kit-search-title">
                        {r.title !== r.page ? <PixelIcon name="hash" className="kit-search-hash" /> : null}
                        <span>{highlight(r.title, terms)}</span>
                      </span>
                      {r.text ? <span className="kit-search-snippet">{highlight(snippet(r.text, terms), terms)}</span> : null}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
        <div className="kit-search-foot" aria-hidden="true">
          <span>
            <kbd className="mc-kbd">↑</kbd>
            <kbd className="mc-kbd">↓</kbd> {t.searchNavigate}
          </span>
          <span>
            <kbd className="mc-kbd">Enter</kbd> {t.searchSelect}
          </span>
          <span>
            <kbd className="mc-kbd">Esc</kbd> {t.searchClose}
          </span>
        </div>
      </div>
    </div>
  );
}
