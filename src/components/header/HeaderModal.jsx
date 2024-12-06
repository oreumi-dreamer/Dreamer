import React, { useEffect, useRef, useState } from "react";
import styles from "./HeaderModal.module.css";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import { openModal, closeModal, setModalType } from "@/store/modalSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

const HeaderBaseModal = ({ buttonRef }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { isOpen, modalType } = useSelector((state) => state.modal);

  useEffect(() => {
    if (isOpen) {
      const removeOutsideClickListener = outsideClickModalClose(
        modalRef,
        buttonRef,
        () => {
          dispatch(closeModal());
        }
      );

      return () => {
        removeOutsideClickListener();
      };
    }
  }, [isOpen, dispatch, buttonRef]);

  if (!isOpen) return null;

  return (
    <div className={styles["modal-wrapper"]} ref={modalRef}>
      {modalType === "moreModal" && <MoreModal />}
      {modalType === "changeMode" && <ChangeModeModal />}
    </div>
  );
};

function MoreModal() {
  const dispatch = useDispatch();
  return (
    <ul className={styles["more-modal"]}>
      <li className={styles["modal-items"]}>
        <Link
          href="/account"
          className={`${styles["setting-btn"]} ${styles["more-modal-btn"]}`}
        >
          계정 설정
        </Link>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["change-mode-btn"]} ${styles["more-modal-btn"]} ${styles["light-mode"]}`}
          onClick={() => dispatch(setModalType("changeMode"))}
        >
          모드 전환
        </button>
      </li>
      <li className={`${styles["modal-items"]} ${styles["more-modal-btn"]}`}>
        <button className={styles["inquiry-btn"]}>문의 사항</button>
      </li>
      <li className={styles["modal-items"]}>
        <Link
          href="/logout"
          className={`${styles["logout-btn"]} ${styles["more-modal-btn"]}`}
        >
          로그아웃
        </Link>
      </li>
    </ul>
  );
}

function ChangeModeModal() {
  const dispatch = useDispatch();
  return (
    <ul className={styles["change-mode-modal"]}>
      <li className={styles["modal-items"]}>
        <button
          className={styles["back-more-modal-btn"]}
          onClick={() => dispatch(setModalType("moreModal"))}
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

export { HeaderBaseModal };
