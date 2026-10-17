// Legacy URLs under docs.levimc.org that this root site forwards.
//
// GitHub Pages serves this repository for every path of docs.levimc.org that no project repository with
// Pages owns (project repos own /<Repo>/). scripts/build-site.mjs turns this table into
//   * a real redirect page for every old URL (site/<from>/…, meta refresh + location.replace + canonical), and
//   * the forwarding map that site/404.html runs before rendering (old URL variants, aliases, wrong case).
//
// All targets are canonical, redirect-free URLs (answer 200 directly); `node scripts/build-site.test.mjs --live`
// verifies them, and every mapped heading id, against the live site.

export const ORIGIN = 'https://docs.levimc.org';

/**
 * Documentation sites that moved. `pages` lists every page the old site published (VitePress `cleanUrls`:
 * `api/hook` was served from `api/hook.html`; `''` and `zh-CN/` are the locale home pages):
 *   [old page, new page, lang, title of the new page, hash]
 * `hash` says what happens to the old #anchor:
 *   false                    dropped (the new page is a different page);
 *   true                     forwarded unchanged;
 *   { newId: [oldId, …] }    forwarded, and the listed old ids are renamed to the new page's id. The old
 *                            pages were rewritten, so most old headings no longer exist: the map covers the
 *                            sections that have an equivalent on the new page; any other #anchor is forwarded
 *                            unchanged and lands at the top of the page.
 * `aliases` are extra old paths (never published, but obvious guesses): directories get a redirect page too
 * (GitHub Pages answers `/x` with a 301 to `/x/` for every directory), everything else only the 404 forwards.
 * `files` are published verbatim from legacy/<site>/ (files the old site served, e.g. images hot-linked from
 * elsewhere), so they keep answering 200 with the same bytes.
 * `fallbacks` send anything else under the old site to the matching locale's home (first matching prefix).
 */
