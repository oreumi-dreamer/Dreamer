// api/join/check-userid/route.js

import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(request) {
  try {
    // request.json()으로 body 데이터를 파싱
    const body = await request.json();
    const { userId } = body;

    // userId 필수값 확인
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "사용자 ID가 필요합니다.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Firestore에서 해당 userId를 가진 문서 검색
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // 검색 결과가 있으면 중복된 userId
    const isDuplicate = !querySnapshot.empty;

    return new Response(
      JSON.stringify({
        success: true,
        isDuplicate,
        message: isDuplicate
          ? "이미 사용 중인 아이디입니다."
          : "사용 가능한 아이디입니다.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error checking userId:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "아이디 중복 확인 중 오류가 발생했습니다.",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
