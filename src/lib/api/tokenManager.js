// /lib/tokenManager.js
import crypto from "crypto";

const SECRET_KEY = process.env.STREAM_TOKEN_SECRET || "your-secret-key";
const TOKEN_WINDOW = 5 * 60 * 1000; // 5분

export function generateToken(userId) {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = `${userId}-${timestamp}`;

  // HMAC으로 서명 생성
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  const signature = hmac.digest("hex");

  // payload를 base64로 인코딩
  const payload = Buffer.from(data).toString("base64");

  return `${payload}.${signature}`;
}

export function verifyToken(token) {
  try {
    const [payload, signature] = token.split(".");

    // payload 디코딩
    const data = Buffer.from(payload, "base64").toString();
    const [userId, timestamp] = data.split("-");

    // 서명 검증
    const hmac = crypto.createHmac("sha256", SECRET_KEY);
    hmac.update(data);
    const expectedSignature = hmac.digest("hex");

    if (signature !== expectedSignature) {
      return null;
    }

    // 시간 검증 (5분)
    const tokenTime = parseInt(timestamp, 10) * 1000;
    const now = Date.now();
    if (now - tokenTime > TOKEN_WINDOW) {
      return null;
    }

    return { userId, timestamp: tokenTime };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
