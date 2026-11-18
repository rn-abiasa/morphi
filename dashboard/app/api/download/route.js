import { NextResponse } from "next/server";
import { createHash } from "crypto";
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

    // A user = a unique visitor. The PFP site does not send an id (yet),
    // so we make one from the ip + browser. Only the hash is saved, not the ip.
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const agent = req.headers.get("user-agent") || "unknown";
    const userId =
      String(body.userId || "").slice(0, 50) ||
      createHash("sha256")
        .update(ip + agent)
        .digest("hex")
        .slice(0, 16);

    // Only keep the fields we need, and cut the length (this endpoint is public)
    const download = {
      letter: String(body.letter || "").slice(0, 10),
      font: String(body.font || "").slice(0, 30),
      background: String(body.background || "").slice(0, 30),
      decor: Number(body.decor) || 0,
      from: String(body.from || "Unknown").slice(0, 50),
      device: String(body.device || "Unknown").slice(0, 30),
      userId,
      createdAt: new Date(),
    };

    const db = await getDb();
    await db.collection("downloads").insertOne(download);

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false },
      { status: 500, headers: corsHeaders },
    );
  }
}
