import { useEffect, useRef } from "react";
import { TIKTOK_URL } from "../lib/site";

// Post-download dialog on the native <dialog> (focus trap and Esc come for free;
// backdrop clicks are handled below).
export default function SupportDialog({ open, onClose }) {
  const ref = useRef(null);

  // Sync the `open` prop with the dialog element
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // No TIKTOK_URL configured: render nothing
  if (!TIKTOK_URL) return null;

  return (
    <dialog
      ref={ref}
      aria-labelledby="support-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // backdrop click
      }}
      className="m-auto w-[min(88vw,340px)] rounded-[28px] border-0 bg-transparent p-0 text-ink backdrop:bg-black/30 dark:backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="rounded-[28px] bg-paper dark:bg-surface p-6 text-center shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/10">
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
          className="mt-5 flex h-12 items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_24px_-8px_rgba(0,0,0,0.7)] transition hover:bg-black dark:hover:bg-white/20 dark:text-black dark:hover:text-white active:scale-[0.98]"
        >
          Open TikTok
        </a>

        <button
          type="button"
          onClick={onClose}
          className="mt-1.5 h-10 w-full rounded-full text-[13px] font-medium text-ink/55 dark:text-ink/70 transition hover:text-ink"
        >
          Not now
        </button>
      </div>
    </dialog>
  );
}
