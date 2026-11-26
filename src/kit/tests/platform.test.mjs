// Content per platform (docs/shared/platform.ts): platform tabs, hero actions and badges.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectPlatform,
  detectPlatformChoice,
  detectPlatformChoiceAsync,
  matchPlatform,
  choiceOfOption,
  platformChoiceOfLabel,
  platformOptionOfLabel,
  platformsOfOption,
  platformName,
  platformOfLabel,
  preferredPlatform,
  preferredPlatformChoice,
  preferredPlatformChoiceAsync,
  refineChoice,
  choosePlatform,
  currentPlatformChoice,
  devicePlatformChoice,
  onPlatformChoice,
  platformPicked,
  resetPlatformPick,
  PLATFORM_STORAGE_KEY,
} from '../docs/shared/platform.ts';
import { renderMarkdown } from '../docs/node/markdown/render.ts';
import { preprocess } from '../docs/node/markdown/preprocess.ts';

test('platformOfLabel: one platform named in the label', () => {
  assert.equal(platformOfLabel('Windows'), 'windows');
  assert.equal(platformOfLabel('Android 版'), 'android');
  assert.equal(platformOfLabel('iPadOS'), 'ios');
  assert.equal(platformOfLabel('macOS'), 'macos');
  assert.equal(platformOfLabel('Linux (x64)'), 'linux');
  assert.equal(platformOfLabel('C++'), undefined);
  assert.equal(platformOfLabel('Windows / Android'), undefined); // two platforms: neither
  assert.equal(platformOfLabel('Windowsill'), undefined);
});

const UA = {
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  linux: 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
};

/**
 * Run `fn` with a fake navigator (and localStorage holding `stored`, when given).
 * @template T
 * @param {{ userAgent?: string, maxTouchPoints?: number, stored?: string, userAgentData?: object }} options
 * @param {() => T} fn
 */
function withBrowser({ userAgent = '', maxTouchPoints = 0, stored, userAgentData } = {}, fn) {
  /** @type {[string, PropertyDescriptor | undefined][]} */
  const saved = ['navigator', 'localStorage'].map((k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)]);
  const store = new Map(stored ? [[PLATFORM_STORAGE_KEY, stored]] : []);
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent, maxTouchPoints, userAgentData }, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }, configurable: true });
  try {
    return fn();
  } finally {
    for (const [k, d] of saved) {
      if (d) Object.defineProperty(globalThis, k, d);
      else delete globalThis[k];
    }
  }
}

test('detectPlatform: user agents', () => {
  const at = (userAgent, maxTouchPoints = 0) => withBrowser({ userAgent, maxTouchPoints }, detectPlatform);
  assert.equal(at(UA.windows), 'windows');
  assert.equal(at(UA.android), 'android');
  assert.equal(at(UA.iphone), 'ios');
  assert.equal(at(UA.mac), 'macos');
  assert.equal(at(UA.mac, 5), 'ios'); // iPadOS 13+ asks for the desktop site
  assert.equal(at(UA.linux), 'linux');
  assert.equal(at(''), undefined);
});

test('preferredPlatform: ?platform= > earlier choice > device', () => {
  assert.equal(withBrowser({ userAgent: UA.windows }, () => preferredPlatform('')), 'windows');
  assert.equal(withBrowser({ userAgent: UA.windows, stored: 'android' }, () => preferredPlatform('')), 'android');
  assert.equal(withBrowser({ userAgent: UA.windows, stored: 'android' }, () => preferredPlatform('?platform=Linux')), 'linux');
  assert.equal(withBrowser({ userAgent: UA.windows, stored: 'nope' }, () => preferredPlatform('?platform=nope')), 'windows');
});

