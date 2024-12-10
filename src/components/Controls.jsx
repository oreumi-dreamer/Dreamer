import { useState, useEffect, useRef } from "react";
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

export const CustomScrollbar = ({ containerRef, isLoading }) => {
  const thumbRef = useRef(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);

  const calculateThumbSize = () => {
    if (!containerRef.current) return;

    const { clientHeight, scrollHeight } = containerRef.current;
    const heightPercentage = (clientHeight / scrollHeight) * 100;
    const minHeight = 20; // 최소 스크롤바 높이
    const calculatedHeight = Math.max(
      minHeight,
      (clientHeight * heightPercentage) / 100
    );
    setThumbHeight(calculatedHeight);
  };

  const handleScroll = () => {
    if (!containerRef.current || isDragging) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const trackHeight = clientHeight - thumbHeight;
    const percentage = scrollTop / (scrollHeight - clientHeight);
    setThumbTop(percentage * trackHeight);
  };

  // 컨텐츠 로드 완료 후 초기 계산
  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    // 컨텐츠가 완전히 렌더링될 시간을 주기 위해 약간의 지연 추가
    const timeoutId = setTimeout(() => {
      calculateThumbSize();
      handleScroll();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // 스크롤 및 리사이즈 이벤트 리스너
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", calculateThumbSize);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateThumbSize);
    };
  }, [thumbHeight]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartScrollTop(containerRef.current.scrollTop);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const { scrollHeight, clientHeight } = containerRef.current;
      const trackHeight = clientHeight - thumbHeight;

      const percentage = deltaY / trackHeight;
      const newScrollTop =
        startScrollTop + percentage * (scrollHeight - clientHeight);

      containerRef.current.scrollTop = newScrollTop;
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
  }, [isDragging, startY, startScrollTop, thumbHeight]);

  // 스크롤이 필요 없는 경우 스크롤바를 숨김
  if (
    containerRef.current &&
    containerRef.current.scrollHeight <= containerRef.current.clientHeight
  ) {
    return null;
  }

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
