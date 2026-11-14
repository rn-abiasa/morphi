import { useState } from "react";
import { DECORS, PALETTES, SHAPES, SWATCHES } from "../lib/avatar";
import { ToolButton } from "./Controls";
import {
  BackdropIcon,
  CheckIcon,
  CloseIcon,
  DownloadIcon,
  FigureIcon,
  PaletteIcon,
  ShapeIcon,
  SparkleIcon,
} from "./Icons";

const PANEL =
  "bg-gray-50 border border-gray-200 max-w-full rounded-3xl dark:bg-surface dark:border-border";
const SELECTED = "outline-2 outline-offset-2 outline-ink";
const ON_TILE =
  "bg-white/20 shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(255,255,255,0.1)] dark:bg-white/30 dark:shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(255,255,255,0.05)]";
const RING =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_0_0.5px_rgba(255,255,255,0.1)]";

// Decor icons use a neutral stand-in for "figure"-colored parts (ears)
const NEUTRAL = "#b4b4bc";
const tone = (c) => (c === "figure" ? NEUTRAL : c);

function DecorSvg({ shapes }) {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      {shapes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          transform={s.rot ? `rotate(${s.rot} 50 50)` : undefined}
          fill={s.fill ? tone(s.fill) : "none"}
          stroke={s.stroke ? tone(s.stroke) : "none"}
          strokeWidth={s.w ?? 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={s.op ?? 1}
        />
      ))}
    </svg>
  );
}

// Round tile showing a silhouette on a background, built from the same path data as the canvas
function MiniAvatar({ bg, figure, shape }) {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden="true">
      <rect width="100" height="100" fill={bg} />
      <path d={shape.body} fill={figure} />
      <path d={shape.head} fill={figure} />
    </svg>
  );
}

function SwatchPanel({ label, value, onPick }) {
  const isCustom = !SWATCHES.includes(value.toLowerCase());
  return (
    <div
      className={`${PANEL} grid h-28 grid-cols-8 items-center gap-3 p-4`}
      role="group"
      aria-label={label}
    >
      {SWATCHES.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={`${label} ${c}`}
          aria-pressed={c === value.toLowerCase()}
          onClick={() => onPick(c)}
          style={{ backgroundColor: c }}
          className={`size-8 shrink-0 rounded-full transition active:scale-90 ${RING} ${
            c === value.toLowerCase() ? SELECTED : ""
          }`}
        />
      ))}
      <label
        title="Custom color"
        style={{
          backgroundImage:
            "conic-gradient(from 0deg, #ff6b6b, #ffd36b, #6bff9a, #6bcfff, #a86bff, #ff6bc8, #ff6b6b)",
        }}
        className={`relative size-8 shrink-0 rounded-full transition active:scale-90 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ink ${RING} ${
          isCustom ? SELECTED : ""
        }`}
      >
        <input
          type="color"
          value={value}
          aria-label={`Custom ${label.toLowerCase()}`}
          onChange={(e) => onPick(e.target.value)}
          className="absolute inset-0 size-full opacity-0"
        />
      </label>
    </div>
  );
}

export default function AvatarControls({
  avatar,
  saved,
  onChange,
  onToggleDecor,
  onClearDecor,
  onDownload,
}) {
  const [panel, setPanel] = useState(null);
  const toggle = (id) => setPanel((p) => (p === id ? null : id));

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div
        role="toolbar"
        aria-label="Avatar tools"
        className="bg-gray-50 border border-gray-200 flex items-center gap-0.5 rounded-full p-1 dark:bg-surface dark:border-border"
      >
        <ToolButton
          label="Palette"
          active={panel === "palette"}
          onClick={() => toggle("palette")}
        >
          <PaletteIcon />
        </ToolButton>
        <ToolButton
          label="Background"
          active={panel === "bg"}
          onClick={() => toggle("bg")}
        >
          <BackdropIcon />
        </ToolButton>
        <ToolButton
          label="Figure color"
          active={panel === "figure"}
          onClick={() => toggle("figure")}
        >
          <FigureIcon />
        </ToolButton>
        <ToolButton
          label="Shape"
          active={panel === "shape"}
          onClick={() => toggle("shape")}
        >
          <ShapeIcon />
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

      {/* Fixed height so the layout doesn't jump when a panel opens */}
      <div className="flex h-12 w-full justify-center mb-5">
        {panel === "palette" && (
          <div
            className={`${PANEL} flex h-24 items-center gap-2 overflow-x-auto p-3 [scrollbar-width:none]`}
          >
            {PALETTES.map((p) => {
              const on = p.bg === avatar.bg && p.figure === avatar.figure;
              return (
                <button
                  key={p.id}
                  type="button"
                  title={p.name}
                  aria-label={`Palette ${p.name}`}
                  aria-pressed={on}
                  onClick={() => onChange({ bg: p.bg, figure: p.figure })}
                  className={`size-11 shrink-0 overflow-hidden rounded-full transition active:scale-90 ${RING} ${
                    on ? SELECTED : ""
                  }`}
                >
                  <MiniAvatar bg={p.bg} figure={p.figure} shape={SHAPES[0]} />
                </button>
              );
            })}
          </div>
        )}
        {panel === "bg" && (
          <SwatchPanel
            label="Background"
            value={avatar.bg}
            onPick={(bg) => onChange({ bg })}
          />
        )}
        {panel === "figure" && (
          <SwatchPanel
            label="Figure"
            value={avatar.figure}
            onPick={(figure) => onChange({ figure })}
          />
        )}
        {panel === "shape" && (
          <div
            className={`${PANEL} flex h-24 items-center gap-2 overflow-x-auto p-3 [scrollbar-width:none]`}
          >
            {SHAPES.map((s) => {
              const on = s.id === avatar.shape;
              return (
                <button
                  key={s.id}
                  type="button"
                  title={s.name}
                  aria-label={`Shape ${s.name}`}
                  aria-pressed={on}
                  onClick={() => onChange({ shape: s.id })}
                  className={`size-12 shrink-0 overflow-hidden rounded-full transition active:scale-90 ${RING} ${
                    on ? SELECTED : ""
                  }`}
                >
                  <MiniAvatar bg={avatar.bg} figure={avatar.figure} shape={s} />
                </button>
              );
            })}
          </div>
        )}
        {panel === "decor" && (
          <div
            className={`${PANEL} grid h-24 grid-cols-7 items-center gap-0.5 overflow-x-auto p-1 [scrollbar-width:none]`}
          >
            <button
              type="button"
              title="Clear decor"
              aria-label="Clear decor"
              disabled={avatar.decors.length === 0}
              onClick={onClearDecor}
              className="grid size-10 shrink-0 place-items-center rounded-full text-ink/60 transition hover:bg-white/60 dark:hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <CloseIcon />
            </button>
            {DECORS.map((d) => {
              const on = avatar.decors.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  title={d.name}
                  aria-label={`Decor ${d.name}`}
                  aria-pressed={on}
                  onClick={() => onToggleDecor(d.id)}
                  className={`grid size-10 shrink-0 place-items-center rounded-full p-2 transition active:scale-90 ${
                    on ? ON_TILE : "hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                >
                  <DecorSvg shapes={d.shapes} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
