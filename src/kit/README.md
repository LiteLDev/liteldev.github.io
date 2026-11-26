# levimc-kit

The shared design system and static docs engine for every LeviMC website — levimc.org (with LeviMC Mods at /mods/) and
the project docs at `levimc.org/<Project>/` (LeviLamina, LegacyScriptEngine, lip, LeviLauncher — Windows and
Android in one site — Be.D.D. and bedboo), plus the Doxygen API reference.

**Design concept: "Impression, Craft".** Monet's Giverny rendered as if built in Minecraft.
*Painterly = atmosphere* (impressionist colour fields and brush-dab texture in heroes, backdrops and margins);
*Pixel = structure* (crisp stepped geometry on every interactive affordance). Reading surfaces stay calm
"canvas" at WCAG AA contrast and a ~76ch measure. Light theme = *Nymphéas*, dark theme = *Impression, soleil levant*.
Where the two meet — a painting ending on the canvas — it **dissolves into 6px blocks while fading out** (the pixel
dissolve, `.kit-dissolve-*`): the kit's one edge treatment, used by the hero, the docs scene band and the footer alike.
Display type is **Manrope** (a modern geometric sans), body **Inter**. Since 2.2 the whole system leans **quiet and
spacious**: hairline frames instead of outlines and bevels, frameless grids under hairlines, large display type, and
the painting concentrated in two big moments (hero, footer) rather than sprinkled over every surface.

