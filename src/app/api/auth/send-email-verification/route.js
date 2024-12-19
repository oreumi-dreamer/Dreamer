// /api/auth/send-email-verification/route.js
import { db } from "@/lib/firebaseAdmin"; // Admin SDK
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendVerificationEmail(email, code) {
  try {
    const info = await transporter.sendMail({
      from: `"Dreamer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "이메일 인증 코드입니다",
      text: `인증 코드: ${code}`,
      html: `
        <div style="padding: 20px; background: #f5f5f5;">
          <h2>이메일 인증 코드</h2>
          <p>아래 인증 코드를 입력해주세요:</p>
          <div style="padding: 10px; background: #fff; font-size: 24px; font-weight: bold;">
            ${code}
          </div>
          <p>이 코드는 10분 동안 유효합니다.</p>
        </div>
      `,
    });

    console.log("이메일 발송 완료:", info.messageId);
    return true;
  } catch (error) {
    console.error("이메일 발송 실패:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    // 이메일 형식 검증
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { error: "유효하지 않은 이메일입니다." },
        { status: 400 }
      );
    }

    // 이전 요청 확인 (1분 이내 재요청 방지)
    const prevRequestSnapshot = await db
      .collection("verification_codes")
      .where("email", "==", email)
      .where("createdAt", ">=", Timestamp.fromMillis(Date.now() - 60000))
      .get();

    if (!prevRequestSnapshot.empty) {
      return Response.json(
        { error: "잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    // 6자리 숫자 인증 코드 생성 (수정)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Firestore에 저장
    await db.collection("verification_codes").add({
      email,
      code,
      createdAt: Timestamp.now(),
      attempts: 0,
      verified: false,
      expiresAt: Timestamp.fromMillis(Date.now() + 600000), // 10분 후 만료
    });

    // 이메일 발송
    await sendVerificationEmail(email, code);

    return Response.json({ success: true });
  } catch (error) {
    console.error("인증 코드 생성 오류:", error);
    return Response.json(
      { error: "인증 코드 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 인증 코드 확인 API 추가
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
        attempts: verificationData.attempts + 1,
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
