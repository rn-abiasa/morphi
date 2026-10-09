import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Tabs from "../components/Tabs";
import PfpPreview from "../components/PfpPreview";
import Controls from "../components/Controls";
import FacePreview from "../components/FacePreview";
import FaceControls from "../components/FaceControls";
import { FONTS, GRADIENTS, drawPfp, fontSpec } from "../lib/pfp";
import { toggleDecor } from "../lib/decor";
import { DEFAULT_FACE, randomFace, renderFaceCanvas } from "../lib/face";
import { DiceIcon } from "../components/Icons";

const HD_SIZE = 2048;

export default function Index() {
  const [mode, setMode] = useState("letter");

  // Tab Letter
  const [letter, setLetter] = useState("A");
  const [font, setFont] = useState(FONTS[0]);
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [decors, setDecors] = useState([]);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Tab Face
  const [face, setFace] = useState(DEFAULT_FACE);

  const [saved, setSaved] = useState(false);

  const download = async () => {
    let canvas;
    if (mode === "face") {
      canvas = await renderFaceCanvas(face, HD_SIZE);
    } else {
      try {
        await document.fonts.load(fontSpec(font, 100), letter || "A");
      } catch {
        /* pakai fallback font */
      }
      canvas = document.createElement("canvas");
      drawPfp(canvas, HD_SIZE, { letter, font, gradient, decors });
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `morpli-${mode === "face" ? "face" : letter || "pfp"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    }, "image/png");
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden="true"
        className="dots pointer-events-none fixed inset-0 -z-10"
      />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-5 py-6">
        <div className="flex items-center gap-2">
          <Tabs mode={mode} onChange={setMode} />
          {mode === "face" && (
            <button
              type="button"
              aria-label="Shuffle face"
              title="Shuffle"
              onClick={() => setFace(randomFace())}
              className="glass grid size-8 place-items-center rounded-full text-ink/70 transition hover:text-ink active:scale-90"
            >
              <DiceIcon />
            </button>
          )}
        </div>

        {mode === "letter" ? (
          <>
            <PfpPreview
              letter={letter}
              font={font}
              gradient={gradient}
              decors={decors}
              inputRef={inputRef}
              onLetterChange={setLetter}
              onFocusChange={setFocused}
            />
            <Controls
              font={font}
              gradient={gradient}
              decors={decors}
              letterFocused={focused}
              saved={saved}
              onFocusLetter={() => inputRef.current?.focus()}
              onFont={setFont}
              onGradient={setGradient}
              onDecor={(id) => setDecors((prev) => toggleDecor(prev, id))}
              onClearDecor={() => setDecors([])}
              onDownload={download}
            />
          </>
        ) : (
          <>
            <FacePreview face={face} />
            <FaceControls
              face={face}
              saved={saved}
              onChange={(patch) => setFace((f) => ({ ...f, ...patch }))}
              onDownload={download}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
