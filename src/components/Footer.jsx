import { COPYRIGHT_OWNER, SOCIALS } from "../lib/site";

export default function Footer() {
  return (
    <footer className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-[11px] text-ink/45">
      {SOCIALS.length > 0 && (
        <ul className="mb-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1">
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
      )}
      <p>
        © {new Date().getFullYear()} {COPYRIGHT_OWNER}. All rights reserved.
      </p>
    </footer>
  );
}
