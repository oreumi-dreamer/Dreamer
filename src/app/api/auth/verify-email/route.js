// app/api/auth/verify-email/route.js
import { auth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 인증 상태 저장
export async function POST(req) {
  try {
    const { email, status } = await req.json();

    // 인증 상태를 쿠키에 저장 (임시)
    cookies().set(
      "emailVerification",
      JSON.stringify({
        email,
        verified: status,
        timestamp: Date.now(),
      }),
      { maxAge: 300 }
    ); // 5분 유효

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 인증 상태 조회
export async function GET(req) {
  try {
    const verificationCookie = cookies().get("emailVerification");
    if (!verificationCookie) {
      return NextResponse.json({ verified: false });
    }

    const verification = JSON.parse(verificationCookie.value);
    return NextResponse.json(verification);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
