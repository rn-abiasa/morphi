import { COPYRIGHT_OWNER, SOCIALS } from "../lib/site";
import { Rainvely } from "rainvely";

export default function Footer() {
  return (
    <footer className=" dark:border-gray-50/10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 text-center text-[11px] text-ink/45 dark:text-ink/60">
      {/* <Rainvely variant="storm" color="#93c5fd" /> */}
      <p>
        Build with ❤️ by{" "}
        <a
          href="https://rehanabiasa.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="abiasa on TikTok"
          className="relative inline-block"
        >
          abiasa
          {/* Pixel-art speech bubble: 2px stepped border via box-shadow, stair-step tail via SVG rects */}
          <span
            aria-hidden="true"
            className="pixel-bubble pointer-events-none absolute bottom-full left-1/2 mb-2 select-none whitespace-nowrap bg-surface px-2.5 py-1.5 font-['Press_Start_2P'] text-[8px] leading-none text-ink shadow-[0_-2px_0_0_currentColor,0_2px_0_0_currentColor,-2px_0_0_0_currentColor,2px_0_0_0_currentColor]"
          >
            let&apos;s connect with me
            <svg
              viewBox="0 0 6 3"
              width="12"
              height="6"
              shapeRendering="crispEdges"
              className="absolute left-1/2 top-full -translate-x-1/2"
            >
              <g className="fill-ink">
                <rect x="0" y="0" width="1" height="1" />
                <rect x="5" y="0" width="1" height="1" />
                <rect x="1" y="1" width="1" height="1" />
                <rect x="4" y="1" width="1" height="1" />
                <rect x="2" y="2" width="2" height="1" />
              </g>
              <g className="fill-surface">
                <rect x="1" y="0" width="4" height="1" />
                <rect x="2" y="1" width="2" height="1" />
              </g>
            </svg>
          </span>
        </a>
      </p>
    </footer>
  );
}
