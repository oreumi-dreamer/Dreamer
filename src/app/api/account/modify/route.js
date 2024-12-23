// /api/account/modify/route.js

import { headers } from "next/headers";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export async function PUT(request) {
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  const idToken = authorization.split("Bearer ")[1];

  try {
    // 사용자 인증 확인
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      method: "GET",
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.exists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "인증되지 않은 사용자입니다.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json();
    const { userId, userName, year, month, day, profileImage, bio, isPrivate } =
      body;

    // 필수 데이터 확인
    if (!userId || !userName) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "필수 정보가 누락되었습니다.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 생년월일 처리
    const birthDate =
      year && month && day
        ? new Date(year, month - 1, day)
        : currentUserData.birthDate;

    // 만 14세 이상인지 확인
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 14) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "만 14세 이상부터 가입 가능합니다.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 현재 사용자 정보 가져오기
    const userRef = doc(db, "users", verifyData.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "사용자를 찾을 수 없습니다.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const currentUserData = userDoc.data();

    // userId가 변경되었고, 다른 사용자가 이미 사용 중인지 확인
    if (userId !== currentUserData.userId) {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "이미 사용 중인 아이디입니다.",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 프로필 이미지 처리
    let profileImageUrl = currentUserData.profileImageUrl;
    let profileImageFileName = currentUserData.profileImageFileName;

    if (profileImage) {
      // 기존 이미지가 있다면 삭제
      if (currentUserData.profileImageFileName) {
        await fetch(
          `${baseUrl}/api/account/avatar/${currentUserData.profileImageFileName}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
      }

      // 새 이미지 업로드
      const uploadResponse = await fetch(`${baseUrl}/api/account/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          image: profileImage,
          uid: verifyData.uid,
        }),
      });

      const uploadData = await uploadResponse.json();
      profileImageFileName = uploadData.fileName;
      profileImageUrl = uploadData.url;
    }

    // 사용자 정보 업데이트
    const updateData = {
      userId,
      userName,
      birthDate,
      profileImageFileName,
      profileImageUrl,
      bio: bio ?? currentUserData.bio,
      isPrivate: isPrivate ?? currentUserData.isPrivate ?? false,
      updatedAt: new Date(),
    };

    await updateDoc(userRef, updateData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "프로필이 성공적으로 수정되었습니다.",
        data: updateData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating profile:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "프로필 수정 중 오류가 발생했습니다.",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
