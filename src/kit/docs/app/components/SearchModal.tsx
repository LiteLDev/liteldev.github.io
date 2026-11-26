import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { href, site } from '../data';
import { internalTarget } from './KitLink';
import { SearchDialog } from '../../../components/SearchDialog';
import { loadSearchIndex, loadSiteSearch, preloadSiteSearch, searchLanguageOf } from '../../../components/site-search';
import type { UiStrings } from '../../../components/i18n';

// kit 2.27: the docs search the whole LeviMC network — levimc.org's site-wide index of the page's language
// (src/kit/components/site-search.ts) — and only their own index when there is none (the dev server, a build that is
// not deployed with levimc.org).

const language = () => (typeof window === 'undefined' ? 'en' : searchLanguageOf(window.location.pathname));

function ownIndex(locale: string) {
  return loadSearchIndex(site.search[locale] ?? site.search[site.defaultLocale]!);
}

async function loadFor(locale: string) {
  const wide = await loadSiteSearch(language()).catch(() => null);
  if (wide) return { index: wide, siteWide: true };
  return { index: await ownIndex(locale), siteWide: false };
}

/** Start loading the search index (search trigger hover/focus, Ctrl held) before the modal mounts. */
export function preloadSearchIndex(_locale: string): void {
  preloadSiteSearch(language());
}

export function SearchModal({ open, onClose, locale, t }: { open: boolean; onClose: () => void; locale: string; t: UiStrings }) {
  const navigate = useNavigate();
  const load = useCallback(() => loadFor(locale), [locale]);
  const hrefOf = useCallback((path: string, siteWide: boolean) => (siteWide ? path : href(path)), []);
  const onNavigate = useCallback(
    (url: string) => {
      const to = internalTarget(url);
      if (to) navigate(to);
      else window.location.href = url;
    },
    [navigate],
  );
  return <SearchDialog open={open} onClose={onClose} t={t} load={load} indexKey={locale} hrefOf={hrefOf} onNavigate={onNavigate} />;
}
