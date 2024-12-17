"use client";

import { useEffect } from "react";

export default function ThemeHandler({ children }) {
  useEffect(() => {
    // 미디어 쿼리 매칭 상태를 감지하는 함수
    const handleThemeChange = (e) => {
      const userTheme = localStorage.getItem("userTheme");
      const html = document.querySelector("html");

      if (userTheme === "device") {
        html.dataset.theme = e.matches ? "dark" : "light";
      }
    };

    // 미디어 쿼리 매칭 객체 생성
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // 초기 테마 설정
    handleThemeChange(darkModeMediaQuery);

    // 시스템 테마 변경 이벤트 리스너 등록
    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return <>{children}</>;
}
