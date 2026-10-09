import { useState } from "react";
import { ToolButton } from "./Controls";
import {
  CheckIcon,
  CloseIcon,
  DetailsIcon,
  DownloadIcon,
  DropIcon,
  EyeIcon,
  GlassesIcon,
  HairIcon,
  SkinIcon,
  TuneIcon,
} from "./Icons";
import {
  ACCENTS,
  EYES,
  HAIRS,
  HAIR_COLORS,
  OPTIONS,
  SKINS,
  faceUrl,
} from "../lib/face";

const ring =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)]";
const selected = "outline-2 outline-offset-2 outline-ink";

const Divider = () => (
  <span aria-hidden="true" className="mx-0.5 h-5 w-px shrink-0 bg-black/10" />
);

// Chip berisi miniatur wajah, supaya setiap pilihan langsung terlihat hasilnya
function FaceChip({ cfg, label, active, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`size-9 shrink-0 overflow-hidden rounded-full transition active:scale-90 ${ring} ${
        active ? selected : ""
      }`}
    >
      <img
        src={faceUrl(cfg, 96)}
        alt=""
        draggable={false}
        className="size-full"
      />
    </button>
  );
}

function Swatch({ color, label, active, onClick }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      style={{ background: color }}
      className={`size-8 shrink-0 rounded-full transition active:scale-90 ${ring} ${
        active ? selected : ""
      }`}
    />
  );
}

// Pemilih warna bebas: tiap pengguna bisa punya warna yang tidak ada di pilihan lain
function CustomColor({ label, value, onChange }) {
  return (
    <label
      title={label}
      className={`relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-full transition active:scale-90 ${ring}`}
      style={{
        background:
          "conic-gradient(#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#c77dff,#ff6b6b)",
      }}
    >
      <input
        type="color"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </label>
  );
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <label className="flex w-[84px] flex-col gap-0.5 text-[10px] font-medium text-ink/50">
      {label}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-4 w-full cursor-pointer accent-[#1d1d1f]"
      />
    </label>
  );
}

export default function FaceControls({ face, saved, onChange, onDownload }) {
  const [panel, setPanel] = useState(null);
  const toggle = (id) => setPanel((p) => (p === id ? null : id));
  const row =
    "glass flex max-w-full items-center gap-2 overflow-x-auto rounded-full p-2 [scrollbar-width:none]";

  const chips = (key) =>
    OPTIONS[key].map((v) => (
      <FaceChip
        key={v}
        cfg={{ ...face, [key]: v }}
        label={`${key} ${v}`}
        active={face[key] === v}
        onClick={() => onChange({ [key]: v })}
      />
    ));

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3">
      <div
        role="toolbar"
        aria-label="Face tools"
        className="glass flex items-center gap-0.5 rounded-full p-1"
      >
        {[
          ["skin", "Skin", SkinIcon],
          ["eyes", "Eyes", EyeIcon],
          ["hair", "Hair style", HairIcon],
          ["color", "Hair color", DropIcon],
          ["details", "Details", DetailsIcon],
          ["extras", "Accessories", GlassesIcon],
          ["tune", "Fine tune", TuneIcon],
        ].map(([id, label, Icon]) => (
          <ToolButton
            key={id}
            compact
            label={label}
            active={panel === id}
            onClick={() => toggle(id)}
          >
            <Icon />
          </ToolButton>
        ))}
        <ToolButton
          compact
          primary
          label={saved ? "Saved" : "Download HD"}
          onClick={onDownload}
        >
          {saved ? <CheckIcon /> : <DownloadIcon />}
        </ToolButton>
      </div>

      <div className="flex h-[60px] w-full justify-center">
        {panel === "skin" && (
          <div className={row}>
            {SKINS.map((c) => (
              <Swatch
                key={c}
                color={c}
                label={`Skin ${c}`}
                active={face.skin === c}
                onClick={() => onChange({ skin: c })}
              />
            ))}
            <Divider />
            <CustomColor
              label="Custom skin color"
              value={face.skin}
              onChange={(skin) => onChange({ skin })}
            />
          </div>
        )}

        {panel === "eyes" && (
          <div className={row}>
            {EYES.map((e) => (
              <FaceChip
                key={e.id}
                cfg={{ ...face, eyes: e.id }}
                label={`Eyes ${e.id}`}
                active={face.eyes === e.id}
                onClick={() => onChange({ eyes: e.id })}
              />
            ))}
          </div>
        )}

        {panel === "hair" && (
          <div className={row}>
            {HAIRS.map((h) => (
              <FaceChip
                key={h.id}
                cfg={{ ...face, hair: h.id }}
                label={`Hair ${h.id}`}
                active={face.hair === h.id}
                onClick={() => onChange({ hair: h.id })}
              />
            ))}
          </div>
        )}

        {panel === "color" && (
          <div className={row}>
            {HAIR_COLORS.map((c) => (
              <Swatch
                key={c}
                color={c}
                label={`Hair color ${c}`}
                active={face.hairColor === c}
                onClick={() => onChange({ hairColor: c })}
              />
            ))}
            <CustomColor
              label="Custom hair color"
              value={face.hairColor}
              onChange={(hairColor) => onChange({ hairColor })}
            />
            <Divider />
            <button
              type="button"
              title="No streak"
              aria-label="No streak"
              aria-pressed={!face.streak}
              onClick={() => onChange({ streak: null })}
              className={`grid size-8 shrink-0 place-items-center rounded-full bg-white/70 text-ink/60 transition active:scale-90 ${ring} ${
                !face.streak ? selected : ""
              }`}
            >
              <CloseIcon />
            </button>
            {ACCENTS.slice(0, 6).map((c) => (
              <Swatch
                key={c}
                color={c}
                label={`Streak ${c}`}
                active={face.streak === c}
                onClick={() => onChange({ streak: c })}
              />
            ))}
            <CustomColor
              label="Custom streak color"
              value={face.streak || "#ff6fa5"}
              onChange={(streak) => onChange({ streak })}
            />
          </div>
        )}

        {panel === "details" && (
          <div className={row}>
            {chips("mouth")}
            <Divider />
            {chips("brows")}
            <Divider />
            {chips("blush")}
            <Divider />
            {chips("marks")}
          </div>
        )}

        {panel === "extras" && (
          <div className={row}>
            {chips("glasses")}
            <Divider />
            {chips("head")}
            <Divider />
            {ACCENTS.map((c) => (
              <Swatch
                key={c}
                color={c}
                label={`Accent ${c}`}
                active={face.accent === c}
                onClick={() => onChange({ accent: c })}
              />
            ))}
            <CustomColor
              label="Custom accent color"
              value={face.accent}
              onChange={(accent) => onChange({ accent })}
            />
          </div>
        )}

        {panel === "tune" && (
          <div className="glass flex items-center gap-4 rounded-full px-5 py-1.5">
            <Slider
              label="Spacing"
              min={-1}
              max={1}
              step={0.01}
              value={face.spacing}
              onChange={(spacing) => onChange({ spacing })}
            />
            <Slider
              label="Height"
              min={-1}
              max={1}
              step={0.01}
              value={face.eyeY}
              onChange={(eyeY) => onChange({ eyeY })}
            />
            <Slider
              label="Size"
              min={0.8}
              max={1.25}
              step={0.01}
              value={face.eyeSize}
              onChange={(eyeSize) => onChange({ eyeSize })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
