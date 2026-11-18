import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "./Icons";

// JOKE-PAYWALL: "day 1 monetization" gag for a video. Not meant for production.
// Disable: set JOKE_PAYWALL_ENABLED to false (Download then works as before).
// Remove: delete this file, then delete the lines marked JOKE-PAYWALL in src/pages/index.jsx
// and rename `runDownload` back to `download` there.
export const JOKE_PAYWALL_ENABLED = true;

const PERKS = [
  "Download your own profile picture",
  "HD export, 4028 × 4028 px",
  "Priority access to the Download button",
  "The same tool you used five minutes ago",
];

const CTA = {
  offer: "Subscribe",
  charging: "Charging your card...",
  done: "Payment received. Just kidding.",
};

export default function JokePaywall({ open, onClose, onConfirm }) {
  const ref = useRef(null);
  const timers = useRef([]);
  const [phase, setPhase] = useState("offer"); // offer -> charging -> done

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  // Sync the `open` prop with the dialog element
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => clearTimers, []);

  const close = () => {
    clearTimers();
    setPhase("offer");
    onClose();
  };

  const subscribe = () => {
    setPhase("charging");
    later(() => setPhase("done"), 1800);
    later(() => {
      close();
      onConfirm();
    }, 3200);
  };

  const payInExposure = () => {
    close();
    onConfirm();
  };

  const busy = phase !== "offer";

  return (
    <dialog
      ref={ref}
      aria-labelledby="paywall-title"
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current && !busy) close(); // backdrop click
      }}
      className="m-auto w-[min(90vw,370px)] rounded-[28px] border-0 bg-transparent p-0 text-ink backdrop:bg-black/30 dark:backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="rounded-[28px] bg-paper dark:bg-surface p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5 dark:ring-white/10">
        <h2
          id="paywall-title"
          className="text-[17px] font-semibold tracking-[-0.02em] text-ink/70"
        >
          Morpli Pro
        </h2>

        <p className="mt-1 flex items-baseline gap-1.5 text-ink">
          <span className="text-[48px] font-semibold leading-none tracking-[-0.04em]">
            $1,000
          </span>
          <span className="text-[15px] text-ink/55">/ month</span>
        </p>

        <ul className="mt-5 flex flex-col gap-2.5">
          {PERKS.map((perk) => (
            <li
              key={perk}
              className="flex items-start gap-2.5 text-[14px] leading-snug text-ink"
            >
              <span className="mt-px shrink-0 text-ink/70">
                <CheckIcon />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={subscribe}
          disabled={busy}
          aria-live="polite"
          className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-ink text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_-8px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_24px_-8px_rgba(0,0,0,0.7)] transition hover:bg-black dark:hover:bg-white/20 dark:text-white dark:hover:text-white active:scale-[0.98] disabled:pointer-events-none"
        >
          {CTA[phase]}
        </button>

        <button
          type="button"
          onClick={payInExposure}
          disabled={busy}
          className="mt-1.5 h-10 w-full rounded-full text-[13px] font-medium text-ink/55 dark:text-ink/70 transition hover:text-ink disabled:opacity-0"
        >
          Pay in exposure
        </button>

        <p className="mt-1 text-center text-[11px] text-ink/45">
          Billed monthly. Cancel anytime*{" "}
          <span className="whitespace-nowrap">*you can&apos;t</span>
        </p>
      </div>
    </dialog>
  );
}
