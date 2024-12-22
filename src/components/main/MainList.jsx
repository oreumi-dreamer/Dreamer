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
  const [isLoading, setIsLoading] = useState(false); // true에서 false로 변경
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const mainRef = useRef(null);
  const LIMIT = 10;

  const fetchPosts = async (nextCursor = null) => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams({
        limit: LIMIT,
        ...(nextCursor && { cursor: nextCursor }),
      });

      const res = await fetchWithAuth(`/api/post/feeds?${queryParams}`);
      const data = await res.json();

      setPosts((prevPosts) =>
        nextCursor ? [...prevPosts, ...data.posts] : data.posts
      );
      setCursor(data.pagination.nextCursor);
      setHasMore(data.pagination.hasMore);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    if (posts.length === 0) {
      // 추가: 중복 로딩 방지
      fetchPosts();
    }
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
    setSelectedPostId(post.id);
  };

  const handleModalClose = () => {
    setSelectedPostId(null);
  };

  useEffect(() => {
    setIsShowModal(!!selectedPostId);
  }, [selectedPostId]);

  const updatePost = (postId, updatedData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...updatedData } : post
      )
    );
  };

  return (
    <>
      <main className={styles["main-container"]} ref={mainRef}>
        <h2 className="sr-only">게시글 목록</h2>
        {posts.map((post) => (
          <Post
            styles={styles}
            key={post.id}
            post={post}
            onPostUpdate={updatePost}
            setSelectedPostId={() => handleModalOpen(post)}
          />
        ))}

        {isLoading && showButton && <Loading />}
        {isLoading && !showButton && (
          <Button disabled={true}>
            <Loading type="miniCircle" />
          </Button>
        )}

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
        key={selectedPostId}
        postId={selectedPostId}
        isShow={isShowModal}
        onClose={handleModalClose}
        setFeedPosts={setPosts}
        setPosts={false}
      />
    </>
  );
}
