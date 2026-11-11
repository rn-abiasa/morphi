// Bingkai kaca berbentuk lingkaran + cahaya warna di belakangnya
export default function Bezel({ glow, children }) {
  return (
    <div className="relative w-[min(56vw,232px)] sm:w-[248px]">
      <div className="relative aspect-square rounded-full sm:rounded-4xl p-2 outline-2 outline-offset-4 outline-transparent transition-[outline-color] duration-200 focus-within:outline-[#0071e3]/50">
        <div
          className="relative size-full overflow-hidden rounded-full sm:rounded-4xl"
          style={{ containerType: "inline-size" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
