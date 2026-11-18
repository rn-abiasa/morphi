import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// The PFP site (Vite) runs on another origin, so CORS is needed.
// Set ALLOWED_ORIGIN in production (e.g. https://morpli.vercel.app)
const corsHeaders = {
  "Access-Control-Allow-Origin":
    process.env.ALLOWED_ORIGIN || "http://localhost:5173",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Browser sends this first (preflight) before the real POST
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Only keep the fields we need, and cut the length (this endpoint is public)
    const download = {
      letter: String(body.letter || "").slice(0, 10),
      font: String(body.font || "").slice(0, 30),
      background: String(body.background || "").slice(0, 30),
      decor: Number(body.decor) || 0,
      from: String(body.from || "Unknown").slice(0, 50),
      device: String(body.device || "Unknown").slice(0, 30),
      createdAt: new Date(),
    };

    const db = await getDb();
    await db.collection("downloads").insertOne(download);

    // Update the counters in the "stats" document
    const stats = db.collection("stats");
    const month = new Date().toISOString().slice(0, 7);

    await stats.updateOne(
      { pin: "morpli_stats" },
      { $inc: { totalDownloads: 1, totalUsers: 1 } },
      { upsert: true },
    );

    // monthlyUsers is a list like [{ month: "2026-10", count: 18000 }]
    const updated = await stats.updateOne(
      { pin: "morpli_stats", "monthlyUsers.month": month },
      { $inc: { "monthlyUsers.$.count": 1 } },
    );

    // First download of a new month: add the month to the list
    if (updated.matchedCount === 0) {
      await stats.updateOne(
        { pin: "morpli_stats" },
        { $push: { monthlyUsers: { month, count: 1 } } },
      );
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false },
      { status: 500, headers: corsHeaders },
    );
  }
}
