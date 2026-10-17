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
- This copy is the kit in its vendored form: no `demo/`, no `package.json`, no dependencies. It cannot be
  type-checked or rebuilt here, and `kit/static/` (which `site/` is generated from) is prebuilt. Kit changes
  are therefore made and verified in the levimc-kit development workspace (the kit plus its `demo/` app with
  the dependencies installed; see "Maintaining the kit" in `kit/README.md`): typecheck, regenerate
  `kit/static/` with `static/build-static.mjs`, build the demo and run its linkcheck and smoke tests. Then
  copy the result here (`node <workspace>/scripts/vendor.mjs . && rm kit/.vendored`), bump `kit/VERSION`,
  regenerate `site/` (below), and re-vendor each site.

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

The generated pages load the kit's prebuilt assets (`kit.css`, `kit.js`, sprites) from `site/_kit/`; only the
files the pages reference are copied. On top of the kit's static pages the generator adds the kit's skip link,
an underline for the link in the "Redirecting to …" heading (and balanced heading wrapping), the kit's dark
theme for readers without JavaScript (`_kit/kit-nojs-dark.css`, the `.dark` rules of `kit.css`, loaded in
`<noscript>` for `prefers-color-scheme: dark`), and a footer year that follows the reader's clock. These are
candidates for `kit/static/` itself.

To forward another retired docs site, add it to `MOVED_SITES` in `scripts/legacy-redirects.mjs` (every old
URL, its new canonical URL, the new page's title and what happens to old `#anchors`; files the old site served
go in `legacy/<old-site>/`), regenerate and commit `site/`.
