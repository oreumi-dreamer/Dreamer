import { auth, db } from "@/lib/firebaseAdmin";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

export async function PUT(req) {
  try {
    const { email, code, uid } = await req.json();

    // 1. 인증 코드 확인
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

    // 2. 인증 코드 유효성 검사
    if (verificationData.expiresAt.toMillis() < Date.now()) {
      return Response.json(
        { error: "만료된 인증 코드입니다." },
        { status: 400 }
      );
    }

    if (verificationData.attempts >= 5) {
      return Response.json(
        { error: "최대 시도 횟수를 초과했습니다." },
        { status: 400 }
      );
    }

    if (verificationData.code !== code) {
      await verificationDoc.ref.update({
        attempts: verificationData.attempts + 1,
      });
      return Response.json(
        { error: "잘못된 인증 코드입니다." },
        { status: 400 }
      );
    }

    // 3. 이메일 중복 확인
    try {
      const existingUser = await auth.getUserByEmail(email);
      if (existingUser) {
        return Response.json(
          { error: "이미 사용 중인 이메일입니다." },
          { status: 400 }
        );
      }
    } catch (error) {
      if (error.code !== "auth/user-not-found") {
        throw error;
      }
    }

    // 4. Firebase Auth 이메일 업데이트
    await auth.updateUser(uid, {
      email: email,
      emailVerified: true, // 이미 인증을 거쳤으므로 true로 설정
    });

    // 5. 인증 코드 verified 처리
    await verificationDoc.ref.update({
      verified: true,
      verifiedAt: Timestamp.now(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("이메일 업데이트 오류:", error);

    if (error.code === "auth/user-not-found") {
      return Response.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return Response.json(
      { error: "이메일 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
