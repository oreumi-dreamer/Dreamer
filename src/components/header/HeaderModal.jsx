import React from "react";
import styles from "./HeaderModal.module.css";

function MoreModal() {
  return (
    <div className={styles["modal-wrap"]}>
      <button>계정 설정</button>
      <button>모드 전환</button>
      <button>문의 사항</button>
      <button>로그아웃</button>
    </div>
  );
}

function ChangeModeModal() {
  return (
    <div className={styles["modal-wrap"]}>
      <button>모드 전환</button>
      <button>다크 모드</button>
      <button>라이트 모드</button>
      <button>기기 설정 사용</button>
    </div>
  );
}

export { MoreModal, ChangeModeModal };
