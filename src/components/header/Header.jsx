"use client";

import React, { isValidElement, useRef, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { MoreModal, ChangeModeModal } from "./HeaderModal";

export default function Header() {
  const buttonRef = useRef(null);
  const [isActive, setIsActive] = useState("홈");

  const handleButtonClick = (e) => {
    const buttons = document.querySelectorAll("button");
    const clickedBtn = e.currentTarget;

    setIsActive(clickedBtn.textContent);

    buttons.forEach((button) => {
      if (button !== isActive) {
        button.classList.remove(styles.active);
      }
    });
    clickedBtn.classList.add(styles.active);
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href={"#"}>
          <img src="/images/logo-full.svg" alt="logo" />
        </Link>
      </h1>
      <button className={styles["mode-toggle-btn"]}>
        <div className={styles["toggle-switch"]}></div>
      </button>
      <div className={styles["header-btn-container"]}>
        <nav>
          <ul className={styles.nav}>
            <li className={styles["nav-item"]}>
              <button
                className={`${styles["home-btn"]} ${styles.active}`}
                onClick={handleButtonClick}
              >
                홈
              </button>
            </li>
            <li className={styles["nav-item"]}>
              <button
                className={styles["search-btn"]}
                onClick={handleButtonClick}
              >
                검색
              </button>
            </li>
            <li className={styles["nav-item"]}>
              <button
                className={styles["message-btn"]}
                onClick={handleButtonClick}
              >
                메시지
              </button>
            </li>
            <li className={styles["nav-item"]}>
              <button
                className={styles["alarm-btn"]}
                onClick={handleButtonClick}
              >
                알림
              </button>
            </li>
            <li className={styles["nav-item"]}>
              <button
                className={styles["writing-btn"]}
                onClick={handleButtonClick}
              >
                글쓰기
              </button>
            </li>
          </ul>
        </nav>
        <button className={styles["profile-btn"]} onClick={handleButtonClick}>
          <img
            src="/images/basic-profile.svg"
            alt="프로필사진"
            loading="lazy"
          />
          <p>JINI</p>
        </button>
        <button
          className={styles["more-btn"]}
          ref={buttonRef}
          onClick={handleButtonClick}
        >
          더보기
        </button>
        <MoreModal />
      </div>
    </header>
  );
}
