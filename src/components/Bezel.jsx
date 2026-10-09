// Bingkai kaca berbentuk lingkaran + cahaya warna di belakangnya (dipakai tab Letter dan Face)
export default function Bezel({ glow, children }) {
  return (
    <div className="relative w-[min(56vw,232px)] sm:w-[248px]">
      <div
        aria-hidden="true"
        className="absolute -inset-[22%] rounded-full opacity-35 blur-3xl transition-all duration-500"
        style={{ background: glow }}
      />
      <div className="glass relative aspect-square rounded-full p-2 outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-200 focus-within:outline-[#0071e3]/50">
        <div
          className="relative size-full overflow-hidden rounded-full"
          style={{ containerType: "inline-size" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
