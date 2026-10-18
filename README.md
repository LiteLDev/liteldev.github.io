# liteldev.github.io

The root of **docs.levimc.org** (GitHub Pages, deployed from `site/` by `.github/workflows/deploy.yml`) and
the home of **levimc-kit**, the shared design system of every LeviMC website.

Project repositories with Pages publish their own docs at `docs.levimc.org/<Repo>/` (LeviLamina,
LegacyScriptEngine, lip, LeviLauncher, LeviLaunchroid). This site answers every other path:

| Path | What it does |
| --- | --- |
| `/` | Redirects instantly to <https://levimc.org/> (canonical + meta refresh + `location.replace`); the page itself is the kit's themed fallback, visible only without JavaScript or during the redirect. |
| `/preloader-android/…` | One redirect page per URL of the former Preloader Android docs (and for its `api/`, `guide/` directories), which now live in the [LeviLaunchroid docs](https://docs.levimc.org/LeviLaunchroid/); its `appicon.png` is still published. |
| `/LiteXLoader/…` | The former LiteXLoader docs (docsify; `liteldev.github.io/LiteXLoader/` now redirects here) → the [LegacyScriptEngine docs](https://docs.levimc.org/LegacyScriptEngine/). |
| anything else | `404.html`: the kit's themed 404. Before it renders, a forwarding map sends other forms of the legacy URLs (trailing slash, `index.html`, unknown pages) and wrongly cased project paths (`/levilamina/…` → `/LeviLamina/…`) to their canonical page. |

## levimc-kit (`kit/`)

`kit/` is the canonical, published copy of levimc-kit and the source of truth for the vendored copies in each
site repository (`<app>/kit/`): sites vendor it from here and never edit their copy. See
[`kit/README.md`](kit/README.md) for the design system, the docs engine and the verification scripts.

- Vendor it into a site: `node kit/scripts/vendor.mjs <site-repo>/<app-dir>` (writes `<app-dir>/kit/`).
- What changed in each version, and what a site must change when it re-vendors: the Changelog at the end of
  [`kit/README.md`](kit/README.md#changelog).
- This is the kit's source, with its demo sites in `kit/demo/`: their sources and the pinned
  `package-lock.json` the kit is verified with (`vendor.mjs` leaves `demo/` out of every site copy). CI runs the
  kit's unit tests (`node --test "kit/tests/*.test.mjs"`, in `deploy.yml`) and type-checks, builds and
  link-checks every demo (`.github/workflows/kit.yml`). To change the kit:
  1. edit `kit/`, then in `kit/demo/`: `npm ci`, `npm run vendor` (the demo's own vendored copy, not committed);
     after any change to the components, the theme CSS, `prefs.ts`, `i18n.ts` or the `static/` sources run
     `node kit/static/build-static.mjs --out ../static` (regenerates the prebuilt `kit/static/`: snippets,
     `kit.js`, `kit.css`, `kit-chrome.css`, `kit-nojs-dark.css`, pages, Doxygen templates) and `npm run vendor`
     again;
  2. still in `kit/demo/`: `npm run typecheck` (TypeScript 7.x; 6.0.x works too), `npm test`, the builds
     (`build`, `build:lip`, `build:single`, `build:app`), their `preview*` servers and `smoke*` scripts, and
     `node kit/tests/cross-site.e2e.mjs --app app/dist --docs dist` for the shared preferences (see
     "Verification scripts" in `kit/README.md`);
  3. bump `kit/VERSION` and `kit/components/version.ts`, add a Changelog entry, regenerate `site/` (below),
     commit, then re-vendor each site.

## Building `site/`

`site/` is generated and committed; CI refuses to deploy a stale copy. Node 24 (any Node ≥ 22.18), no
dependencies.

```sh
node scripts/build-site.mjs           # regenerate site/ from kit/static, scripts/legacy-redirects.mjs and legacy/
node scripts/build-site.mjs --check   # what CI runs: fails if site/ is out of date
node --test "scripts/*.test.mjs"      # forwarding rules, redirect pages, assets
node scripts/build-site.test.mjs --live   # also checks every redirect target and mapped #anchor on the live site
node kit/scripts/serve-pages.mjs site --base / --port 4173   # preview with GitHub Pages semantics
```

The generated pages load the kit's prebuilt assets (`kit.css`, `kit.js`, `kit-nojs-dark.css`, sprites) from
`site/_kit/`; only the files the pages reference are copied. They are the kit's static pages as they are: the
LeviMC bar with the same tabs and controls as every other LeviMC site (language and theme menus that share
the visitor's choices with levimc.org and every *.levimc.org site through the `levimc_lang` / `levimc_theme`
cookies; `kit.js` translates the bar and footer into the chosen language), the skip link, the no-JavaScript dark
theme, the live footer year and `<meta name="generator" content="levimc-kit <version>">`. The generator only
adds the 404 forwarding map, the redirect pages' own text, their language and the docs project they belong to.

To forward another retired docs site, add it to `MOVED_SITES` in `scripts/legacy-redirects.mjs` (every old
URL, its new canonical URL, the new page's title and what happens to old `#anchors`; files the old site served
go in `legacy/<old-site>/`), regenerate and commit `site/`.
