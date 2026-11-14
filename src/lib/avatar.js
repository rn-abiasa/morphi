// Avatar PFP: a flat silhouette (head + shoulders) on a solid background.
// Everything is SVG path data in a 0 0 100 100 viewBox. The same data feeds the panel
// previews (inline <svg>) and the canvas (Path2D), so output stays sharp at any export size.

const ell = (cx, cy, rx, ry) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;

// `box` is the head's ellipse; decors anchor to it. Bodies run past y=100 and get clipped
// by the canvas, so the platform's circular crop produces the dome look.
export const SHAPES = [
  {
    id: "classic",
    name: "Classic",
    head: ell(50, 44, 20, 20),
    body: ell(50, 102, 36, 32),
    box: { cx: 50, cy: 44, rx: 20, ry: 20 },
  },
  {
    id: "chibi",
    name: "Chibi",
    head: ell(50, 46, 26, 25),
    body: ell(50, 106, 22, 22),
    box: { cx: 50, cy: 46, rx: 26, ry: 25 },
  },
  {
    id: "slim",
    name: "Slim",
    head: ell(50, 42, 13, 17),
    body: ell(50, 102, 19, 32),
    box: { cx: 50, cy: 42, rx: 13, ry: 17 },
  },
  {
    id: "egg",
    name: "Egg",
    head: "M50 22C63 22 68 38 68 48C68 60 61 68 50 68C39 68 32 60 32 48C32 38 37 22 50 22Z",
    body: ell(50, 100, 26, 20),
    box: { cx: 50, cy: 45, rx: 18, ry: 23 },
  },
  {
    id: "mini",
    name: "Mini",
    head: ell(50, 44, 13, 13),
    body: ell(50, 100, 38, 26),
    box: { cx: 50, cy: 44, rx: 13, ry: 13 },
  },
  {
    id: "broad",
    name: "Broad",
    head: ell(50, 44, 18, 18),
    body: "M6 104C6 82 26 70 50 70C74 70 94 82 94 104Z",
    box: { cx: 50, cy: 44, rx: 18, ry: 18 },
  },
];

// [background, figure], taken from the reference sheet
export const PALETTES = [
  { id: "mist", name: "Mist", bg: "#d0d0d2", figure: "#ffffff" },
  { id: "bubblegum", name: "Bubblegum", bg: "#f760a0", figure: "#ff8cc6" },
  { id: "pearl", name: "Pearl", bg: "#f6f4f2", figure: "#e7d4d0" },
  { id: "sage", name: "Sage", bg: "#dce8d5", figure: "#8eb081" },
  { id: "butter", name: "Butter", bg: "#fff4d0", figure: "#f7bec6" },
  { id: "midnight", name: "Midnight", bg: "#000000", figure: "#93f0da" },
  { id: "blush", name: "Blush", bg: "#ffffff", figure: "#fce8f1" },
  { id: "candy", name: "Candy", bg: "#fcd3e8", figure: "#f985be" },
  { id: "slate", name: "Slate", bg: "#47484c", figure: "#d0d0d0" },
];

export const SWATCHES = [
  "#ffffff",
  "#d0d0d2",
  "#47484c",
  "#000000",
  "#f760a0",
  "#ff8cc6",
  "#fcd3e8",
  "#fde8f1",
  "#fff4d0",
  "#ffd6b8",
  "#dce8d5",
  "#8eb081",
  "#93f0da",
  "#cde7f7",
  "#e5ddf7",
];

export const DEFAULT_AVATAR = {
  bg: PALETTES[1].bg,
  figure: PALETTES[1].figure,
  shape: "classic",
  decors: [],
};

const BLUE = "#1f4fd8";
const PINK = "#ee6aa3";
const GOLD = "#ffc83d";
const SKY = "#8ec9f5";
const INK = "#3b2f3a";