**Stack:** Vite 8 + React 19 + react-router 8 + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`).
Docs sites are compiled at build time (unified/remark/rehype + Shiki) and statically prerendered — one real
HTML file per URL for GitHub Pages — then hydrated into a SPA.

Version: see `VERSION` and the [Changelog](#changelog).

**Where it lives.** The kit is a source folder of levimc.org, `src/kit/`, in the site's one package: nothing copies,
fetches or publishes it. levimc.org (`src/main/`) and LeviMC Mods (`src/mods/`) import it by relative path; every
docs site is a folder `content/<Site>/` (a `docs.config.ts`, `pages/`, `public/`) built by this engine through
`scripts/docs-sites.mjs`; the Doxygen parts are in `doxygen/`.

Paths in this document are relative to `src/kit/` (`components/prefs.ts`, `static/kit.js`, `tests/`) unless they
start at the repository root (`src/…`, `content/…`, `scripts/…`, `doxygen/…`, `dist/`, `.build/`): `scripts/` is
always the repository's, and the kit's own scripts are written `src/kit/scripts/…`. Commands run from the
repository root.

---

## Contents

1. [Layout](#layout)
2. [Part of levimc.org](#part-of-levimcorg)
3. [Dependencies](#dependencies)
4. [Docs sites: structure & commands](#docs-sites-structure--commands)
5. [Site config API (`defineDocsConfig`)](#site-config-api-definedocsconfig)
6. [Markdown support](#markdown-support)
7. [Apps (levimc.org, LeviMC Mods)](#apps-levimcorg-levimc-mods) · [Cross-site preferences](#cross-site-preferences)
8. [Components](#components)
9. [Static chrome & Doxygen](#static-chrome--doxygen)
10. [Verification scripts](#verification-scripts)
11. [Design rules — do / don't](#design-rules--do--dont)
12. [Adding a project's docs: from MkDocs](#adding-a-projects-docs-from-mkdocs)
13. [Adding a project's docs: from VitePress](#adding-a-projects-docs-from-vitepress)
14. [Known limitations](#known-limitations)
15. [Maintaining the kit](#maintaining-the-kit)
16. [Changelog](#changelog)

---

## Layout

```
src/kit/
├── README.md  VERSION
├── theme/                 Tailwind v4 CSS-first theme
│   ├── tailwind.css         one-line entry: @import "tailwindcss" + index.css + @source for the kit
│   ├── index.css            imports everything below except hero.css (use after your own @import "tailwindcss")
│   ├── fonts.css            metric-matched fallback faces (Inter/Manrope/JetBrains Mono): no CLS on swap
│   ├── tokens.css           @theme tokens (light on :root, dark on .dark) + @custom-variant dark
│   ├── generated.css        textures & sprites as data URIs (generated — do not edit)
│   ├── hero.css             PaintedHero's default scenes (generated; imported by PaintedHero) → hero-lilies.svg,
│   │                        hero-sunrise.svg (generated scene files the bundler fingerprints)
│   ├── base.css             document defaults, focus ring, skip link, reduced motion, :lang(ko) rules
│   ├── pixel.css            .px-corners .mc-btn .mc-btn-primary .mc-icon-btn .mc-input .mc-kbd .px-card
│   │                        .kit-slot .hotbar .mc-tooltip .kit-dissolve-{bottom,top,left} .kit-rule .px-dot
│   ├── painterly.css        .kit-backdrop* .kit-hero* .kit-painted .kit-item-frame
│   ├── prose.css            .kit-prose doc typography (headings, lists, tables, quotes, footnotes, details…)
│   ├── code.css             .kit-code Shiki blocks (title bar, CSS line numbers, copy button)
│   ├── admonitions.css      .kit-adm (all MkDocs + VitePress + GitHub types) and .kit-tabs
│   ├── chrome.css           GlobalBar, footer, menus, theme + language menus, badges, tooltips, cards, hero layout
│   └── search.css           the search dialog (not in index.css: imported by the apps and the docs app)
├── assets/
│   ├── sprites.mjs          16×16 pixel sprites as text grids (the source of truth)
│   ├── build-assets.mjs     → icons/*.svg, components/pixel-icons.ts, theme/generated.css (incl. the backdrop
│   │                        tiles: a pure-JS rasteriser + PNG encoder, and the wordmark), theme/hero.css + hero-*.svg
│   └── icons/*.svg          36 crisp-edge sprites (grass, chest, pickaxe, map, book-quill, emerald, …)
├── components/            React + TS, SSR-safe (no window access during render)
│   ├── index.ts             barrel export
│   ├── GlobalBar.tsx (GlobalBar, GlobalNavList)  SiteFooter.tsx  LocaleSwitcher.tsx
│   ├── ThemeToggle.tsx (ThemeSwitcher; ThemeToggle = deprecated alias)
│   ├── PaintedBackdrop.tsx  PaintedHero.tsx  PixelButton.tsx  Card.tsx  Badge.tsx  Tooltip.tsx
│   ├── Hotbar.tsx (HotbarTabs, Pagination)  PixelIcon.tsx (PixelIcon, BrandIcon)  PlatformPicker.tsx
│   ├── SearchDialog.tsx  SiteSearch.tsx (useSiteSearch)  site-search.ts (the site-wide index)  focus.ts
│   ├── prefs.ts             cross-site preferences: cookies levimc_theme / levimc_lang, locale matching,
│   │                        pre-paint script (createPrefsInitScript)
│   ├── theme.ts (ThemeProvider, useTheme, themeInitScript)  locale.ts (usePreferredLocale)
│   ├── projects.ts (cross-site registry, canonical bar tabs)  version.ts (KIT_VERSION, generator meta)
│   ├── i18n.ts (chrome strings: en zh-CN zh-HK es ru de ja ko fr)  fonts.ts  menu.ts
│   ├── paint.ts             deterministic painted scenes (lily pond + block bridge / harbour sunrise + pixel boats)
│   └── pixel-icons.ts       generated sprite data
├── docs/                  the static docs engine
│   ├── node/                build side (Node): config.ts vite.ts site.ts content.ts links.ts nav.ts git.ts convert.ts
│   │   └── markdown/        preprocess.ts render.ts slug.ts shiki.ts shiki-themes.ts html-tags.ts image-size.ts
│   ├── shared/              types.ts routing.ts head.ts search.ts platform.ts strings.ts (used by build and browser)
│   ├── app/                 React app: index.html entry-client.tsx entry-server.tsx App.tsx data.ts enhance.ts
│   │                        layouts/ (DocLayout HomeLayout NotFound) components/ (SiteNav Sidebar Toc reveal
│   │                        SearchModal MobileDrawer DocFooter KitLink) docs.css styles.css layout-api.ts
│   ├── prerender.mjs        prerenderDocs(): one HTML file per URL, after the client and SSR builds
│   └── build.mjs            the three steps for a site with a Vite config of its own (the repository's sites are
│                            built by scripts/docs-sites.mjs instead)
├── ssg/prerender.mjs      prerenderRoutes() for the apps (src/main/, src/mods/)
├── static/                non-React chrome (generated and committed; regenerate with npm run kit:static)
│   ├── build-static.mjs  snippets.tsx  nojs-dark.mjs  static-entry.css  chrome-entry.css  chrome-reset.css
│   ├── kit.src.js  kit.src.globals.d.ts     the vanilla runtime's source and its build-time globals
│   ├── kit.js (built from kit.src.js)  theme-init.js  theme-init-static.js  theme-init-doxygen.js
│   ├── kit.css  kit-chrome.css  kit-nojs-dark.css
│   ├── globalbar.html  footer.html  i18n/{globalbar,footer}.<locale>.html
│   ├── pages/index.html  pages/404.html     former docs.levimc.org root redirect + themed 404
│   └── icons/  grass.svg  levimc.svg
├── scripts/               chrome-parity · serve-pages · linkcheck · url-parity · text-parity · smoke · shot · mkdocs-nav
├── tests/                 *.test.mjs (node --test; part of npm test): prefs (cookies, locale mapping, inline
│                          scripts) · static (no-JS dark CSS, kit.js: footer year, chrome-only translation) · render
│                          (rendering budget of the CSS, backdrop tiles, hero files) · locale-first · navtree ·
│                          network-links · platform · slug · convert · preprocess-hoist · doxygen-chrome
│                          cross-site.e2e.mjs (Playwright: preferences shared by levimc.org and a docs site)
└── demo/                  the engine's test sites (not published): docs.config.ts (suffix/directory/pymdownx) with
                           content/ and showcase/ (a custom layout), lip.config.ts (folder/html/vitepress) with
                           lip-content/, single.config.ts (the docs as a single-locale site)

doxygen/                   (repository root) the Doxygen chrome build-static.mjs writes — header.html, footer.html,
                           header-parts.json — with doxygen-kit.css, gen-header.mjs and patch-navtree.mjs, beside the
                           Doxyfile they serve
```

## Part of levimc.org

The kit is the one source of the LeviMC chrome — bar, footer, theme, docs engine, Doxygen header/footer — and since
2.31 every LeviMC site is built from this repository, in one package (`package.json` at the root; `npm ci` once):

| Site | Source | Built by |
|---|---|---|
| levimc.org (home, about, community, support, blog) | `src/main/` | `node scripts/build.mjs main` |
| LeviMC Mods (`/mods/`) | `src/mods/`, `content/mods/repos.txt` | `node scripts/build.mjs mods` (`scripts/mods/run.mjs`) |
| tutorials, FAQ, every project's docs | `content/<Site>/` | `node scripts/build.mjs docs` (`scripts/docs-sites.mjs`) |
| LeviLamina's API reference (`/LeviLamina/api/`) | `doxygen/` | `doxygen/build.sh`, after the build |

`npm run build` makes them all into `dist/`. A change to the kit reaches every site with that build: there is no
copy to refresh and no version to publish.
`<meta name="generator" content="levimc-kit <version>">` is on every page the kit renders.

`node src/kit/scripts/chrome-parity.mjs` fetches one page of every LeviMC site and checks that they show the same
bar and footer (local previews: `http://127.0.0.1:4173/=https://levimc.org`).

## Dependencies

The kit has no package of its own: what it imports is in the repository's one `package.json` (exact versions, one
`package-lock.json`, one `npm ci`). Node.js 22.22 or later (`engines`; CI and the deploy use Node 24): the build
scripts import the kit's TypeScript as it is, and Node strips the types.

| For | Packages |
|---|---|
| components and apps | react, react-dom, react-router, minisearch (the search dialog) |
| every build | vite, @vitejs/plugin-react, tailwindcss, @tailwindcss/vite, typescript and the @types packages |
| the docs engine (build time only) | unified, remark-parse, remark-gfm, remark-rehype, rehype-raw, hast-util-to-html, unist-util-visit, shiki, yaml, picomatch |
| a locale with `convertFrom` | opencc-js (the engine loads it only then) |
| the browser checks | playwright |

Playwright is a devDependency; its browser is installed once per machine with `npx playwright install chromium`.
The kit's browser scripts (`src/kit/scripts/smoke.mjs`, `text-parity.mjs`, `shot.mjs` and `tests/cross-site.e2e.mjs`)
resolve it from the package, or from `$LEVIMC_PW_DIR` (a directory containing `node_modules/playwright`) when that
is set.

## Docs sites: structure & commands

A docs site is a folder of `content/` with a `docs.config.ts`. [content/README.md](../../content/README.md) is the
guide to them (the sites, their URLs, the four sections, adding a project); this section is the engine's side.

```
content/<Site>/
├── docs.config.ts           defineDocsConfig({...})
├── pages/                   the markdown, images, logo …                    (contentDir: 'pages')
├── public/                  static files served at the site's root, optional (publicDir: 'public')
└── scripts/prebuild.mjs     run before every build and dev server (optional: generated pages, downloads)
```

Inside `contentDir`, `node_modules/`, every dot-folder and `public/` are never content. Nothing lists the sites: a
folder of `content/` with a `docs.config.ts` is one. A site is named by its folder (`lip`, `content/lip`) or by a
config file (`src/kit/demo/lip.config.ts`: the kit's test sites, built into `.build/docs/demo-lip/`).

| Command | What it does |
|---|---|
| `node scripts/docs-sites.mjs list` | the sites, one per line |
| `node scripts/docs-sites.mjs dev <Site>` (`npm run dev:docs -- <Site>`) | the site's `scripts/prebuild.mjs`, then a dev server that rebuilds the content as you edit (`--port <n>`, `--host`) |
| `node scripts/docs-sites.mjs build [<Site> …]` | per site, one process each: `scripts/prebuild.mjs`, client build → SSR build → prerender of every route into `.build/docs/<Site>/dist/` (with `404.html`, `sitemap.xml`, `.nojekyll`, the search indexes), then the link check of its pages. No name: every site. The build prints its warnings (unresolved links, missing anchors, escaped pseudo-tags) and writes them to `.build/docs/<Site>/.kit/warnings.txt` |
| `npm run build` (`node scripts/build.mjs`) | the whole of levimc.org into `dist/`; its `docs` part builds every site and copies each build into `dist/` (`node scripts/docs-sites.mjs merge dist`) |
| `npm run preview` | `dist/` served like GitHub Pages at `http://127.0.0.1:4173/` |
| `npm run typecheck` | covers every `docs.config.ts` with the kit and the apps |
| `npm run linkcheck` | internal links, redirects and anchors of the whole `dist/` |
| `npm run smoke` | the browser checks of the built site, every docs site among them ([Verification scripts](#verification-scripts)) |

`scripts/docs-sites.mjs` loads the config and runs Vite with the repository as its root (the engine's own app,
`docs/app/`, must be inside Vite's root) and no config file:

```js
import { build } from 'vite';
import { kitDocs } from '../src/kit/docs/node/vite.ts';
import { prerenderDocs } from '../src/kit/docs/prerender.mjs';

const out = '.build/docs/<Site>';
const plugins = () => kitDocs({ ...config, outDir: `${out}/dist` }, { configRoot: 'content/<Site>', workDir: `${out}/.kit` });
await build({ root: repo, configFile: false, plugins: plugins() });                         // client
await build({ root: repo, configFile: false, plugins: plugins(), build: { ssr: true } });   // → <workDir>/ssr/
await prerenderDocs({ root: repo, workDir });                                               // one HTML file per URL
```

`kitDocs` includes @vitejs/plugin-react and @tailwindcss/vite. `configRoot` is the site's folder: the config's
relative paths (`contentDir`, `publicDir`, `layouts`, `outDir`) resolve against it (default: Vite's root). `workDir`
is where the SSR bundle, `client-pages.json` and `warnings.txt` go (default: `<root>/.kit`).

The CI and deploy workflows check the repository out with `fetch-depth: 0`: the "Last updated" dates come from the
git history.

### What the engine produces

In the site's output folder (`.build/docs/<Site>/dist/`; with `i18n.localeFirst` it mirrors the host root and these
are under the site's base, see that option):

* `<route>` — real HTML per URL. MkDocs-style sites: `a/b.md` → `a/b/index.html` (URL `a/b/`);
  VitePress-style: `a/b.md` → `a/b.html` (URL `a/b` with `cleanUrls`, else `a/b.html`). GitHub Pages serves
  both `a/b` and `a/b.html`, so every URL a MkDocs or VitePress site had keeps working with **no redirect**.
* `<head>`: title, description, canonical, hreflang alternates (+ x-default), Open Graph, theme-color,
  the no-flash theme script and the root-only language redirect.
* `assets/pages/*.js` — one lazily loaded chunk per page (SPA navigation); the first load reuses the
  prerendered HTML (no duplicate download) and hydrates with `hydrateRoot`.
* `assets/search-<locale>.<hash>.json` — MiniSearch index per locale (CJK indexed as character
  bigrams), lazy-loaded on first search.
* `404.html` (themed, locale-aware), `sitemap.xml` (with hreflang), `.nojekyll`, content assets
  (MkDocs: every non-markdown file in `contentDir`, verbatim; VitePress: `public/` + hashed images).

## Site config API (`defineDocsConfig`)

```ts
// content/<Site>/docs.config.ts
import { defineDocsConfig } from '../../src/kit/docs/node/config.ts';
export default defineDocsConfig({ … });
```

| Option | Type / default | Notes (MkDocs ↔ VitePress) |
|---|---|---|
| `base` | `'/LeviLamina/'` | `site_url` path / `base` |
| `title`, `description` | string | `site_name` / `title` |
| `logo` | `'logo.svg'` or `{ src, alt, dark? }` | path relative to base; each project keeps its own logo |
| `favicon` | path | |
| `ogImage` | path or URL | `og:image` for social previews; defaults to `logo.src` |
| `project` | default = base segment | highlights the project in the GlobalBar "Docs" menu |
| `repo` | URL | the project's repository: the GitHub icon at the end of the docs header's resources slot and in the drawer ("<title> on GitHub"); the LeviMC bar's GitHub button stays the LiteLDev organisation |
| `editLink` | `'https://github.com/<org>/<repo>/edit/<branch>/<dir>/:path'` or `{ pattern: string \| (source) => url \| undefined, text?: { [locale]: label } }` | `:path` = path relative to `contentDir`; evaluated at build time |
| `contentDir` | string (required) | `docs_dir` / `srcDir` |
| `publicDir` | default `<contentDir>/public` if present, or `false` | VitePress `public/` (copied verbatim) |
| `copyContentAssets` | default `true` for `urlStyle: 'directory'` | MkDocs: copy every non-md file (logo.svg stays at `/LeviLamina/logo.svg`) |
| `exclude` | globs relative to contentDir | e.g. `['overrides/**']`; `node_modules`, dot folders, `.vitepress`, `public` are always excluded |
| `i18n.mode` | `'suffix'` \| `'folder'` | mkdocs-static-i18n (`x.md`, `x.zh.md`, `x.en.md` = default) / VitePress (`zh-CN/x.md`) |
| `i18n.defaultLocale` | locale code | |
| `i18n.locales[]` | `{ code, label, lang?, prefix?, suffix?, folder?, convertFrom?, formerPrefixes? }` | `prefix` defaults to `''` (default) / `'<code>/'`; `lang` is used for `<html lang>`/hreflang; `convertFrom: '<zh locale>'` generates Traditional Chinese from that locale (see below); its pages' relative links and images with a path segment naming the source locale (`../images/zh-Hans/x.svg`) point at the converted locale's file (`images/zh-Hant/x.svg`) where that file exists (kit 2.24); `formerPrefixes: ['zh/']` puts a redirect page at each page's old URL after a prefix change (kit 2.21) |
| `i18n.localeFirst` | default `false` | the language FIRST (kit 2.23, levimc.org's URLs): a locale's `prefix` goes in front of `base` (`/zh-Hans/LeviLamina/x/`); `outDir` mirrors the host root (`dist/LeviLamina/`, `dist/zh-Hans/LeviLamina/`, `dist/404.html`); assets, search indexes and `_kit/` stay under base; `formerPrefixes` are relative to base and may name the locale's own prefix (`['zh-Hans/', 'zh/']`). Preview with `serve-pages dist --base /`, link-check with `linkcheck dist --base /<Project>/ --locale-first zh-Hans,zh-Hant` |
| `i18n.fallback` | default `true` (suffix) / `false` (folder) | build default-locale content at localized URLs when a translation is missing (static-i18n `fallback_to_default`) |
| `urlStyle` | `'directory'` (default) \| `'html'` | MkDocs directory URLs / VitePress `.html` files |
| `cleanUrls` | `false` | html style: link `a/b` instead of `a/b.html` |
| `slug` | `'pymdownx'` \| `'vitepress'` | heading ids (see below); default by compat |
| `markdown.compat` | `'python-markdown'` (default for directory) \| `'commonmark'` | see [Markdown support](#markdown-support) |
| `markdown.containers` | `{ mkdocs?, vitepress? }` | which container syntaxes to recognise (default by compat) |
| `markdown.lineNumbers` | `true` | multi-line blocks; per block `:no-line-numbers` / `linenums="1"` |
| `markdown.codeTitle` | `'pygments'` (MkDocs `auto_title`: "C++", "GAS", "Text Only") \| `'lang'` \| `'none'` | |
| `markdown.languageAlias` | `{ xmake: 'lua' }` | extra fence-language aliases |
| `markdown.admonitionTitles` | `'mkdocs'` ("Note") \| `'vitepress'` ("TIP") | default titles |
| `markdown.autoTitle` | default `true` for python-markdown | MkDocs Material: pages without `# H1` get one from their nav title / file name |
| `markdown.literalBackslashes` | `false` | python-markdown only: keep backslashes Python-Markdown does not treat as escapes (`\<T\>` → `\<T>`, byte-identical to MkDocs) |
| `nav` | `NavEntry[]` or `{ [locale]: NavEntry[] }` | the sections (see [Navigation model](#navigation-model-kit-226)); MkDocs `nav` (verbatim YAML structure works) / VitePress `{ text, items }` objects |
| `navTranslations` | `{ [locale]: { 'User Guides': '用户指南' } }` | static-i18n `nav_translations` |
| `sidebar` | `'tabs'` (default) \| `'tree'` \| `false` \| `SidebarConfig` \| `{ [locale]: SidebarConfig }` | `'tabs'` = the LeviMC model: every top-level `nav` entry is a section (a tab) and its tree is the sidebar of its pages. The object forms (VitePress array / `{ '/guide/': [...] }` multi-sidebar) are **deprecated** (kit 2.19, build warning) but keep working |
| `layouts` | `{ name: './path/Component.tsx' }` | custom page layouts for `layout: <name>` frontmatter (props: `CustomLayoutProps` from `docs/app/layout-api.ts`) |
| `lastUpdated` | `true` | `git log` timestamp per file; silently absent without git history |
| `hostname` | `'https://levimc.org'` | canonical / og:url / hreflang origin (defaults to `sitemap.hostname`) |
| `sitemap` | `{ hostname }` \| `false` | |
| `head` | `[[tag, attrs, content?], …]` | extra head tags (VitePress format) |
| `outline` | `[2, 4]` (python-markdown) / `[2, 3]` (commonmark) | "On this page" levels (`outline: false` in frontmatter hides it) |
| `social` | `[{ icon: 'github'\|'discord'\|'telegram'\|'x'\|'youtube'\|'email', link, label? }]` | icons after the resources, at the end of the site column (the bar's GitHub button is always the LiteLDev organisation) |
| `footer` | — | deprecated in kit 2 and ignored: the footer is the same on every LeviMC site |
| `ui` | `{ [locale]: Partial<UiStrings> }` | override the docs UI strings (e.g. VitePress `docFooter`, `editLink.text`); leave the bar's and footer's labels to the kit |
| `titleTemplate` | `':title - :site Docs'` | every LeviMC docs site uses the default; home pages (every locale's `index`, and `layout: home`) get the template without `:title` (`LeviLamina Docs`), the 404 page `Page not found - LeviLamina Docs` |
| `header` | `{ tabsRow?, links? }` | the resources at the end of the site column: see [Header](#header-kit-222-the-levimc-bar-only) |
| `sidebarExpand` | `false` | open every sidebar group (overrides the collapse policy of the [navigation model](#navigation-model-kit-226)) |
| `outDir` | `'dist'` | |
| `searchExclude` | globs on page keys | |
| `redirects` | `{ 'old/page': 'new/page' \| 'https://…' }` — a redirect page at each old URL (keeps the `#hash`) | mkdocs-redirects |

`NavEntry` accepts every MkDocs and VitePress form:

```ts
'user_guides/install.md'                                  // title = the page's H1 in each locale
{ 'Install': 'user_guides/install.md' }                   // titled (translated via navTranslations)
{ 'User Guides': [ … ] }                                  // group
{ 'About': 'https://levimc.org/about/' }                  // external
{ 'Doxygen API': 'https://levimc.org/LeviLamina/api/' } // same site, no docs page (or '/LeviLamina/api/'):
                                                          // opened in place like a page, no external mark
{ text: 'Guide', link: '/guide/quick-start' }             // VitePress (root-absolute, locale prefix allowed)
{ text: 'Developer', items: [ … ], collapsed: true }      // VitePress group / dropdown
```

### Navigation model (kit 2.26)

One model on every docs site (and the Doxygen API, which generates its chrome from the LeviLamina docs' `_kit/nav.json`):

* **No header row of the docs' own.** Search is in the LeviMC bar (GlobalBar `search`), which sticks at the top.
* **The site column** (SiteNav) on every page, home included: the brand (logo + name → the docs home), then the
  **sections**, then the **resources** (`header.links`, then the `repo` GitHub link). Each section is exactly one
  sidebar tree: the current one is open, the others open in place on a click.
* **The five sections of a project's docs**, in this order and no others (kit 2.26, Install since 2.32; levimc.org's
  `content/<Project>/`):
  1. **Overview** — the home page itself, a section that is a link and has no pages (`{ text: 'Overview', link: '/' }`,
     the locale's home: `/zh-Hans/` …); it is the current section on the home page. The project introduced, with a
     short demo (a code sample, a screenshot).
  2. **Install** — one page, `install.md` at the root of the pages, a section that is a link like Overview
     (`{ text: 'Install', link: '/install' }`). The same headings on every project, in this order, leaving out those
     with nothing to say: *What you need*, *Install*, *Check that it works*, *Update*, *Other versions* (the releases
     page, betas, older versions), *Uninstall*, *Next steps* (the tutorials). It is the only place that says how to
     get the project: the overview, the guides, the tutorials and the FAQ link to it instead of repeating it, and
     levimc.org's home page leads to it. A tutorial keeps the one usual way in a step of its own, so that it still
     goes from nothing to one thing done, and names the Install page for the rest. No download button in the
     resources slot (`header.links`): the Install section is the way to the downloads.
  3. **Guides** — task guides, one feature each; troubleshooting last, in a `Help` group.
  4. **Concepts** — explanations: how it works, the model behind it.
  5. **Reference** — the complete external interface: API, protocol, CLI, configuration, files, supported versions.
     A same-site reference with its own tree and no docs pages (LeviLamina's Doxygen API,
     `{ 'C++ Reference': 'https://levimc.org/LeviLamina/api/' }`) is the **first** link of the Reference tree, so that
     the section's link in `nav.json` leads into it and the Doxygen pages mark Reference current.

  Labels: Overview / Install / Guides / Concepts / Reference; 概览 / 安装 / 指南 / 概念 / 参考 (Traditional Chinese
  概覽 / 安裝 / 指南 / 概念 / 參考). The tutorials and the FAQ are sites of their own sections (by task, by topic).
* **Sections' trees**: every doc page belongs
  to exactly one section — the build warns `nav: page '<key>' … is in no section` (home and 404 excepted; frontmatter
  `sidebar: false` opts a page out). Groups: all open when the section has ≤ 24 links, otherwise only the group holding
  the current page (`collapsed: false` keeps a group open, `collapsed: true` closed; `sidebarExpand` opens all).
* **Prev / next** stays inside the active section, never targets the home page and behaves the same in every locale.
* **Home** = a doc page (`index.md`: an H1, a lead paragraph, the introduction), in the Overview section: no banner.
  Its `<meta name="description">` is the config `description` unless the frontmatter sets one. (`layout: home`, the
  hero + features banner, still renders for sites outside levimc.org's docs, see below.)
* **Lint** (build warnings, tabs mode): `nav: top-level entry 'X' is not a section (…)` for a top-level page other than
  the home page and the Install page, or an external link; `nav: the home page's section 'X' must come first`;
  `nav: the Install page's section 'X' must come second, after the home page's`; `nav: section 'X' has no page`.

```ts
nav: [
  { Overview: 'index.md' },
  { Install: 'install.md' },
  { Guides: [{ 'Getting Started': ['guide/first-steps.md'] }, 'guide/usage.md', { Help: ['troubleshooting.md'] }] },
  { Concepts: ['concepts/how-it-works.md'] },
  { Reference: ['api/README.md', { Events: ['api/events/listen.md'] }, 'versions.md'] },
],
navTranslations: { zh: { Overview: '概览', Install: '安装', Guides: '指南', 'Getting Started': '入门', Help: '帮助', Concepts: '概念', Reference: '参考' } },
repo: 'https://github.com/LiteLDev/<project>',
```

The build also writes **`_kit/nav.json`** under the site's base (`dist/LeviLamina/_kit/nav.json`): per locale code
`{ lang, label, prefix, title, home, tabs: [{ text, link }],
resources: [{ kind: 'download' | 'changelog' | 'github', text, link }] }` with absolute paths (base included) — the
Doxygen header and drawer are generated from it.

Home pages: frontmatter `layout: home` with VitePress `hero` (`name`, `text`, `tagline`, `image`,
`actions[{ theme: brand|alt, text, link, platform? }]`) and `features[{ title, details, icon?, link? }]`.
An action with a `platform` (`windows`, `android`, `ios`, `macos`, `linux`) is for that platform: for the visitor's
platform (see [Content per platform](#content-per-platform)) its actions come first as brand buttons and the other
platforms' turn alt (the prerendered page keeps the frontmatter's order).

### Content per platform

For a product with versions for several platforms, one guide organised by task (not one guide per platform), as
Docusaurus (`groupId` tabs), Microsoft Learn (zone pivots) and most multi-platform docs do:

* **Where the platforms differ: tabs named after them** (`=== "Windows"` / `=== "Android"`, or `::: tabs` with
  `== Windows` lines; any language — the label must name exactly one of Windows, Android, iOS, macOS, Linux). All such
  tabs form one site-wide group: picking a platform switches every set on the page and is remembered (`localStorage`
  `levimc_platform`, shared by the docs sites on the origin). The selected platform is `?platform=<name>` in the URL
  (shareable links), else the visitor's last pick, else their device; a set without that platform keeps its tab, and
  a `#hash` naming a tab wins.
* **Where the processor matters too (downloads): tabs named after a target**, an operating system and an
  architecture named like a .NET runtime identifier: `win-x64`, `win-arm64`, `osx-arm64`, `osx-x64`, `linux-x64`. A
  label names one when it names the system and one architecture: `Windows x64`, `Windows arm64`,
  `macOS (Apple silicon)` / `macOS（Apple 芯片）`, `macOS (Intel)`, `Linux x64` (`x64`, `amd64`, `x86_64`, `Intel` are
  x64; `arm64`, `aarch64`, `Apple silicon` are arm64). `?platform=osx-arm64` selects one, and the visitor's pick is
  remembered as the target. A tab named after a system alone matches every architecture of it, and a visitor who
  chose only a system (an earlier `levimc_platform` value) gets the first tab of that system. The device: Client
  Hints (`navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness'])`, Chromium) where the browser
  gives them, else a Mac is taken for Apple silicon and anything else for x64 (`detectPlatformChoice`).
  `shared/platform.ts`: `PLATFORM_TARGETS`, `platformChoiceOfLabel`, `matchPlatform`, `platformName(target, lang)`
  (`macOS (Apple silicon)`, `macOS（Apple 芯片）`, `macOS（Apple 晶片）`), `preferredPlatformChoice[Async]`.
* **The same choice in an app:** `PlatformPicker` (a hotbar of toggle buttons, one per platform or target, labelled
  by `platformName` in the page's language) and `usePlatformChoice(options, fallback)` from `components/`: every
  picker and hook on the page follows the latest pick, which is remembered like a tab's (levimc.org's home page
  picks how to install lip with it).
* **A section for one platform:** a badge in its heading, `## Accounts <Badge platform="android" />` (not part of
  the heading id or the TOC). VitePress badges work too: `<Badge type="info|tip|warning|danger" text="…" />`.
* **A page for one platform:** frontmatter `platforms: [windows]` shows the platform badges under the title.
`icon` may be a kit sprite name (`grass`, `chest`, `pickaxe`, `map`, `compass`, `emerald`, `diamond`,
`bookQuill`, `torch`, …) or an emoji. Links in frontmatter are resolved like markdown links.

Generate a starting config from an existing `mkdocs.yml`:
`node src/kit/scripts/mkdocs-nav.mjs path/to/mkdocs.yml > docs.config.generated.json`.

### Header (kit 2.22: the LeviMC bar only)

The LeviMC bar (GlobalBar) is the top of every page and carries the docs' search (a field-like trigger with the
`Ctrl` `K` hint, an icon at ≤ 1180px), the language menu, the theme menu and the GitHub button (the LiteLDev
organisation). On docs sites it sticks. There is no second row: the project's identity and sections are the site
column's (SiteNav).

* **Resources** (`header.links`, then `repo`), at the end of the site column: `header.links: [{ kind: 'download' |
  'changelog', link, text?: { [locale]: label } }]` — `download` is the accent button, `changelog` a text link; a
  `link` that is a page of the site gets the locale's version of it ('download' → 'ja-JP/download'); labels default to
  the kit's (Download / Changelog in 9 languages). Then the project's GitHub link from `repo`. This is the only place
  for links that leave the docs.
* **Phones and tablets (≤ 960px)**: the LeviMC bar's menu button — the same button in the same place on every LeviMC
  site — opens the docs drawer (`GlobalBar onMenu`): the sections, the current section's tree titled with the
  section, **Resources**, then the LeviMC links. The drawer's body is rendered on its first opening only.
* `header.tabsRow` is ignored (there are no tabs to fit).

### Language behaviour

* The language menu in the LeviMC bar is the site's locale switcher: it lists the site's locales, opens the
  same page in the chosen locale (falls back to that locale's home) and stores the choice as the visitor's
  **cross-site language preference** (cookie `levimc_lang`, see [Cross-site preferences](#cross-site-preferences)).
* Auto-redirect runs only when the URL is exactly the site root (`base` or `base/index.html`):
  1. a stored preference always wins (also when the visitor followed an in-site link to the root) and maps to
     the nearest locale — `zh-CN`/`zh-HK`/`zh-TW`/`zh` → the site's zh variant (Traditional prefers a
     `zh-HK`-style locale), else the base language, else English;
  2. without one: not after an in-site link (an explicit "[English](/)" is followed as written), otherwise the
     first `navigator.languages` entry that matches a locale.
* Deep links and explicit locale URLs are never redirected, and visiting them never changes the stored
  preference — only the language menu does (a Ctrl/⌘/Shift/Alt-click opens the other locale elsewhere and
  stores nothing). Kit 1.0's per-site choice (`localStorage['levimc-locale-<site>']`) is moved into the
  preference once.
* **Chrome language rule** (the same on levimc.org, Mods, the docs and the static/Doxygen pages): the LeviMC chrome
  (bar, footer, the drawer's LeviMC links) is in the content language when the site has the visitor's preferred
  language; otherwise it follows the stored preference if the kit has chrome strings for it (the 9 UI languages),
  else the content language. E.g. `levimc_lang=de` on LeviLamina (en/zh/zh-Hant): German bar and footer over English
  content; `levimc_lang=zh-TW` there: the chrome follows the page. The pre-paint script hides the chrome until the
  app has re-rendered it (`chromeLocales` = the UI languages none of the site's locales covers), so it never
  flashes in the other language first.
* A site with a single locale: the bar's menu offers the 9 chrome languages; a choice re-renders the chrome in
  place — the content stays in the site's language (`demo/single.config.ts`).

| Option | Type / default | Notes |
|---|---|---|
| `header` | `{ tabsRow?: 'auto' \| true \| false; links?: { kind: 'download' \| 'changelog'; link: string; text?: { [locale]: string } }[] }` | see [Header](#header-kit-222-the-levimc-bar-only) |
| `sidebarExpand` | `false` | open every group of every section. Default: all groups of a section with ≤ 24 links, else only the group holding the current page (plus `collapsed: false`) |

`social`: other icons (Discord, …) after the resources, at the end of the site column. The bar's GitHub button
always opens the LiteLDev organisation; the project's repository is the resources' GitHub link (`repo`).

## Markdown support

Build-time only (unified → remark-parse + remark-gfm → mdast transforms → remark-rehype → rehype-raw →
kit transforms → Shiki → HTML). No markdown is parsed in the browser.

* **GFM**: tables, strikethrough, autolinks, task lists; **footnotes** (definitions may contain fenced code);
  YAML frontmatter; raw HTML (`<details><summary>`, `<br/>`, `<u>`, …).
* **Unknown pseudo-tags** such as `Array<NBT object>` are escaped and render literally (MkDocs dropped them;
  this is a visible text *improvement*), and are listed as build warnings.
* **MkDocs**: admonitions `!!! type "Title"` (case-insensitive type, optional title, `""` = no title,
  4-space indented bodies with fences/lists/tables/nested admonitions; allowed directly after a paragraph
  line), collapsible `??? type` / `???+ type`, pymdownx tabs `=== "Label"` (consecutive blocks form one
  set, `===!` starts a new set, `===+` selects; a tab whose label names one platform — Windows, Android, iOS, macOS,
  Linux — starts selected for visitors on that platform), `{#id}` / `{: #id }` heading ids. VitePress sites turn them
  on with `markdown.containers: { vitepress: true, mkdocs: true }`.
  Types: note abstract(summary, tldr) info(todo) tip(hint, important) success(check, done)
  question(help, faq) warning(caution, attention) failure(fail, missing) danger(error) bug example
  quote(cite); unknown types use the note style.
* **VitePress**: containers `::: tip|info|warning|danger|details [Title]` (`{open}` for details),
  `::: code-group`, `::: tabs` with a `== Label` line starting each tab (`==+ Label` starts selected; the
  vitepress-plugin-tabs syntax; platform labels join the platform group, see
  [Content per platform](#content-per-platform)), GitHub alerts `> [!NOTE|TIP|IMPORTANT|WARNING|CAUTION]`, `<span v-pre>` (kept; `{{ }}`
  is never interpolated), fence meta `{1,3-5}` / `[file.js]` / `:line-numbers`.
* **`compat: 'python-markdown'`** (MkDocs sites) reproduces Python-Markdown's block rules so the text and
  structure match what MkDocs rendered: 4-space list nesting (2–3-space items are siblings), a list
  cannot interrupt a paragraph, an un-indented block after a blank line ends the list, an indented
  paragraph block inside a list keeps later `-` lines literal, `#Heading` without space, block-level raw
  HTML is captured to its closing tag (even inside list items), tables need a blank line before them and
  pipes inside code spans don't split cells, and code spans are trimmed. pymdownx extras that are configured but unused
  (betterem, caret, mark, tilde, critic, keys, smartsymbols, emoji, arithmatex…) are ignored.
* **Code**: Shiki with the kit's dual themes (all token colours ≥ 4.5:1), class-based tokens, CSS line
  numbers (never copied), title bar with the language (pymdownx `auto_title` names) or file name, copy
  button. Languages: cpp/c/c++, js/javascript, ts/tsx/jsx, lua, json/jsonc, shell/sh/bash/console,
  powershell, bat/batch/cmd, sql, asm, md, cmake, python, yaml, toml, xml/svg, html, css, go, csharp,
  ini, diff, rust, java, kotlin; `text`/`log`/unknown → plain.
* **Escapes**: standard CommonMark backslash escapes by default, so `### Observable\<T\>` renders — and appears
  in the TOC, search, sidebar, prev/next and `<title>` — as `Observable<T>`. All labels use the rendered plain
  text (inline code, emphasis and entities resolved). MkDocs printed a stray backslash there
  (`Observable\<T>`, Python-Markdown does not escape `<`); `markdown.literalBackslashes: true` reproduces that
  byte for byte if ever needed. Heading ids are unaffected (`#observable` either way).
* **Heading ids**: `pymdownx` = Python-Markdown toc + `pymdownx.slugs.slugify(case='lower')` (text →
  strip tags → NFC → lowercase → drop chars outside `[\w\- ]` (Unicode) → spaces to `-`, no trimming,
  duplicates `_1`, `_2`; "🔑 SQL数据库" → `-sql数据库`). `vitepress` = @mdit-vue slugify (duplicates `-1`).
  Verified identical to what MkDocs generated on every LeviLamina/LSE page.
* **Links** are rewritten at build time to the target's canonical, base-prefixed URL: relative `.md`
  (with/without locale suffix, `./`, `../`, anchors), extensionless VitePress links, root-absolute links
  (`/zh-CN/guide/x`), own-origin absolute links. The current page's locale wins when that translation exists
  (static-i18n semantics); `x.zh.md` / `/zh-CN/…` pin a locale. External links get
  `target="_blank" rel="noopener"`. Unresolvable links and missing anchors are build warnings.

## Apps (levimc.org, LeviMC Mods)

The site's two React apps — levimc.org itself (`src/main/`) and LeviMC Mods (`src/mods/`, published at `/mods/`) —
import the kit's theme, components and prerenderer by relative path. Both have the same parts:

```
src/main/   (src/mods/)
├── index.html                 placeholders the app's Vite config fills in <head> (the pre-paint scripts, the fonts),
│                              <!--app-head--> and <div id="root"><!--app-html--></div> for the prerender
├── styles.css                 @import "../kit/theme/tailwind.css"; @source "./";
├── App.tsx                    routes in <ThemeProvider>; .kit-shell → <PaintedBackdrop/> <GlobalBar sticky …/> … <SiteFooter/>
├── entry-client.tsx           hydrateRoot(…)
├── entry-server.tsx           export function render(url) → { html, head, lang }
├── prerender.mjs              prerenderRoutes({ routes, notFound }) from ../kit/ssg/prerender.mjs
└── vite.config.ts             plugins: [react(), tailwindcss(), …]
```

`<head>`: the pre-paint script must run before CSS paints — an inline `<script>` with `createThemeInitScript(…)`
(`legacyTheme` / `legacyLang` migrate a site's old localStorage keys once, levimc.org:
`{ legacyTheme: ['theme'], legacyLang: [{ key: 'locale', map: … }] }`; `speculation` says which same-origin pages
the browser may prerender), then the fonts (`FONT_HEAD_HTML` from `components/fonts.ts`): preconnect to
fonts.googleapis.com / fonts.gstatic.com and the css2 URL for Inter, Manrope, JetBrains Mono (`display=swap`;
`theme/fonts.css` adds metric-matched fallbacks, so the swap does not shift the layout). CJK uses the system stack —
never ship a CJK webfont. `src/main/prepaint.ts` and `src/main/vite.config.ts` are the example.

The GlobalBar is the app's only header (`sticky`), with the app's own languages:

```tsx
<GlobalBar
  current="mods" locale={chrome} sticky
  languages={{ options: LOCALES.map(({ code, label, lang }) => ({ code, label, lang, href: alternates[code] })), current: locale.code }}
  siteOrigin="https://levimc.org" linkComponent={RouterLink}   // same-site bar links stay in the app
  isAppPath={isAppPath}                                        // …but only the paths this app's router renders
  search={siteSearch.bar}                                      // useSiteSearch(): the search of every LeviMC site
/>
<SiteFooter locale={chrome} siteOrigin="https://levimc.org" linkComponent={RouterLink} isAppPath={isAppPath} />
```

The apps and the docs sites share the levimc.org origin, and each app's router renders only its own part of it: a
bar or footer link into another part must be an ordinary link that loads it. `siteOrigin` + `linkComponent` hand
same-site links to the app's router, and the app keeps the others out of it (`isAppPath`, or in the link component
itself: `src/main/components/SiteHeader.tsx`, `src/main/other-sites.ts`).

**Language.** Both apps prerender every page in the language of its URL (`/about/`, `/zh-Hans/about/`,
`/zh-Hans/mods/`), so no page waits for the language; the language menu's options are links to the same page in each
language (`href`), and a choice is stored as the cross-site preference. Only the root redirects by the stored
preference or the browser's language (`localeRedirectScript`, `docs/shared/head.ts`, as on the docs). A stored
language the app has no pages in but the kit has chrome strings for (de, ja …) is the bar's and footer's language:
the pre-paint script adds `html.kit-chrome-pending`, which hides them (`visibility: hidden`, no layout shift) until
the app has rendered them in it and calls `revealPendingChrome()`; a CSS fail-safe shows them after 1.5 s.

For an app whose language is state, not a URL, the kit has `usePreferredLocale(locales, fallback)` (`locale.ts`): it
renders the fallback locale on the server and the first client render (no hydration mismatch), then switches to the
preferred one right after hydration, before the next paint. With `createThemeInitScript({ appLocales: { locales,
prerendered } })` the pre-paint script adds `html.kit-chrome-pending` and `html.kit-content-pending` exactly when the
app will switch, so the prerendered language is never painted first. Neither app of the site uses it now.

**Prerender.** Each app is built in three steps, from the repository root for levimc.org (`scripts/build.mjs`) and
in `.build/mods/` for LeviMC Mods (`scripts/mods/run.mjs`):

```sh
vite build src/main
vite build src/main --ssr entry-server.tsx --outDir <repo>/.kit/ssr
node src/main/prerender.mjs
```

```js
// src/main/prerender.mjs
import { prerenderRoutes } from '../kit/ssg/prerender.mjs';
const { files } = await prerenderRoutes({ routes: ROUTE_PATHS, notFound: NOT_FOUND_PATH });
// src/mods/prerender.mjs: prerenderRoutes({ routes, base: '/mods/', … })
```

`prerenderRoutes` reads the client build's `dist/index.html` and the SSR module `.kit/ssr/entry-server.js` in the
working directory (`root`, `distDir`, `ssrEntry` change that). Routes are written directory-style (`/about/` →
`about/index.html`); use trailing-slash routes in react-router (`path="/about/"`) and link to them exactly (the
canonical URLs in `components/projects.ts` all end in `/`). It also writes `404.html` and `.nojekyll`, inserts the
head and body with replacement functions (content may contain `$&`) and adds
`<meta name="generator" content="levimc-kit <version>">` unless the page has one.

## Cross-site preferences

Theme and language are one choice for all of levimc.org and *.levimc.org (`components/prefs.ts`):

| Preference | Cookie (`Domain=levimc.org; Path=/; SameSite=Lax; Secure; Max-Age=1 year`) | localStorage mirror |
|---|---|---|
| theme | `levimc_theme` = `auto` \| `light` \| `dark` (Auto = follow the system, live; the default) | `levimc-theme` |
| language | `levimc_lang` = a BCP-47 tag, e.g. `zh-CN` | `levimc-lang` |

* The cookie wins; localStorage is the fallback where cookies are not available (it is also what kit 1.0
  wrote, so a 1.0 choice is copied into the cookie once). Outside levimc.org (localhost, previews) the cookie is
  host-only, and `Secure` only on https.
* The pre-paint script (`themeInitScript` / `createPrefsInitScript`) reads both before the first paint:
  `html.dark`, `html[data-theme-pref]`, `color-scheme` and `html[data-kit-lang-pref]`.
* Changing either on one site applies on every other on its next load (and when a tab regains focus).
* Each site maps the language preference to its nearest locale with `matchLocale` / `pickLocale`:
  `zh-CN`/`zh-HK`/`zh-TW`/`zh` → the site's zh variant (Traditional tags prefer `zh-HK`/`zh-TW`), otherwise
  the base language, otherwise English. The same algorithm runs inline (`PREFS_CORE_JS`) in the docs root
  redirect and kit.js; `tests/prefs.test.mjs` keeps both in step.
* `tests/cross-site.e2e.mjs` proves the sharing in Chromium with the real cookie rules of https://levimc.org,
  between levimc.org's own pages and a docs site (requests answered from the local build; `npm run smoke`).

## Components

All components are SSR-safe and render identical markup on server and client.

| Component | Purpose / key props |
|---|---|
| `GlobalBar` | the bar at the top of every LeviMC site — identical everywhere: the LeviMC mark (`BrandMark`), tabs **Home · Tutorials · FAQ · Projects ▾ · Mods · Blog · Community · About** (`globalNav()`), then **language menu · theme menu · GitHub** (→ LiteLDev); below 960px the tabs fold into one menu (≤ 400px the triggers lose their chevrons). **Projects ▾** lists the projects of `PROJECTS` (`projects.ts`) that have a documentation site (`docs`), two by two under a "Docs" heading with their count, on a faint wash of the primary: each tile (logo, name, two-line blurb) is one link to the project's docs; the GitHub organisation at the bottom; on phones it is a collapsed section of the menu. Props: `current` (`'home'\|'tutorials'\|'faq'\|'projects'\|'mods'\|'blog'\|'community'\|'about'`), `currentProject` (docs: marks the project and the Projects tab), `locale`, `strings`, `languages` (`{ options, current, onSelect?, linkComponent? }`; the options are the site's locales, named the kit's way — `uiLocaleName`; omitted → the 9 chrome languages, stored as the preference, then `onLanguageChange` or a reload), `siteOrigin` + `linkComponent` + `isAppPath` (same-site links through the router), `menu` (false when the site's own drawer carries the links, see `GlobalNavList`), `onMenu` + `menuOpen` + `menuControls` (≤ 960px the menu button — the same button in the same place as levimc.org's, `data-kit-gbar-menu` — is a plain `<button>` that calls `onMenu` instead of opening the bar's dropdown, with `aria-expanded={menuOpen}`, `aria-controls={menuControls}`, `aria-haspopup="dialog"`: docs sites open their drawer with it; static markup renders it with `menuControls` alone and binds it in kit.js), `sticky`. The LeviMC wordmark is a mask (`.kit-wordmark`, no webfont), its text kept for assistive technology. `github`, `brandIcon` and `currentDocs` are deprecated (ignored / alias). A labelled region; `<details>` menus work without JS. No props to hide, add or reorder tabs or controls |
| `GlobalNavList` | the bar's tabs + the Projects menu as a vertical list (the bar's phone menu; the "LeviMC" part of the docs drawer) |
| `ThemeSwitcher` | the theme menu: **Auto** (default; follows `prefers-color-scheme` live) / Light / Dark. Trigger sprite + name and the checked item come from `html[data-theme-pref]` via CSS (right before hydration and on static pages); the choice is the cross-site `levimc_theme` cookie. `ThemeToggle` is a deprecated alias |
| `LocaleSwitcher` | `options[{ code, label, short?, lang, href? }]` (`href` → links to the equivalent page; none → buttons), `current`, `onSelect(code, option)`, `persist` (default: store `lang` as the cross-site `levimc_lang`; a modified click on a link opens it elsewhere and stores nothing), `linkComponent`, `showLabel` |
| `SiteFooter` | the theme's painting (Nymphéas / Impression, soleil levant) rising out of the page through the pixel dissolve; LeviMC mark + tagline, Discord/Telegram/X/YouTube/GitHub/email, © year · Support us; `strings`, `year`, `siteOrigin` + `linkComponent` + `isAppPath`, `locale` |
| `PaintedBackdrop` | impressionist dabs + brush + grain as the page root's own scrolling background (`:root:has(.kit-backdrop)`: the `.kit-backdrop` element it renders is only the hook and paints nothing — keep body and the app shell transparent); optional painted scene band at the page top (`scene`, `sceneHeight`, `sceneOpacity`, `sceneOpacityDark`) |
| `PaintedHero` | painted pond with block-built Japanese bridge (light) / harbour sunrise with pixel boats (dark) on the right of the copy (`--kit-hero-paint-x`), its left and bottom edges in the pixel dissolve (below 961px: a band on top; `.kit-hero-strip` keeps it on the right); `eyebrow name text tagline actions image badge aside linkComponent`. The default scenes are SVG files drawn by `theme/hero.css` (imported by the component; the bundler fingerprints them and only a page with a hero loads one, preloaded by the system theme — no per-page SVG, no flash, nothing in other pages' CSS); a custom `seed` or `pixelProps={false}` renders inline SVG |
| `PixelButton` | Minecraft bevel button: `variant` default/primary/ghost, `size`, `icon`, `iconRight`, `href` |
| `Card` | stepped-corner card with sprite in an inventory slot; `title description icon eyebrow href footer` |
| `Badge` | `tone` grass/diamond/gold/redstone/enchant/stone/pond, `pixel` (micro-label: small spaced capitals, Latin only) |
| `Tooltip` | Minecraft item tooltip on hover/focus (`aria-describedby`) |
| `HotbarTabs`, `Pagination` | hotbar-style tabs (WAI-ARIA keyboard) and numbered pagination (crawlable hrefs) |
| `PlatformPicker`, `usePlatformChoice`, `choosePlatform` | the visitor's platform or target (`win-x64`, `osx-arm64` …) as a hotbar of toggle buttons (`aria-pressed`, `data-platform`); the hook gives the option to show (undefined until hydrated), shared by every picker on the page and with the docs' platform tabs (see [Content per platform](#content-per-platform)) |
| `PixelIcon`, `BrandIcon` | 16×16 crisp sprites (`PIXEL_ICONS`); vector brand marks for social links |
| `prefs.ts` | `readPref`/`writePref`, `readThemeChoice`, `readLanguagePreference`, `preferredLanguages`, `matchLocale`, `pickLocale`, `createPrefsInitScript`, `prefCookieDomain`, `serializePrefCookie`, `PREFS_CORE_JS` |
| `locale.ts` | `usePreferredLocale(locales, fallback)` → `[locale, setLocale]` for apps whose language is state (syncs before paint, then `revealPendingChrome()`) |
| `menu.ts` | `useDismissableDetails(ref)` for every `<details class="kit-menu">`: outside click, Escape, focus leaving, one open at a time; `role="menu"` panels (language, theme) get the WAI-ARIA menu keys — Enter/Space open on the checked item, ArrowDown/ArrowUp on the trigger open on the first/last item, inside Arrow keys move (wrapping), Home/End jump (`menuKey`, `focusMenuOnOpen`; kit.js does the same on static pages) |
| `theme.ts` | `ThemeProvider`, `useTheme()` (`preference`, `resolved`, `setPreference`), `themeInitScript`, `createThemeInitScript(opts)`, `applyThemePreference`; `'system'` is accepted as an alias of `'auto'` |
| `projects.ts` | `LINKS`, `PROJECTS`, `DOCS_PROJECTS` (the projects with docs: LeviLamina, LegacyScriptEngine, lip, LeviLauncher, Be.D.D., bedboo), `MODS_SITE`, `SOCIAL`, `globalNav()`, `sameSitePath()` — the redirect-free canonical cross-site URLs |
| `i18n.ts` | `uiStrings(lang, overrides)`, `resolveUiLocale(tag)`, `UI_LOCALE_NAMES` for en, zh-CN, zh-HK, es, ru, de, ja, ko, fr |
| `version.ts` | `KIT_VERSION`, `KIT_GENERATOR`, `GENERATOR_META` |
| `fonts.ts` | `GOOGLE_FONTS_HREF`, `FONT_HEAD_HTML`: Inter, Manrope, JetBrains Mono (no Silkscreen since 2.19) |
| `paint.ts` | `lilyPond`, `harborSunrise`, `sceneToSvg(scene, { preserveAspectRatio? })` — static scenes (no `animate` since 2.19) |

Stable test hooks: `data-kit-theme-toggle` (theme menu trigger), `data-kit-theme-value`, `data-kit-locale-switcher`,
`data-kit-lang-value`, `data-kit-gbar-menu`, `data-kit-search-trigger`, `data-kit-nav-toggle`, `data-kit-subnav`,
`data-kit-copy`, `data-kit-tabs`, `data-doc-content` (wraps rendered markdown only), `data-kit-globalbar`,
`data-kit-footer`, `data-kit-hero`.

Canonical cross-site URLs (exact, no redirect): Home `https://levimc.org/`, Projects (the tab without its menu: the
GitHub organisation) `https://github.com/LiteLDev`, Community `https://levimc.org/community/`, About `https://levimc.org/about/`,
Mods (LeviMC Mods, id `mods`) `https://levimc.org/mods/`, Blog `https://levimc.org/blog/`, GitHub
`https://github.com/LiteLDev`,
Docs `https://levimc.org/{LeviLamina,LegacyScriptEngine,lip,LeviLauncher,BeDD,bedboo}/`,
Discord `https://discord.gg/v5R5P4vRZk`, Telegram `https://t.me/LiteLoader`, X `https://x.com/levimc_org`,
YouTube `https://www.youtube.com/@LeviLamina`, `mailto:contact@levimc.org`. lip's repository is
`https://github.com/LiteLDev/lip` (`futrime/lip` redirects).

## Static chrome & Doxygen

`static/` is generated by `npm run kit:static` (`static/build-static.mjs`) and committed. It is the chrome for pages
React does not render: the Doxygen API reference (`doxygen/`), the site's 404 and legacy redirect pages
(`src/legacy/build.mjs`); the builds also read `nojs-dark.mjs`.

* `kit.css` — full theme incl. Tailwind preflight (standalone pages). `kit-chrome.css` — the chrome plus the docs
  layout (`docs/app/docs.css`: header row, drawer, sidebar title, table of contents), no preflight, cascade layers
  flattened so it can sit next to foreign CSS (Doxygen); its scoped reset comes first so host element styles lose and
  every kit rule wins. It emits every theme token (`theme(static)`) and only the utilities of the bar and footer
  snippets (no source detection: a `.contents` or `.table` utility would hit Doxygen's own classes).
  `kit-nojs-dark.css` — kit.css's `.dark` rules as `:root` rules, for
  `<noscript><link … media="(prefers-color-scheme: dark)"></noscript>`.
* `globalbar.html`, `footer.html` (+ `i18n/*.<locale>.html`) — rendered from the React components, with
  `data-kit-t` hooks for the runtime translation.
* `kit.js` (built from `kit.src.js`) — the GlobalBar's theme and language menus, `<details>` menus (outside
  click, Escape, focus leaving, the menu keys of `menu.ts`), the footer year, and the chrome language: the bar,
  footer and skip link follow the visitor's language preference (strings for the 9 UI locales are embedded; each
  translated part gets `lang=<locale>`); choosing a language stores it for every LeviMC site and translates the
  chrome in place. Only the chrome is translated — page content stays as written, including copies of chrome
  strings in it (the 404 page's project cards stay English like the rest of the page). On Doxygen pages it runs the
  docs header and layout (below).
* `theme-init.js` (React apps), `theme-init-static.js` (static pages: also hides the chrome for ≤ 1.5 s while
  kit.js translates it, so it never flashes in English), `theme-init-doxygen.js` — blocking head scripts.
* `pages/index.html` (the former docs.levimc.org root → levimc.org redirect, redirect tags before any stylesheet, with
  project cards) and `pages/404.html` (the one 404 of every site: `.kit-notfound` card with the red "Error 404"
  label, title `Page not found - LeviMC Docs`, the levimc.org action, then the projects with docs): skip link,
  generator meta, no-JS dark theme, footer year, the LeviMC mark as favicon; they reference assets under
  `/levimc-kit/` (`--asset-base`). `src/legacy/build.mjs` builds the site's legacy redirect pages from
  `pages/404.html`, points them at `/_kit/` and copies exactly what they reference into `dist/_kit/`.

### LeviLamina Doxygen (`doxygen/`)

The API reference carries the docs pages' header, generated from the docs build's navigation, so the two never
drift. Its sources are in `doxygen/` at the repository root: the `Doxyfile`, `DoxygenLayout.xml`, `mainpage.md`,
`logo.svg`, and the kit's parts — `doxygen-kit.css`, `gen-header.mjs`, `patch-navtree.mjs`, and `header-parts.json`,
`header.html`, `footer.html`, which `static/build-static.mjs` writes there. `doxygen/build.sh` runs it all from the
repository root after `npm run build`:

```sh
# the docs build wrote dist/LeviLamina/_kit/nav.json; without --nav: the kit's copy of LeviLamina's sections
node doxygen/gen-header.mjs --nav dist/LeviLamina/_kit/nav.json --out .cache/doxygen/header.html \
  --chrome-out .cache/doxygen/kit-dox-chrome.js --footer doxygen/footer.html --footer-out .cache/doxygen/footer.html
doxygen doxygen/Doxyfile                                  # → dist/LeviLamina/api/
node doxygen/patch-navtree.mjs dist/LeviLamina/api
```

```
INPUT                  = .cache/doxygen/LeviLamina/src/…  doxygen/mainpage.md   (LiteLDev/LeviLamina, checked out there)
HTML_HEADER            = .cache/doxygen/header.html                  (generated)
HTML_FOOTER            = .cache/doxygen/footer.html                  (generated)
HTML_EXTRA_STYLESHEET  = .cache/doxygen/doxygen-awesome-css/doxygen-awesome.css src/kit/static/kit-chrome.css doxygen/doxygen-kit.css
HTML_EXTRA_FILES       = src/kit/static/kit.js .cache/doxygen/kit-dox-chrome.js   (the second generated)
USE_MDFILE_AS_MAINPAGE = doxygen/mainpage.md                         (also listed in INPUT)
HTML_COLORSTYLE_HUE    = 135   SAT = 40   GAMMA = 90                 (Doxygen's own images in the kit green)
```

Everything fetched or generated goes to `.cache/doxygen/` (git-ignored). `doxygen/header-parts.json` holds the
React-rendered parts gen-header needs (bar, LeviMC links, sprites, chrome strings, the nav-fit script) — gen-header
itself has no dependencies. `doxygen/header.html` is the same header rendered from the fallback nav
(`build-static.mjs`). Drop `doxygen-awesome-darkmode-toggle.js` (kit.js owns the theme and keeps `html.dark-mode` /
`html.light-mode` in sync).

**Header.** `<title>`: `$title - LeviLamina API`. The LeviMC bar (its language menu lists the docs' locales — the
API is one English reference for all of them; a choice relabels the bar, footer and the site column in place and
is stored like on the docs; a preference the docs have no locale for still translates the chrome). The bar sticks, and
its search slot holds Doxygen's search box in the docs trigger's frame (same size, sprite, `Ctrl` `K` hint,
icon-only at ≤ 1180px; Ctrl/⌘+K and `/` focus it; the results open as a framed panel under it). kit 2.22: no header
row — `#top` only holds Doxygen's own menubar and phone menu, hidden at every width. The tree's column is headed by
the docs' site column markup (`.kit-sitenav`: brand → the docs home, the sections of nav.json with the one under
`<base>api/` current).

**Drawer** (≤ 960px): the LeviMC bar's menu button (GlobalBar `onMenu` markup,
`[data-kit-gbar-menu]`) opens the docs drawer markup — the sections, the API Reference tree (Doxygen's tree, moved in
while open), Resources, the LeviMC links; focus trap, Escape, scrim click, scroll lock.

**Layout.** One breakpoint (960px) like the docs. The painted backdrop is the root's background (`.kit-backdrop`
hook; `html`, `body` and Doxygen's wrappers paint nothing over it). The page scrolls (not Doxygen's panes), the tree is
the docs sidebar (sticky, titled with the section, chevrons on the right, the dotted rail, the current page's row;
shown once navtree.js has opened it on the current page), the page sits in the docs' column (47.95rem = 76ch of
Inter, in rem so it does not jump when the web fonts arrive), "On this page" is the docs' TOC built by kit.js from the
page's sections (sticky from 1281px, the docs' dropdown above the title below that, its place reserved from the static
HTML), and the LeviMC footer runs across the page. header.html opens a `.kit-dox-page` grid that footer.html closes.

**Content** in the docs' visual language (doxygen-kit.css): the docs' type (16px / 1.75, metric-matched fallbacks),
H2/H3 with the hairline and the `#` permalink, member tables as docs tables (full width, 1px frame, hairlines),
member documentation as code blocks (the memtitle as the title bar), fragments and source listings as `.kit-code`,
`@note` / `@warning` / `@bug` / `@deprecated` / `@todo` / `@pre` … as `.kit-adm` admonitions, the A–Z bar as a hotbar,
the class index in columns, file and directory lists with the kit sprites, thin themed scrollbars, both themes.

**Performance.** `patch-navtree.mjs` makes navtree.js render a window of 150 entries around the current page in long
lists (the ~9,700-entry Class List) with a "Show all N" row, drops its sync-icon, pane-sizing and pane-splitter
work and its own outline, and expands, collapses and scrolls to the current entry without jQuery animations (each
frame of those re-styled the whole page). It also splits the tree data scripts above 256 KB: every child list above
4 KB moves into a script of its own that navtree.js loads on demand (the Class List script 2.4 MB → 1.1 MB). kit.js
builds the tree when the browser is idle (≤ 960px: when the drawer's menu button is pressed, with a static placeholder
until it is ready); the outline's
scroll-spy binary-searches cached targets and touches classes only when the section changes; `div.memitem` and
`table.memberdecls` are `content-visibility: auto` (kit.js re-settles anchor jumps).

## Verification scripts

The checks of the whole repository, the kit included. CI (`.github/workflows/ci.yml`) runs `npm run lint`,
`npm test` and `npm run build` on every pull request; the rest are run by hand:

| Command | Checks |
|---|---|
| `npm run typecheck` | `tsc --noEmit` — all the TypeScript (`tsconfig.json`: the kit, the apps, every `docs.config.ts`) — and `tsc --noEmit -p tsconfig.scripts.json` — all the JavaScript (`.mjs`, `.js`; `checkJs`): the kit's scripts and tests and `static/kit.src.js`, whose build-time globals are declared in `static/kit.src.globals.d.ts` |
| `npm run lint` | ESLint over the whole repository; no warnings allowed |
| `npm test` | every unit test (`node --test`), `src/kit/tests/*.test.mjs` among them: preferences and the inline scripts, the static chrome, the rendering budget, the engine's routing, navigation, slugs, markdown and platforms, the Doxygen chrome |
| `npm run build` | the whole site into `dist/`, each docs site with its own link check |
| `node scripts/docs-sites.mjs build src/kit/demo src/kit/demo/lip.config.ts src/kit/demo/single.config.ts` | the engine's test sites, each built and link-checked |
| `npm run linkcheck` | internal links, redirects and anchors of the whole `dist/` |
| `npm run smoke` | every browser check against the built `dist/` (below) |

`npm run smoke` is `node scripts/smoke-all.mjs [main] [chrome] [docs] [mods] [prefs]` (no name: all five). It needs
the build and Playwright's Chromium (`npx playwright install chromium`, once per machine) and starts the preview
servers itself, on free ports:

| Part | Script | On |
|---|---|---|
| `main` | `scripts/smoke.mjs` | levimc.org's own pages, languages, blog and 404 handling |
| `chrome` | `src/kit/scripts/smoke.mjs --app` | the LeviMC bar, footer, theme and language on levimc.org's pages and the blog |
| `docs` | `src/kit/scripts/smoke.mjs` (docs mode) | the same, and the docs' navigation, search, tabs and copy buttons, on every docs site of `content/` |
| `mods` | `scripts/mods/smoke.mjs` | LeviMC Mods, served by its own preview (`.build/mods/`) |
| `prefs` | `src/kit/tests/cross-site.e2e.mjs` | theme and language shared between levimc.org and a docs site (`--app dist --docs dist --docs-base /lip/`) |

The kit's scripts on their own (Node ESM; Playwright where noted):

```sh
# GitHub Pages emulation: file → 200, /x → x.html, /x → 301 /x/ for any directory, repeated slashes collapsed
# (//about/ serves about/index.html), else 404.html (404).   npm run preview = dist --base / --port 4173
node src/kit/scripts/serve-pages.mjs .build/docs/lip/dist --base / --port 4173

# internal links (+ redirects + #anchors); --external checks every external URL with curl
node src/kit/scripts/linkcheck.mjs .build/docs/LeviLamina/dist --base /LeviLamina/ --site-origin https://levimc.org \
     [--locale-first zh-Hans,zh-Hant] [--external] [--allow-redirect-hosts aka.ms,discord.gg,qm.qq.com] \
     [--ignore-paths /LeviLamina/api/] [--other-sites /mods/] [--json out.json]

# every live URL (sitemap.xml, else crawl) must answer 200 with 0 redirects locally;
# --anchors also requires every live heading id (old #deep-links) to exist on the local page
node src/kit/scripts/url-parity.mjs --live https://levimc.org/LeviLamina/ --local http://127.0.0.1:4173/LeviLamina/ --anchors

# word-level text diff of the main content, live vs local (Playwright)
node src/kit/scripts/text-parity.mjs --live https://levimc.org/LeviLamina/ --local http://127.0.0.1:4173/LeviLamina/ \
     [--paths a/,b/ | --paths-file f] [--live-selector 'article.md-content__inner' | '.vp-doc'] [--json out.json]
     # a path may differ per side: --paths 'daemon/overview.html=>daemon/overview/'

# browser smoke test (Playwright): docs mode for a docs site, app mode for the apps
node src/kit/scripts/smoke.mjs --url http://127.0.0.1:4173/LeviLamina/ [--search-term hook] [--pages a/,b/,c/] \
     [--tabs-page x/] [--copy-page x/] [--redirect-lang zh] [--current projects] [--headed]
node src/kit/scripts/smoke.mjs --app --url http://127.0.0.1:4173/ [--pages about/,community/] [--current about] \
     [--not-found missing/] [--headed]

# the kit's unit tests alone, and the cross-site e2e (Playwright)
node --test "src/kit/tests/*.test.mjs"
node src/kit/tests/cross-site.e2e.mjs --app dist --docs dist --docs-base /lip/

# the same bar and footer on one page of every LeviMC site (a local preview: http://127.0.0.1:4173/=https://levimc.org)
node src/kit/scripts/chrome-parity.mjs [url …]

# a screenshot (Playwright)
node src/kit/scripts/shot.mjs <url> <out.png> [light|dark] [w] [h] [--full]
```

Both smoke modes check the unified chrome: the GlobalBar's canonical tabs (in order, with their canonical
URLs) and controls (language · theme · GitHub), the current tab, Auto as the default theme following the system
live, theme and language stored in the `levimc_theme` / `levimc_lang` cookies and applied after a reload from the
cookie alone, the menu keys of the theme and language menus, no paint of the prerendered language for a stored
preference, the 390px layout (controls visible, exactly one menu button whose menu holds every bar link and the
docs projects, no sideways scroll), no console or hydration errors and the themed 404.

Docs mode adds SPA navigation, the docs chrome (no header row; one search trigger, in the LeviMC bar, which sticks;
no duplicated controls in the site column), the navigation model of kit 2.26 (the brand is the home link; the first
section may be the home page — Overview — and is then the current one there; no other section links the home page;
the current section holds the page, and prev / next stays inside it), Ctrl+K search, the language menu landing on
the equivalent page, the root-only redirect (stored preference wins, also after an in-site link), content tabs and
copy buttons (the copied text compared without Windows' CRLF line ends). The current tab it expects is `tutorials`
or `faq` on those two sites and `projects` on every project's docs; `--current` overrides it.

`tests/cross-site.e2e.mjs` loads `https://levimc.org/` and `https://levimc.org<docs-base>` in Chromium with every
request answered from the two builds (`--app`, `--docs`; the same `dist/` for the merged site), so the browser's
real cookie rules apply; it picks levimc.org's language codes (`zh-Hant`).

External link verdicts: `ok`, `ok-redirect` (`/releases/latest` and allow-listed hosts), `ok-auth`
(GitHub edit links redirect to sign-in), `redirect` (update the link to the final URL), `blocked`
(403/429 bot walls — verify by hand), `broken`, `error`.

## Design rules — do / don't

**Do**
* Use semantic tokens (`bg-canvas`, `text-ink`, `text-muted`, `border-line`, `text-link`, `bg-primary-strong`,
  `--color-adm-*`) — never raw hex in app code; dark mode then comes for free.
* Keep painterly effects in heroes, backdrops, margins and cards' backgrounds; keep text on calm canvas.
* Use the pixel vocabulary for interactive things: `mc-btn` for actions, `hotbar` for tab sets / pagination /
  segmented controls, `kit-slot` for icons, `px-corners` / `px-card` for frames, `mc-kbd` for keys.
* Use sprites at 16 or 32 px (crisp multiples). Use Manrope (`--font-display`) only for display headings (H1/H2, hero,
  section titles); micro-labels (`.kit-pixel-label`: eyebrows, badges, versions) are small spaced capitals in Inter. The
  pixel face only spells the LeviMC wordmark, and only as the `.kit-wordmark` mask (Silkscreen's glyphs; no webfont).
* Keep each project's own logo; the kit provides the shared chrome around it.
* Link to the canonical, redirect-free URLs (trailing slash for directories); run `linkcheck --external`.
* Respect `prefers-reduced-motion` (all kit animations stop) and keep focus visible (`--color-focus`).
* Keep the rendering budget (checked by `tests/render.test.mjs` on the theme, docs and Doxygen CSS and the rebuilt
  static chrome): no `position: fixed` full-viewport layer, no `mix-blend-mode` on a full-viewport layer, no
  `backdrop-filter`, no `background-attachment: fixed`, no `will-change` on the backdrop, and no perpetual animation —
  nothing `infinite`; animate only during an interaction, scroll-linked only `opacity`/`transform` (the compositor runs
  those). Sticky headers are opaque once stuck (a canvas `::before` + hairline `::after` whose opacity follows
  `scroll(root)`), scrims are plain colour. Blend a texture over a painting as a `background-blend-mode` layer with its
  opacity baked into the tile (`--kit-backdrop-brush`, `--kit-footer-brush`), not as a `mix-blend-mode` element.
* Put the GlobalBar first on every page, unmodified: same tabs, same controls, same order on every site. A site's
  own navigation goes in the page itself (the docs: the site column).
* Read and write theme / language only through the kit (`ThemeProvider`, `LocaleSwitcher`, `usePreferredLocale`,
  `prefs.ts`), so the choice is shared by every LeviMC site.

* Lay pages out as `.kit-shell` (min-height 100dvh flex column) → header → `<main>` (grows) → `SiteFooter`, so
  the footer is flush with the bottom on short pages; give flex/grid children that hold text `min-width: 0`
  (kit components already do: cards, search results, sidebar, TOC, pager, admonition titles wrap long URLs,
  identifiers and CJK/emoji runs).

**Don't**
* Don't round corners. Controls are flat with a hairline stepped frame (no bevels, no dark outlines); a soft shadow
  only appears on a hovered card.
* Don't box everything: lists and grids of items (projects, features, people, results, facts) are frameless items
  under a 1px hairline; keep frames for interactive or reading surfaces (buttons, inputs, the README, code).
* Don't put painted scenes or brush texture behind body text, code or tables.
* Don't end a painting with a soft fade alone, a hard line or a decorative strip: use `.kit-dissolve-*` (blocks +
  fade, 96/160px) so every painted edge on every site is the same. Separate sections with space or `.kit-rule`.
* Don't ship CJK webfonts, recolour sprites, or add new display typefaces.
* Don't render dates/random values differently on server and client (hydration); format dates with
  `timeZone: 'UTC'` like the kit does.
* Don't edit what a build writes (`static/kit.js`, `static/theme-init*.js`, `theme/generated.css`, `theme/hero.css`,
  `components/pixel-icons.ts`): change the source and regenerate ([Maintaining the kit](#maintaining-the-kit)).
* Don't add theme, language or GitHub-organisation controls to a site's own header (they live in the GlobalBar),
  and don't store those preferences under site-specific keys. The project's own repository link belongs in the
  site column's resources (`repo`), nowhere else.
* Don't give a docs site dropdown tabs, external tabs or single-page tabs other than the home page's (Overview):
  tabs are sections (one sidebar tree each), the brand is the home link, and downloads / changelogs go to `header.links`
  ([Navigation model](#navigation-model-kit-226)). Don't leave a doc page outside every section (the build warns).
* Don't add a second menu button: on phones and tablets the LeviMC bar's menu button opens the site's own menu.

## Adding a project's docs: from MkDocs

A project's docs live in `content/<Project>/` of this repository. "Adding a project's docs" in
[content/README.md](../../content/README.md) has the steps (the folder, the config with `i18n.localeFirst` and
`formerPrefixes`, turning the project's own GitHub Pages off); these are the engine's details for sources written
for MkDocs (LeviLamina and LegacyScriptEngine came this way).

1. The markdown goes to `content/<Project>/pages/` as it is: `x.md`, `x.zh.md`, the images and other files beside
   them (with `urlStyle: 'directory'` every non-markdown file is copied verbatim, so `logo` / `favicon` keep the
   paths of `theme.logo` / `theme.favicon`). `mkdocs.yml`, `requirements.txt` and the theme's `overrides/` are not
   content: leave them behind (the language-redirect script there is replaced by the kit's).
2. `node src/kit/scripts/mkdocs-nav.mjs path/to/mkdocs.yml` prints `nav`, `navTranslations`, `i18n` and the site's
   metadata as JSON for `docs.config.ts`. Keep `urlStyle: 'directory'`, `i18n.mode: 'suffix'`, `slug: 'pymdownx'`,
   `markdown.compat: 'python-markdown'` and `sidebar: 'tabs'`: every URL and every heading id then stays as MkDocs
   made it.
3. Arrange `nav` as the four sections of the [navigation model](#navigation-model-kit-226); the build warns about
   a page in no section and a top-level entry that is not a section.
4. Nav entries that point at pages of levimc.org outside the docs name the exact URL, with its trailing slash:
   `https://levimc.org/LeviLamina/api/`, `https://levimc.org/about/`.
5. `node scripts/docs-sites.mjs build <Project>` — fix every warning (unresolved links, missing anchors). The link
   check of the site's pages runs with the build.
6. While the old site is still online, serve the build (`node src/kit/scripts/serve-pages.mjs
   .build/docs/<Project>/dist --base /`) and compare: `url-parity.mjs --anchors` (every live URL answers 200 with no
   redirect, every old #anchor exists), `text-parity.mjs` (expect only the differences under
   [Known limitations](#known-limitations)), `linkcheck.mjs --external` (fix `redirect` / `broken`), `smoke.mjs`.

## Adding a project's docs: from VitePress

The same for sources written for VitePress (lip and LeviLauncher came this way):

1. The markdown and its locale folders go to `content/<Project>/pages/`; `public/` either stays inside it (the
   default `publicDir`) or becomes `content/<Project>/public/` with `publicDir: 'public'`. `.vitepress/` is left
   behind. Keep `urlStyle: 'html'`, `cleanUrls` as in the old config (LeviLauncher: `true`; lip: `false`),
   `i18n.mode: 'folder'` with each locale's `folder` as it was, `slug: 'vitepress'` and
   `markdown.compat: 'commonmark'`.
2. `themeConfig.nav` and `themeConfig.sidebar` become `nav` (`{ text, link }` / `{ text, items }` entries work as
   they are), arranged as the four sections of the [navigation model](#navigation-model-kit-226) with
   `sidebar: 'tabs'`. `docFooter`, `editLink.text` and the other labels → `ui` or `editLink.text`. `head` stays
   VitePress-shaped.
3. Remove the inline language-redirect `<script>` from `head` (the kit does root-only redirects from the
   cross-site language preference).
4. Vue components inside markdown are not supported, except `<Badge>`; the build reports the others.
5. Build, fix the warnings and compare as for MkDocs. `demo/lip.config.ts` is a VitePress-style site (folder
   locales, `.html` URLs, a `layout: home` page, the deprecated `sidebar` object) kept as one of the engine's test
   sites.

## Known limitations

* Python-Markdown compatibility is targeted at the constructs used in the LiteLDev docs. The differences from what
  MkDocs rendered were all source bugs or quirks where the kit renders the author's intent:
  unbalanced `**` handled differently (pymdownx.betterem: LL `usage_guidelines`, LSE `NBT.zh`), `hh:mm:ss`
  eaten by pymdownx.emoji (LSE `Economy`), 2-space-indented fences inside footnotes (MkDocs rendered them as inline
  code "json …"; the kit renders code blocks — LSE `i18n`), `Array<NBT object>` /
  `Object<string, NBT Object>` (MkDocs let the browser swallow them as tags; the kit shows them), a
  stray double backtick in LSE `NBTValue`, and LeviLamina's escaped generics (`Observable<T>`, `<=1.7.5`, …
  instead of MkDocs' `Observable\<T>`, `\<=1.7.5`; opt back in with `markdown.literalBackslashes: true`).
* pymdownx extensions that LiteLDev configured but never used (critic, keys, mark, caret, tilde,
  smartsymbols, emoji, arithmatex, abbr, def_list, attr_list beyond heading ids) are not implemented.
* VitePress Vue components inside markdown are not supported, except `<Badge>`; unknown tags are escaped and
  reported.
* Search indexes prose and inline code, not fenced code blocks.
* The theme menu trigger's `aria-label` is the generic "Theme" until hydration (kit.js: until it runs); its
  sprite, visible state name and the checked item are correct immediately (CSS from `html[data-theme-pref]`).
* The "language pending" hiding (the apps' chrome, single-locale docs, static pages) has a 1.5 s fail-safe: when
  the scripts take longer, the prerendered language shows until they run.
* Doxygen's own markup keeps a few axe findings the kit does not touch: icon-only links in the tree
  (`link-name`), no `<h1>`, and doxygen-awesome's floating TOC outside the landmarks (`region`).
* Language preferences stored by pre-kit sites under their own keys (e.g. VitePress's `levilauncher-docs-locale`)
  are not read; kit 1.0's `levimc-locale-<site>` keys and the 1.0 theme key are migrated.
* `lastUpdated` needs the git history: a shallow clone gives no dates (the workflows check out with
  `fetch-depth: 0`).

## Maintaining the kit

Commands run from the repository root, with the site's dependencies installed (`npm ci`).

* Sprites: edit `assets/sprites.mjs`, then `npm run kit:assets` (`assets/build-assets.mjs`: regenerates
  `assets/icons/`, `components/pixel-icons.ts`, `theme/generated.css` — including the painted backdrop scenes from
  `components/paint.ts` — and `theme/hero.css` with its two scene files).
* Static chrome: `npm run kit:static` (`static/build-static.mjs`: the snippets, `kit.js` from `kit.src.js`,
  `theme-init*.js`, `kit.css`, `kit-chrome.css`, `kit-nojs-dark.css`, `pages/`, and in `doxygen/` at the repository
  root `header.html`, `footer.html` and `header-parts.json`). Rebuild it after any change to the components, the
  theme CSS, `prefs.ts`, `i18n.ts` or `kit.src.js`, and commit what it wrote. `kit.js` and `theme-init*.js` are
  generated: neither linted nor type-checked — `kit.src.js` is both.
* Test sites: `node scripts/docs-sites.mjs build src/kit/demo src/kit/demo/lip.config.ts src/kit/demo/single.config.ts`
  builds and link-checks the three (→ `.build/docs/demo/`, `demo-lip/`, `demo-single/`); serve one with
  `node src/kit/scripts/serve-pages.mjs .build/docs/demo/dist --base / --port 4173`, then
  `node src/kit/scripts/smoke.mjs --url http://127.0.0.1:4173/Demo/`.
* Before a pull request: `npm run typecheck && npm run lint && npm test`, then `npm run build`,
  `npm run linkcheck` and `npm run smoke` ([Verification scripts](#verification-scripts)). CI
  (`.github/workflows/ci.yml`) runs only the lint, the unit tests and the build.
* Bump `VERSION` and `components/version.ts` together for a release (`tests/prefs.test.mjs` and build-static check
  they agree) and add a [Changelog](#changelog) entry.
* Before merging a chrome change, run `node src/kit/scripts/chrome-parity.mjs` against a preview.

## Changelog

### 2.32.0

* **Navigation model:** a fifth section, **Install**, second on every project's docs: one page (`install.md`), a link
  with no tree like Overview. The lint accepts it as the second top-level entry (`INSTALL_KEY`,
  `nav: the Install page's section 'X' must come second, after the home page's`). levimc.org's project docs no longer
  put a download button in the resources slot; `header.links` keeps working.

### 2.31.0

The kit is a source folder of levimc.org (`src/kit/`), in the site's one package: no copy in each site, nothing
fetched, nothing published.

* **Removed:** `scripts/vendor.mjs`, `scripts/fetch-kit.mjs`, `scripts/publish-kit.mjs`, `package.template.json`,
  `tsconfig.template.json`, the demo's plain app and its own package; `levimc.org/kit/v2/` is no longer published.
  `KIT_BUILD` is `'dev'`: the generator meta is `levimc-kit <version>`.
* **Docs engine:** `kitDocs(config, { configRoot, workDir })` — the config's relative paths resolve against
  `configRoot` (default: Vite's root) and the intermediate files go to `workDir` (default `<root>/.kit`), so a site
  can be a folder of content (`content/<Site>/`) built with the repository as Vite's root; `prerenderDocs({ workDir })`
  and `prerender.mjs --work-dir`. `docs/app/styles.css` scans only the kit's own markup for utility classes
  (`source(none)`), not whatever is under Vite's root.
* **"Last updated"** follows a page through renames: a commit that only moved a page does not count as an update
  (`docs/node/git.ts`, one `git log --name-status -M` over the repository).
* **Doxygen:** `static/doxygen/` moved to `doxygen/` at the repository root, beside the Doxyfile; `build-static.mjs`
  writes `header.html`, `footer.html` and `header-parts.json` there.
* **Checks:** `static/kit.src.js` is type-checked with the rest of the repository's JavaScript, its build-time globals
  declared in `static/kit.src.globals.d.ts`. `scripts/smoke.mjs` follows the navigation model of kit 2.26 (the first
  section may be the home page, Overview), expects the current bar tab `tutorials` / `faq` on those sites and
  `projects` on a project's docs, and compares copied code without Windows' CRLF line ends.
  `tests/cross-site.e2e.mjs` picks levimc.org's language codes (`zh-Hant`).

### 2.30.0

**The Doxygen chrome in one shared script.** `gen-header.mjs --chrome-out <dir>/kit-dox-chrome.js` writes the LeviMC
bar, the drawer and site column and (with `--footer <kit>/static/doxygen/footer.html --footer-out <dir>/footer.html`)
the LeviMC footer into one script instead of into every page. The script loads blocking in the head where the theme
init was (and runs it); each page calls `kitDoxChrome(part)` where the chrome goes, which writes the same markup in
place, so the parser and kit.js see exactly what the inline header gave them. A page is ~45 KB smaller: LeviLamina's
API reference (~68,000 pages) shrinks by about 3 GB. Without `--chrome-out` the header is the inline one, as before
(`renderDoxygenChrome` next to `renderDoxygenHeader`).
* **Migration**: optional. To switch, add the three options, list the script in `HTML_EXTRA_FILES`, use the generated
  footer as `HTML_FOOTER` and git-ignore both. Readers without JavaScript then get the API pages without the chrome.

### 2.29.0

**One tab for systems that get the same content.** A platform tab or picker button can name several systems, such as
"macOS / Linux" for an install command that is the same on both.
* A tab whose label names several systems carries them space-separated in `data-platform` (`"macos linux"`), and is
  selected for visitors on any of them or any of their targets (`matchPlatform`). Picking it keeps the visitor's own
  system of the group (`choiceOfOption`), so the other tab sets on the page still tell macOS and Linux apart.
* Components: `PlatformPicker` and `usePlatformChoice` take such options (`PlatformOption`: `'macos linux'`), labelled
  "macOS / Linux" by default (`optionName`); `chooseOption` picks one.
* **Migration**: none.

### 2.28.0

**Platforms with their processor.** Content that differs per download, such as how to install lip, can now name an
operating system and an architecture: `win-x64`, `win-arm64`, `osx-arm64`, `osx-x64`, `linux-x64`.
* Platform tabs whose label names one ("Windows arm64", "macOS (Apple silicon)", "Linux x64") carry the target in
  `data-platform`; `?platform=` and `levimc_platform` accept targets as well as systems. A system tab still matches
  every architecture of its system, and a stored system (`macos`) selects the first tab of that system, so existing
  pages and stored choices keep working. Picking a system tab while a target of that system is chosen keeps the target.
* The device's architecture comes from User-Agent Client Hints where the browser gives them, after hydration; else a
  Mac is taken for Apple silicon and every other system for x64.
* Markdown: `::: tabs` with `== Label` lines (the vitepress-plugin-tabs syntax), for tabs whose panels hold more than
  code on VitePress-style sites.
* Components: `PlatformPicker`, `usePlatformChoice`, `choosePlatform`. One choice per page (`shared/platform.ts`:
  `currentPlatformChoice`, `choosePlatform`, `onPlatformChoice`, `devicePlatformChoice`): a pick in a picker or a tab
  shows in every other, and the browser is asked for the architecture once.
* **Migration**: none. `preferredPlatform()` still returns a system; `preferredPlatformChoice()` returns the target. A
  site still on kit 2.27 ignores a stored target (it shows the visitor's device) until it rebuilds with 2.28.

### 2.27.0

**One search for every LeviMC site.** The search of a docs site found only that site's pages, and levimc.org, the blog
and LeviMC Mods had no search at all. Now levimc.org's deploy indexes every page it publishes — levimc.org, the blog,
Mods, the tutorials, the FAQ and each project's docs — into one index per language (`scripts/search-index.mjs` →
`/_search/manifest.json` and `/_search/<language>.<hash>.json`), and every site's search searches that.
* Docs engine: each build also writes `_kit/search-docs.json` (under base): the documents of its search indexes with
  their absolute URLs and full text, which the site-wide index takes as they are (`searchExclude` applied). The
  site's own `assets/search-*.json` stay its fallback (the dev server, a site not deployed with levimc.org).
* Components: `SearchDialog` (the docs' search dialog, now shared; styles in `theme/search.css`), `useSiteSearch` (the
  bar's search button, Ctrl/⌘+K and "/" for apps that are not docs sites) and `site-search.ts` (`loadSiteSearch`,
  `searchLanguageOf` …). `useFocusTrap` moved to `components/focus.ts`. A result shows its site first in its
  breadcrumbs, and results of the site the reader is on rank a little higher.
* The index of a language holds its pages, the pages that have one URL in one language (blog posts), and the English
  pages of every site with no page in that language (LeviLauncher's Japanese readers find the LeviLamina docs).
* The search field reads "Search LeviMC…" (搜索 LeviMC…) instead of "Search the docs…".
* **Migration**: an app with its own stylesheet that shows the dialog imports `kit/theme/search.css` (a docs site
  needs nothing: its `styles.css` does); apps that use `useSiteSearch` depend on `minisearch`.

### 2.26.1

* **Korean and Japanese heading ids are composed (NFC).** The VitePress slug (`slug: 'vitepress'`) decomposes the
  heading to drop Latin accents and left it so: `배경` became conjoining jamo and `が` a kana plus a voicing mark, an id
  that no link typed by hand or by a browser matches. The slug is composed again after the accents are dropped; Latin,
  Chinese and every other id are unchanged.
* **React and react-router in their own chunk** (`assets/react.<hash>.js`). The app chunk keeps the site's code and
  its route table, which grows with pages × locales: LeviLauncher's nine locales had pushed it over Vite's 500 kB
  warning.
* **Migration**: none. A link to a Korean or Japanese heading of a VitePress-slug site written with the decomposed id
  (copied from a page built before) points at the composed one now; `linkcheck` reports any left.

### 2.26.0

**Overview, Guides, Concepts, Reference.** A project's docs have these four sections, in this order, and no banner:
the home page is a doc page and the first section, Overview, a link with no tree that is current on the home page
(`{ text: 'Overview', link: '/' }`). See [Navigation model](#navigation-model-kit-226).
* Docs engine: the home page may be a top-level nav entry (no longer the warning "is not a section"); placed anywhere
  but first it warns `nav: the home page's section 'X' must come first`. The home page's route gets that section as
  its `nav`, so the site column marks it current.
* **Migration**: a site that had `layout: home` writes its home as a doc page (H1, lead, introduction, a demo) and adds
  `{ Overview: 'index.md' }` (or `{ text, link: '<locale home>' }`) first in `nav`; a same-site reference that was a
  section of its own becomes the first link of the Reference section.

### 2.25.0

**FAQ tab.** The bar reads Home · Tutorials · **FAQ** · Projects ▾ · Mods · Blog · Community · About:
`LINKS.faq` (`https://levimc.org/faq/`), `SiteId` `'faq'`, UI string `faq` in every chrome locale (问答 / 問答 in
Chinese, ЧаВо in Russian, FAQ elsewhere). The FAQ is a docs build of levimc.org's repository at `/faq/`
(`project: 'faq'` marks its tab, like the tutorials); `localizeNetworkUrl` and kit.js put the language first for it
(`/zh-Hans/faq/`). The projects' own FAQ pages moved there.
* **Migration**: none for a docs site. A site whose nav or router lists the other builds of levimc.org adds `/faq/`;
  a smoke test that lists the bar's tabs adds FAQ after Tutorials.

### 2.24.2

* Project blurbs (the Projects menu, the docs' 404 cards) follow the repositories: lip runs a LeviLamina server and
  manages its packages (no longer "general package installer"); MoreDimensions is for Bedrock servers.

### 2.24.1

* **`linkcheck --ignore-paths` also skips the pages below those paths**, not just the links into them: the
  whole-site check of levimc.org read LeviLamina's ~5,700 Doxygen pages (`/LeviLamina/api/`) and ran out of memory.

### 2.24.0

* **Converted pages show their own locale's pictures.** In a page converted with `convertFrom`, a relative link or
  image target (markdown `](…)` and `[label]: …`, `src="…"`, `href="…"`) with a path segment equal to the source
  locale's code points at the same path with that segment naming the converted locale —
  `../../play/images/zh-Hans/x.svg` becomes `…/zh-Hant/x.svg` on the zh-Hant page — when that file exists (a file,
  resolved from the page's source file within the content dir); otherwise it stays as written. Code is left as
  written; absolute URLs keep the levimc.org rule of 2.21.1. A site keeps Traditional Chinese screenshots or
  annotated SVGs beside the Simplified ones (`images/zh-Hans/`, `images/zh-Hant/`) and writes only the Simplified
  page.
* Reference definitions' targets (`[label]: path`) are no longer run through OpenCC (only their `#fragment`).
* `convertMarkdown(md, convert, page?)` takes `{ from, to, contentRoot, rel }` (new `ConvertPage`,
  `localeTarget`); the build passes it for every converted page.
* **Migration**: none. A site with no `<source locale>/` folders in its link paths builds as before.
### 2.23.0

* **The language first.** levimc.org puts the language at the start of every URL: `/zh-Hans/LeviLamina/x/`,
  `/zh-Hans/mods/`, `/zh-Hant/tutorials/`, `/ja/LeviLauncher/` (English stays unprefixed), and every docs site is
  built in levimc.org's repository (`docs/<Project>/`, see its `docs/README.md`).
* Docs engine: `defineDocsConfig({ i18n: { localeFirst: true, … } })`. A locale's page URL is
  `'/' + prefix + base.slice(1) + page`; route paths keep the prefix first, `docs/shared/routing.ts` maps them
  (`pathUrl`, `sitePath`, `localeRoot`, `siteRoots`). Canonical, hreflang and x-default, the sitemap, the root
  language redirect (`localeRedirectScript` given a site with `localeFirst: true` sends `/<base>` to
  `/<lang>/<base>`), the language menu, nav, sidebar and search links, `_kit/nav.json`, the router (basename `/`), the
  dev server and the prerender's output paths follow. `outDir` mirrors the host root (base's files in `dist/<base>/`,
  `404.html` and `.nojekyll` at the root). `formerPrefixes` stay relative to base and may name the locale's own
  prefix: `['zh-Hans/', 'zh/']` writes `/<base>/zh-Hans/x/` and `/<base>/zh/x/` redirect pages. Redirect pages now
  keep the query as well as the #hash. Without `localeFirst` nothing changes.
* `localizeNetworkUrl` and kit.js put the language first on every LeviMC site (`/zh-Hans/lip/`, `/zh-Hans/mods/`,
  `/zh-Hans/about/`); `docsLocales` are the short segments (`es`, `ru`, `de`, `ja`, `ko`, `fr`), the new
  `NETWORK_LANGUAGE_SEGMENTS` lists every segment. URLs naming a language already (first, or after a base as before)
  stay. The Doxygen fallback header (`static/doxygen/`) is language-first too.
* `scripts/linkcheck.mjs --locale-first [prefixes]`: the dist is the host root, the site's pages are those under
  base and `/<prefix>/<base>`.
* Demos: Demo, the lip demo and Single build language-first (`/zh-Hans/Demo/`, `/zh-Hans/lip/`) with
  `formerPrefixes`; previews use `--base /` (`npm run preview`, `linkcheck:lip`, `linkcheck:single`).
* **Migration** (a docs root in levimc.org's `docs/`): add `localeFirst: true`, list every old prefix in
  `formerPrefixes` (the current one too), change `preview` to `--base /` and `linkcheck` to
  `--locale-first <prefixes>`; links into other sites use language-first URLs. Sites built elsewhere keep working
  unchanged on 2.23.

### 2.22.2

* **Links between LeviMC sites go straight to the reader's language.** The bar, the Projects menu, the footer and
  the drawer's LeviMC list linked each site's root (`https://levimc.org/lip/`), whose language redirect then loaded a
  second page — a flash on every cross-site click for non-English readers, and a wasted prerender. They now link
  `…/lip/zh-Hans/` (`/zh-Hans/about/`, `/mods/zh-Hant/`, `/LeviLauncher/de-DE/` …) in the bar's language:
  `localizeNetworkUrl(url, lang)` (components/projects.ts). Chinese goes to zh-Hans / zh-Hant on every site; other
  languages only to docs that have them (new `Project.docsLocales`, LeviLauncher's six); `Project.docsUnlocalized`
  keeps LeviLamina's Doxygen `api/` as is. The static chrome (kit.js) applies the same rule when it relabels the bar.
* levimc.org and LeviMC Mods localize the project docs' URLs with it too (their project cards and in-page links).

### 2.22.1

* **Home pages: the site column waits for the banner to leave.** The hero keeps the full width; the column starts
  under it and stays hidden (and inert) while any of the banner is on screen below the LeviMC bar, then fades in
  (no fade with `prefers-reduced-motion`). The area under the banner is at least a screen tall above 960px, so a
  short home page can still scroll the banner away. The prerendered page starts hidden: no flash.

### 2.22.0

**No docs header row: search in the LeviMC bar, the sections in the left column.** Every docs site (and levimc.org/
tutorials/, and the Doxygen API) loses its second row (brand, section tabs, search, resources):
* GlobalBar gains `search?: { label, onOpen, onWarm? }`: a field-like trigger before the language menu (`Ctrl` `K`
  hint; an icon at ≤ 1180px). The docs app passes it and makes the bar `sticky`; the sticky offset of the sidebar
  and outline is now the bar's height.
* New `SiteNav` (docs/app/components): the site column on every page, the home page included — brand → home, every
  section (the current one open with its tree, the others open in place), resources (Download button, links,
  repository). `SidebarTree` renders a section's tree without a title. `SiteHeader`, the nav fit
  (`html[data-kit-nav-fit]`) and `header.tabsRow` are gone (the option is accepted and ignored).
* Doxygen: no row; Doxygen's search box sits in the bar's search slot (`.kit-gbar-search.kit-dox-search`), the bar
  sticks, and the tree's column is headed by the same site column markup. The view transition keeps the column
  (`kit-sitenav`) in place between pages of a site.
* Sites need no change; LeviLamina's `header: { tabsRow }` can go.
* `scripts/smoke.mjs`: the docs checks follow (no `.kit-site-header`; one search trigger in the bar; the column's
  sections, current section and pager).

### 2.21.2

* A docs build that is one of the bar's own sites marks its own tab: levimc.org/tutorials/ (`project: 'tutorials'`)
  highlights **Tutorials**, not Projects.
* `scripts/smoke.mjs` expects the Tutorials tab.

### 2.21.1

* **Links to another LeviMC site stay in the tab.** An absolute `https://levimc.org/…` link (markdown, hero actions,
  feature cards, nav and sidebar entries, header resources, `Card`, `PixelButton`) is a cross-site navigation — with
  the view transition and prerendering — not an external link: no `target=_blank`, no external-link icon. New
  helpers `opensInNewTab(url)`, `newTabProps(url)`, `NETWORK_ORIGIN`.
* **Converted Traditional Chinese follows the scheme across sites**: in pages and nav converted with `convertFrom`,
  links and bare URLs to `https://levimc.org/…/zh-Hans/…` become `…/zh-Hant/…` (code is left as written).
* The static runtime (`kit.js`) translates the Tutorials tab.

### 2.21.0

**levimc.org feels like one site.** The site, /mods/, /tutorials/, every project's docs and the Doxygen reference are
separate builds on one origin, so links between them are full navigations. Two additions make those navigations
look like in-app ones; no site needs to change anything for them (they come with the kit):
* **Cross-document view transitions** (`theme/chrome.css`, and so `static/kit.css` / `kit-chrome.css`):
  `@view-transition { navigation: auto }`; the LeviMC bar (`[data-kit-globalbar]`) and the docs' own header row
  (`[data-kit-subnav]`, Doxygen's too) keep their place while the content cross-fades (160 ms). Off with
  `prefers-reduced-motion`. Browsers without them (Firefox today) navigate as before.
* **Speculation rules** (`createPrefsInitScript`, i.e. every pre-paint script, `static/theme-init*.js` included):
  same-origin links are prerendered when the visitor hovers or presses them (`eagerness: 'moderate'`); never
  downloads, `target=_blank`, `rel=nofollow` or anything inside `[data-kit-no-prerender]`. New option
  `speculation: { include?, exclude? } | false` scopes them to the other builds' paths: the docs engine excludes
  the site's own base (its router serves those), LeviMC Mods excludes `/mods/*`, levimc.org includes only
  `OTHER_SITES` (`src/other-sites.ts`). Exported: `speculationRules(scope)`.

**Tutorials tab.** The bar reads Home · **Tutorials** · Projects ▾ · Mods · Blog · Community · About:
`LINKS.tutorials` (`https://levimc.org/tutorials/`), `SiteId` `'tutorials'`, UI string `tutorials` in every chrome
locale. The tutorials are a docs build of levimc.org's repository at `/tutorials/`; a site whose nav or router
lists the other builds of levimc.org adds `/tutorials/` (levimc.org's linkcheck `--other-sites` does).

**One locale scheme across levimc.org: `<base>zh-Hans/`, `<base>zh-Hant/`.** The docs engine already separates a
locale's URL `prefix` from its sources (`suffix` / `folder`). New `formerPrefixes` keeps the old URLs working:
* Suffix mode (LeviLamina, LegacyScriptEngine): `{ code: 'zh', label: '简体中文', lang: 'zh-Hans', prefix: 'zh-Hans/', formerPrefixes: ['zh/'] }`
  and `{ code: 'zh-Hant', …, lang: 'zh-Hant', convertFrom: 'zh' }` (unchanged). Sources stay `*.zh.md`.
* Folder mode (lip, BeDD, bedboo): the same plus `folder: 'zh'` so `zh/` stays where it is.
* LeviLauncher: `zh-CN` → `lang: 'zh-Hans', prefix: 'zh-Hans/', folder: 'zh-CN', formerPrefixes: ['zh-CN/']`,
  `zh-HK` → `lang: 'zh-Hant', prefix: 'zh-Hant/', folder: 'zh-HK', formerPrefixes: ['zh-HK/']`.
Every page of the locale then also gets a redirect page at the same path under each former prefix; hreflang, the
sitemap and `<html lang>` say `zh-Hans`. A stored `levimc_lang` of `zh-CN` still maps to the Simplified locale
(`matchLocale`). Nav labels and `navTranslations` keyed by locale `code` need no change.

### 2.20.0 — unreleased

**The project docs move from docs.levimc.org to levimc.org.** Each project's docs stay in its own repository and
keep their path: `https://docs.levimc.org/<Project>/…` becomes `https://levimc.org/<Project>/…`
(levimc.org's `MIGRATION.md` has the switch-over steps; docs.levimc.org forwards every URL to the same path).
* `PROJECTS[].docs` / `DOCS_PROJECTS[].url`, and so the Projects menu, the static chrome (`static/`), the Doxygen
  header and the 404 cards, link `https://levimc.org/<Project>/`.
* Docs links are same-origin links on levimc.org now: an app that passes `siteOrigin` + `linkComponent` must exclude
  the docs paths in `isAppPath` (levimc.org's does), or its router would render its own 404 for them. Docs sites pass
  no `siteOrigin` and need no change.
* `scripts/linkcheck.mjs --other-sites /mods/,/LeviLamina/`: own-origin paths that another build publishes are checked
  as external URLs (with `--external`) instead of as files of this dist.
* `tests/cross-site.e2e.mjs` serves the docs build at `https://levimc.org/<base>/`.
* Migration for docs sites: set `hostname` / `sitemap.hostname` to `'https://levimc.org'` and
  `linkcheck --site-origin https://levimc.org`, on the day of the switch (`demo/` and `package.template.json` show it).

### 2.19.1 — 2026-11-08

**The Doxygen tree opens faster, and the drawer never shows an empty API Reference section.**
* `patch-navtree.mjs`:
  * `splitTreeData` splits the tree data scripts above 256 KB. Every child list above 4 KB moves into a script that
    navtree.js loads on demand. LeviLamina's Class List script goes from 2.4 MB to 1.1 MB (405 → 222 KB gzipped);
    it was downloaded and parsed before the tree could open on any class page.
  * No jQuery `slideDown` / `slideUp` / `scrollTo` animations, no scrollbar probe and no pane splitter
    (`initResizable`) under the kit's layout. Each of those forced a style pass over the whole page; on the Player
    class page (25k nodes) they cost about 1.2 s of main thread on the budget phone profile. The layout is unchanged
    (identical geometry on five page types at 1440, 1100 and 393 px).
  * `kitRenderAll(true)` after "Show all" has started its idle chunks now renders the rest at once instead of
    returning (showNode could read a missing entry).
* kit.js: the tree starts loading when the menu button is pressed (not on the click after it), the drawer shows static
  placeholder rows until the tree is ready, and focusing the drawer waits for its first frame.
* Measured on the Player class page: the tree is ready 2.8 s after opening the drawer on a cold budget phone (about
  5 s before, with an empty section meanwhile); laptop TBT about 3.0 → 2.1 s, idle main-thread work 25–80 → under
  1 ms/s.
* New `tests/navtree.test.mjs`.
* Compatible: LeviLamina's API reference rebuilds with the new `patch-navtree.mjs`; other sites only rebuild.

### 2.19.0 — 2026-11-08

**One navigation model, one header, and a rendering budget a 2016 laptop or a 2021 budget phone can afford.**
Every docs site, the LeviLamina Doxygen reference, levimc.org and LeviMC Mods now share the same header, drawer, titles,
404 and chrome-language rules, and the kit no longer asks the compositor to redraw the screen.

**Rendering (all sites)**
* The painted backdrop is the root's scrolling background (`:root:has(.kit-backdrop)`): pre-rendered, vertically
  mirrored dabs tiles (`assets/build-assets.mjs`, 128×256 PNG per theme) with the brush and grain as
  `background-blend-mode` layers, opacity baked in. No fixed full-viewport layer, no `mix-blend-mode` layer, no
  `background-attachment: fixed`. `.kit-backdrop` is only the hook; `body` is transparent on such pages.
* No `backdrop-filter` anywhere: the sticky docs header (and Doxygen's `#top`) is transparent at scroll 0 and fades in
  an opaque `::before` / hairline `::after` (opacity only, on `scroll(root)`); the search scrim and drawer head are
  opaque.
* No perpetual animations: `kit-drift`, `kit-shimmer`, `kit-spin-steps`, `kit-glint`, `kit-float` and the scene
  `animate` option are gone; the 404 compass spins twice and stops. New `tests/render.test.mjs` enforces this for the
  theme, docs, Doxygen and static CSS.
* Hero scenes are files (`theme/hero-lilies.svg`, `theme/hero-sunrise.svg`); `PaintedHero` preloads the one for the
  system theme. Every docs page's CSS loses ~140 KB. The LeviMC wordmark is a mask, so Silkscreen is no longer loaded.
* Measured (software GPU, scroll compositing per 3 s): docs page 977 → 300 ms (laptop), 291 → 70 ms (phone); hero home
  409 → 87 / 247 → 58 ms; layer memory roughly halves.

**Navigation model (README "Navigation model (kit 2.19)")**
* `sidebar: 'tabs'` is the one model: each top-level `nav` entry is a section (tab = its sidebar tree, titled). The
  brand is the only home link. The object-form (VitePress) `sidebar` is deprecated and warns.
* Prev/next stays inside the section and never targets home (en and zh now agree). All groups open at ≤ 24 links,
  else only the current page's group.
* Build lint for Home / single-page / external tabs, empty sections and orphan pages.
* Resources slot: `header.links` (`download` / `changelog`) after search, then the GitHub icon from `repo`; the
  drawer shows the same under "Resources".
* One menu button: the LeviMC bar's (`GlobalBar` `onMenu` / `menuOpen` / `menuControls`) opens the docs drawer, from
  the right, at the same place as on levimc.org. One breakpoint, 960px. Drawer order: sections → section tree →
  Resources → LeviMC links; its body mounts on first open.
* `dist/_kit/nav.json` is written on every build; the Doxygen header is generated from it.
* Titles: `:title - :site Docs` (default), homes `<site> Docs`, 404 `Page not found - <site> Docs`.
* The chrome-language rule applies on every site; scroll position is restored on cross-page Back/Forward.
* New `ogImage` config option (defaults to the logo).
* Performance: nav fit measured once and computed arithmetically on resize; one shared IntersectionObserver
  scroll-spy; DocFooter date formatted at build time; slim client route table; deferred, paged search; image
  `width`/`height` and badge heights against CLS. LSE Player page: laptop TBT 111–135 → 3–7 ms, forced layouts on
  scroll 41 → 0.

**Doxygen (LeviLamina API reference)**
* `static/doxygen/gen-header.mjs` renders `docs/api/header.html` from `nav.json`: the docs' header row, drawer,
  resources and locales (no hand-copied tab table). `kit-chrome.css` now includes docs.css, so both run on the same
  rules. Title `$title - LeviLamina API`.
* Content parity with the docs (DP-01…24): tables, code blocks, admonitions, type scale, permalinks, TOC, sidebar
  tree, search box in the docs trigger frame (Ctrl K).
* `static/doxygen/patch-navtree.mjs` windows long tree lists; the tree builds when idle; `content-visibility` on
  members. classActor (laptop): DOM 83k → 12.7k, TBT 5.9 → 1.7 s, scroll frame p90 97 → 27 ms.
* The static 404 uses the shared `.kit-notfound` card; title `Page not found - LeviMC Docs`.

**Projects**: Be.D.D. is back in Projects (Core, with docs); `DOCS_PROJECTS` lists six projects.

**levimc.org and Mods** (apps only): D7 titles, chrome-language rule, the shared 404, `og:image` / `og:locale`, no
idle animations, external data fetched when idle and cached per session, lazy route chunks, Mods chip fitting without
layout thrash, icons resized to WebP at build time.

**Migration**
* Every site: refetch the kit and rebuild. Keep your own wrappers free of an opaque background.
* Docs sites: drop `titleTemplate`, set `repo`, move download/changelog links to `header.links`, give `index`
  `layout: home`, replace an object `sidebar` with `sidebar: 'tabs'` sections, and fix any `nav:` warnings.
* LeviLamina: the new `build-docs.yml` builds Doxygen after the docs (gen-header from `_kit/nav.json`, then
  patch-navtree); new `docs/api/mainpage.md`, Doxyfile `HTML_HEADER` / `PROJECT_ICON`.
* `sceneToSvg(…, { animate })` no longer type-checks: drop the option.

### 2.18.0 — 2026-11-06

**bedboo is back, with docs.** `LiteLDev/bedboo`, a Minecraft Bedrock Edition bot library with a mineflayer-compatible
API, is documented at `https://levimc.org/bedboo/`; it rejoins Core after LeviLauncher, so the Projects menu
(the projects with docs) lists it, and levimc.org has its project card again.
* `ProjectId` `'bedboo'` (`projectBlurbs.bedboo` in every chrome language), with `docs`; `DocsProjectId` includes
  `'bedboo'`, so `DOCS_PROJECTS` (the docs.levimc.org root's cards) lists five projects. Its logo is
  `https://levimc.org/logos/bedboo.webp`.
* Compatible: sites only rebuild.

### 2.17.0 — 2026-11-01

**The Projects menu lists only the projects with a documentation site** (LeviLamina, LegacyScriptEngine, lip,
LeviLauncher); LeviStone, LeviOptimize, LeviAntiCheat and MoreDimensions leave it but keep their levimc.org project
cards (`PROJECTS` is unchanged).
* The menu is one compact panel (38rem, was up to 68rem) hung from the Projects tab: a "Docs" heading with the count,
  then the projects two by two as tiles — a larger logo, the name in the display face, the blurb in at most two lines —
  on a faint wash of the primary. `.kit-proj-groups`, `.kit-proj-group*` are gone; the list is `.kit-proj-list`.
* Compatible: sites only rebuild.

### 2.16.0 — 2026-11-01

**Be.D.D., bedboo, BarelyEnoughItems, AlleviatedBackpacks, Bedstones and BeetrootSkin leave the Projects menu.** They
are no longer listed under Core or Official mods, nor as levimc.org project cards; Be.D.D.'s docs stay online.
* `PROJECTS` / `ProjectId` drop the six ids, and `projectBlurbs` their descriptions; `DocsProjectId` no longer
  includes `'BeDD'`, so `DOCS_PROJECTS` (the docs.levimc.org root's cards) lists four projects.
* Compatible: sites only rebuild.

### 2.15.0 — 2026-10-30

**Be.D.D. has its own docs and is no longer a mod.** Be.D.D. is a standalone testing toolkit now, documented at
`https://levimc.org/BeDD/`, and has left LeviMC Mods: its Projects menu row and project card lead to its docs.
* `PROJECTS`: `BeDD` has `docs` instead of `mod`; `DocsProjectId` includes `'BeDD'`, so `DOCS_PROJECTS` (the
  docs.levimc.org root's cards) lists it after LeviLauncher.
* Compatible: sites only rebuild.

### 2.14.0 — 2026-10-30

**bedboo is in Core, and the Projects menu is rebalanced.** `LiteLDev/bedboo` (mineflayer for Bedrock) joins Core
after Be.D.D.; it has no docs or LeviMC Mods page, so it leads to its repository.
* `ProjectId` `'bedboo'` (`projectBlurbs.bedboo` in every chrome language); its logo, in the kit's style, is
  `https://levimc.org/logos/bedboo.webp`.
* Projects menu: Core and Official mods side by side, two columns each (they were one and two), so neither group is
  much longer than the other; a hairline between the groups, Core on a faint primary wash. Headings get a pixel marker
  and the group's project count (`.kit-proj-count`; the name is now a `<span data-kit-t>` inside
  `.kit-proj-heading`). Every logo sits on the same framed linen tile (`.kit-proj-slot`, 40px), rows lift it and show
  an arrow on hover (`.kit-proj-go`), blurbs stop at three lines. Below 1180px each group folds into one column.
* Compatible: sites only rebuild.

### 2.13.0 — 2026-10-30

**Be.D.D. is in Core.** LeviHeadlessInput is now Be.D.D. (Bedrock Deep Dive, `LiteLDev/BeDD`) and moves from
Official mods to Core, after LeviLauncher; it still leads to its LeviMC Mods page.
* `ProjectId` `'LeviHeadlessInput'` → `'BeDD'` (`projectBlurbs.BeDD`); its logo is `https://levimc.org/logos/BeDD.webp`.
* `Project.mod` is no longer only for the Official mods: a Core project installed as a mod has one too.
* Compatible: sites only rebuild.

### 2.12.0 — 2026-10-29

**Content per platform** (see [Content per platform](#content-per-platform)), for LeviLauncher's one guide for its
Windows and Android versions:
* Platform tabs form one site-wide group: a pick switches every platform tab set and is remembered; `?platform=`
  selects one by URL. Hero actions with `platform` follow the same choice (`preferredPlatform()`).
* `<Badge platform="android" />` / VitePress `<Badge type text />` in markdown; frontmatter `platforms: [...]` puts
  the platform badges under the title (`.kit-page-platforms`).
* New config option `redirects` (old path → new path or URL): a redirect page per old URL.
* New in `docs/shared/platform.ts`: `PLATFORM_NAMES`, `PLATFORM_STORAGE_KEY`, `PLATFORM_QUERY`, `isPlatform()`,
  `storedPlatform()`, `storePlatform()`, `preferredPlatform()`.
* Compatible: sites only rebuild.

### 2.11.0 — 2026-10-29

**LeviLauncher is in Core.** The Projects menu has two groups: Core (LeviLamina, LegacyScriptEngine, LeviStone, lip,
LeviLauncher) and Official mods, in three columns (`chrome.css`).
* `ProjectGroupId` drops `'launchers'`; `PROJECT_GROUPS` is `['core', 'mods']`; `UiStrings.projectGroups` drops
  `launchers`.

### 2.10.0 — 2026-10-29

**The Doxygen pages are laid out like the docs pages.** Below the shared header, LeviLamina's API reference now has
the docs' structure and styles (`static/doxygen/doxygen-kit.css`, `header.html`, `footer.html`, `kit.js`):
* the painted backdrop; the page scrolls instead of Doxygen's panes, with the project row sticky under the bar;
* Doxygen's tree as the docs sidebar: sticky, titled with the current tab (API Reference / API 参考 / API 參考),
  the docs' link, hover and current-page styles, no splitter or sync button;
* the page in the docs' centred reading column with their h1 / h2; wide declaration tables wrap or scroll inside
  the column; rules stay in the column;
* Doxygen's page outline as the docs' "On this page" (localized title, the docs' list style, the section being
  read marked while scrolling), shown from 1281px like the docs;
* the LeviMC footer across the page in its own colours; Doxygen's breadcrumb bar is off.
* `data-kit-l10n` also localizes texts that are no link (kit.js leaves their `href` alone).
* No API change.

### 2.9.1 — 2026-10-29

**API Reference is the Doxygen reference.** LeviLamina's top-level API Reference tab now leads straight to its
Doxygen reference (`/LeviLamina/api/`, a same-site link in the docs nav); the Doxygen header's current API Reference
tab links there too, in every language (`DOX.sections`: a `shared` section has one URL for every locale).
* No API change.

### 2.9.0 — 2026-10-29

**One LeviLauncher, for Windows and Android.** LeviLauncher for Android's docs moved into LeviLauncher's
(`docs.levimc.org/LeviLauncher/android/`), and LeviLauncher is one project for both: `PROJECTS` drops the
`LeviLaunchroid` entry (the Projects menu, the docs.levimc.org root's cards and levimc.org's project cards show one
LeviLauncher card), its `projectBlurbs` says "Bedrock launcher for Windows and Android" in every language, and the
`LeviLaunchroid.webp` logo is gone. docs.levimc.org forwards the old `/LeviLaunchroid/` URLs (liteldev.github.io).
* Removed: `'LeviLaunchroid'` from `ProjectId`, `DocsProjectId` and `projectBlurbs`.

**Content for the visitor's device** (`docs/shared/platform.ts`: `detectPlatform()`, `platformOfLabel()`):
* Tabs labelled with one platform name ("Windows", "Android", "iOS", "macOS", "Linux") carry `data-platform`, and the
  visitor's platform's tab starts selected (a `#hash` naming another tab still wins).
* Hero actions take `platform`: the visitor's platform's actions come first as brand buttons, other platforms' alt.
* Both run after hydration: the prerendered page shows the author's default.

### 2.8.1 — 2026-10-29

**The Doxygen header follows LeviLamina's nav.** LeviLamina's docs dropped their LegacyScriptEngine and About tabs
(the LeviMC bar links both); the Doxygen header drops them too (`DOX.sections`), so its tabs stay the docs header's.
* No API change.

### 2.8.0 — 2026-10-29

**The API reference is a tab of the docs.** A nav link to this site that is no docs page — e.g. LeviLamina's
Doxygen output merged into `dist/api/`, written `https://levimc.org/LeviLamina/api/` (own `hostname` + `base`)
or `/LeviLamina/api/` — is now a link of the site: opened in place like a page, without the external mark or a new
tab (before, the first form was an external link and the second a build warning). Such links are not part of the
previous / next page links.
* The Doxygen header (`static/doxygen/header.html`) is the docs header with LeviLamina's new top-level
  **API Reference** tab current (between Developer Guides and Maintainer Guides; `DOX.sections`), without the
  rule between the project name and the tabs.
* The Doxygen row fits its tabs like the docs header: kit.js measures them into `html[data-kit-nav-fit]` (`search`:
  Doxygen's search box shrinks to its icon and opens over the row while used; `tabs`: the sections get their own
  row) instead of the fixed 768–1299px breakpoint.
* No API change; `NavItem` links without `key` are same-site links that are no docs page.

### 2.7.2 — 2026-10-27

**LeviLauncher for Android.** The Android launcher's display name (`PROJECTS`, so the Projects menu, the
docs.levimc.org root's cards and levimc.org's project cards) is "LeviLauncher for Android" in every language. Its id,
repository (`LiteLDev/LeviLaunchroid`), docs URL (`docs.levimc.org/LeviLaunchroid/`) and logo file are unchanged.
* No API change.

### 2.7.1 — 2026-10-26

**Project blurbs agree with the projects.** The chrome's words now say what each project's own README says, in all
nine languages:
* LeviLamina is a mod loader for Minecraft Bedrock Edition (server and client), not only for Bedrock Dedicated
  Server; LegacyScriptEngine runs LLSE script plugins on LeviLamina; lip is a (general) package *installer* in every
  language (zh-CN / zh-HK said 包管理器 / 套件管理器); LeviLauncher is GDK / UWP; LeviOptimize is for servers and
  clients; MoreDimensions is an API for custom dimensions.
* `modsBlurb`: LeviMC Mods covers Minecraft Bedrock (LeviLamina, LegacyScriptEngine and Endstone), not only
  LeviLamina. The footer `tagline` names the official mods and says "package installer".
* zh-HK uses 外掛 for plugins throughout (as levimc.org's 繁體中文); ja writes MOD everywhere, like its tab.
* No API change.

### 2.7.0 — 2026-10-25

**Traditional Chinese from Simplified.** A docs locale with `convertFrom: '<zh locale>'` — e.g.
`{ code: 'zh-Hant', label: '繁體中文', lang: 'zh-Hant', convertFrom: 'zh' }` — gets every page it has no translation
of from that locale, converted with OpenCC (`opencc-js/cn2t`, `cn` → `tw`, or `hk` for a zh-HK / zh-MO `lang`):
characters only, no phrase rewriting, so the wording stays the author's. Code blocks, inline code, link paths and
URLs are left as written; link fragments convert with the headings they point at, and converted pages link to
converted pages. Where the locale has none of its own, the source locale's per-locale `nav` and `sidebar`
(path-prefix keys move to the locale's prefix), `navTranslations`, `ui` overrides and `editLink.text` are converted
too. Its own pages (`x.zh-Hant.md`, `zh-Hant/x.md`) still win, and edit links point at the Simplified source.
* New: `LocaleConfig.convertFrom`, `docs/node/convert.ts`; `PageRoute.converted`.
* Sites using it add `opencc-js` 1.4.2 to their devDependencies; nothing changes for the others.
* LeviLamina, LegacyScriptEngine, lip and LeviLaunchroid add `zh-Hant` (繁體中文) this way; the Doxygen header of
  LeviLamina's API reference lists it too (`DOX.locales`).

### 2.6.0 — 2026-10-24

**Every project leads to its home page.** The Projects menu drops the Docs · GitHub chips under the projects with
docs: every row is one link, to `projectHome(p)` — the official mods' page on LeviMC Mods (`Project.mod`,
`https://levimc.org/mods/github.com/LiteLDev/<mod>/`), else the docs, else the repository. The GitHub mark beside the
name now marks the rows that lead to a repository (LeviStone), and every row is one line tall.
* New: `Project.mod`, `projectHome()`.
* Removed: `.kit-proj-links`, `.kit-proj-link`, `.kit-proj-item-repo`.
* levimc.org's project cards link as a whole to the same home page (no more Docs / GitHub text links).

**Compatible.** Sites only rebuild; nothing to change.

### 2.5.0 — 2026-10-24

**Every project shows its own logo** instead of a Minecraft item sprite: the Projects menu, levimc.org's project cards
and the docs.levimc.org root's cards.
* `Project.logo` / `DocsProject.logo`: a 128×128 WebP at `https://levimc.org/logos/<ProjectId>.webp` (`LINKS.logos`).
  `icon` stays, deprecated, for sites that still read it.
* A project with a logo of its own keeps it (LeviLamina, LegacyScriptEngine, LeviLauncher, LeviLaunchroid and the five
  new mods). LeviStone, lip, LeviOptimize, LeviAntiCheat and MoreDimensions get one in the kit's style — the recipe of
  the LeviMC Mods logos: a Monet scene from `paint.ts` behind, a crisp 32×32 pixel object in front, its shadow and its
  reflection in the water. `scripts/build-logos.mjs` in levimc.org draws them (seeded) and fetches the others; the
  512×512 artwork is `public/logos/<Project>.png`.
* `Card` takes the logo as its `icon` node (`<img class="kit-card-logo">` fills the slot).

### 2.4.0 — 2026-10-24

**Six more projects.** `PROJECTS` (and `ProjectId`) adds LeviStone (Core) and BarelyEnoughItems, AlleviatedBackpacks,
Bedstones, BeetrootSkin and LeviHeadlessInput (Official mods), with their `projectBlurbs` in every chrome language.
None has a docs site, so `DOCS_PROJECTS` is unchanged. Sites need no change.

**The Projects menu fits all of them without scrolling** (≈450px high from 961px to 1920px wide, was 800px in a
512px panel):
* Four columns: Core · Launchers · Official mods, the mods in two columns of their own (`.kit-proj-group-<group>`).
* A project without docs drops its Docs · GitHub row — the row itself is the repository link, marked by a GitHub
  icon beside the name (`.kit-proj-item-repo`, `.kit-proj-repo-mark`) — so it is one line shorter.
* The panel hangs from the bar's content box (`.kit-gbar-inner` is positioned; the tab's `li.kit-gbar-projects-tab`
  and the `<details>` are not), 66rem wide at most: it no longer runs off the right edge between 961px and ~1100px.

### 2.3.0 — 2026-10-24

**LeviMC Mods moves to levimc.org/mods/.** pkg.levimc.org became `mods/` in LiteLDev/levimc.org, deployed at `/mods/`
(mod pages are `/mods/<tooth>/`).
* The Mods link (`LINKS.mods`, was `LINKS.packages`) is `https://levimc.org/mods/`.
* The Mods tab's id is `mods` everywhere (was `packages`): `SiteId`, `MODS_SITE.id`, the UI string key (`t.mods`),
  and `data-kit-t="mods"` in the static chrome and kit.js. A site passing `current="packages"` passes `"mods"`.
* Two apps share levimc.org: each keeps router links to its own part with `isAppPath` (see Plain Vite apps).

### 2.2.0 — 2026-10-19

**Quieter and grander.** Feedback: the design still wasn't minimal or grand enough — every element was boxed, framed
and decorated. 2.2 subtracts:
* **Controls**: `mc-btn` is flat — a hairline `line-strong` frame with stepped corners, no bevels, no dark outline;
  primary is a solid fill; `mc-btn-lg` is roomier. `hotbar`, `mc-input`, `kit-slot` lose their bevels/outlines.
* **Cards**: `px-card` has a hairline frame and no pixel drop; on hover a soft shadow. `kit-badge` is a tint without
  an outline.
* **Labels**: `.kit-pixel-label` (eyebrows, badges, code titles, `hotbar-pixel`) is Inter small caps (0.75rem,
  0.14em); Silkscreen remains only in the LeviMC wordmark.
* **Hero**: taller (74vh), display 6rem max, larger tagline and spacing. **Backdrop**: brush texture 0.16 / 0.12, so
  reading areas are calm; the paintings carry the Monet.
* Sites: levimc.org's home drops the logo frame, stats, floating tooltip, CTA banner and boxed grids (projects,
  features, team, supporters, story chapters are frameless items under hairlines); pkg.levimc.org's results, filters
  and package facts likewise.

**Compatible.** Same classes and components; only their look changed.

### 2.1.1 — 2026-10-18

**Footer: no disclaimer.** The legal row drops the "Not an official Minecraft product…" notice; it is now © year ·
**Support us** only. `UiStrings.notAffiliated`, `.kit-footer-notice` and `--kf-faint` are gone.

#### Migrating a site to 2.1.1
Nothing is required.

### 2.1.0 — 2026-10-18

**Aesthetics: one edge, a modern face, more Monet.** Feedback: the grass-block strip between banner and page was
ugly, the serif display face felt dated, and the Monet + Minecraft blend was neither natural nor Monet enough.
* **Pixel dissolve** replaces the grass strip everywhere. A painting ends by breaking into 6px blocks over 96px while
  fading over 160px (`.kit-dissolve-bottom|top|left`, masks `--kit-dissolve-*` generated by `build-assets.mjs`) —
  the hero's left and bottom edges, the docs scene band (`PaintedBackdrop`, now 15rem) and the footer's top edge use
  the same one. No scrims: the hero painting sits right of the copy (`--kit-hero-paint-x`) and the copy on canvas.
* **Footer**: the theme's painting — Nymphéas under a linen wash (light), Impression, soleil levant under night ink
  (dark) — rising out of the page; no dirt texture. Colours via `--kf-*`.
* **Type**: Manrope replaces Fraunces as `--font-display` (700; hero 800), with a metric-matched `Manrope Fallback`.
  It has Cyrillic, so the `:lang(ru)` display override is gone. `GOOGLE_FONTS_HREF` / Doxygen header updated.
* **Monet**: stronger colour fields in the page backdrop (more dabs, also mid-page), brush texture 0.42/0.3; `px-card`
  surfaces let 14% of the painted page through. Dark hero shows the sun (scene positioned at 78%).
* `.kit-rule`: five paint dabs in pixels (lily, pond, wisteria, rose, sunlight); `--kit-rule-dabs` for pseudo-elements.
  `.grass-divider` renders as `.kit-rule`.

**Compatible.** `PaintedHero horizon` is ignored (deprecated); `.kit-hero-horizon` / `.kit-hero-scrim` render nothing;
`--kit-grass-strip`, `--kit-dirt*` stay defined but unused.

#### Migrating a site to 2.1.0
Nothing is required (sites fetch the kit at build time). Sites that compose a hero by hand (pkg.levimc.org's
compact hero) wrap art + brush in `<div class="kit-hero-paint kit-dissolve-bottom">` and give both
`kit-dissolve-left`; drop grass dividers and hand-made scrims; replace `font-weight: 560` on display text with 700.

### 2.0.0 — 2026-10-18

**One source, fetched at build time.** The kit moved from LiteLDev/liteldev.github.io to LiteLDev/levimc.org
(`kit/`, with `demo/` and `kit.yml`) and is no longer vendored: levimc.org publishes it at
`https://levimc.org/kit/v2/` with every deploy (`scripts/publish-kit.mjs`), every site fetches it from its package
install (`scripts/fetch-kit.mjs`, `kit/` git-ignored), levimc.org triggers the sites' deploys after a kit change
(`sync`, `KIT_SYNC_TOKEN`) and each site re-checks hourly. `KIT_BUILD` (a content hash) joins the generator meta.
The local patches of LeviLamina (Doxygen row: the docs' own tabs, skip link) and LegacyScriptEngine (Python-Markdown
list re-attachment, `tests/preprocess-hoist.test.mjs`) are upstream.

**The same chrome everywhere** (verified with the new `scripts/chrome-parity.mjs`):
* Bar: **Home · Projects ▾ · Mods · Blog · Community · About**. The Docs menu and levimc.org's projects page are
  replaced by the **Projects** mega menu — every project (`PROJECTS`: LeviLamina, LegacyScriptEngine, lip,
  LeviLauncher, LeviLaunchroid, LeviOptimize, LeviAntiCheat, MoreDimensions) by group, each row leading to its docs
  (or repository) with explicit Docs and GitHub links, plus "All repositories on GitHub"; a collapsed section on phones.
* The LeviMC leaf mark (`BrandMark`, formerly levimc.org's own) in the bar and the footer on every site; the GitHub
  button always opens the LiteLDev organisation; language options carry the kit's names (`uiLocaleName`) and the
  trigger shows the full name.
* Footer (following small OSS orgs: each channel once, no copy of the bar's links): mark + tagline, the social icons
  (Discord, Telegram, X, YouTube, GitHub, Email), and one legal row — © year · **Support us**. No link columns.
* Doxygen: the bar and footer match the docs pages (line heights, weights, social tiles, screen-reader text no longer
  bent by doxygen.css / doxygen-awesome); `.kit-footer` has fixed metrics.

**Breaking.** `SiteId` loses `'docs'` (docs pages pass `currentProject`); `LINKS.projects` is gone (`LINKS.support`
is new); `UiStrings` drops `footerDocs` / `footerEcosystem` and adds `supportUs`, `projectGroups`, `allRepositories`;
ignored now: `GlobalBar github` / `brandIcon`, `SiteFooter extra` / `copyright`, docs `footer`. `currentDocs` is an
alias of `currentProject`.

#### Migrating a site to 2.0.0

1. `git rm -r --cached kit`, add `kit/` to `.gitignore`, copy `kit/scripts/fetch-kit.mjs` to `scripts/`, add the
   `postinstall` / `kit` scripts; in CI the package install now fetches the kit (Doxygen: run `fetch-kit.mjs` first).
2. Add the hourly `kit` job and let the deploy job run on `schedule` / `workflow_dispatch` (see any site's workflow).
3. Drop `github`, `brandIcon`, `extra`, `copyright`, docs `footer` and chrome-label `ui` overrides (`theme` …).


### 1.1.0 — 2026-10-18

**One chrome on every site (the unified chrome contract).**

* `GlobalBar` is identical everywhere: tabs **Home · Projects · Docs ▾ · Mods · Blog · Community · About** and,
  on the right, **language menu · theme menu · GitHub**. Sites can no longer replace, hide or reorder them
  (`items` and `end` are gone; `end` is accepted and ignored). Same-site tabs can route in the app
  (`siteOrigin` + `linkComponent` + `isAppPath`), the brand sprite can be swapped (`brandIcon`), the GitHub
  button can point at a project (`github`), and `sticky` keeps the bar on top for sites without another header.
  The phone menu (≤ 960px) lists the same links; on docs sites the docs drawer carries them (`menu={false}`).
  The bar is a labelled region, so axe's `region` rule passes on every page.
* Theme: **Auto / Light / Dark** in a menu (`ThemeSwitcher`; `ThemeToggle` is now its alias). Auto follows
  `prefers-color-scheme` live and is the default; the trigger shows the current state's sprite and name.
* Cross-site preferences (`components/prefs.ts`): cookies `levimc_theme` and `levimc_lang` on
  `Domain=levimc.org; Path=/; SameSite=Lax; Secure; Max-Age=1 year`, localStorage as fallback (and kit 1.0's
  `levimc-theme` copied into the cookie once). Every pre-paint script reads them (no flash). Locale mapping
  (`matchLocale`, `pickLocale`): zh-* → the site's zh variant, then base language, then English.
  `usePreferredLocale` gives plain apps their locale from the preference.
* Docs language: the bar's language menu is the site's locale switcher (stores the preference, opens the
  equivalent page). The root-only redirect follows the stored preference first — **it always wins**, also after
  an in-site link — then the browser languages. Explicit locale URLs never change the preference.
* Docs header redesigned as the lower half of one header: logo + name, section tabs and search in one light,
  compact row (3.25rem) on the page's canvas; no theme/language/GitHub controls (they are in the bar); the bar
  scrolls away and the row sticks, with a hairline only once stuck. Long navs fit themselves before the first
  paint and on resize (`html[data-kit-nav-fit]`: icon search → tabs row → drawer; `header.tabsRow`). Phones:
  one menu button, one drawer with the sections, the sidebar and the LeviMC links.
* Static pages and Doxygen get the same bar with working language and theme menus: `kit.js` (now generated
  from `kit.src.js`) translates the chrome — and only the chrome — into the stored language (9 UI locales) and
  stores choices cross-site; `theme-init-static.js` keeps the chrome hidden ≤ 1.5 s while it does, so it never
  flashes.
* Doxygen header redesigned as the docs pages' one header: GlobalBar (menu off) + one light row with the
  project's logo and name, its docs sections plus an active "Doxygen API" tab, and Doxygen's search; the
  painted title band and Doxygen's menubar are gone (the tree has the same entries); phones get one menu
  button whose panel holds the sections, Doxygen's menu and the LeviMC links; Doxygen's regions are landmarks.
* No flash of the prerendered language: `createPrefsInitScript({ appLocales })` + `usePreferredLocale` for
  plain apps (the page waits, ≤ 1.5 s, until it shows the visitor's language), the same for the chrome of
  single-locale docs sites — which now follows the stored preference in place.
* Language and theme menus have the WAI-ARIA menu keys (Arrow keys, Home/End, focus on the checked item when
  opened from the keyboard) in React and in kit.js.
* Docs pages without JavaScript follow a dark system theme (the build emits `assets/kit-nojs-dark.<hash>.css`
  from the site stylesheet, loaded inside `<noscript>`), like the static pages.
* Hero pages look the same under the docs row: a page with a `PaintedHero` never also shows the backdrop's
  scene band (home layout, custom layouts, apps).

**Renames.** pkg.levimc.org is **LeviMC Mods**: bar/footer label "Mods" (en/es/de/fr), "模组" (zh-CN), "模組"
(zh-HK), "MOD" (ja), "모드" (ko), "Моды" (ru); `modsName` / `modsBlurb` strings ("LeviMC Mods" / "LeviMC 模组" /
"LeviMC 模組"); the id stays `packages`. The Blog link is `https://levimc.org/blog/` (blog.levimc.org no longer
resolves).

**Upstreamed from the round-1 site ports** (delete the local copies when re-vendoring):

| Patch | From | Now in the kit |
|---|---|---|
| prerender with replacement functions (`$&` in content) | pkg.levimc.org | `ssg/prerender.mjs`, `docs/prerender.mjs` |
| GlobalBar `linkComponent` | levimc.org | `siteOrigin` + `linkComponent` + `isAppPath` (GlobalBar, GlobalNavList, SiteFooter) |
| `LocaleOption.short` (trigger text "EN") | levimc.org | `LocaleSwitcher` |
| header tabs row for long navs | LeviLamina | `header.tabsRow` (`'auto'` default) + nav fit |
| sidebar/drawer/TOC reveal of the current entry | LeviLamina, LegacyScriptEngine | `components/reveal.ts`, Sidebar, MobileDrawer, Toc |
| no second external glyph after "🔗" | LeviLamina | Sidebar |
| heading `scroll-margin-top` counted the header twice | LeviLamina | `theme/prose.css` |
| mobile TOC on the article's measure | lip, LeviLauncher, LeviLamina | `docs.css` |
| scrollable tables focusable (axe) | lip, LeviLamina | `enhance.ts` |
| pymdownx tab ids `#__tabbed_<set>_<n>` (+ hash selects the tab) | LeviLamina | `render.ts`, `enhance.ts` |
| Material home title (`:title - X` → `X` on the root page) | LeviLamina, LegacyScriptEngine | `shared/head.ts` |
| empty `dist/kit/docs/app/` left behind | LeviLamina, LegacyScriptEngine | `docs/prerender.mjs` |
| Doxygen: bar above Doxygen's layers, search field contrast, doxygen.nl credit link | LeviLamina | `static/doxygen/*` |
| TOC indentation for levels 3/4 (`outline: [2, 6]`) | LegacyScriptEngine | `docs.css` |
| python-markdown: wide list-marker gaps, lazy blockquote continuation, Python's code-span pairing | LegacyScriptEngine | `preprocess.ts` |
| Python-Markdown footnote ids (`fn:1`, `fnref:1`) — now with the label's own case (`fn:Note`) | LegacyScriptEngine | `render.ts` |
| `sitemap.xml.gz` for directory-style sites | LegacyScriptEngine | `docs/node/vite.ts` |
| 4 home features → 2 × 2 | lip | `docs.css` |
| bold link text keeps the link colour | lip | `prose.css` |
| search button named by its visible text (label visually hidden when compact) | lip | SiteHeader, `docs.css` |
| ThemeToggle reads the site's `ui` strings | LeviLauncher | GlobalBar gets the docs strings |
| `<dir>/index` URLs match (no hydration into 404) | LeviLauncher | `shared/routing.ts` |
| `:lang(ko)` keep-all, `:lang(ru)` sans display face, 404 title balance / `auto-phrase` | LeviLauncher | `base.css`, `docs.css` |
| sidebar/TOC wrappers are `<div>` around their labelled `<nav>` (axe landmark-unique) | LeviLauncher | DocLayout |
| folder-mode links name the file they link (`[English](/)`) | LeviLaunchroid | `links.ts` |
| active header item: exact → dropdown that lists the page → longest prefix | LeviLaunchroid | `nav.ts` |
| open nav dropdown not clipped by the scrolling list | LeviLaunchroid | `docs.css` |
| pixel focus outline in menus | LeviLaunchroid | `chrome.css` |
| nav fit (no clipped items) — now also before hydration | LeviLaunchroid | SiteHeader (inline script + hook) |
| `SiteFooter copyright` (footer.copyright no longer replaces footer.message) | LeviLaunchroid | SiteFooter, docs App |
| menus close when focus leaves | LeviLaunchroid | `menu.ts`, `kit.js` |
| current page marked in nav dropdowns and the drawer | LeviLaunchroid | SiteHeader, MobileDrawer |
| hero action row may be wider than the 40rem text | LeviLaunchroid | `chrome.css` |
| static pages: skip link, underlined title link, balanced title, no-JS dark theme, live footer year, redirect before stylesheets | liteldev.github.io | `static/build-static.mjs`, `kit-nojs-dark.css`, `kit.js` |

Not taken over, and why:

* levimc.org's GlobalBar `items` (custom tabs): the bar must be identical on every site. Features and
  Support Us move out of the bar into levimc.org's pages / footer.
* LeviLaunchroid patch 7 as written (skip the redirect after an in-site link even with a stored choice): the
  stored preference must always win. The referrer skip remains for visitors without a preference.
* LeviLaunchroid patch 8 (following a link to another locale's home stores that locale): only the language
  menu changes the preference; visiting a locale URL never does.
* lip's labelled `<aside>` wrappers: LeviLauncher's plain wrappers around the already-labelled `<nav>`s give
  one landmark per region instead of two.
* lip's social icons in the drawer and LegacyScriptEngine's ≤ 420px title squeezing: superseded by the new
  header (GitHub is in the bar at every width; the docs row has no other controls, so names fit from 320px).

**Other fixes.** Sidebar groups of the `'tabs'` sidebar start closed unless they hold the current page
(MkDocs Material without `navigation.expand`; `sidebarExpand: true` restores 1.0); the bar's phone menu
scrolls inside the viewport with a scroll cue; `PaintedHero` has `badge` / `aside` slots, puts a space between
its title lines (textContent "Mod Bedrock your way."), and its default scenes are cached CSS backgrounds
(`theme/hero.css`) instead of ~200 KB of inline SVG per page; `Card` likewise spaces title and description;
`.px-card`'s drop no longer leaks into nested pixel controls; plain `<code>` inside `.kit-code` wraps (only
Shiki's `pre > code` is `max-content`); `scroll-padding-top` only reserves a sticky header that exists
(`--kit-sticky-offset`); metric-matched fallback fonts remove the layout shift of the web-font swap;
`<meta name="generator" content="levimc-kit 1.1.0">` on every docs page, prerendered app page, static page and
Doxygen page; `smoke.mjs` has an app mode and checks the chrome contract; `serve-pages.mjs` collapses repeated
slashes and redirects every directory like GitHub Pages; the scripts run through symlinked paths;
`vendor.mjs` also accepts `<app>/kit`; the kit type-checks with TypeScript 6.0.x and 7.x.

#### Migrating a site to 1.1.0

1. Re-vendor (`rm -rf kit && node <kit>/scripts/vendor.mjs .`) and delete every local kit patch (the table
   above). Copy `kit/static` assets again where a site serves them (now also `kit-nojs-dark.css`).
2. Remove site-local theme/language/GitHub controls from headers and the GlobalBar `end`/`items` props; pass
   the site's languages as `languages={…}` instead. Replace site-specific theme/language storage with the kit
   preferences (pre-paint: `createThemeInitScript({ legacyTheme, legacyLang })` migrates old keys once).
3. CSS that targeted `html[data-theme-pref="system"]`, `.kit-theme-toggle*`, `.kit-site-locale` or the 3.75rem
   docs header: the state is now `auto`, the classes are `.kit-theme*`, the header row is 3.25rem
   (`--spacing-header`).
4. Run `smoke.mjs` (docs or `--app`): it now fails on any deviation from the chrome contract.

Site-specific notes:

* **levimc.org** — drop the GlobalBar/LocaleSwitcher patches; `<GlobalBar sticky siteOrigin="https://levimc.org"
  linkComponent={RouterLink} isAppPath={(p) => !p.startsWith('/blog/')} brandIcon={…} languages={{ options
  (with short "EN"/"ZH"), current, onSelect }} />`; drop `.lm-banner` sticky and `.lm-gbar-locale` CSS; prepaint:
  `createThemeInitScript({ appLocales: { locales: LOCALES, prerendered: 'en' }, legacyTheme: ['theme'], legacyLang:
  [{ key: 'locale', map: { en: 'en', zh: 'zh-CN' } }] })` (LOCALES shared by `vite.config.ts` and the app) and read
  the locale with `usePreferredLocale`; drop any own `#root`-hiding CSS for the language switch; hero badge/code
  card via `PaintedHero badge` / `aside` (drop the `order:-1` / absolute positioning); footer labels via
  `SiteFooter strings`.
* **pkg.levimc.org** — drop the prerender patch and the `--px-drop` / `.kit-code code` overrides;
  `current="packages"`, languages en / zh-CN / zh-HK with `usePreferredLocale` and the same locales as
  `appLocales` in the pre-paint script (no English flash for zh visitors); TypeScript 6.0.3 is fine.
* **LeviLamina** — drop all `[kit patch: …]` code; `header: { tabsRow: true }` can go (`'auto'` keeps one row at
  1440px and wraps only when needed); point the Doxyfile at the new `kit/static/doxygen/` header/footer/CSS and
  `kit/static/kit.js` again (the header's sections mirror `docs.config.ts` — update `DOX` in
  `kit/static/build-static.mjs` when the top-level nav changes).
* **LegacyScriptEngine** — drop the patches; the `collapsed: true` marks on API groups are now the default
  (harmless to keep).
* **lip, LeviLauncher, LeviLaunchroid** (now part of LeviLauncher) — drop the patches; LeviLaunchroid's referrer/remember-locale
  behaviour is replaced as described above.
* **liteldev.github.io** — the static-page decorations of `scripts/build-site.mjs` are in `kit/static` now.

### 1.0.0 — 2026-10-17

First release: design tokens and theme, components, the static docs engine (MkDocs and VitePress ports),
static chrome and Doxygen templates, verification scripts.
