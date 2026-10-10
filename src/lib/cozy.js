// Elemen "cozy": latar suasana, baju hangat, hiasan kepala, benda kecil, efek, dan foil kelangkaan.
// Semua koordinat di kanvas 256x256.

// --- util kecil (sengaja tidak mengimpor face.js agar tidak ada import melingkar) ---
const toRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
    .join("");
const mix = (a, b, t) => {
  const A = toRgb(a);
  const B = toRgb(b);
  return toHex(...A.map((v, i) => v + (B[i] - v) * t));
};
// Acak deterministik: posisi hiasan selalu sama untuk pilihan yang sama
const seeded = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const grad = (stops) =>
  `<defs><linearGradient id="bgg" x1="0" y1="0" x2="0" y2="1">${stops
    .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
    .join("")}</linearGradient></defs><rect width="256" height="256" fill="url(#bgg)"/>`;

// ---------- latar suasana ----------
export const COZY_BGS = ["rain", "bokeh", "snowy"];

export function cozyBg(id) {
  const r = seeded(7);
  if (id === "rain") {
    let s = grad([[0, "#3f4f7a"], [1, "#9db0d0"]]);
    for (let i = 0; i < 8; i++) {
      s += `<circle cx="${(r() * 256).toFixed(0)}" cy="${(140 + r() * 100).toFixed(0)}" r="${(8 + r() * 16).toFixed(0)}" fill="#ffd9a0" opacity="${(0.3 + r() * 0.3).toFixed(2)}"/>`;
    }
    for (let i = 0; i < 34; i++) {
      const x = r() * 256;
      const y = r() * 256;
      s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l-3 ${(10 + r() * 14).toFixed(0)}" stroke="#fff" stroke-opacity="0.42" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    return s;
  }
  if (id === "bokeh") {
    let s = grad([[0, "#2b1f2e"], [1, "#6b3b3b"]]);
    const cols = ["#ffd27a", "#ffb2a0", "#fff1c9"];
    for (let i = 0; i < 20; i++) {
      s += `<circle cx="${(r() * 256).toFixed(0)}" cy="${(r() * 256).toFixed(0)}" r="${(6 + r() * 18).toFixed(0)}" fill="${cols[i % 3]}" opacity="${(0.25 + r() * 0.35).toFixed(2)}"/>`;
    }
    return s;
  }
  if (id === "snowy") {
    let s =
      grad([[0, "#b8d2ee"], [1, "#f1f7ff"]]) +
      `<path d="M0 214Q80 190 150 210T256 200V256H0Z" fill="#fff"/>`;
    for (let i = 0; i < 28; i++) {
      s += `<circle cx="${(r() * 256).toFixed(0)}" cy="${(r() * 220).toFixed(0)}" r="${(1.5 + r() * 2.2).toFixed(1)}" fill="#fff" opacity="0.85"/>`;
    }
    return s;
  }
  return "";
}

// ---------- efek melayang di belakang kepala ----------
export function cozyFx(type) {
  if (!type || type === "none") return "";
  const r = seeded(type.length * 31 + type.charCodeAt(0));
  const ring = () => {
    const a = r() * Math.PI * 2;
    const d = 88 + r() * 34;
    return [128 + Math.cos(a) * d, 128 + Math.sin(a) * d];
  };
  const star = "M0-6L1.8-1.8 6 0 1.8 1.8 0 6-1.8 1.8-6 0-1.8-1.8Z";
  const heart = "M0 5C-9-1-6-8 0-4 6-8 9-1 0 5Z";
  let s = "";
  if (type === "sparkle") {
    for (let i = 0; i < 9; i++) {
      const [x, y] = ring();
      s += `<path d="${star}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(0.8 + r() * 1.1).toFixed(2)})" fill="#fff6c9" opacity="0.92"/>`;
    }
  } else if (type === "hearts") {
    for (let i = 0; i < 7; i++) {
      const [x, y] = ring();
      s += `<path d="${heart}" transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${(0.9 + r() * 0.9).toFixed(2)})" fill="#ff8fb0" opacity="0.9"/>`;
    }
  } else if (type === "snow") {
    for (let i = 0; i < 28; i++) {
      s += `<circle cx="${(r() * 256).toFixed(0)}" cy="${(r() * 256).toFixed(0)}" r="${(1.5 + r() * 2.4).toFixed(1)}" fill="#fff" opacity="0.85"/>`;
    }
  } else if (type === "petals") {
    for (let i = 0; i < 14; i++) {
      s += `<ellipse cx="${(r() * 256).toFixed(0)}" cy="${(r() * 256).toFixed(0)}" rx="5" ry="2.8" transform="rotate(${(r() * 180).toFixed(0)} ${(r() * 256).toFixed(0)} ${(r() * 256).toFixed(0)})" fill="#ffc2d4" opacity="0.9"/>`;
    }
  }
  return s;
}

// ---------- baju hangat ----------
export const COZY_OUTFITS = ["sweater", "cardigan", "scarf", "blanket"];

export function cozyDefs(p) {
  const dk = mix(p, "#000000", 0.18);
  return `<pattern id="knP" width="16" height="20" patternUnits="userSpaceOnUse"><path d="M4 0Q8 5 4 10T4 20M12 0Q8 5 12 10T12 20" fill="none" stroke="${dk}" stroke-width="2.4" stroke-linecap="round"/></pattern>
<pattern id="plP" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="${p}"/><rect y="10" width="28" height="8" fill="${dk}" opacity="0.45"/><rect x="10" width="8" height="28" fill="${dk}" opacity="0.45"/><path d="M0 4H28M4 0V28" stroke="${mix(p, "#ffffff", 0.5)}" stroke-width="1.2" opacity="0.7"/></pattern>`;
}

export function cozyOutfit(id, p, skin) {
  const sh = mix(p, "#000000", 0.14);
  const lt = mix(p, "#ffffff", 0.4);
  const fill = (x = p) => `<rect y="170" width="256" height="100" fill="${x}"/>`;
  if (id === "sweater") {
    return (
      fill() +
      `<rect y="170" width="256" height="100" fill="url(#knP)" opacity="0.7"/><path d="M104 182Q128 216 152 182Z" fill="${skin}"/><path d="M100 182Q128 224 156 182" fill="none" stroke="${lt}" stroke-width="12" stroke-linecap="round"/><path d="M100 182Q128 224 156 182" fill="none" stroke="${sh}" stroke-width="1.6" stroke-dasharray="2 4"/>`
    );
  }
  if (id === "cardigan") {
    const left = "M0 170H108L98 186L120 270H0Z";
    const right = "M256 170H148L158 186L136 270H256Z";
    return (
      fill("#f1e9dc") +
      `<path d="M108 182Q128 208 148 182Z" fill="${skin}"/><path d="${left}" fill="${p}"/><path d="${right}" fill="${p}"/><path d="${left}" fill="url(#knP)" opacity="0.6"/><path d="${right}" fill="url(#knP)" opacity="0.6"/><path d="M98 186L120 270M158 186L136 270" stroke="${lt}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="108" cy="214" r="3.4" fill="${lt}"/><circle cx="112" cy="238" r="3.4" fill="${lt}"/><circle cx="116" cy="260" r="3.4" fill="${lt}"/>`
    );
  }
  if (id === "scarf") {
    const wrap = "M84 186Q128 168 172 186Q184 216 128 232Q72 216 84 186Z";
    return (
      fill(mix(p, "#ffffff", 0.7)) +
      `<path d="${wrap}" fill="${p}"/><path d="${wrap}" fill="url(#knP)" opacity="0.5"/><path d="M90 200Q128 218 166 200" fill="none" stroke="${lt}" stroke-width="6" stroke-linecap="round"/><path d="M124 214L106 268H146L150 218Z" fill="${p}"/><path d="M110 248H146" stroke="${lt}" stroke-width="6" stroke-linecap="round"/>`
    );
  }
  if (id === "blanket") {
    const top = "M0 210Q64 192 106 204Q128 210 150 204Q192 192 256 210";
    return (
      fill(mix(p, "#ffffff", 0.5)) +
      `<path d="${top}V256H0Z" fill="url(#plP)"/><path d="${top}" fill="none" stroke="${lt}" stroke-width="3" opacity="0.85"/>`
    );
  }
  return "";
}

// ---------- hiasan kepala hangat ----------
// Kunci "xxx_top" = bagian yang keluar dari bentuk kepala (digambar tanpa dipotong)
export function cozyHead(type, accent) {
  const dk = mix(accent, "#000000", 0.14);
  const lt = mix(accent, "#ffffff", 0.45);
  const parts = {
    pompom: `<path d="M0 0H256V78Q128 60 0 78Z" fill="${accent}"/><path d="M0 62Q128 44 256 62V86Q128 68 0 86Z" fill="${dk}"/><path d="M0 62Q128 44 256 62" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="3"/>`,
    pompom_top: `<g fill="${lt}"><circle cx="128" cy="-8" r="30"/><circle cx="104" cy="0" r="18"/><circle cx="152" cy="0" r="18"/></g><circle cx="118" cy="-16" r="8" fill="#fff" opacity="0.5"/>`,
    earmuffs: `<path d="M10 132Q128 -34 246 132" fill="none" stroke="${dk}" stroke-width="10" stroke-linecap="round"/><circle cx="6" cy="140" r="30" fill="${accent}"/><circle cx="250" cy="140" r="30" fill="${accent}"/><circle cx="12" cy="140" r="19" fill="${lt}"/><circle cx="244" cy="140" r="19" fill="${lt}"/>`,
    bearhood: `<path d="M0 0H256V92Q128 60 0 92Z" fill="${accent}"/><path d="M0 92Q128 60 256 92" fill="none" stroke="${lt}" stroke-width="6"/>`,
    bearhood_top: `<g fill="${accent}"><circle cx="44" cy="14" r="34"/><circle cx="212" cy="14" r="34"/></g><g fill="${lt}" opacity="0.7"><circle cx="44" cy="14" r="18"/><circle cx="212" cy="14" r="18"/></g>`,
  };
  return parts[type];
}

// ---------- benda kecil di bawah (hanya mode Portrait) ----------
export const PROPS = ["none", "mug", "boba", "cat", "plush"];

export function cozyProp(type, accent) {
  const dk = mix(accent, "#000000", 0.2);
  if (type === "mug") {
    return `<g transform="translate(150 188)"><path d="M40 14Q60 14 60 32Q60 48 40 48" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round"/><rect y="6" width="44" height="50" rx="11" fill="${accent}"/><ellipse cx="22" cy="8" rx="22" ry="6.5" fill="${dk}"/><ellipse cx="22" cy="8" rx="17.5" ry="4.6" fill="#6b3b24"/><path d="M22 40c-6-5-9-8-9-12a5 5 0 0 1 9-2 5 5 0 0 1 9 2c0 4-3 7-9 12z" fill="#fff" opacity="0.85"/><path d="M13 -2Q9 -10 13 -18Q17 -26 13 -32M30 0Q26 -8 30 -16Q34 -24 30 -30" fill="none" stroke="#fff" stroke-opacity="0.85" stroke-width="3.5" stroke-linecap="round"/></g>`;
  }
  if (type === "boba") {
    const pearls = [[14, 78], [24, 79], [34, 78], [19, 72], [29, 72]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.2" fill="#3b2418"/>`)
      .join("");
    return `<g transform="translate(152 168)"><path d="M32 12L44 -22" stroke="${accent}" stroke-width="5.5" stroke-linecap="round"/><path d="M0 20H52L46 82Q45 88 39 88H13Q7 88 6 82Z" fill="#fff" opacity="0.8"/><path d="M4 42H48L46 82Q45 86 39 86H13Q7 86 6 82Z" fill="#d9a56b"/>${pearls}<path d="M-2 20H54V15Q54 6 26 6Q-2 6 -2 15Z" fill="#fff" opacity="0.95"/></g>`;
  }
  if (type === "cat") {
    return `<g transform="translate(26 188)"><path d="M6 24L12 -4L32 14Z" fill="#f2b873"/><path d="M66 24L60 -4L40 14Z" fill="#f2b873"/><path d="M12 18L15 4L26 14Z" fill="#ffb3c6"/><path d="M60 18L57 4L46 14Z" fill="#ffb3c6"/><ellipse cx="36" cy="38" rx="34" ry="28" fill="#f4c58a"/><path d="M22 36Q26 31 30 36M42 36Q46 31 50 36" fill="none" stroke="#3b2418" stroke-width="3" stroke-linecap="round"/><path d="M33 44L39 44L36 48Z" fill="#ff8aa0"/><path d="M12 44L2 42M12 49L3 52M60 44L70 42M60 49L69 52" stroke="#fff" stroke-opacity="0.8" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="20" cy="68" rx="9" ry="6" fill="#f4c58a"/><ellipse cx="52" cy="68" rx="9" ry="6" fill="#f4c58a"/></g>`;
  }
  if (type === "plush") {
    return `<g transform="translate(150 184)"><circle cx="8" cy="10" r="11" fill="#a9733f"/><circle cx="52" cy="10" r="11" fill="#a9733f"/><circle cx="8" cy="10" r="5.5" fill="#e9c9a0"/><circle cx="52" cy="10" r="5.5" fill="#e9c9a0"/><circle cx="30" cy="32" r="27" fill="#b98255"/><ellipse cx="30" cy="42" rx="12" ry="9" fill="#e9c9a0"/><ellipse cx="30" cy="38" rx="4.5" ry="3.2" fill="#3b2418"/><circle cx="20" cy="30" r="2.8" fill="#3b2418"/><circle cx="40" cy="30" r="2.8" fill="#3b2418"/><path d="M26 46Q30 50 34 46" fill="none" stroke="#3b2418" stroke-width="2" stroke-linecap="round"/></g>`;
  }
  return "";
}

// ---------- foil kelangkaan (Epic = holografik, Legendary = holografik + kilau + bingkai emas) ----------
export function foilLayer(tier) {
  if (tier !== "epic" && tier !== "legendary") return "";
  let s = `<defs><radialGradient id="fm" cx="0.5" cy="0.5" r="0.72"><stop offset="0.45" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient><mask id="fk"><rect width="256" height="256" fill="url(#fm)"/></mask><linearGradient id="fl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8fd6" stop-opacity="0.6"/><stop offset="0.3" stop-color="#8fd4ff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#b9ffc9" stop-opacity="0.5"/><stop offset="0.8" stop-color="#ffe08f" stop-opacity="0.55"/><stop offset="1" stop-color="#d49bff" stop-opacity="0.6"/></linearGradient></defs><g mask="url(#fk)"><rect width="256" height="256" fill="url(#fl)"/><path d="M-20 200L120 -20H160L20 220Z" fill="#fff" opacity="0.22"/><path d="M60 270L210 -10H226L76 270Z" fill="#fff" opacity="0.14"/></g>`;
  if (tier === "legendary") {
    const star = "M0-9L2.7-2.7 9 0 2.7 2.7 0 9-2.7 2.7-9 0-2.7-2.7Z";
    const spots = [[44, 52, 1], [210, 44, 1.3], [226, 150, 0.8], [30, 168, 1.1], [150, 22, 0.7], [196, 220, 0.9]];
    s +=
      spots.map(([x, y, k]) => `<path d="${star}" transform="translate(${x} ${y}) scale(${k})" fill="#fffbe0" opacity="0.95"/>`).join("") +
      `<circle cx="128" cy="128" r="122" fill="none" stroke="#ffd45e" stroke-width="5" opacity="0.9"/><circle cx="128" cy="128" r="115" fill="none" stroke="#fff6cf" stroke-width="1.6" opacity="0.75"/>`;
  }
  return s;
}
