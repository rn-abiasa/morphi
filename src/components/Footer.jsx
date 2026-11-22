export default function Footer() {
  return (
    <footer className=" dark:border-gray-50/10 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8 text-center text-[10px] text-ink/45 dark:text-ink/60">
      <p className="">
        Build with ❤️ by{" "}
        <a
          href="https://rehanabiasa.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="abiasa on TikTok"
          className="relative inline-block"
        >
          abiasa
        </a>
      </p>
    </footer>
  );
}
