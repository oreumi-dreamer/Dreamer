// src/lib/api/auth.js

export const verifyUser = async (idToken) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}/api/auth/verify`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Verify user error:", error);
    throw error;
  }
};
