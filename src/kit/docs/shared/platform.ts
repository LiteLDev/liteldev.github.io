// The visitor's device platform, for content that differs per platform (downloads, install steps, features that only
// one platform has). Tabs labelled with a platform name form one site-wide group, like Docusaurus' `groupId` tabs and
// Microsoft Learn's zone pivots: the visitor's choice is remembered and applies to every such tab set; `?platform=`
// in the URL wins (shareable links), else the remembered choice, else the device. Hero actions with a `platform`
// follow the same choice. The prerendered page always shows the author's default; the choice is made after hydration.
//
// A platform is an operating system (`windows`, `macos` …) or, where downloads differ per processor, an operating
// system and an architecture named like a .NET runtime identifier (`win-x64`, `osx-arm64` …: a "target"). A tab for
// an operating system matches every architecture of it; a tab for a target matches that target, and a visitor who
// chose only an operating system gets its first target on the page.

export const PLATFORMS = ['windows', 'android', 'ios', 'macos', 'linux'] as const;
export type DevicePlatform = (typeof PLATFORMS)[number];

/** Operating system + architecture, as the .NET runtime identifiers name them. */
export const PLATFORM_TARGETS = ['win-x64', 'win-arm64', 'osx-arm64', 'osx-x64', 'linux-x64'] as const;
export type PlatformTarget = (typeof PLATFORM_TARGETS)[number];
export type Architecture = 'x64' | 'arm64';

/** What a visitor can choose, what a tab can name: an operating system, or an operating system and an architecture. */
export type PlatformChoice = DevicePlatform | PlatformTarget;

const TARGET_PARTS: Record<PlatformTarget, [DevicePlatform, Architecture]> = {
  'win-x64': ['windows', 'x64'],
  'win-arm64': ['windows', 'arm64'],
  'osx-arm64': ['macos', 'arm64'],
  'osx-x64': ['macos', 'x64'],
  'linux-x64': ['linux', 'x64'],
};

/** Display names (the same in every language). */
export const PLATFORM_NAMES: Record<DevicePlatform, string> = {
  windows: 'Windows',
  android: 'Android',
  ios: 'iOS',
  macos: 'macOS',
  linux: 'Linux',
};

/** Display names of the targets, per language (`en`, `zh-Hans`, `zh-Hant`; other languages get English). */
const TARGET_NAMES: Record<string, Record<PlatformTarget, string>> = {
  en: {
    'win-x64': 'Windows x64',
    'win-arm64': 'Windows arm64',
    'osx-arm64': 'macOS (Apple silicon)',
    'osx-x64': 'macOS (Intel)',
    'linux-x64': 'Linux x64',
  },
  'zh-Hans': {
    'win-x64': 'Windows x64',
    'win-arm64': 'Windows arm64',
    'osx-arm64': 'macOS（Apple 芯片）',
    'osx-x64': 'macOS（Intel）',
    'linux-x64': 'Linux x64',
  },
  'zh-Hant': {
    'win-x64': 'Windows x64',
    'win-arm64': 'Windows arm64',
    'osx-arm64': 'macOS（Apple 晶片）',
    'osx-x64': 'macOS（Intel）',
    'linux-x64': 'Linux x64',
  },
};

/** The name of a platform or target in `lang` (a BCP 47 tag: `zh-Hans`, `zh-CN`, `zh-TW` … fall back sensibly). */
export function platformName(p: PlatformChoice, lang = 'en'): string {
  if (!isPlatformTarget(p)) return PLATFORM_NAMES[p];
  const l = lang.toLowerCase();
  const key = l.startsWith('zh') ? (/hant|tw|hk|mo/.test(l) ? 'zh-Hant' : 'zh-Hans') : 'en';
  return TARGET_NAMES[key]![p];
}

/** localStorage key of the visitor's chosen platform (shared by every docs site on the origin). */
export const PLATFORM_STORAGE_KEY = 'levimc_platform';
/** URL search parameter that selects a platform (`?platform=android`, `?platform=osx-arm64`). */
export const PLATFORM_QUERY = 'platform';

