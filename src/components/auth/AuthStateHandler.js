"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "@/lib/firebase";
import { loginSuccess, logout } from "@/store/authSlice";
import { checkUserExists } from "@/utils/auth/checkUser";
import Loading from "@/components/Loading";

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const exists = await checkUserExists(idToken, dispatch);

          // exists가 undefined나 false가 아닌 경우에만 isRegistrationComplete 업데이트
          if (exists !== undefined) {
            dispatch(
              loginSuccess({
                isRegistrationComplete: exists,
              })
            );
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
