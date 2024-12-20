// /api/report/create/route.js

import { headers } from "next/headers";
import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { verifyUser } from "@/lib/api/auth";

export async function POST(request) {
  try {
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    const body = await request.json();

    const postId = body.postId;
    const reason = body.reason;

    if (!postId || !reason) {
      return Response.json(
        { error: "게시글 ID와 신고 사유는 필수입니다." },
        { status: 400 }
      );
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // 신고자 인증 확인
    const userData = await verifyUser(baseUrl, idToken);
    if (!userData.exists) {
      return new Response(
        JSON.stringify({ error: "인증되지 않은 사용자입니다." }),
        { status: 401 }
      );
    }

    // 트랜잭션 실행
    await runTransaction(db, async (transaction) => {
      // 1. 게시글 확인
      const postRef = doc(db, `posts/${postId}`);
      const postDoc = await transaction.get(postRef);

      if (!postDoc.exists()) {
        throw new Error("게시글을 찾을 수 없습니다.");
      }

      const postData = postDoc.data();

      // 2. 작성자 정보 확인
      const authorRef = doc(db, `users/${postData.authorUid}`);
      const authorDoc = await transaction.get(authorRef);

      if (!authorDoc.exists()) {
        throw new Error("작성자 정보를 찾을 수 없습니다.");
      }

      const authorData = authorDoc.data();

      // 3. 신고 문서 확인 또는 생성
      const reportRef = doc(db, `reports/${postId}`);
      const reportDoc = await transaction.get(reportRef);

      if (reportDoc.exists()) {
        // 이미 신고가 있는 경우
        const reportData = reportDoc.data();

        // 동일 사용자의 중복 신고 확인
        const userPreviousReports = reportData.reports.filter(
          (report) => report.reporterUid === userData.uid
        );

        if (userPreviousReports.length > 0) {
          throw new Error("이미 신고한 게시글입니다.");
        }

        // 신고 정보 업데이트
        transaction.update(reportRef, {
          reportCount: reportData.reportCount + 1,
          reports: [
            ...reportData.reports,
            {
              reporterUid: userData.uid,
              reporterId: userData.userId,
              reporterName: userData.userName,
              reason: reason,
              createdAt: new Date().toISOString(),
            },
          ],
          updatedAt: new Date().toISOString(),
        });
      } else {
        // 새로운 신고 생성
        transaction.set(reportRef, {
          postId: postId,
          authorUid: postData.authorUid,
          authorId: authorData.userId,
          authorName: authorData.userName,
          postContent: postData.content,
          postTitle: postData.title,
          reportCount: 1,
          reports: [
            {
              reporterUid: userData.uid,
              reporterId: userData.userId,
              reporterName: userData.userName,
              reason: reason,
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: "pending", // pending, reviewed, resolved
          isDeleted: false,
        });
      }
    });

    return Response.json(
      {
        success: true,
        message: "신고가 접수되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating report:", error);

    const errorMessage = error.message || "신고 접수 중 오류가 발생했습니다.";
    const statusCode =
      error.message === "이미 신고한 게시글입니다."
        ? 400
        : error.message === "게시글을 찾을 수 없습니다."
          ? 404
          : error.message === "작성자 정보를 찾을 수 없습니다."
            ? 404
            : 500;

    return Response.json(
      {
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
