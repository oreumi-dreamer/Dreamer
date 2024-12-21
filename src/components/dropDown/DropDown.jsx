import React, { forwardRef, useState } from "react";
import styles from "./DropDown.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Loading from "../Loading";

export const MyPost = forwardRef(
  (
    { style, togglePostPrivacy, postId, postIsPrivate, setIsWriteModalOpen },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    async function deletePost() {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth(`/api/post/delete/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("게시물을 삭제할 수 없습니다", error);
      } finally {
        setIsLoading(false);
      }
    }
    return (
      <div className={styles["drop-down"]} ref={ref} style={style}>
        <ul className={styles["my-post"]}>
          <li className={styles["drop-down-items"]}>
            <button
              className={`${styles["edit-btn"]} ${styles["drop-down-item"]}`}
              onClick={() => setIsWriteModalOpen(true)}
            >
              수정하기
            </button>
          </li>
          <li className={styles["drop-down-items"]}>
            {isLoading ? (
              <button
                type="button"
                className={`${styles["delete-btn"]} ${styles["drop-down-item"]}`}
              >
                <Loading type="miniCircle" className={styles["loading"]} />
              </button>
            ) : (
              <button
                className={`${styles["delete-btn"]} ${styles["drop-down-item"]}`}
                onClick={deletePost}
              >
                삭제하기
              </button>
            )}
          </li>
          <li className={styles["drop-down-items"]}>
            <button
              className={`${styles["secret-btn"]} ${styles["drop-down-item"]}`}
              onClick={() => togglePostPrivacy(postId, postIsPrivate)}
            >
              {postIsPrivate ? "공개글로 변경하기" : "비밀글로 변경하기"}
            </button>
          </li>
        </ul>
      </div>
    );
  }
);

export const OtherPost = forwardRef(({ style, setIsReportModalOpen }, ref) => {
  return (
    <div className={styles["drop-down"]} ref={ref} style={style}>
      <ul className={styles["other-post"]}>
        <li className={styles["drop-down-items"]}>
          <button
            className={`${styles["report-btn"]} ${styles["drop-down-item"]}`}
            onClick={() => setIsReportModalOpen(true)}
          >
            신고하기
          </button>
        </li>
      </ul>
    </div>
  );
});

MyPost.displayName = "MyPost";
OtherPost.displayName = "OtherPost";
