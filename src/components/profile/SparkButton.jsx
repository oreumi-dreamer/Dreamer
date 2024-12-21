import React, { useCallback } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

const SparkButton = React.memo(function SparkButton({
  postId,
  hasUserSparked,
  sparkCount,
  isLoggedIn,
  onSparkUpdate,
}) {
  const handleSparkAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) return;

    // 현재 클릭된 버튼의 데이터 속성 저장
    const buttonId = `spark-button-${postId}`;

    onSparkUpdate(postId);
    // 상태 업데이트 후 마이크로태스크 큐에서 포커스 복원
    queueMicrotask(() => {
      const button = document.getElementById(buttonId);
      button?.focus();
    });

    try {
      const res = await fetchWithAuth(`/api/post/spark/${postId}`);
      if (!res.ok) {
        throw new Error("반짝 실패");
        onSparkUpdate(postId); // 실패 시 상태 복구
      }
    } catch (error) {
      console.error("Error sparking post:", error);
      onSparkUpdate(postId); // 실패 시 상태 복구
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSparkAction(e);
    }
  };

  return (
    <button
      id={`spark-button-${postId}`}
      onClick={handleSparkAction}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-pressed={hasUserSparked}
      aria-label={hasUserSparked ? "반짝 취소" : "반짝"}
    >
      <img
        src={hasUserSparked ? "/images/star-fill.svg" : "/images/star.svg"}
        alt=""
        aria-hidden="true"
      />
      <span>{sparkCount}</span>
    </button>
  );
});

export default SparkButton;
