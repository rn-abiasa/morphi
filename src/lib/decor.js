// Dekorasi memakai emoji bawaan perangkat (di iPhone/Mac tampil sebagai Apple Color Emoji)
const EMOJI_FONT =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

// slot "top": duduk di atas huruf (hanya satu). slot "corner": stiker di sekitar huruf (maks 3)
export const DECORS = [
  { id: "crown", emoji: "👑", slot: "top", rotate: -10 },
  { id: "bow", emoji: "🎀", slot: "top", rotate: 14 },
  { id: "tophat", emoji: "🎩", slot: "top", rotate: -8 },
  { id: "grad", emoji: "🎓", slot: "top", rotate: 8 },
  { id: "sparkles", emoji: "✨", slot: "corner" },
  { id: "star", emoji: "⭐", slot: "corner" },
  { id: "heart", emoji: "💖", slot: "corner" },
  { id: "butterfly", emoji: "🦋", slot: "corner" },
  { id: "flower", emoji: "🌸", slot: "corner" },
  { id: "fire", emoji: "🔥", slot: "corner" },
  { id: "diamond", emoji: "💎", slot: "corner" },
  { id: "cherry", emoji: "🍒", slot: "corner" },
  { id: "moon", emoji: "🌙", slot: "corner" },
  { id: "bolt", emoji: "⚡", slot: "corner" },
];

const BY_ID = Object.fromEntries(DECORS.map((d) => [d.id, d]));
const MAX_CORNERS = 3;

// [x, y, rotasi] dalam pecahan lebar kanvas; semua berada di dalam area lingkaran
const CORNERS = [
  [0.72, 0.27, 12],
  [0.27, 0.73, -12],
  [0.74, 0.74, 8],
];

export function toggleDecor(prev, id) {
  if (prev.includes(id)) return prev.filter((x) => x !== id);
  const slot = BY_ID[id].slot;
  let next = prev;
  if (slot === "top") {
    next = next.filter((x) => BY_ID[x].slot !== "top");
  } else {
    const corners = next.filter((x) => BY_ID[x].slot === "corner");
    if (corners.length >= MAX_CORNERS) {
      next = next.filter((x) => x !== corners[0]);
    }
  }
  return [...next, id];
}

export function drawDecors(ctx, size, ids, letterTop) {
  let cornerIndex = 0;
  ids.forEach((id) => {
    const d = BY_ID[id];
    if (!d) return;

    let x, y, rot, px;
    if (d.slot === "top") {
      px = size * 0.24;
      x = size * 0.52;
      y = Math.max(letterTop - px * 0.42, size * 0.2);
      rot = d.rotate;
    } else {
      const slot = CORNERS[cornerIndex++];
      if (!slot) return;
      px = size * 0.13;
      x = size * slot[0];
      y = size * slot[1];
      rot = slot[2];
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.font = `${px}px ${EMOJI_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = px * 0.18;
    ctx.shadowOffsetY = px * 0.07;
    ctx.fillText(d.emoji, 0, px * 0.04);
    ctx.restore();
  });
}
