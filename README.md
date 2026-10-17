# liteldev.github.io

The root of **docs.levimc.org** (GitHub Pages, deployed from `site/` by `.github/workflows/deploy.yml`) and
the home of **levimc-kit**, the shared design system of every LeviMC website.

Project repositories with Pages publish their own docs at `docs.levimc.org/<Repo>/` (LeviLamina,
LegacyScriptEngine, lip, LeviLauncher, LeviLaunchroid). This site answers every other path:

| Path | What it does |
| --- | --- |
| `/` | Redirects instantly to <https://levimc.org/> (canonical + meta refresh + `location.replace`); the page itself is the kit's themed fallback, visible only without JavaScript or during the redirect. |
| `/preloader-android/…` | One redirect page per URL of the former Preloader Android docs, which now live in the [LeviLaunchroid docs](https://docs.levimc.org/LeviLaunchroid/). |
| anything else | `404.html`: the kit's themed 404. Before it renders, a forwarding map sends other forms of the legacy URLs (trailing slash, `index.html`, `api/`, unknown pages) and wrongly cased project paths (`/levilamina/…` → `/LeviLamina/…`) to their canonical page. |

## levimc-kit (`kit/`)

`kit/` is the canonical copy of levimc-kit and the source of truth for the vendored copies in each site
repository (`<app>/kit/`). See [`kit/README.md`](kit/README.md) for the design system, the docs engine and the
verification scripts.

- Change the kit here, bump `kit/VERSION`, then re-vendor it into each site:
  `node kit/scripts/vendor.mjs <site-repo>/<app-dir>` (writes `<app-dir>/kit/`).
- Never edit a vendored copy in a site repository; patch the kit here and re-vendor.
- After changing `kit/static/`, regenerate this site (below).

## Building `site/`

`site/` is generated and committed; CI refuses to deploy a stale copy. Node 24, no dependencies.

```sh
node scripts/build-site.mjs           # regenerate site/ from kit/static and scripts/legacy-redirects.mjs
node scripts/build-site.mjs --check   # what CI runs: fails if site/ is out of date
node --test "scripts/*.test.mjs"      # forwarding rules, redirect pages, assets
node scripts/build-site.test.mjs --live   # also checks every redirect target on the live site (200, no redirect)
node kit/scripts/serve-pages.mjs site --base / --port 4173   # preview with GitHub Pages semantics
```

The generated pages load the kit's prebuilt assets (`kit.css`, `kit.js`, sprites) from `site/_kit/`; only the
files the pages reference are copied.

To forward another retired docs site, add it to `MOVED_SITES` in `scripts/legacy-redirects.mjs` (every old
URL, its new canonical URL and the new page's title), regenerate and commit `site/`.
