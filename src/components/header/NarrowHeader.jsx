"use client";

import React from "react";
import styles from "./NarrowHeader.module.css";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import { HeaderBaseModal } from "./HeaderModal";

export default function NarrowHeader({
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
          <Image
            src="/images/logo-moon.svg"
            alt="DREAMER"
            width={80}
            height={80}
          />
        </Link>
      </h1>
      <button
        className={`${styles["mode-toggle-btn"]} ${styles["light-mode"]}`}
      >
        <span className="sr-only">다크모드로 변경</span>
        <Image
          src="/images/toggle-sun.svg"
          alt="DREAMER"
          width={35}
          height={35}
        />
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
                  <span className="sr-only">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className={styles["nav-items"]}>
              <button
                className={`${styles["nav-item"]} ${styles["writing-btn"]} ${
                  isActive === "글쓰기" ? styles.active : ""
                }`}
                onClick={() => handleActiveBtn("글쓰기")}
              ></button>
            </li>
          </ul>
        </nav>
        <Link
          href="#"
          className={`${styles["nav-item"]} ${styles["profile-btn"]} ${isActive === "프로필" ? styles.active : ""}`}
          onClick={() => handleActiveBtn("프로필")}
        >
          <Image
            src="/images/rabbit.svg"
            alt="프로필사진"
            loading="lazy"
            width={40}
            height={40}
          />
        </Link>
        <button
          className={`${styles["nav-item"]} ${styles["more-btn"]} ${isOpen ? styles.active : ""}`}
          ref={buttonRef}
          onClick={onMoreBtnClick}
        ></button>
        {isOpen ? <HeaderBaseModal buttonRef={buttonRef} /> : null}
      </div>
    </header>
  );
}
