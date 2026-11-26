# One package (2026-11-25)

The repository is one site built by one package: one `package.json` and lockfile at the root, one `npm ci`, one
`npm run build` into `dist/`. The kit is no longer copied into each site or published (`levimc.org/kit/v2/` is gone).
No URL of the site changed. What moved:

| Before | Now |
| --- | --- |
| `src/`, `index.html`, `vite.config.ts`, `prerender.mjs`, `blog/` | `src/main/` (the blog's code in `src/main/blog/`) |
| `kit/` | `src/kit/` |
| `mods/src/`, `mods/index.html`, `mods/vite.config.ts`, `mods/prerender.mjs` | `src/mods/` |
| `mods/repos.txt` | `content/mods/repos.txt` |
| `mods/scripts/` | `scripts/mods/` |
| `legacy/`, `versions/` | `src/legacy/`, `src/versions/` |
| `tutorials/`, `faq/`, `docs/<Project>/` | `content/tutorials/`, `content/faq/`, `content/<Project>/` |
| `<site>/content/` (LeviLamina: `contents/`) | `content/<Site>/pages/` |
| `docs/README.md` | `content/README.md` |
| `docs/LeviLamina/api/`, `kit/static/doxygen/` | `doxygen/` |
| each site's `package.json`, lockfile, `tsconfig.json`, `vite.config.ts`, `.gitignore`; `mods/pnpm-lock.yaml` | the root's |

Commands: `npm run dev` / `dev:mods` / `dev:docs -- <Site>`, `npm run build` (`-- main|mods|docs|search` for a part),
`npm run typecheck`, `npm run lint`, `npm test`, `npm run linkcheck`, `npm run budget`, `npm run smoke` (the browser
checks; Playwright is a devDependency now); `bash doxygen/build.sh` for the API reference. `npm run vendor`, the
per-site `npm ci` and Mods' `pnpm` are gone. Builds write to `dist/`, `.build/` (Mods, each docs site), `.kit/` and
`.cache/` — all git-ignored.

A branch from before this change is rebased as usual: git follows the renames. The sections below are the earlier
migrations; the paths and commands in them are today's, and a path of their time is marked "was".

# The language first, and every docs site built here (2026-11-16)

Every levimc.org URL starts with its language; English has none:

| | English | Simplified Chinese | Traditional Chinese | others |
| --- | --- | --- | --- | --- |
| levimc.org | `/about/` | `/zh-Hans/about/` | `/zh-Hant/about/` | |
| LeviMC Mods | `/mods/` | `/zh-Hans/mods/` (was `/mods/zh-Hans/`) | `/zh-Hant/mods/` | |
| Tutorials | `/tutorials/x/` | `/zh-Hans/tutorials/x/` (was `/tutorials/zh-Hans/x/`) | `/zh-Hant/tutorials/x/` | |
| Project docs | `/LeviLamina/x/` | `/zh-Hans/LeviLamina/x/` (was `/LeviLamina/zh-Hans/x/`, `/LeviLamina/zh/x/`) | `/zh-Hant/LeviLamina/x/` | LeviLauncher: `/es/`, `/ru/`, `/de/`, `/ja/`, `/ko/`, `/fr/` (was `/LeviLauncher/ja-JP/…`) |

LeviLamina's Doxygen API (`/LeviLamina/api/`) has no languages. Blog posts keep their one URL.

**Old URLs keep working.** Each docs build writes a redirect page at every page's old URL (levimc-kit 2.23,
`i18n.localeFirst` with `formerPrefixes`; query and #hash kept): `/tutorials/zh-Hans/x/` → `/zh-Hans/tutorials/x/`.
Whatever has no redirect page reaches the site's `404.html`, which forwards an old `/<Site>/<lang>/…` of a site
built here to `/<lang>/<Site>/…` (`src/legacy/build.mjs`; `zh`, `zh-CN`, `zh-HK`, `es-ES` … map to the new segments) and
fixes the case under a language (`/zh-Hans/levilamina/` → `/zh-Hans/LeviLamina/`).

**The docs moved into this repository.** Each project's docs became a docs site, `content/<Project>/` (was
`docs/<Project>/`; how, and the template: [content/README.md](content/README.md)); the deploy builds the tutorials,
the FAQ and every project's docs with this checkout's kit, merges them into the site and link-checks the whole
(`scripts/docs-sites.mjs`). LeviLamina's API reference is made in the deploy from a checkout of LiteLDev/LeviLamina
(`doxygen/build.sh`; was `docs/LeviLamina/api/`). The deploy no longer triggers the project repositories' docs
builds (the `sync` job and its `KIT_SYNC_TOKEN` are gone).

