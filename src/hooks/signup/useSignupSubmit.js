"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

export function useSignupSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { idToken } = useSelector((state) => state.auth);

  const submitSignup = async (formData) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...formData,
        }),
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
