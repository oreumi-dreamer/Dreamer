// tokenUtils.js

"use client";
import { auth } from "@/lib/firebase";

// export const 대신 export function 사용
export async function fetchWithAuth(url, options = {}) {
  const idToken = auth.currentUser
    ? await auth.currentUser.getIdToken(true)
    : undefined;

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${idToken}`,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] =
      options.headers?.["Content-Type"] || "application/json";
  }

  return fetch(url, {
    ...options,
    headers: headers,
    credentials: "include",
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
  });
}
