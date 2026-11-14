import { MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "../hooks/useTheme";

// Pinned to the top-right corner, outside the navbar so the navbar stays centered.
// Same height/top offset as the navbar so the two line up.
export default function ThemeButton() {
  const { toggleTheme, iconForTheme } = useTheme();
  const Icon = iconForTheme() === "sun" ? SunIcon : MoonIcon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-20 grid size-11 place-items-center rounded-full border border-gray-200 bg-gray-50 text-ink/70 transition hover:text-ink active:scale-90 dark:border-border dark:bg-surface"
    >
      <Icon />
    </button>
  );
}
