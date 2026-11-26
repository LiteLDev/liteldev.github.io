// levimc-kit — the site-wide search for apps that are not docs sites (levimc.org, LeviMC Mods; kit 2.27): the LeviMC
// bar's search button, Ctrl/⌘+K and "/", and the dialog over levimc.org's site-wide index of the page's language.
//
//   const search = useSiteSearch({ locale: chrome, onNavigate: (url) => … });
//   <GlobalBar … search={search.bar} />
//   {search.dialog}
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SearchDialog } from './SearchDialog';
import { uiStrings } from './i18n';
import { loadSiteSearch, preloadSiteSearch, searchLanguageOf } from './site-search';
import type { GlobalBarProps } from './GlobalBar';

export interface UseSiteSearchOptions {
  /** The chrome language (BCP-47) of the dialog's strings. */
  locale: string;
  /** Go to a result's URL (absolute path + #hash). Default: a full page load. */
  onNavigate?: (url: string) => void;
  /** "/" opens the search too (default); off where "/" focuses a search field of the page (LeviMC Mods' filter). */
  slashKey?: boolean;
}

const language = () => (typeof window === 'undefined' ? 'en' : searchLanguageOf(window.location.pathname));

async function load() {
  const index = await loadSiteSearch(language());
  if (!index) throw new Error('no site-wide search index');
  return { index, siteWide: true };
}

const hrefOf = (path: string) => path;
const fullLoad = (url: string) => {
  window.location.href = url;
};

export function useSiteSearch({ locale, onNavigate = fullLoad, slashKey = true }: UseSiteSearchOptions): { bar: NonNullable<GlobalBarProps['search']>; dialog: ReactNode } {
  const [open, setOpen] = useState(false);
  const t = useMemo(() => uiStrings(locale), [locale]);
  const warm = useCallback(() => preloadSiteSearch(language()), []);
  const show = useCallback(() => {
    warm();
    setOpen(true);
  }, [warm]);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest?.('input, textarea, select, [contenteditable="true"]');
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        show();
      } else if (slashKey && e.key === '/' && !e.defaultPrevented && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        show();
      } else if ((e.key === 'Control' || e.key === 'Meta') && !e.repeat) {
        // Ctrl/⌘ held: Ctrl+K may follow — start fetching the index before the dialog opens
        warm();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, warm, slashKey]);

  return {
    bar: { label: t.search, onOpen: show, onWarm: warm },
    dialog: <SearchDialog open={open} onClose={close} t={t} load={load} indexKey={locale} hrefOf={hrefOf} onNavigate={onNavigate} />,
  };
}
