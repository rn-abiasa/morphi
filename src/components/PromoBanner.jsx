import { useEffect, useState } from "react";
import { PROMO } from "../lib/site";
import { ChevronIcon } from "./Icons";

// Tag outbound links so clicks show up in the target site's analytics
function withUtm(href) {
  try {
    const u = new URL(href);
    u.searchParams.set("utm_source", "morpli");
    u.searchParams.set("utm_medium", "banner");
    return u.toString();
  } catch {
    return href;
  }
}

// Rotating crossfade banner; renders nothing without PROMO.url.
// The gradient layer underneath is the fallback when images are missing or fail to load.
export default function PromoBanner() {
  const images = PROMO.images;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    // prefers-reduced-motion: stay on the first image
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex((n) => (n + 1) % images.length);
    }, PROMO.interval);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  if (!PROMO.url) return null;

  return (
    <a
      href={withUtm(PROMO.url)}
      target="_blank"
      rel="noopener"
      aria-label={`${PROMO.title}. ${PROMO.text}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="group relative isolate block h-[76px] w-52 mt-10 overflow-hidden rounded-[20px] shadow-[0_0_0_0.5px_rgba(0,0,0,0.1),0_8px_24px_-12px_rgba(0,0,0,0.35)] transition active:scale-[0.985]"
    >
      {/* Images are stacked; only the active one has opacity 1 */}
      <div
        aria-hidden="true"
        style={{ backgroundImage: "linear-gradient(120deg, #ff8fb0, #ffb86b)" }}
        className="absolute inset-0 -z-20 transition-transform duration-500 ease-out group-hover:scale-105"
      >
        {images.map((src, n) => (
          <div
            key={n}
            style={{ backgroundImage: `url("${src}")` }}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-in-out ${
              n === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      {/* Dark scrim behind the text for contrast on any image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-black/70 dark:from-black/90 via-black/35 dark:via-black/60 to-transparent"
      />
      <div className="flex h-full items-center justify-between gap-3 pl-4 pr-3.5 text-white">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-[-0.02em]">
            {PROMO.title}
          </p>
          <p className="truncate text-[11.5px] text-white/80">{PROMO.text}</p>
        </div>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur-md transition group-hover:bg-white/40">
          <ChevronIcon />
        </span>
      </div>
      {images.length > 1 && (
        <div
          aria-hidden="true"
          className="absolute bottom-1.5 right-3.5 flex w-8 justify-center gap-1"
        >
          {images.map((_, n) => (
            <span
              key={n}
              className={`h-1 rounded-full bg-white transition-all duration-500 ${
                n === index ? "w-2.5 opacity-100" : "w-1 opacity-50"
              }`}
            />
          ))}
        </div>
      )}
    </a>
  );
}
