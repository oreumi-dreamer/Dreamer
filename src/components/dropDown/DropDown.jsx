import React from "react";
import { useSelector } from "react-redux";
import styles from "./DropDown.module.css";

function DropDown() {
  return (
    <>
      <div className={styles["drop-down"]}>
        {isOpen && modalType === "isMyPost" && <MyPost />}
        {isOpen && modalType === "isNotMyPost" && <OtherPost />}
      </div>
    </>
  );
}

export function MyPost() {
  return (
    <div className={styles["drop-down"]}>
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
}

export function OtherPost() {
  return (
    <div className={styles["drop-down"]}>
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
}
