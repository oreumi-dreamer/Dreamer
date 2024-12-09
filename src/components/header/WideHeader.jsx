"use client";

import React from "react";
import styles from "./WideHeader.module.css";
import Link from "next/link";
import { HeaderBaseModal } from "./HeaderModal";
import { useSelector } from "react-redux";

export default function WideHeader({
  onMoreBtnClick,
  buttonRef,
  isActive,
  handleActiveBtn,
}) {
  const { isOpen } = useSelector((state) => state.modal);

  const navItems = [
    { label: "홈", className: "home-btn", href: "/" },
    { label: "검색", className: "search-btn", href: "/search" },
    { label: "메세지", className: "message-btn", href: "/message" },
    { label: "알람", className: "alarm-btn", href: "/alarm" },
  ];

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href="/">
          <img src="/images/logo-full.svg" alt="DREAMER" />
        </Link>
      </h1>
      <button
        className={`${styles["mode-toggle-btn"]} ${styles["light-mode"]}`}
      >
        <div className={`${styles["toggle-switch"]}`}></div>
      </button>
      <div className={styles["header-btn-container"]}>
        <nav>
          <ul className={styles.nav}>
            {navItems.map((item) => (
              <li key={item.label} className={styles["nav-items"]}>
                <Link
                  href={"#"}
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
                onClick={() => handleActiveBtn("글쓰기")}
              >
                글쓰기
              </button>
            </li>
          </ul>
        </nav>
        <Link
          href="#"
          className={`${styles["nav-item"]} ${styles["profile-btn"]} ${isActive === "프로필" ? styles.active : ""}`}
          onClick={() => handleActiveBtn("프로필")}
        >
          <img src="/images/rabbit.svg" alt="프로필사진" loading="lazy" />
          <p>JINI</p>
        </Link>
        <button
          className={`${styles["nav-item"]} ${styles["more-btn"]} ${isOpen ? styles.active : ""}`}
          ref={buttonRef}
          onClick={onMoreBtnClick}
        >
          더보기
        </button>
        {isOpen ? <HeaderBaseModal buttonRef={buttonRef} /> : null}
      </div>
    </header>
  );
}
