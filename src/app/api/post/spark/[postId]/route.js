import { headers } from "next/headers";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  try {
    const { postId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 사용자 인증 확인
    const userData = await verifyUser(baseUrl, idToken);
    if (!userData.exists) {
      return new Response(
        JSON.stringify({ error: "인증되지 않은 사용자입니다." }),
        { status: 401 }
      );
    }

    // 게시글 존재 여부 확인
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return new Response(
        JSON.stringify({ error: "존재하지 않는 게시글입니다." }),
        { status: 404 }
      );
    }

    const postData = postDoc.data();

    // 현재 사용자가 이미 반짝을 눌렀는지 확인
    const spark = postData.spark || [];
    const hasSparked = spark.includes(userData.uid);

    // 반짝 토글 및 카운트 업데이트
    if (hasSparked) {
      // 반짝 제거
      await updateDoc(postRef, {
        spark: arrayRemove(userData.uid),
        sparkCount: postData.sparkCount - 1,
      });
    } else {
      // 반짝 추가
      await updateDoc(postRef, {
        spark: arrayUnion(userData.uid),
        sparkCount: postData.sparkCount + 1,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        hasSparked: !hasSparked,
        sparkCount: hasSparked
          ? postData.sparkCount - 1
          : postData.sparkCount + 1,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error toggling spark:", error);
    return new Response(
      JSON.stringify({
        error: "반짝을 토글하는 중 오류가 발생했습니다.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
