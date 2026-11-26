import { useCallback, useEffect, useRef, useState } from 'react';
import { LINKS, PixelIcon, PROJECTS, localizeNetworkUrl, type PixelIconName } from '../../kit/components';
import { useI18n, type Locale } from '../i18n';
import CodeCard from './CodeCard';

// The hero's "I want to…" list: players, server owners and developers, all three on the page at once. Each row says
// who it is for, in one line what they get, and has one way on: the project's Install page (the developers' row: the
// first tutorial, since a mod's toolchain is what that tutorial sets up). The home page starts no download itself.
//
// One quiet action per row, a text link with an arrow, and no filled buttons: three primary buttons side by side
// compete, and the visitor has to compare them. Here the row's title is what the eye lands on ("that is me"), and
// the link is the only thing to do next. The whole row is the link's target. Smaller links below it lead further.
//
// The card beside the list (LeviLauncher, lip, a code sample) follows the row the visitor points at or tabs to, and
// the URL hash (#play, #host, #develop: links to a row, which the browser also scrolls to).

export const ROLES = ['play', 'host', 'develop'] as const;
export type Role = (typeof ROLES)[number];
const isRole = (v: unknown): v is Role => ROLES.includes(v as Role);

const ROLE_ICONS: Record<Role, PixelIconName> = { play: 'diamond', host: 'monitor', develop: 'pickaxe' };

/** The role whose card shows beside the list. The page is prerendered with `play`; the URL hash takes over. */
export function useRole(): [Role, (role: Role) => void] {
  const [role, setRole] = useState<Role>('play');
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1);
      if (isRole(h)) setRole(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);
  return [role, setRole];
}

// Docs and tutorial URLs in the visitor's language: the language is the first segment of every levimc.org URL
// (/zh-Hans/LeviLamina/…, /zh-Hant/tutorials/…; kit localizeNetworkUrl).
const docs = (project: 'LeviLamina' | 'LegacyScriptEngine' | 'lip' | 'LeviLauncher', locale: Locale, path = '') =>
  localizeNetworkUrl(`${PROJECTS.find((p) => p.id === project)!.docs}${path}`, locale);
const tutorial = (locale: Locale, path: string) => localizeNetworkUrl(`${LINKS.tutorials}${path}`, locale);

interface RoleLink {
  href: string;
  label: string;
  /** a page of levimc.org itself (the mods catalog): the same tab */
  internal?: boolean;
}

/** How long the pointer rests on a row before its card shows: crossing a row on the way elsewhere changes nothing. */
const HOVER_INTENT_MS = 120;

/** The three rows (in the hero's copy column). */
export function RoleList({ role, onChange }: { role: Role; onChange: (role: Role) => void }) {
  const { t, locale, href } = useI18n();
  const r = t.roles;
  const timer = useRef<number | undefined>(undefined);
  const settle = useCallback(
    (next: Role | undefined) => {
      window.clearTimeout(timer.current);
      if (next) timer.current = window.setTimeout(() => onChange(next), HOVER_INTENT_MS);
    },
    [onChange],
  );
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const rows: Record<Role, { desc: string; platforms?: string; go: RoleLink; more: RoleLink[] }> = {
    play: {
      desc: r.playDesc,
      platforms: r.playPlatforms,
      go: { href: docs('LeviLauncher', locale, 'install'), label: r.installLauncher },
      more: [
        { href: tutorial(locale, 'play/play-with-mods/'), label: r.playTutorial },
        { href: href(LINKS.mods), label: r.browseMods, internal: true },
      ],
    },
    host: {
      desc: r.hostDesc,
      platforms: r.hostPlatforms,
      go: { href: docs('lip', locale, 'install.html'), label: r.installLip },
      more: [{ href: tutorial(locale, 'server/first-server/'), label: r.hostTutorial }],
    },
    develop: {
      desc: r.developDesc,
      go: { href: tutorial(locale, 'develop/first-levilamina-mod/'), label: r.firstMod },
      more: [
        { href: docs('LegacyScriptEngine', locale), label: r.scripting },
        // the Doxygen reference is in English only
        { href: `${docs('LeviLamina', 'en')}api/`, label: r.apiReference },
        { href: tutorial(locale, 'develop/first-android-mod/'), label: r.androidMods },
      ],
    },
  };

  return (
    <div className="lm-roles">
      <p className="lm-roles-label" id="lm-roles-label">
        {r.label}
      </p>
      <ul className="lm-paths" aria-labelledby="lm-roles-label">
        {ROLES.map((id) => {
          const row = rows[id];
          return (
            <li
              key={id}
              id={id}
              className="lm-path"
              data-role={id}
              data-current={role === id ? '' : undefined}
              onPointerEnter={(e) => (e.pointerType === 'mouse' ? settle(id) : undefined)}
              onPointerLeave={() => settle(undefined)}
              onFocus={() => onChange(id)}
            >
              <PixelIcon name={ROLE_ICONS[id]} size={24} className="lm-path-icon" />
              <div className="lm-path-body">
                <h2 className="lm-path-title">{r[id]}</h2>
                <p className="lm-path-desc">{row.desc}</p>
                <p className="lm-path-action">
                  {/* the row's one action; its ::after covers the row, so the whole row is the link */}
                  <a className="lm-path-go" href={row.go.href}>
                    {row.go.label}
                    <PixelIcon name="arrowRight" />
                  </a>
                  {row.platforms ? <span className="lm-path-platforms">{row.platforms}</span> : null}
                </p>
                <p className="lm-path-more">
                  {row.more.map((l) => (
                    <a key={l.href} href={l.href} {...(l.internal ? {} : { target: '_blank', rel: 'noopener' })}>
                      {l.label}
                    </a>
                  ))}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** What shows beside the list for the current row: LeviLauncher at a glance, lip at a glance, code. */
export function RoleShowcase({ role }: { role: Role }) {
  const { t } = useI18n();
  if (role === 'host') return <LipCard />;
  if (role === 'develop') return <CodeCard label={t.hero.languages} />;
  return <LauncherCard />;
}

const LAUNCHER_ICONS: PixelIconName[] = ['history', 'chest', 'map', 'heart'];
const LIP_ICONS: PixelIconName[] = ['grass', 'chest', 'torch', 'monitor'];

function LauncherCard() {
  const { t } = useI18n();
  return <ProductCard project="LeviLauncher" platforms="Windows · Android" features={t.roles.launcherFeatures} icons={LAUNCHER_ICONS} />;
}

function LipCard() {
  const { t } = useI18n();
  return <ProductCard project="lip" platforms="Windows · Linux · macOS" features={t.roles.lipFeatures} icons={LIP_ICONS} />;
}

function ProductCard({ project, platforms, features, icons }: { project: 'LeviLauncher' | 'lip'; platforms: string; features: readonly { title: string; desc: string }[]; icons: PixelIconName[] }) {
  const p = PROJECTS.find((x) => x.id === project)!;
  return (
    <div className="lm-showcase">
      <div className="px-card lm-showcase-window lm-launcher">
        <div className="lm-launcher-head">
          <img className="lm-project-logo" src={p.logo} alt="" width={56} height={56} decoding="async" />
          <div>
            <p className="lm-launcher-name">{p.name}</p>
            <p className="lm-launcher-platforms">{platforms}</p>
          </div>
        </div>
        <ul className="lm-launcher-features">
          {features.map((f, i) => (
            <li key={f.title}>
              <PixelIcon name={icons[i]!} size={24} />
              <span>
                <strong>{f.title}</strong> {f.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
