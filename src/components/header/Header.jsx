"use client";

import React, { useRef, useState, useEffect } from "react";
import WideHeader from "@/components/header/WideHeader";
import { openModal, closeModal, setModalType } from "@/store/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import useMediaQuery from "@/hooks/styling/useMediaQuery";
import NarrowHeader from "./NarrowHeader";
export default function Header() {
  const buttonRef = useRef(null);
  const [modalStyle, setModalStyle] = useState({});
  const [isActive, setIsActive] = useState("홈");
  const { isOpen, modalType } = useSelector((state) => state.modal);
  const isNarrowHeader = useMediaQuery("(max-width: 1440px)");

  const dispatch = useDispatch();
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
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalStyle({
        position: "absolute",
        top: `${buttonRect.top + window.scrollY - 600}px`,
        left: `${buttonRect.left + window.scrollX - 80}px`,
      });
    }
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
