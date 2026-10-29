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
    // LiteLDev/LeviLaunchroid docs/ (levimc-kit, base /LeviLaunchroid/, cleanUrls; locales: root = English,
    // zh-CN/, zh-Hant/ converted from zh-CN). LeviLauncher is one name for the Windows and the Android launcher now:
    // the pages moved unchanged into the Android section of LeviLauncher's docs (android/, zh-CN/android/; zh-Hant
    // became LeviLauncher's zh-HK, converted the same way). Pages on LeviLaunchroid is disabled, so these paths
    // reach this site. Getting Started's install heading was renamed with the product.
    from: '/LeviLaunchroid/',
    to: '/LeviLauncher/',
    oldName: 'LeviLauncher for Android',
    newName: 'LeviLauncher',
    pages: [
      ['', 'android/', 'en', 'Android Version', true],
      ['guide/getting-started', 'android/guide/getting-started', 'en', 'Getting Started', { 'install-levilauncher-on-android': ['install-levilauncher-for-android'] }],
      ['guide/features', 'android/guide/features', 'en', 'Features', true],
      ['guide/compatibility', 'android/guide/compatibility', 'en', 'Compatibility and FAQ', true],
      ['guide/developer', 'android/guide/developer', 'en', 'Native Mod Quick Start', true],
      ['guide/build', 'android/guide/build', 'en', 'Build from Source', true],
      ['api/mod', 'android/api/mod', 'en', 'Mod API', true],
      ['api/mod-menu', 'android/api/mod-menu', 'en', 'Mod Menu API', true],
      ['api/config', 'android/api/config', 'en', 'Config API', true],
      ['api/input', 'android/api/input', 'en', 'Input API', true],
      ['api/hook', 'android/api/hook', 'en', 'Hook API', true],
      ['api/signature', 'android/api/signature', 'en', 'Signature API', true],
      ['api/patch', 'android/api/patch', 'en', 'Patch API', true],
      ['api/memory-hook-macros', 'android/api/memory-hook-macros', 'en', 'Memory Hook Example', true],
      ['api/types-and-macros', 'android/api/types-and-macros', 'en', 'SDK Headers and Macros', true],
      ['privacy-policy', 'android/privacy-policy', 'en', 'Privacy Policy', true],
      ['zh-CN/', 'zh-CN/android/', 'zh-CN', 'Android 版 LeviLauncher', true],
      ['zh-CN/guide/getting-started', 'zh-CN/android/guide/getting-started', 'zh-CN', '快速开始', { '安装-android-版-levilauncher': ['安装-levilauncher-for-android'] }],
      ['zh-CN/guide/features', 'zh-CN/android/guide/features', 'zh-CN', '功能概览', true],
      ['zh-CN/guide/compatibility', 'zh-CN/android/guide/compatibility', 'zh-CN', '兼容性与常见问题', true],
      ['zh-CN/guide/developer', 'zh-CN/android/guide/developer', 'zh-CN', '原生模组快速开始', true],
      ['zh-CN/guide/build', 'zh-CN/android/guide/build', 'zh-CN', '从源码构建', true],
      ['zh-CN/api/mod', 'zh-CN/android/api/mod', 'zh-CN', 'Mod API', true],
      ['zh-CN/api/mod-menu', 'zh-CN/android/api/mod-menu', 'zh-CN', 'Mod Menu API', true],
      ['zh-CN/api/config', 'zh-CN/android/api/config', 'zh-CN', 'Config API', true],
      ['zh-CN/api/input', 'zh-CN/android/api/input', 'zh-CN', 'Input API', true],
      ['zh-CN/api/hook', 'zh-CN/android/api/hook', 'zh-CN', 'Hook API', true],
      ['zh-CN/api/signature', 'zh-CN/android/api/signature', 'zh-CN', 'Signature API', true],
      ['zh-CN/api/patch', 'zh-CN/android/api/patch', 'zh-CN', 'Patch API', true],
      ['zh-CN/api/memory-hook-macros', 'zh-CN/android/api/memory-hook-macros', 'zh-CN', 'Memory Hook 示例', true],
      ['zh-CN/api/types-and-macros', 'zh-CN/android/api/types-and-macros', 'zh-CN', 'SDK 头文件与宏', true],
      ['zh-Hant/', 'zh-HK/android/', 'zh-HK', 'Android 版 LeviLauncher', true],
      ['zh-Hant/guide/getting-started', 'zh-HK/android/guide/getting-started', 'zh-HK', '快速開始', { '安裝-android-版-levilauncher': ['安裝-levilauncher-for-android'] }],
      ['zh-Hant/guide/features', 'zh-HK/android/guide/features', 'zh-HK', '功能概覽', true],
      ['zh-Hant/guide/compatibility', 'zh-HK/android/guide/compatibility', 'zh-HK', '兼容性與常見問題', true],
      ['zh-Hant/guide/developer', 'zh-HK/android/guide/developer', 'zh-HK', '原生模組快速開始', true],
      ['zh-Hant/guide/build', 'zh-HK/android/guide/build', 'zh-HK', '從源碼構建', true],
      ['zh-Hant/api/mod', 'zh-HK/android/api/mod', 'zh-HK', 'Mod API', true],
      ['zh-Hant/api/mod-menu', 'zh-HK/android/api/mod-menu', 'zh-HK', 'Mod Menu API', true],
      ['zh-Hant/api/config', 'zh-HK/android/api/config', 'zh-HK', 'Config API', true],
      ['zh-Hant/api/input', 'zh-HK/android/api/input', 'zh-HK', 'Input API', true],
      ['zh-Hant/api/hook', 'zh-HK/android/api/hook', 'zh-HK', 'Hook API', true],
      ['zh-Hant/api/signature', 'zh-HK/android/api/signature', 'zh-HK', 'Signature API', true],
      ['zh-Hant/api/patch', 'zh-HK/android/api/patch', 'zh-HK', 'Patch API', true],
      ['zh-Hant/api/memory-hook-macros', 'zh-HK/android/api/memory-hook-macros', 'zh-HK', 'Memory Hook 示例', true],
      ['zh-Hant/api/types-and-macros', 'zh-HK/android/api/types-and-macros', 'zh-HK', 'SDK 頭文件與宏', true],
    ],
    aliases: [
      ['api/', 'android/api/mod'],
      ['guide/', 'android/guide/getting-started'],
      ['zh-CN/api/', 'zh-CN/android/api/mod'],
      ['zh-CN/guide/', 'zh-CN/android/guide/getting-started'],
      ['zh-Hant/api/', 'zh-HK/android/api/mod'],
      ['zh-Hant/guide/', 'zh-HK/android/guide/getting-started'],
    ],
    // docs/public/appicon.png of LiteLDev/LeviLaunchroid (its favicon and logo; LeviLauncher's differs).
    files: ['appicon.png'],
    fallbacks: [
      ['zh-CN/', 'zh-CN/android/'],
      ['zh-Hant/', 'zh-HK/android/'],
      ['', 'android/'],
    ],
  },
  {
    // LiteLDev/preloader-android docs/ at a29b5a6702 (VitePress, base /preloader-android/, cleanUrls,
    // locales: root = English, zh-CN/). The SDK docs now live in the Android section of LeviLauncher's docs
    // (formerly LeviLaunchroid's docs, see below), rewritten for the C++ pl:: API (the old pages documented the C
    // pl_* API); Pages on preloader-android is disabled, so these paths reach this site.
    from: '/preloader-android/',
    to: '/LeviLauncher/',
    oldName: 'Preloader Android',
    newName: 'LeviLauncher',
    pages: [
      ['', 'android/', 'en', 'Android Version', true],
      ['guide/getting-started', 'android/guide/developer', 'en', 'Native Mod Quick Start', false],
      ['guide/build', 'android/guide/developer', 'en', 'Native Mod Quick Start', false],
      ['guide/compatibility', 'android/guide/developer', 'en', 'Native Mod Quick Start', false],
      ['api/mod', 'android/api/mod', 'en', 'Mod API', {
        'mod-api': ['mod-entry-api'],
        header: ['headers'],
        registration: ['signatures', 'example'],
        lifecycle: ['return-value'],
        nativemod: ['fields', 'parameters'],
      }],
      ['api/input', 'android/api/input', 'en', 'Input API', {
        header: ['headers'],
        functions: ['signatures', 'getpreloaderinput', 'registertouchcallback', 'registerkeyeventcallback', 'showkeyboard-hidekeyboard'],
      }],
      ['api/hook', 'android/api/hook', 'en', 'Hook API', {
        header: ['headers'],
        types: ['chain-behavior'],
        functions: ['signatures', 'pl-hook', 'pl-unhook'],
      }],
      ['api/signature', 'android/api/signature', 'en', 'Signature API', {
        header: ['headers'],
        functions: ['signatures', 'pl-resolve-signature'],
        example: ['c-example', 'c-batch-example'],
      }],
      ['api/patch', 'android/api/patch', 'en', 'Patch API', {
        functions: ['signatures', 'pl-patch-write-bytes-writebytes', 'pl-patch-read-bytes-readbytes', 'pl-patch-revert-revert', 'pl-patch-revert-all-revertall'],
        example: ['c-example', 'c-example-1'],
      }],
      ['api/memory-hook-macros', 'android/api/memory-hook-macros', 'en', 'Memory Hook Example', {
        'memory-hook-example': ['memory-hook-macros'],
        headers: ['header'],
        example: ['static-function-example'],
      }],
      ['api/types-and-macros', 'android/api/types-and-macros', 'en', 'SDK Headers and Macros', {
        'sdk-headers-and-macros': ['types-and-macros'],
        'public-headers': ['headers'],
        'pl-export': ['plapi'],
      }],
      ['zh-CN/', 'zh-CN/android/', 'zh-CN', 'Android 版 LeviLauncher', true],
      ['zh-CN/guide/getting-started', 'zh-CN/android/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/guide/build', 'zh-CN/android/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/guide/compatibility', 'zh-CN/android/guide/developer', 'zh-CN', 'Native Mod 快速开始', false],
      ['zh-CN/api/mod', 'zh-CN/android/api/mod', 'zh-CN', 'Mod API', {
        'mod-api': ['mod-入口-api'],
        注册: ['类型签名', '最小示例'],
        生命周期: ['返回值'],
        nativemod: ['字段说明', '参数'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/input', 'zh-CN/android/api/input', 'zh-CN', 'Input API', {
        函数: ['类型签名', 'getpreloaderinput', 'registertouchcallback', 'registerkeyeventcallback', 'showkeyboard-hidekeyboard'],
        示例: ['示例-1'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/hook', 'zh-CN/android/api/hook', 'zh-CN', 'Hook API', {
        类型: ['链式-hook-行为'],
        函数: ['类型签名', 'pl-hook', 'pl-unhook'],
      }],
      ['zh-CN/api/signature', 'zh-CN/android/api/signature', 'zh-CN', 'Signature API', {
        函数: ['类型签名', 'pl-resolve-signature'],
        示例: ['c-示例', 'c-批量示例'],
      }],
      ['zh-CN/api/patch', 'zh-CN/android/api/patch', 'zh-CN', 'Patch API', {
        函数: ['类型签名', 'pl-patch-write-bytes-writebytes', 'pl-patch-read-bytes-readbytes', 'pl-patch-revert-revert', 'pl-patch-revert-all-revertall'],
        示例: ['c-示例', 'c-示例-1'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/memory-hook-macros', 'zh-CN/android/api/memory-hook-macros', 'zh-CN', 'Memory Hook 示例', {
        'memory-hook-示例': ['memory-hook-宏'],
        示例: ['静态函数示例', '自动注册示例', '直接地址示例'],
        注意: ['注意事项'],
      }],
      ['zh-CN/api/types-and-macros', 'zh-CN/android/api/types-and-macros', 'zh-CN', 'SDK 头文件与宏', {
        'sdk-头文件与宏': ['types-与宏'],
        公开头文件: ['头文件'],
        'pl-export': ['宏', 'plapi'],
      }],
    ],
    aliases: [
      ['api/', 'android/api/mod'],
      ['guide/', 'android/guide/developer'],
      ['zh-CN/api/', 'zh-CN/android/api/mod'],
      ['zh-CN/guide/', 'zh-CN/android/guide/developer'],
    ],
    // docs/public/appicon.png at a29b5a6702 (the old favicon and logo; byte-identical to LeviLaunchroid's).
    files: ['appicon.png'],
    fallbacks: [
      ['zh-CN/', 'zh-CN/android/'],
      ['', 'android/'],
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
export const PROJECT_SITES = ['LeviLamina', 'LegacyScriptEngine', 'lip', 'LeviLauncher'];
