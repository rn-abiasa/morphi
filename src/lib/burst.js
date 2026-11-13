// Comic-doodle stickers. Each sticker is a list of SVG shapes in a 0 0 100 100 viewBox.
// The same data feeds the panel icons (inline <svg>) and the canvas (Path2D), so output
// stays sharp at any export size.

const INK = "#1d1b24";
const YELLOW = "#FFD21F";
const BLUE = "#4DA6EA";
const RED = "#F2503F";
const ORANGE = "#FF7A45";

// Jagged starburst; outer radius is jittered so it doesn't look machine-regular
function burstPath(cx, cy, rOuter, rInner, points, rot = 0) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const outer = i % 2 === 0;
    const r = outer ? rOuter * (1 + 0.1 * Math.sin(i * 2.3)) : rInner;
    const a = rot + (i * Math.PI) / points;
    const x = (cx + r * Math.cos(a)).toFixed(1);
    const y = (cy + r * Math.sin(a)).toFixed(1);
    d += `${i === 0 ? "M" : "L"}${x} ${y} `;
  }
  return `${d}Z`;
}

// Dark underlay stroke + colored stroke on top = outlined line
const outlined = (d, color, w = 6) => [
  { d, stroke: INK, w: w + 4 },
  { d, stroke: color, w },
];

const SQUIGGLE = "M50 5 C30 19 70 31 50 45 C30 59 70 71 50 95";
const CURL =
  "M20 92 C6 56 44 34 56 58 C64 76 34 78 38 58 C42 38 70 28 84 8";
const cross = (x, y, r = 8) => `M${x - r} ${y} H${x + r} M${x} ${y - r} V${y + r}`;

export const BURSTS = [
  {
    id: "bolt",
    name: "Bolt",
    shapes: [
      {
        d: "M60 4 L22 56 H46 L36 96 L80 40 H55 Z",
        fill: YELLOW,
        stroke: INK,
        w: 3,
      },
    ],
  },
  {
    id: "bolt2",
    name: "Zap",
    scale: 0.9,
    shapes: [
      {
        d: "M46 4 L18 44 L40 46 L24 96 L76 34 L52 32 L70 4 Z",
        fill: YELLOW,
        stroke: INK,
        w: 3,
      },
    ],
  },
  { id: "squiggle-blue", name: "Squiggle", shapes: outlined(SQUIGGLE, BLUE) },
  {
    id: "squiggle-orange",
    name: "Squiggle 2",
    shapes: outlined(SQUIGGLE, ORANGE),
  },
  { id: "curl-red", name: "Curl", shapes: outlined(CURL, RED) },
  {
    id: "brush-yellow",
    name: "Brush Yellow",
    scale: 1.15,
    shapes: [
      {
        d: "M4 70 C22 44 58 30 96 24 C84 40 60 52 34 70 C24 77 12 80 4 70 Z",
        fill: YELLOW,
      },
      { d: "M8 84 C28 76 44 70 62 58", stroke: YELLOW, w: 2.6 },
      { d: "M30 44 C46 34 66 28 84 20", stroke: YELLOW, w: 2.2 },
    ],
  },
  {
    id: "brush-red",
    name: "Brush Red",
    scale: 1.15,
    shapes: [
      {
        d: "M96 70 C78 44 42 30 4 24 C16 40 40 52 66 70 C76 77 88 80 96 70 Z",
        fill: RED,
      },
      { d: "M92 84 C72 76 56 70 38 58", stroke: RED, w: 2.6 },
      { d: "M70 44 C54 34 34 28 16 20", stroke: RED, w: 2.2 },
    ],
  },
  {
    id: "brush-blue",
    name: "Brush Blue",
    scale: 1.15,
    shapes: [
      {
        d: "M6 50 C20 30 34 66 50 46 C64 28 80 60 94 40 C88 62 70 76 52 64 C36 54 24 80 6 50 Z",
        fill: BLUE,
      },
    ],
  },
  {
    id: "scribble",
    name: "Scribble",
    shapes: [
      {
        d: "M10 18 L62 10 L22 42 L78 36 L26 70 L72 66 L44 94",
        stroke: INK,
        w: 3.6,
      },
    ],
  },
  {
    id: "arrow",
    name: "Arrow",
    shapes: [
      { d: "M12 90 C34 70 62 42 84 18", stroke: INK, w: 3.6 },
      { d: "M62 16 L88 12 L86 38", stroke: INK, w: 3.6 },
    ],
  },
  {
    id: "crosses",
    name: "Crosses",
    scale: 0.85,
    shapes: [
      {
        d: `${cross(24, 26)} ${cross(62, 46, 9)} ${cross(34, 76)}`,
        stroke: INK,
        w: 4,
      },
    ],
  },
  {
    id: "burst-red",
    name: "Burst",
    scale: 1.05,
    shapes: [
      {
        d: burstPath(50, 50, 46, 26, 9, -0.2),
        fill: RED,
        stroke: INK,
        w: 3,
      },
      { d: "M43 24 H57 L54 58 H46 Z", fill: YELLOW, stroke: INK, w: 2.5 },
      {
        d: "M43 69 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 Z",
        fill: YELLOW,
        stroke: INK,
        w: 2.5,
      },
    ],
  },
  {
    id: "burst-yellow",
    name: "Pow",
    scale: 1.05,
    shapes: [
      {
        d: burstPath(50, 50, 46, 28, 8, 0.1),
        fill: YELLOW,
        stroke: INK,
        w: 3,
      },
      { d: burstPath(50, 50, 24, 15, 7, 0.4), fill: RED },
    ],
  },
];