// Decor sticker data. `fill`/`stroke` may be "figure" (follows the silhouette color).
// anchor: where it sits on the head. w: width as a multiple of the head width.
// oy: vertical shift as a fraction of the sticker's own size. rot: degrees.
// behind: drawn before the silhouette (ears).
// One decor per anchor: picking another one with the same anchor replaces it.
export const DECORS = [
  {
    id: "crown",
    name: "Crown",
    anchor: "top",
    w: 0.75,
    oy: -0.38,
    rot: -6,
    shapes: [
      {
        d: "M14 74L8 34L32 52L50 22L68 52L92 34L86 74Z",
        fill: GOLD,
        stroke: GOLD,
        w: 4,
      },
      { d: "M14 74H86V84H14Z", fill: "#f5a623", stroke: "#f5a623", w: 3 },
      { d: "M3 34a5 5 0 1 0 10 0a5 5 0 1 0 -10 0Z", fill: "#ff6b8b" },
      { d: "M45 22a5 5 0 1 0 10 0a5 5 0 1 0 -10 0Z", fill: "#ff6b8b" },
      { d: "M87 34a5 5 0 1 0 10 0a5 5 0 1 0 -10 0Z", fill: "#ff6b8b" },
    ],
  },

  {
    id: "cat",
    name: "Cat ears",
    anchor: "top",
    w: 1.1,
    oy: 0,
    rot: 0,
    behind: true,
    shapes: [
      { d: "M12 62L16 20L42 40Z", fill: "figure", stroke: "figure", w: 7 },
      { d: "M88 62L84 20L58 40Z", fill: "figure", stroke: "figure", w: 7 },
      { d: "M19 50L21 31L33 41Z", fill: "#ffffff", op: 0.4 },
      { d: "M81 50L79 31L67 41Z", fill: "#ffffff", op: 0.4 },
    ],
  },
  {
    id: "bear",
    name: "Bear ears",
    anchor: "top",
    w: 1.1,
    oy: 0,
    rot: 0,
    behind: true,
    shapes: [
      { d: ell(18, 40, 16, 16), fill: "figure" },
      { d: ell(82, 40, 16, 16), fill: "figure" },
      { d: ell(18, 40, 8, 8), fill: "#ffffff", op: 0.4 },
      { d: ell(82, 40, 8, 8), fill: "#ffffff", op: 0.4 },
    ],
  },
  {
    id: "heart",
    name: "Heart",
    anchor: "tl",
    w: 0.4,
    oy: 0,
    rot: -12,
    shapes: [
      {
        d: "M50 86C20 66 10 46 18 30C25 17 42 18 50 32C58 18 75 17 82 30C90 46 80 66 50 86Z",
        fill: PINK,
      },
    ],
  },
  {
    id: "flower",
    name: "Flower",
    anchor: "tl",
    w: 0.6,
    oy: 0,
    rot: 10,
    shapes: [0, 72, 144, 216, 288]
      .map((a) => ({
        d: "M50 50C30 40 34 8 50 6C66 8 70 40 50 50Z",
        fill: "#f58db8",
        rot: a,
      }))
      .concat([{ d: ell(50, 50, 8, 8), fill: "#ffe27a" }]),
  },
  {
    id: "bow",
    name: "Bow",
    anchor: "tl",
    w: 0.6,
    oy: 0,
    rot: -14,
    shapes: [
      { d: "M50 50C36 32 10 28 8 46C6 66 32 70 50 50Z", fill: "#f0599b" },
      { d: "M50 50C64 32 90 28 92 46C94 66 68 70 50 50Z", fill: "#f0599b" },
      { d: ell(50, 50, 9, 9), fill: "#d93b83" },
    ],
  },
  {
    id: "butterfly",
    name: "Butterfly",
    anchor: "tl",
    w: 0.6,
    oy: 0,
    rot: 14,
    shapes: [
      { d: "M50 50C30 20 6 22 10 42C12 56 34 58 50 50Z", fill: "#f58db8" },
      { d: "M50 50C70 20 94 22 90 42C88 56 66 58 50 50Z", fill: "#f58db8" },
      { d: "M50 52C34 56 22 78 34 82C46 84 50 66 50 52Z", fill: "#f9b6d3" },
      { d: "M50 52C66 56 78 78 66 82C54 84 50 66 50 52Z", fill: "#f9b6d3" },
      { d: "M50 36V72", stroke: INK, w: 4 },
    ],
  },
  {
    id: "zzz",
    name: "Sleepy",
    anchor: "tr",
    w: 0.75,
    oy: 0,
    rot: 0,
    shapes: [
      { d: "M10 68H30L10 90H32", stroke: BLUE, w: 6 },
      { d: "M36 38H62L36 70H64", stroke: BLUE, w: 7.5 },
      { d: "M62 8H92L62 46H94", stroke: BLUE, w: 9 },
    ],
  },
  {
    id: "sparkle",
    name: "Sparkle",
    anchor: "tr",
    w: 0.55,
    oy: 0,
    rot: 0,
    shapes: [
      {
        d: "M44 14C47 38 56 48 80 52C56 56 47 66 44 90C41 66 32 56 8 52C32 48 41 38 44 14Z",
        fill: "#ffd84d",
      },
      {
        d: "M82 6C83 14 87 18 94 19C87 20 83 24 82 32C81 24 77 20 70 19C77 18 81 14 82 6Z",
        fill: "#ffb84d",
      },
    ],
  },
  {
    id: "star",
    name: "Star",
    anchor: "tr",
    w: 0.5,
    oy: 0,
    rot: 12,
    shapes: [
      {
        d: "M50 8L61 36L92 38L68 57L76 88L50 71L24 88L32 57L8 38L39 36Z",
        fill: "#ffd84d",
        stroke: "#f5a623",
        w: 3,
      },
    ],
  },
  {
    id: "cloud",
    name: "Cloud",
    anchor: "tr",
    w: 0.8,
    oy: 0,
    rot: 0,
    shapes: [
      {
        d: "M26 70C10 70 6 50 22 46C22 30 44 24 52 38C62 28 82 36 78 54C92 56 92 70 78 70Z",
        fill: SKY,
      },
    ],
  },
];

