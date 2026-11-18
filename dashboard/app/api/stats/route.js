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
    const downloads = db.collection("downloads");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalDownloads = await downloads.countDocuments();

    // A user = one unique userId
    const users = await downloads.distinct("userId");
    const monthlyUsers = await downloads.distinct("userId", {
      createdAt: { $gte: startOfMonth },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalDownloads,
        monthlyUsers: monthlyUsers.length,
        totalUsers: users.length,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
