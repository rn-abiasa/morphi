// Config situs: edit nilai di sini, lalu build ulang / deploy ulang.
// Semua nilai ini publik (ikut terbundel ke browser), jadi jangan taruh rahasia di sini.
// Rahasia (mis. DISCORD_WEBHOOK_URL) tetap lewat env server, bukan file ini.

import mvg01 from "../assets/mvg-01.webp";
import mvg02 from "../assets/mvg-02.webp";

export const APP_NAME = "Morpli PFP";
export const COPYRIGHT_OWNER = "Morpli";

// Kosongkan ("") untuk menyembunyikan tombol/dialog terkait
export const SUPPORT_URL = "https://saweria.co/morpli";
export const TIKTOK_URL = "https://tiktok.com/@_abiasa";

// Banner promo di bawah panel kontrol. Kosongkan `url` untuk menyembunyikannya.
// `images`: satu atau lebih foto (import dari src/assets). Jika lebih dari satu,
// foto bergantian dengan crossfade halus tiap `interval` milidetik.
// Disarankan 720x152 px (rasio ~4.7:1); sisi kiri foto sebaiknya tidak terlalu ramai
// karena teks ada di situ.
export const PROMO = {
  url: "https://www.tiktok.com/@morpvely",
  images: [mvg01, mvg02],
  interval: 4500,
  title: "Birthday Website for You ✨",
  text: "Create Birthday Website for your special person 🤍",
};

// Link yang kosong otomatis disembunyikan
export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/rnabiasa" },
  { label: "X", href: "https://x.com/rnabiasa" },
  { label: "TikTok", href: "https://tiktok.com/@_abiasa" },
].filter((s) => s.href);
