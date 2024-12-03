import React from "react";
import styles from "./HeaderModal.module.css";


function MoreModal({ setOpenModalName }) {
  return (
    <ul className={styles["more-modal"]}>
      <li className={styles["modal-items"]}>
        <button className={styles["setting-btn"]}>계정 설정</button>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["change-mode-btn"]} ${styles["light-mode"]}`}
          onClick={() => setOpenModalName("모드 전환")}
        >
          모드 전환
        </button>
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

function ChangeModeModal({ setOpenModalName }) {
  return (
    <ul className={styles["change-mode-modal"]}>
      <li className={styles["modal-items"]}>
        <button
          className={styles["back-more-modal-btn"]}
          onClick={() => setOpenModalName("더보기")}
        >
          모드 전환
        </button>
      </li>
      <li className={styles["modal-items"]}>
        <button className={styles["dark-mode-btn"]}>다크 모드</button>
      </li>
      <li className={styles["modal-items"]}>
        <button className={styles["light-mode-btn"]}>라이트 모드</button>
      </li>
      <li className={styles["modal-items"]}>
        <button className={styles["device-setting-btn"]}>기기 설정 사용</button>
      </li>
    </ul>
  );
}

export { MoreModal, ChangeModeModal };
