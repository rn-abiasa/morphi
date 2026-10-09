import { SOCIALS } from "../config";

export default function Footer() {
  return (
    <footer className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-center text-[12px] text-ink/50">
      <ul className="mb-2 flex justify-center gap-5">
        {SOCIALS.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-ink"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p>© {new Date().getFullYear()} Morphi. All rights reserved.</p>
    </footer>
  );
}
