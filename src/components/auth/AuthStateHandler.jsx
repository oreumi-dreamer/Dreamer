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

const authRoutes = {
  // 로그인한 사용자이면서 Firestore에도 등록된 사용자가 접근할 수 없는 페이지
  registeredBlocked: ["/join"],

  // 로그인하지 않은 사용자가 접근할 수 없는 페이지
  unauthenticatedBlocked: [
    "/debug",
    "/admin",
    "/account",
    "/account/modify-email",
    "/account/modify-password",
    "/signup", // signup도 인증이 필요
    "/users",
  ],

  // 인증 체크를 하지 않는 페이지
  noAuthCheck: ["/terms", "/privacy", "/join/verify-email"],
};

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
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
          const result = await checkUserExists(dispatch);

          if (result === true) {
            dispatch(setRegistrationComplete());
            setIsUserRegistered(true);

            // Firestore에 등록된 사용자가 /signup에 접근하려고 할 때
            if (pathname === "/signup") {
              console.log("Registered user blocked from signup");
              router.push("/");
              return;
            }

            // Firestore에 등록된 사용자가 /join에 접근하려고 할 때
            if (authRoutes.registeredBlocked.includes(pathname)) {
              console.log("Registered user blocked from:", pathname);
              router.push("/");
              return;
            }
          } else {
            dispatch(resetRegistrationComplete());
            setIsUserRegistered(false);

            // Firestore에 미등록된 사용자는 /signup으로 리다이렉트
            // 단, 이미 /signup에 있거나 예외 경로에 있는 경우는 제외
            if (
              !isRegistering &&
              isEmailVerified &&
              pathname !== "/signup" &&
              !isExceptPath
            ) {
              console.log("Redirect to signup");
              router.push("/signup");
              return;
            }
          }
        } catch (error) {
          console.error("Auth check error:", error);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
        setIsUserRegistered(false);

        // 로그인하지 않은 사용자가 접근할 수 없는 페이지 체크
        if (
          authRoutes.unauthenticatedBlocked.some((route) =>
            pathname.startsWith(route)
          )
        ) {
          console.log("Unauthenticated user blocked from:", pathname);
          router.push("/");
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
