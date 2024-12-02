export const verifyUser = async (idToken) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/auth/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.json();
};
