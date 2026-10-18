import { useEffect, useRef } from "react";
import { TIKTOK_URL } from "../lib/site";

// Dialog setelah download. Memakai elemen <dialog> bawaan browser:
// fokus terkunci di dalamnya, Esc menutup, dan klik di luar kotak juga menutup.
export default function SupportDialog({ open, onClose }) {
  const ref = useRef(null);

  // Sinkronkan prop `open` dengan elemen <dialog>
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Tanpa link TikTok di .env, dialog tidak ditampilkan
  if (!TIKTOK_URL) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="support-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // klik di area gelap
      }}
      className="m-auto w-[min(88vw,340px)] rounded-[28px] border-0 bg-transparent p-0 text-ink backdrop:bg-black/30 backdrop:backdrop-blur-sm"
    >
      <div className="rounded-[28px] bg-paper p-6 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
        <h2
          id="support-title"
          className="text-[20px] font-semibold tracking-[-0.02em] text-ink"
        >
          Support me on TikTok
        </h2>

        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onClose}
          className="mt-5 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(0,0,0,0.5)] transition hover:bg-black active:scale-[0.98]"
        >
          Open TikTok
        </a>

        <button
          type="button"
          onClick={onClose}
          className="mt-1.5 h-10 w-full rounded-full text-[13px] font-medium text-ink/55 transition hover:text-ink"
        >
          Not now
        </button>
      </div>
    </dialog>
  );
}
