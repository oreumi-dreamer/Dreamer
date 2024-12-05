import { headers } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function GET(request, { params }) {
  try {
    const { postId } = params;
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    // 사용자 인증 확인
    const userData = await verifyUser(idToken);

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

    // 비공개 댓글 필터링
    comments = comments
      .filter((comment) => !comment.isDeleted) // isDeleted가 true인 댓글 제외
      .map((comment) => {
        // 기본 댓글 객체에 isModifiable 추가
        const baseComment = {
          ...comment,
          isModifiable: comment.authorUid === userData.uid, // 자신의 댓글인 경우 true
        };

        // 자신의 댓글이거나 게시글 작성자인 경우 모든 정보 표시
        if (
          comment.authorUid === userData.uid ||
          postData.authorUid === userData.uid
        ) {
          return baseComment;
        }

        // 비공개 댓글인 경우 내용 숨김 처리
        if (comment.isPrivate) {
          return {
            ...baseComment,
            content: "비공개 댓글입니다.",
            isHidden: true,
          };
        }

        return baseComment;
      });

    return new Response(
      JSON.stringify({
        success: true,
        comments,
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