/** @type {import('../docs/node/markdown/render.ts').RenderOptions} */
const OPTS = {
  compat: 'commonmark',
  slug: 'vitepress',
  lineNumbers: false,
  codeTitle: 'none',
  languageAlias: {},
  admonitionTitles: 'vitepress',
  containers: { vitepress: true, mkdocs: true },
  outline: [2, 3],
  styles: /** @type {import('../docs/node/markdown/shiki.ts').TokenStyles} */ ({}), // no code block is rendered
  strings: { copyCode: 'Copy', copied: 'Copied', footnotes: 'Footnotes', backToRef: 'Back' },
  resolveLink: () => null,
};

test('render: platform tabs, <Badge> and frontmatter platforms', async () => {
  const src = [
    '---',
    'platforms: [android]',
    '---',
    '# Accounts',
    '',
    '## Quick Launch <Badge platform="android" />',
    '',
    '## Beta <Badge type="warning" text="beta" />',
    '',
    '=== "Windows"',
    '',
    '    a',
    '',
    '=== "Android"',
    '',
    '    b',
  ].join('\n');
  const r = await renderMarkdown(src, OPTS);
  assert.match(r.html, /<h1 id="accounts">Accounts.*<\/h1><p class="kit-page-platforms"><span class="kit-badge kit-badge-grass" data-kit-badge="" data-platform="android">Android<\/span><\/p>/s);
  // badges are not part of heading ids or the TOC
  assert.deepEqual(r.toc.map((x) => x.id), ['quick-launch', 'beta']);
  assert.match(r.html, /<span class="kit-badge kit-badge-gold" data-kit-badge="">beta<\/span>/);
  assert.match(r.html, /role="tab"[^>]*data-platform="windows"/);
  assert.match(r.html, /role="tab"[^>]*data-platform="android"/);
});

// ---- targets: operating system + architecture (win-x64, win-arm64, osx-arm64, osx-x64, linux-x64)

test('platformChoiceOfLabel: a system, or a system and an architecture', () => {
  assert.equal(platformChoiceOfLabel('Windows'), 'windows');
  assert.equal(platformChoiceOfLabel('Windows x64'), 'win-x64');
  assert.equal(platformChoiceOfLabel('Windows arm64'), 'win-arm64');
  assert.equal(platformChoiceOfLabel('macOS (Apple silicon)'), 'osx-arm64');
  assert.equal(platformChoiceOfLabel('macOS（Apple 芯片）'), 'osx-arm64');
  assert.equal(platformChoiceOfLabel('macOS（Apple 晶片）'), 'osx-arm64');
  assert.equal(platformChoiceOfLabel('macOS (Intel)'), 'osx-x64');
  assert.equal(platformChoiceOfLabel('Linux x64'), 'linux-x64');
  assert.equal(platformChoiceOfLabel('Linux (x64)'), 'linux-x64');
  assert.equal(platformChoiceOfLabel('Linux arm64'), 'linux'); // not a target: the system only
  assert.equal(platformChoiceOfLabel('Windows x64 / arm64'), 'windows'); // both architectures
  assert.equal(platformChoiceOfLabel('Android'), 'android');
  assert.equal(platformChoiceOfLabel('Linux and macOS'), undefined);
});

test('platformName: targets in the page language', () => {
  assert.equal(platformName('osx-arm64'), 'macOS (Apple silicon)');
  assert.equal(platformName('osx-arm64', 'zh-Hans'), 'macOS（Apple 芯片）');
  assert.equal(platformName('osx-arm64', 'zh-Hant'), 'macOS（Apple 晶片）');
  assert.equal(platformName('osx-arm64', 'zh-TW'), 'macOS（Apple 晶片）');
  assert.equal(platformName('win-arm64', 'ja'), 'Windows arm64');
  assert.equal(platformName('linux'), 'Linux');
});

