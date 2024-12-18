// src/lib/api/avatar.js
import { auth } from "@/lib/firebaseAdmin";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

export const uploadAvatar = async (idToken, image, uid) => {
  try {
    // Firebase Admin으로 토큰 검증
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      throw new Error("Invalid token");
    }

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

    // Storage 레퍼런스 생성
    const fileName = `profile-images/${uuidv4()}.jpg`;
    const storageRef = ref(storage, fileName);

    // 이미지 업로드
    await uploadBytes(storageRef, compressedImage, {
      contentType: "image/jpeg",
    });

    // 다운로드 URL 가져오기
    const publicUrl = await getDownloadURL(storageRef);

    return {
      fileName: fileName.replace("profile-images/", ""),
      url: publicUrl,
    };
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};
