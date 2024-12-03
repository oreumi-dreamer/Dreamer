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
    const filters = ["NOT isDeleted:true", "NOT isPrivate:true"];
    if (genre) filters.push(`dreamGenres:"${genre}"`);
    if (mood) filters.push(`dreamMoods:"${mood}"`);

    const { hits, nbPages, nbHits } = await searchOnlyPostsIndex.search(query, {
      filters: filters.join(" AND "),
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
        "commentCount",
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
        commentCount: hit.commentCount || 0,
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
