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
import { useRouter, usePathname } from "next/navigation";
export default function Header() {
  const buttonRef = useRef(null);
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const { isActive } = useSelector((state) => state.activeState);
  const { user } = useSelector((state) => state.auth);
  const { userId } = user || {};
  const { theme, changeTheme } = useTheme();
  const isNarrowHeader = useMediaQuery("(max-width: 1152px)");
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isLightMode =
    theme === "light" || localStorage.getItem("theme") === "light";
  const isDarkMode =
    theme === "dark" || localStorage.getItem("theme") === "dark";

  const getActiveStateFromURL = (pathname) => {
    const decodedPath = decodeURIComponent(pathname);
    if (pathname === "/") {
      return "홈";
    } else if (pathname === "/search") {
      return "검색";
    } else if (pathname === "/tomong") {
      return "토몽 AI";
    } else if (userId && decodedPath.includes(`/users/${userId}`)) {
      return "프로필";
    } else {
      return "";
    }
  };

  useEffect(() => {
    const newActiveState = getActiveStateFromURL(pathname);
    dispatch(setActiveState(newActiveState));
  }, [pathname, dispatch, userId, router.isReady]);

  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

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
          {isWriteModalOpen && (
            <WritePost
              isWriteModalOpen={isWriteModalOpen}
              closeWriteModal={closeWriteModal}
            />
          )}
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
          {isWriteModalOpen && (
            <WritePost
              isWriteModalOpen={isWriteModalOpen}
              closeWriteModal={closeWriteModal}
            />
          )}
        </>
      )}
    </>
  );
}
