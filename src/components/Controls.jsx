import { useState } from "react";
import { FONTS, GRADIENTS, toCss } from "../lib/pfp";
import {
  CheckIcon,
  DownloadIcon,
  FontIcon,
  GradientIcon,
  TypeIcon,
} from "./Icons";

function ToolButton({ label, active, primary, onClick, children }) {
  const tone = primary
    ? "bg-ink text-white hover:bg-black"
    : active
      ? "bg-black/[0.07] text-ink"
      : "text-ink/70 hover:bg-black/[0.04] hover:text-ink";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={primary ? undefined : !!active}
      onClick={onClick}
      className={`grid size-12 place-items-center rounded-full transition duration-200 active:scale-90 ${tone}`}
    >
      {children}
    </button>
  );
}

export default function Controls({
  font,
  gradient,
  letterFocused,
  saved,
  onFocusLetter,
  onFont,
  onGradient,
  onDownload,
}) {
  const [panel, setPanel] = useState(null);
  const toggle = (id) => setPanel((p) => (p === id ? null : id));

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div
        role="toolbar"
        aria-label="PFP tools"
        className="flex items-center gap-1 rounded-full bg-white/80 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur-xl"
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
          label={saved ? "Saved" : "Download HD"}
          primary
          onClick={onDownload}
        >
          {saved ? <CheckIcon /> : <DownloadIcon />}
        </ToolButton>
      </div>

      {/* Tinggi tetap supaya layout tidak loncat saat panel dibuka */}
      <div className="flex h-[84px] w-full justify-center">
        {panel === "font" && (
          <div className="flex max-w-full items-center gap-2 overflow-x-auto p-2 [scrollbar-width:none]">
            {FONTS.map((f) => (
              <button
                key={f.id}
                type="button"
                title={f.name}
                aria-label={`Font ${f.name}`}
                aria-pressed={f.id === font.id}
                onClick={() => onFont(f)}
                style={{ fontFamily: f.family, fontWeight: f.weight }}
                className={`grid size-14 shrink-0 place-items-center rounded-2xl text-[22px] transition active:scale-95 ${
                  f.id === font.id
                    ? "bg-ink text-white"
                    : "bg-white text-ink ring-1 ring-black/10 hover:ring-black/25"
                }`}
              >
                Aa
              </button>
            ))}
          </div>
        )}
        {panel === "gradient" && (
          <div className="flex max-w-full items-center gap-3 overflow-x-auto p-3 [scrollbar-width:none]">
            {GRADIENTS.map((g) => (
              <button
                key={g.id}
                type="button"
                title={g.name}
                aria-label={`Gradient ${g.name}`}
                aria-pressed={g.id === gradient.id}
                onClick={() => onGradient(g)}
                style={{ backgroundImage: toCss(g) }}
                className={`size-10 shrink-0 rounded-full ring-1 ring-black/10 transition active:scale-90 ${
                  g.id === gradient.id
                    ? "outline-2 outline-offset-2 outline-ink"
                    : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
