# content/: what the site says

Everything levimc.org publishes that is written rather than programmed:

| Folder | Published at | What |
| --- | --- | --- |
| `blog/` | `/blog/` | posts, pages and authors of the blog (rendered by `src/main/blog/`) |
| `mods/repos.txt` | `/mods/` | the repositories LeviMC Mods lists (read by `src/mods/`) |
| `tutorials/` | `/tutorials/` | step-by-step tutorials from a clean PC — a docs site |
| `faq/` | `/faq/` | questions and answers — a docs site |
| `LeviLamina/`, `LegacyScriptEngine/`, `lip/`, `LeviLauncher/`, `BeDD/`, `bedboo/` | `/<Project>/` | each project's documentation — a docs site |

## Docs sites

A **docs site** is a folder here with a `docs.config.ts`:

```
content/<Site>/
├── docs.config.ts        the site: base, title, languages, navigation (defineDocsConfig, src/kit/docs/node/config.ts)
├── pages/                the markdown (and the images beside it)
├── public/               static files served at the site's root (optional)
├── scripts/              the site's own tools (optional); scripts/prebuild.mjs runs before every build and dev server
└── test/                 tests of the pages (optional; bedboo's reads from the network: npm run test:bedboo)
```

The folder name of a project's docs is the project's id in the kit (`PROJECTS` in `src/kit/components/projects.ts`)
and its base: `content/lip/` is published at `levimc.org/lip/`. Nothing lists the sites: adding a folder with a
`docs.config.ts` adds one. They share the site's one `package.json`, the docs engine (`src/kit/docs/`) and the
type-check and lint (`npm run typecheck` and `npm run lint` cover every `docs.config.ts` and every script).

```sh
node scripts/docs-sites.mjs list             # the sites
node scripts/docs-sites.mjs dev lip          # one site on a local server, rebuilt as you edit
node scripts/docs-sites.mjs build lip        # → .build/docs/lip/dist/, then its link check
npm run build                                # the whole of levimc.org, every docs site merged in (dist/)
npm run linkcheck                            # every link of the built site
npm run smoke -- docs                        # every docs site in a browser (npx playwright install chromium, once)
npm run preview                              # http://127.0.0.1:4173/
```

`build` runs, per site: its `scripts/prebuild.mjs` when it has one (lip writes its Traditional Chinese pages, BeDD
downloads the protocol's AsyncAPI document), the build, and the link check of its own pages. `npm run build` then
copies each site's build into `dist/`, without its `404.html` and `.nojekyll` (the site's root `404.html` serves
every missing path and forwards old URLs, `src/legacy/build.mjs`); a file two builds publish fails the build.

A project without a folder here is taken to publish its docs from its own repository: levimc.org's link check
treats that project's paths (under every language) as another site's (`node scripts/docs-sites.mjs other-sites`), and
the 404 page forwards its language-first URLs (`/zh-Hans/<Project>/x`) to where the repository publishes them
(`/<Project>/zh-Hans/x`; `LANGUAGE_SEGMENTS` in `src/legacy/redirects.mjs`). Adding `content/<Project>/docs.config.ts`
turns both off for it. All six projects are here now.

### URLs

The language is the first segment of every levimc.org URL: English at `/<Site>/…`, Simplified Chinese at
`/zh-Hans/<Site>/…`, Traditional Chinese at `/zh-Hant/<Site>/…` (LeviLauncher also `/es/`, `/ru/`, `/de/`, `/ja/`,
`/ko/`, `/fr/`). A site says so with `i18n.localeFirst: true`; its build then mirrors the host root
(`<Site>/…`, `zh-Hans/<Site>/…`, `404.html`) and is merged into levimc.org's `dist/` as it is. The URLs a project
published before (`/<Project>/zh-Hans/…`, `/<Project>/zh/…`, `/lip/zh/x.html`, `/LeviLauncher/ja-JP/…`) keep working:
they are listed in each locale's `formerPrefixes` and the build writes a redirect page at each old URL (query and
#hash kept).

### "Last updated"

Each page shows the date of the last commit that changed its text (the deploy checks out the full history). A
commit that only moves a page does not count, and a page's history is followed through moves — so reorganising
`pages/` keeps the dates (`src/kit/docs/node/git.ts`).

### The shape of a project's docs

Every project's docs have the same five sections in the site column, in this order and no others ("Navigation
model" in `src/kit/README.md`):

