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

// 인증 상태별 접근 제어 라우트 설정
const authRoutes = {
  // 로그인한 사용자가 접근할 수 없는 페이지
  authenticatedBlocked: ["/join", "/signup"],

  // 로그인하지 않은 사용자가 접근할 수 없는 페이지
  unauthenticatedBlocked: [
    "/debug",
    "/admin",
    "/account",
    "/account/modify-email",
    "/account/modify-password",
    "/tomong",
  ],

  // 인증 체크를 하지 않는 페이지
  noAuthCheck: ["/terms", "/privacy", "/join/verify-email"],
};

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const isRegistering = useSelector((state) => state.auth.isRegistering);
  const isEmailVerified = useSelector(
    (state) => state.auth.user?.emailVerified
  );

  const isExceptPath = authRoutes.noAuthCheck.includes(pathname);

  useEffect(() => {
    if (isExceptPath) return;

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // 로그인한 사용자가 접근할 수 없는 페이지 체크
          if (authRoutes.authenticatedBlocked.includes(pathname)) {
            console.log("Authenticated user blocked from:", pathname);
            router.push("/");
            return;
          }

          const result = await checkUserExists(dispatch);

          if (result === true) {
            dispatch(setRegistrationComplete());
          } else if (!isRegistering && isEmailVerified) {
            dispatch(resetRegistrationComplete());
            console.log("Redirect to signup");
            router.push("/signup");
          }
        } catch (error) {
          console.error("Auth check error:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());

        // 로그인하지 않은 사용자가 접근할 수 없는 페이지 체크
        if (
          authRoutes.unauthenticatedBlocked.some((route) =>
            pathname.startsWith(route)
          )
        ) {
          console.log("Unauthenticated user blocked from:", pathname);
          router.push("/join");
          return;
        }
      }
      setIsAuthChecked(true);
    });

    return () => unsubscribe();
  }, [dispatch, router, pathname, isRegistering]);

  if (isExceptPath) {
    return <NavProvider>{children}</NavProvider>;
  }

  if (!isAuthChecked) {
    return <Loading type="full" />;
  }

  return <NavProvider>{children}</NavProvider>;
}
