import { useRef } from "react";
import { PixelIcon, useDismissableDetails } from "../kit-ui";
import { useI18n } from "../i18n";

interface VariantMenuProps {
  variants: readonly string[];
  value: string;
  onChange: (variant: string) => void;
}

/**
 * The mod's variant, beside its name: one button that names the selected
 * variant and opens the list of them, so it takes the same room whether the
 * mod has two variants or twenty (the list scrolls). The kit's menu: arrow
 * keys, Home / End, Escape, and the checked item focused on opening.
 */
export function VariantMenu({ variants, value, onChange }: VariantMenuProps) {
  const { t } = useI18n();
  const ref = useRef<HTMLDetailsElement>(null);
  useDismissableDetails(ref);
  const label = (v: string) => (v === "" ? t.defaultVariant : v);
  return (
    <details ref={ref} className="kit-menu mods-variant-menu">
      <summary className="mc-btn mc-btn-sm kit-menu-trigger mods-variant-trigger" aria-label={`${t.variant}: ${label(value)}`}>
        <span className="mods-variant-key">{t.variant}</span>
        <span className="mods-variant-value">{label(value)}</span>
        <PixelIcon name="chevronDown" className="kit-menu-chevron" />
      </summary>
      <div className="kit-menu-panel mods-variant-panel" role="menu" aria-label={t.variant}>
        {variants.map((v) => (
          <button
            key={v}
            type="button"
            role="menuitemradio"
            aria-checked={v === value}
            className={`kit-menu-item${v === value ? " is-active" : ""}`}
            onClick={() => {
              if (v !== value) onChange(v);
            }}
          >
            <span className="mods-variant-name">{label(v)}</span>
            {v === value ? <PixelIcon name="check" className="kit-menu-check" /> : null}
          </button>
        ))}
      </div>
    </details>
  );
}
