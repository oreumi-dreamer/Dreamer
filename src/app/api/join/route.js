import { headers } from "next/headers";
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, collection, doc } from "firebase/firestore";

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
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  const idToken = authorization.split("Bearer ")[1];

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

    // 사용자가 이미 등록되어 있는지 확인
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const verifyResponse = await fetch(`${baseUrl}/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.exists) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "이미 등록된 사용자입니다.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // setDoc을 사용하여 문서 추가
    const docRef = await setDoc(doc(db, "users", verifyData.uid), {
      userId,
      userName,
      birthDate,
      profileImage: profileImage || null,
      bio: bio || "",
      theme: theme || "default",
      createdAt: new Date(),
      updatedAt: new Date(),
      email: verifyData.email,
      via: verifyData.via,
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
