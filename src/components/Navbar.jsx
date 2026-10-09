import { APP_NAME, SUPPORT_URL } from "../lib/site";
import { HeartIcon } from "./Icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-paper/75 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
        <a
          href="/"
          className="text-[19px] font-semibold tracking-[-0.03em] text-ink"
        >
          {APP_NAME}
        </a>
        {SUPPORT_URL && (
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-ink/[0.06] px-3.5 text-[13px] font-medium text-ink transition hover:bg-ink/10 active:scale-95"
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
