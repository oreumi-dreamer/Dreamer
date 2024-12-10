import React from "react";
import { useSelector } from "react-redux";
import styles from "./DropDown.module.css";

export default function DropDown() {
  const { isOpen, modalType } = useSelector((state) => state.modal);
  return (
    <>
    <div className={styles["drop-down"]}>
      <MyPost />
    </div>
    <div className={styles["drop-down"]}>
      <OtherPost />
    </div>
    </>
  );
}

function MyPost() {
  return (
    <ul className={styles["my-post"]}>
      <li className={styles["drop-down-items"]}>
        <button className={`${styles["edit-btn"]} ${styles["drop-down-item"]}`}>
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
  );
}

function OtherPost() {
  return (
    <ul className={styles["other-post"]}>
      <li className={styles["drop-down-items"]}>
        <button
          className={`${styles["report-btn"]} ${styles["drop-down-item"]}`}
        >
          신고하기
        </button>
      </li>
    </ul>
  );
}
