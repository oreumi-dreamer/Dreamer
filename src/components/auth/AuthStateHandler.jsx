"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  setRegistrationComplete,
  resetRegistrationComplete,
  logout,
} from "@/store/authSlice";
import { checkUserExists } from "@/utils/auth/checkUser";
import Loading from "@/components/Loading";

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const isRegistering = useSelector((state) => state.auth.isRegistering); // 회원가입 중인지 확인

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const result = await checkUserExists(dispatch);

          if (result === true) {
            dispatch(setRegistrationComplete());
          } else if (!isRegistering) {
            // 회원가입 중이 아닐 때만 리다이렉트
            dispatch(resetRegistrationComplete());
            router.push("/signup");
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
  }, [dispatch, router, isRegistering]);

  if (!isAuthChecked) {
    return <Loading type="full" />;
  }

  return children;
}
