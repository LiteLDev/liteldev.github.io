// Rendered by build-static.mjs with react-dom/server into plain HTML snippets for non-React pages.
// kit.js drives their menus (theme, language) and translates the chrome into the visitor's language.
import { renderToStaticMarkup } from 'react-dom/server';
import { GlobalBar } from '../components/GlobalBar';
import { SiteFooter } from '../components/SiteFooter';
import type { DocsProjectId, SiteId } from '../components/projects';

export function globalBarHtml(opts: { locale?: string; current?: SiteId; currentDocs?: DocsProjectId | string; github?: string } = {}): string {
  return renderToStaticMarkup(<GlobalBar locale={opts.locale} current={opts.current} currentDocs={opts.currentDocs} github={opts.github} />);
}

export function footerHtml(opts: { locale?: string; extra?: string } = {}): string {
  return renderToStaticMarkup(<SiteFooter locale={opts.locale} extra={opts.extra} />);
}
