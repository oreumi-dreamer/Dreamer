import { db } from "@/lib/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { Timestamp } from "firebase-admin/firestore";

function validatePassword(password) {
  const minLength = 6;
  const maxLength = 4096;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength =
    password.length >= minLength && password.length <= maxLength;

  return (
    hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isValidLength
  );
}

export async function PUT(req) {
  try {
    const { email, code, newPassword } = await req.json();

    // 비밀번호 유효성 검사
    if (!validatePassword(newPassword)) {
      return Response.json(
        {
          error: "비밀번호는 최소 8자 이상이며, 문자와 숫자를 포함해야 합니다.",
        },
        { status: 400 }
      );
    }

    // 가장 최근의 인증 코드 조회
    const codesSnapshot = await db
      .collection("verification_codes")
      .where("email", "==", email)
      .where("verified", "==", false)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (codesSnapshot.empty) {
      return Response.json(
        { error: "유효하지 않은 인증 코드입니다." },
        { status: 400 }
      );
    }

    const verificationDoc = codesSnapshot.docs[0];
    const verificationData = verificationDoc.data();

    // 만료 확인
    if (verificationData.expiresAt.toMillis() < Date.now()) {
      return Response.json(
        { error: "만료된 인증 코드입니다." },
        { status: 400 }
      );
    }

    // 시도 횟수 확인
    if (verificationData.attempts >= 5) {
      return Response.json(
        { error: "최대 시도 횟수를 초과했습니다." },
        { status: 400 }
      );
    }

    // 코드 확인
    if (verificationData.code !== code) {
      await verificationDoc.ref.update({
        attempts: FieldValue.increment(1),
      });
      return Response.json(
        { error: "잘못된 인증 코드입니다." },
        { status: 400 }
      );
    }

    // Firebase Auth에서 사용자 찾기
    const auth = getAuth();
    const userRecord = await auth.getUserByEmail(email);

    // 비밀번호 변경
    await auth.updateUser(userRecord.uid, {
      password: newPassword,
    });

    // 인증 코드를 verified로 표시
    await verificationDoc.ref.update({
      verified: true,
      verifiedAt: Timestamp.now(),
    });

    return Response.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);

    if (error.code === "auth/invalid-password") {
      return Response.json(
        { error: "유효하지 않은 비밀번호 형식입니다." },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "비밀번호 재설정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
