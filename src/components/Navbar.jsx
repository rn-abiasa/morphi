import { useState } from "react";
import ThemeButton from "./ThemeButton";
import Sidebar, { SidebarButton } from "./Sidebar";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex justify-between items-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
      <SidebarButton open={open} onClick={() => setOpen(true)} />
      {/* <nav className="relative bg-gray-50 border border-gray-200 w-28 flex h-9 items-center justify-center rounded-full  dark:bg-surface dark:border-border">
        <a href="/" className="flex items-center gap-2">
          <span className="text-[16px] font-semibold tracking-[-0.03em] text-ink">
            Morpli PFP
          </span>
        </a>
      </nav> */}
      <ThemeButton />
      <Sidebar open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
