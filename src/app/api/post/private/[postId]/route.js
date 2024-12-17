// /api/post/private/[postId]/route.js

import { headers } from "next/headers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  try {
    const { postId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 사용자 인증
    const userData = await verifyUser(baseUrl, idToken);
    if (!userData.exists) {
      return new Response(
        JSON.stringify({ error: "인증되지 않은 사용자입니다." }),
        { status: 401 }
      );
    }

    // 게시글 존재 확인
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      return new Response(
        JSON.stringify({ error: "존재하지 않는 게시글입니다." }),
        { status: 404 }
      );
    }

    // 작성자 본인 확인
    const postData = postSnap.data();
    if (postData.authorUid !== userData.uid) {
      return new Response(JSON.stringify({ error: "수정 권한이 없습니다." }), {
        status: 403,
      });
    }

    // isPrivate 값 토글
    await updateDoc(postRef, {
      isPrivate: !postData.isPrivate,
    });

    return new Response(
      JSON.stringify({
        success: true,
        postId,
        isPrivate: !postData.isPrivate,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error toggling post privacy:", error);
    return new Response(
      JSON.stringify({
        error: "게시글 공개 설정 변경 중 오류가 발생했습니다.",
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