test('matchPlatform: the same target, else its system, else the first target of a system', () => {
  const targets = ['win-x64', 'win-arm64', 'osx-arm64', 'osx-x64', 'linux-x64'];
  assert.equal(matchPlatform(targets, 'osx-x64'), 3);
  assert.equal(matchPlatform(targets, 'macos'), 2); // an old stored "macos": its first target
  assert.equal(matchPlatform(targets, 'android'), -1);
  const systems = ['windows', 'macos', 'linux'];
  assert.equal(matchPlatform(systems, 'win-arm64'), 0); // a system tab matches every architecture
  assert.equal(matchPlatform(systems, 'osx-x64'), 1);
  assert.equal(matchPlatform(['osx-arm64', 'linux'], 'osx-x64'), -1); // the other Mac's tab is not this Mac's
  assert.equal(matchPlatform([undefined, 'linux'], 'linux-x64'), 1);
});

test('refineChoice: a system tab keeps the chosen architecture of that system', () => {
  assert.equal(refineChoice('windows', 'win-arm64'), 'win-arm64');
  assert.equal(refineChoice('macos', 'win-arm64'), 'macos');
  assert.equal(refineChoice('osx-x64', 'osx-arm64'), 'osx-x64');
  assert.equal(refineChoice('linux', undefined), 'linux');
});

test('detectPlatformChoice: Macs are Apple silicon, others x64 unless the user agent names Arm', () => {
  const at = (userAgent, maxTouchPoints = 0) => withBrowser({ userAgent, maxTouchPoints }, detectPlatformChoice);
  assert.equal(at(UA.windows), 'win-x64');
  assert.equal(at(UA.mac), 'osx-arm64');
  assert.equal(at(UA.linux), 'linux-x64');
  assert.equal(at('Mozilla/5.0 (X11; Linux aarch64; rv:140.0) Gecko/20100101 Firefox/140.0'), 'linux'); // no Linux arm64 target
  assert.equal(at(UA.android), 'android');
  assert.equal(at(''), undefined);
});

/** withBrowser for an async `fn` (the fake navigator stays until it settles). */
async function withBrowserAsync(opts, fn) {
  /** @type {[string, PropertyDescriptor | undefined][]} */
  const saved = ['navigator', 'localStorage'].map((k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)]);
  const store = new Map(opts.stored ? [[PLATFORM_STORAGE_KEY, opts.stored]] : []);
  Object.defineProperty(globalThis, 'navigator', { value: { userAgent: opts.userAgent ?? '', maxTouchPoints: 0, userAgentData: opts.userAgentData }, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) }, configurable: true });
  try {
    return await fn();
  } finally {
    for (const [k, d] of saved) {
      if (d) Object.defineProperty(globalThis, k, d);
      else delete globalThis[k];
    }
  }
}

const hints = (platform, architecture, bitness = '64') => ({ platform, getHighEntropyValues: async () => ({ architecture, bitness }) });

test('detectPlatformChoiceAsync: the architecture the browser reports', async () => {
  const at = (userAgent, userAgentData) => withBrowserAsync({ userAgent, userAgentData }, detectPlatformChoiceAsync);
  assert.equal(await at(UA.windows, hints('Windows', 'arm')), 'win-arm64');
  assert.equal(await at(UA.windows, hints('Windows', 'x86')), 'win-x64');
  assert.equal(await at(UA.windows, hints('Windows', 'x86', '32')), 'windows');
  assert.equal(await at(UA.mac, hints('macOS', 'x86')), 'osx-x64');
  assert.equal(await at(UA.mac, hints('macOS', 'arm')), 'osx-arm64');
  assert.equal(await at(UA.mac, undefined), 'osx-arm64'); // Safari, Firefox: the guess
  assert.equal(await at(UA.linux, hints('Linux', 'arm')), 'linux');
  const failing = { platform: 'Windows', getHighEntropyValues: async () => Promise.reject(new Error('denied')) };
  assert.equal(await at(UA.windows, failing), 'win-x64');
});

