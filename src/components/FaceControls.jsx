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
  FrameIcon,
  HairIcon,
  SceneIcon,
  PropIcon,
  ShirtIcon,
  SkinIcon,
  TuneIcon,
} from "./Icons";
import {
  ACCENTS,
  BACKGROUNDS,
  EYES,
  HAIRS,
  HAIR_COLORS,
  OPTIONS,
  OUTFITS,
  OUTFIT_COLORS,
  SKINS,
  bgUrl,
  faceUrl,
} from "../lib/face";

const ring =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_0_0.5px_rgba(0,0,0,0.15)]";
const selected = "outline-2 outline-offset-2 outline-ink";

// Ikon emoji hanya untuk tombol pilihan di UI (hasil gambar memakai SVG sendiri)
const PROP_ICONS = { mug: "🍵", boba: "🧋", cat: "🐱", plush: "🧸" };
const FX_ICONS = { sparkle: "✨", hearts: "💗", snow: "❄️", petals: "🌸" };

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
    <label className="flex w-[84px] shrink-0 flex-col gap-0.5 text-[10px] font-medium text-ink/50">
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
  const portrait = face.frame === "portrait";
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
      </div>

      <div
        role="toolbar"
        aria-label="Scene tools"
        className="glass flex items-center gap-0.5 rounded-full p-1"
      >
        <ToolButton
          compact
          label="Frame"
          active={panel === "frame"}
          onClick={() => toggle("frame")}
        >
          <FrameIcon />
        </ToolButton>
        <ToolButton
          compact
          label={portrait ? "Background" : "Background (Portrait only)"}
          disabled={!portrait}
          active={panel === "bg"}
          onClick={() => toggle("bg")}
        >
          <SceneIcon />
        </ToolButton>
        <ToolButton
          compact
          label={portrait ? "Outfit" : "Outfit (Portrait only)"}
          disabled={!portrait}
          active={panel === "outfit"}
          onClick={() => toggle("outfit")}
        >
          <ShirtIcon />
        </ToolButton>
        <ToolButton
          compact
          label={portrait ? "Props & effects" : "Props & effects (Portrait only)"}
          disabled={!portrait}
          active={panel === "props"}
          onClick={() => toggle("props")}
        >
          <PropIcon />
        </ToolButton>
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

        {panel === "frame" && (
          <div className={row}>
            {[
              ["closeup", "Close-up"],
              ["portrait", "Portrait"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={face.frame === id}
                onClick={() => onChange({ frame: id })}
                className={`h-8 shrink-0 rounded-full px-4 text-[12px] font-medium transition active:scale-95 ${
                  face.frame === id
                    ? "bg-ink text-white"
                    : "text-ink/70 hover:bg-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {panel === "bg" && portrait && (
          <div className={row}>
            {BACKGROUNDS.map((b) => (
              <button
                key={b}
                type="button"
                title={b}
                aria-label={`Background ${b}`}
                aria-pressed={face.bg === b}
                onClick={() => onChange({ bg: b })}
                className={`size-9 shrink-0 overflow-hidden rounded-full transition active:scale-90 ${ring} ${
                  face.bg === b ? selected : ""
                }`}
              >
                <img
                  src={bgUrl(b, face.bgColor)}
                  alt=""
                  draggable={false}
                  className="size-full"
                />
              </button>
            ))}
            <Divider />
            <CustomColor
              label="Custom background color"
              value={face.bgColor}
              onChange={(bgColor) => onChange({ bgColor, bg: "solid" })}
            />
          </div>
        )}

        {panel === "outfit" && portrait && (
          <div className={row}>
            {OUTFITS.map((o) => (
              <button
                key={o}
                type="button"
                title={o}
                aria-label={`Outfit ${o}`}
                aria-pressed={face.outfit === o}
                onClick={() => onChange({ outfit: o })}
                className={`size-9 shrink-0 overflow-hidden rounded-full bg-white/70 transition active:scale-90 ${ring} ${
                  face.outfit === o ? selected : ""
                }`}
              >
                <img
                  src={faceUrl({ ...face, outfit: o, preview: true }, 96, "44 104 168 168")}
                  alt=""
                  draggable={false}
                  className="size-full"
                />
              </button>
            ))}
            <Divider />
            {OUTFIT_COLORS.map((c) => (
              <Swatch
                key={c}
                color={c}
                label={`Outfit color ${c}`}
                active={face.outfitColor === c}
                onClick={() => onChange({ outfitColor: c })}
              />
            ))}
            <CustomColor
              label="Custom outfit color"
              value={face.outfitColor}
              onChange={(outfitColor) => onChange({ outfitColor })}
            />
          </div>
        )}

        {panel === "props" && portrait && (
          <div className={row}>
            {[
              ["prop", OPTIONS.prop, PROP_ICONS],
              ["fx", OPTIONS.fx, FX_ICONS],
            ].map(([key, list, icons], i) => (
              <div key={key} className="flex items-center gap-1">
                {i > 0 && <Divider />}
                {list.map((v) => {
                  const on = face[key] === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      title={`${key} ${v}`}
                      aria-label={`${key} ${v}`}
                      aria-pressed={on}
                      onClick={() => onChange({ [key]: v })}
                      className={`grid size-9 shrink-0 place-items-center rounded-full text-[18px] leading-none transition active:scale-90 ${
                        on
                          ? "bg-white/90 shadow-[inset_0_1px_0_#fff,0_1px_4px_rgba(0,0,0,0.15)]"
                          : "hover:bg-white/50"
                      }`}
                    >
                      {icons[v] ?? <CloseIcon />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {panel === "tune" && (
          <div className="glass flex max-w-full items-center gap-4 overflow-x-auto rounded-full px-5 py-1.5 [scrollbar-width:none]">
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
            {portrait && (
              <>
                <Slider
                  label="Round"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={face.round}
                  onChange={(round) => onChange({ round })}
                />
                <Slider
                  label="Tilt"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={face.tilt}
                  onChange={(tilt) => onChange({ tilt })}
                />
                <Slider
                  label="Shift"
                  min={-1}
                  max={1}
                  step={0.01}
                  value={face.shift}
                  onChange={(shift) => onChange({ shift })}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
