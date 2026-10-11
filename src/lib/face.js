import {
  COZY_BGS,
  COZY_OUTFITS,
  cozyBg,
  cozyDefs,
  cozyFx,
  cozyHead,
  cozyOutfit,
  cozyProp,
  foilLayer,
} from "./cozy";

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
export const hsl = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return toHex(f(0) * 255, f(8) * 255, f(4) * 255);
};

// ---------- palet ----------
export const SKINS = ["#FDF0E4", "#F8D9C0", "#EBC09A", "#D69E78", "#A9714B", "#6E4630"];
export const HAIR_COLORS = [
  "#CBDAF3", "#F5A3B8", "#C9B6F2", "#F2F2F2",
  "#E8C27A", "#E4572E", "#5B3A29", "#2A2528",
];
export const ACCENTS = [
  "#ff6fa5", "#ffd24a", "#7aa7ff", "#6fd6a8",
  "#b48cff", "#ff8a5c", "#1d1c1d", "#ffffff",
];

const INK = "#241a22"; // hitam hangat keunguan, bukan hitam murni
// cermin horizontal untuk bagian kanan
const mir = (s) => `<g transform="matrix(-1 0 0 1 256 0)">${s}</g>`;
const A = (frag) => frag + mir(frag);
const strand = (x, lean, h, w = 8) =>
  `<path d="M${x} 0Q${x + lean} ${h / 2} ${x + lean / 2} ${h}H${x + lean / 2 + w}Q${x + lean + w} ${h / 2} ${x + w} 0Z"/>`;

