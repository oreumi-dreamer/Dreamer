import React, { useRef } from "react";
import styles from "./MainList.module.css";
import Post from "./Post";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Loading from "../Loading";
import { CustomScrollbar } from "../Controls";

export default function MainList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetchWithAuth("/api/post/feeds");
        const data = await res.json();
        setPosts(data.posts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main className={styles["main-container"]} ref={mainRef}>
      <h2 className="sr-only">게시글 목록</h2>
      {isLoading && <Loading />}
      {posts.map((post) => (
        <Post styles={styles} key={post.objectID} post={post} />
      ))}
      <CustomScrollbar containerRef={mainRef} isLoading={isLoading} />
    </main>
  );
}
