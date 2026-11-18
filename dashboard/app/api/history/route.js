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

    // Latest 50 downloads
    const history = await db
      .collection("downloads")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, history });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
