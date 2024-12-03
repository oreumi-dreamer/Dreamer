// /api/post/search/route.js

import { searchOnlyPostsIndex } from "@/lib/algolia";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
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

    const { hits, nbPages, nbHits } = await searchOnlyPostsIndex.search(query, {
      filters: finalFilter,
      page,
      hitsPerPage,
      attributesToRetrieve: [
        "objectID",
        "title",
        "content",
        "authorId",
        "authorName",
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
      ],
    });

    return NextResponse.json({
      posts: hits.map((hit) => ({
        id: hit.objectID,
        title: hit.title,
        content: hit.content,
        authorId: hit.authorId,
        authorName: hit.authorName,
        imageUrls: hit.imageUrls || [],
        dreamGenres: hit.dreamGenres || [],
        dreamMoods: hit.dreamMoods || [],
        dreamRating: hit.dreamRating,
        sparkCount: hit.sparkCount || 0,
        createdAt: hit.createdAt, // 타임스탬프 형식
        updatedAt: hit.updatedAt, // 타임스탬프 형식
        isDeleted: hit.isDeleted || false,
        isPrivate: hit.isPrivate || false,
        postId: hit.postId,
        comments: hit.comments || [],
        commentCount: hit.comments.length || 0,
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
