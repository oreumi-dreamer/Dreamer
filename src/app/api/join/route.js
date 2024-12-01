import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(request) {
  try {
    // request.json()으로 body 데이터를 파싱
    const body = await request.json();

    const { userId, userName, year, month, day, profileImage, bio, theme } =
      body;

    // 필수 데이터 확인
    if (!userId || !userName || !year || !month || !day) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "필수 정보가 누락되었습니다.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 생년월일을 Date 객체로 변환
    const birthDate = new Date(year, month - 1, day);

    // addDoc을 사용하여 자동 ID 생성과 함께 문서 추가
    const docRef = await addDoc(collection(db, "users"), {
      userId,
      userName,
      birthDate,
      profileImage: profileImage || null,
      bio: bio || "",
      theme: theme || "default",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "사용자가 성공적으로 등록되었습니다.",
        userId: userId,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error adding user:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "사용자 등록 중 오류가 발생했습니다.",
        error: error.message,
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
