import { headers } from "next/headers";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";
import { v4 as uuidv4 } from "uuid";

export async function POST(request, { params }) {
  try {
    const { postId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    const formData = await request.formData();
    const content = formData.get("content");
    const isPrivate = formData.get("isPrivate");
    const isDreamInterpretation = formData.get("isDreamInterpretation");

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

    // 내용 유효성 검사
    if (!content || content.trim().length === 0) {
      return new Response(JSON.stringify({ error: "내용을 입력해주세요." }), {
        status: 400,
      });
    }

    // isPrivate와 isDreamInterpretation 문자열을 불리언으로 변환
    const isPrivateBool = isPrivate === "true";
    const isDreamInterpretationBool = isDreamInterpretation === "true";

    // 현재 시간 생성
    const now = Timestamp.fromDate(new Date());

    // 새 댓글 데이터 생성
    const commentData = {
      commentId: uuidv4(),
      authorUid: userData.uid,
      authorId: userData.userId,
      authorName: userData.userName,
      content,
      isPrivate: isPrivateBool,
      isDreamInterpretation: isDreamInterpretationBool,
      createdAt: now,
      isDeleted: false,
    };

    // 게시글의 comments 배열에 새 댓글 추가
    await updateDoc(postRef, {
      comments: arrayUnion(commentData),
    });

    // 게시글의 commentsCount 필드 증가
    await updateDoc(postRef, {
      commentsCount: postDoc.data().commentsCount + 1,
    });

    return new Response(
      JSON.stringify({
        success: true,
        commentId: commentData.commentId,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response(
      JSON.stringify({
        error: "댓글 작성 중 오류가 발생했습니다.",
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
