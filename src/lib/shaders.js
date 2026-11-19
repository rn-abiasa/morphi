// Shaders for the avatar silhouette (head + shoulders only; background and decors are untouched).
// Each one paints the silhouette into an offscreen layer in 0-100 units (the layer is pre-scaled),
// then renderFigure composites that layer onto the avatar canvas. Overlays are clipped to the
// silhouette with ctx.clip(mask), so blend modes never leak into the background.
// `a` is the Amount slider as 0-1, `k` is pixels per unit, `size` the canvas size in pixels.

import { hexToRgb } from "./patterns";

export const SHADERS = [
  { id: "none", name: "None" },
  { id: "gloss", name: "Clay" },
  { id: "gradient", name: "Gradient" },
  { id: "glow", name: "Glow" },
  { id: "sticker", name: "Sticker" },
  { id: "grain", name: "Grain" },
  { id: "halftone", name: "Halftone" },
  { id: "glitch", name: "Glitch" },
  { id: "pixel", name: "Pixel" },
  { id: "holo", name: "Holo" },
];

export const DEFAULT_SHADER_AMOUNT = 60;

// Lighten (t > 0) or darken (t < 0) a hex color
function shade(hex, t) {
  const [r, g, b] = hexToRgb(hex);
  const target = t >= 0 ? 255 : 0;
  const m = (c) => Math.round(c + (target - c) * Math.abs(t));
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

function seeded(seed) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const fillSil = (c, sil, style) => {
  c.fillStyle = style;
  sil.paths.forEach((p) => c.fill(p));
};

// 128px tile of grey noise, built once
let noise = null;
function noiseTile() {
  if (!noise) {
    noise = document.createElement("canvas");
    noise.width = noise.height = 128;
    const nc = noise.getContext("2d");
    const img = nc.createImageData(128, 128);
    const rnd = seeded(99);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.round(rnd() * 255);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    nc.putImageData(img, 0, 0);
  }
  return noise;
}

const EFFECTS = {
  none(c, s, fig) {
    fillSil(c, s, fig);
  },

  // Soft clay / vinyl toy: top-left light, bottom-right shade, small specular on the head
  gloss(c, s, fig, a) {
    fillSil(c, s, fig);
    c.save();
    c.clip(s.mask);
    const g = c.createRadialGradient(36, 30, 0, 36, 30, 95);
    g.addColorStop(0, `rgba(255,255,255,${0.5 * a})`);
    g.addColorStop(0.3, "rgba(255,255,255,0)");
    g.addColorStop(0.55, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(0,0,0,${0.38 * a})`);
    c.fillStyle = g;
    c.fillRect(0, 0, 100, 110);
    c.restore();

    const { cx, cy, rx, ry } = s.box;
    c.save();
    c.translate(cx - rx * 0.38, cy - ry * 0.42);
    c.rotate(-0.6);
    c.fillStyle = `rgba(255,255,255,${0.75 * a})`;
    c.beginPath();
    c.ellipse(0, 0, rx * 0.26, ry * 0.13, 0, 0, Math.PI * 2);
    c.fill();
    c.restore();
  },

  gradient(c, s, fig, a) {
    const g = c.createLinearGradient(0, 10, 0, 100);
    g.addColorStop(0, shade(fig, 0.4 * a));
    g.addColorStop(1, shade(fig, -0.35 * a));
    fillSil(c, s, g);
  },

  glow(c, s, fig, a, k) {
    c.save();
    c.shadowColor = shade(fig, 0.3);
    c.shadowBlur = (3 + 16 * a) * k;
    fillSil(c, s, fig);
    fillSil(c, s, fig);
    c.restore();
    fillSil(c, s, fig);
  },

  // White die-cut outline with a soft drop shadow
  sticker(c, s, fig, a, k) {
    c.save();
    c.shadowColor = `rgba(0,0,0,${0.18 + 0.22 * a})`;
    c.shadowBlur = 5 * k;
    c.shadowOffsetY = 1.6 * k;
    c.strokeStyle = "#fff";
    c.lineWidth = (1 + 3 * a) * 2;
    c.lineJoin = "round";
    fillSil(c, s, "#fff");
    s.paths.forEach((p) => c.stroke(p));
    c.restore();
    fillSil(c, s, fig);
  },

  grain(c, s, fig, a, k, size) {
    fillSil(c, s, fig);
    c.save();
    c.clip(s.mask);
    const pat = c.createPattern(noiseTile(), "repeat");
    pat.setTransform(new DOMMatrix().scale(Math.max(size / 720, 0.6) / k));
    c.globalCompositeOperation = "overlay";
    c.globalAlpha = 0.25 + 0.7 * a;
    c.fillStyle = pat;
    c.fillRect(0, 0, 100, 110);
    c.restore();
  },

  // Dots grow from the top-left (small) to the bottom-right (large)
  halftone(c, s, fig, a) {
    fillSil(c, s, fig);
    c.save();
    c.clip(s.mask);
    c.fillStyle = shade(fig, -0.38);
    const step = 3.6;
    const gain = 0.35 + 0.65 * a;
    c.beginPath();
    for (let y = 0, row = 0; y < 112; y += step * 0.866, row++) {
      for (let x = row % 2 ? step / 2 : 0; x < 104; x += step) {
        const t = Math.min(1, Math.max(0, (x * 0.4 + y * 0.9 - 10) / 110));
        const r = step * 0.62 * gain * t;
        if (r > 0.12) {
          c.moveTo(x + r, y);
          c.arc(x, y, r, 0, Math.PI * 2);
        }
      }
    }
    c.fill();
    c.restore();
  },

  // RGB split plus a few shifted horizontal slices
  glitch(c, s, fig, a, k, size) {
    const d = 0.8 + 2.6 * a;
    c.save();
    c.globalAlpha = 0.9;
    c.translate(-d, 0);
    fillSil(c, s, "#00f0ff");
    c.translate(2 * d, 0);
    fillSil(c, s, "#ff2bd6");
    c.restore();
    fillSil(c, s, fig);

    const snap = document.createElement("canvas");
    snap.width = snap.height = size;
    snap.getContext("2d").drawImage(c.canvas, 0, 0);
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    const rnd = seeded(5);
    const n = 3 + Math.round(3 * a);
    for (let i = 0; i < n; i++) {
      const y = (28 + rnd() * 66) * k;
      const h = (2 + rnd() * 5) * k;
      const dx = (rnd() - 0.5) * 2 * (3 + 9 * a) * k;
      c.clearRect(0, y, size, h);
      c.drawImage(snap, 0, y, size, h, dx, y, size, h);
    }
    c.restore();
  },

  // Renders the silhouette small, hard-thresholds the edge, scales it up without smoothing
  pixel(c, s, fig, a, k) {
    const cell = 1.6 + 3.4 * a;
    const n = Math.ceil(100 / cell);
    const small = document.createElement("canvas");
    small.width = small.height = n;
    const sc = small.getContext("2d");
    sc.scale(n / 100, n / 100);
    fillSil(sc, s, fig);
    const img = sc.getImageData(0, 0, n, n);
    for (let i = 3; i < img.data.length; i += 4) {
      img.data[i] = img.data[i] > 110 ? 255 : 0;
    }
    sc.setTransform(1, 0, 0, 1, 0, 0);
    sc.putImageData(img, 0, 0);
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.imageSmoothingEnabled = false;
    c.drawImage(small, 0, 0, n * cell * k, n * cell * k);
    c.restore();
  },

  // Pastel rainbow foil with a diagonal sheen
  holo(c, s, fig, a) {
    fillSil(c, s, fig);
    c.save();
    c.clip(s.mask);
    const g = c.createLinearGradient(10, 10, 95, 105);
    const cols = ["#ff9ad5", "#ffd59a", "#f6ff9a", "#9affc7", "#9ad8ff", "#c49aff", "#ff9ad5"];
    cols.forEach((col, i) => g.addColorStop(i / (cols.length - 1), col));
    c.globalAlpha = 0.2 + 0.65 * a;
    c.fillStyle = g;
    c.fillRect(0, 0, 100, 110);
    const sh = c.createLinearGradient(0, 0, 100, 100);
    sh.addColorStop(0.35, "rgba(255,255,255,0)");
    sh.addColorStop(0.5, `rgba(255,255,255,${0.55 * a})`);
    sh.addColorStop(0.65, "rgba(255,255,255,0)");
    c.globalAlpha = 1;
    c.fillStyle = sh;
    c.fillRect(0, 0, 100, 110);
    c.restore();
  },
};

// Paints the silhouette (head + body paths, in 0-100 units) onto `target` with the chosen shader.
// `box` is the head ellipse, used by effects that need to find the head.
export function renderFigure(target, size, { paths, box }, figure, id, amount = DEFAULT_SHADER_AMOUNT) {
  const k = size / 100;
  const mask = new Path2D();
  paths.forEach((p) => mask.addPath(p));

  const layer = document.createElement("canvas");
  layer.width = layer.height = size;
  const c = layer.getContext("2d");
  c.scale(k, k);
  (EFFECTS[id] ?? EFFECTS.none)(c, { paths, box, mask }, figure, amount / 100, k, size);
  target.drawImage(layer, 0, 0);
}
