// Vercel serverless function: kirim notifikasi ke Discord saat PFP diunduh.
// URL webhook disimpan di env server (DISCORD_WEBHOOK_URL), tidak pernah masuk bundle browser.

const clean = (v, max = 40) =>
  String(v ?? "")
    .replace(/[^\p{L}\p{N} _.-]/gu, "")
    .slice(0, max) || "-";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return res.status(500).json({ ok: false, error: "not configured" });

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const { letter, font, gradient } = body || {};

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Morpli",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: "PFP baru diunduh",
            color: 0x5865f2,
            fields: [
              { name: "Huruf", value: clean(letter, 4), inline: true },
              { name: "Font", value: clean(font), inline: true },
              { name: "Gradient", value: clean(gradient), inline: true },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch {
    return res.status(502).json({ ok: false });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
