import assert from "node:assert/strict";
import { test } from "node:test";
import type { EntryJson, RawModEntry, VersionTarget } from "../types.ts";
import {
  foldEntries,
  foldMod,
  foldRequestedVariant,
  foldSelection,
  foldTargets,
  legacyClientBase,
  legacyVariantFold,
} from "./legacy-variants.ts";

const LL = "github.com/LiteLDev/LeviLamina";
const server = (platform = "win-x64", deps: Record<string, string> = { [LL]: "1.0.x" }): EntryJson => ({ side: "server", platform, deps });
const client = (platform = "win-x64", deps: Record<string, string> = { [`${LL}#client`]: "1.0.x" }): EntryJson => ({ side: "client", platform, deps });
const target = (side: VersionTarget["side"], platform = ["win-x64"], leviLamina?: string): VersionTarget => ({
  side,
  platform,
  ...(leviLamina ? { leviLamina } : {}),
});

// LegacyScriptEngine-like: 1.0.0 and 1.1.0 from a tooth.json (server in "" / "lua", client in "client" / "client_lua"),
// 2.0.0 from a lip.toml (both sides in "" / "lua")
const mod: RawModEntry = {
  info: { name: "M", description: "", tags: [] },
  updated_at: "",
  stargazer_count: 0,
  variants: {
    "": { versions: ["1.0.0", "1.1.0", "2.0.0"] },
    client: { versions: ["1.0.0", "1.1.0"] },
    client_lua: { versions: ["1.1.0"] },
    lua: { versions: ["1.1.0", "2.0.0"] },
  },
  defaultVariant: "",
};
const targets: Record<string, Record<string, VersionTarget>> = {
  "": {
    "1.0.0": target(["server"], ["win-x64"], "1.0.x"),
    "1.1.0": target(["server"], ["win-x64"], "1.1.x"),
    "2.0.0": target(["server", "client"], ["win-x64"], "2.0.x"),
  },
  client: { "1.0.0": target(["client"], ["win-x64"], "1.0.x"), "1.1.0": target(["client"], ["win-x64", "android-arm64"], "1.1.x") },
  client_lua: { "1.1.0": target(["client"]) },
  lua: { "1.1.0": target(["server"]), "2.0.0": target(["server", "client"]) },
};
const fold = legacyVariantFold(["2.0.0"], targets);

test("legacyClientBase: client and client_<y> name their base", () => {
  assert.equal(legacyClientBase("client"), "");
  assert.equal(legacyClientBase("client_lua"), "lua");
  assert.equal(legacyClientBase("client_"), null);
  assert.equal(legacyClientBase("lua"), null);
  assert.equal(legacyClientBase(""), null);
  assert.equal(legacyClientBase("clientside"), null);
});

test("legacyVariantFold: only tooth.json versions' client builds fold", () => {
  assert.equal(fold("client", "1.0.0"), "");
  assert.equal(fold("client_lua", "1.1.0"), "lua");
  assert.equal(fold("lua", "1.1.0"), "lua");
  // a lip.toml version's client variant is literal
  assert.equal(fold("client", "2.0.0"), "client");
  // a tooth.json "client" that holds no client build stays
  const serverOnly = legacyVariantFold([], { client: { "1.0.0": target(["server"]) } });
  assert.equal(serverOnly("client", "1.0.0"), "client");
  // a version the build did not read folds
  assert.equal(fold("client", "0.9.0"), "");
});

test("foldMod: variants list every version of their build, oldest first", () => {
  const folded = foldMod(mod, fold);
  assert.deepEqual(folded.variants, {
    "": { versions: ["1.0.0", "1.1.0", "2.0.0"] },
    lua: { versions: ["1.1.0", "2.0.0"] },
  });
  assert.equal(folded.defaultVariant, "");
  assert.deepEqual(mod.variants.client, { versions: ["1.0.0", "1.1.0"] }, "the index is not changed");

  // a client-only tooth.json mod: its client variant becomes the default one
  const clientOnly: RawModEntry = { ...mod, variants: { client: { versions: ["1.0.0"] } }, defaultVariant: "client" };
  const one = foldMod(clientOnly, legacyVariantFold([], { client: { "1.0.0": target(["client"]) } }));
  assert.deepEqual(one.variants, { "": { versions: ["1.0.0"] } });
  assert.equal(one.defaultVariant, "");

  // versions only the folded variant has are merged in version order
  const gaps: RawModEntry = { ...mod, variants: { "": { versions: ["1.0.0", "1.2.0"] }, client: { versions: ["1.1.0"] } } };
  assert.deepEqual(foldMod(gaps, legacyVariantFold([], {})).variants, { "": { versions: ["1.0.0", "1.1.0", "1.2.0"] } });
});

test("foldTargets: a folded variant adds its client side and platforms", () => {
  const folded = foldTargets(targets, fold);
  assert.deepEqual(Object.keys(folded).sort(), ["", "lua"]);
  assert.deepEqual(folded[""]!["1.0.0"], target(["server", "client"], ["win-x64"], "1.0.x"));
  assert.deepEqual(folded[""]!["1.1.0"], target(["server", "client"], ["win-x64", "android-arm64"], "1.1.x"));
  assert.deepEqual(folded[""]!["2.0.0"], targets[""]!["2.0.0"]);
  assert.deepEqual(folded.lua!["1.1.0"], target(["server", "client"]));
  // a client-only version shows no server (so no lip command)
  const only = foldTargets({ client: { "1.0.0": target(["client"]) } }, legacyVariantFold([], {}));
  assert.deepEqual(only, { "": { "1.0.0": target(["client"]) } });
});

test("foldEntries: the folded variant's client entries replace the base's on their platforms", () => {
  const both = { side: "client" as const, platform: "win-x64", deps: {} };
  const variants = {
    "": [server(), both, { ...both, platform: "linux-x64" }],
    client: [client(), server("android-arm64"), client("android-arm64")],
  };
  assert.deepEqual(foldEntries(variants, "1.0.0", fold), {
    "": [server(), { ...both, platform: "linux-x64" }, client(), client("android-arm64")],
  });
  // a lip.toml version is as published
  assert.deepEqual(foldEntries(variants, "2.0.0", fold), variants);
});

test("foldRequestedVariant and foldSelection: old links land on the folded variant", () => {
  const folded = foldMod(mod, fold);
  assert.equal(foldRequestedVariant("client", "1.0.0", folded, fold), "");
  assert.equal(foldRequestedVariant("client_lua", "1.1.0", folded, fold), "lua");
  assert.equal(foldRequestedVariant("client", "2.0.0", folded, fold), "client");
  assert.equal(foldRequestedVariant("client", null, folded, fold), "");
  assert.equal(foldRequestedVariant("lua", null, folded, fold), "lua");
  assert.equal(foldRequestedVariant(null, "1.0.0", folded, fold), null);
  assert.deepEqual(foldSelection({ variant: "client", version: "1.1.0" }, fold), { variant: "", version: "1.1.0" });
});
