import { SUPPORT_URL } from "../lib/site";
import { HeartIcon, MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
  const { toggleTheme, iconForTheme } = useTheme();
  const iconName = iconForTheme();
  const ThemeIcon = iconName === "sun" ? SunIcon : MoonIcon;

  return (
    <header className="sticky top-0 z-10 flex justify-center items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <nav className="bg-gray-50 border border-gray-200 w-42 flex h-11 items-center justify-center rounded-full pl-4 pr-1.5 dark:bg-surface dark:border-border">
        <a href="/" className="flex items-center gap-2">
          <span className="text-[16px] font-semibold tracking-[-0.03em] text-ink">
            Morpli PFP
          </span>
        </a>
        <button
          type="button"
          aria-label="Ubah tema"
          title="Ubah tema"
          onClick={toggleTheme}
          className="ml-1.5 grid size-7 place-items-center rounded-full text-ink/70 transition hover:bg-white/40 dark:hover:bg-white/10 active:scale-90"
        >
          <ThemeIcon />
        </button>
      </nav>
    </header>
  );
}
