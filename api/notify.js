/* global process */

// Vercel function: relays download events to a Discord webhook.
// The webhook URL stays server-side (DISCORD_WEBHOOK_URL).

// In-memory per-IP rate limit. State is per function instance, so this is best-effort only.
const hits = new Map();
const LIMIT = 20; // max requests per window
const WINDOW_MS = 60_000;

function limited(ip) {
  const now = Date.now();
  if (hits.size > 500) {
    for (const [key, v] of hits) if (v.reset < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

// Strip control chars and markdown/mention symbols from user input, then truncate
const clean = (value, max = 40) =>
  String(value ?? "")
    .replace(/[\u0000-\u001f`*_~|>\\[\]()@#]/g, "")
    .trim()
    .slice(0, max) || "-";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return res.status(204).end(); // not configured: no-op

  // Same-origin only (localhost allowed for dev)
  const origin = req.headers.origin || "";
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    /* malformed origin */
  }
  const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(originHost);
  if (!originHost || (originHost !== req.headers.host && !isLocal)) {
    return res.status(403).end();
  }

  const ip =
    String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (limited(ip)) return res.status(429).end();

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body && typeof body === "object" ? body : {};

  const country = clean(req.headers["x-vercel-ip-country"], 4);
  const device = /mobile|android|iphone|ipad/i.test(req.headers["user-agent"] || "")
    ? "Mobile"
    : "Desktop";
  const decors = Math.max(0, Math.min(Number(body.decors) || 0, 3));
  const nth = Math.max(0, Math.min(Number(body.nth) || 0, 99999));

  const payload = {
    username: "Morpli",
    allowed_mentions: { parse: [] }, // block @everyone / pings from user-supplied text
    embeds: [
      {
        title: "New PFP downloaded",
        color: 0xff8fb0,
        fields: [
          { name: "Letter", value: clean(body.letter, 4), inline: true },
          { name: "Font", value: clean(body.font), inline: true },
          { name: "Background", value: clean(body.gradient), inline: true },
          { name: "Decor", value: String(decors), inline: true },
          {
            name: "Visitor",
            value: `${clean(body.visitor, 12)} · #${nth}`,
            inline: true,
          },
          { name: "From", value: `${country} · ${device}`, inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.status(response.ok ? 204 : 502).end();
  } catch {
    return res.status(502).end();
  }
}
