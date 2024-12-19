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
  const summary = searchParams.get("summary") === "true";

  // 먼저 userId로 사용자의 UID를 조회
  const usersRef = collection(db, "users");
  const userQuery = query(usersRef, where("userId", "==", userId));
  const userSnapshot = await getDocs(userQuery);

  if (userSnapshot.empty) {
    return NextResponse.json(
      { error: "사용자를 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // 사용자 정보 추출
  const authorUid = userSnapshot.docs[0].id;

  const authorDocsData = userSnapshot.docs[0].data();

  // DB 상의 사용자 이름과 ID를 조회
  const authorId = authorDocsData.userId;
  const authorName = authorDocsData.userName;
  const bio = authorDocsData.bio;
  const followersCount = authorDocsData.followersCount;
  const followingCount = authorDocsData.followingCount;
  const followers = authorDocsData.followers;
  const profileImageUrl = authorDocsData.profileImageUrl;
  const isPrivate = authorDocsData.isPrivate === "on" ? true : false;

  const headersList = headers();
  const authorization = headersList.get("Authorization");
  let userData = null;
  let userUid = null;

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
    userUid = result?.uid;
  }

  // 기본적으로 공개 게시글만 볼 수 있게 쿼리 조건 설정
  let visibilityCondition = where("isPrivate", "==", false);

  // 본인 게시글을 보는 경우 비공개 게시글도 포함
  if (userData && userId === userData) {
    visibilityCondition = where("isPrivate", "in", [true, false]);
  }

  const cursor = searchParams.get("cursor");
  const pageSize = Number(searchParams.get("limit"));

  try {
    let postsQuery;

    // 기본 쿼리 조건에 visibilityCondition 추가
    let baseQuery = [
      collection(db, "posts"),
      where("authorUid", "==", authorUid),
      where("isDeleted", "==", false),
      visibilityCondition, // 비공개/공개 게시글 필터링 조건 추가
      orderBy("createdAt", "desc"),
    ];

    if (pageSize) {
      baseQuery.push(limit(pageSize));
    }

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

      // summary 모드일 때는 요약 정보만 포함
      if (summary) {
        posts.push({
          id: doc.id,
          title: postData.title,
          content: postData.content,
          hasImages:
            Array.isArray(postData.imageUrls) && postData.imageUrls.length > 0,
          sparkCount: postData.sparkCount || 0,
          hasUserSparked:
            Array.isArray(postData.spark) && userUid
              ? postData.spark.includes(userUid)
              : false,
          commentsCount: postData.commentsCount || 0,
          createdAt: postData.createdAt?.toDate().toISOString(),
          updatedAt: postData.updatedAt?.toDate().toISOString(),
          isTomong: postData.tomong
            ? !!postData.tomong[postData.tomongSelected]
            : false,
          isPrivate: postData.isPrivate,
        });
      } else {
        // 기존 상세 정보 응답
        posts.push({
          id: doc.id,
          title: postData.title,
          content: postData.content,
          createdAt: postData.createdAt?.toDate().toISOString(),
          updatedAt: postData.updatedAt?.toDate().toISOString(),
          authorUid: postData.authorUid,
          authorId: authorId,
          authorName: authorName,
          imageUrls: postData.imageUrls,
          isPrivate: postData.isPrivate,
          sparkCount: postData.sparkCount,
          comments: postData.comments ? postData.comments : [],
          commentsCount: postData.commentsCount,
          dreamGenres: postData.dreamGenres,
          dreamMoods: postData.dreamMoods,
          dreamRating: postData.dreamRating,
          isTomong: postData.tomong
            ? !!postData.tomong[postData.tomongSelected]
            : false,
          tomong: postData.tomong
            ? postData.tomong[postData.tomongSelected]
            : null,
          tomongs: userData === authorId ? postData.tomong : null,
          tomongSelected: postData.tomongSelected,
        });
      }
    });

    const birthDate = new Date(authorDocsData.birthDate.seconds * 1000);

    return NextResponse.json({
      posts,
      userId: authorId,
      userName: authorName,
      bio: bio,
      profileImageUrl: profileImageUrl,
      isPrivate: isPrivate,
      length: posts.length,
      followersCount: followersCount ? followersCount : 0,
      followingCount: followingCount ? followingCount : 0,
      isFollowing: followers?.some((follower) => follower.uid === userUid),
      isMyself: userData === authorId,
      birthDate:
        userData === authorId
          ? birthDate // 사용자 본인의 경우만 생일 정보 제공
          : null,
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
