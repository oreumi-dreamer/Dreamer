// src/utils/auth/checkUser.js

import { fetchWithAuth } from "./tokenUtils";
import { loginSuccess } from "@/store/authSlice";

export const checkUserExists = async (dispatch) => {
  try {
    // fetchWithAuth를 사용하여 verify 엔드포인트 호출
    const result = await fetchWithAuth("/api/auth/verify");
    const userData = await result.json();

    if (userData.exists) {
      dispatch(
        loginSuccess({
          user: {
            exists: true,
            uid: userData.uid,
            email: userData.email,
            userId: userData.userId,
            userName: userData.userName,
            profileImageUrl: userData.profileImageUrl,
            theme: userData.theme,
            followersCount: userData.followersCount,
            followingCount: userData.followingCount,
          },
        })
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error("Check user error:", error);
    return null;
  }
};
