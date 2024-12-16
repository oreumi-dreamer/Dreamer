// 토몽 선택 업데이트 API
// /api/post/tomong/[postId]/route.js

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(request, { params }) {
  const { postId } = params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 사용자 인증 확인
  const headersList = headers();
  const authorization = headersList.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    // 토큰 검증
    const idToken = authorization.split("Bearer ")[1];
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "인증이 실패했습니다." },
        { status: 401 }
      );
    }

    const { userId, uid } = await response.json();

    // 게시글 데이터 조회
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const postData = postSnap.data();

    // 게시글 작성자 확인
    if (postData.authorUid !== uid) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    // 요청 body에서 선택된 tomong 인덱스 가져오기
    const { selectedIndex } = await request.json();

    if (typeof selectedIndex !== "number") {
      return NextResponse.json(
        { error: "잘못된 요청입니다." },
        { status: 400 }
      );
    }

    // tomongSelected 업데이트
    await updateDoc(postRef, {
      tomongSelected: selectedIndex,
    });

    return NextResponse.json({
      message: "성공적으로 업데이트되었습니다.",
      tomongSelected: selectedIndex,
    });
  } catch (error) {
    console.error("Error updating tomongSelected:", error);
    return NextResponse.json(
      { error: "업데이트 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
