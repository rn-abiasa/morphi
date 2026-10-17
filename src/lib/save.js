// Ukuran unduhan HD, penyimpan canvas ke PNG, dan kode pendek untuk nama file
export const HD_SIZE = 2048;

// Simpan canvas sebagai PNG; promise selesai setelah unduhan dipicu
export const saveCanvas = (canvas, name) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
      resolve();
    }, "image/png");
  });

// Kode 6 karakter dari data apa pun, dipakai agar nama file unduhan unik
// (contoh: morpli-letter-A-7B21D4.png)
export function hashId(value) {
  const s = JSON.stringify(value);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
}
