"use client";

import { useState, useEffect, useRef, useCallback, createRef } from "react";
import styles from "./Controls.module.css";
import Loading from "./Loading";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { disableScroll, enableScroll } from "@/utils/scrollHandler";

export const handleClickWithKeyboard = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.key === "Enter" || e.key === " ") {
    e.target.click();
  } else if (e.key === "Tab") {
    e.target.blur();
  }
};

export const CustomScrollbar = ({ containerRef, trackStyle }) => {
  // 상수 정의
  const TRACK_PADDING = 5; // px
  const TOTAL_PADDING = TRACK_PADDING * 2;

  const thumbRef = useRef(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);
  const [container, setContainer] = useState(null);

  const calculateThumbSize = useCallback(() => {
    if (!container) return;

    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const trackHeight = clientHeight - TOTAL_PADDING;

    const heightPercentage = (clientHeight / scrollHeight) * 100;
    const minHeight = 20;
    const calculatedHeight = Math.max(
      minHeight,
      (trackHeight * heightPercentage) / 100
    );

    setThumbHeight(calculatedHeight);
  }, [container]);

  const handleScroll = useCallback(() => {
    if (!container || isDragging) return;

    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    const trackHeight = clientHeight - thumbHeight - TOTAL_PADDING;

    const scrollDistance = scrollHeight - clientHeight;
    const percentage = scrollDistance > 0 ? scrollTop / scrollDistance : 0;
    const newThumbTop = Math.min(
      Math.max(TRACK_PADDING, percentage * trackHeight + TRACK_PADDING),
      trackHeight + TRACK_PADDING
    );

    setThumbTop(newThumbTop);
  }, [container, isDragging, thumbHeight]);

  useEffect(() => {
    // containerRef를 통해 직접 요소 참조
    const element = containerRef?.current;
    if (!element) return;

    setContainer(element);
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        calculateThumbSize();
        handleScroll();
      });
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculateThumbSize, handleScroll, containerRef]);

  useEffect(() => {
    if (!container) return;

    const scrollHandler = () => {
      requestAnimationFrame(() => {
        handleScroll();
      });
    };

    container.addEventListener("scroll", scrollHandler);
    return () => container.removeEventListener("scroll", scrollHandler);
  }, [container, handleScroll]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartScrollTop(container.scrollTop);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const deltaY = e.clientY - startY;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const trackHeight = clientHeight - thumbHeight;

      const percentage = deltaY / trackHeight;
      const scrollDistance = scrollHeight - clientHeight;
      const newScrollTop = Math.min(
        Math.max(0, startScrollTop + percentage * scrollDistance),
        scrollDistance
      );

      container.scrollTop = newScrollTop;

      const thumbPercentage = newScrollTop / scrollDistance;
      const newThumbTop = Math.min(
        Math.max(0, thumbPercentage * trackHeight),
        trackHeight
      );

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

  if (container && container.scrollHeight <= container.clientHeight) {
    return null;
  }

  return (
    <div className={styles["scrollbar-track"]} style={trackStyle}>
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

export function Button({
  highlight,
  children,
  type,
  onClick,
  float,
  className,
  disabled,
  style,
}) {
  let buttonClass;

  buttonClass = highlight
    ? `${styles["button-highlight"]} ${styles["button"]}`
    : styles["button"];

  if (float === "right-bottom") {
    buttonClass = `${buttonClass} ${styles["button-right-bottom"]}`;
  }

  buttonClass = className ? `${buttonClass} ${className}` : buttonClass;

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClass}
      onClick={onClick}
      style={style}
    >
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

export function ButtonLink({ highlight, children, disabled, href, type }) {
  const buttonClass = highlight
    ? `${styles["button-highlight"]} ${styles["button"]}`
    : styles["button"];

  if (disabled) {
    return (
      <button className={buttonClass} disabled>
        {children}
      </button>
    );
  }

  if (type === "a") {
    return (
      <a href={href} className={buttonClass}>
        {children}
      </a>
    );
  } else {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    );
  }
}

export function Input({
  type,
  value,
  onChange,
  background,
  disabled,
  id,
  onBlur,
  minLength,
  maxLength,
  onKeyDown,
}) {
  let inputClass = styles["input"];
  if (type === "text" || type === "password" || type === "email") {
    inputClass = styles["input-text"];
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      id={id}
      className={inputClass}
      disabled={disabled}
      style={background === "white" ? { backgroundColor: "white" } : {}}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      minLength={minLength}
      maxLength={maxLength}
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
  background = "default",
  label,
  options = [],
  placeholder = "Select option",
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value);
  const selectRef = useRef(null);
  const listboxRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const optionRefs = useRef([]);

  // 옵션 요소들의 ref 배열 초기화
  useEffect(() => {
    optionRefs.current = Array(options.length)
      .fill()
      .map((_, i) => optionRefs.current[i] || createRef());
  }, [options.length]);

  // focusedIndex가 변경될 때마다 해당 요소에 포커스
  useEffect(() => {
    if (
      isOpen &&
      focusedIndex >= 0 &&
      optionRefs.current[focusedIndex]?.current
    ) {
      optionRefs.current[focusedIndex].current.focus();
    }
  }, [focusedIndex, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        // 외부 클릭 시 select 버튼으로 포커스 이동
        selectRef.current.querySelector("button").focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Escape":
        setIsOpen(false);
        selectRef.current.querySelector("button").focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setFocusedIndex(0);
        } else {
          setFocusedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex !== -1) {
          handleSelect(options[focusedIndex]);
          selectRef.current.querySelector("button").focus();
        } else {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setFocusedIndex(0);
          }
        }
        break;
      case "Tab":
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      default:
        break;
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option.value);
    onChange?.({ target: { name, value: option.value } });
    setIsOpen(false);
  };

  const handleOptionClick = (option, e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSelect(option);
    setIsOpen(false);
    selectRef.current.querySelector("button").focus();
  };

  const toggleSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      // 드롭다운이 열릴 때 첫 번째 옵션에 포커스
      setFocusedIndex(0);
    }
  };

  const selectedLabel =
    options.find((opt) => opt.value === selectedOption)?.label || placeholder;

  return (
    <div
      className={styles.selectContainer}
      ref={selectRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={`${styles.selectButton} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${id}-label` : undefined}
        id={id}
        onClick={toggleSelect}
        onKeyDown={handleKeyDown}
        style={background === "white" ? { backgroundColor: "white" } : {}}
      >
        {selectedLabel}
      </button>

      {label && (
        <label id={`${id}-label`} className={styles.label}>
          {label}
        </label>
      )}

      {isOpen && (
        <div className={styles.dropdownContainer}>
          <ul
            ref={listboxRef}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className={styles.optionsList}
            tabIndex={-1}
            style={{
              ...(background === "white" ? { backgroundColor: "white" } : {}),
              maxHeight: "200px",
            }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                ref={optionRefs.current[index]}
                role="option"
                aria-selected={selectedOption === option.value}
                className={`${styles.option} ${
                  focusedIndex === index ? styles.focused : ""
                }`}
                onClick={(e) => handleOptionClick(option, e)}
                onMouseEnter={() => setFocusedIndex(index)}
                tabIndex={0}
                onKeyDown={handleKeyDown}
              >
                {option.label}
              </li>
            ))}
          </ul>
          <CustomScrollbar
            containerRef={listboxRef}
            trackStyle={{ top: "calc(100% + 0.5rem)" }}
          />
        </div>
      )}
      <select
        name={name}
        value={selectedOption}
        required={required}
        style={{ display: "none" }}
        onChange={() => {}}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Checkbox({ type, background, checked, onChange, children }) {
  if (type === "col") {
    return (
      <label
        className={`${styles["checkbox"]} ${styles["checkbox-col"]}`}
        tabIndex={0}
        role="checkbox"
        onKeyDown={handleClickWithKeyboard}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={styles["checkbox"]}
          style={background === "white" ? { backgroundColor: "white" } : {}}
          tabIndex={-1}
        />
        {children}
      </label>
    );
  } else {
    return (
      <label
        className={styles["checkbox"]}
        tabIndex={0}
        role="checkbox"
        onKeyDown={handleClickWithKeyboard}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={styles["checkbox"]}
          style={background === "white" ? { backgroundColor: "white" } : {}}
          tabIndex={-1}
        />
        {children}
      </label>
    );
  }
}

