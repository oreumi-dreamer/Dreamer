// 게시글 목록 조회 API
// /api/post/read/[userId]/route.js

import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  startAfter,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  const { userId } = params;
  const { searchParams } = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const headersList = headers();
  const authorization = headersList.get("Authorization");
  let userData = null;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const result = response.ok ? await response.json() : null;

    userData = result?.userId;
  }

  // 기본적으로 공개 게시글만 볼 수 있게 쿼리 조건 설정
  let visibilityCondition = where("isPrivate", "==", false);

  // 본인 게시글을 보는 경우 비공개 게시글도 포함
  if (userData && userId === userData) {
    visibilityCondition = where("isPrivate", "in", [true, false]);
  }

  const cursor = searchParams.get("cursor");
  const pageSize = Number(searchParams.get("limit")) || 10;

  try {
    let postsQuery;

    // 기본 쿼리 조건에 visibilityCondition 추가
    const baseQuery = [
      collection(db, "posts"),
      where("authorId", "==", userId),
      where("isDeleted", "==", false),
      visibilityCondition, // 비공개/공개 게시글 필터링 조건 추가
      orderBy("createdAt", "desc"),
      limit(pageSize),
    ];

    if (cursor) {
      const cursorDoc = await getDocs(doc(db, "posts", cursor));
      if (cursorDoc.exists()) {
        postsQuery = query(...baseQuery, startAfter(cursorDoc));
      } else {
        return NextResponse.json(
          { error: "유효하지 않은 커서입니다." },
          { status: 400 }
        );
      }
    } else {
      postsQuery = query(...baseQuery);
    }

    const querySnapshot = await getDocs(postsQuery);
    const posts = [];
    let lastVisible = null;

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      lastVisible = doc.id;

      posts.push({
        id: doc.id,
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
      });
    });

    return NextResponse.json({
      posts,
      nextCursor: lastVisible,
      hasMore: posts.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "게시글을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
