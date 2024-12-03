import { verifyUser } from "@/lib/api/auth";
import { loginSuccess } from "@/store/authSlice";

export const checkUserExists = async (idToken, dispatch) => {
  if (!idToken) {
    return { result: "no token" };
  }

  try {
    const result = await verifyUser(idToken);

    if (result.status === 401) {
      return;
    }

    const user = {
      uid: result.uid,
      email: result.email,
      userId: result.userId,
      userName: result.userName,
    };

    dispatch(loginSuccess({ user, token: idToken }));

    return result.exists;
  } catch (error) {
    console.error("User verification error:", error);
    return false;
  }
};
