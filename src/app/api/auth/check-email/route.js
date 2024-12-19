// app/api/auth/check-email/route.js
import { auth } from "@/lib/firebaseAdmin";
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
      const userRecord = await auth.getUserByEmail(email);

      return NextResponse.json({ exists: userRecord.emailVerified });
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return NextResponse.json({ exists: false });
      }
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
