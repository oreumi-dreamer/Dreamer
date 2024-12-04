"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const result = await checkUserExists(dispatch);

          if (result === true) {
            dispatch(setRegistrationComplete());
          } else {
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
  }, [dispatch, router]);

  if (!isAuthChecked) {
    return <Loading />;
  }

  return children;
}