// ---------- mata (koordinat lokal, pusat di 0,0) ----------
export const EYES = [
  { id: "pill", draw: () => `<rect x="-14" y="-33" width="28" height="66" rx="14" fill="${INK}"/>` },
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
  { id: "sleepy", draw: () => `<path d="M-19 -4H19A19 19 0 0 1 -19 -4Z" fill="${INK}"/>` },
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
    shade: strand(34, -8, 98) + strand(88, 7, 100) + strand(150, -6, 100) + strand(204, 8, 98),
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
    shade: strand(38, -8, 66) + strand(94, 0, 76, 7) + strand(158, 0, 76, 7) + strand(212, 8, 66),
    shine: `<path d="M70 14Q128 -2 186 14Q128 28 70 14Z"/>`,
  },
  {
    id: "curtain",
    d: "M0 0H256V150Q236 110 190 96Q150 84 128 60Q106 84 66 96Q20 110 0 150Z",
    shade: A(`<path d="M128 62Q80 92 30 128L16 152Q66 100 128 78Z"/><path d="M128 64Q96 80 66 92L60 104Q96 90 128 72Z"/>`),
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
      strand(66, -4, 100, 7) + strand(120, 3, 96, 7) + strand(174, 4, 100, 7) +
      A(`<path d="M16 110Q22 180 18 256H4Q10 180 6 110Z"/>`),
    shine: `<path d="M70 26Q128 6 186 26Q128 40 70 26Z"/>`,
  },
  {
    id: "buns",
    d: "M0 0H256V70Q128 54 0 70Z M12 84a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z M188 84a28 28 0 1 0 56 0a28 28 0 1 0 -56 0Z",
    shade: A(`<circle cx="46" cy="92" r="15"/>`) + strand(98, 0, 62, 7) + strand(152, 0, 62, 7),
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
  {
    // Sanggul/konde: cocok dipadukan dengan kebaya. Bagian `extra` muncul di atas kepala (mode Portrait)
    id: "sanggul",
    d: "M0 0H256V86Q226 78 188 100Q156 116 128 90Q100 116 68 100Q30 78 0 86Z",
    shade:
      `<path d="M128 90Q100 116 68 100Q104 100 128 78Z"/><path d="M128 90Q156 116 188 100Q152 100 128 78Z"/>` +
      strand(60, -6, 80, 7) + strand(190, 6, 80, 7),
    shine: `<path d="M70 26Q128 8 186 26Q128 40 70 26Z"/>`,
    extra: (c, sh) =>
      `<circle cx="128" cy="-8" r="36" fill="${c}" stroke="${c}" stroke-width="4"/><path d="M104 -20Q128 -40 152 -20Q128 -28 104 -20Z" fill="${sh}"/><path d="M96 0Q128 22 160 0" fill="none" stroke="${sh}" stroke-width="5" stroke-linecap="round"/>`,
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
  head: [
    "none", "clip", "band", "beanie", "ears", "bow", "crown",
    "melati", "cunduk", "kamboja", "blangkon", "iket", "peci", "siger", "ahoge",
    "pompom", "earmuffs", "bearhood",
  ],
  prop: ["none", "mug", "boba", "cat", "plush"],
  fx: ["none", "sparkle", "hearts", "snow", "petals"],
  shine: ["none", "dot", "sparkle"],
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
  frame: "closeup", // closeup | portrait
  bg: "solid",
  bgColor: "#8dc4ec",
  outfit: "tee",
  outfitColor: "#2b2b33",
  spacing: 0, // -1..1  (jarak antar mata)
  eyeY: 0, // -1..1  (tinggi mata)
  eyeSize: 1, // 0.8..1.25
  tilt: -0.55, // -1..1  (miringkan kepala, mode Portrait)
  shift: -0.3, // -1..1  (geser kepala kiri/kanan, mode Portrait)
  prop: "none", // benda kecil di bawah (Portrait)
  fx: "none", // efek melayang di latar (Portrait)
  round: 0, // -1..1  (kepala makin bulat/"mochi", Portrait)
  foil: true, // tampilkan foil untuk tier Epic ke atas
  shine: "sparkle", // kilau di mata: none | dot | sparkle
  grain: true, // butiran film halus (khas Morpli)
};

// ---------- bagian-bagian ----------
function eyeShine(id, mode) {
  const pos = { pill: [-3, -18, 1], oval: [-4, -14, 0.9], dot: [-3, -3, 0.6] }[id];
  if (!pos || mode === "none") return "";
  const [x, y, k] = pos;
  const second = id !== "dot";
  if (mode === "dot") {
    return (
      `<circle cx="${x}" cy="${y}" r="${5 * k}" fill="#fff" opacity="0.95"/>` +
      (second ? `<circle cx="${-x + 2}" cy="${-y - 1}" r="2.6" fill="#fff" opacity="0.8"/>` : "")
    );
  }
  // kilau bintang bersudut empat = tanda khas Morpli
  const star = "M0-8L2.4-2.4 8 0 2.4 2.4 0 8-2.4 2.4-8 0-2.4-2.4Z";
  return (
    `<path d="${star}" transform="translate(${x} ${y}) scale(${k})" fill="#fff"/>` +
    (second ? `<path d="${star}" transform="translate(${-x + 2} ${-y - 1}) scale(0.38)" fill="#fff" opacity="0.9"/>` : "")
  );
}

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
  return shapes[type] ? `<g transform="translate(128 207)">${shapes[type]}</g>` : "";
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
  const one = (x) => `<g transform="translate(${x} ${cy}) scale(${gs})">${frames[type]}</g>`;
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
    // --- hiasan kepala lokal (gaya disederhanakan) ---
    melati: (() => {
      const pts = [[150, 30], [172, 44], [192, 62], [208, 84], [220, 108], [226, 134], [226, 160], [222, 184]];
      return (
        `<path d="M${pts.map((p) => p.join(" ")).join("L")}" fill="none" stroke="#5aa86a" stroke-width="2.5"/>` +
        pts.map(([x, y]) => `<g transform="translate(${x} ${y})"><circle r="8" fill="#fffdf5" stroke="#e7e0c9" stroke-width="1.2"/><circle r="2.6" fill="#f5c542"/></g>`).join("")
      );
    })(),
    cunduk: [[128, 22], [100, 32], [156, 32]]
      .map(
        ([x, y]) =>
          `<g transform="translate(${x} ${y})"><path d="M0 6V22" stroke="#d9a63a" stroke-width="3" stroke-linecap="round"/>` +
          [0, 60, 120, 180, 240, 300]
            .map((a) => `<circle cx="${(Math.cos((a * Math.PI) / 180) * 7).toFixed(1)}" cy="${(Math.sin((a * Math.PI) / 180) * 7).toFixed(1)}" r="4.6" fill="#f2c24f"/>`)
            .join("") +
          `<circle r="3.4" fill="#fff4c2"/></g>`,
      )
      .join(""),
    kamboja: `<g transform="translate(206 70) rotate(-12)">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="0" cy="-12" rx="8" ry="14" fill="#fffaf0" stroke="#f0e3c8" stroke-width="1" transform="rotate(${a})"/>`).join("")}<circle r="5" fill="#ffd45e"/></g>`,
    blangkon: `<path d="M26 82Q26 16 128 12Q230 16 230 82Q128 62 26 82Z" fill="#4a2c1d"/><path d="M26 82Q128 62 230 82V96Q128 76 26 96Z" fill="#c8962e"/><path d="M100 36Q128 26 156 36L148 62Q128 56 108 62Z" fill="#5d3824"/><path d="M128 28V60M112 34L116 60M144 34L140 60" stroke="#c8962e" stroke-width="2.5" stroke-linecap="round"/>`,
    iket: `<path d="M18 80Q128 46 238 80V100Q128 68 18 100Z" fill="${accent}"/><path d="M96 56L128 6L160 56Q128 44 96 56Z" fill="${accent}"/><path d="M96 56L128 6L160 56Q128 44 96 56Z" fill="${dk}" opacity="0.35"/><path d="M18 90Q128 58 238 90" fill="none" stroke="#f5e6c0" stroke-width="3" stroke-dasharray="6 6"/>`,
    peci: `<path d="M52 10H204L220 70Q128 82 36 70Z" fill="#1d1c1d"/><path d="M36 70Q128 82 220 70V80Q128 92 36 80Z" fill="#2e2c2f"/>`,
    siger: (() => {
      const pt = (t) => [
        (1 - t) * (1 - t) * 58 + 2 * t * (1 - t) * 128 + t * t * 198,
        (1 - t) * (1 - t) * 74 + 2 * t * (1 - t) * -10 + t * t * 74,
      ];
      const beads = [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92]
        .map((t) => {
          const [x, y] = pt(t);
          return `<path d="M${x - 6} ${y}L${x} ${y - 16}L${x + 6} ${y}Z" fill="#f2c24f" stroke="#c8962e" stroke-width="1.5" stroke-linejoin="round"/>`;
        })
        .join("");
      return `<path d="M58 74Q128 -10 198 74" fill="none" stroke="#e0a82e" stroke-width="12" stroke-linecap="round"/>${beads}<circle cx="128" cy="32" r="7" fill="#d6334a" stroke="#fff4c2" stroke-width="2"/>`;
    })(),
    // ahoge: helai rambut mencuat di atas kepala (terlihat di mode Portrait)
    ahoge: `<path d="M122 8C112 -26 146 -54 198 -40C176 -33 160 -20 156 8Z" fill="${hairColor}" stroke="${hairColor}" stroke-width="4" stroke-linejoin="round"/>`,
    crown: `<path d="M78 56L90 16L110 40L128 8L146 40L166 16L178 56Z" fill="#ffd24a" stroke="#e0a800" stroke-width="5" stroke-linejoin="round"/><circle cx="128" cy="40" r="5" fill="${accent}"/>`,
  };
  return parts[type] ?? cozyHead(type, accent) ?? "";
}

function marks(type, color) {
  const dots = [[-14, -6], [-2, -12], [10, -4], [-8, 6], [4, 9], [16, 5]];
  if (type === "freckles") {
    const one = dots.map(([x, y]) => `<circle cx="${52 + x}" cy="${208 + y}" r="2.8"/>`).join("");
    return `<g fill="${color}">${one}${mir(one)}</g>`;
  }
  if (type === "mole") return `<circle cx="152" cy="224" r="4" fill="${color}"/>`;
  if (type === "plaster")
    return `<g transform="rotate(-24 196 204)"><rect x="168" y="194" width="56" height="20" rx="10" fill="#f3d3ae"/><rect x="188" y="194" width="16" height="20" fill="#e6b98c"/></g>`;
  return "";
}

// ---------- latar ----------
export const BACKGROUNDS = ["sky", "sunset", "night", "sawah", "batik", "blossom", "solid", ...COZY_BGS];

const cloud = (x, y, k) =>
  `<g transform="translate(${x} ${y}) scale(${k})" fill="#fff"><ellipse rx="26" ry="11"/><ellipse cx="-14" cy="-8" rx="14" ry="11"/><ellipse cx="8" cy="-12" rx="17" ry="13"/></g>`;
const bloom = (x, y, r) =>
  `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288]
    .map((a) => `<circle cy="${-r * 0.9}" r="${r * 0.75}" transform="rotate(${a})" fill="#fff"/>`)
    .join("")}<circle r="${r * 0.45}" fill="#ffd45e"/></g>`;
const grad = (stops) =>
  `<defs><linearGradient id="bgg" x1="0" y1="0" x2="0" y2="1">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join("")}</linearGradient></defs><rect width="256" height="256" fill="url(#bgg)"/>`;

export function bgLayer(id, color = "#cfe3ff") {
  switch (id) {
    case "sunset":
      return (
        grad([[0, "#ff7a5c"], [0.55, "#ffb26b"], [1, "#ffe2b8"]]) +
        `<circle cx="196" cy="150" r="34" fill="#fff3c4" opacity="0.92"/><g fill="#fff" opacity="0.55"><rect x="20" y="66" width="90" height="8" rx="4"/><rect x="150" y="48" width="70" height="7" rx="3.5"/><rect x="40" y="94" width="60" height="6" rx="3"/></g>`
      );
    case "night": {
      const stars = [[30, 40, 2], [70, 24, 1.6], [112, 56, 1.4], [160, 28, 2], [222, 34, 1.6], [236, 104, 1.8], [24, 112, 1.6], [196, 100, 1.2], [60, 80, 1.2]];
      return (
        grad([[0, "#0b1230"], [1, "#2d2f73"]]) +
        stars.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="0.85"/>`).join("") +
        `<path d="M204 40A22 22 0 1 0 204 84A17 17 0 1 1 204 40Z" fill="#fff3c4"/>`
      );
    }
    case "sawah":
      return (
        grad([[0, "#a8e0ff"], [1, "#effaff"]]) +
        `<path d="M0 156L56 100L108 142L170 90L256 154V256H0Z" fill="#a9cfe6"/><path d="M0 176Q60 146 130 170T256 156V256H0Z" fill="#8fd27a"/><path d="M0 206Q70 176 140 200T256 190V256H0Z" fill="#5fb85a"/><path d="M0 222Q70 192 140 216T256 206" fill="none" stroke="#8fd27a" stroke-width="3"/><path d="M0 238Q70 208 140 232T256 222" fill="none" stroke="#8fd27a" stroke-width="3"/>`
      );
    case "batik":
      return `<defs><pattern id="bkP" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#7a4a21"/><g fill="none" stroke="#e9c98f" stroke-width="2.4"><ellipse cx="20" cy="9" rx="5.5" ry="9"/><ellipse cx="20" cy="31" rx="5.5" ry="9"/><ellipse cx="9" cy="20" rx="9" ry="5.5"/><ellipse cx="31" cy="20" rx="9" ry="5.5"/></g><circle cx="20" cy="20" r="2.2" fill="#e9c98f"/></pattern></defs><rect width="256" height="256" fill="url(#bkP)"/>`;
    case "blossom":
      return (
        grad([[0, "#ffe9f0"], [1, "#ffc4d8"]]) +
        [[40, 52, 9], [214, 40, 12], [230, 140, 8], [24, 150, 11], [92, 22, 7], [160, 30, 6]].map(([x, y, r]) => bloom(x, y, r)).join("")
      );
    case "solid":
      return `<rect width="256" height="256" fill="${color}"/>`;
    default:
      return (
        cozyBg(id) ||
        grad([[0, "#4aa8ff"], [1, "#d6efff"]]) +
        cloud(60, 70, 1) + cloud(206, 48, 0.8) + cloud(196, 150, 1.1) + cloud(34, 168, 0.7)
      );
  }
}

