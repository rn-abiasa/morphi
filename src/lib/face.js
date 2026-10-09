// ---------- util warna ----------
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));
const toRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r, g, b) =>
  "#" + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("");
export const mix = (a, b, t) => {
  const A = toRgb(a);
  const B = toRgb(b);
  return toHex(...A.map((v, i) => v + (B[i] - v) * t));
};
const luma = (h) => {
  const [r, g, b] = toRgb(h);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const hsl = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return toHex(f(0) * 255, f(8) * 255, f(4) * 255);
};

// ---------- palet ----------
export const SKINS = [
  "#FDF0E4",
  "#F8D9C0",
  "#EBC09A",
  "#D69E78",
  "#A9714B",
  "#6E4630",
];
export const HAIR_COLORS = [
  "#CBDAF3",
  "#F5A3B8",
  "#C9B6F2",
  "#F2F2F2",
  "#E8C27A",
  "#E4572E",
  "#5B3A29",
  "#2A2528",
];
export const ACCENTS = [
  "#ff6fa5",
  "#ffd24a",
  "#7aa7ff",
  "#6fd6a8",
  "#b48cff",
  "#ff8a5c",
  "#1d1c1d",
  "#ffffff",
];

const INK = "#1d1c1d";
// cermin horizontal untuk bagian kanan
const mir = (s) => `<g transform="matrix(-1 0 0 1 256 0)">${s}</g>`;
const A = (frag) => frag + mir(frag);
const strand = (x, lean, h, w = 8) =>
  `<path d="M${x} 0Q${x + lean} ${h / 2} ${x + lean / 2} ${h}H${x + lean / 2 + w}Q${x + lean + w} ${h / 2} ${x + w} 0Z"/>`;

// ---------- mata (koordinat lokal, pusat di 0,0) ----------
export const EYES = [
  {
    id: "pill",
    draw: () =>
      `<rect x="-14" y="-33" width="28" height="66" rx="14" fill="${INK}"/>`,
  },
  { id: "oval", draw: () => `<ellipse rx="17" ry="28" fill="${INK}"/>` },
  {
    id: "round",
    draw: () =>
      `<circle r="21" fill="${INK}"/><circle cx="7" cy="-9" r="6.5" fill="#fff"/>`,
  },
  {
    id: "sparkle",
    draw: () =>
      `<rect x="-15" y="-35" width="30" height="70" rx="15" fill="${INK}"/><circle cx="-3" cy="-15" r="7.5" fill="#fff"/><circle cx="5" cy="17" r="3.5" fill="#fff"/>`,
  },
  { id: "dot", draw: () => `<circle r="11" fill="${INK}"/>` },
  {
    id: "happy",
    draw: () =>
      `<path d="M-19 11Q0 -21 19 11" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`,
  },
  {
    id: "sleepy",
    draw: () => `<path d="M-19 -4H19A19 19 0 0 1 -19 -4Z" fill="${INK}"/>`,
  },
];

