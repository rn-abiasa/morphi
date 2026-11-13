// Site config. Everything here ships in the client bundle, so no secrets
// (those stay in server env, e.g. DISCORD_WEBHOOK_URL).

import mvg01 from "../assets/2.png";
import mvg02 from "../assets/mvg-02.webp";

export const APP_NAME = "Morpli PFP";
export const COPYRIGHT_OWNER = "Morpli";

// Empty string hides the related button/dialog
export const SUPPORT_URL = "https://saweria.co/morpli";
export const TIKTOK_URL = "https://tiktok.com/@_abiasa";

// Promo banner below the controls; an empty `url` hides it.
// `images`: imports from src/assets, crossfaded every `interval` ms when there are several.
// Recommended 720x152 (~4.7:1); keep the left side uncluttered since the text overlays it.
export const PROMO = {
  url: "https://discord.gg/Ct8r9j5a9",
  images: [mvg01],
  interval: 4500,
  title: "Join Discord ✨",
  text: "Join to get updates.",
};

// Entries with an empty href are filtered out
export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/rnabiasa" },
  { label: "X", href: "https://x.com/rnabiasa" },
  { label: "TikTok", href: "https://tiktok.com/@_abiasa" },
].filter((s) => s.href);
