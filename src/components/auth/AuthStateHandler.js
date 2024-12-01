"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "@/lib/firebase";
import { loginSuccess, logout } from "@/store/authSlice";

import Loading from "@/components/Loading";

export default function AuthStateHandler({ children }) {
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const res = await fetch("/api/auth/verify", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          });

          if (!res.ok) throw new Error("Verification failed");

          const data = await res.json();

          dispatch(
            loginSuccess({
              user: {
                uid: data.uid,
                email: data.email,
                userName: data.userName,
              },
              token: idToken,
              isRegistrationComplete: data.exists,
            })
          );
        } catch (error) {
          console.error("Verification error:", error);
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
