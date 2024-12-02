export const verifyUser = async (idToken) => {
  const res = await fetch("/api/auth/verify", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return res.json();
};
