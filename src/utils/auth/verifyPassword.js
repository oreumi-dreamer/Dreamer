import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

export const verifyPassword = async (password) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("로그인된 사용자가 없습니다.");
    }

    // 현재 사용자의 이메일과 입력받은 비밀번호로 credential 생성
    const credential = EmailAuthProvider.credential(user.email, password);

    // 재인증 시도
    await reauthenticateWithCredential(user, credential);

    return true;
  } catch (error) {
    console.error("Password verification error:", error);

    // Firebase 에러 코드에 따른 적절한 에러 메시지 반환
    if (error.code === "auth/wrong-password") {
      throw new Error("비밀번호가 일치하지 않습니다.");
    } else if (error.code === "auth/too-many-requests") {
      throw new Error(
        "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요."
      );
    } else {
      throw new Error("비밀번호 확인 중 오류가 발생했습니다.");
    }
  }
};
