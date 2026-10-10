import { useState } from "react";
import { FONTS, GRADIENTS, toCss } from "../lib/pfp";
import { DECORS } from "../lib/decor";
import {
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  FontIcon,
  GradientIcon,
  SparkleIcon,
  TypeIcon,
} from "./Icons";

export function ToolButton({
  label,
  active,
  primary,
  compact,
  disabled,
  onClick,
  children,
}) {
  const tone = primary
    ? "bg-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-black"
    : active
      ? "bg-white/90 text-ink shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(0,0,0,0.12)]"
      : "text-ink/65 hover:bg-white/50 hover:text-ink";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={primary ? undefined : !!active}
      onClick={onClick}
      disabled={disabled}
      className={`grid ${compact ? "size-9" : "size-10"} place-items-center rounded-full transition duration-200 active:scale-90 disabled:pointer-events-none disabled:opacity-30 ${tone}`}
    >
      {children}
    </button>
  );
}

export default function Controls({
  font,
  gradient,
  decors,
  letterFocused,
  saved,
  onFocusLetter,
  onFont,
  onGradient,
  onDecor,
  onClearDecor,
  onDownload,
}) {
  const [panel, setPanel] = useState(null);
  const toggle = (id) => setPanel((p) => (p === id ? null : id));

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div
        role="toolbar"
        aria-label="PFP tools"
        className="glass flex items-center gap-0.5 rounded-full p-1"
      >
        <ToolButton
          label="Letter"
          active={letterFocused}
          onClick={() => {
            setPanel(null);
            onFocusLetter();
          }}
        >
          <TypeIcon />
        </ToolButton>
        <ToolButton
          label="Font"
          active={panel === "font"}
          onClick={() => toggle("font")}
        >
          <FontIcon />
        </ToolButton>
        <ToolButton
          label="Gradient"
          active={panel === "gradient"}
          onClick={() => toggle("gradient")}
        >
          <GradientIcon />
        </ToolButton>
        <ToolButton
          label="Decor"
          active={panel === "decor"}
          onClick={() => toggle("decor")}
        >
          <SparkleIcon />
        </ToolButton>
        <ToolButton
          label={saved ? "Saved" : "Download HD"}
          primary
          onClick={onDownload}
        >
          {saved ? <CheckIcon /> : <DownloadIcon />}
        </ToolButton>
      </div>

      {/* Tinggi tetap supaya layout tidak loncat saat panel dibuka */}
      <div className="flex h-12 w-full justify-center">
        {panel === "font" && (
          <div className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1 [scrollbar-width:none]">
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
                    : "text-ink hover:bg-white/60"
                }`}
              >
                Aa
              </button>
            ))}
          </div>
        )}
        {panel === "gradient" && (
          <div className="glass flex max-w-full items-center gap-2 overflow-x-auto rounded-full p-2 [scrollbar-width:none]">
            {GRADIENTS.map((g) => (
              <button
                key={g.id}
                type="button"
                title={g.name}
                aria-label={`Gradient ${g.name}`}
                aria-pressed={g.id === gradient.id}
                onClick={() => onGradient(g)}
                style={{ backgroundImage: toCss(g) }}
                className={`size-8 shrink-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)] transition active:scale-90 ${
                  g.id === gradient.id
                    ? "outline-2 outline-offset-2 outline-ink"
                    : ""
                }`}
              />
            ))}
          </div>
        )}
        {panel === "decor" && (
          <div className="glass flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full p-1 [scrollbar-width:none]">
            <button
              type="button"
              title="Clear decor"
              aria-label="Clear decor"
              disabled={decors.length === 0}
              onClick={onClearDecor}
              className="grid size-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-white/60 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
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
                      ? "bg-white/90 shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(0,0,0,0.15)]"
                      : "hover:bg-white/50"
                  }`}
                >
                  {d.emoji}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