1. **Overview** (概览) — the home page, `pages/index.md` of each locale: a plain doc page (`# <Project>`, a lead,
   the introduction and a short demo — no `layout: home` banner) and a section with no pages of its own:
   `{ text: 'Overview', link: '/' }` (the locale's home) first in `nav`.
2. **Install** (安装) — one page, `pages/install.md` of each locale, a section with no pages of its own like Overview:
   `{ text: 'Install', link: '/install' }` second in `nav`. The same headings on every project, in this order, leaving
   out those with nothing to say: *What you need*, *Install*, *Check that it works*, *Update*, *Other versions* (the
   releases page, betas, older versions), *Uninstall*, *Next steps*. It is the only place that says how to get the
   project: the overview, the guides, the tutorials and the FAQ link to it, and levimc.org's home page leads to it.
   The site column has no download button.
3. **Guides** (指南) — how to do one thing with one feature, step by step; troubleshooting last, in a `Help` group.
4. **Concepts** (概念) — how it works and why: the model behind the features.
5. **Reference** (参考) — the complete external interface: API, protocol, CLI, configuration, files, supported versions
   (LeviLamina's Doxygen C++ Reference is its first link).

Step-by-step tutorials from a clean PC are at levimc.org/tutorials/ (a tutorial keeps the one usual way to install
in a step of its own, and names the Install page for the rest), questions and answers at levimc.org/faq/.

### Adding a project's docs

1. Put the markdown in `content/<Project>/pages/` and the static files in `content/<Project>/public/`; keep the git
   history if you can.
2. Add `content/<Project>/docs.config.ts` (below); `node scripts/docs-sites.mjs build <Project>`, then the
   whole-site check above.
3. `formerPrefixes`: every prefix the project published a locale under, relative to the base — its current one too
   (`['zh-Hans/', 'zh/']`, LeviLauncher `['es-ES/']` …). Keep `folder` / `suffix` as they were: the sources need not
   move. The project's `redirects` stay as they are (relative to the base).
4. Links into the other sites use language-first URLs (`https://levimc.org/zh-Hans/tutorials/…`).
5. In the project's repository, turn GitHub Pages off and delete its docs workflow: while Pages is on there, GitHub
   serves `/<Project>/` from that repository and the pages here only answer the language-first URLs.

```ts
import { defineDocsConfig } from '../../src/kit/docs/node/config.ts';

const repo = 'https://github.com/LiteLDev/<Project>';

export default defineDocsConfig({
  base: '/<Project>/',
  title: '<Project>',
  description: '…',
  logo: { src: 'https://levimc.org/logos/<Project>.webp', alt: '<Project>' },
  contentDir: 'pages',
  repo,
  editLink: 'https://github.com/LiteLDev/liteldev.github.io/edit/main/content/<Project>/pages/:path',
  hostname: 'https://levimc.org',
  sitemap: { hostname: 'https://levimc.org' },
  i18n: {
    mode: 'folder', // or 'suffix' (MkDocs x.zh.md), as the project had it
    defaultLocale: 'en',
    localeFirst: true,
    locales: [
      { code: 'en', label: 'English', lang: 'en', prefix: '' },
      { code: 'zh', label: '简体中文', lang: 'zh-Hans', prefix: 'zh-Hans/', folder: 'zh', formerPrefixes: ['zh-Hans/', 'zh/'] },
      { code: 'zh-Hant', label: '繁體中文', lang: 'zh-Hant', prefix: 'zh-Hant/', convertFrom: 'zh', formerPrefixes: ['zh-Hant/'] },
    ],
  },
  sidebar: 'tabs',
  // Overview (the home page), Guides, Concepts, Reference: see "The shape of a project's docs"
  nav: [{ Overview: 'index.md' }, { Guides: [/* … */] }, { Concepts: [/* … */] }, { Reference: [/* … */] }],
});
```

LeviLauncher's other languages: `{ code: 'ja-JP', label: '日本語', lang: 'ja', prefix: 'ja/', folder: 'ja-JP',
formerPrefixes: ['ja-JP/'] }` and so on (the prefixes are the kit's `docsLocales`: `es`, `ru`, `de`, `ja`, `ko`, `fr`).

The site's link check is derived from the config: its base, the prefixes of its locales, and for LeviLamina
`--ignore-paths /LeviLamina/api/` (the API reference is made after the docs build, see `doxygen/`).

## LeviLamina API reference

`/LeviLamina/api/` is Doxygen output over LeviLamina's headers, without languages (`docsUnlocalized` in the kit). It
is not content of this folder: its Doxyfile, layout, main page and the kit's chrome for it are in `doxygen/` at the
repository root, and `doxygen/build.sh` makes it into `dist/LeviLamina/api/` after `npm run build` (the deploy does;
see "LeviLamina Doxygen" in `src/kit/README.md`).