// ---------- baju (gaya disederhanakan, terinspirasi busana daerah) ----------
export const OUTFITS = ["tee", "hoodie", "batik", "koko", "beskap", "pangsi", "solo", "sunda", "bali", ...COZY_OUTFITS];
export const OUTFIT_COLORS = ["#ffffff", "#f4c7d3", "#b79cf0", "#7aa7ff", "#4fbf93", "#e8c27a", "#b03a48", "#1f2430"];

const GOLD = "#e0b44a";

function outfitLayer(id, p, skin) {
  const sh = mix(p, "#000000", 0.14);
  const lt = mix(p, "#ffffff", 0.4);
  const fill = (x = p) => `<rect y="170" width="256" height="100" fill="${x}"/>`;
  const jarik = (y) => `<rect y="${y}" width="256" height="30" fill="url(#prP)"/><path d="M0 ${y}H256" stroke="#e8c98d" stroke-width="2"/>`;
  const lines = {
    tee: () =>
      fill() + `<path d="M104 184Q128 214 152 184Z" fill="${skin}"/><path d="M103 183Q128 216 153 183" fill="none" stroke="${sh}" stroke-width="5" stroke-linecap="round"/>`,
    hoodie: () =>
      fill() +
      `<path d="M82 192Q128 168 174 192Q164 228 128 234Q92 228 82 192Z" fill="${sh}"/><path d="M100 190Q128 176 156 190Q150 216 128 220Q106 216 100 190Z" fill="${skin}"/><path d="M116 216V244M140 216V244" stroke="${lt}" stroke-width="3.5" stroke-linecap="round"/><circle cx="116" cy="246" r="3.4" fill="${lt}"/><circle cx="140" cy="246" r="3.4" fill="${lt}"/>`,
    batik: () =>
      `<rect y="170" width="256" height="100" fill="url(#bsP)"/><path d="M108 182L128 214L148 182Z" fill="${skin}"/><path d="M98 182L128 224L104 212Z" fill="${lt}" stroke="${sh}" stroke-width="1.5" stroke-linejoin="round"/><path d="M158 182L128 224L152 212Z" fill="${lt}" stroke="${sh}" stroke-width="1.5" stroke-linejoin="round"/><path d="M128 224V256" stroke="${sh}" stroke-width="2.5"/><circle cx="128" cy="236" r="2.6" fill="#fff"/><circle cx="128" cy="248" r="2.6" fill="#fff"/>`,
    koko: () =>
      fill() +
      `<path d="M112 184Q128 204 144 184Z" fill="${skin}"/><path d="M104 182Q128 210 152 182" fill="none" stroke="${lt}" stroke-width="7" stroke-linecap="round"/><path d="M104 182Q128 210 152 182" fill="none" stroke="${sh}" stroke-width="1.6" stroke-dasharray="3 3"/><path d="M128 204V256" stroke="${sh}" stroke-width="2.5"/><path d="M122 208V256M134 208V256" stroke="${mix(p, "#000000", 0.2)}" stroke-width="1.6" stroke-dasharray="4 3"/><circle cx="128" cy="224" r="2.2" fill="${sh}"/><circle cx="128" cy="238" r="2.2" fill="${sh}"/><circle cx="128" cy="251" r="2.2" fill="${sh}"/>`,
    beskap: () =>
      fill() +
      `<path d="M114 184Q128 196 142 184Z" fill="${skin}"/><path d="M100 184Q128 212 156 184V198Q128 224 100 198Z" fill="${sh}" stroke="${GOLD}" stroke-width="2"/><path d="M128 210V256" stroke="${GOLD}" stroke-width="2.5"/><path d="M90 212Q96 236 100 256M166 212Q160 236 156 256" fill="none" stroke="${sh}" stroke-width="2"/><circle cx="128" cy="220" r="3" fill="${GOLD}"/><circle cx="128" cy="232" r="3" fill="${GOLD}"/><circle cx="128" cy="244" r="3" fill="${GOLD}"/>`,
    pangsi: () =>
      fill() +
      `<path d="M98 182L128 232L158 182Z" fill="#f4f1ea"/><path d="M112 184Q128 204 144 184Z" fill="${skin}"/><path d="M98 182L128 232L158 182" fill="none" stroke="${sh}" stroke-width="3" stroke-linejoin="round"/><circle cx="128" cy="240" r="3" fill="${sh}"/><circle cx="128" cy="251" r="3" fill="${sh}"/>`,
    solo: () =>
      fill() +
      `<path d="M100 182L128 236L156 182Z" fill="${skin}"/><path d="M108 196L128 236L148 196Q128 212 108 196Z" fill="#f2dfc2"/><path d="M100 182L128 236L156 182" fill="none" stroke="#fff" stroke-width="3.5" stroke-dasharray="0.5 5.5" stroke-linecap="round"/><path d="M100 182L128 236L156 182" fill="none" stroke="${sh}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="128" cy="233" r="4.5" fill="#e8b94a" stroke="#b8862a" stroke-width="1.5"/>` +
      jarik(242),
    sunda: () => {
      const pts = Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        return [
          (1 - t) * (1 - t) * 102 + 2 * t * (1 - t) * 128 + t * t * 154,
          (1 - t) * (1 - t) * 182 + 2 * t * (1 - t) * 224 + t * t * 182,
        ];
      });
      return (
        fill() + `<rect y="170" width="256" height="100" fill="url(#lcP)"/><path d="M102 182Q128 224 154 182Z" fill="${skin}"/>` +
        pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.4" fill="${lt}"/>`).join("") +
        `<rect y="242" width="256" height="9" fill="${GOLD}"/><rect x="118" y="239" width="20" height="15" rx="4" fill="#f6d77a" stroke="#c8962e" stroke-width="2"/>` +
        `<rect y="252" width="256" height="20" fill="url(#prP)"/>`
      );
    },
    bali: () =>
      fill() +
      `<path d="M104 182L128 220L152 182Z" fill="${skin}"/><path d="M104 182L128 220L152 182" fill="none" stroke="#f1c453" stroke-width="3.5" stroke-linejoin="round"/><path d="M160 186L196 196L84 264L48 254Z" fill="#f5c542"/><path d="M172 194L70 258" stroke="#fff3c4" stroke-width="2.5" stroke-dasharray="4 5" opacity="0.85"/><path d="M160 186L48 254" stroke="#d99f1c" stroke-width="2"/>`,
  };
  if (lines[id]) return lines[id]();
  return cozyOutfit(id, p, skin) || lines.tee();
}

