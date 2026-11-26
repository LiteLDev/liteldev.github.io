import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { ModDetail, type ModPageData } from "../components/mod-detail";
import { foldEntries, foldMod, foldRequestedVariant, foldSelection, foldTargets, legacyVariantFold } from "../lib/legacy-variants";
import { fetchManifest, fetchReadmes, parseTab, resolveSelection, type ModSelection } from "../lib/mods";
import type { ModDetails } from "../page-data";
import { useHydrated } from "../page-store";

function selectionKey({ variant, version }: ModSelection): string {
  return `${variant}@${version}`;
}

/**
 * The page data as the page shows it: a `tooth.json` version's legacy
 * `client` / `client_<y>` variant folded into `""` / `<y>`, as LeviLauncher
 * reads it (see `lib/legacy-variants.ts`).
 */
function foldPageData(data: ModPageData) {
  const fold = legacyVariantFold(data.lipToml, data.targets);
  const { prerendered } = data;
  const view: ModPageData = {
    ...data,
    mod: foldMod(data.mod, fold),
    targets: foldTargets(data.targets, fold),
    prerendered: {
      ...prerendered,
      ...foldSelection(prerendered, fold),
      variants: prerendered.variants && foldEntries(prerendered.variants, prerendered.version, fold),
    },
  };
  return { view, fold };
}

/**
 * Only the latest version's Description is prerendered; another variant or
 * version (`?variant=&version=`) fetches that version's manifest and README
 * here, and the other tabs (`?tab=versions|dependencies`) render from the
 * page data once hydrated. The package file comes from the mod's index.json, the
 * README from GitHub (which allows cross-origin reads).
 * (The app renders one of these per mod, so its state never outlives the
 * mod.)
 */
export function ModPage({ data: raw }: { data: ModPageData }) {
  const { view: data, fold } = useMemo(() => foldPageData(raw), [raw]);
  const { id: modId, mod, repository, prerendered, readmeFiles } = data;
  const [searchParams] = useSearchParams();
  const hydrated = useHydrated();
  const requestedVersion = searchParams.get("version");
  const selection =
    (hydrated && resolveSelection(mod, foldRequestedVariant(searchParams.get("variant"), requestedVersion, mod, fold), requestedVersion)) ||
    prerendered;
  const tab = hydrated ? parseTab(searchParams.get("tab")) : "description";
  const key = selectionKey(selection);
  const isPrerendered = key === selectionKey(prerendered);

  const [fetched, setFetched] = useState<{ key: string } & ModDetails>();

  useEffect(() => {
    if (isPrerendered) return;

    let cancelled = false;
    const [variant, version] = [selection.variant, selection.version];
    Promise.all([fetchManifest(modId, version), fetchReadmes(repository, version, readmeFiles)]).then(([manifest, readmes]) => {
      if (cancelled) return;
      setFetched({
        key: selectionKey({ variant, version }),
        info: manifest?.info ?? null,
        variants: manifest ? foldEntries(manifest.variants, version, fold) : null,
        readmes,
      });
    });
    return () => {
      cancelled = true;
    };
  }, [modId, repository, readmeFiles, isPrerendered, selection.variant, selection.version, fold]);

  let details: Partial<ModDetails> = {};
  if (isPrerendered) details = prerendered;
  else if (fetched?.key === key) details = fetched;

  return (
    <main id="main" className="mods-main kit-above-backdrop" tabIndex={-1} data-mods-detail="">
      <ModDetail
        data={data}
        selection={selection}
        tab={tab}
        info={details.info ?? null}
        variants={details.variants}
        readmes={details.readmes}
      />
    </main>
  );
}
