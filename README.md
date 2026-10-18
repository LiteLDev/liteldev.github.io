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
- This copy is the kit in its vendored form: no `demo/`, no `package.json`, no dependencies. Its unit tests run
  here as they are (`node --test "kit/tests/*.test.mjs"`, also in CI). Everything that needs the kit's
  dependencies runs from any site that vendors the kit and has them installed, e.g. LeviLamina's `docs/main`
  after `npm ci`:
  1. edit `kit/` here, then vendor it into that app: `node kit/scripts/vendor.mjs <app-dir>`;
  2. in the app: `npm run typecheck` (TypeScript 7.x and 6.0.x), `node kit/static/build-static.mjs --out
     <this repo>/kit/static` (regenerates the prebuilt `kit/static/` here: snippets, `kit.js`, `kit.css`,
     `kit-chrome.css`, `kit-nojs-dark.css`, pages, Doxygen templates), `npm run build`, `npm run preview` and
     `npm run smoke` (plain apps: `smoke.mjs --app`), and `node kit/tests/cross-site.e2e.mjs` for the shared
     preferences (see "Verification scripts" in `kit/README.md`);
  3. here: bump `kit/VERSION` and `kit/components/version.ts`, add a Changelog entry, regenerate `site/`
     (below), commit, then re-vendor each site.

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
