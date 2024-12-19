import { auth } from "@/lib/firebase";
import { verifyPassword } from "./verifyPassword";

export const updateEmail = async (
  currentPassword,
  newEmail,
  verificationCode
) => {
  try {
    // 1. 비밀번호 확인
    await verifyPassword(currentPassword);

    const user = auth.currentUser;
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    // 2. 이메일 업데이트 API 호출
    const updateRes = await fetch("/api/auth/update-email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: newEmail,
        code: verificationCode,
        uid: user.uid,
      }),
    });

    if (!updateRes.ok) {
      const error = await updateRes.json();
      throw new Error(error.error || "이메일 변경 실패");
    }

    // 3. 새 토큰 발급
    const newIdToken = await user.getIdToken(true);

    // 4. 새 토큰으로 세션 쿠키 업데이트
    const tokenRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: newIdToken }),
    });

    if (!tokenRes.ok) {
      throw new Error("세션 업데이트 실패");
    }

    // 5. 현재 사용자 새로고침 (새 이메일로 업데이트)
    await user.reload();

    return { success: true };
  } catch (error) {
    console.error("이메일 업데이트 오류:", error);

    // 토큰 만료 에러인 경우에도 성공으로 처리
    if (
      error?.code === "auth/requires-recent-login" ||
      error?.code === "auth/user-token-expired"
    ) {
      return { success: true, requiresReauth: true };
    }

    throw error;
  }
};
