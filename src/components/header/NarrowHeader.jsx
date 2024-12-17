"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./NarrowHeader.module.css";
import Link from "next/link";
import { HeaderBaseModal } from "./HeaderModal";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { closeModal } from "@/store/modalSlice";
import { outsideClickModalClose } from "@/utils/outsideClickModalClose";
import { calculateMobileModalPosition } from "@/utils/calculateModalPosition";
import useTheme from "@/hooks/styling/useTheme";
import useMediaQuery from "@/hooks/styling/useMediaQuery";

export default function NarrowHeader({
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
  const isTopHeader = useMediaQuery("(max-width: 720px)");
  const isLightMode =
    theme === "light" || localStorage.getItem("theme") === "light";
  const isDarkMode =
    theme === "dark" || localStorage.getItem("theme") === "dark";
  const isHidden =
    theme === "device" || localStorage.getItem("theme") === "device";

  const navItems = [
    { label: "홈", className: "home-btn", href: "/", img: "/images/home.svg" },
    {
      label: "검색",
      className: "search-btn",
      href: "/search",
      img: "/images/search.svg",
    },
    {
      label: "알람",
      className: "alarm-btn",
      href: "/alarm",
      img: "/images/alarm.svg",
    },
    {
      label: "토몽",
      className: "tomong-btn",
      href: "/tomong",
      img: "/images/tomong.svg",
    },
  ];

  useEffect(() => {
    if (modalRef.current && buttonRef.current) {
      const updatePosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        let position;
        if (isTopHeader) {
          position = calculateMobileModalPosition(buttonRef, 0, 48);
        } else {
          position = {
            position: "absolute",
            top: `${buttonRect.bottom - 532}px`,
            left: `${buttonRect.right} - 50px`,
            zIndex: "1000",
          };
        }
        if (position) {
          setModalStyle(position);
        }
      };

      updatePosition(); // Initial position update
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
            src="/images/logo-moon.svg"
            alt="DREAMER"
            width={80}
            height={80}
          />
        </Link>
      </h1>
      <button
        className={`${styles["mode-toggle-btn"]} ${isLightMode ? styles["light-mode"] : isDarkMode ? styles["dark-mode"] : null} ${isHidden ? styles["hidden-btn"] : ""}`}
        onClick={handleToggleBtn}
      >
        {isLightMode ? (
          <>
            <span className="sr-only">다크모드로 변경</span>
            <Image
              src="/images/toggle-sun.svg"
              alt="라이트모드"
              width={35}
              height={35}
            />
          </>
        ) : isDarkMode ? (
          <>
            <span className="sr-only">라이트모드로 변경</span>
            <Image
              src="/images/toggle-moon.svg"
              alt="다크모드"
              width={35}
              height={35}
            />
          </>
        ) : (
          ""
        )}
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
                  <Image
                    src={item.img}
                    alt={item.label}
                    width={30}
                    height={30}
                  />
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
                <Image
                  src="/images/writing.svg"
                  alt="글쓰기"
                  width={30}
                  height={30}
                />
              </button>
            </li>
          </ul>
        </nav>
        <Link
          href={`/${userId}`}
          className={`${styles["nav-item"]} ${styles["profile-btn"]}`}
          onClick={() => handleActiveBtn("프로필")}
        >
          <img
            src={profileImageUrl ? profileImageUrl : "/images/rabbit.svg"}
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
        >
          <Image
            src="/images/more.svg"
            alt="더보기"
            loading="lazy"
            width={40}
            height={40}
          />
        </button>
        {isOpen && <HeaderBaseModal ref={modalRef} style={modalStyle} />}
      </div>
    </header>
  );
}
