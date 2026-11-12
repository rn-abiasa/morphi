import { COPYRIGHT_OWNER, SOCIALS } from "../lib/site";
import { Rainvely } from "rainvely";

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-500/10 dark:border-gray-50/10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-[11px] text-ink/45 dark:text-ink/60">
      <Rainvely variant="storm" color="#93c5fd" />
      <p>
        Build with ❤️ by{" "}
        <a href={SOCIALS[2].href} target="_blank">
          abiasa
        </a>
      </p>
    </footer>
  );
}