export function LoginForm({ onSubmit, className, children }) {
  let formClass = styles["login-form"];
  if (className) {
    formClass = `${formClass} ${className}`;
  }
  return (
    <form onSubmit={onSubmit} className={formClass}>
      {children}
    </form>
  );
}

export function Divider({ className }) {
  const dividerClass = className
    ? `${styles["dashed-line"]} ${className}`
    : styles["dashed-line"];

  return <div className={dividerClass}></div>;
}

export function ConfirmModal({ onConfirm, isOpen, closeModal, message }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className={styles["confirm-modal"]}>
      <p>{message}</p>
      <div>
        <button onClick={onConfirm} className={styles["btn-yes"]}>
          네
        </button>
        <button onClick={closeModal} className={styles["btn-no"]}>
          아니오
        </button>
      </div>
      <button onClick={closeModal} className={styles["btn-close"]}>
        <span className="sr-only">닫기</span>
      </button>
    </dialog>
  );
}

export function ShareModal({ isOpen, closeModal, link }) {
  const dialogRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      dialog?.showModal();
      disableScroll();
    } else {
      enableScroll();
      dialog?.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    enableScroll();
    setIsCopied(false);
    closeModal();
  };

  // 백드롭 클릭을 감지하는 이벤트 핸들러
  const handleClick = (e) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (dialogDimensions) {
      const isClickedInDialog =
        e.clientX >= dialogDimensions.left &&
        e.clientX <= dialogDimensions.right &&
        e.clientY >= dialogDimensions.top &&
        e.clientY <= dialogDimensions.bottom;

      if (!isClickedInDialog) {
        handleClose();
      }
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(link);
    setIsCopied(true);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        url: link,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles["share-modal"]}
      onClick={handleClick}
    >
      <button onClick={handleClose} className={styles["btn-close"]}>
        <img src="/images/close-without-padding.svg" alt="닫기" />
      </button>
      <h2>공유하기</h2>
      <p>다른 사람에게 꿈을 공유해보세요.</p>
      <form onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={link}
          readOnly
          onClick={(e) => e.target.select()}
        />
        {isCopied ? (
          <Button highlight={true} onClick={handleCopy}>
            복사 완료
          </Button>
        ) : (
          <Button highlight={true} onClick={handleCopy}>
            복사
          </Button>
        )}
      </form>
      <button
        className={styles["btn-share"]}
        onClick={async () => await handleShare()}
      >
        <img src="/images/ios-share-circle.svg" alt="" />
        다른 곳에 공유
      </button>
    </dialog>
  );
}

