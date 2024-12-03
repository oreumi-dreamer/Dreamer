// 로그인 시 쿠키 설정 API
// /api/auth/login/route.js

import { auth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    // ID 토큰으로 세션 쿠키 생성 (유효기간 7일)
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 7 * 1000, // 7일을 밀리초로 변환
    });

    // Response 객체에 세션 쿠키 설정
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 401 }
    );
  }
}
