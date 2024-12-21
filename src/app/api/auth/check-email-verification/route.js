// /api/auth/check-email-verification/route.js
import { db } from "@/lib/firebaseAdmin";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

export async function PUT(req) {
  try {
    const { email, code } = await req.json();

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

    // 인증 성공
    await verificationDoc.ref.update({
      verified: true,
      verifiedAt: Timestamp.now(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("인증 코드 확인 오류:", error);
    return Response.json(
      { error: "인증 코드 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// GET 메서드 추가 - 이메일 인증 상태 확인
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json(
        { error: "이메일 정보가 필요합니다." },
        { status: 400 }
      );
    }

    // 해당 이메일의 가장 최근 인증 상태 확인
    const verificationSnapshot = await db
      .collection("verification_codes")
      .where("email", "==", email)
      .where("verified", "==", true)
      .orderBy("verifiedAt", "desc")
      .limit(1)
      .get();

    if (verificationSnapshot.empty) {
      return Response.json({ verified: false });
    }

    const verificationData = verificationSnapshot.docs[0].data();

    // 인증 후 24시간이 지났는지 확인
    const isExpired =
      verificationData.verifiedAt.toMillis() < Date.now() - 24 * 60 * 60 * 1000;

    return Response.json({
      verified: !isExpired,
      email: verificationData.email,
      verifiedAt: verificationData.verifiedAt.toDate(),
    });
  } catch (error) {
    console.error("인증 상태 확인 오류:", error);
    return Response.json(
      { error: "인증 상태 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
