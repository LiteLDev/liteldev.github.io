import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { FONT_HEAD_HTML } from '../kit/components/fonts.ts';
import { noJsDarkCss } from '../kit/static/nojs-dark.mjs';
import { PREPAINT_SCRIPT, ROOT_REDIRECT_SCRIPT } from './prepaint.ts';
import { levimcBlog } from './blog/plugin.ts';

/**
 * Inlines the no-flash theme script, the root's language redirect and the kit's web fonts into index.html, and — like every docs page —
 * a dark stylesheet for readers without JavaScript whose system is dark: the built stylesheet's .dark rules as
 * :root rules (src/kit/static/nojs-dark.mjs), in <noscript> with media="(prefers-color-scheme: dark)".
 */
function levimcHead(): Plugin {
  let ssr = false;
  let outDir = 'dist';
  return {
    name: 'levimc-head',
    configResolved(config) {
      ssr = !!config.build.ssr;
      outDir = config.build.outDir;
    },
    transformIndexHtml(html) {
      return html.replace('<!--prepaint-->', () => `<script>${PREPAINT_SCRIPT}</script><script>${ROOT_REDIRECT_SCRIPT}</script>`).replace('<!--fonts-->', () => FONT_HEAD_HTML);
    },
    writeBundle(_opts, bundle) {
      if (ssr) return;
      const css = Object.values(bundle)
        .map((o) => (o.type === 'asset' && o.fileName.endsWith('.css') ? String(o.source) : ''))
        .join('\n');
      if (!css) return;
      const dark = noJsDarkCss(css, { source: 'the levimc.org build from the site stylesheet' });
      const file = `assets/kit-nojs-dark.${createHash('sha256').update(dark).digest('hex').slice(0, 8)}.css`;
      mkdirSync(join(outDir, 'assets'), { recursive: true });
      writeFileSync(join(outDir, file), dark);
      const tag = `<noscript><link rel="stylesheet" href="/${file}" media="(prefers-color-scheme: dark)" /></noscript>`;
      const template = join(outDir, 'index.html');
      writeFileSync(template, readFileSync(template, 'utf8').replace('<!--app-head-->', () => `${tag}\n    <!--app-head-->`));
    },
  };
}

// Vite's root is this folder (src/main); every command runs from the repository root, where public/, dist/ and
// .kit/ are: `vite build src/main`, `vite build src/main --ssr entry-server.tsx --outDir ../../.kit/ssr`.
const repo = process.cwd();

export default defineConfig({
  publicDir: join(repo, 'public'),
  server: {
    port: 3000,
    host: '0.0.0.0',
    // the kit and the other apps' shared modules are beside this folder
    fs: { allow: [repo] },
  },
  // levimcBlog: content/blog → the /blog/ pages' data (virtual modules) and feeds
  plugins: [levimcBlog(), react(), tailwindcss(), levimcHead()],
  build: {
    outDir: join(repo, 'dist'),
    emptyOutDir: true,
    // read by prerender.mjs to modulepreload each page's chunk; it deletes dist/.vite afterwards
    manifest: true,
  },
});