export function UsersList({
  isOpen,
  closeModal,
  users,
  setUsers,
  type,
  isLoading,
}) {
  const dialogRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      dialog?.showModal();
      disableScroll();
    } else {
      enableScroll();
      dialog?.close();
    }
  }, [isOpen]);

  const handleClose = () => {
    enableScroll();
    closeModal();
  };

  // 백드롭 클릭을 감지하는 이벤트 핸들러
  const handleClick = (e) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (dialogDimensions) {
      const isClickedInDialog =
        e.clientX >= dialogDimensions.left &&
        e.clientX <= dialogDimensions.right &&
        e.clientY >= dialogDimensions.top &&
        e.clientY <= dialogDimensions.bottom;

      if (!isClickedInDialog) {
        handleClose();
      }
    }
  };

  const handleFollow = async (userId) => {
    if (!user) {
      router.push("/");
      return;
    }

    const isFollowing = users.find(
      (user) => user.userId === userId
    ).isFollowing;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.userId === userId ? { ...user, isFollowing: !isFollowing } : user
      )
    );
    const res = await fetchWithAuth(`/api/account/follow/${userId}`);
    const data = await res.json();

    if (!data.success) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId ? { ...user, isFollowing: !isFollowing } : user
        )
      );
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles["share-modal"]}
      onClick={handleClick}
    >
      <button onClick={handleClose} className={styles["btn-close"]}>
        <img src="/images/close-without-padding.svg" alt="닫기" />
      </button>
      <h2>{type === "followers" ? "팔로워" : "팔로잉"}</h2>
      <ul className={styles["users-list"]}>
        {isLoading && <Loading type="circle" />}
        {!isLoading && users.length === 0 && (
          <p className={styles["no-users"]}>
            아직 {type === "followers" ? "팔로워가 " : "팔로잉이 "}없어요!
          </p>
        )}
        {!isLoading &&
          users.map((user) => (
            <li key={user.userId}>
              <Link href={`/users/${user.userId}`} onClick={handleClose}>
                <img
                  src={
                    user.profileImageUrl
                      ? user.profileImageUrl
                      : "/images/rabbit.svg"
                  }
                  alt={`${user.userName}님의 프로필 사진`}
                />
                <span>{user.userName}</span>
                <span>@{user.userId}</span>
              </Link>
              {user.isMyself ? null : user.isFollowing ? (
                <Button
                  className={styles["recommend-follow"]}
                  onClick={() => handleFollow(user.userId)}
                >
                  팔로잉
                </Button>
              ) : (
                <Button
                  className={styles["recommend-follow"]}
                  onClick={() => handleFollow(user.userId)}
                  highlight={true}
                >
                  팔로우
                </Button>
              )}
            </li>
          ))}
      </ul>
    </dialog>
  );
}