test('preferredPlatformChoice: ?platform= > earlier choice (old system-only values too) > device', async () => {
  assert.equal(withBrowser({ userAgent: UA.mac }, () => preferredPlatformChoice('')), 'osx-arm64');
  assert.equal(withBrowser({ userAgent: UA.mac, stored: 'osx-x64' }, () => preferredPlatformChoice('')), 'osx-x64');
  assert.equal(withBrowser({ userAgent: UA.mac, stored: 'windows' }, () => preferredPlatformChoice('')), 'windows');
  assert.equal(withBrowser({ userAgent: UA.mac, stored: 'osx-x64' }, () => preferredPlatformChoice('?platform=linux-x64')), 'linux-x64');
  assert.equal(withBrowser({ userAgent: UA.mac, stored: 'osx-x64' }, () => preferredPlatformChoice('?platform=OSX-ARM64')), 'osx-arm64');
  assert.equal(withBrowser({ userAgent: UA.mac, stored: 'nope' }, () => preferredPlatformChoice('?platform=linux-arm64')), 'osx-arm64');
  // the operating system of a stored target
  assert.equal(withBrowser({ userAgent: UA.windows, stored: 'osx-x64' }, () => preferredPlatform('')), 'macos');
  assert.equal(withBrowser({ userAgent: UA.windows }, () => preferredPlatform('?platform=win-arm64')), 'windows');
  // asynchronously: the stored choice still wins over what the browser reports
  assert.equal(await withBrowserAsync({ userAgent: UA.windows, userAgentData: hints('Windows', 'arm') }, () => preferredPlatformChoiceAsync('')), 'win-arm64');
  assert.equal(await withBrowserAsync({ userAgent: UA.windows, userAgentData: hints('Windows', 'arm'), stored: 'win-x64' }, () => preferredPlatformChoiceAsync('')), 'win-x64');
});

test('render: ::: tabs with == labels, named after targets', async () => {
  const src = [
    '::: tabs',
    '== Windows x64',
    '',
    'Run the installer.',
    '',
    '== macOS (Apple silicon)',
    '',
    '1. one',
    '2. two',
    '',
    '::: details Nested',
    '== not a tab (in a nested container)',
    ':::',
    '',
    '==+ Linux x64',
    '',
    'curl',
    ':::',
  ].join('\n');
  const r = await renderMarkdown(src, { ...OPTS, containers: { vitepress: true } });
  const tabs = [...r.html.matchAll(/<button[^>]*role="tab"[^>]*>/g)].map((m) => m[0]);
  assert.equal(tabs.length, 3);
  assert.match(tabs[0], /data-platform="win-x64"/);
  assert.match(tabs[1], /data-platform="osx-arm64"/);
  assert.match(tabs[2], /data-platform="linux-x64"/);
  assert.match(tabs[2], /aria-selected="true"/); // ==+ starts selected
  assert.match(r.html, /<details[^>]*>.*== not a tab \(in a nested container\)/s);
  assert.match(r.html, /<ol>\s*<li>one<\/li>/);
});

test('preprocess: a == line in a fence of a ::: tabs container is code', () => {
  const out = preprocess(['::: tabs', '== Windows', '', '```shell', '== not a tab', '```', '', '== Linux', '', 'b', ':::'].join('\n'), { compat: 'commonmark' });
  assert.equal(out.match(/data-kit-container="tab"/g)?.length, 2);
  assert.match(out, /```shell\n== not a tab\n```/);
});

test('detectPlatformChoiceAsync: no bitness is not 32-bit', async () => {
  const at = (userAgentData) => withBrowserAsync({ userAgent: UA.windows, userAgentData }, detectPlatformChoiceAsync);
  assert.equal(await at(hints('Windows', 'arm', '')), 'win-arm64');
  assert.equal(await at(hints('Windows', 'x86', '')), 'win-x64');
  assert.equal(await at(hints('Windows', '', '')), 'win-x64');
});

