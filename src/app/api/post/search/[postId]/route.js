// 게시글 ID로 게시글을 조회하는 API

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  const { postId } = params;

  // 인증 확인
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  let userData = null;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    userData = await verifyUser(idToken);
  }

  try {
    // 게시글 조회
    const postDoc = await getDoc(doc(db, "posts", postId));

    if (!postDoc.exists()) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const postData = postDoc.data();

    // 삭제된 게시글 체크
    if (postData.isDeleted) {
      return NextResponse.json(
        { error: "삭제된 게시글입니다." },
        { status: 404 }
      );
    }

    // 비공개 게시글 접근 권한 체크
    if (
      postData.isPrivate &&
      (!userData || userData.userId !== postData.authorId)
    ) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 응답 데이터 구성
    const post = {
      id: postDoc.id,
      title: postData.title,
      content: postData.content,
      createdAt: postData.createdAt?.toDate().toISOString(),
      updatedAt: postData.updatedAt?.toDate().toISOString(),
      authorId: postData.authorId,
      authorName: postData.authorName,
      imageUrls: postData.imageUrls,
      isPrivate: postData.isPrivate,
      sparkCount: postData.sparkCount,
      comments: [],
      dreamGenres: postData.dreamGenres,
      dreamMoods: postData.dreamMoods,
      dreamRating: postData.dreamRating,
    };

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "게시글을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
