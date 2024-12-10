import React, { useRef, useCallback } from "react";
import styles from "./MainList.module.css";
import Post from "./Post";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Loading from "../Loading";
import { Button, CustomScrollbar } from "../Controls";

export default function MainList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const mainRef = useRef(null);
  const LIMIT = 5;

  const fetchPosts = async (page) => {
    try {
      setIsLoading(true);
      const res = await fetchWithAuth(
        `/api/post/feeds?page=${page}&limit=${LIMIT}`
      );
      const data = await res.json();

      if (page === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setHasMore(data.pagination.currentPage < data.pagination.totalPages);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || showButton) return;

    // 문서 전체 높이
    const scrollHeight = document.documentElement.scrollHeight;
    // 현재 스크롤 위치
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    // 뷰포트 높이
    const clientHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // 스크롤이 하단에서 100px 정도 위에 있을 때 다음 데이터 로드
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      setCurrentPage((prev) => prev + 1);
      fetchPosts(currentPage + 1);
    }
  }, [isLoading, hasMore, showButton, currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchPosts(nextPage);
    setShowButton(false); // 버튼 클릭 후 무한 스크롤 활성화
  };

  return (
    <main className={styles["main-container"]} ref={mainRef}>
      <h2 className="sr-only">게시글 목록</h2>
      {posts.map((post) => (
        <Post styles={styles} key={post.objectID} post={post} />
      ))}

      {isLoading && <Loading type="small" />}

      {!isLoading && hasMore && showButton && (
        <Button
          className={styles["load-more-button"]}
          highlight={true}
          onClick={handleLoadMore}
        >
          더 보기
        </Button>
      )}
    </main>
  );
}
