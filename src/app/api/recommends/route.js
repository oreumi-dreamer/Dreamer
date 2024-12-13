// /api/recommends/route.js

import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  doc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const pageSize = parseInt(searchParams.get("limit")) || 20;
  const cursor = searchParams.get("cursor");

  // 사용자 인증
  const headersList = headers();
  const authorization = headersList.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  console.log("baseUrl: ", baseUrl); // 디버그 용 콘솔 로그

  const idToken = authorization.split("Bearer ")[1];
  const userData = await verifyUser(baseUrl, idToken);

  if (!userData.exists) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  try {
    // 기본 쿼리 설정
    let baseQuery = [collection(db, "users")];

    if (cursor) {
      const cursorDoc = await getDocs(doc(db, "users", cursor));
      if (cursorDoc.exists()) {
        baseQuery.push(startAfter(cursorDoc));
      }
    }

    baseQuery.push();
    const usersQuery = query(...baseQuery);
    const usersSnapshot = await getDocs(usersQuery);

    // 사용자 데이터 수집 및 점수 계산
    const users = [];
    let lastVisible = null;

    for (const doc of usersSnapshot.docs) {
      if (doc.id === userData.uid) continue; // 자기 자신 제외
      const user = doc.data();
      if (user.isPrivate) continue; // 비공개 계정 제외

      lastVisible = doc.id;

      // 포스트 정보 조회
      const postsQuery = query(
        collection(db, "posts"),
        where("authorUid", "==", doc.id),
        where("isDeleted", "==", false)
      );
      const postsSnapshot = await getDocs(postsQuery);

      // 총 스파크 수 계산
      const totalSparks = postsSnapshot.docs.reduce(
        (acc, post) => acc + (post.data().sparkCount || 0),
        0
      );

      // 점수 계산
      let score = 0;

      // 팔로워 점수 (최대 40점)
      score += Math.min(40, (user.followersCount || 0) * 0.5);

      // 게시글 수 점수 (최대 20점)
      score += Math.min(20, postsSnapshot.size * 2);

      // 스파크 점수 (최대 20점)
      score += Math.min(20, totalSparks * 0.5);

      // 팔로잉 점수 (최대 10점)
      score += Math.min(10, (user.followingCount || 0) * 0.2);

      // 페널티 적용
      if (!user.profileImageUrl || !user.bio) {
        score *= 0.7; // 30% 감점
      }

      // 이미 팔로우 중인 경우 감점
      if (user.followers?.some((f) => f.uid === userData.uid)) {
        score *= 0.5; // 50% 감점
      }

      users.push({
        userId: user.userId,
        userName: user.userName,
        profileImageUrl: user.profileImageUrl || "/images/rabbit.svg",
        bio: user.bio || "",
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        isFollowing:
          user.followers?.some((f) => f.uid === userData.uid) || false,
        score,
      });
    }

    // 점수 기준 정렬
    users.sort((a, b) => b.score - a.score);

    // 페이지네이션
    users.splice(pageSize * page);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        itemsPerPage: pageSize,
        nextCursor: lastVisible,
        hasMore: users.length === pageSize,
      },
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "추천 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
