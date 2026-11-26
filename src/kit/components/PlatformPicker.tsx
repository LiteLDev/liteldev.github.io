import { useEffect, useState } from 'react';
import {
  choiceOfOption,
  choosePlatform,
  currentPlatformChoice,
  devicePlatformChoice,
  matchPlatform,
  onPlatformChoice,
  platformName,
  platformsOfOption,
  type PlatformChoice,
} from '../docs/shared/platform';

/**
 * What a picker can offer: a platform, a target, or several systems that get the same content, space-separated
 * (`'macos linux'`: one "macOS / Linux" button, selected on either).
 */
export type PlatformOption = PlatformChoice | `${PlatformChoice} ${PlatformChoice}` | `${PlatformChoice} ${PlatformChoice} ${PlatformChoice}`;

/** Pick `option`: for an option of several systems, the visitor's own one of them stays chosen (choiceOfOption). */
export function chooseOption(option: PlatformOption): void {
  const p = choiceOfOption(option, currentPlatformChoice());
  if (p) choosePlatform(p);
}

/** The default label of an option: its platforms' names, "macOS / Linux" for several. */
export function optionName(option: PlatformOption, lang = 'en'): string {
  return platformsOfOption(option)
    .map((p) => platformName(p, lang))
    .join(' / ');
}

// The platform picker of an app: buttons for the platforms (or operating system + architecture targets) that some
// content differs for, the visitor's choice selected — the same choice as the docs' platform tabs (?platform=, then
// the choice remembered in `levimc_platform`, then the device: docs/shared/platform.ts). Every picker,
// usePlatformChoice() and platform tab set on the page follows the latest pick.

export { choosePlatform };

/**
 * The option of `options` to show for the visitor: undefined until hydrated (the prerendered page shows the
 * author's default), then their platform (with the architecture the browser reports, where it does), and whatever
 * they pick afterwards. `fallback` when none of the options fits.
 */
export function usePlatformChoice<T extends PlatformOption>(options: readonly T[], fallback?: T): [T | undefined, (p: T) => void] {
  const [choice, setChoice] = useState<PlatformChoice | null>(); // undefined: not hydrated yet; null: unknown device
  useEffect(() => {
    let alive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the stored choice is read after hydration: the prerendered page has none
    setChoice(currentPlatformChoice() ?? null);
    const off = onPlatformChoice((p) => setChoice(p));
    void devicePlatformChoice().then(() => {
      if (alive) setChoice(currentPlatformChoice() ?? null);
    });
    return () => {
      alive = false;
      off();
    };
  }, []);
  const n = choice ? matchPlatform(options, choice) : -1;
  const selected = choice === undefined ? undefined : n >= 0 ? options[n] : fallback;
  return [selected, chooseOption];
}

export interface PlatformPickerProps<T extends PlatformOption> {
  /** The platforms, targets or groups of systems (PlatformOption) to offer, in order. */
  options: readonly T[];
  /** The selected one (usePlatformChoice); none selected while undefined. */
  value: T | undefined;
  onChange: (p: T) => void;
  /** Accessible name of the group ("Your system"). */
  label: string;
  /** Language of the button labels (platformName): `en`, `zh-Hans`, `zh-Hant`. */
  lang?: string;
  /** Button labels instead of optionName(option, lang). */
  names?: Partial<Record<T, string>>;
  className?: string;
}

/** A hotbar of toggle buttons, one per platform (aria-pressed on the selected one). */
export function PlatformPicker<T extends PlatformOption>({ options, value, onChange, label, lang = 'en', names, className }: PlatformPickerProps<T>) {
  return (
    <div className={className ? `hotbar kit-platform-picker ${className}` : 'hotbar kit-platform-picker'} role="group" aria-label={label}>
      {options.map((p) => (
        <button key={p} type="button" aria-pressed={p === value} data-platform={p} onClick={() => onChange(p)}>
          {names?.[p] ?? optionName(p, lang)}
        </button>
      ))}
    </div>
  );
}
