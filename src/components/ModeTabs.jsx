const TABS = [
  { id: "letter", label: "Letter" },
  { id: "avatar", label: "Donuts" },
];

// Two-way switch between the letter PFP and the silhouette avatar PFP
export default function ModeTabs({ mode, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="PFP type"
      className="relative grid grid-cols-2 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-border dark:bg-surface"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.3,1.3,0.5,1)] ${
          mode === "avatar" ? "translate-x-full" : ""
        }`}
      />
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={mode === t.id}
          onClick={() => onChange(t.id)}
          className={`relative z-10 h-9 w-24 rounded-full text-[13px] font-semibold transition-colors duration-200 ${
            mode === t.id ? "text-paper" : "text-ink/60 hover:text-ink"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
