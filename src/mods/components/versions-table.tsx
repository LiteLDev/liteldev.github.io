import { useState } from "react";
import { PixelIcon, Pagination } from "../kit-ui";
import { SIDE_BY_ID } from "../data/sides";
import { useI18n } from "../i18n";
import { buildModUrl, getVersionsForVariant, isPrerelease, type ModSelection } from "../lib/mods";
import type { RawModEntry, ReleaseInfo, VersionTarget } from "../types";
import { latestVersionOf } from "./install-actions";
import { RelativeDate } from "./local-date";
import { RouterLink } from "./router-link";
import { MaskIcon, Sprite } from "./sprite";

const PER_PAGE = 20;

interface VersionsTableProps {
  modId: string;
  mod: RawModEntry;
  selection: ModSelection;
  releases: Record<string, ReleaseInfo>;
  /** What each version runs on, per variant. */
  targets: Record<string, Record<string, VersionTarget>>;
  /** Makes another version the page's selection. */
  onSelect: (selection: ModSelection) => void;
}

/**
 * The one place the page's version is picked (the variant is picked beside the
 * mod's name): newest first, every version of the selected variant — channel,
 * version (the variant's latest marked), the sides and platforms its entries run on, the
 * LeviLamina range they need and when it was published. The whole row picks
 * its version, staying in the tab; the version itself is a link (its
 * permalink), which is what the keyboard and assistive technology use. The
 * selected row is highlighted and checked; it is installed with the header's
 * button.
 */
export function VersionsTable({ modId, mod, selection, releases, targets, onSelect }: VersionsTableProps) {
  const { t, locale } = useI18n();
  const variant = selection.variant;
  const all = getVersionsForVariant(mod, variant).slice().reverse();
  const latest = latestVersionOf(mod, variant);
  const onlyPre = all.length > 0 && all.every(isPrerelease);
  const [showPre, setShowPre] = useState(true);
  // opens at the page that has the selected version
  const [page, setPage] = useState(() => Math.floor(Math.max(0, all.indexOf(selection.version)) / PER_PAGE) + 1);
  const versions = showPre || onlyPre ? all : all.filter((v) => !isPrerelease(v));
  const pageCount = Math.max(1, Math.ceil(versions.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const shown = versions.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const label = (v: string) => (v === "" ? t.defaultVariant : v);
  const targetsOf = targets[variant] ?? {};
  const hasRanges = Object.values(targetsOf).some((target) => target.leviLamina);
  const hasDates = Object.keys(releases).length > 0;

  return (
    <div className="mods-versions-tab">
      <div className="mods-versions-bar">
        {!onlyPre && all.some(isPrerelease) ? (
          <label className="mods-check">
            <input
              type="checkbox"
              checked={showPre}
              onChange={(e) => {
                setShowPre(e.target.checked);
                setPage(1);
              }}
            />
            <span className="mods-checkbox" aria-hidden="true">
              {showPre ? <MaskIcon name="check" /> : null}
            </span>
            {t.showPrereleases}
          </label>
        ) : null}
        <Pagination
          page={current}
          pageCount={pageCount}
          hrefFor={() => "#versions"}
          onNavigate={(p, e) => {
            e.preventDefault();
            setPage(p);
          }}
          label={t.pagination}
          previousLabel={t.previousPage}
          nextLabel={t.nextPage}
          className="mods-versions-pager"
        />
      </div>
      {shown.length ? (
        <table className="mods-versions-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="kit-sr-only">{t.release}</span>
              </th>
              <th scope="col">{t.colVersion}</th>
              <th scope="col">{t.colSide}</th>
              <th scope="col">{t.colPlatform}</th>
              {hasRanges ? <th scope="col">{t.colLeviLamina}</th> : null}
              {hasDates ? <th scope="col">{t.colPublished}</th> : null}
              <th scope="col">
                <span className="kit-sr-only">{t.selected}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((version) => {
              const pre = releases[version]?.prerelease ?? isPrerelease(version);
              const isCurrent = version === selection.version;
              const target = targetsOf[version];
              const range = target?.leviLamina;
              return (
                <tr
                  key={version}
                  aria-current={isCurrent ? "true" : undefined}
                  onClick={(e) => {
                    // the whole row picks its version; a modified click on the link opens its permalink, a text selection is left alone
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || window.getSelection()?.toString()) return;
                    e.preventDefault();
                    if (!isCurrent) onSelect({ variant, version });
                  }}
                >
                  <td className="mods-vt-channel">
                    <span className={`px-dot mods-channel ${pre ? "is-pre" : "is-release"}`} title={pre ? t.prerelease : t.release} />
                    <span className="kit-sr-only">{pre ? t.prerelease : t.release}</span>
                  </td>
                  <td className="mods-vt-version">
                    <RouterLink href={buildModUrl(modId, mod, { variant, version }, "versions")} aria-current={isCurrent ? "page" : undefined} preventScrollReset>
                      {version}
                    </RouterLink>
                    {version === latest ? <span className="kit-badge kit-badge-grass mods-vt-latest">{t.latest}</span> : null}
                  </td>
                  <td className="mods-vt-sides">
                    {target?.side.map((id) => {
                      const side = SIDE_BY_ID.get(id)!;
                      return (
                        <span key={id} className="mods-chip" title={side.label[locale]}>
                          <Sprite name={side.icon} />
                          {side.label[locale]}
                        </span>
                      );
                    })}
                  </td>
                  <td className="mods-vt-platforms">
                    {target?.platform.map((id) => (
                      <span key={id} className="mods-chip mods-chip-mono">
                        {id}
                      </span>
                    ))}
                  </td>
                  {hasRanges ? <td className="mods-vt-range">{range ? <code>{range}</code> : null}</td> : null}
                  {hasDates ? (
                    <td className="mods-vt-date">{releases[version] ? <RelativeDate value={releases[version]!.date} /> : null}</td>
                  ) : null}
                  <td className="mods-vt-check">{isCurrent ? <PixelIcon name="check" title={t.selected} /> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="mods-empty-note">{t.noVersions(label(variant))}</p>
      )}
    </div>
  );
}
