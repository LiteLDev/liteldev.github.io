# liteldev.github.io

The root of **docs.levimc.org** (GitHub Pages, generated into `site/` and deployed by
`.github/workflows/deploy.yml`).

Project repositories with Pages publish their own docs at `docs.levimc.org/<Repo>/` (LeviLamina,
LegacyScriptEngine, lip, LeviLauncher, LeviLauncher for Android). This site answers every other path:

| Path | What it does |
| --- | --- |
| `/` | Redirects instantly to <https://levimc.org/> (canonical + meta refresh + `location.replace`); the page itself is the kit's themed fallback, visible only without JavaScript or during the redirect. |
| `/preloader-android/…` | One redirect page per URL of the former Preloader Android docs (and for its `api/`, `guide/` directories), which now live in the [LeviLaunchroid docs](https://docs.levimc.org/LeviLaunchroid/); its `appicon.png` is still published. |
| `/LiteXLoader/…` | The former LiteXLoader docs (docsify; `liteldev.github.io/LiteXLoader/` now redirects here) → the [LegacyScriptEngine docs](https://docs.levimc.org/LegacyScriptEngine/). |
| anything else | `404.html`: the kit's themed 404. Before it renders, a forwarding map sends other forms of the legacy URLs (trailing slash, `index.html`, unknown pages) and wrongly cased project paths (`/levilamina/…` → `/LeviLamina/…`) to their canonical page. |

## levimc-kit (`kit/`)

The pages are levimc-kit's static pages. The kit — the shared design system and chrome of every LeviMC website —
lives in [LiteLDev/levimc.org](https://github.com/LiteLDev/levimc.org) (`kit/`; its README documents it) and is
published at <https://levimc.org/kit/v2/>. `node scripts/fetch-kit.mjs` installs it into `kit/` (git-ignored;
`--source <levimc.org checkout>/kit` installs a local checkout instead). A kit change made in levimc.org reaches this
site with its next deploy: levimc.org triggers it, and the workflow checks hourly for a newer kit.

## Building `site/`

`site/` is generated (git-ignored): CI fetches the kit, builds it and deploys it. Node 24 (any Node ≥ 22.18), no
dependencies.

```sh
node scripts/fetch-kit.mjs            # install levimc-kit into kit/ (from https://levimc.org/kit/v2/)
node scripts/build-site.mjs           # generate site/ from kit/static, scripts/legacy-redirects.mjs and legacy/
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
go in `legacy/<old-site>/`) and commit; CI regenerates `site/`.
