import React, { useState, useEffect } from "react";
import styles from "./PostModal.module.css";
import PostContent from "../post/PostContent";
import { ConfirmModal } from "../Controls";

export default function PostModal({ postId, isShow, onClose }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  function handleModalClose() {
    if (comment) {
      setIsConfirmModalOpen(true);
      return;
    }

    setIsModalOpen(false);
    onClose();
    setComment(undefined);
    setIsLoading(true);
  }

  useEffect(() => {
    const html = document.querySelector("html");

    if (isShow) {
      html.style.overflowY = "hidden";
    } else {
      html.style.overflowY = "scroll";
    }
  }, [isShow]);

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
          {isConfirmModalOpen && (
            <ConfirmModal
              onConfirm={() => {
                setIsModalOpen(false);
                onClose();
                setComment(undefined);
                setIsLoading(true);
                setIsConfirmModalOpen(false);
              }}
              isOpen={() => setIsConfirmModalOpen(true)}
              closeModal={() => setIsConfirmModalOpen(false)}
              message="댓글을 작성중입니다. 종료하시겠습니까?"
            />
          )}
        </>
      ) : null}
    </>
  );
}
