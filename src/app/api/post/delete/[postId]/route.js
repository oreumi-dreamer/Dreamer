// 게시글 ID로 게시글을 삭제하는 API
// /api/post/delete/[postId]/route.js

import { headers } from "next/headers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function DELETE(request, { params }) {
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
      return new Response(JSON.stringify({ error: "삭제 권한이 없습니다." }), {
        status: 403,
      });
    }

    // 저장된 이미지 삭제
    if (postData.imageUrls?.length > 0) {
      for (const url of postData.imageUrls) {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
      }
    }

    // 소프트 삭제 처리 (isDeleted 플래그 사용)
    await updateDoc(postRef, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "게시글이 삭제되었습니다.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(
      JSON.stringify({
        error: "게시글 삭제 중 오류가 발생했습니다.",
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
