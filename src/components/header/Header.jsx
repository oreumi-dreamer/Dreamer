"use client";

import React, { useRef, useEffect, useState } from "react";
import WideHeader from "@/components/header/WideHeader";
import { openModal, closeModal } from "@/store/modalSlice";
import { setActiveState } from "@/store/activeStateSlice";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@/hooks/styling/useMediaQuery";
import NarrowHeader from "./NarrowHeader";
import WritePost from "../write/WritePost";
export default function Header() {
  const buttonRef = useRef(null);
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const { isActive } = useSelector((state) => state.activeState);
  const isNarrowHeader = useMediaQuery("(max-width: 1152px)");
  const dispatch = useDispatch();

  const getActiveStateFromURL = (path) => {
    switch (path) {
      case "/":
        return "홈";
      case "/search":
        return "검색";
      case "/alarm":
        return "알람";
      default:
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

  const handleMoreBtnClick = () => {
    if (!isOpen) {
      dispatch(openModal("moreModal"));
    } else {
      if (modalType === "moreModal" || modalType === "changeMode") {
        dispatch(closeModal());
      }
    }
  };

  const handleActiveBtn = (btn) => {
    dispatch(setActiveState(btn));
  };

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const handleWriteBtnClick = () => {
    setIsWriteModalOpen(true);
  };
  const closeWriteModal = () => {
    if (isWriteModalOpen === true) {
      setIsWriteModalOpen(false);
    }
    window.location.pathname = "/";
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
