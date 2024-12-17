import React, { forwardRef } from "react";
import styles from "./DropDown.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export const MyPost = forwardRef(
  ({ style, togglePostPrivacy, postId, postIsPrivate }, ref) => {
    async function deletePost() {
      try {
        const response = await fetchWithAuth(`/api/post/delete/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error("게시물을 삭제할 수 없습니다", error);
      }
    }
    return (
      <div className={styles["drop-down"]} ref={ref} style={style}>
        <ul className={styles["my-post"]}>
          <li className={styles["drop-down-items"]}>
            <button
              className={`${styles["edit-btn"]} ${styles["drop-down-item"]}`}
            >
              수정하기
            </button>
          </li>
          <li className={styles["drop-down-items"]}>
            <button
              className={`${styles["delete-btn"]} ${styles["drop-down-item"]}`}
              onClick={deletePost}
            >
              삭제하기
            </button>
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

export const OtherPost = forwardRef(({ style }, ref) => {
  return (
    <div className={styles["drop-down"]} ref={ref} style={style}>
      <ul className={styles["other-post"]}>
        <li className={styles["drop-down-items"]}>
          <button
            className={`${styles["report-btn"]} ${styles["drop-down-item"]}`}
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
