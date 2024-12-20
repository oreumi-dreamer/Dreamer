"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./WideHeader.module.css";
import Link from "next/link";
import { HeaderBaseModal } from "./HeaderModal";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { closeModal } from "@/store/modalSlice";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import useTheme from "@/hooks/styling/useTheme";

export default function WideHeader({
  onMoreBtnClick,
  buttonRef,
  isActive,
  handleActiveBtn,
  handleToggleBtn,
  handleWriteBtnClick,
}) {
  const { isOpen } = useSelector((state) => state.modal);
  const { user } = useSelector((state) => state.auth);
  const { userId, profileImageUrl } = user;
  const [modalStyle, setModalStyle] = useState({});
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const isLightMode =
    theme === "light" || localStorage.getItem("theme") === "light";
  const isDarkMode =
    theme === "dark" || localStorage.getItem("theme") === "dark";

  const isHidden =
    theme === "device" || localStorage.getItem("theme") === "device";

  const navItems = [
    { label: "홈", className: "home-btn", href: "/" },
    { label: "검색", className: "search-btn", href: "/search" },
    { label: "토몽 AI", className: "tomong-btn", href: "/tomong" },
  ];

  useEffect(() => {
    if (modalRef.current && buttonRef.current) {
      const updatePosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const modalHeight = 295;
        const position = {
          position: "absolute",
          top: `${buttonRect.top - modalHeight * 2}px`,
          left: `${buttonRect.left - 100}px`,
          zIndex: "10",
        };
        if (position) {
          setModalStyle(position);
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);

      const cleanup = outsideClickModalClose(modalRef, buttonRef, () => {
        dispatch(closeModal());
      });
      return () => {
        window.removeEventListener("resize", updatePosition);
        cleanup();
      };
    }
  }, [dispatch, modalRef, buttonRef, isOpen]);

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href="/">
          <Image
            src="/images/logo-full.svg"
            alt="DREAMER"
            width={252}
            height={105}
          />
        </Link>
      </h1>
      <button
        className={`${styles["mode-toggle-btn"]} ${isLightMode ? styles["light-mode"] : isDarkMode ? styles["dark-mode"] : null} ${isHidden ? styles["hidden-btn"] : ""}`}
        onClick={handleToggleBtn}
      >
        <div className={`${styles["toggle-switch"]}`}></div>
      </button>
      <div className={styles["header-btn-container"]}>
        <nav>
          <ul className={styles.nav}>
            {navItems.map((item) => (
              <li key={item.label} className={styles["nav-items"]}>
                <Link
                  href={item.href}
                  className={`${styles["nav-item"]} ${styles[`${item.className}`]} ${
                    isActive === item.label ? styles.active : ""
                  }`}
                  onClick={() => handleActiveBtn(item.label)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className={styles["nav-items"]}>
              <button
                className={`${styles["nav-item"]} ${styles["writing-btn"]} ${
                  isActive === "글쓰기" ? styles.active : ""
                }`}
                onClick={() => {
                  handleActiveBtn("글쓰기");
                  handleWriteBtnClick();
                }}
              >
                글쓰기
              </button>
            </li>
          </ul>
        </nav>
        <Link
          href={`/users/${userId}`}
          className={`${styles["nav-item"]} ${styles["profile-btn"]} ${isActive === "프로필" ? styles.active : ""}`}
          onClick={() => handleActiveBtn("프로필")}
        >
          <img
            src={profileImageUrl ? profileImageUrl : "/images/rabbit.svg"}
            alt="프로필사진"
            loading="lazy"
            width={40}
            height={40}
          />
          <p>내 프로필</p>
        </Link>
        <button
          className={`${styles["nav-item"]} ${styles["more-btn"]} ${isOpen ? styles.active : ""}`}
          ref={buttonRef}
          onClick={onMoreBtnClick}
        >
          더보기
        </button>
        {isOpen && <HeaderBaseModal ref={modalRef} style={modalStyle} />}
      </div>
    </header>
  );
}
