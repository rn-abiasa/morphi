import { useEffect, useRef } from "react";
import { drawPfp, fontSpec } from "../lib/pfp";

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
    <div
      className="relative aspect-square w-[min(72vw,320px)] overflow-hidden rounded-full transition-shadow duration-500 focus-within:ring-[6px] focus-within:ring-black/[0.06] sm:w-[340px]"
      style={{
        containerType: "inline-size",
        boxShadow: `0 40px 70px -28px ${gradient.stops[0][1]}88`,
      }}
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
          onLetterChange(Array.from(e.target.value.toUpperCase()).slice(0, 2).join(""))
        }
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onFocusCapture={(e) => e.target.select()}
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
  );
}
