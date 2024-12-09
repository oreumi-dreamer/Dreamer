// 피드 목록을 가져오는 API 라우트
// /api/post/feeds/route.js

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { searchOnlyPostsIndex } from "@/lib/algolia";
import { db } from "@/lib/firebase";
import {
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  const idToken = authorization.split("Bearer ")[1];

  const userData = await verifyUser(idToken);
  if (!userData.exists) {
    return NextResponse.json(
      { error: "인증되지 않은 사용자입니다." },
      { status: 401 }
    );
  }

  try {
    const userDoc = await getDoc(doc(db, "users", userData.uid));
    const userDataDoc = userDoc.data();
    const following = userDataDoc.following || [];
    const followingUids = following.map((f) => f.uid);
    const genreStats = userDataDoc.genreStats || {};
    const moodStats = userDataDoc.moodStats || {};

    // 1. 기본 필터
    const baseFilter = "NOT isDeleted:true";
    const publicFilter = "NOT isPrivate:true";

    // 2. 팔로우 가중치 필터
    const followBoost =
      followingUids.length > 0
        ? followingUids.map((uid) => `authorUid:'${uid}'<score=30>`).join(",")
        : "";

    // 3. 관심사 가중치 필터
    const genreBoosts = Object.entries(genreStats)
      .map(
        ([genre, stats]) =>
          `dreamGenres:'${genre}'<score=${Math.min(25, stats.count)}>`
      )
      .join(",");

    const moodBoosts = Object.entries(moodStats)
      .map(
        ([mood, stats]) =>
          `dreamMoods:'${mood}'<score=${Math.min(25, stats.count)}>`
      )
      .join(",");

    // 4. Algolia 검색 실행
    const { hits } = await searchOnlyPostsIndex.search("", {
      filters: `(${baseFilter}) AND (${publicFilter})`,
      optionalFilters: [
        followBoost, // 팔로우 가중치 (30%)
        genreBoosts, // 장르 관심사 가중치 (25%)
        moodBoosts, // 무드 관심사 가중치 (25%)
      ],
      hitsPerPage: 1000,
      attributesToRetrieve: [
        "objectID",
        "title",
        "content",
        "authorUid",
        "sparkCount",
        "commentsCount",
        "createdAt",
        "dreamGenres",
        "dreamMoods",
      ],
    });

    // 작성자 정보 조회
    const uniqueAuthorUids = [...new Set(hits.map((hit) => hit.authorUid))];
    const usersRef = collection(db, "users");
    const userQuery = query(
      usersRef,
      where("__name__", "in", uniqueAuthorUids)
    );
    const userSnapshot = await getDocs(userQuery);

    // userMap 생성
    const userMap = {};
    userSnapshot.forEach((doc) => {
      userMap[doc.id] = {
        userId: doc.data().userId,
        userName: doc.data().userName,
      };
    });

    const calculateTimeDecay = (
      createdAt,
      sparkCount = 0,
      commentsCount = 0
    ) => {
      const now = new Date();
      const postDate = new Date(createdAt);
      const hoursElapsed = (now - postDate) / (1000 * 60 * 60);

      // 기본 감쇠율 계산 (로그 함수 사용)
      const baseDecay = Math.max(
        0,
        15 * (1 - Math.log(hoursElapsed + 1) / Math.log(720))
      ); // 30일 기준

      // 상호작용 보정
      const interactionBonus = Math.min(5, (sparkCount + commentsCount) / 10);

      return Math.min(15, baseDecay + interactionBonus);
    };

    // 5. 점수 계산 및 정렬
    const posts = hits
      .map((hit) => {
        const followScore = followingUids.includes(hit.authorUid) ? 30 : 0;
        const interactionScore = Math.min(
          30,
          ((hit.sparkCount || 0) + (hit.commentsCount || 0)) / 2
        );
        const genreMatchScore = Math.min(
          25,
          hit.dreamGenres?.reduce(
            (acc, genre) => acc + (genreStats[genre]?.count || 0),
            0
          ) || 0
        );
        const timeFreshnessScore = calculateTimeDecay(
          hit.createdAt,
          hit.sparkCount,
          hit.commentsCount
        );

        const totalScore =
          followScore + interactionScore + genreMatchScore + timeFreshnessScore;

        return {
          ...hit,
          score: totalScore,
          authorId: userMap[hit.authorUid]?.userId || "알 수 없음",
          authorName: userMap[hit.authorUid]?.userName || "알 수 없음",
        };
      })
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "게시글을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
