import React, { forwardRef } from "react";
import styles from "./HeaderModal.module.css";
import { setModalType } from "@/store/modalSlice";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import useTheme from "@/hooks/styling/useTheme";

const HeaderBaseModal = forwardRef(({ style }, ref) => {
  const { isOpen, modalType } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  return (
    <div className={styles["modal-wrapper"]} ref={ref} style={style}>
      {modalType === "moreModal" && <MoreModal />}
      {modalType === "changeMode" && <ChangeModeModal />}
    </div>
  );
});

function MoreModal() {
  const { theme } = useTheme();
  const isLightMode =
    theme === "light" || localStorage.getItem("theme") === "light";
  const isDarkMode =
    theme === "dark" || localStorage.getItem("theme") === "dark";
  const dispatch = useDispatch();
  return (
    <ul className={styles["more-modal"]}>
      <li className={styles["modal-items"]}>
        <Link
          href="/account"
          className={`${styles["setting-btn"]} ${styles["header-modal-btn"]}`}
        >
          계정 설정
        </Link>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["change-mode-btn"]} ${styles["header-modal-btn"]} ${isLightMode ? styles["light-mode"] : isDarkMode ? styles["dark-mode"] : styles["device-mode"]}`}
          onClick={() => dispatch(setModalType("changeMode"))}
        >
          모드 전환
        </button>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["inquiry-btn"]} ${styles["header-modal-btn"]}`}
        >
          문의 사항
        </button>
      </li>
      <li className={styles["modal-items"]}>
        <Link
          href="/logout"
          className={`${styles["logout-btn"]} ${styles["header-modal-btn"]}`}
        >
          로그아웃
        </Link>
      </li>
    </ul>
  );
}

function ChangeModeModal() {
  const { theme, changeTheme } = useTheme();
  const isLightMode =
    theme === "light" || localStorage.getItem("theme") === "light";
  const isDarkMode =
    theme === "dark" || localStorage.getItem("theme") === "dark";
  const dispatch = useDispatch();
  return (
    <ul className={styles["change-mode-modal"]}>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["back-more-modal-btn"]} ${styles["header-modal-btn"]} ${isLightMode ? styles["light-mode"] : isDarkMode ? styles["dark-mode"] : styles["device-mode"]}`}
          onClick={() => dispatch(setModalType("moreModal"))}
        >
          모드 전환
        </button>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["dark-mode-btn"]} ${styles["header-modal-btn"]}`}
          onClick={() => changeTheme("dark")}
        >
          다크 모드
        </button>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["light-mode-btn"]} ${styles["header-modal-btn"]}`}
          onClick={() => changeTheme("light")}
        >
          라이트 모드
        </button>
      </li>
      <li className={styles["modal-items"]}>
        <button
          className={`${styles["device-setting-btn"]} ${styles["header-modal-btn"]}`}
          onClick={() => changeTheme("device")}
        >
          기기 설정 사용
        </button>
      </li>
    </ul>
  );
}

export { HeaderBaseModal };

HeaderBaseModal.displayName = "HeaderBaseModal";
