"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "@/lib/firebase";
import {
  setRegistrationComplete,
  resetRegistrationComplete,
  logout,
} from "@/store/authSlice";
import { verifyUser } from "@/lib/api/auth";
import Loading from "@/components/Loading";

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // 사용자 존재 여부 확인
          const result = await verifyUser();

          // 사용자의 기본 정보만 저장
          if (result.exists) {
            dispatch(setRegistrationComplete());
          } else {
            dispatch(resetRegistrationComplete());
          }
        } catch (error) {
          console.error("Auth check error:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Loading />;
  }

  return children;
}