// ---------- rambut: tiap gaya punya motif bayangan & kilau sendiri ----------
export const HAIRS = [
  {
    id: "spiky",
    d: "M0 0H256V92L240 72 220 124 192 66 164 132 128 62 98 128 70 68 44 120 22 74 0 100Z",
    shade: `<path d="M192 66L220 124L206 64Z"/><path d="M128 62L164 132L146 60Z"/><path d="M70 68L98 128L84 64Z"/><path d="M22 74L44 120L34 70Z"/>`,
    shine: `<path d="M84 18Q128 0 172 18Q128 32 84 18Z"/>`,
  },
  {
    id: "messy",
    d: "M0 0H256V80L246 108 232 78 214 130 198 84 176 118 160 70 138 126 120 66 100 112 82 74 62 128 46 84 28 114 12 78 0 96Z",
    shade: `<path d="M198 84L214 130L208 60Z"/><path d="M160 70L138 126L154 52Z"/><path d="M120 66L100 112L116 48Z"/><path d="M82 74L62 128L78 54Z"/><path d="M46 84L28 114L40 60Z"/>`,
    shine: `<path d="M56 24Q96 6 140 22Q96 34 56 24Z"/>`,
  },
  {
    id: "bangs",
    d: "M0 0H256V88Q236 104 216 90Q192 116 164 92Q146 108 128 94Q110 108 92 92Q64 116 40 90Q20 104 0 88Z",
    shade:
      strand(34, -8, 98) +
      strand(88, 7, 100) +
      strand(150, -6, 100) +
      strand(204, 8, 98),
    shine: strand(60, -4, 76, 6) + strand(178, 4, 76, 6),
  },
  {
    id: "sweep",
    d: "M0 0H256V64Q214 62 172 96Q140 120 96 118Q52 112 22 118Q8 122 0 124Z",
    shade: `<path d="M0 18Q110 16 192 84L172 96Q104 40 0 38Z"/><path d="M0 62Q72 66 112 108L94 116Q60 82 0 84Z"/>`,
    shine: `<path d="M24 8Q104 6 164 46Q100 28 24 24Z"/>`,
  },
  {
    id: "short",
    d: "M0 0H256V56Q192 80 128 80Q64 80 0 56Z",
    shade:
      strand(38, -8, 66) +
      strand(94, 0, 76, 7) +
      strand(158, 0, 76, 7) +
      strand(212, 8, 66),
    shine: `<path d="M70 14Q128 -2 186 14Q128 28 70 14Z"/>`,
  },
  {
    id: "curtain",
    d: "M0 0H256V150Q236 110 190 96Q150 84 128 60Q106 84 66 96Q20 110 0 150Z",
    shade: A(
      `<path d="M128 62Q80 92 30 128L16 152Q66 100 128 78Z"/><path d="M128 64Q96 80 66 92L60 104Q96 90 128 72Z"/>`,
    ),
    shine: A(`<path d="M120 36Q70 58 30 100Q70 68 120 50Z"/>`),
  },
  {
    id: "bob",
    d: "M0 0H256V256H226V112Q200 84 128 84Q56 84 30 112V256H0Z",
    shade:
      `<path d="M30 112Q56 84 128 84Q200 84 226 112L214 114Q190 96 128 96Q66 96 42 114Z"/>` +
      A(`<path d="M30 112Q38 180 30 256H12Q22 180 18 112Z"/>`),
    shine: `<path d="M60 40Q128 14 196 40Q128 54 60 40Z"/>`,
  },
  {
    id: "hime",
    d: "M0 0H256V256H240V110Q232 100 214 96Q190 116 164 92Q146 108 128 94Q110 108 92 92Q66 116 42 96Q24 100 16 110V256H0Z",
    shade:
      strand(66, -4, 100, 7) +
      strand(120, 3, 96, 7) +
      strand(174, 4, 100, 7) +
      A(`<path d="M16 110Q22 180 18 256H4Q10 180 6 110Z"/>`),
    shine: `<path d="M70 26Q128 6 186 26Q128 40 70 26Z"/>`,
  },
  {
    id: "buns",
    d: "M0 0H256V70Q128 54 0 70Z M12 84a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z M188 84a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z",
    shade:
      A(`<circle cx="46" cy="92" r="15"/>`) +
      strand(98, 0, 62, 7) +
      strand(152, 0, 62, 7),
    shine: A(`<circle cx="30" cy="74" r="7"/>`),
  },
  {
    id: "curly",
    d: "M0 0H256V90Q256 112 238 112Q232 130 212 126Q202 144 182 134Q168 148 150 134Q134 146 118 134Q100 148 84 134Q66 144 56 126Q36 130 30 112Q12 112 0 98Z",
    shade: `<circle cx="30" cy="94" r="9"/><circle cx="72" cy="104" r="10"/><circle cx="112" cy="106" r="10"/><circle cx="152" cy="106" r="10"/><circle cx="190" cy="104" r="10"/><circle cx="228" cy="94" r="9"/><circle cx="60" cy="40" r="14"/><circle cx="196" cy="40" r="14"/><circle cx="128" cy="30" r="12"/>`,
    shine: `<circle cx="52" cy="26" r="7"/><circle cx="150" cy="18" r="6"/><circle cx="212" cy="30" r="5"/>`,
  },
  {
    id: "punk",
    d: "M84 0H172V74L158 124 142 66 128 132 114 66 98 124 84 74Z",
    shade: `<path d="M84 0H102L98 124L84 74Z"/><path d="M158 124L172 74V0H160Z"/>`,
    shine: `<path d="M120 0H136V54H120Z"/>`,
  },
  { id: "none", d: "", shade: "", shine: "" },
];

