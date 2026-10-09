import Bezel from "./Bezel";
import { faceId, faceUrl } from "../lib/face";

export default function FacePreview({ face }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <Bezel glow={face.hairColor}>
        <img
          src={faceUrl(face, 720)}
          alt="Face avatar preview"
          draggable={false}
          className="absolute inset-0 size-full select-none"
        />
      </Bezel>
      <p className="text-[11px] font-medium tracking-[0.14em] text-ink/40">
        FACE ID · {faceId(face)}
      </p>
    </div>
  );
}
