"use client";

import React, { useState } from "react";
import styles from "../modal/PostModal.module.css";
import PostContent from "./PostContent";

export default function PostComponent({ postId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState(undefined);

  return (
    <article className={styles["post-modal"]}>
      <PostContent
        type="page"
        postId={postId}
        onClose={() => {}}
        handleModalClose={() => {}}
        isModalOpen={true}
        setIsModalOpen={() => {}}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        comment={comment}
        setComment={setComment}
      />
    </article>
  );
}
