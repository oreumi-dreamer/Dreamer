// api/comment/delete/[postId]/route.js

import { headers } from "next/headers";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function DELETE(request, { params }) {
  try {
    const { postId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    // body에서 commentId 추출
    const bodyText = await request.json();
    const body = typeof bodyText === "string" ? JSON.parse(bodyText) : bodyText;
    const commentId = body.commentId;

    // commentId 유효성 검사
    if (!commentId) {
      return new Response(JSON.stringify({ error: "댓글 ID가 필요합니다." }), {
        status: 400,
      });
    }

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
    const comments = postData.comments || [];

    // 댓글 찾기
    const commentIndex = comments.findIndex(
      (comment) => comment.commentId === commentId
    );

    if (commentIndex === -1) {
      return new Response(
        JSON.stringify({ error: "존재하지 않는 댓글입니다." }),
        { status: 404 }
      );
    }

    // 댓글 작성자 확인 (댓글 작성자 본인이 아니거나 게시글 작성자가 아닌경우 삭제 불가능)
    if (
      comments[commentIndex].authorUid !== userData.uid &&
      postData.authorUid !== userData.uid
    ) {
      return new Response(
        JSON.stringify({ error: "댓글을 삭제할 권한이 없습니다." }),
        { status: 403 }
      );
    }

    // 댓글의 isDeleted 필드를 true로 설정
    const updatedComments = [...comments];
    updatedComments[commentIndex] = {
      ...updatedComments[commentIndex],
      isDeleted: true,
    };

    // Firestore 문서 업데이트
    await updateDoc(postRef, {
      comments: updatedComments,
      commentsCount: postData.commentsCount - 1,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "댓글이 성공적으로 삭제되었습니다.",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response(
      JSON.stringify({
        error: "댓글 삭제 중 오류가 발생했습니다.",
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