test('the page choice: choosePlatform refines, remembers and tells subscribers; the device is asked once', async () => {
  let asked = 0;
  const userAgentData = { platform: 'Windows', getHighEntropyValues: async () => (asked++, { architecture: 'arm', bitness: '64' }) };
  await withBrowserAsync({ userAgent: UA.windows, userAgentData }, async () => {
    const seen = [];
    const off = onPlatformChoice((p) => seen.push(p));
    assert.equal(currentPlatformChoice(''), 'win-x64'); // the guess until the browser answers
    assert.equal(await devicePlatformChoice(), 'win-arm64');
    await devicePlatformChoice();
    assert.equal(asked, 1);
    assert.equal(currentPlatformChoice(''), 'win-arm64');
    assert.equal(platformPicked(), false);
    assert.equal(choosePlatform('windows'), 'win-arm64'); // a Windows tab keeps the reported arm64
    assert.equal(localStorage.getItem(PLATFORM_STORAGE_KEY), 'win-arm64');
    assert.equal(choosePlatform('linux-x64'), 'linux-x64');
    assert.equal(currentPlatformChoice('?platform=osx-x64'), 'linux-x64'); // a pick on this page wins over the URL
    resetPlatformPick();
    assert.equal(currentPlatformChoice('?platform=osx-x64'), 'osx-x64'); // a new page: the URL again
    assert.equal(currentPlatformChoice(''), 'linux-x64'); // then the remembered choice
    off();
    choosePlatform('osx-arm64');
    assert.deepEqual(seen, ['win-arm64', 'linux-x64']);
    resetPlatformPick();
  });
});

test('platformOptionOfLabel: a label of several systems names them all', () => {
  assert.equal(platformOptionOfLabel('macOS / Linux'), 'macos linux');
  assert.equal(platformOptionOfLabel('Linux and macOS'), 'linux macos');
  assert.equal(platformOptionOfLabel('Windows arm64'), 'win-arm64');
  assert.equal(platformOptionOfLabel('C++'), undefined);
  assert.deepEqual(platformsOfOption('macos linux'), ['macos', 'linux']);
  assert.deepEqual(platformsOfOption('win-x64'), ['win-x64']);
  assert.deepEqual(platformsOfOption('nope'), []);
});

test('matchPlatform: an option of several systems matches each of them and their targets', () => {
  const opts = ['windows', 'macos linux'];
  assert.equal(matchPlatform(opts, 'windows'), 0);
  assert.equal(matchPlatform(opts, 'win-arm64'), 0);
  assert.equal(matchPlatform(opts, 'macos'), 1);
  assert.equal(matchPlatform(opts, 'osx-x64'), 1);
  assert.equal(matchPlatform(opts, 'linux-x64'), 1);
  assert.equal(matchPlatform(opts, 'android'), -1);
});

test('choiceOfOption: picking several systems keeps the visitor\'s own one of them', () => {
  assert.equal(choiceOfOption('macos linux', 'linux-x64'), 'linux');
  assert.equal(choiceOfOption('macos linux', 'osx-arm64'), 'macos');
  assert.equal(choiceOfOption('macos linux', 'windows'), 'macos');
  assert.equal(choiceOfOption('macos linux', undefined), 'macos');
  assert.equal(choiceOfOption('win-arm64', 'linux'), 'win-arm64');
  assert.equal(choiceOfOption('bogus', 'linux'), undefined);
});

test('render: a tab of several systems carries them all in data-platform', async () => {
  const src = ['::: tabs', '', '== Windows', '', 'msi', '', '== macOS / Linux', '', 'curl', ':::'].join('\n');
  const r = await renderMarkdown(src, { ...OPTS, containers: { vitepress: true } });
  const tabs = [...r.html.matchAll(/<button[^>]*role="tab"[^>]*>/g)].map((m) => m[0]);
  assert.equal(tabs.length, 2);
  assert.match(tabs[0], /data-platform="windows"/);
  assert.match(tabs[1], /data-platform="macos linux"/);
});
