// Background patterns for the avatar tab.
// Each pattern is a few merged SVG paths in the same 0 0 100 100 space as the silhouette.
// They are drawn in a single "ink" tone derived from the background color (patternInk),
// so every background gets a matching tone-on-tone pattern. The same data feeds the panel
// thumbnails (inline <svg>) and the canvas (Path2D), so exports stay sharp at any size.

const f = (n) => +n.toFixed(2);

const circ = (cx, cy, r) =>
  `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0Z`;

// Calls fn(x, y, index) for every cell center; with `stagger`, odd rows shift by half a step
function lattice(step, fn, stagger = false) {
  let row = 0;
  let i = 0;
  for (let y = step / 2; y < 100 + step; y += step, row++) {
    const shift = stagger && row % 2 ? step / 2 : 0;
    for (let x = step / 2 - shift; x < 100 + step; x += step) fn(x, y, i++);
  }
}

// Small deterministic random so a pattern looks the same on every render
function seeded(seed) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function heart(cx, cy, size) {
  const k = size / 80;
  const P = (x, y) => `${f(cx + (x - 50) * k)} ${f(cy + (y - 52) * k)}`;
  return (
    `M${P(50, 86)}C${P(20, 66)} ${P(10, 46)} ${P(18, 30)}` +
    `C${P(25, 17)} ${P(42, 18)} ${P(50, 32)}` +
    `C${P(58, 18)} ${P(75, 17)} ${P(82, 30)}` +
    `C${P(90, 46)} ${P(80, 66)} ${P(50, 86)}Z`
  );
}

// Four-point sparkle with pinched sides
const sparkle = (x, y, r) =>
  `M${f(x)} ${f(y - r)}Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)}Q${f(x)} ${f(y)} ${f(x)} ${f(y + r)}` +
  `Q${f(x)} ${f(y)} ${f(x - r)} ${f(y)}Q${f(x)} ${f(y)} ${f(x)} ${f(y - r)}Z`;

// Shape fields: d, fill (true), stroke (true), w (stroke width), op (opacity)
const fill = (d, op) => ({ d, fill: true, op });
const line = (d, w = 1.8) => ({ d, stroke: true, w });

