"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import { MoreModal, ChangeModeModal } from "./HeaderModal";

export default function Header() {
  const buttonRef = useRef(null);
  const modalRef = useRef(null);
  const [isActive, setIsActive] = useState("홈");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openModalName, setOpenModalName] = useState(null);
  const [modalStyle, setModalStyle] = useState({});

  const handleButtonClick = (e) => {
    const buttons = document.querySelectorAll("button");
    const clickedBtn = e.currentTarget;
    const btnText = clickedBtn.textContent;

    setIsActive(btnText);

    buttons.forEach((button) => {
      if (button !== clickedBtn) {
        button.classList.remove(styles.active);
      }
    });
    clickedBtn.classList.add(styles.active);
  };

  const handleClickMoreBtn = (e) => {
    if (!isOpenModal) {
      setOpenModalName("더보기");
      setIsOpenModal(true);
    } else {
      setOpenModalName(null);
      setIsOpenModal(false);
    }
  };

  const handleCloseModal = (e) => {
    setIsOpenModal(false);
  };

  // 더보기 버튼의 위치에 따른 모달의 유동적움직임함수
  const updateModalPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalStyle({
        position: "absolute",
        top: `${buttonRect.top + window.scrollY + -600}px`,
        left: `${buttonRect.left + window.scrollX + -80}px`,
      });
    }
  };

  useEffect(() => {
    if (openModalName) {
      updateModalPosition();
      window.addEventListener("resize", updateModalPosition);
    }
    return () => {
      window.removeEventListener("resize", updateModalPosition);
    };
  }, [openModalName]);

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>
        <Link href={"#"}>
          <img src="/images/logo-full.svg" alt="logo" />
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
            <li className={styles["nav-items"]}>
              <button
                className={`${styles["home-btn"]} ${styles.active}`}
                onClick={handleButtonClick}
              >
                홈
              </button>
            </li>
            <li className={styles["nav-items"]}>
              <button
                className={styles["search-btn"]}
                onClick={handleButtonClick}
              >
                검색
              </button>
            </li>
            <li className={styles["nav-items"]}>
              <button
                className={styles["message-btn"]}
                onClick={handleButtonClick}
              >
                메시지
              </button>
            </li>
            <li className={styles["nav-items"]}>
              <button
                className={styles["alarm-btn"]}
                onClick={handleButtonClick}
              >
                알림
              </button>
            </li>
            <li className={styles["nav-items"]}>
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
          <img src="/images/rabbit.svg" alt="프로필사진" loading="lazy" />
          <p>JINI</p>
        </button>
        <button
          className={`${styles["more-btn"]} ${isOpenModal ? styles.active : ""}`}
          ref={buttonRef}
          onClick={handleClickMoreBtn}
        >
          더보기
        </button>
        {openModalName === "더보기" && isOpenModal && (
          <div ref={modalRef} style={modalStyle}>
            <MoreModal
              setOpenModalName={setOpenModalName}
              isOpen={isOpenModal}
              onClose={handleCloseModal}
            />
          </div>
        )}
        {openModalName === "모드 전환" && isOpenModal && (
          <div ref={modalRef} style={modalStyle}>
            <ChangeModeModal
              setOpenModalName={setOpenModalName}
              isOpen={isOpenModal}
              onClose={handleCloseModal}
            />
          </div>
        )}
      </div>
    </header>
  );
}
