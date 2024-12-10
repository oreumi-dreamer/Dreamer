// /api/account/theme/route.js

import { headers } from "next/headers";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function PUT(request) {
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  const idToken = authorization.split("Bearer ")[1];

  try {
    // 사용자 인증 확인
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      method: "GET",
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.exists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "인증되지 않은 사용자입니다.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { theme } = body;

    // 테마 유효성 검사
    const validThemes = ["deviceMode", "light", "dark"];
    if (!validThemes.includes(theme)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "유효하지 않은 테마입니다.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 현재 사용자 정보 가져오기
    const userRef = doc(db, "users", verifyData.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 사용자 테마 업데이트
    const updateData = {
      theme,
    };

    await updateDoc(userRef, updateData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "테마가 성공적으로 수정되었습니다.",
        data: updateData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating theme:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "테마 수정 중 오류가 발생했습니다.",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
