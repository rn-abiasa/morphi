import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PfpPreview from "../components/PfpPreview";
import Controls from "../components/Controls";
import { FONTS, GRADIENTS, drawPfp, fontSpec } from "../lib/pfp";

const HD_SIZE = 2048;

export default function Index() {
  const [letter, setLetter] = useState("A");
  const [font, setFont] = useState(FONTS[0]);
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [focused, setFocused] = useState(false);
  const [saved, setSaved] = useState(false);
  const inputRef = useRef(null);

  const download = async () => {
    try {
      await document.fonts.load(fontSpec(font, 100), letter || "A");
    } catch {
      /* pakai fallback font */
    }
    const canvas = document.createElement("canvas");
    drawPfp(canvas, HD_SIZE, { letter, font, gradient });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `morphi-${letter || "pfp"}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    }, "image/png");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-5 py-8">
        <PfpPreview
          letter={letter}
          font={font}
          gradient={gradient}
          inputRef={inputRef}
          onLetterChange={setLetter}
          onFocusChange={setFocused}
        />
        <Controls
          font={font}
          gradient={gradient}
          letterFocused={focused}
          saved={saved}
          onFocusLetter={() => inputRef.current?.focus()}
          onFont={setFont}
          onGradient={setGradient}
          onDownload={download}
        />
      </main>
      <Footer />
    </div>
  );
}
