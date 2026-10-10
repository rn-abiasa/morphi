import {
  ACCENTS,
  DEFAULT_FACE,
  HAIR_COLORS,
  OUTFIT_COLORS,
  SKINS,
  hsl,
} from "./face";

// Bobot kemunculan saat wajah diacak: makin kecil = makin langka.
// Nilai yang tidak tercantum dianggap berbobot 1.
const W = {
  eyes: { pill: 5, oval: 4, round: 4, sparkle: 2, dot: 3, happy: 3, sleepy: 2 },
  hair: {
    spiky: 4, messy: 4, bangs: 5, sweep: 4, short: 5, curtain: 3,
    bob: 3, hime: 2, buns: 2, curly: 2, punk: 1, sanggul: 1.5, none: 0.3,
  },
  brows: { none: 5, soft: 3, flat: 2, angry: 1.5, sad: 1.5, dots: 1 },
  mouth: { none: 4, dot: 3, smile: 4, cat: 2, open: 1.5 },
  blush: { soft: 6, lines: 2, none: 2 },
  marks: { none: 10, freckles: 3, mole: 2, plaster: 1 },
  glasses: { none: 12, round: 3, square: 3, shades: 1.5, heart: 1 },
  head: {
    none: 12, clip: 2.5, band: 2, beanie: 2, ears: 1.5, bow: 2, crown: 0.8,
    melati: 1, cunduk: 1, kamboja: 1.2, blangkon: 1, iket: 1, peci: 1.2,
    siger: 0.6, ahoge: 2.5, pompom: 1.2, earmuffs: 1, bearhood: 0.8,
  },
  bg: {
    sky: 4, sunset: 3, night: 3, sawah: 2, batik: 1.5, blossom: 2.5,
    solid: 4, rain: 1.5, bokeh: 1.5, snowy: 1.5,
  },
  outfit: {
    tee: 5, hoodie: 4, batik: 2.5, koko: 2, beskap: 1, pangsi: 1,
    solo: 0.8, sunda: 0.8, bali: 0.8, sweater: 3, cardigan: 2, scarf: 2, blanket: 1.2,
  },
  prop: { none: 10, mug: 2, boba: 2, cat: 1, plush: 1 },
  fx: { none: 9, sparkle: 2, hearts: 1.2, snow: 1.2, petals: 1.2 },
};

const total = (t) => Object.values(t).reduce((a, b) => a + b, 0);
const bits = (t, v) => -Math.log2((t[v] ?? 1) / total(t));

function wpick(t, rng) {
  let x = rng() * total(t);
  for (const [k, w] of Object.entries(t)) {
    x -= w;
    if (x <= 0) return k;
  }
  return Object.keys(t)[0];
}

const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const choice = (a, rng) => a[Math.floor(rng() * a.length)];
const between = (a, b, rng) => a + rng() * (b - a);

// Pengacak berbobot. `frame` menentukan apakah sifat khusus Portrait ikut diacak.
export function randomFace(rng = Math.random, frame = "closeup") {
  return {
    frame,
    skin: choice(SKINS, rng),
    eyes: wpick(W.eyes, rng),
    hair: wpick(W.hair, rng),
    hairColor:
      rng() < 0.8
        ? choice(HAIR_COLORS, rng)
        : hsl(between(0, 360, rng), between(50, 75, rng), between(68, 82, rng)),
    streak:
      rng() < 0.12
        ? hsl(between(0, 360, rng), between(65, 90, rng), between(60, 72, rng))
        : null,
    brows: wpick(W.brows, rng),
    mouth: wpick(W.mouth, rng),
    blush: wpick(W.blush, rng),
    marks: wpick(W.marks, rng),
    glasses: wpick(W.glasses, rng),
    head: wpick(W.head, rng),
    accent: choice(ACCENTS, rng),
    bg: wpick(W.bg, rng),
    bgColor: hsl(between(0, 360, rng), between(55, 85, rng), between(78, 90, rng)),
    outfit: wpick(W.outfit, rng),
    outfitColor: choice(OUTFIT_COLORS, rng),
    prop: wpick(W.prop, rng),
    fx: wpick(W.fx, rng),
    tilt: +between(-0.8, 0.8, rng).toFixed(2),
    shift: +between(-0.6, 0.6, rng).toFixed(2),
    round: +between(-0.6, 0.9, rng).toFixed(2),
    spacing: +between(-0.9, 0.9, rng).toFixed(2),
    eyeY: +between(-0.7, 0.9, rng).toFixed(2),
    eyeSize: +between(0.85, 1.2, rng).toFixed(2),
  };
}

// Skor kelangkaan = jumlah "bit kejutan" dari sifat-sifat wajah (makin tinggi makin langka)
export function rarityScore(c) {
  let s = 0;
  for (const k of ["eyes", "hair", "brows", "mouth", "blush", "marks", "glasses", "head"]) {
    s += bits(W[k], c[k]);
  }
  s += c.streak ? -Math.log2(0.12) : -Math.log2(0.88);
  s += HAIR_COLORS.includes(c.hairColor) ? -Math.log2(0.8 / 8) : 6; // warna kustom = unik
  if (c.frame === "portrait") {
    for (const k of ["bg", "outfit", "prop", "fx"]) s += bits(W[k], c[k]);
  }
  return s;
}

// Distribusi skor dari 4000 wajah acak (deterministik), dipakai untuk menghitung peringkat persentase
const cache = {};
function distribution(frame) {
  if (!cache[frame]) {
    const rng = mulberry32(frame === "portrait" ? 2 : 1);
    const list = [];
    for (let i = 0; i < 4000; i++) list.push(rarityScore(randomFace(rng, frame)));
    cache[frame] = list.sort((a, b) => a - b);
  }
  return cache[frame];
}

export const TIERS = {
  common: { label: "Common", color: "#8e8e93" },
  uncommon: { label: "Uncommon", color: "#30b25a" },
  rare: { label: "Rare", color: "#0a84ff" },
  epic: { label: "Epic", color: "#bf5af2" },
  legendary: { label: "Legendary", color: "#f5a800" },
};

export function rarityInfo(cfg) {
  const c = { ...DEFAULT_FACE, ...cfg };
  const frame = c.frame === "portrait" ? "portrait" : "closeup";
  const list = distribution(frame);
  const score = rarityScore(c);

  // cari posisi pertama yang skornya >= skor wajah ini
  let lo = 0;
  let hi = list.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid] < score) lo = mid + 1;
    else hi = mid;
  }
  const top = Math.max(0.1, ((list.length - lo) / list.length) * 100);

  const tier =
    top <= 0.5 ? "legendary" : top <= 3 ? "epic" : top <= 12 ? "rare" : top <= 35 ? "uncommon" : "common";
  return { tier, top, score, ...TIERS[tier] };
}

export const formatTop = (top) => (top < 10 ? top.toFixed(1) : String(Math.round(top)));
