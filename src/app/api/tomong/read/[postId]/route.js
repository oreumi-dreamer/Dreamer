// 토몽 읽기 API
// /api/tomong/read/[postId]/route.js

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { postId } = params;

  try {
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
    const { tomong, tomongSelected } = postData;

    // 선택된 토몽이 없거나 유효하지 않은 인덱스인 경우
    if (
      typeof tomongSelected !== "number" ||
      !tomong ||
      !Array.isArray(tomong) ||
      tomongSelected < 0 ||
      tomongSelected >= tomong.length
    ) {
      return NextResponse.json(
        { error: "선택된 토몽이 없거나 유효하지 않습니다." },
        { status: 400 }
      );
    }

    // 선택된 토몽의 content 반환
    const selectedTomong = tomong[tomongSelected];

    return NextResponse.json({
      content: selectedTomong.content,
    });
  } catch (error) {
    console.error("Error fetching tomong:", error);
    return NextResponse.json(
      { error: "토몽을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
