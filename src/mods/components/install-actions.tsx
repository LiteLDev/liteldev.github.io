import { useRef, useState } from "react";
import { BrandIcon, PixelIcon, useDismissableDetails } from "../kit-ui";
import { SIDE_BY_ID } from "../data/sides";
import { useI18n } from "../i18n";
import { deepLink, getVersionsForVariant, installAppsFor, isPrerelease, type InstallApp, type ModSelection } from "../lib/mods";
import type { RawModEntry } from "../types";
import { InstallCommand } from "./install-commands";
import { Sprite } from "./sprite";

/** The apps' names, as their projects write them. */
export const APP_NAMES: Record<InstallApp, string> = { lip: "lip", levilauncher: "LeviLauncher" };

/**
 * The version a variant is installed at by default, for the "Latest" mark: its
 * newest release, else (only pre-releases) its newest version.
 */
export function latestVersionOf(mod: RawModEntry, variant: string): string | undefined {
  const versions = getVersionsForVariant(mod, variant);
  return versions.filter((v) => !isPrerelease(v)).at(-1) ?? versions.at(-1);
}

/**
 * After a deep link was followed, where to get the app: a page cannot tell
 * whether a protocol handler is installed, so it never blocks or guesses — it
 * only says what to do when nothing opened. A live region, so it is announced.
 */
function DeepLinkHint({ app }: { app: InstallApp | null }) {
  const { t } = useI18n();
  return (
    <p className="mods-deeplink-hint" role="status">
      {app ? (
        <>
          {t.deepLinkMissing}{" "}
          <a href={app === "lip" ? t.getLipUrl : t.getLeviLauncherUrl} target="_blank" rel="noopener noreferrer">
            {app === "lip" ? t.getLip : t.getLeviLauncher}
          </a>
        </>
      ) : null}
    </p>
  );
}

interface InstallActionsProps {
  modId: string;
  repository: string;
  selection: ModSelection;
  /** The sides the selected version runs on (`undefined`: unknown, both apps are offered). */
  side: readonly string[] | undefined;
}

/** The side each app installs into. */
const APP_SIDE = { levilauncher: "client", lip: "server" } as const;

/**
 * The page's one way to install its selection, in the header: one "Install"
 * button, whose menu asks the only question there is — where to: the client
 * (LeviLauncher) or the server (lip), by the sides the version runs on. Each
 * is a plain link to its deep link; the server also gets the `lip install`
 * command, as a server is often another machine, where a link opened in this
 * browser installs nothing. A `<details>`, so it works before the page
 * hydrates; the menu stays open after a link was followed, to show
 * {@link DeepLinkHint}.
 */
export function InstallActions({ modId, repository, selection, side }: InstallActionsProps) {
  const { t, locale } = useI18n();
  const ref = useRef<HTMLDetailsElement>(null);
  useDismissableDetails(ref);
  const [followed, setFollowed] = useState<InstallApp | null>(null);
  const apps = installAppsFor(side);
  return (
    // the old page's Install heading id, so #mods-install-title links still land here
    <div id="mods-install-title" className="mods-project-actions">
      <details ref={ref} className="kit-menu mods-install">
        <summary className="mc-btn mc-btn-primary mc-btn-lg mods-install-btn">
          <PixelIcon name="pickaxe" />
          {t.install}
          <PixelIcon name="chevronDown" className="kit-menu-chevron" />
        </summary>
        <div className="mods-install-menu">
          <p className="mods-install-what">
            {t.installing}
            <span className="mods-install-version">
              {selection.variant ? `${selection.variant} / ` : ""}
              {selection.version}
            </span>
          </p>
          <ul className="mods-install-apps">
            {apps.map((app) => {
              const target = SIDE_BY_ID.get(APP_SIDE[app])!;
              return (
                <li key={app}>
                  <a className="mods-install-app" href={deepLink(app, modId, selection.variant, selection.version)} data-app={app} onClick={() => setFollowed(app)}>
                    <span className="mods-install-app-icon">
                      <Sprite name={target.icon} />
                    </span>
                    <span className="mods-install-app-text">
                      <span className="mods-install-app-side">{target.label[locale]}</span>
                      <span className="mods-install-app-with">{t.installWith(APP_NAMES[app])}</span>
                    </span>
                    <PixelIcon name="chevronRight" className="mods-install-app-go" />
                  </a>
                  {app === "lip" ? (
                    <div className="mods-install-run">
                      <span className="mods-install-label">{t.installHint}</span>
                      <InstallCommand modId={modId} variant={selection.variant} version={selection.version} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <DeepLinkHint app={followed} />
        </div>
      </details>
      <a className="mc-btn mc-btn-lg mods-github-btn" href={repository} target="_blank" rel="noopener noreferrer" aria-label={t.viewOnGitHub} title={t.viewOnGitHub}>
        <BrandIcon name="github" size={18} />
      </a>
    </div>
  );
}
