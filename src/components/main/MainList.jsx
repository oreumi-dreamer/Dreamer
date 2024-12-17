import React, { useRef, useCallback } from "react";
import styles from "./MainList.module.css";
import Post from "./Post";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Loading from "../Loading";
import { Button, CustomScrollbar } from "../Controls";
import PostModal from "../modal/PostModal";

export default function MainList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const mainRef = useRef(null);
  const LIMIT = 5;

  const fetchPosts = async (nextCursor = null) => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams({
        limit: LIMIT,
        ...(nextCursor && { cursor: nextCursor }),
      });

      const res = await fetchWithAuth(`/api/post/feeds?${queryParams}`);
      const data = await res.json();

      if (!nextCursor) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setCursor(data.pagination.nextCursor);
      setHasMore(data.pagination.hasMore);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || showButton) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight =
      window.innerHeight || document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight + 100) {
      fetchPosts(cursor);
    }
  }, [isLoading, hasMore, showButton, cursor]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;
    fetchPosts(cursor);
    setShowButton(false); // 버튼 클릭 후 무한 스크롤 활성화
  };

  const handleModalOpen = (post) => {
    setSelectedPostId(post.objectID);
  };

  const handleModalClose = () => {
    setSelectedPostId(null);
  };

  useEffect(() => {
    setIsShowModal(!!selectedPostId);
  }, [selectedPostId]);

  return (
    <>
      <main className={styles["main-container"]} ref={mainRef}>
        <h2 className="sr-only">게시글 목록</h2>
        {posts.map((post) => (
          <Post
            styles={styles}
            key={post.objectID + Math.random()}
            post={post}
            setSelectedPostId={() => handleModalOpen(post)}
          />
        ))}

        {isLoading && showButton && <Loading />}
        {isLoading && !showButton && <Loading type="small" />}

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
      <PostModal
        postId={selectedPostId}
        isShow={isShowModal}
        onClose={handleModalClose}
      />
    </>
  );
}
