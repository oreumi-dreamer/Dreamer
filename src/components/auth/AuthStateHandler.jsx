"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  setRegistrationComplete,
  resetRegistrationComplete,
  logout,
} from "@/store/authSlice";
import { checkUserExists } from "@/utils/auth/checkUser";
import Loading from "@/components/Loading";
import NavProvider from "../NavProvider";

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const isRegistering = useSelector((state) => state.auth.isRegistering); // 회원가입 중인지 확인

  const exceptPaths = ["/terms", "/privacy"];
  const isExceptPath = exceptPaths.includes(pathname);

  useEffect(() => {
    // 이용약관, 개인정보처리방침 페이지에서는 인증 체크를 하지 않음
    if (isExceptPath) return;

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

  if (isExceptPath) {
    return <NavProvider>{children}</NavProvider>;
  }

  if (!isAuthChecked) {
    return <Loading type="full" />;
  }

  return <NavProvider>{children}</NavProvider>;
}