// ---------- opsi detail ----------
export const OPTIONS = {
  brows: ["none", "soft", "flat", "angry", "sad", "dots"],
  mouth: ["none", "dot", "smile", "cat", "open"],
  blush: ["soft", "lines", "none"],
  marks: ["none", "freckles", "mole", "plaster"],
  glasses: ["none", "round", "square", "shades", "heart"],
  head: ["none", "clip", "band", "beanie", "ears", "bow", "crown"],
};

export const DEFAULT_FACE = {
  skin: SKINS[0],
  eyes: "pill",
  hair: "spiky",
  hairColor: HAIR_COLORS[0],
  streak: null,
  brows: "none",
  mouth: "none",
  blush: "soft",
  marks: "none",
  glasses: "none",
  head: "none",
  accent: ACCENTS[0],
  spacing: 0, // -1..1  (jarak antar mata)
  eyeY: 0, // -1..1  (tinggi mata)
  eyeSize: 1, // 0.8..1.25
};

// ---------- bagian-bagian ----------
function brows(type, x, y, color, flip) {
  const w = `stroke="${color}" stroke-width="7" stroke-linecap="round" fill="none"`;
  const shapes = {
    soft: `<path d="M-16 4Q0 -6 16 4" ${w}/>`,
    flat: `<path d="M-15 0H15" ${w}/>`,
    angry: `<path d="M-16 -5L16 5" ${w}/>`,
    sad: `<path d="M-16 5L16 -4" ${w}/>`,
    dots: `<circle r="5.5" fill="${color}"/>`,
  };
  if (!shapes[type]) return "";
  return `<g transform="translate(${x} ${y})${flip ? " scale(-1 1)" : ""}">${shapes[type]}</g>`;
}

