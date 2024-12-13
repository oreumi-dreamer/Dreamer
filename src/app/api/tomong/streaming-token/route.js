import { generateToken } from "@/lib/api/tokenManager";
import { verifyUser } from "@/lib/api/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const headersList = headers();
  const authorization = headersList.get("Authorization");
  const idToken = authorization.split("Bearer ")[1];

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const userData = await verifyUser(baseUrl, idToken);
  if (!userData.exists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const streamToken = generateToken(userData.uid);
  return NextResponse.json({ streamToken });
}
