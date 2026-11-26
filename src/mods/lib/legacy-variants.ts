// Legacy client variants, folded for the mod page's pickers (the variant switch beside the mod's name,
// the Versions tab), the way LeviLauncher reads them
// (internal/lipcore/engine/compat_legacy_variants.go, rule R1).
//
// A release read from a `tooth.json` (format 3 and older) keeps its server
// build in the variant `""` and its client build in `client` — or in
// `client_<y>` next to `<y>`. A release read from a `lip.toml` has no such
// role variants: both builds are entries of `""` (or `<y>`). So on the page,
// a `tooth.json` version's `client` is shown as part of the default variant
// and its `client_<y>` as part of `<y>`, and a variant then lists every
// version of the mod's build, whichever file a version was read from.
//
// Only the page folds them: the JSON (`server/api.ts`) keeps every version's
// variants as published, as launchers expect.
import { comparePlatforms } from "./manifest.ts";
import { compareVersions } from "./game-versions.ts";
import type { ModSelection } from "./mods.ts";
import type { EntryJson, RawModEntry, Side, VersionTarget } from "../types.ts";

/** The variant a legacy client variant stands for (`client` → `""`, `client_lua` → `lua`); `null` for any other name. */
export function legacyClientBase(name: string): string | null {
  if (name === "client") return "";
  return name.startsWith("client_") && name.length > "client_".length ? name.slice("client_".length) : null;
}

/** The variant a version's variant is shown as. */
export type VariantFold = (name: string, version: string) => string;

/**
 * The fold of a mod: a `tooth.json` version's (not in `lipToml`) `client` or
 * `client_<y>` is shown as `""` or `<y>` — when it has a client entry
 * (`targets`; a version the build did not read is folded too). A variant
 * named so that holds no client build is left as it is.
 */
export function legacyVariantFold(lipToml: readonly string[], targets: Record<string, Record<string, VersionTarget>>): VariantFold {
  const native = new Set(lipToml);
  return (name, version) => {
    const base = legacyClientBase(name);
    if (base === null || native.has(version)) return name;
    const target = targets[name]?.[version];
    return !target || target.side.includes("client") ? base : name;
  };
}

/** The mod's variants with legacy client variants folded (each variant's versions oldest first, as the index has them). */
export function foldMod(mod: RawModEntry, fold: VariantFold): RawModEntry {
  const byName = new Map<string, Set<string>>();
  for (const [name, { versions }] of Object.entries(mod.variants)) {
    for (const version of versions) {
      const shown = fold(name, version);
      let set = byName.get(shown);
      if (!set) byName.set(shown, (set = new Set()));
      set.add(version);
    }
  }
  const variants = Object.fromEntries([...byName].map(([name, set]) => [name, { versions: [...set].sort(compareVersions) }]));
  let defaultVariant = mod.defaultVariant;
  if (defaultVariant !== undefined) {
    const latest = mod.variants[defaultVariant]?.versions.at(-1);
    if (latest !== undefined) defaultVariant = fold(defaultVariant, latest);
  }
  return { ...mod, variants, ...(defaultVariant !== undefined ? { defaultVariant } : {}) };
}

const SIDES: readonly Side[] = ["server", "client"];

function mergeTargets(a: VersionTarget | undefined, b: VersionTarget): VersionTarget {
  if (!a) return b;
  const ranges = new Set([a.leviLamina, b.leviLamina].flatMap((r) => r?.split(" || ") ?? []));
  return {
    side: SIDES.filter((s) => a.side.includes(s) || b.side.includes(s)),
    platform: [...new Set([...a.platform, ...b.platform])].sort(comparePlatforms),
    ...(ranges.size ? { leviLamina: [...ranges].join(" || ") } : {}),
  };
}

/**
 * Version targets with legacy client variants folded: a folded variant adds
 * its client side (its server entries, if any, stay the base variant's
 * business: that is what `lip install` installs).
 */
export function foldTargets(targets: Record<string, Record<string, VersionTarget>>, fold: VariantFold): Record<string, Record<string, VersionTarget>> {
  const out: Record<string, Record<string, VersionTarget>> = {};
  const folded: [string, string, VersionTarget][] = [];
  for (const [name, versions] of Object.entries(targets)) {
    for (const [version, target] of Object.entries(versions)) {
      const shown = fold(name, version);
      if (shown === name) (out[name] ??= {})[version] = mergeTargets(out[name]?.[version], target);
      else folded.push([shown, version, target]);
    }
  }
  for (const [shown, version, target] of folded) {
    const client: VersionTarget = { ...target, side: target.side.filter((s) => s === "client") };
    (out[shown] ??= {})[version] = mergeTargets(out[shown]?.[version], client);
  }
  return out;
}

/**
 * One version's variants with legacy client variants folded: a folded
 * variant's client entries replace the base variant's client entries on
 * their platforms (LeviLauncher installs that build on a client); its server
 * entries are left out.
 */
export function foldEntries(variants: Record<string, EntryJson[]>, version: string, fold: VariantFold): Record<string, EntryJson[]> {
  const out: Record<string, EntryJson[]> = {};
  const folded: [string, EntryJson[]][] = [];
  for (const [name, entries] of Object.entries(variants)) {
    const shown = fold(name, version);
    if (shown === name) out[name] = [...(out[name] ?? []), ...entries];
    else folded.push([shown, entries]);
  }
  for (const [shown, entries] of folded) {
    const client = entries.filter((e) => e.side === "client");
    const platforms = new Set(client.map((e) => e.platform));
    out[shown] = [...(out[shown] ?? []).filter((e) => !(e.side === "client" && platforms.has(e.platform))), ...client];
  }
  return out;
}

/**
 * The variant a URL's `?variant=` names, on the folded page: a legacy client
 * variant of that version (or, without a version, one the folded mod no
 * longer has) is its base, so old links land on the variant that shows it.
 */
export function foldRequestedVariant(variant: string | null, version: string | null, mod: RawModEntry, fold: VariantFold): string | null {
  if (variant === null) return null;
  if (version !== null) return fold(variant, version);
  return variant in mod.variants ? variant : (legacyClientBase(variant) ?? variant);
}

/** A selection on the folded page. */
export const foldSelection = (selection: ModSelection, fold: VariantFold): ModSelection => ({
  variant: fold(selection.variant, selection.version),
  version: selection.version,
});
