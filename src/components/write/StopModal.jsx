import React from "react";
import styles from "./StopModal.module.css";

export default function StopModal(props) {
  return (
    <>
      <dialog className={styles["stop-modal"]} open>
        <p>작성 중인 글이 있습니다. 창을 닫으시겠습니까?</p>
        <div>
          <button className={styles["btn-yes"]}>네</button>
          <button className={styles["btn-no"]}>아니오</button>
        </div>
        <button className={styles["btn-close"]}>
          <span className="sr-only">닫기</span>
        </button>
      </dialog>
    </>
  );
}