const LABEL_RE = /\b(windows|android|ios|ipados|macos|linux)\b/i;
// Architectures in a tab label: "Windows arm64", "macOS (Apple silicon)", "macOS（Apple 芯片）", "Linux x64" …
const ARM64_RE = /\b(?:arm64|aarch64)\b|apple\s*(?:silicon|芯片|晶片)/i;
const X64_RE = /\b(?:x64|x86[-_]64|amd64)\b|\bintel\b|英特尔|英特爾/i;

export function isPlatform(v: unknown): v is DevicePlatform {
  return typeof v === 'string' && (PLATFORMS as readonly string[]).includes(v);
}

export function isPlatformTarget(v: unknown): v is PlatformTarget {
  return typeof v === 'string' && (PLATFORM_TARGETS as readonly string[]).includes(v);
}

/** A platform or a target (`windows`, `osx-arm64`): what `?platform=`, the stored choice and tab ids may hold. */
export function isPlatformChoice(v: unknown): v is PlatformChoice {
  return isPlatform(v) || isPlatformTarget(v);
}

/** The operating system of a choice. */
export function osOf(p: PlatformChoice): DevicePlatform {
  return isPlatformTarget(p) ? TARGET_PARTS[p][0] : p;
}

/** The architecture of a choice, when it names one. */
export function archOf(p: PlatformChoice): Architecture | undefined {
  return isPlatformTarget(p) ? TARGET_PARTS[p][1] : undefined;
}

/** The target of an operating system and an architecture, when it is one of PLATFORM_TARGETS. */
export function targetOf(os: DevicePlatform, arch: Architecture | undefined): PlatformTarget | undefined {
  if (!arch) return undefined;
  return PLATFORM_TARGETS.find((t) => TARGET_PARTS[t][0] === os && TARGET_PARTS[t][1] === arch);
}

/** The platform a tab label names ("Windows", "Android 版", "iOS"…), if exactly one. */
export function platformOfLabel(label: string): DevicePlatform | undefined {
  const all = label.match(new RegExp(LABEL_RE.source, 'gi'));
  if (!all) return undefined;
  const found = new Set(all.map((m) => (m.toLowerCase() === 'ipados' ? 'ios' : (m.toLowerCase() as DevicePlatform))));
  return found.size === 1 ? [...found][0] : undefined;
}

/**
 * The platform or target a tab label names: "Windows" → windows, "Windows arm64" → win-arm64, "macOS (Apple silicon)"
 * → osx-arm64, "macOS (Intel)" → osx-x64, "Linux x64" → linux-x64. A label that names an architecture that is not a
 * target of its system ("Linux arm64"), or both architectures, names only the system.
 */
export function platformChoiceOfLabel(label: string): PlatformChoice | undefined {
  const os = platformOfLabel(label);
  if (!os) return undefined;
  const arm = ARM64_RE.test(label);
  const x64 = X64_RE.test(label);
  return (arm !== x64 ? targetOf(os, arm ? 'arm64' : 'x64') : undefined) ?? os;
}

/**
 * What a tab label or button names, as the `data-platform` of a tab: one platform or target
 * (platformChoiceOfLabel), or — when it names several systems ("macOS / Linux", for content that is the same on
 * both) — those systems, space-separated ("macos linux"). Undefined when it names none.
 */
export function platformOptionOfLabel(label: string): string | undefined {
  const one = platformChoiceOfLabel(label);
  if (one) return one;
  const all = label.match(new RegExp(LABEL_RE.source, 'gi'));
  if (!all) return undefined;
  const found = [...new Set(all.map((m) => (m.toLowerCase() === 'ipados' ? 'ios' : (m.toLowerCase() as DevicePlatform))))];
  return found.length > 1 ? found.join(' ') : undefined;
}

/** The platforms and targets an option names: `windows` → [windows], `macos linux` → [macos, linux]. */
export function platformsOfOption(option: string | undefined): PlatformChoice[] {
  return (option ?? '').split(/\s+/).filter(isPlatformChoice);
}

/**
 * The choice to remember when the visitor picks `option`, a platform, a target or several systems: for several, the
 * current choice when the option names its system (picking "macOS / Linux" on Linux keeps Linux), else the first.
 */
