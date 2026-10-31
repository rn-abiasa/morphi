// Kirim notifikasi unduhan ke /api/notify (diteruskan ke Discord oleh fungsi server).
// Dikirim tanpa menunggu hasilnya; kegagalan tidak boleh mengganggu pengguna.

const KEY = "morpli:visitor";

// ID pengunjung anonim (acak, disimpan di perangkat) + hitungan unduhannya,
// supaya di Discord terlihat berapa pengguna berbeda dan berapa kali mereka mengunduh.
function visitor() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    const v = saved?.id
      ? saved
      : { id: Math.random().toString(36).slice(2, 10), n: 0 };
    v.n += 1;
    localStorage.setItem(KEY, JSON.stringify(v));
    return v;
  } catch {
    return { id: "anon", n: 0 }; // mis. mode privat yang memblokir penyimpanan
  }
}

export function notifyDownload({ letter, font, gradient, decors }) {
  const v = visitor();
  try {
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        letter,
        font,
        gradient,
        decors,
        visitor: v.id,
        nth: v.n,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* abaikan */
  }
}
