// api/comment/read/[postId]/route.js

import { headers } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  try {
    const { postId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization ? authorization.split("Bearer ")[1] : null;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 사용자 인증 확인
    let userData = null;
    if (idToken) {
      try {
        userData = await verifyUser(baseUrl, idToken);
      } catch (error) {
        console.warn("User verification failed:", error);
      }
    }

    // 게시글 존재 여부 확인 및 데이터 가져오기
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDoc(postRef);

    if (!postDoc.exists()) {
      return new Response(
        JSON.stringify({ error: "존재하지 않는 게시글입니다." }),
        { status: 404 }
      );
    }

    const postData = postDoc.data();

    // 삭제된 게시글 체크
    if (postData.isDeleted) {
      return new Response(JSON.stringify({ error: "삭제된 게시글입니다." }), {
        status: 404,
      });
    }

    // 비공개 게시글 접근 권한 체크
    if (
      postData.isPrivate &&
      (!userData || userData.uid !== postData.authorUid)
    ) {
      return new Response(JSON.stringify({ error: "접근 권한이 없습니다." }), {
        status: 403,
      });
    }

    let comments = postData.comments || [];

    // 각 댓글 작성자의 정보를 가져오기 위한 Promise 배열 생성
    const commentPromises = comments
      .filter((comment) => !comment.isDeleted)
      .map(async (comment) => {
        // 사용자 정보 가져오기
        const userRef = doc(db, "users", comment.authorUid);
        const userDoc = await getDoc(userRef);
        const commentUserData = userDoc.exists() ? userDoc.data() : null;

        // 기본 댓글 객체에 isModifiable 추가
        const baseComment = {
          ...comment,
          isModifiable: userData && comment.authorUid === userData.uid,
          authorName: commentUserData?.userName || "알 수 없음", // 사용자 이름 추가
          authorId: commentUserData?.userId || "unknown", // 사용자 ID 추가
        };

        // 자신의 댓글이거나 게시글 작성자인 경우 모든 정보 표시
        if (
          userData &&
          (comment.authorUid === userData.uid ||
            postData.authorUid === userData.uid)
        ) {
          return baseComment;
        }

        // 비공개 댓글인 경우 내용 숨김 처리
        if (
          comment.isPrivate &&
          (!userData || comment.authorUid !== userData.uid)
        ) {
          return {
            ...baseComment,
            content: "비공개 댓글입니다.",
            isHidden: true,
          };
        }

        return baseComment;
      });

    // 모든 Promise 완료 대기
    const processedComments = await Promise.all(commentPromises);

    return new Response(
      JSON.stringify({
        success: true,
        comments: processedComments,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(
      JSON.stringify({
        error: "댓글을 불러오는 중 오류가 발생했습니다.",
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
