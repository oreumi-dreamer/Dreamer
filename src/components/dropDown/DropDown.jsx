import React, { forwardRef } from "react";
import styles from "./DropDown.module.css";

export const MyPost = forwardRef(({ style }, ref) => {
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
          >
            삭제하기
          </button>
        </li>
        <li className={styles["drop-down-items"]}>
          <button
            className={`${styles["secret-btn"]} ${styles["drop-down-item"]}`}
          >
            비밀글로 변경하기
          </button>
        </li>
      </ul>
    </div>
  );
});

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