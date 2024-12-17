"use client";

import React, { useRef, useEffect, useState } from "react";
import WideHeader from "@/components/header/WideHeader";
import { openModal, closeModal } from "@/store/modalSlice";
import { setActiveState } from "@/store/activeStateSlice";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@/hooks/styling/useMediaQuery";
import NarrowHeader from "./NarrowHeader";
import useTheme from "@/hooks/styling/useTheme";
import WritePost from "../write/WritePost";
import { useRouter } from "next/navigation";
export default function Header() {
  const buttonRef = useRef(null);
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const { isActive } = useSelector((state) => state.activeState);
  const { theme, changeTheme } = useTheme();
  const isNarrowHeader = useMediaQuery("(max-width: 1152px)");
  const dispatch = useDispatch();
  const router = useRouter();
  const isLightMode =
    theme === "light" || localStorage.getItem("theme") === "light";
  const isDarkMode =
    theme === "dark" || localStorage.getItem("theme") === "dark";

  const getActiveStateFromURL = (path) => {
    switch (path) {
      case "/":
        return "홈";
      case "/search":
        return "검색";
      case "/alarm":
        return "알람";
      case "/tomong":
        return "토몽";
      default:
        if (/^\/[\wㄱ-ㅎ가-힣._~%\-]+$/.test(path)) {
          return "프로필";
        }
        return "";
    }
  };

  const handleURLChange = () => {
    const currentPath = window.location.pathname;
    const newActiveState = getActiveStateFromURL(currentPath);
    dispatch(setActiveState(newActiveState));
  };

  // URL 변경 감지 및 상태 업데이트
  useEffect(() => {
    handleURLChange(); // 초기 URL 상태 설정

    window.addEventListener("popstate", handleURLChange);
    return () => {
      window.removeEventListener("popstate", handleURLChange);
    };
  }, []);

  useEffect(() => {
    dispatch(closeModal());
  }, []);

  const handleActiveBtn = (btn) => {
    dispatch(setActiveState(btn));
  };

  const handleMoreBtnClick = () => {
    if (!isOpen) {
      dispatch(openModal("moreModal"));
    } else {
      if (modalType === "moreModal" || modalType === "changeMode") {
        dispatch(closeModal());
      }
    }
  };

  const handleToggleBtn = () => {
    if (isLightMode) {
      changeTheme("dark");
    } else if (isDarkMode) {
      changeTheme("light");
    }
  };
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [prevPage, setPrevPage] = useState("");
  const handleWriteBtnClick = () => {
    setPrevPage(window.location.pathname);
    setIsWriteModalOpen(true);
  };
  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
    if (prevPage) {
      router.push(prevPage);
      handleActiveBtn(getActiveStateFromURL(prevPage));
    } else {
      handleActiveBtn("홈");
    }
  };

  return (
    <>
      {isNarrowHeader ? (
        <>
          <NarrowHeader
            onMoreBtnClick={() => handleMoreBtnClick("moreModal")}
            buttonRef={buttonRef}
            isActive={isActive}
            handleActiveBtn={handleActiveBtn}
            handleWriteBtnClick={handleWriteBtnClick}
            handleToggleBtn={handleToggleBtn}
          />
          <WritePost
            isWriteModalOpen={isWriteModalOpen}
            closeWriteModal={closeWriteModal}
          />
        </>
      ) : (
        <>
          <WideHeader
            onMoreBtnClick={() => handleMoreBtnClick("moreModal")}
            buttonRef={buttonRef}
            isActive={isActive}
            handleActiveBtn={handleActiveBtn}
            handleWriteBtnClick={handleWriteBtnClick}
            handleToggleBtn={handleToggleBtn}
          />
          <WritePost
            isWriteModalOpen={isWriteModalOpen}
            closeWriteModal={closeWriteModal}
          />
        </>
      )}
    </>
  );
}
