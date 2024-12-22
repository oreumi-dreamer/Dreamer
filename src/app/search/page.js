"use client";

import React, { useState, useEffect, useCallback } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Post from "@/components/main/Post";
import Loading from "@/components/Loading";
import { Button, Input } from "@/components/Controls";
import styles from "./Search.module.css";
import PostModal from "@/components/modal/PostModal";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalHits, setTotalHits] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const LIMIT = 10;

  const [searchTerm, setSearchTerm] = useState(""); // 검색어 입력용
  const [activeQuery, setActiveQuery] = useState(""); // 실제 검색 실행용

  const fetchSearchResults = async (query, pageNum) => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams({
        q: query,
        page: pageNum,
        limit: LIMIT,
      });

      const response = await fetchWithAuth(`/api/post/search?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching posts:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // 새로운 검색 시작
    setActiveQuery(searchTerm);
    setPage(0);
    setSearchResults([]);
  };

  // 검색 실행을 위한 useEffect
  useEffect(() => {
    if (!activeQuery) return;

    fetchSearchResults(activeQuery, page).then((data) => {
      if (data) {
        setSearchResults((prev) =>
          page === 0 ? data.posts : [...prev, ...data.posts]
        );
        setTotalHits(data.totalHits);
        setHasMore(page + 1 < data.totalPages);
      }
    });
  }, [activeQuery, page]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleModalOpen = (post) => {
    setSelectedPostId(post.id);
  };

  const handleModalClose = () => {
    setSelectedPostId(null);
  };

  useEffect(() => {
    setIsShowModal(!!selectedPostId);
  }, [selectedPostId]);

  return (
    <>
      <main className={styles.container}>
        <h2>검색</h2>
        <form onSubmit={handleSubmit} className={styles["search-form"]}>
          <div className={styles["search-form-inner"]}>
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="검색어를 입력하세요"
              background="white"
            />
            <Button
              type="submit"
              highlight={true}
              disabled={isLoading || !searchTerm.trim()}
            >
              검색
            </Button>
          </div>
        </form>

        {searchResults.length > 0 && (
          <p className={styles["search-status"]}>
            총 {totalHits}개의 꿈을 찾았어요!
          </p>
        )}

        <div className={styles["results-container"]}>
          {searchResults.map((post) => (
            <Post
              key={post.id}
              post={post}
              setSelectedPostId={() => handleModalOpen(post)}
              searchMode={true}
              searchQuery={activeQuery}
            />
          ))}
        </div>

        {isLoading && (
          <div className={styles["more-button-container"]}>
            <Button disabled={true}>
              <Loading type="circle" />
            </Button>
          </div>
        )}

        {!isLoading && hasMore && searchResults.length > 0 && (
          <div className={styles["more-button-container"]}>
            <Button onClick={handleLoadMore} highlight={true}>
              더 보기
            </Button>
          </div>
        )}

        {!isLoading && searchResults.length === 0 && activeQuery && (
          <p className={styles["no-results"]}>검색 결과가 없습니다.</p>
        )}
      </main>
      <PostModal
        key={selectedPostId}
        postId={selectedPostId}
        isShow={isShowModal}
        onClose={handleModalClose}
        setFeedPosts={setSearchResults}
        setPosts={false}
      />
    </>
  );
}
