"use client";

import { useState } from "react";

export function useSignupSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // submit 함수를 직접 호출하는 방식으로 변경
  const submitSignup = async (formData) => {
    if (isLoading) return; // 이미 제출 중이면 중복 호출 방지

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        return true;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, submitSignup };
}
