import Bezel from "./Bezel";
import { faceId, faceUrl } from "../lib/face";
import { formatTop, rarityInfo } from "../lib/rarity";

export default function FacePreview({ face, onToggleFoil }) {
  const info = rarityInfo(face);
  const foilable = info.tier === "epic" || info.tier === "legendary";
  const foilOn = face.foil !== false;
  const tier = foilable && foilOn ? info.tier : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <Bezel glow={face.hairColor}>
        <img
          src={faceUrl({ ...face, tier }, 720)}
          alt="Face avatar preview"
          draggable={false}
          className="absolute inset-0 size-full select-none"
        />
      </Bezel>

      <div className="flex flex-col items-center gap-1.5">
        <p className="text-[11px] font-medium tracking-[0.14em] text-ink/40">
          FACE ID · {faceId(face)}
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="glass inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold"
            style={{ color: info.color }}
            title="Peringkat kelangkaan dibanding wajah yang diacak"
          >
            ◆ {info.label} · Top {formatTop(info.top)}%
          </span>
          {foilable && (
            <button
              type="button"
              aria-pressed={foilOn}
              onClick={onToggleFoil}
              className="glass inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium text-ink/60 transition hover:text-ink active:scale-95"
            >
              Foil {foilOn ? "on" : "off"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
