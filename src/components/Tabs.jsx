export default function Tabs({ mode, onChange }) {
  const items = [
    { id: "letter", label: "Letter" },
    { id: "face", label: "Face" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Avatar type"
      className="glass relative z-10 inline-flex rounded-full p-1"
    >
      {items.map((t) => {
        const active = mode === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={`h-8 min-w-[72px] rounded-full px-5 text-[13px] font-medium transition duration-200 ${
              active
                ? "bg-ink text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
