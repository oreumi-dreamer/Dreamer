"use client";

import React, { useRef, useState, useEffect } from "react";
import WideHeader from "@/components/header/WideHeader";
import { openModal, closeModal, setModalType } from "@/store/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@/hooks/styling/useMediaQuery";
import NarrowHeader from "./NarrowHeader";
import { calculateModalPosition } from "@/utils/calculateModalPosition";
export default function Header() {
  const buttonRef = useRef(null);
  const [isActive, setIsActive] = useState("홈");
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const isNarrowHeader = useMediaQuery("(max-width: 1440px)");

  const dispatch = useDispatch();

  const getActiveStateFromURL = (path) => {
    switch (path) {
      case "/":
        return "홈";
      case "/search":
        return "검색";
      case "/message":
        return "메세지";
      case "/alarm":
        return "알람";
      default:
        return "";
    }
  };

  const handleURLChange = () => {
    const currentPath = window.location.pathname;
    const newActiveState = getActiveStateFromURL(currentPath);
    setIsActive(newActiveState);
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
    setIsActive(btn);
  };

  const updateModalPosition = () => {
    const position = calculateModalPosition(buttonRef, -80, -600);
    if (position) setModalStyle(position);
  };

  useEffect(() => {
    if (isOpen) {
      updateModalPosition();
      window.addEventListener("resize", updateModalPosition);
    }
    return () => {
      window.removeEventListener("resize", updateModalPosition);
    };
  }, [isOpen, modalType]);

  return (
    <>
      {isNarrowHeader ? (
        <NarrowHeader
          onMoreBtnClick={() => handleMoreBtnClick("moreModal")}
          buttonRef={buttonRef}
          modalStyle={modalStyle}
          isActive={isActive}
          handleActiveBtn={handleActiveBtn}
        />
      ) : (
        <WideHeader
          onMoreBtnClick={() => handleMoreBtnClick("moreModal")}
          buttonRef={buttonRef}
          modalStyle={modalStyle}
          isActive={isActive}
          handleActiveBtn={handleActiveBtn}
        />
      )}
    </>
  );
}
