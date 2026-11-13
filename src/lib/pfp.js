import { drawDecors } from "./decor";
import { drawBursts } from "./burst";
import { drawFisheyeLetter } from "./effects";

export const FONTS = [
  {
    id: "rounded",
    name: "Rounded",
    family: '"Nunito", "Arial Rounded MT Bold", system-ui, sans-serif',
    weight: 800,
    scale: 1,
  },
  {
    id: "soft",
    name: "Soft Heavy",
    family:
      '"M PLUS Rounded 1c", "Arial Rounded MT Bold", system-ui, sans-serif',
    weight: 800,
    scale: 1,
    cap: 0.386, // cap height as a fraction of canvas width
  },
  {
    id: "sans",
    name: "Sans",
    family: '"Manrope", system-ui, sans-serif',
    weight: 800,
    scale: 1,
  },
  {
    id: "serif",
    name: "Serif",
    family: '"Playfair Display", Georgia, serif',
    weight: 700,
    scale: 0.95,
  },
  {
    id: "mono",
    name: "Mono",
    family: '"JetBrains Mono", ui-monospace, monospace',
    weight: 700,
    scale: 0.95,
  },
  {
    id: "wide",
    name: "Wide",
    family: '"Unbounded", system-ui, sans-serif',
    weight: 600,
    scale: 0.85,
  },
  {
    id: "condensed",
    name: "Condensed",
    family: '"Bebas Neue", Impact, sans-serif',
    weight: 400,
    scale: 1.3,
  },
  {
    id: "script",
    name: "Script",
    family: '"Pacifico", cursive',
    weight: 400,
    scale: 0.9,
  },
];

// "iOS" set: system colors with a subtle vertical gradient (lighter on top, solid at the bottom)
const lift = (hex, t) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.round(v + (255 - v) * t)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${ch.join("")}`;
};

const IOS_COLORS = [
  ["Red", "#FF3B30"],
  ["Orange", "#FF9500"],
  ["Yellow", "#FFCC00"],
  ["Green", "#34C759"],
  ["Mint", "#00C7BE"],
  ["Teal", "#30B0C7"],
  ["Cyan", "#32ADE6"],
  ["Blue", "#007AFF"],
  ["Indigo", "#5856D6"],
  ["Purple", "#AF52DE"],
  ["Pink", "#FF2D55"],
  ["Brown", "#A2845E"],
  ["Gray", "#8E8E93"],
];

const IOS_GRADIENTS = IOS_COLORS.map(([name, color]) => ({
  id: `ios-${name.toLowerCase()}`,
  name: `iOS ${name}`,
  angle: 180,
  ios: true,
  stops: [
    [0, lift(color, 0.28)],
    [1, color],
  ],
}));

// angle follows CSS linear-gradient (180 = top to bottom)
export const GRADIENTS = [
  {
    id: "graphite",
    name: "Graphite",
    angle: 180,
    stops: [
      [0, "#706e6e"],
      [1, "#1e1e1e"],
    ],
  },
  {
    id: "ash",
    name: "Ash",
    angle: 180,
    // sampled from the reference image
    stops: [
      [0, "#b8b8b8"],
      [1, "#343231"],
    ],
  },
  {
    id: "midnight",
    name: "Midnight",
    angle: 180,
    stops: [
      [0, "#3a3f5c"],
      [1, "#0a0b14"],
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    angle: 170,
    stops: [
      [0, "#2b86ff"],
      [1, "#0b2a6f"],
    ],
  },
  {
    id: "aurora",
    name: "Aurora",
    angle: 155,
    stops: [
      [0, "#34d1bf"],
      [1, "#7b5cf0"],
    ],
  },
  {
    id: "orchid",
    name: "Orchid",
    angle: 150,
    stops: [
      [0, "#d16ba5"],
      [1, "#5b4de3"],
    ],
  },
  {
    id: "rose",
    name: "Rose",
    angle: 160,
    stops: [
      [0, "#ff8fb1"],
      [1, "#b3245f"],
    ],
  },
  {
    id: "sunset",
    name: "Sunset",
    angle: 160,
    stops: [
      [0, "#ffb36b"],
      [1, "#ff4d6d"],
    ],
  },
  {
    id: "ember",
    name: "Ember",
    angle: 170,
    stops: [
      [0, "#ff8a3d"],
      [1, "#8a1538"],
    ],
  },
  {
    id: "forest",
    name: "Forest",
    angle: 180,
    stops: [
      [0, "#3dd68c"],
      [1, "#0b3d2e"],
    ],
  },
  {
    id: "pearl",
    name: "Pearl",
    angle: 180,
    ink: "#1c1c1e",
    stops: [
      [0, "#fdfdfd"],
      [1, "#cfd2d8"],
    ],
  },
];

export const toCss = (g) =>
  `linear-gradient(${g.angle}deg, ${g.stops
    .map(([pos, color]) => `${color} ${pos * 100}%`)
    .join(", ")})`;

export const fontSpec = (font, px) => `${font.weight} ${px}px ${font.family}`;

/** Draws the full square PFP. Shared by the preview and the HD export so both render identically. */
export function drawPfp(
  canvas,
  size,
  { letter, font, gradient, decors = [], effect, bursts = [] },
) {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const rad = (gradient.angle * Math.PI) / 180;
  const len = size * (Math.abs(Math.sin(rad)) + Math.abs(Math.cos(rad)));
  const dx = (Math.sin(rad) * len) / 2;
  const dy = (-Math.cos(rad) * len) / 2;
  const fill = ctx.createLinearGradient(
    size / 2 - dx,
    size / 2 - dy,
    size / 2 + dx,
    size / 2 + dy,
  );
  gradient.stops.forEach(([pos, color]) => fill.addColorStop(pos, color));
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, size, size);

  if (!letter) {
    drawBursts(ctx, size, bursts);
    drawDecors(ctx, size, decors, size * 0.34);
    return;
  }

  // Base glyph size relative to canvas width; two-letter monograms are smaller
  const count = Array.from(letter).length;
  let px = size * (count === 1 ? 0.46 : 0.34) * font.scale;
  if (font.cap) {
    // Fonts with `cap`: size from the real cap height (measure "H" at 100px)
    // so letter height is the same across fonts.
    ctx.font = fontSpec(font, 100);
    const capAt100 = ctx.measureText("H").actualBoundingBoxAscent || 72;
    px = (size * font.cap * (count === 1 ? 1 : 0.74) * 100) / capAt100;
  }
  if (effect?.id === "fisheye" && effect.amount > 0) {
    const top = drawFisheyeLetter(ctx, size, {
      letter,
      font,
      px,
      ink: gradient.ink || "#ffffff",
      amount: effect.amount,
      weight: effect.weight,
    });
    drawBursts(ctx, size, bursts);
    drawDecors(ctx, size, decors, top);
    return;
  }

  ctx.font = fontSpec(font, px);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  const m = ctx.measureText(letter);
  const x = size / 2 - (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
  const y =
    size / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;

  ctx.fillStyle = gradient.ink || "#ffffff";
  ctx.fillText(letter, x, y);

  drawBursts(ctx, size, bursts);
  drawDecors(ctx, size, decors, y - m.actualBoundingBoxAscent);
}
