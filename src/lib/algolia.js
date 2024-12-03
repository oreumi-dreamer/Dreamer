import algoliasearch from "algoliasearch";

if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
  throw new Error("NEXT_PUBLIC_ALGOLIA_APP_ID is not defined");
}

// 서버 사이드용 클라이언트 (관리자 권한)
const adminClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY
);

// 클라이언트 사이드용 클라이언트 (검색 전용)
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
);

// 인덱스 초기화
export const postsIndex = adminClient.initIndex("postsIndex");
export const searchOnlyPostsIndex = searchClient.initIndex("postsIndex");
