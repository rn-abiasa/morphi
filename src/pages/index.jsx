import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PfpPreview from "../components/PfpPreview";
import Controls from "../components/Controls";
import SupportDialog from "../components/SupportDialog";
import { FONTS, GRADIENTS, drawPfp, fontSpec } from "../lib/pfp";
import { toggleDecor } from "../lib/decor";
import { HD_SIZE, hashId, saveCanvas } from "../lib/save";

export default function Index() {
  const [letter, setLetter] = useState("A");
  const [font, setFont] = useState(FONTS[0]);
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [decors, setDecors] = useState([]);
  const [focused, setFocused] = useState(false);
  const [saved, setSaved] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const inputRef = useRef(null);

  const download = async () => {
    try {
      await document.fonts.load(fontSpec(font, 100), letter || "A");
    } catch {
      /* pakai fallback font */
    }
    const canvas = document.createElement("canvas");
    drawPfp(canvas, HD_SIZE, { letter, font, gradient, decors });
    // contoh nama file: morpli-letter-A-7B21D4.png
    const safe = (letter || "").replace(/[^\p{L}\p{N}]/gu, "") || "pfp";
    await saveCanvas(
      canvas,
      `morpli-letter-${safe}-${hashId([letter, font.id, gradient.id, decors])}`,
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
    // beri jeda agar konfirmasi "Saved" terlihat dulu sebelum dialog muncul
    setTimeout(() => setSupportOpen(true), 600);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <title>Morpli | Letter PFP maker</title>
      <div
        aria-hidden="true"
        className="dots pointer-events-none fixed inset-0 -z-10"
      />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-5 py-6">
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
      </main>
      <Footer />
      <SupportDialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
      />
    </div>
  );
}