export function choiceOfOption(option: string, current: PlatformChoice | undefined): PlatformChoice | undefined {
  const all = platformsOfOption(option);
  if (all.length <= 1) return all[0];
  return (current && all.find((p) => p === current || p === osOf(current))) ?? all[0];
}

/**
 * The option (tab) to show for `choice` among `options` (each a platform, a target or several systems, space-separated
 * as platformOptionOfLabel gives them; others never match): the same one, else the tab of its operating system, else — when the choice names only an operating system — the first
 * target of it. -1 when none fits.
 */
export function matchPlatform(options: readonly (string | undefined)[], choice: PlatformChoice): number {
  const named = options.map(platformsOfOption); // an option may name several systems: "macos linux"
  const exact = named.findIndex((o) => o.includes(choice));
  if (exact >= 0) return exact;
  const os = osOf(choice);
  const sameOs = named.findIndex((o) => o.includes(os));
  if (sameOs >= 0) return sameOs;
  if (isPlatformTarget(choice)) return -1;
  return named.findIndex((o) => o.some((t) => isPlatformTarget(t) && osOf(t) === os));
}

/**
 * The choice to remember when the visitor picks `picked` while `current` is chosen: a tab that names only the
 * operating system of the current target keeps the target (picking "Windows" does not forget arm64).
 */
export function refineChoice(picked: PlatformChoice, current: PlatformChoice | undefined): PlatformChoice {
  return current && isPlatform(picked) && isPlatformTarget(current) && osOf(current) === picked ? current : picked;
}

type UAData = {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string; bitness?: string }>;
};
const uaData = (): UAData | undefined => (navigator as Navigator & { userAgentData?: UAData }).userAgentData;

/** The visitor's platform (browser only; undefined on the server or when it cannot be told). */
export function detectPlatform(): DevicePlatform | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const ua = navigator.userAgent ?? '';
  // Android's user agent also says "Linux", and iPadOS 13+ says "Macintosh": test those first
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  const hint = (uaData()?.platform ?? '').toLowerCase();
  if (hint === 'windows' || /Windows/i.test(ua)) return 'windows';
  if (hint === 'macos' || /Macintosh|Mac OS X/i.test(ua)) return 'macos';
  if (hint === 'linux' || hint === 'chrome os' || /Linux|CrOS/i.test(ua)) return 'linux';
  return undefined;
}

/**
 * The visitor's platform with its architecture, from the user agent alone (browser only). Browsers do not say it
 * reliably there — Safari and Firefox on Apple silicon say "Intel Mac OS X", Windows on Arm says "Win64; x64" — so a
 * Mac is taken for Apple silicon (every Mac sold since 2023), everything else for x64 unless its user agent names an
 * Arm processor. detectPlatformChoiceAsync() asks the browser for the architecture where it can tell.
 */
export function detectPlatformChoice(): PlatformChoice | undefined {
  const os = detectPlatform();
  if (!os) return undefined;
  if (os === 'macos') return 'osx-arm64';
  const ua = navigator.userAgent ?? '';
  const arm = /\b(?:aarch64|arm64|armv\d)/i.test(ua);
  return targetOf(os, arm ? 'arm64' : 'x64') ?? os;
}

/**
 * The visitor's platform with its architecture as the browser reports it (User-Agent Client Hints
 * `architecture` and `bitness`, Chromium browsers), else as detectPlatformChoice() guesses it.
 */
export async function detectPlatformChoiceAsync(): Promise<PlatformChoice | undefined> {
  const guess = detectPlatformChoice();
  if (!guess || !['windows', 'macos', 'linux'].includes(osOf(guess))) return guess;
  const ua = typeof navigator === 'undefined' ? undefined : uaData();
  if (!ua?.getHighEntropyValues) return guess;
  try {
    const { architecture = '', bitness = '' } = await ua.getHighEntropyValues(['architecture', 'bitness']);
    const os = osOf(guess);
    if (architecture !== 'arm' && architecture !== 'x86') return guess;
    if (bitness === '32') return os; // a 32-bit system: no target fits
    return targetOf(os, architecture === 'arm' ? 'arm64' : 'x64') ?? os;
  } catch {
    return guess;
  }
}

