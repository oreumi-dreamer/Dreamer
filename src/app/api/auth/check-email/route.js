// app/api/auth/check-email/route.js
import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "이메일이 필요합니다." },
        { status: 400 }
      );
    }

    try {
      const usersSnapshot = await db
        .collection("users")
        .where("email", "==", email)
        .limit(1)
        .get();

      return NextResponse.json({ exists: !usersSnapshot.empty });
    } catch (error) {
      console.error("Error in check-email:", error);
      return NextResponse.json(
        { error: "이메일 확인 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
