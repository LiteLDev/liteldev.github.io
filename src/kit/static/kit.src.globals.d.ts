// Types for kit.src.js (type checking only; nothing here is shipped). build-static.mjs puts the shared preference
// code (components/prefs.ts PREFS_CORE_JS) in front of the script's body: these are the names kit.src.js uses of it.

/** Index of the nearest locale in `locales` ([{ c: code, l: lang }]) for a language tag, or -1. */
declare function ml(tag: string | null | undefined, locales: readonly { c: string; l: string }[]): number;
/** The stored preference, or null. */
declare function rp(kind: 'theme' | 'lang'): string | null;
/** Store a preference (invalid values are ignored). */
declare function wp(kind: 'theme' | 'lang', value: string | null): void;
/** The localStorage keys of the preferences. */
declare const PS: { readonly theme: string; readonly lang: string };

/** An event's target before it is known to be an element: documents and windows have no `closest`. */
type KitTarget = Omit<HTMLElement, 'closest'> & { closest?: HTMLElement['closest'] };

interface Window {
  /** Set by kit.js on Doxygen pages: tells the kit's navtree.js patch that the kit lays the page out. */
  kitDoxygen?: boolean;
  /** Doxygen's navtree.js; kit.js wraps it to build the tree lazily. */
  initNavTree?: (...args: unknown[]) => void;
}
