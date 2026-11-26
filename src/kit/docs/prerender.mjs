#!/usr/bin/env node
// Prerender every route of a levimc-kit docs site into static HTML (run after the client + SSR builds).
// Usage: node src/kit/docs/prerender.mjs [--root <appDir>] [--work-dir <dir>]   (the build's workDir, default <root>/.kit)
import { existsSync, mkdirSync, readFileSync, rmdirSync, rmSync, writeFileSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

/** @param {{ root?: string, outDir?: string, workDir?: string }} [options] */
export async function prerenderDocs({ root = process.cwd(), outDir, workDir = join(root, '.kit') } = {}) {
  const ssrEntry = join(workDir, 'ssr/entry-server.js');
  const manifestPath = join(workDir, 'client-pages.json');
  if (!existsSync(ssrEntry)) throw new Error(`SSR bundle not found at ${ssrEntry} — run the SSR build first.`);
  const mod = await import(pathToFileURL(ssrEntry).href);
  const { site, routes, render, pageUrl } = mod;
  // { appHtml, outDir, template, pages: page id → chunk files }; outDir is the host root with localeFirst (kit 2.23),
  // template the client build's index.html relative to it (in base's folder)
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const out = outDir ?? manifest.outDir ?? join(root, 'dist');
  const templatePath = join(out, manifest.template ?? manifest.appHtml);
  const template = readFileSync(templatePath, 'utf8');
  const escJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c').replace(/[\u2028\u2029]/g, (c) => (c === '\u2028' ? '\\u2028' : '\\u2029'));

  const fill = (r, preload) =>
    template
      .replace(/<html lang="[^"]*"/, `<html lang="${r.lang}"`)
      .replace('<!--kit-head-->', () => r.head + preload)
      .replace('<!--kit-app-->', () => r.html)
      .replace('<!--kit-page-data-->', () => r.pageData ? `<script type="application/json" id="kit-page-data">${escJson(r.pageData)}</script>` : '');

  let count = 0;
  for (const route of routes) {
    const r = await render(pageUrl ? pageUrl(route.path) : site.base + route.path);
    // No modulepreload of the page's own chunk: hydration reuses the prerendered HTML and #kit-page-data
    // (entry-client primes the page cache), so that chunk is only fetched for client-side navigation (KitLink
    // warms it on hover/focus). Page chunks are plain data and import nothing the entry does not load already.
    const file = join(out, r.file);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, fill(r, ''));
    count++;
  }
  // themed, locale-aware 404 (GitHub Pages serves it for every missing path under the site)
  const nf = await render(site.base + '__kit_404__');
  writeFileSync(join(out, '404.html'), fill({ ...nf, file: '404.html' }, ''));
  // the raw template is not a page
  rmSync(templatePath);
  let d = dirname(templatePath);
  while (d.startsWith(out) && d !== out) {
    try {
      rmdirSync(d); // only removes empty folders (rmSync throws EISDIR on any folder)
    } catch {
      break;
    }
    d = dirname(d);
  }
  return { count };
}

// run as a CLI (compares real paths, so a symlinked or relative script path still counts)
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const root = args.includes('--root') ? resolve(args[args.indexOf('--root') + 1]) : process.cwd();
  const t0 = Date.now();
  const workDir = args.includes('--work-dir') ? resolve(args[args.indexOf('--work-dir') + 1]) : undefined;
  const { count } = await prerenderDocs({ root, workDir });
  console.log(`[kit-docs] prerendered ${count} pages + 404.html in ${Date.now() - t0} ms`);
}
