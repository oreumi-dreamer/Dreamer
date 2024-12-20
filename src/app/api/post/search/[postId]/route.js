// 게시글 ID로 게시글을 조회하는 API
// 게시글 수정 시 게시글 ID를 사용하여 게시글을 조회하는 경우 사용됨
// /api/post/search/[postId]/route.js

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    userData = await verifyUser(baseUrl, idToken);
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

    const commentsLength = postData.comments
      ? postData.comments.filter((comment) => !comment.isDeleted).length
      : 0;

    // 삭제된 게시글 체크
    if (postData.isDeleted) {
      return NextResponse.json(
        { error: "삭제된 게시글입니다." },
        { status: 404 }
      );
    }

    // authorUid로 사용자 정보 조회
    const usersRef = collection(db, "users");
    const userQuery = query(
      usersRef,
      where("__name__", "==", postData.authorUid)
    );
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json(
        { error: "작성자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const userData2 = userSnapshot.docs[0].data();

    // 비공개 게시글 접근 권한 체크
    if (
      postData.isPrivate &&
      (!userData || userData.userId !== userData2.userId)
    ) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 작성자와 게시자가 동일할 경우 isMyself를 true로 설정
    const isMyself = userData ? userData.userId === userData2.userId : false;

    // 반짝 했는지 여부
    const spark = postData.spark;
    let hasUserSparked = false;
    if (spark && userData) {
      hasUserSparked = spark.includes(userData.uid);
    }

    // 응답 데이터 구성
    const post = {
      id: postDoc.id,
      title: postData.title,
      content: postData.content,
      createdAt: postData.createdAt?.toDate().toISOString(),
      updatedAt: postData.updatedAt?.toDate().toISOString(),
      authorUid: postData.authorUid,
      authorId: userData2.userId,
      authorName: userData2.userName,
      isMyself: isMyself,
      isTomong:
        postData.tomongSelected > -1 ? postData.tomongSelected > -1 : false,
      tomong:
        postData.tomongSelected > -1
          ? postData.tomong[postData.tomongSelected]
          : null,
      imageUrls: postData.imageUrls,
      isPrivate: postData.isPrivate,
      hasUserSparked: hasUserSparked,
      sparkCount: postData.sparkCount,
      comments: [],
      commentsCount: commentsLength,
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