function mouth(type, color) {
  const shapes = {
    dot: `<ellipse rx="5" ry="6.5" fill="${color}"/>`,
    smile: `<path d="M-13 -3Q0 12 13 -3" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`,
    cat: `<path d="M-17 -2Q-8 11 0 -1Q8 11 17 -2" fill="none" stroke="${color}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    open: `<path d="M-13 -4H13Q13 15 0 15Q-13 15 -13 -4Z" fill="${color}"/><ellipse cy="10" rx="6" ry="4" fill="#ff8a9a"/>`,
  };
  return shapes[type]
    ? `<g transform="translate(128 207)">${shapes[type]}</g>`
    : "";
}

function glasses(type, lx, rx, cy, gs, accent) {
  const lens = `fill="rgba(255,255,255,0.2)" stroke="${INK}" stroke-width="6"`;
  const frames = {
    round: `<circle r="36" ${lens}/>`,
    square: `<rect x="-36" y="-34" width="72" height="68" rx="20" ${lens}/>`,
    shades: `<rect x="-38" y="-30" width="76" height="60" rx="26" fill="${INK}" opacity="0.92"/><path d="M-26 -14L-8 -21" stroke="#fff" opacity="0.35" stroke-width="5" stroke-linecap="round"/>`,
    heart: `<path d="M0 26C-42 -2 -36 -36 -15 -34C-6 -33 0 -26 0 -20C0 -26 6 -33 15 -34C36 -36 42 -2 0 26Z" fill="${accent}" fill-opacity="0.55" stroke="${mix(accent, "#000000", 0.25)}" stroke-width="5" stroke-linejoin="round"/>`,
  };
  if (!frames[type]) return "";
  const bridge = `<path d="M${lx + 30 * gs} ${cy - 4}Q128 ${cy - 14} ${rx - 30 * gs} ${cy - 4}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  const one = (x) =>
    `<g transform="translate(${x} ${cy}) scale(${gs})">${frames[type]}</g>`;
  return bridge + one(lx) + one(rx);
}

function headwear(type, accent, hairColor) {
  const dk = mix(accent, "#000000", 0.14);
  const parts = {
    clip: `<g transform="translate(206 62)"><rect x="-21" y="-5.5" width="42" height="11" rx="5.5" fill="${accent}" transform="rotate(35)"/><rect x="-21" y="-5.5" width="42" height="11" rx="5.5" fill="${accent}" transform="rotate(-35)"/><circle r="4.5" fill="#fff" opacity="0.75"/></g>`,
    band: `<path d="M-4 76Q128 16 260 76" fill="none" stroke="${accent}" stroke-width="18"/><path d="M-4 70Q128 10 260 70" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="3"/>`,
    beanie: `<path d="M0 0H256V80Q128 62 0 80Z" fill="${accent}"/><path d="M0 62Q128 44 256 62V86Q128 68 0 86Z" fill="${dk}"/><path d="M0 62Q128 44 256 62" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="3"/>`,
    ears: `<g stroke-linejoin="round"><path d="M32 70L50 2L102 46Z" fill="${hairColor}" stroke="${hairColor}" stroke-width="6"/><path d="M224 70L206 2L154 46Z" fill="${hairColor}" stroke="${hairColor}" stroke-width="6"/></g><path d="M50 52L58 22L82 42Z" fill="#ffb3c6"/><path d="M206 52L198 22L174 42Z" fill="#ffb3c6"/>`,
    bow: `<g transform="translate(200 54)"><path d="M0 0L-36 -18Q-46 0 -36 18Z" fill="${accent}"/><path d="M0 0L36 -18Q46 0 36 18Z" fill="${accent}"/><circle r="10" fill="${dk}"/></g>`,
    crown: `<path d="M78 56L90 16L110 40L128 8L146 40L166 16L178 56Z" fill="#ffd24a" stroke="#e0a800" stroke-width="5" stroke-linejoin="round"/><circle cx="128" cy="40" r="5" fill="${accent}"/>`,
  };
  return parts[type] || "";
}

function marks(type, color) {
  const dots = [
    [-14, -6],
    [-2, -12],
    [10, -4],
    [-8, 6],
    [4, 9],
    [16, 5],
  ];
  if (type === "freckles") {
    const one = dots
      .map(([x, y]) => `<circle cx="${52 + x}" cy="${208 + y}" r="2.8"/>`)
      .join("");
    return `<g fill="${color}">${one}${mir(one)}</g>`;
  }
  if (type === "mole") return `<circle cx="152" cy="224" r="4" fill="${color}"/>`;
  if (type === "plaster")
    return `<g transform="rotate(-24 196 204)"><rect x="168" y="194" width="56" height="20" rx="10" fill="#f3d3ae"/><rect x="188" y="194" width="16" height="20" fill="#e6b98c"/></g>`;
  return "";
}

// ---------- render ----------
export function faceSvg(input, size = 256) {
  const c = { ...DEFAULT_FACE, ...input };
  const eyes = EYES.find((e) => e.id === c.eyes) || EYES[0];
  const hair = HAIRS.find((h) => h.id === c.hair) || HAIRS[0];

  const lx = 56 + c.spacing * 14;
  const rx = 256 - lx;
  const cy = 165 + c.eyeY * 12;
  const k = c.eyeSize;
  const gs = Math.max(1, k * 0.95);

  // Semua warna turunan dihitung dari warna dasar pilihan pengguna
  const skinShade = mix(c.skin, "#8a4b2b", 0.16);
  const blushC = mix(c.skin, "#ff7a86", 0.3);
  const blushDark = mix(c.skin, "#e0525f", 0.45);
  const mouthC = mix(c.skin, "#2b1010", 0.72);
  const marksC = mix(c.skin, "#7a4b2b", 0.42);
  const dark = luma(c.hairColor) < 70;
  const hairShade = dark
    ? mix(c.hairColor, "#ffffff", 0.12)
    : mix(c.hairColor, "#1c1830", 0.14);
  const hairShine = mix(c.hairColor, "#ffffff", dark ? 0.22 : 0.5);
  const browC = mix(c.hairColor, "#1c1830", 0.5);

  const blush =
    c.blush === "soft"
      ? `<ellipse cx="52" cy="214" rx="27" ry="17" fill="${blushC}"/><ellipse cx="204" cy="214" rx="27" ry="17" fill="${blushC}"/>`
      : c.blush === "lines"
        ? (() => {
            const l = `<path d="M34 214l8-12M48 216l8-12M62 218l8-12"/>`;
            return `<g stroke="${blushDark}" stroke-width="4.5" stroke-linecap="round" fill="none">${l}${mir(l)}</g>`;
          })()
        : "";

  const eye = (x) =>
    `<g transform="translate(${x} ${cy}) scale(${k})">${eyes.draw()}</g>`;
  const browY = cy - 44 * k - 6;

  const hairLayer = hair.d
    ? `<path d="${hair.d}" fill="${c.hairColor}" stroke="${c.hairColor}" stroke-width="6" stroke-linejoin="round"/>
<g clip-path="url(#hc)">
<g fill="${hairShade}">${hair.shade}</g>
<g fill="${hairShine}" opacity="0.55">${hair.shine}</g>
${c.streak ? `<path d="M100 0H136L114 150H92Z" fill="${c.streak}"/>` : ""}
</g>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="${size}" height="${size}">
<defs>${hair.d ? `<clipPath id="hc"><path d="${hair.d}"/></clipPath>` : ""}</defs>
<rect width="256" height="256" fill="${c.skin}"/>
${hair.d ? `<path d="${hair.d}" transform="translate(0 12)" fill="${skinShade}"/>` : ""}
${blush}
${marks(c.marks, marksC)}
${brows(c.brows, lx, browY, browC, false)}${brows(c.brows, rx, browY, browC, true)}
${eye(lx)}${eye(rx)}
${mouth(c.mouth, mouthC)}
${hairLayer}
${headwear(c.head, c.accent, c.hairColor)}
${glasses(c.glasses, lx, rx, cy, gs, c.accent)}
</svg>`;
}

// ---------- ID unik & acak ----------
export function faceId(cfg) {
  const c = { ...DEFAULT_FACE, ...cfg };
  const s = JSON.stringify([
    c.skin,
    c.eyes,
    c.hair,
    c.hairColor,
    c.streak,
    c.brows,
    c.mouth,
    c.blush,
    c.marks,
    c.glasses,
    c.head,
    c.accent,
    +c.spacing.toFixed(2),
    +c.eyeY.toFixed(2),
    +c.eyeSize.toFixed(2),
  ]);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
}

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rand = (a, b) => a + Math.random() * (b - a);

export function randomFace() {
  return {
    skin: pick(SKINS),
    eyes: pick(EYES).id,
    hair: pick(HAIRS.filter((h) => h.id !== "none")).id,
    hairColor:
      Math.random() < 0.65
        ? pick(HAIR_COLORS)
        : hsl(rand(0, 360), rand(50, 75), rand(68, 82)),
    streak:
      Math.random() < 0.3
        ? hsl(rand(0, 360), rand(65, 90), rand(60, 72))
        : null,
    brows: pick(OPTIONS.brows),
    mouth: pick(OPTIONS.mouth),
    blush: pick(OPTIONS.blush),
    marks: Math.random() < 0.5 ? "none" : pick(OPTIONS.marks),
    glasses: Math.random() < 0.5 ? "none" : pick(OPTIONS.glasses),
    head: Math.random() < 0.5 ? "none" : pick(OPTIONS.head),
    accent: pick(ACCENTS),
    spacing: +rand(-0.9, 0.9).toFixed(2),
    eyeY: +rand(-0.7, 0.9).toFixed(2),
    eyeSize: +rand(0.85, 1.2).toFixed(2),
  };
}

// ---------- ekspor ----------
export const svgDataUrl = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const faceUrl = (cfg, size = 256) => svgDataUrl(faceSvg(cfg, size));

// Untuk download HD: gambar SVG ke canvas persegi
export async function renderFaceCanvas(cfg, size) {
  const img = new Image();
  img.src = faceUrl(cfg, size);
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  canvas.getContext("2d").drawImage(img, 0, 0, size, size);
  return canvas;
}
