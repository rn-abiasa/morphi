const env = import.meta.env;

// Semua nilai dibaca dari file .env (prefix VITE_ wajib agar terbaca Vite)
export const APP_NAME = env.VITE_APP_NAME || "Morpli";
export const COPYRIGHT_OWNER = env.VITE_COPYRIGHT_OWNER || APP_NAME;
export const SUPPORT_URL = env.VITE_SUPPORT_URL || "";

// Link yang kosong otomatis disembunyikan
export const SOCIALS = [
  { label: "Instagram", href: env.VITE_SOCIAL_INSTAGRAM },
  { label: "X", href: env.VITE_SOCIAL_X },
  { label: "TikTok", href: env.VITE_SOCIAL_TIKTOK },
].filter((s) => s.href);
