import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Globe, Heart, MousePointerClick, X } from "lucide-react";
import { DiscordIcon, InstagramIcon, TikTokIcon, XIcon } from "./BrandIcons";
import { APP_NAME, PROMO, SOCIALS, SUPPORT_URL } from "../lib/site";

const socialHref = (label) =>
  SOCIALS.find((s) => s.label === label)?.href ?? "";

// Edit here to add, rename or move links. Items with an empty href are hidden.
const GROUPS = [
  {
    title: "Links",
    items: [
      { label: "Website", href: "https://rehanabiasa.vercel.app", icon: Globe },
      {
        label: "Buy me a coffee",
        href: "https://saweria.co/morpli",
        icon: Heart,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Discord",
        href: "https://discord.gg/eeFn2WPvC",
        icon: DiscordIcon,
      },
      { label: "X", href: "https://x.com/rnabiasa", icon: XIcon },
      {
        label: "Instagram",
        href: "https://www.instagram.com/rnabiasa/",
        icon: InstagramIcon,
      },
      {
        label: "TikTok",
        href: "https://tiktok.com/@_abiasa",
        icon: TikTokIcon,
      },
    ],
  },
]
  .map((g) => ({ ...g, items: g.items.filter((i) => i.href) }))
  .filter((g) => g.items.length > 0);

const roundButton =
  "grid size-8 place-items-center rounded-full border border-gray-200 bg-gray-50 text-ink/70 transition hover:text-ink active:scale-90 dark:border-border dark:bg-surface";

// Sits in the left slot of the navbar, same size as the theme button
export function SidebarButton({ open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      aria-expanded={open}
      aria-controls="site-sidebar"
      title="Menu"
      className={roundButton}
    >
      <MousePointerClick size={16} />
    </button>
  );
}

export default function Sidebar({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Portal to <body> so it stays above everything, regardless of the sticky header's stacking context
  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="site-sidebar"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-gray-200 bg-gray-50 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] transition-transform duration-300 ease-out dark:border-border dark:bg-surface ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="px-2 text-[13px] font-semibold text-ink/60">
            Morpli PFP
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            title="Close"
            className={roundButton}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-6">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink/45">
                {group.title}
              </h2>
              <ul className="flex flex-col gap-1">
                {group.items.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-3 text-[14px] font-medium text-ink/80 transition hover:bg-black/5 hover:text-ink dark:hover:bg-white/10"
                    >
                      <span className="grid size-9 place-items-center rounded-full border border-gray-200 bg-white dark:border-border dark:bg-white/5">
                        <Icon size={16} />
                      </span>
                      <span className="flex-1">{label}</span>
                      <ArrowUpRight
                        size={14}
                        className="text-ink/30 transition group-hover:text-ink/60"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        {/* Big brand text pinned to the bottom */}
        <p className="mt-auto select-none px-2 pt-10 text-6xl font-semibold leading-[0.9] tracking-[-0.05em] text-ink">
          {APP_NAME}
        </p>
      </aside>
    </>,
    document.body,
  );
}