const SHAPE_BY_ID = Object.fromEntries(SHAPES.map((s) => [s.id, s]));
const DECOR_BY_ID = Object.fromEntries(DECORS.map((d) => [d.id, d]));

export function toggleAvatarDecor(prev, id) {
  if (prev.includes(id)) return prev.filter((x) => x !== id);
  const anchor = DECOR_BY_ID[id]?.anchor;
  return [...prev.filter((x) => DECOR_BY_ID[x]?.anchor !== anchor), id];
}

// Offsets from the head center, as multiples of the head radii
const ANCHORS = { tl: [-0.62, -0.7], tr: [0.95, -0.95], top: [0, -1] };

const pathCache = new Map();
function pathOf(d, rot) {
  const key = `${rot ?? 0}|${d}`;
  if (!pathCache.has(key)) {
    const p = new Path2D();
    p.addPath(
      new Path2D(d),
      rot
        ? new DOMMatrix().translate(50, 50).rotate(rot).translate(-50, -50)
        : undefined,
    );
    pathCache.set(key, p);
  }
  return pathCache.get(key);
}

// Sticker position + size in 0-100 units, derived from the head ellipse.
// Size is clamped so chibi heads don't produce huge stickers and slim ones tiny stickers.
function place(decor, box) {
  const [ax, ay] = ANCHORS[decor.anchor];
  const size = decor.w * Math.min(48, Math.max(26, box.rx * 2));
  return {
    x: box.cx + ax * box.rx,
    y: box.cy + ay * box.ry + decor.oy * size,
    size,
  };
}

function drawDecor(ctx, k, decor, box, figure) {
  const { x, y, size } = place(decor, box);
  ctx.save();
  ctx.scale(k, k);
  ctx.translate(x, y);
  ctx.rotate((decor.rot * Math.PI) / 180);
  ctx.scale(size / 100, size / 100);
  ctx.translate(-50, -50);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  decor.shapes.forEach((s) => {
    const p = pathOf(s.d, s.rot);
    ctx.globalAlpha = s.op ?? 1;
    if (s.fill) {
      ctx.fillStyle = s.fill === "figure" ? figure : s.fill;
      ctx.fill(p);
    }
    if (s.stroke) {
      ctx.strokeStyle = s.stroke === "figure" ? figure : s.stroke;
      ctx.lineWidth = s.w ?? 3;
      ctx.stroke(p);
    }
  });
  ctx.restore();
}

export function drawAvatar(canvas, size, { bg, figure, shape, decors = [] }) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const k = size / 100;
  const sh = SHAPE_BY_ID[shape] ?? SHAPES[0];
  const list = decors.map((id) => DECOR_BY_ID[id]).filter(Boolean);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  list
    .filter((d) => d.behind)
    .forEach((d) => drawDecor(ctx, k, d, sh.box, figure));

  ctx.save();
  ctx.scale(k, k);
  ctx.fillStyle = figure;
  ctx.fill(pathOf(sh.body));
  ctx.fill(pathOf(sh.head));
  ctx.restore();

  list
    .filter((d) => !d.behind)
    .forEach((d) => drawDecor(ctx, k, d, sh.box, figure));
}
