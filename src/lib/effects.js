// Efek untuk huruf. Setiap efek hanya mengubah lapisan huruf (gradient & dekor tetap).
export const EFFECTS = [
  { id: "none", name: "Off" },
  { id: "fisheye", name: "Fisheye" },
];

export const DEFAULT_EFFECT = { id: "none", amount: 100, weight: 50 };

const SQRT2 = Math.SQRT2;

/**
 * Fisheye "huruf memenuhi lingkaran" seperti referensi (monogram ME).
 *
 * Cara kerja: kotak pembatas (bounding box) huruf dipetakan ke sebuah lingkaran memakai
 * pemetaan elips (disc <-> square). Sudut-sudut huruf ditarik masuk mengikuti lengkung
 * lingkaran, sedangkan bagian tengah membesar, jadi tepi huruf melengkung seperti lensa.
 * `amount` 0-100 mencampur bentuk asli (0) sampai penuh jadi lingkaran (100).
 *
 * Dihitung per piksel (inverse mapping + sampling bilinear pada alpha) supaya tepi tetap
 * halus, baik di preview 720px maupun HD 4028px.
 *
 * Mengembalikan y bagian atas huruf (untuk posisi dekor "top").
 */
export function drawFisheyeLetter(
  ctx,
  size,
  { letter, font, px, ink, amount, weight = 50 },
) {
  const s = Math.min(1, Math.max(0, amount / 100));
  const R = size * 0.38; // jari-jari lingkaran hasil
  const spec = (p) => `${font.weight} ${p}px ${font.family}`;
  const cx = size / 2;
  const cy = size / 2;

  // 1) ukur huruf pada ukuran asli
  const meas = document.createElement("canvas").getContext("2d");
  meas.font = spec(px);
  const m0 = meas.measureText(letter);
  const hw0 = (m0.actualBoundingBoxLeft + m0.actualBoundingBoxRight) / 2;
  const hh0 = (m0.actualBoundingBoxAscent + m0.actualBoundingBoxDescent) / 2;
  if (!hw0 || !hh0) return cy;

  // 2) render huruf ke kanvas sumber, dibesarkan (g) agar tidak pecah saat diregangkan
  const g = Math.min(2.5, Math.max(1, 1 + (Math.max(R / hw0, R / hh0) - 1) * s));
  const src = document.createElement("canvas");
  const sctx = src.getContext("2d", { willReadFrequently: true });
  // `weight` (0-100): menebalkan huruf lewat stroke + merapatkan jarak antarhuruf,
  // supaya hasilnya gemuk seperti monogram referensi, bukan ramping.
  const sw = px * g * 0.3 * (weight / 100);
  const setup = (c) => {
    c.font = spec(px * g);
    if ("letterSpacing" in c) {
      c.letterSpacing = `${(-0.06 * px * g * weight) / 100}px`;
    }
    c.lineJoin = "round";
    c.lineWidth = sw;
  };
  setup(sctx);
  const m = sctx.measureText(letter);
  const bl = m.actualBoundingBoxLeft + sw / 2;
  const br = m.actualBoundingBoxRight + sw / 2;
  const asc = m.actualBoundingBoxAscent + sw / 2;
  const desc = m.actualBoundingBoxDescent + sw / 2;
  const pad = 3;
  const W = Math.ceil(bl + br) + pad * 2;
  const H = Math.ceil(asc + desc) + pad * 2;
  src.width = W;
  src.height = H;
  setup(sctx); // ukuran kanvas berubah -> state di-reset
  sctx.textAlign = "left";
  sctx.textBaseline = "alphabetic";
  sctx.fillStyle = "#000";
  sctx.strokeStyle = "#000";
  sctx.fillText(letter, pad + bl, pad + asc);
  if (sw > 0) sctx.strokeText(letter, pad + bl, pad + asc);
  const alpha = sctx.getImageData(0, 0, W, H).data;
  const scx = pad + (bl + br) / 2; // pusat bbox pada kanvas sumber
  const scy = pad + (asc + desc) / 2;
  const hw = (bl + br) / 2 / g; // setengah lebar/tinggi bbox dalam satuan "asli"
  const hh = (asc + desc) / 2 / g;

  // 3) petakan balik (tujuan -> sumber) hanya di area yang mungkin terisi
  const E = Math.min(
    Math.floor(size / 2),
    Math.ceil(Math.max(R, hw, hh) * 1.06) + 2,
  );
  const D = E * 2;
  const out = new ImageData(D, D);
  const px32 = out.data;
  const n = parseInt(ink.replace("#", "").slice(0, 6), 16);
  const ir = (n >> 16) & 255;
  const ig = (n >> 8) & 255;
  const ib = n & 255;

  for (let j = 0; j < D; j++) {
    const dy = j - E + 0.5;
    for (let i = 0; i < D; i++) {
      const dx = i - E + 0.5;
      const nx = dx / R;
      const ny = dy / R;
      const r = Math.hypot(nx, ny);

      // disc -> square (elliptical grid mapping); di luar lingkaran diperpanjang linear
      const k = r > 1 ? 1 / r : 1;
      const x = nx * k;
      const y = ny * k;
      const x2 = x * x;
      const y2 = y * y;
      const u =
        0.5 * Math.sqrt(Math.max(0, 2 + x2 - y2 + 2 * SQRT2 * x)) -
        0.5 * Math.sqrt(Math.max(0, 2 + x2 - y2 - 2 * SQRT2 * x));
      const v =
        0.5 * Math.sqrt(Math.max(0, 2 - x2 + y2 + 2 * SQRT2 * y)) -
        0.5 * Math.sqrt(Math.max(0, 2 - x2 + y2 - 2 * SQRT2 * y));
      const sk = r > 1 ? r : 1;

      const natX = (1 - s) * dx + s * u * sk * hw;
      const natY = (1 - s) * dy + s * v * sk * hh;
      const sx = scx + natX * g - 0.5;
      const sy = scy + natY * g - 0.5;
      if (sx < 0 || sy < 0 || sx > W - 1 || sy > H - 1) continue;

      // bilinear pada kanal alpha
      const x0 = sx | 0;
      const y0 = sy | 0;
      const x1 = Math.min(x0 + 1, W - 1);
      const y1 = Math.min(y0 + 1, H - 1);
      const fx = sx - x0;
      const fy = sy - y0;
      const a =
        (alpha[(y0 * W + x0) * 4 + 3] * (1 - fx) +
          alpha[(y0 * W + x1) * 4 + 3] * fx) *
          (1 - fy) +
        (alpha[(y1 * W + x0) * 4 + 3] * (1 - fx) +
          alpha[(y1 * W + x1) * 4 + 3] * fx) *
          fy;
      if (a < 1) continue;

      const o = (j * D + i) * 4;
      px32[o] = ir;
      px32[o + 1] = ig;
      px32[o + 2] = ib;
      px32[o + 3] = a;
    }
  }

  const layer = document.createElement("canvas");
  layer.width = D;
  layer.height = D;
  layer.getContext("2d").putImageData(out, 0, 0);
  ctx.drawImage(layer, Math.round(cx - E), Math.round(cy - E));

  return cy - ((1 - s) * hh + s * R);
}
