import { APP_NAME, SUPPORT_URL } from "../lib/site";
import { HeartIcon } from "./Icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav className="glass mx-auto flex h-11 max-w-md items-center justify-between rounded-full pl-4 pr-1.5">
        <a
          href="/"
          className="text-[16px] font-semibold tracking-[-0.03em] text-ink"
        >
          {APP_NAME}
        </a>
        {SUPPORT_URL && (
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/60 px-3 text-[12px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_0.5px_rgba(0,0,0,0.08)] transition hover:bg-white/90 active:scale-95"
          >
            <span className="text-[#ff375f]">
              <HeartIcon />
            </span>
            Support
          </a>
        )}
      </nav>
    </header>
  );
}
