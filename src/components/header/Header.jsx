"use client";

import React, { useEffect, useRef, useState } from "react";
import WideHeader from "@/components/header/WideHeader";
import { openModal, closeModal, setModalType } from "@/store/modalSlice";
import { useDispatch, useSelector } from "react-redux";
export default function Header() {
  const buttonRef = useRef(null);
  const [isActive, setIsActive] = useState("홈");
  const { isOpen, modalType } = useSelector((state) => state.modal);
  // const [modalStyle, setModalStyle] = useState({});

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

  // const handleCloseModal = (e) => {
  //   setIsOpenModal(false);
  // };

  // // 더보기 버튼의 위치에 따른 모달의 유동적움직임함수
  // const updateModalPosition = () => {
  //   if (buttonRef.current) {
  //     const buttonRect = buttonRef.current.getBoundingClientRect();
  //     setModalStyle({
  //       position: "absolute",
  //       top: `${buttonRect.top + window.scrollY + -600}px`,
  //       left: `${buttonRect.left + window.scrollX + -80}px`,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   if (modalType) {
  //     updateModalPosition();
  //     window.addEventListener("resize", updateModalPosition);
  //   }
  //   return () => {
  //     window.removeEventListener("resize", updateModalPosition);
  //   };
  // }, [modalType]);

  return (
    <>
      <WideHeader
        onMoreBtnClick={() => handleMoreBtnClick("moreModal")}
        buttonRef={buttonRef}
        isActive={isActive}
        handleActiveBtn={handleActiveBtn}
      />
    </>
  );
}
