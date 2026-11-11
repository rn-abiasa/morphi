import { SUPPORT_URL } from "../lib/site";
import { HeartIcon } from "./Icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 flex justify-center items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav className="bg-gray-50 border border-gray-200 w-42 flex h-11 items-center justify-center rounded-full pl-4 pr-1.5">
        <a href="/" className="flex items-center gap-2">
          <span className="text-[16px] font-semibold tracking-[-0.03em] text-ink">
            Morpli PFP
          </span>
        </a>
      </nav>
    </header>
  );
}