const BY_ID = Object.fromEntries(BURSTS.map((b) => [b.id, b]));
export const MAX_BURSTS = 8;

// [x, y, size, rotation in degrees]; x/y/size are fractions of canvas width.
// Stickers are drawn pointing up, then rotated to radiate outward from the letter.
// All slots stay inside the circular crop.
const SLOTS = [
  [0.8, 0.3, 0.2, 18],
  [0.2, 0.3, 0.2, -18],
  [0.5, 0.12, 0.17, 0],
  [0.84, 0.58, 0.18, 70],
  [0.16, 0.6, 0.18, -70],
  [0.72, 0.82, 0.19, 150],
  [0.28, 0.82, 0.19, -150],
  [0.5, 0.9, 0.15, 180],
];
// Fill order: diagonals first so a few stickers still look balanced
const SLOT_ORDER = [0, 1, 5, 6, 2, 3, 4, 7];

export function toggleBurst(prev, id) {
  if (prev.includes(id)) return prev.filter((x) => x !== id);
  const next = prev.length >= MAX_BURSTS ? prev.slice(1) : prev;
  return [...next, id];
}

const pathCache = new Map();
const pathOf = (d) => {
  if (!pathCache.has(d)) pathCache.set(d, new Path2D(d));
  return pathCache.get(d);
};

export function drawBursts(ctx, size, ids) {
  ids.forEach((id, i) => {
    const b = BY_ID[id];
    const slot = SLOTS[SLOT_ORDER[i]];
    if (!b || !slot) return;
    const px = size * slot[2] * (b.scale ?? 1);

    ctx.save();
    ctx.translate(size * slot[0], size * slot[1]);
    ctx.rotate((slot[3] * Math.PI) / 180);
    ctx.scale(px / 100, px / 100);
    ctx.translate(-50, -50);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    b.shapes.forEach((s) => {
      const p = pathOf(s.d);
      if (s.fill) {
        ctx.fillStyle = s.fill;
        ctx.fill(p);
      }
      if (s.stroke) {
        ctx.strokeStyle = s.stroke;
        ctx.lineWidth = s.w ?? 3;
        ctx.stroke(p);
      }
    });
    ctx.restore();
  });
}
