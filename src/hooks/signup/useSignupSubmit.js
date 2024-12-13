"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess, setRegistrationComplete } from "@/store/authSlice";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export function useSignupSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const submitSignup = async (formData) => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchWithAuth("/api/join", {
        method: "POST",
        body: {
          ...formData,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Redux 상태 업데이트
        dispatch(
          loginSuccess({
            user: {
              exists: true,
              uid: data.uid,
              email: data.email,
              userId: formData.userId,
              userName: formData.userName,
              profileImageUrl: data.profileImageUrl,
              theme: formData.theme,
            },
          })
        );

        dispatch(setRegistrationComplete());

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
