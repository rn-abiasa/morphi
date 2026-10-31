import { COPYRIGHT_OWNER, SOCIALS } from "../lib/site";

export default function Footer() {
  return (
    <footer className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-[11px] text-ink/45">
      <p>
        Build with ❤️ by{" "}
        <a href={SOCIALS[2].href} target="_blank">
          abiasa
        </a>
      </p>
    </footer>
  );
}