/** The platform the visitor chose before (a platform tab they clicked), if any: an operating system or a target. */
export function storedPlatformChoice(): PlatformChoice | undefined {
  try {
    const v = localStorage.getItem(PLATFORM_STORAGE_KEY);
    return isPlatformChoice(v) ? v : undefined;
  } catch {
    return undefined;
  }
}

/** The operating system the visitor chose before, if any. */
export function storedPlatform(): DevicePlatform | undefined {
  const c = storedPlatformChoice();
  return c && osOf(c);
}

export function storePlatform(p: PlatformChoice): void {
  try {
    localStorage.setItem(PLATFORM_STORAGE_KEY, p);
  } catch {
    /* private mode / blocked storage: the choice lasts for this page only */
  }
}

const queryChoice = (search: string): PlatformChoice | undefined => {
  const q = new URLSearchParams(search).get(PLATFORM_QUERY)?.toLowerCase();
  return isPlatformChoice(q) ? q : undefined;
};
const currentSearch = () => (typeof location === 'undefined' ? '' : location.search);

/** The platform or target to show: `?platform=` in the URL, else the visitor's earlier choice, else their device. */
export function preferredPlatformChoice(search = currentSearch()): PlatformChoice | undefined {
  return queryChoice(search) ?? storedPlatformChoice() ?? detectPlatformChoice();
}

/** As preferredPlatformChoice(), with the device's architecture as the browser reports it (see detectPlatformChoiceAsync). */
export async function preferredPlatformChoiceAsync(search = currentSearch()): Promise<PlatformChoice | undefined> {
  return queryChoice(search) ?? storedPlatformChoice() ?? (await detectPlatformChoiceAsync());
}

/** The operating system to show: `?platform=` in the URL, else the visitor's earlier choice, else their device. */
export function preferredPlatform(search = currentSearch()): DevicePlatform | undefined {
  const c = queryChoice(search) ?? storedPlatformChoice();
  return c ? osOf(c) : detectPlatform();
}

// ---- The choice on this page, shared by the docs' platform tabs (app/enhance.ts) and the apps' pickers
// (components/PlatformPicker.tsx): a pick in one shows in the others, and the browser is asked for the architecture
// once per page load.

let devicePromise: Promise<PlatformChoice | undefined> | undefined;
let device: PlatformChoice | undefined;
let picked: PlatformChoice | undefined;
const listeners = new Set<(p: PlatformChoice) => void>();

/** detectPlatformChoiceAsync(), asked once per page load; currentPlatformChoice() uses the answer once it is in. */
export function devicePlatformChoice(): Promise<PlatformChoice | undefined> {
  return (devicePromise ??= detectPlatformChoiceAsync().then((c) => (device = c)));
}

/**
 * The platform or target to show now: what the visitor picked since resetPlatformPick(), else `?platform=`, else their
 * earlier choice, else their device (as the browser reports it once devicePlatformChoice() has settled, else guessed).
 */
export function currentPlatformChoice(search = currentSearch()): PlatformChoice | undefined {
  return picked ?? queryChoice(search) ?? storedPlatformChoice() ?? device ?? detectPlatformChoice();
}

/** Whether the visitor picked a platform since resetPlatformPick(). */
export function platformPicked(): boolean {
  return picked !== undefined;
}

/** A new page: `?platform=` of its URL counts again over what the visitor picked on the one before. */
export function resetPlatformPick(): void {
  picked = undefined;
}

/**
 * The visitor picked `p` (a tab, a button): remember it — refined, so that a system's tab keeps the chosen target of
 * that system (refineChoice) — and tell every subscriber. Returns what was chosen.
 */
export function choosePlatform(p: PlatformChoice): PlatformChoice {
  picked = refineChoice(p, currentPlatformChoice());
  storePlatform(picked);
  for (const l of [...listeners]) l(picked);
  return picked;
}

/** Call `fn` with every platform the visitor picks from now on; returns the unsubscribe function. */
export function onPlatformChoice(fn: (p: PlatformChoice) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
