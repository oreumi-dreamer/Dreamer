"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Controls.module.css";

export function Button({ highlight, children, type, onClick, float }) {
  let buttonClass;

  buttonClass = highlight
    ? `${styles["button-highlight"]} ${styles["button"]}`
    : styles["button"];

  if (float === "left-bottom") {
    buttonClass = `${buttonClass} ${styles["button-left-bottom"]}`;
  }

  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {children}
    </button>
  );
}

export function ButtonLabel({ highlight, children, htmlFor }) {
  const buttonClass = highlight
    ? `${styles["button-highlight"]} ${styles["button"]}`
    : styles["button"];

  return (
    <label htmlFor={htmlFor} className={buttonClass}>
      {children}
    </label>
  );
}

export function Input({ type, value, onChange, background }) {
  let inputClass = styles["input"];
  if (type === "text" || type === "password" || type === "email") {
    inputClass = styles["input-text"];
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={inputClass}
      style={background === "white" ? { backgroundColor: "white" } : {}}
    />
  );
}

export function Textarea({ value, maxLength, onChange, background }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={styles["textarea"]}
      style={background === "white" ? { backgroundColor: "white" } : {}}
    />
  );
}

export function Select({
  id,
  name,
  onChange,
  value,
  required,
  children,
  background,
}) {
  return (
    <select
      id={id}
      name={name}
      onChange={onChange}
      value={value}
      required={required}
      className={styles["select"]}
      style={background === "white" ? { backgroundColor: "white" } : {}}
    >
      {children}
    </select>
  );
}

export function Checkbox({ type, background, value, onChange, children }) {
  if (type === "col") {
    return (
      <label className={styles["checkbox-col"]}>
        <input
          type="checkbox"
          value={value}
          onChange={onChange}
          className={styles["checkbox"]}
          style={background === "white" ? { backgroundColor: "white" } : {}}
        />
        {children}
      </label>
    );
  } else {
    return (
      <input
        type="checkbox"
        value={value}
        onChange={onChange}
        className={styles["checkbox"]}
        style={bg === "white" ? { backgroundColor: "white" } : {}}
      />
    );
  }
}

export function LoginForm({ onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className={styles["login-form"]}>
      {children}
    </form>
  );
}

export const CustomScrollbar = () => {
  const thumbRef = useRef(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);
  const [container, setContainer] = useState(null);

  const calculateThumbSize = useCallback(() => {
    if (!container) return;

    // 전체 문서의 높이와 viewport 높이를 사용
    const documentHeight = container.offsetHeight; // 컨테이너의 전체 높이
    const viewportHeight = window.innerHeight; // viewport 높이

    const heightPercentage = (viewportHeight / documentHeight) * 100;
    const minHeight = 20;
    const calculatedHeight = Math.max(
      minHeight,
      (viewportHeight * heightPercentage) / 100
    );

    setThumbHeight(calculatedHeight);
  }, [container]);

  const handleScroll = useCallback(() => {
    if (!container || isDragging) return;

    const documentHeight = container.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollTop = window.scrollY;

    const trackHeight = viewportHeight - thumbHeight;
    const percentage = scrollTop / (documentHeight - viewportHeight);
    setThumbTop(percentage * trackHeight);
  }, [container, isDragging, thumbHeight]);

  useEffect(() => {
    const htmlElement = document.querySelector("div#container");
    if (!htmlElement) return;

    setContainer(htmlElement);
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calculateThumbSize();
        handleScroll();
      });
    });

    resizeObserver.observe(htmlElement);

    // window의 스크롤 이벤트를 감지
    window.addEventListener("scroll", handleScroll);

    // 초기 계산
    calculateThumbSize();
    handleScroll();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [calculateThumbSize, handleScroll]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartScrollTop(window.scrollY); // container.scrollTop 대신 window.scrollY 사용
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const documentHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const trackHeight = viewportHeight - thumbHeight;

      // 스크롤바 위치 계산
      const percentage = deltaY / trackHeight;
      const scrollDistance = documentHeight - viewportHeight;
      const newScrollTop = Math.min(
        Math.max(0, startScrollTop + percentage * scrollDistance),
        scrollDistance
      ); // 스크롤 위치를 0과 최대값 사이로 제한

      window.scrollTo(0, newScrollTop);

      // 스크롤바 thumb의 위치도 제한하여 업데이트
      const thumbPercentage = newScrollTop / scrollDistance;
      const newThumbTop = Math.min(
        Math.max(0, thumbPercentage * trackHeight),
        trackHeight
      ); // thumb 위치를 0과 track 높이 사이로 제한

      setThumbTop(newThumbTop);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startY, startScrollTop, thumbHeight, container]);

  // 스크롤이 필요 없는 경우 스크롤바를 숨김
  // if (container && container.scrollHeight <= container.clientHeight) {
  //   return null;
  // }

  return (
    <div className={styles["scrollbar-track"]}>
      <div
        ref={thumbRef}
        className={styles["scrollbar-thumb"]}
        style={{
          height: `${thumbHeight}px`,
          top: `${thumbTop}px`,
        }}
        onMouseDown={handleMouseDown}
        role="presentation"
        aria-hidden="true"
      />
    </div>
  );
};
