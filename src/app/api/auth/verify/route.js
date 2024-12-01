// Firestore에서 사용자를 확인하는 API

import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("auth_token");

    if (!token) {
      return NextResponse.json({ exists: false }, { status: 401 });
    }

    // Firebase Admin을 사용하여 토큰 검증 및 uid 획득
    const decodedToken = await auth.verifyIdToken(token.value);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const via = decodedToken.firebase.sign_in_provider;

    // Firestore에서 사용자 존재 여부 확인
    const userDoc = await db.collection("users").doc(uid).get();

    return NextResponse.json({
      exists: userDoc.exists,
      email: email,
      via: via,
      uid: uid,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