const BUILDERS = {
  none: () => [],

  dots: () => {
    let d = "";
    lattice(14, (x, y) => (d += circ(x, y, 2.7)), true);
    return [fill(d)];
  },

  gingham: () => {
    let v = "";
    let h = "";
    for (let p = 0; p < 100; p += 20) {
      v += `M${p} 0h10v100h-10Z`;
      h += `M0 ${p}h100v10h-100Z`;
    }
    return [fill(v, 0.45), fill(h, 0.45)];
  },

  checker: () => {
    let d = "";
    const c = 12.5;
    for (let i = 0; i < 8; i++)
      for (let j = 0; j < 8; j++)
        if ((i + j) % 2 === 0) d += `M${i * c} ${j * c}h${c}v${c}h${-c}Z`;
    return [fill(d)];
  },

  stripes: () => {
    let d = "";
    for (let k = -100; k < 100; k += 14) d += `M${k} 0h6.5l100 100h-6.5Z`;
    return [fill(d)];
  },

  waves: () => {
    let d = "";
    for (let y = 4, r = 0; y < 112; y += 11, r++) {
      d += `M${-10 + (r % 2) * 5} ${y}q5 -6 10 0` + "t10 0".repeat(12);
    }
    return [line(d, 1.8)];
  },

  zigzag: () => {
    let d = "";
    for (let y = 8; y < 112; y += 12) {
      d += `M-6 ${y}` + "l6 -5l6 5".repeat(10);
    }
    return [line(d, 1.8)];
  },

  grid: () => {
    let d = "";
    for (let p = 12.5; p < 100; p += 12.5) d += `M${p} 0V100M0 ${p}H100`;
    return [line(d, 0.9)];
  },

  hearts: () => {
    let d = "";
    lattice(16, (x, y) => (d += heart(x, y, 8.5)), true);
    return [fill(d)];
  },

  sparkles: () => {
    let d = "";
    lattice(20, (x, y, i) => (d += sparkle(x, y, i % 2 ? 3 : 6)), true);
    return [fill(d)];
  },

  daisies: () => {
    let petals = "";
    let centers = "";
    lattice(
      22,
      (x, y) => {
        for (let a = 0; a < 6; a++) {
          const t = (a * Math.PI) / 3;
          petals += circ(x + Math.cos(t) * 4.2, y + Math.sin(t) * 4.2, 2.8);
        }
        centers += circ(x, y, 2.2);
      },
      true,
    );
    return [fill(petals), fill(centers, 0.5)];
  },

  rings: () => {
    let rings = "";
    let dots = "";
    lattice(
      20,
      (x, y) => {
        rings += circ(x, y, 6);
        dots += circ(x, y, 1.5);
      },
      true,
    );
    return [line(rings, 1.8), fill(dots)];
  },

  sunburst: () => {
    let d = "";
    const R = 160;
    for (let i = 0; i < 24; i += 2) {
      const a1 = (i * Math.PI * 2) / 24;
      const a2 = ((i + 1) * Math.PI * 2) / 24;
      d += `M50 50L${f(50 + Math.cos(a1) * R)} ${f(50 + Math.sin(a1) * R)}L${f(50 + Math.cos(a2) * R)} ${f(50 + Math.sin(a2) * R)}Z`;
    }
    return [fill(d)];
  },

  confetti: () => {
    const rnd = seeded(7);
    let dots = "";
    let tris = "";
    let dashes = "";
    lattice(15, (x0, y0, i) => {
      const x = x0 + (rnd() - 0.5) * 7;
      const y = y0 + (rnd() - 0.5) * 7;
      const a = rnd() * Math.PI * 2;
      const kind = i % 3;
      if (kind === 0) dots += circ(x, y, 1.7);
      else if (kind === 1) {
        const dx = Math.cos(a) * 3.2;
        const dy = Math.sin(a) * 3.2;
        dashes += `M${f(x - dx)} ${f(y - dy)}L${f(x + dx)} ${f(y + dy)}`;
      } else {
        const p = (k) =>
          `${f(x + Math.cos(a + (k * Math.PI * 2) / 3) * 3.4)} ${f(y + Math.sin(a + (k * Math.PI * 2) / 3) * 3.4)}`;
        tris += `M${p(0)}L${p(1)}L${p(2)}Z`;
      }
    });
    return [fill(dots + tris), line(dashes, 1.8)];
  },

  bubbles: () => {
    const rnd = seeded(21);
    let d = "";
    lattice(17, (x0, y0) => {
      const x = x0 + (rnd() - 0.5) * 6;
      const y = y0 + (rnd() - 0.5) * 6;
      d += circ(x, y, 2 + rnd() * 4.5);
    });
    return [line(d, 1.4)];
  },
};

export const PATTERNS = [
  { id: "none", name: "None" },
  { id: "dots", name: "Polka" },
  { id: "gingham", name: "Gingham" },
  { id: "checker", name: "Checker" },
  { id: "stripes", name: "Stripes" },
  { id: "waves", name: "Waves" },
  { id: "zigzag", name: "Zigzag" },
  { id: "grid", name: "Grid" },
  { id: "hearts", name: "Hearts" },
  { id: "sparkles", name: "Sparkles" },
  { id: "daisies", name: "Daisies" },
  { id: "rings", name: "Rings" },
  { id: "sunburst", name: "Sunburst" },
  { id: "confetti", name: "Confetti" },
  { id: "bubbles", name: "Bubbles" },
];

const cache = new Map();
export function patternShapes(id) {
  if (!cache.has(id)) cache.set(id, (BUILDERS[id] ?? BUILDERS.none)());
  return cache.get(id);
}

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

// Tone-on-tone ink: darker on light backgrounds, lighter on mid and dark ones
export function patternInk(bg) {
  const [r, g, b] = hexToRgb(bg);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const [target, amt] = lum > 0.78 ? [0, 0.11] : lum > 0.32 ? [255, 0.3] : [255, 0.18];
  const mix = (c) => Math.round(c + (target - c) * amt);
  return `rgb(${mix(r)},${mix(g)},${mix(b)})`;
}