Until a project was imported, its repository still published `/<Project>/…` with the language after the base. The
links here used the language-first URLs already: the 404 forwards `/zh-Hans/<Project>/x` to `/<Project>/zh-Hans/x`
(LeviLauncher's other languages to `ja-JP` …) for every project without a docs site here, and `npm run linkcheck`
treats those projects as other sites. Adding `content/<Project>/docs.config.ts` switches both for it. All six
projects are imported now.

**Cutover, per project:** merge its import here (the deploy publishes `/<Project>/` and `/<lang>/<Project>/` from
`dist/`); then, in the project's repository, turn GitHub Pages off and delete its docs workflow. GitHub serves a
project path from the project's repository while its Pages are on, so until then only the language-first URLs come
from here. The targets in `src/legacy/redirects.mjs` are language-first already:
`node src/legacy/build.test.mjs --live` passes again once every project is cut over.

# The project docs moved from docs.levimc.org to levimc.org (2026-11-15)

`https://docs.levimc.org/<Project>/…` is now `https://levimc.org/<Project>/…`. The pages, their paths and their
repositories stayed as they were.

## How it works

As it stood on 2026-11-15, when each project's repository built and published its own docs. Since 2026-11-16 they
are built here (the section above); the domains, the redirects and the rules below still hold.

GitHub Pages serves a project repository's site (LeviLamina, LegacyScriptEngine, lip, LeviLauncher, BeDD, bedboo)
at `/<Repo>/` below the **organisation site's** custom domain. The organisation site used to be
LiteLDev/liteldev.github.io with the domain docs.levimc.org, and levimc.org was a project site with a domain of its
own. Now this repository *is* the organisation site (renamed from `levimc.org` to `liteldev.github.io`) with the
domain levimc.org, so every project site appears at `levimc.org/<Repo>/` without any change to how it is built.

This repository took over what the old organisation site did: `src/legacy/` publishes the redirect pages of the retired
docs sites (`/LeviLaunchroid/`, `/preloader-android/`, `/LiteXLoader/`), and `404.html` forwards other forms of
those URLs and wrongly cased project paths (`/levilamina/` → `/LeviLamina/`).

**docs.levimc.org** is proxied by Cloudflare, and a Cloudflare redirect rule answers every request with a **308** to
the same path and query on levimc.org (`https://docs.levimc.org/LeviLamina/x/?q=1` →
`https://levimc.org/LeviLamina/x/?q=1`). Nothing on GitHub serves docs.levimc.org any more: keep the record proxied
and the rule on, or docs.levimc.org answers with GitHub's 404.

Things to know:

* **Project paths win.** A repository with Pages owns `/<repo name>/` on levimc.org. No route of this site may start
  with a repository's name, and no repository named like a route (`blog`, `mods`, `tutorials`, `faq`, `zh-Hans`,
  `zh-Hant`, `api`, `about`, …) may turn Pages on. LiteLoader.NET and liteloaderbds-documentation have Pages on and
  appear at `levimc.org/LiteLoader.NET/` and `levimc.org/liteloaderbds-documentation/`.
* **Same origin.** Docs and levimc.org share cookies and localStorage. levimc.org's router leaves the docs paths
  alone (`isAppPath`; the list of other builds is `OTHER_SITES` in `src/main/other-sites.ts`, which also scopes
  cross-site prerendering).
* Each docs site points its canonical URLs and sitemap (`hostname` in its `docs.config.ts`) and its link check
  (`--site-origin`, `scripts/docs-sites.mjs`) at `https://levimc.org`.

## What was done

1. Opened a PR in each project repository that changes `https://docs.levimc.org` to `https://levimc.org`:
   `hostname` / `sitemap.hostname` in `docs.config.ts`, `linkcheck --site-origin`, the hourly kit check, and links
   in the docs, READMEs and code.
2. Removed the domain levimc.org from LiteLDev/levimc.org's Pages and docs.levimc.org from LiteLDev/liteldev.github.io's.
3. Renamed LiteLDev/liteldev.github.io → LiteLDev/docs.levimc.org, and LiteLDev/levimc.org → LiteLDev/liteldev.github.io.
4. Set the domain levimc.org on LiteLDev/liteldev.github.io and merged LiteLDev/levimc.org#99 (this change). After the
   certificate was issued, turned on *Enforce HTTPS*.
5. Set the domain docs.levimc.org on LiteLDev/docs.levimc.org and deployed its forwarding page; docs.levimc.org
   was put behind Cloudflare with a 308 redirect rule.
6. Merged the project PRs (the docs rebuild with their new canonical URLs).
7. Deleted LiteLDev/docs.levimc.org (the old organisation repository; its legacy redirects live on in `src/legacy/`).

## Checks

```sh
for p in "" LeviLamina/ LeviLamina/api/ LegacyScriptEngine/ lip/ LeviLauncher/ BeDD/ bedboo/ mods/ blog/; do
  curl -s -o /dev/null -w "%{http_code} https://levimc.org/$p\n" "https://levimc.org/$p"
done
curl -s https://levimc.org/LeviLaunchroid/api/hook | grep -o 'rel="canonical" href="[^"]*"'
node src/legacy/build.test.mjs --live   # every legacy redirect target answers 200 without a redirect
curl -sI -A "Mozilla/5.0" "https://docs.levimc.org/LeviLamina/?q=1" | grep -i -E '^(HTTP|location)'   # 308, same path
```

Then, in Google Search Console, submit the docs sitemaps (`https://levimc.org/<Project>/sitemap.xml`; `robots.txt`
lists them too), and use *Change of Address* from the docs.levimc.org property to levimc.org (the Cloudflare rule
answers with permanent redirects).

## Rolling back

The steps as they were on 2026-11-15, when each project's repository still published its own docs. They do not undo
the later move of the docs into this repository (above).

1. Turn off the Cloudflare rule and switch the `docs` record back to DNS only.
2. Remove the domain from LiteLDev/liteldev.github.io's Pages, rename the repository back to `levimc.org`, and give
   it the domain levimc.org again.
3. Create a new organisation site, LiteLDev/liteldev.github.io, with the domain docs.levimc.org. It serves the
   project docs at docs.levimc.org/<Project>/ again; publish `src/legacy/` from it for the old redirects.
4. Revert LiteLDev/levimc.org#99 and the project PRs.