export const MOVED_SITES = [
  {
    // LiteLDev/preloader-android docs/ at a29b5a6702 (VitePress, base /preloader-android/, cleanUrls,
    // locales: root = English, zh-CN/). The SDK docs now live in LeviLaunchroid's docs, rewritten for the C++
    // pl:: API (the old pages documented the C pl_* API); Pages on preloader-android is disabled, so these
    // paths reach this site.
    from: '/preloader-android/',
    to: '/LeviLaunchroid/',
    oldName: 'Preloader Android',
    newName: 'LeviLaunchroid',
    pages: [
      ['', '', 'en', 'LeviLaunchroid docs', true],
      ['guide/getting-started', 'guide/developer', 'en', 'Native Mod Quick Start', false],
      ['guide/build', 'guide/developer', 'en', 'Native Mod Quick Start', false],
      ['guide/compatibility', 'guide/developer', 'en', 'Native Mod Quick Start', false],
      ['api/mod', 'api/mod', 'en', 'Mod API', {
        'mod-api': ['mod-entry-api'],
        header: ['headers'],
        registration: ['signatures', 'example'],
        lifecycle: ['return-value'],
        nativemod: ['fields', 'parameters'],
      }],
      ['api/input', 'api/input', 'en', 'Input API', {
        header: ['headers'],
        functions: ['signatures', 'getpreloaderinput', 'registertouchcallback', 'registerkeyeventcallback', 'showkeyboard-hidekeyboard'],
      }],
      ['api/hook', 'api/hook', 'en', 'Hook API', {
        header: ['headers'],
        types: ['chain-behavior'],
        functions: ['signatures', 'pl-hook', 'pl-unhook'],
      }],
      ['api/signature', 'api/signature', 'en', 'Signature API', {
        header: ['headers'],
        functions: ['signatures', 'pl-resolve-signature'],
        example: ['c-example', 'c-batch-example'],
      }],
      ['api/patch', 'api/patch', 'en', 'Patch API', {
        functions: ['signatures', 'pl-patch-write-bytes-writebytes', 'pl-patch-read-bytes-readbytes', 'pl-patch-revert-revert', 'pl-patch-revert-all-revertall'],
        example: ['c-example', 'c-example-1'],
      }],
      ['api/memory-hook-macros', 'api/memory-hook-macros', 'en', 'Memory Hook Example', {
        'memory-hook-example': ['memory-hook-macros'],
        headers: ['header'],
        example: ['static-function-example'],
      }],
      ['api/types-and-macros', 'api/types-and-macros', 'en', 'SDK Headers and Macros', {
        'sdk-headers-and-macros': ['types-and-macros'],
        'public-headers': ['headers'],
        'pl-export': ['plapi'],
      }],
      ['zh-CN/', 'zh-CN/', 'zh-CN', 'LeviLaunchroid 文档', true],
      ['zh-CN/guide/getting-started', 'zh-CN/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/guide/build', 'zh-CN/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/guide/compatibility', 'zh-CN/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/api/mod', 'zh-CN/api/mod', 'zh-CN', 'Mod API', {
        'mod-api': ['mod-入口-api'],
        注册: ['类型签名', '最小示例'],
        生命周期: ['返回值'],
        nativemod: ['字段说明', '参数'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/input', 'zh-CN/api/input', 'zh-CN', 'Input API', {
        函数: ['类型签名', 'getpreloaderinput', 'registertouchcallback', 'registerkeyeventcallback', 'showkeyboard-hidekeyboard'],
        示例: ['示例-1'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/hook', 'zh-CN/api/hook', 'zh-CN', 'Hook API', {
        类型: ['链式-hook-行为'],
        函数: ['类型签名', 'pl-hook', 'pl-unhook'],
      }],
      ['zh-CN/api/signature', 'zh-CN/api/signature', 'zh-CN', 'Signature API', {
        函数: ['类型签名', 'pl-resolve-signature'],
        示例: ['c-示例', 'c-批量示例'],
      }],
      ['zh-CN/api/patch', 'zh-CN/api/patch', 'zh-CN', 'Patch API', {
        函数: ['类型签名', 'pl-patch-write-bytes-writebytes', 'pl-patch-read-bytes-readbytes', 'pl-patch-revert-revert', 'pl-patch-revert-all-revertall'],
        示例: ['c-示例', 'c-示例-1'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/memory-hook-macros', 'zh-CN/api/memory-hook-macros', 'zh-CN', 'Memory Hook 示例', {
        'memory-hook-示例': ['memory-hook-宏'],
        示例: ['静态函数示例', '自动注册示例', '直接地址示例'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/types-and-macros', 'zh-CN/api/types-and-macros', 'zh-CN', 'SDK 头文件与宏', {
        'sdk-头文件与宏': ['types-与宏'],
        公开头文件: ['头文件'],
        'pl-export': ['宏', 'plapi'],
      }],
    ],
    aliases: [
      ['api/', 'api/mod'],
      ['guide/', 'guide/developer'],
      ['zh-CN/api/', 'zh-CN/api/mod'],
      ['zh-CN/guide/', 'zh-CN/guide/developer'],
    ],
    // docs/public/appicon.png at a29b5a6702 (the old favicon and logo; byte-identical to LeviLaunchroid's).
    files: ['appicon.png'],
    fallbacks: [
      ['zh-CN/', 'zh-CN/'],
      ['', ''],
    ],
  },
  {
    // LiteXLoader's docsify site (formerly liteldev.github.io/LiteXLoader/, which GitHub now 301s here; still
    // linked from READMEs). LiteXLoader became LLSE, now LegacyScriptEngine. The repository is gone, and its
    // pages were docsify `#/…` routes on one index.html, so every old URL goes to the LegacyScriptEngine docs
    // home (which picks the reader's language) and the hash is dropped.
    from: '/LiteXLoader/',
    to: '/LegacyScriptEngine/',
    oldName: 'LiteXLoader',
    newName: 'LegacyScriptEngine',
    pages: [['', '', 'en', 'LegacyScriptEngine docs', false]],
    fallbacks: [['', '']],
  },
];

/**
 * Project sites published by their own repositories. Their paths are case-sensitive on GitHub Pages, so a
 * wrongly cased link (/levilamina/…) reaches this site's 404; it forwards to the correctly cased path.
 */
export const PROJECT_SITES = ['LeviLamina', 'LegacyScriptEngine', 'lip', 'LeviLauncher', 'LeviLaunchroid'];
