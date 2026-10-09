import { useEffect, useRef } from "react";
import { drawPfp, fontSpec, toCss } from "../lib/pfp";

const PREVIEW_SIZE = 720;

export default function PfpPreview({
  letter,
  font,
  gradient,
  inputRef,
  onLetterChange,
  onFocusChange,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await document.fonts.load(fontSpec(font, 100), letter || "A");
      } catch {
        /* pakai fallback font */
      }
      if (!cancelled && canvasRef.current) {
        drawPfp(canvasRef.current, PREVIEW_SIZE, { letter, font, gradient });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [letter, font, gradient]);

  return (
    <div className="relative w-[min(56vw,232px)] sm:w-[248px]">
      {/* Cahaya warna gradient di belakang kaca, supaya efek blur terlihat */}
      <div
        aria-hidden="true"
        className="absolute -inset-[22%] rounded-full opacity-35 blur-3xl transition-all duration-500"
        style={{ backgroundImage: toCss(gradient) }}
      />
      <div className="glass relative aspect-square rounded-full p-2 outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-200 focus-within:outline-[#0071e3]/50">
        <div
          className="relative size-full overflow-hidden rounded-full"
          style={{ containerType: "inline-size" }}
        >
          <canvas
            ref={canvasRef}
            width={PREVIEW_SIZE}
            height={PREVIEW_SIZE}
            className="absolute inset-0 size-full"
            role="img"
            aria-label={`Preview: letter ${letter || "none"}`}
          />
          <input
            ref={inputRef}
            value={letter}
            onChange={(e) =>
              onLetterChange(
                Array.from(e.target.value.toUpperCase()).slice(0, 2).join(""),
              )
            }
            onFocus={(e) => {
              e.target.select();
              onFocusChange(true);
            }}
            onBlur={() => onFocusChange(false)}
            aria-label="Initial letter"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="done"
            className="absolute inset-0 size-full cursor-text bg-transparent text-center text-transparent outline-none selection:bg-white/25"
            style={{
              fontFamily: font.family,
              fontWeight: font.weight,
              fontSize: "46cqw",
              caretColor: gradient.ink || "#fff",
            }}
          />
        </div>
      </div>
    </div>
  );
}
