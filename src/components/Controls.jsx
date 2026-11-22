import { useState } from "react";
import { FONTS, GRADIENTS, makeCustomGradient, toCss } from "../lib/pfp";
import { DECORS } from "../lib/decor";
import { EFFECTS } from "../lib/effects";
import { BURSTS } from "../lib/burst";
import {
  Aperture,
  CaseSensitive,
  Check,
  Download,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";
import { CloseIcon } from "./Icons";

// Tools shown in the toolbar. Add "decor", "effect" or "burst" to bring them back;
// their buttons and panels are still wired up below.
const ENABLED_TOOLS = ["letter", "font", "gradient", "download"];
const ICON_PROPS = { size: 18, strokeWidth: 1.8, "aria-hidden": true };

// Renders a burst sticker's shapes with the same data the canvas uses
function BurstSvg({ burst }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full overflow-visible"
      aria-hidden="true"
    >
      {burst.shapes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          fill={s.fill ?? "none"}
          stroke={s.stroke ?? "none"}
          strokeWidth={s.w ?? 3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function ToolButton({
  label,
  active,
  primary,
  compact,
  disabled,
  onClick,
  children,
}) {
  // Every button is its own round chip (border + background), not part of a shared pill
  const tone = primary
    ? "border-ink bg-ink text-paper hover:bg-black dark:border-border dark:bg-surface dark:text-white dark:hover:bg-white/10"
    : active
      ? "border-ink bg-white text-ink shadow-sm dark:border-white/40 dark:bg-white/10"
      : "border-gray-200 bg-gray-50 text-ink/65 hover:text-ink dark:border-border dark:bg-surface dark:hover:bg-white/10";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={primary ? undefined : !!active}
      onClick={onClick}
      disabled={disabled}
      className={`grid ${compact ? "size-9" : "size-10"} place-items-center rounded-full border ${tone} transition duration-200 active:scale-90 disabled:pointer-events-none disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

export default function Controls({
  font,
  gradient,
  decors,
  effect,
  bursts,
  letterFocused,
  saved,
  onFocusLetter,
  onFont,
  onGradient,
  onDecor,
  onClearDecor,
  onEffect,
  onBurst,
  onClearBurst,
  onDownload,
}) {
  const [panel, setPanel] = useState(null);
  const [custom, setCustom] = useState(["#ff8a5c", "#6a2cff"]);
  const toggle = (id) => setPanel((p) => (p === id ? null : id));
  const on = (id) => ENABLED_TOOLS.includes(id);

  const updateCustom = (next) => {
    setCustom(next);
    onGradient(makeCustomGradient(next[0], next[1]));
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div
        role="toolbar"
        aria-label="PFP tools"
        className="flex items-center gap-2"
      >
        {on("letter") && (
          <ToolButton
            label="Letter"
            active={letterFocused}
            onClick={() => {
              setPanel(null);
              onFocusLetter();
            }}
          >
            <Type {...ICON_PROPS} />
          </ToolButton>
        )}
        {on("font") && (
          <ToolButton
            label="Font"
            active={panel === "font"}
            onClick={() => toggle("font")}
          >
            <CaseSensitive {...ICON_PROPS} />
          </ToolButton>
        )}
        {on("gradient") && (
          <ToolButton
            label="Background"
            active={panel === "gradient"}
            onClick={() => toggle("gradient")}
          >
            {/* Small round preview of the gradient that is active right now */}
            <span
              aria-hidden="true"
              style={{ backgroundImage: toCss(gradient) }}
              className="size-5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_0.5px_rgba(255,255,255,0.1)]"
            />
          </ToolButton>
        )}
        {on("decor") && (
          <ToolButton
            label="Decor"
            active={panel === "decor"}
            onClick={() => toggle("decor")}
          >
            <Sparkles {...ICON_PROPS} />
          </ToolButton>
        )}
        {on("effect") && (
          <ToolButton
            label="Effect"
            active={panel === "effect"}
            onClick={() => toggle("effect")}
          >
            <Aperture {...ICON_PROPS} />
          </ToolButton>
        )}
        {on("burst") && (
          <ToolButton
            label="Burst"
            active={panel === "burst"}
            onClick={() => toggle("burst")}
          >
            <Zap {...ICON_PROPS} />
          </ToolButton>
        )}
        {on("download") && (
          <ToolButton
            label={saved ? "Saved" : "Download HD"}
            primary
            onClick={onDownload}
          >
            {saved ? <Check {...ICON_PROPS} /> : <Download {...ICON_PROPS} />}
          </ToolButton>
        )}
      </div>

      {/* Fixed height so the layout doesn't jump when a panel opens */}
      <div className="relative flex h-12 w-full justify-center mb-5">
        {panel === "font" && (
          <div className="bg-gray-50 border border-gray-200 h-24 grid grid-cols-4 max-w-full items-center gap-1 overflow-x-auto rounded-3xl p-2 [scrollbar-width:none] dark:bg-surface dark:border-border">
            {FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                title={f.name}
                aria-label={`Font ${f.name}`}
                aria-pressed={f.id === font.id}
                onClick={() => onFont(f)}
                style={{ fontFamily: f.family, fontWeight: f.weight }}
                className={`grid size-10 shrink-0 place-items-center rounded-full text-[16px] transition active:scale-90 ${
                  f.id === font.id
                    ? "bg-ink text-white"
                    : "text-ink hover:bg-white/60 dark:hover:bg-white/10"
                }`}
              >
                Aa
              </button>
            ))}
          </div>
        )}
        {panel === "gradient" && (
          <div className="bg-gray-50 border border-gray-200 absolute top-0 left-1/2 z-30 flex w-max max-w-full max-h-32 overflow-scroll -translate-x-1/2 flex-col gap-3 rounded-3xl p-4 dark:bg-surface dark:border-border">
            <div className="grid grid-cols-4 items-center gap-3">
              {GRADIENTS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  title={g.name}
                  aria-label={`Gradient ${g.name}`}
                  aria-pressed={g.id === gradient.id}
                  onClick={() => onGradient(g)}
                  style={{ backgroundImage: toCss(g) }}
                  className={`size-10 shrink-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_0.5px_rgba(255,255,255,0.1)] transition active:scale-90 ${
                    g.id === gradient.id
                      ? "outline-2 outline-offset-2 outline-ink"
                      : ""
                  }`}
                />
              ))}
              {/* Custom color: applies the current picks; shows them once active */}
              <button
                type="button"
                title="Custom"
                aria-label="Custom gradient"
                aria-pressed={!!gradient.custom}
                onClick={() => updateCustom(custom)}
                style={{
                  backgroundImage: gradient.custom
                    ? toCss(gradient)
                    : "conic-gradient(from 0deg, #ff4d4d, #ffb84d, #f2f24d, #4dff88, #4dc3ff, #8a4dff, #ff4de1, #ff4d4d)",
                }}
                className={`grid size-8 shrink-0 place-items-center rounded-full text-[18px] font-bold leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)] transition active:scale-90 ${
                  gradient.custom
                    ? "outline-2 outline-offset-2 outline-ink"
                    : ""
                }`}
              >
                {gradient.custom ? "" : "+"}
              </button>
            </div>
            {gradient.custom && (
              <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3 dark:border-border">
                {[
                  ["Top", 0],
                  ["Bottom", 1],
                ].map(([label, idx]) => (
                  <label
                    key={label}
                    className="flex items-center gap-2 text-[12px] font-medium text-ink/70"
                  >
                    {label}
                    <input
                      type="color"
                      value={custom[idx]}
                      aria-label={`${label} color`}
                      onChange={(e) => {
                        const next = [...custom];
                        next[idx] = e.target.value;
                        updateCustom(next);
                      }}
                      className="size-8 cursor-pointer rounded-full border-0 bg-transparent p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                    />
                  </label>
                ))}
                <button
                  type="button"
                  title="Swap colors"
                  aria-label="Swap colors"
                  onClick={() => updateCustom([custom[1], custom[0]])}
                  className="grid size-8 place-items-center rounded-full text-[16px] text-ink/70 transition hover:bg-white/60 active:scale-90 dark:hover:bg-white/10"
                >
                  ⇅
                </button>
              </div>
            )}
          </div>
        )}
        {panel === "decor" && (
          <div className="bg-gray-50 border border-gray-200 h-24 grid grid-cols-7 max-w-full items-center gap-0.5 overflow-x-auto rounded-3xl p-1 [scrollbar-width:none] dark:bg-surface dark:border-border">
            <button
              type="button"
              title="Clear decor"
              aria-label="Clear decor"
              disabled={decors.length === 0}
              onClick={onClearDecor}
              className="grid size-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-white/60 dark:hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <CloseIcon />
            </button>
            {DECORS.map((d) => {
              const on = decors.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  aria-label={`Decor ${d.id}`}
                  aria-pressed={on}
                  onClick={() => onDecor(d.id)}
                  className={`grid size-10 shrink-0 place-items-center rounded-full text-[20px] leading-none transition active:scale-90 ${
                    on
                      ? "bg-white/20 shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(255,255,255,0.1)] dark:bg-white/30 dark:shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(255,255,255,0.05)]"
                      : "hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                >
                  {d.emoji}
                </button>
              );
            })}
          </div>
        )}
        {panel === "effect" && (
          <div className="bg-gray-50 border border-gray-200 h-24 flex max-w-full flex-col items-center justify-center gap-2 rounded-3xl px-4 dark:bg-surface dark:border-border">
            <div className="flex items-center gap-1">
              {EFFECTS.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={e.id === effect.id}
                  onClick={() => onEffect({ ...effect, id: e.id })}
                  className={`h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition active:scale-95 ${
                    e.id === effect.id
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  {e.name}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-4">
              {[
                ["amount", "Amount"],
                ["weight", "Weight"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex flex-col items-center gap-0.5 text-[10px] font-medium text-ink/60"
                >
                  {label}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={effect[key]}
                    disabled={effect.id === "none"}
                    aria-label={label}
                    onChange={(e) =>
                      onEffect({ ...effect, [key]: Number(e.target.value) })
                    }
                    className="w-28 accent-ink transition disabled:opacity-30"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
        {panel === "burst" && (
          <div className="bg-gray-50 border border-gray-200 h-24 flex max-w-full items-center gap-1 overflow-x-auto rounded-3xl p-2 [scrollbar-width:none] dark:bg-surface dark:border-border">
            <button
              type="button"
              title="Clear burst"
              aria-label="Clear burst"
              disabled={bursts.length === 0}
              onClick={onClearBurst}
              className="grid size-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-white/60 dark:hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <CloseIcon />
            </button>
            {BURSTS.map((b) => {
              const on = bursts.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  title={b.name}
                  aria-label={`Burst ${b.name}`}
                  aria-pressed={on}
                  onClick={() => onBurst(b.id)}
                  className={`grid size-12 shrink-0 place-items-center rounded-2xl p-2 transition active:scale-90 ${
                    on
                      ? "bg-white/20 shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(255,255,255,0.1)] dark:bg-white/30 dark:shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(255,255,255,0.05)]"
                      : "hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                >
                  <BurstSvg burst={b} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
