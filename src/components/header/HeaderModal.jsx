import React from "react";
import styles from "./HeaderModal.module.css";

function MoreModal() {
  return (
    <ul className={styles["more-modal"]}>
      <li className={styles["modal-items"]}>
        <button className={styles["setting-btn"]}>계정 설정</button>
      </li>
      <li className={styles["modal-items"]}>
        <button className={styles["change-mode-btn"]}>모드 전환</button>
      </li>
      <li className={styles["modal-items"]}>
        <button className={styles["inquiry-btn"]}>문의 사항</button>
      </li>
      <li className={styles["modal-items"]}>
        <button className={styles["logout-btn"]}>로그아웃</button>
      </li>
    </ul>
  );
}

function ChangeModeModal() {
  return (
    <ul className={styles["change-mode-modal"]}>
      <li className={styles["modal-items"]}>
        <button>모드 전환</button>
      </li>
      <li className={styles["modal-items"]}>
        <button>다크 모드</button>
      </li>
        <li className={styles["modal-items"]}>
        <button>라이트 모드</button>
      </li>
      <li className={styles["modal-items"]}>
        <button>기기 설정 사용</button>
      </li>
    </ul>
  );
}

export { MoreModal, ChangeModeModal };
