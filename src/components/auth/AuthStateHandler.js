"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "@/lib/firebase";
import { loginSuccess, logout } from "@/store/authSlice";

export default function AuthStateHandler() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        const idToken = await user.getIdToken();
        dispatch(
          loginSuccess({
            user: {
              uid: user.uid,
              email: user.email,
            },
            token: idToken,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
}
