// 로그아웃 시 쿠키를 삭제하는 API

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 쿠키 삭제
    cookies().delete("auth_token");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
