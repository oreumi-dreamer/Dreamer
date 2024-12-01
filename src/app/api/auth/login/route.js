import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    // Response 객체 생성
    const response = NextResponse.json({ success: true });

    // Response 객체에 쿠키 설정
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
