# Writing the documentation

This page is for whoever writes the documentation of lip. It is not a page of the site (the pages are in
`pages/`). The pictures of the interface are made by lip's tests:
[tests/Lip.Cli.Tests/Tui/Screenshots/README.md](https://github.com/LiteLDev/lip/blob/main/tests/Lip.Cli.Tests/Tui/Screenshots/README.md)
in LiteLDev/lip says how. They write into `content/lip/public/screenshots/` of a checkout of this repository named
`liteldev.github.io` next to the lip checkout (or into `LIP_SCREENSHOTS_DIR`).

## Building the site

Since 2026-11-16 the documentation is built here, by levimc.org's deploy, with the docs of the other LeviMC
projects ([content/README.md](../README.md)). It is one of the docs sites of levimc.org's one package, built by the
docs engine in `src/kit/docs/`. From the repository root:

```
npm ci
npm run typecheck                          # docs.config.ts (and the rest of the site)
node scripts/docs-sites.mjs build lip      # scripts/prebuild.mjs (the converter's test, then pages/zh-Hant/), the
                                           # build (.build/docs/lip/dist/) and every link, anchor and picture of it
node scripts/docs-sites.mjs dev lip        # the site on a local server, rebuilt as you edit (prebuild first)
```

`docs.config.ts` holds what is not a page: the tabs and their sidebars, the labels in each language, and the
redirects of the pages that moved. A new page needs an entry in `nav` there; a page that moves needs one in `MOVED`.

The site has no tutorials: the introduction is the home page, and the rest are guides, concepts and reference. The
tutorials (your first server, a server from the command line, publishing a package) are at
[levimc.org/tutorials](https://levimc.org/tutorials/), written in this repository (`content/tutorials/pages/`). Link to
them with their full URL, in the language of the page: `https://levimc.org/tutorials/…` from an English page,
`https://levimc.org/zh-Hans/tutorials/…` from a Simplified Chinese one.

## The three languages

| Language | Pages | URLs | Pictures |
|---|---|---|---|
| English | `pages/**/*.md` | `/lip/…` | `/screenshots/en/` |
| Simplified Chinese | `pages/zh/**/*.md` | `/zh-Hans/lip/…` (formerly `/lip/zh-Hans/…` and `/lip/zh/…`, which redirect) | `/screenshots/zh-Hans/` |
| Traditional Chinese | `pages/zh-Hant/**/*.md`, **written by a script** | `/zh-Hant/lip/…` (formerly `/lip/zh-Hant/…`, which redirects) | `/screenshots/zh-Hant/` |

English and Simplified Chinese are written by hand, together: the same pages, the same headings in the same
order, the same pictures in their language.

### Traditional Chinese is generated

`scripts/zh-hant.mjs` writes `pages/zh-Hant/` from `pages/zh/`. The build and the dev server run it first
(`scripts/prebuild.mjs`), and `node content/lip/scripts/zh-hant.mjs` runs it alone. **Do not edit `pages/zh-Hant/`,
and do not commit it**: it is in the repository's `.gitignore`, and the script deletes what it did not write. The
"Edit this page" link of a Traditional Chinese page opens the Simplified page it was made from. A Traditional page
has no "Last updated" date, since git does not know it.

While the dev server runs, run `node content/lip/scripts/zh-hant.mjs` in another terminal after you changed a
Simplified page, to see its Traditional page change.

The script exists because the interface of lip does not say in Traditional Chinese what a conversion of characters
makes of its Simplified text: 服务器 is 伺服器 there, not 服務器; 设置 is 設定, 缓存 is 快取, 界面 is 介面. For a
page, outside its code, its link targets and its URLs, the script does three things:

1. **Texts of the interface.** A text in bold or in quotes (`**新建服务器…**`, `「主页」`, `“应用”`) that is a text
   of the interface in Simplified Chinese becomes the text that the interface shows in Traditional Chinese
   (`**建立伺服器…**`, `「首頁」`, `「套用」`: the quotation marks “ ” become 「 」 everywhere). The pairs are those of
   `scripts/interface-texts.json`, read from the `L.T(en, zhHans, zhHant)` calls of lip's `src/Lip.Cli/Tui/` by
   `node content/lip/scripts/interface-texts.mjs [<lip checkout>]` (by default `LIP_DIR`, else a `lip` checkout next
   to this repository's). Run it again, and commit the file, when the interface changes its texts.
2. **Terms.** The words of `scripts/zh-hant-terms.mjs` become their words of Taiwan, the longest match first.
3. **Characters.** OpenCC (`cn` → `tw`) converts the rest, as the kit does for a page that has no file of its own.

In link targets, `/screenshots/zh-Hans/` becomes `/screenshots/zh-Hant/`, a leading `/zh-Hans/` (or `/zh/`) becomes
`/zh-Hant/`, and a link to a Simplified Chinese page of levimc.org (`https://levimc.org/zh-Hans/tutorials/…`) leads to
its Traditional Chinese page; a `#fragment` is converted as the heading it names.

So, in a Simplified Chinese page:

- Write what the interface shows **in bold** (or in 「」), exactly as `…Text.cs` has it in Simplified Chinese, and
  alone: `**应用**`, not `**应用按钮**`. Then the Traditional page shows what the Traditional interface shows.
  Do not write it as code: code is kept as it is.
- When a Traditional page reads wrong, add the word to `scripts/zh-hant-terms.mjs`, and build again. A word that
  maps to itself keeps a longer word whole (`包含` is not `包`, 套件, and `含`).
- When the script itself converts something wrongly, or keeps what it should convert, add a case to
  `scripts/zh-hant.test.mjs` with the fix; `node content/lip/scripts/zh-hant.test.mjs` runs the cases, and so do
  `npm test` and every build of the site (`scripts/prebuild.mjs`).
- The labels of the tabs and the sidebar in Traditional Chinese are written by hand, in `LABELS['zh-Hant']` of
  `docs.config.ts`.

## Writing

- The name of the program is `lip`, in lower case, also at the start of a sentence.
- A page starts with one or two sentences that say what the reader can do after it.
- lip's protocol (`protocol/` in LiteLDev/lip) is right where a page and the protocol disagree. The texts of the
  interface are taken from the `…Text.cs` files of lip's `src/Lip.Cli/Tui/`, in the language of the page.
- Link to another page by its relative path with `.md` (`../interface/server.md`); refer to a picture by its
  path below `public/`, with a leading slash (`/screenshots/en/home-01-empty.svg`).
- No page recommends a GitHub proxy by name.
