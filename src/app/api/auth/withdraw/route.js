// /api/auth/withdraw/route.js
import { headers } from "next/headers";
import { auth, db } from "@/lib/firebaseAdmin";
import { verifyUser } from "@/lib/api/auth";

export async function DELETE(request) {
  try {
    // 1. 사용자 인증 처리
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    if (!authorization) {
      return Response.json(
        { error: "인증 토큰이 필요합니다." },
        { status: 401 }
      );
    }

    const idToken = authorization.split("Bearer ")[1];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 사용자 인증 확인
    const userData = await verifyUser(baseUrl, idToken);
    if (!userData.exists) {
      return Response.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const uid = userData.uid;

    // 2. Firestore 데이터 삭제
    // 2-1. 사용자의 게시글 조회
    const postsSnapshot = await db
      .collection("posts")
      .where("authorUid", "==", uid)
      .get();

    // 2-2. 배치 작업 설정
    const batch = db.batch();

    // 2-3. 사용자의 게시글 소프트 삭제
    postsSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        isDeleted: true,
        deletedAt: new Date().toISOString(),
      });
    });

    // 2-4. 사용자 문서 삭제
    const userRef = db.collection("users").doc(uid);
    batch.delete(userRef);

    // 2-5. 배치 작업 실행
    await batch.commit();

    // 3. Firebase Authentication에서 사용자 삭제
    await auth.deleteUser(uid);

    return Response.json({ success: true });
  } catch (error) {
    console.error("회원 탈퇴 처리 중 오류:", error);

    // 특정 에러에 따른 응답
    if (error.code === "auth/user-not-found") {
      return Response.json(
        { error: "존재하지 않는 사용자입니다." },
        { status: 404 }
      );
    }

    return Response.json(
      { error: "회원 탈퇴 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
