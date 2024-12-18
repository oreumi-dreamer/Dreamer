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

      // 임시 계정 체크:
      // 1. 이메일이 인증되어 있고 (emailVerified: true)
      // 2. 생성 시간과 마지막 로그인 시간이 같으면 (방금 생성된 임시 계정)
      const isTemporaryAccount =
        userRecord.emailVerified &&
        userRecord.metadata.creationTime === userRecord.metadata.lastSignInTime;

      // 임시 계정이 아닌 경우에만 exists: true 반환
      return NextResponse.json({ exists: !isTemporaryAccount });
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