function outfitDefs(p) {
  const lt = mix(p, "#ffffff", 0.4);
  return `<pattern id="prP" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)"><rect width="22" height="22" fill="#5b3a1e"/><path d="M0 6Q5.5 0 11 6T22 6" stroke="#e8c98d" stroke-width="2.4" fill="none"/><path d="M0 17Q5.5 11 11 17T22 17" stroke="#e8c98d" stroke-width="2.4" fill="none"/></pattern>
<pattern id="bsP" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="${p}"/><g fill="none" stroke="${lt}" stroke-width="1.6"><circle cx="10" cy="0" r="7"/><circle cx="10" cy="20" r="7"/><circle cx="0" cy="10" r="7"/><circle cx="20" cy="10" r="7"/></g><circle cx="10" cy="10" r="1.8" fill="${lt}"/></pattern>
<pattern id="lcP" width="14" height="14" patternUnits="userSpaceOnUse"><g fill="none" stroke="${lt}" stroke-width="1.2" opacity="0.9"><circle cx="3.5" cy="3.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/><path d="M7 0V3M0 7H3M14 7H11M7 14V11"/></g></pattern>${cozyDefs(p)}`;
}

// ---------- render ----------
// Bentuk kepala; `round` (-1..1) mengatur seberapa bulat/"mochi"
const headPath = (round = 0) => {
  const t = 88 + round * 30;
  const b = 110 + round * 18;
  return `M${t} 0H${256 - t}A${t} ${t} 0 0 1 256 ${t}V${256 - b}A${b} ${b} 0 0 1 ${256 - b} 256H${b}A${b} ${b} 0 0 1 0 ${256 - b}V${t}A${t} ${t} 0 0 1 ${t} 0Z`;
};
const BODY_PATH =
  "M14 256Q20 206 80 192Q104 186 128 196Q152 186 176 192Q236 206 242 256Z";
