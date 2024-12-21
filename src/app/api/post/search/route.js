// /api/post/search/route.js
import { headers } from "next/headers";
import { verifyUser } from "@/lib/api/auth";
import { searchOnlyPostsIndex } from "@/lib/algolia";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function GET(request) {
  // 인증 확인
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  let userData = null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (authorization?.startsWith("Bearer ")) {
    const idToken = authorization.split("Bearer ")[1];
    userData = await verifyUser(baseUrl, idToken);
  }

  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("q") || "";
  const genre = searchParams.get("genre");
  const mood = searchParams.get("mood");
  const page = parseInt(searchParams.get("page")) || 0;
  const hitsPerPage = parseInt(searchParams.get("limit")) || 10;

  try {
    // 기본 필터: 삭제되거나 비공개인 게시물 제외
    const visibilityFilter =
      "(isDeleted:false OR isDeleted:'false') AND (isPrivate:false OR isPrivate:'false')";

    // 추가 필터: 장르, 분위기
    const contentFilters = [];
    if (genre) contentFilters.push(`dreamGenres:${genre}`);
    if (mood) contentFilters.push(`dreamMoods:${mood}`);

    const finalFilter =
      contentFilters.length > 0
        ? `${visibilityFilter} AND ${contentFilters.join(" AND ")}`
        : visibilityFilter;

    const { hits, nbPages, nbHits } = await searchOnlyPostsIndex.search(
      searchQuery,
      {
        filters: finalFilter,
        page,
        hitsPerPage,
        attributesToRetrieve: [
          "objectID",
          "title",
          "content",
          "authorUid",
          "imageUrls",
          "dreamGenres",
          "dreamMoods",
          "dreamRating",
          "sparkCount",
          "createdAt",
          "updatedAt",
          "isDeleted",
          "isPrivate",
          "postId",
          "comments",
          "lastmodified",
          "spark",
        ],
      }
    );

    // 검색 결과에서 고유한 authorUid 목록 추출
    const uniqueAuthorUids = [...new Set(hits.map((hit) => hit.authorUid))];

    // authorUid 목록이 비어있으면 빈 배열 반환
    if (uniqueAuthorUids.length === 0) {
      return NextResponse.json({
        posts: [],
        totalPages: nbPages,
        totalHits: nbHits,
      });
    }

    // Firestore에서 해당 UID를 가진 사용자들의 정보를 한 번에 조회
    const usersRef = collection(db, "users");
    const userQuery = query(
      usersRef,
      where("__name__", "in", uniqueAuthorUids)
    );
    const userSnapshot = await getDocs(userQuery);

    // UID를 키로 하는 사용자 정보 맵 생성
    const userMap = {};
    userSnapshot.forEach((doc) => {
      userMap[doc.id] = {
        userId: doc.data().userId,
        userName: doc.data().userName,
        profileImageUrl: doc.data().profileImageUrl,
      };
    });

    return NextResponse.json({
      posts: hits.map((hit) => ({
        id: hit.objectID,
        title: hit.title,
        content: hit.content,
        authorUid: hit.authorUid,
        authorId: userMap[hit.authorUid]?.userId || "알 수 없음",
        authorName: userMap[hit.authorUid]?.userName || "알 수 없음",
        profileImageUrl:
          userMap[hit.authorUid]?.profileImageUrl || "/images/rabbit.svg",
        imageUrls: hit.imageUrls || [],
        dreamGenres: hit.dreamGenres || [],
        dreamMoods: hit.dreamMoods || [],
        dreamRating: hit.dreamRating,
        spark: [],
        sparkCount: hit.spark?.length || 0,
        hasUserSparked: hit.spark?.includes(userData.uid) || false,
        createdAt: hit.createdAt,
        updatedAt: hit.updatedAt,
        isDeleted: hit.isDeleted || false,
        isPrivate: hit.isPrivate || false,
        postId: hit.postId,
        commentsCount: hit.comments?.length || 0,
        lastmodified: hit.lastmodified,
      })),
      totalPages: nbPages,
      totalHits: nbHits,
    });
  } catch (error) {
    console.error("Algolia search error:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
