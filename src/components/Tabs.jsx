export default function Tabs({ mode, onChange }) {
  const items = [
    { id: "letter", label: "Letter" },
    { id: "face", label: "Face" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Avatar type"
      className="glass inline-flex rounded-full p-0.5"
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
            className={`h-7 rounded-full px-4 text-[12px] font-medium transition duration-200 ${
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
