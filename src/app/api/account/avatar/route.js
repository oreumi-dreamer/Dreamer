// 프로필 사진 업로드 API
// /api/account/avatar/route.js

import { headers } from "next/headers";
import { auth } from "@/lib/firebaseAdmin";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export const maxDuration = 60; // 타임아웃 설정 (초 단위)

export async function POST(request) {
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    // 10MB
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  try {
    const headersList = headers();
    const authorization = headersList.get("Authorization");
    const idToken = authorization.split("Bearer ")[1];

    // Bearer 토큰에서 ID 토큰 추출
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const result = await request.json();

    const image = result.image;
    const uid = result.uid;

    // base64 디코딩
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // 이미지 압축 및 리사이징
    const compressedImage = await sharp(imageBuffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .jpeg({ quality: 80 })
      .toBuffer();

    // 타임스탬프 생성
    const timestamp = Date.now();

    // Storage 레퍼런스 생성
    const fileName = `profile-images/${uuidv4()}.jpg`;
    const storageRef = ref(storage, fileName);

    // 이미지 업로드
    await uploadBytes(storageRef, compressedImage, {
      contentType: "image/jpeg",
    });

    // 다운로드 URL 가져오기
    const publicUrl = await getDownloadURL(storageRef);

    return NextResponse.json(
      { fileName: fileName.replace("profile-images/", ""), url: publicUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