const SCALE = 0.74; // ukuran kepala di mode Portrait (besar, baju hanya mengintip)
const HEAD_CY = 133;
const BODY_DY = 34;

export function faceSvg(input, size = 256, view = "0 0 256 256") {
  const c = { ...DEFAULT_FACE, ...input };
  const eyes = EYES.find((e) => e.id === c.eyes) || EYES[0];
  const hair = HAIRS.find((h) => h.id === c.hair) || HAIRS[0];
  const portrait = c.frame === "portrait";

  const lx = 56 + c.spacing * 14;
  const rx = 256 - lx;
  const cy = 165 + c.eyeY * 12;
  const k = c.eyeSize;
  const gs = Math.max(1, k * 0.95);

  // Semua warna turunan dihitung dari warna dasar pilihan pengguna
  const skinShade = mix(c.skin, "#b0584f", 0.2); // bayangan kulit condong rose
  const blushC = mix(c.skin, "#ff7a86", 0.3);
  const blushDark = mix(c.skin, "#e0525f", 0.45);
  const mouthC = mix(c.skin, "#2b1010", 0.72);
  const marksC = mix(c.skin, "#7a4b2b", 0.42);
  const dark = luma(c.hairColor) < 70;
  // bayangan rambut condong indigo, sorot krem hangat
  const hairShade = dark ? mix(c.hairColor, "#8a7aa8", 0.16) : mix(c.hairColor, "#2a2145", 0.2);
  const hairShine = mix(c.hairColor, "#fff4e0", dark ? 0.24 : 0.5);
  const hairInk = mix(c.hairColor, "#1a1230", 0.4);
  const browC = mix(c.hairColor, "#1c1830", 0.5);

  const blush =
    c.blush === "soft"
      ? `<ellipse cx="52" cy="214" rx="32" ry="21" fill="url(#bl)"/><ellipse cx="204" cy="214" rx="32" ry="21" fill="url(#bl)"/>`
      : c.blush === "lines"
        ? (() => {
            const l = `<path d="M34 214l8-12M48 216l8-12M62 218l8-12"/>`;
            return `<g stroke="${blushDark}" stroke-width="4.5" stroke-linecap="round" fill="none">${l}${mir(l)}</g>`;
          })()
        : "";

  const eye = (x) =>
    `<g transform="translate(${x} ${cy}) scale(${k})">${eyes.draw()}${eyeShine(c.eyes, c.shine)}</g>`;
  const browY = cy - 44 * k - 6;

  const hairLayer = hair.d
    ? `<path d="${hair.d}" fill="${c.hairColor}" stroke="${c.hairColor}" stroke-width="6" stroke-linejoin="round"/>
<g clip-path="url(#hc)">
<g fill="${hairShade}">${hair.shade}</g>
<g fill="${hairShine}" opacity="0.55">${hair.shine}</g>
<path d="${hair.d}" fill="none" stroke="${hairInk}" stroke-width="5" stroke-linejoin="round" opacity="0.5"/>
${c.streak ? `<path d="M100 0H136L114 150H92Z" fill="${c.streak}"/>` : ""}
</g>`
    : "";

  const wear = headwear(c.head, c.accent, c.hairColor);
  const wearClipped = ["band", "beanie", "pompom", "bearhood"].includes(c.head);
  const wearTop = headwear(`${c.head}_top`, c.accent, c.hairColor);
  const hairExtra = hair.extra ? hair.extra(c.hairColor, hairShade) : "";
  const glassesStr = glasses(c.glasses, lx, rx, cy, gs, c.accent);

  // lapisan wajah (koordinat lokal 256x256)
  const inner = `${portrait ? `<path d="${headPath(c.round)}" fill="none" stroke="${skinShade}" stroke-width="8" opacity="0.45"/>` : ""}${hair.d ? `<path d="${hair.d}" transform="translate(0 12)" fill="${skinShade}" filter="url(#sb)" opacity="0.9"/>` : ""}
${blush}
${marks(c.marks, marksC)}
${brows(c.brows, lx, browY, browC, false)}${brows(c.brows, rx, browY, browC, true)}
${eye(lx)}${eye(rx)}
${mouth(c.mouth, mouthC)}
${hairLayer}
${wearClipped ? wear : ""}`;
  const free = `${hairExtra}${wearClipped ? "" : wear}${wearTop}${glassesStr}`;

  const skinLight = mix(c.skin, "#fff6ea", 0.22);
  const skinEdge = mix(c.skin, "#b0584f", 0.1);
  const polish = `<radialGradient id="sk" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stop-color="${skinLight}"/><stop offset="0.65" stop-color="${c.skin}"/><stop offset="1" stop-color="${skinEdge}"/></radialGradient><filter id="sb" x="-10%" y="-10%" width="120%" height="130%"><feGaussianBlur stdDeviation="3.5"/></filter><radialGradient id="vg" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#2a1020" stop-opacity="0"/><stop offset="1" stop-color="#2a1020" stop-opacity="0.16"/></radialGradient><linearGradient id="bsh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1020" stop-opacity="0"/><stop offset="1" stop-color="#2a1020" stop-opacity="0.22"/></linearGradient><filter id="gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/><feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0 0.17  1.7 0 0 0 -0.72"/></filter>`;
  const defs = `<defs>${polish}<radialGradient id="bl"><stop offset="0" stop-color="${blushC}"/><stop offset="0.6" stop-color="${blushC}" stop-opacity="0.85"/><stop offset="1" stop-color="${blushC}" stop-opacity="0"/></radialGradient>${hair.d ? `<clipPath id="hc"><path d="${hair.d}"/></clipPath>` : ""}${
    portrait
      ? `<clipPath id="hd"><path d="${headPath(c.round)}"/></clipPath><clipPath id="bd"><path d="${BODY_PATH}"/></clipPath>${outfitDefs(c.outfitColor)}`
      : ""
  }</defs>`;

  // Pose: kepala besar, bisa dimiringkan dan digeser. `preview` dipakai untuk thumbnail baju
  const peek = !c.preview;
  const S = peek ? SCALE : 0.56;
  const headCy = peek ? HEAD_CY : 100;
  const bodyDy = peek ? BODY_DY : 0;
  const angle = peek ? c.tilt * 16 : 0;
  const hcx = peek ? 128 + c.shift * 28 : 128;
  const bodyDx = hcx - 128 * S * Math.sin((angle * Math.PI) / 180) - 128;

  const body = portrait
    ? `${bgLayer(c.bg, c.bgColor)}${cozyFx(c.fx)}
<g transform="translate(${bodyDx.toFixed(1)} ${bodyDy})">
<rect x="108" y="150" width="40" height="60" fill="${c.skin}"/>
<ellipse cx="128" cy="196" rx="36" ry="11" fill="${skinShade}"/>
<path d="${BODY_PATH}" fill="${c.skin}"/>
<g clip-path="url(#bd)">${outfitLayer(c.outfit, c.outfitColor, c.skin)}<rect y="170" width="256" height="110" fill="url(#bsh)"/></g>
</g>
<g transform="translate(${hcx.toFixed(1)} ${headCy}) rotate(${angle.toFixed(1)}) scale(${S}) translate(-128 -128)">
<ellipse cx="2" cy="150" rx="15" ry="21" fill="${c.skin}"/><ellipse cx="254" cy="150" rx="15" ry="21" fill="${c.skin}"/>
<path d="${headPath(c.round)}" fill="url(#sk)"/>
<g clip-path="url(#hd)">${inner}</g>
${free}
</g>
${cozyProp(c.prop, c.accent)}`
    : `<rect width="256" height="256" fill="url(#sk)"/>
${inner}
${free}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" width="${size}" height="${size}">${defs}${body}<rect width="256" height="256" fill="url(#vg)"/>${c.grain !== false && size >= 256 ? '<rect width="256" height="256" filter="url(#gr)" opacity="0.4"/>' : ""}${size >= 256 ? foilLayer(c.tier) : ""}</svg>`;
}

