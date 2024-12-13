// src/lib/api/auth.js
import { auth, db } from "@/lib/firebaseAdmin";

export const verifyUser = async (baseUrl, idToken) => {
  try {
    // Firebase Admin으로 토큰 검증
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const via = decodedToken.firebase.sign_in_provider;

    // Firestore에서 사용자 정보 직접 조회
    const userDoc = await db.collection("users").doc(uid).get();

    return {
      exists: userDoc.exists,
      userId: userDoc.data()?.userId,
      userName: userDoc.data()?.userName,
      profileImageUrl: userDoc.data()?.profileImageUrl,
      email: email,
      via: via,
      uid: uid,
      theme: userDoc.data()?.theme,
    };
  } catch (error) {
    console.error("Verify user error:", error);
    throw error;
  }
};
