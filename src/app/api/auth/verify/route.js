// 사용자가 존재 여부와 존재 시 사용자 정보를 반환하는 API
// /api/auth/verify/route.js

export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { auth, db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headersList = headers();
    const authorization = headersList.get("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ exists: false }, { status: 401 });
    }

    // Bearer 토큰에서 ID 토큰 추출
    const idToken = authorization.split("Bearer ")[1];

    // Firebase Admin을 사용하여 토큰 검증 및 uid 획득
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const via = decodedToken.firebase.sign_in_provider;

    // Firestore에서 사용자 존재 여부 확인
    const userDoc = await db.collection("users").doc(uid).get();

    return NextResponse.json({
      exists: userDoc.exists,
      userId: userDoc.data()?.userId,
      userName: userDoc.data()?.userName,
      profileImageUrl: userDoc.data()?.profileImageUrl,
      email: email,
      via: via,
      uid: uid,
      theme: userDoc.data()?.theme,
      followingCount: userDoc.data()?.following.length || 0,
      followersCount: userDoc.data()?.followers.length || 0,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
