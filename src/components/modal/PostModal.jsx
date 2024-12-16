import React, { useEffect, useState, useRef } from "react";
import styles from "./PostModal.module.css";

import { fetchWithAuth } from "@/utils/auth/tokenUtils";

import useTheme from "@/hooks/styling/useTheme";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import PostContent from "../post/PostContent";

export default function PostModal({ postId, isShow, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState(undefined);

  function handleModalClose() {
    if (comment) {
      const exitAnswer = confirm("댓글을 작성중입니다. 종료하시겠습니까?");
      if (!exitAnswer) return;
    }
    setIsModalOpen(false);
    onClose();
    setComment(undefined);
    setIsLoading(true);
  }

  return (
    <>
      {isShow ? (
        <>
          <div className={styles.dimmed} onClick={handleModalClose}></div>
          <dialog className={styles["post-modal"]}>
            <PostContent
              type="modal"
              postId={postId}
              onClose={onClose}
              handleModalClose={handleModalClose}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              comment={comment}
              setComment={setComment}
            />
          </dialog>
        </>
      ) : null}
    </>
  );
}