export function WithdrawModal({ isOpen, closeModal, userId }) {
  const dialogRef = useRef(null);
  const [step, setStep] = useState(1);
  const [confirmUserId, setConfirmUserId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      dialog?.showModal();
      disableScroll();
    } else {
      enableScroll();
      dialog?.close();
      // 모달이 닫힐 때 상태 초기화
      setStep(1);
      setConfirmUserId("");
      setError("");
    }
  }, [isOpen]);

  const handleClose = () => {
    enableScroll();
    closeModal();
  };

  // 백드롭 클릭을 감지하는 이벤트 핸들러
  const handleClick = (e) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (dialogDimensions) {
      const isClickedInDialog =
        e.clientX >= dialogDimensions.left &&
        e.clientX <= dialogDimensions.right &&
        e.clientY >= dialogDimensions.top &&
        e.clientY <= dialogDimensions.bottom;

      if (!isClickedInDialog) {
        handleClose();
      }
    }
  };

  const handleWithdraw = async () => {
    if (confirmUserId !== userId) {
      setError("아이디가 일치하지 않습니다.");
      return;
    }

    try {
      // API 호출을 통한 회원 탈퇴 처리
      const response = await fetchWithAuth("/api/auth/withdraw", {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "회원 탈퇴 처리 중 오류가 발생했습니다."
        );
      }

      // 성공 시 처리
      alert(
        "회원 탈퇴가 완료되었습니다.\n그동안 DREMAER를 이용해 주셔서 감사합니다."
      );
      location.href = "/logout";
    } catch (error) {
      setError(error.message);
      console.error("Withdraw error:", error);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles["withdraw-modal"]}
      onClick={handleClick}
    >
      <button onClick={handleClose} className={styles["btn-close"]}>
        <img src="/images/close-without-padding.svg" alt="닫기" />
      </button>

      {step === 1 ? (
        <div
          className={styles["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>회원 탈퇴</h2>
          <p>정말로 탈퇴하시겠습니까?</p>
          <p className={styles["warning-text"]}>
            탈퇴하시면 모든 데이터가 삭제되며, 복구할 수 없습니다.
          </p>
          <div className={styles["button-group"]}>
            <Button onClick={() => setStep(2)} highlight={true}>
              예
            </Button>
            <Button onClick={handleClose}>아니오</Button>
          </div>
        </div>
      ) : (
        <div
          className={styles["modal-content"]}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>회원 탈퇴 확인</h2>
          <p>
            회원 탈퇴를 진행하시려면 아이디를 입력해주세요.
            <br />이 작업은 취소할 수 없습니다.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleWithdraw();
            }}
          >
            <div className={styles["input-group"]}>
              <Input
                type="text"
                value={confirmUserId}
                onChange={(e) => setConfirmUserId(e.target.value)}
                placeholder={userId}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles["button-group"]}>
              <Button type="button" onClick={() => setStep(1)}>
                이전
              </Button>
              <Button type="submit" highlight={true}>
                확인
              </Button>
            </div>
          </form>
        </div>
      )}
    </dialog>
  );
}

export const CommonModal = ({ isOpen, closeModal, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      dialog?.showModal();
      disableScroll();
    } else {
      enableScroll();
      dialog?.close();
    }
  }, [isOpen]);

  // 백드롭 클릭을 감지하는 이벤트 핸들러
  const handleClick = (e) => {
    const dialogDimensions = dialogRef.current?.getBoundingClientRect();
    if (dialogDimensions) {
      const isClickedInDialog =
        e.clientX >= dialogDimensions.left &&
        e.clientX <= dialogDimensions.right &&
        e.clientY >= dialogDimensions.top &&
        e.clientY <= dialogDimensions.bottom;

      if (!isClickedInDialog) {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    enableScroll();
    closeModal();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClick}
      className={styles["common-modal"]}
    >
      <button onClick={handleClose} className={styles["btn-close"]}>
        <img src="/images/close-without-padding.svg" alt="닫기" />
      </button>
      {children}
    </dialog>
  );
};
