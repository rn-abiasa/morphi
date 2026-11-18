import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  // Same check as proxy.js: only a logged in admin can read this
  const cookieStore = await cookies();
  if (!cookieStore.get("isLoggedIn")) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const db = await getDb();

    // The real numbers live in one document in the "stats" collection
    const data = await db.collection("stats").findOne({ pin: "morpli_stats" });

    // monthlyUsers is a list like [{ month: "2026-10", count: 18000 }]
    const month = new Date().toISOString().slice(0, 7);
    const thisMonth = (data?.monthlyUsers || []).find(
      (item) => item.month === month,
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalDownloads: data?.totalDownloads || 0,
        monthlyUsers: thisMonth ? thisMonth.count : 0,
        totalUsers: data?.totalUsers || 0,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
