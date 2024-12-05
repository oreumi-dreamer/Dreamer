import React, { useEffect, useRef } from "react";
import styles from "./HeaderModal.module.css";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import Link from "next/link";

function MoreModal({ setOpenModalName, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      outsideClickModalClose(modalRef, onClose);
    }
  }, [isOpen, onClose]);

  return (
    <ul className={styles["more-modal"]} ref={modalRef}>
      <li className={styles["modal-items"]}>
        <Link href="/account">
          <button className={styles["setting-btn"]}>계정 설정</button>
        </Link>
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
        <Link href="/logout">
          <button className={styles["logout-btn"]}>로그아웃</button>
        </Link>
      </li>
    </ul>
  );
}

function ChangeModeModal({ setOpenModalName, isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      outsideClickModalClose(modalRef, onClose);
    }
  }, [isOpen, onClose]);
  return (
    <ul className={styles["change-mode-modal"]} ref={modalRef}>
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
