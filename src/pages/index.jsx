import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import ThemeButton from "../components/ThemeButton";
import ModeTabs from "../components/ModeTabs";
import PromoBanner from "../components/PromoBanner";
import Footer from "../components/Footer";
import PfpPreview from "../components/PfpPreview";
import Controls from "../components/Controls";
import AvatarPreview from "../components/AvatarPreview";
import AvatarControls from "../components/AvatarControls";
import SupportDialog from "../components/SupportDialog";
import { FONTS, GRADIENTS, drawPfp, fontSpec } from "../lib/pfp";
import { toggleDecor } from "../lib/decor";
import { toggleBurst } from "../lib/burst";
import { DEFAULT_EFFECT } from "../lib/effects";
import { DEFAULT_AVATAR, drawAvatar, toggleAvatarDecor } from "../lib/avatar";
import { HD_SIZE, hashId, saveCanvas } from "../lib/save";

export default function Index() {
  const [mode, setMode] = useState("letter");
  const [letter, setLetter] = useState("A");
  const [font, setFont] = useState(FONTS[0]);
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [decors, setDecors] = useState([]);
  const [effect, setEffect] = useState(DEFAULT_EFFECT);
  const [bursts, setBursts] = useState([]);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [focused, setFocused] = useState(false);
  const [saved, setSaved] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const inputRef = useRef(null);

  const patchAvatar = (patch) => setAvatar((prev) => ({ ...prev, ...patch }));

  const changeMode = (next) => {
    setMode(next);
    setFocused(false); // the letter input unmounts with its preview
  };

  const download = async () => {
    const canvas = document.createElement("canvas");
    let name;
    let info;

    if (mode === "avatar") {
      drawAvatar(canvas, HD_SIZE, avatar);
      name = `morpli-avatar-${hashId(avatar)}`;
      info = { letter: "avatar", font: avatar.shape, gradient: "avatar" };
    } else {
      try {
        await document.fonts.load(fontSpec(font, 100), letter || "A");
      } catch {
        /* fall back to the default font */
      }
      drawPfp(canvas, HD_SIZE, {
        letter,
        font,
        gradient,
        decors,
        effect,
        bursts,
      });
      // file name looks like morpli-letter-A-7B21D4.png
      const safe = (letter || "").replace(/[^\p{L}\p{N}]/gu, "") || "pfp";
      name = `morpli-letter-${safe}-${hashId([letter, font.id, gradient.id, decors, effect, bursts])}`;
      info = { letter, font: font.id, gradient: gradient.id };
    }

    await saveCanvas(canvas, name);
    // Discord notification: fire-and-forget, a failure must not block the download
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
      keepalive: true,
    }).catch(() => {});
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
    // delay so the "Saved" state is visible before the dialog opens
    setTimeout(() => setSupportOpen(true), 600);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <title>{`Morpli | ${mode === "avatar" ? "Avatar" : "Letter"} PFP maker`}</title>
      <div
        aria-hidden="true"
        className="dots pointer-events-none fixed inset-0 -z-10"
      />
      <Navbar />
      <ThemeButton />
      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-5 py-6">
        <ModeTabs mode={mode} onChange={changeMode} />
        {mode === "letter" ? (
          <>
            <PfpPreview
              letter={letter}
              font={font}
              gradient={gradient}
              decors={decors}
              effect={effect}
              bursts={bursts}
              inputRef={inputRef}
              onLetterChange={setLetter}
              onFocusChange={setFocused}
            />
            <Controls
              font={font}
              gradient={gradient}
              decors={decors}
              effect={effect}
              bursts={bursts}
              letterFocused={focused}
              saved={saved}
              onFocusLetter={() => inputRef.current?.focus()}
              onFont={setFont}
              onGradient={setGradient}
              onDecor={(id) => setDecors((prev) => toggleDecor(prev, id))}
              onClearDecor={() => setDecors([])}
              onEffect={setEffect}
              onBurst={(id) => setBursts((prev) => toggleBurst(prev, id))}
              onClearBurst={() => setBursts([])}
              onDownload={download}
            />
          </>
        ) : (
          <>
            <AvatarPreview
              bg={avatar.bg}
              figure={avatar.figure}
              shape={avatar.shape}
              decors={avatar.decors}
            />
            <AvatarControls
              avatar={avatar}
              saved={saved}
              onChange={patchAvatar}
              onToggleDecor={(id) =>
                patchAvatar({ decors: toggleAvatarDecor(avatar.decors, id) })
              }
              onClearDecor={() => patchAvatar({ decors: [] })}
              onDownload={download}
            />
          </>
        )}
        <PromoBanner />
      </main>
      <Footer />
      <SupportDialog open={supportOpen} onClose={() => setSupportOpen(false)} />
    </div>
  );
}