// ---------- ID unik & acak ----------
export function faceId(cfg) {
  const c = { ...DEFAULT_FACE, ...cfg };
  const s = JSON.stringify([
    c.skin, c.eyes, c.hair, c.hairColor, c.streak, c.brows, c.mouth, c.blush,
    c.marks, c.glasses, c.head, c.accent, c.shine,
    c.frame === "portrait" ? [c.bg, c.bgColor, c.outfit, c.outfitColor, +c.tilt.toFixed(2), +c.shift.toFixed(2), c.prop, c.fx, +c.round.toFixed(2)] : 0,
    +c.spacing.toFixed(2), +c.eyeY.toFixed(2), +c.eyeSize.toFixed(2),
  ]);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
}

// Kode pendek 6 karakter dari data apa pun (untuk nama file dan ID)
export function hashId(value) {
  const s = JSON.stringify(value);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0").slice(0, 6);
}

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const rand = (a, b) => a + Math.random() * (b - a);
const maybe = (p, fn) => (Math.random() < p ? fn() : null);

export function randomFaceUniform() {
  return {
    skin: pick(SKINS),
    eyes: pick(EYES).id,
    hair: pick(HAIRS.filter((h) => h.id !== "none")).id,
    hairColor:
      Math.random() < 0.65 ? pick(HAIR_COLORS) : hsl(rand(0, 360), rand(50, 75), rand(68, 82)),
    streak: maybe(0.3, () => hsl(rand(0, 360), rand(65, 90), rand(60, 72))),
    brows: pick(OPTIONS.brows),
    mouth: pick(OPTIONS.mouth),
    blush: pick(OPTIONS.blush),
    marks: Math.random() < 0.5 ? "none" : pick(OPTIONS.marks),
    glasses: Math.random() < 0.5 ? "none" : pick(OPTIONS.glasses),
    head: Math.random() < 0.5 ? "none" : pick(OPTIONS.head),
    accent: pick(ACCENTS),
    bg: pick(BACKGROUNDS),
    bgColor: hsl(rand(0, 360), rand(55, 85), rand(78, 90)),
    outfit: pick(OUTFITS),
    outfitColor: pick(OUTFIT_COLORS),
    tilt: +rand(-0.8, 0.8).toFixed(2),
    shift: +rand(-0.6, 0.6).toFixed(2),
    spacing: +rand(-0.9, 0.9).toFixed(2),
    eyeY: +rand(-0.7, 0.9).toFixed(2),
    eyeSize: +rand(0.85, 1.2).toFixed(2),
  };
}

// ---------- ekspor ----------
export const svgDataUrl = (svg) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export const faceUrl = (cfg, size = 256, view) =>
  svgDataUrl(faceSvg(cfg, size, view));

export const bgUrl = (id, color) =>
  svgDataUrl(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="96" height="96">${bgLayer(id, color)}</svg>`,
  );

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
