"use client";
let scrollPosition = 0; // 스크롤 위치 저장
let isScrollDisabled = false; // 스크롤 잠금 상태 플래그

export const disableScroll = () => {
  if (isScrollDisabled) return; // 이미 스크롤이 비활성화된 경우 실행하지 않음
  scrollPosition = window.scrollY; // 스크롤 위치 저장
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  isScrollDisabled = true; // 스크롤 잠금 상태로 전환
};

export const enableScroll = () => {
  if (!isScrollDisabled) return; // 이미 스크롤이 활성화된 경우 실행하지 않음
  document.body.style.position = "";
  document.body.style.top = "";
  window.scrollTo(0, scrollPosition); // 저장된 위치로 복원
  isScrollDisabled = false; // 스크롤 잠금 해제
};
