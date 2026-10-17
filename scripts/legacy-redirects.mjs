// Legacy URLs under docs.levimc.org that this root site forwards.
//
// GitHub Pages serves this repository for every path of docs.levimc.org that no project repository with
// Pages owns (project repos own /<Repo>/). scripts/build-site.mjs turns this table into
//   * a real redirect page for every old URL (site/<from>/…, meta refresh + location.replace + canonical), and
//   * the forwarding map that site/404.html runs before rendering (old URL variants, aliases, wrong case).
//
// All targets are canonical, redirect-free URLs (answer 200 directly); `node scripts/build-site.test.mjs --live`
// verifies them against the live site.

export const ORIGIN = 'https://docs.levimc.org';

/**
 * Documentation sites that moved. `pages` lists every page the old site published (VitePress `cleanUrls`:
 * `api/hook` was served from `api/hook.html`; `''` and `zh-CN/` are the locale home pages):
 *   [old page, new page, lang, title of the new page, keepHash]
 * `keepHash` forwards the old #anchor (same page, same headings); it is dropped when the page changed.
 * `aliases` are extra old paths (never published, but obvious guesses) that only the 404 forwards.
 */
export const MOVED_SITES = [
  {
    // LiteLDev/preloader-android docs/ at a29b5a6702 (VitePress, base /preloader-android/, cleanUrls,
    // locales: root = English, zh-CN/). The SDK docs now live in LeviLaunchroid's docs; Pages on
    // preloader-android is disabled, so these paths reach this site.
    from: '/preloader-android/',
    to: '/LeviLaunchroid/',
    oldName: 'Preloader Android',
    newName: 'LeviLaunchroid',
    pages: [
      ['', '', 'en', 'LeviLaunchroid docs', true],
      ['guide/getting-started', 'guide/developer', 'en', 'Native Mod Quick Start', false],
      ['guide/build', 'guide/developer', 'en', 'Native Mod Quick Start', false],
      ['guide/compatibility', 'guide/developer', 'en', 'Native Mod Quick Start', false],
      ['api/mod', 'api/mod', 'en', 'Mod API', true],
      ['api/input', 'api/input', 'en', 'Input API', true],
      ['api/hook', 'api/hook', 'en', 'Hook API', true],
      ['api/signature', 'api/signature', 'en', 'Signature API', true],
      ['api/patch', 'api/patch', 'en', 'Patch API', true],
      ['api/memory-hook-macros', 'api/memory-hook-macros', 'en', 'Memory Hook Example', true],
      ['api/types-and-macros', 'api/types-and-macros', 'en', 'SDK Headers and Macros', true],
      ['zh-CN/', 'zh-CN/', 'zh-CN', 'LeviLaunchroid 文档', true],
      ['zh-CN/guide/getting-started', 'zh-CN/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/guide/build', 'zh-CN/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/guide/compatibility', 'zh-CN/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/api/mod', 'zh-CN/api/mod', 'zh-CN', 'Mod API', true],
      ['zh-CN/api/input', 'zh-CN/api/input', 'zh-CN', 'Input API', true],
      ['zh-CN/api/hook', 'zh-CN/api/hook', 'zh-CN', 'Hook API', true],
      ['zh-CN/api/signature', 'zh-CN/api/signature', 'zh-CN', 'Signature API', true],
      ['zh-CN/api/patch', 'zh-CN/api/patch', 'zh-CN', 'Patch API', true],
      ['zh-CN/api/memory-hook-macros', 'zh-CN/api/memory-hook-macros', 'zh-CN', 'Memory Hook 示例', true],
      ['zh-CN/api/types-and-macros', 'zh-CN/api/types-and-macros', 'zh-CN', 'SDK 头文件与宏', true],
    ],
    aliases: [
      ['api', 'api/mod'],
      ['guide', 'guide/developer'],
      ['zh-CN/api', 'zh-CN/api/mod'],
      ['zh-CN/guide', 'zh-CN/guide/developer'],
      ['appicon.png', 'appicon.png'],
    ],
    // Anything else under the old site goes to the matching locale's home page.
    fallbacks: [
      ['zh-CN/', 'zh-CN/'],
      ['', ''],
    ],
  },
];

/**
 * Project sites published by their own repositories. Their paths are case-sensitive on GitHub Pages, so a
 * wrongly cased link (/levilamina/…) reaches this site's 404; it forwards to the correctly cased path.
 */
export const PROJECT_SITES = ['LeviLamina', 'LegacyScriptEngine', 'lip', 'LeviLauncher', 'LeviLaunchroid'];
