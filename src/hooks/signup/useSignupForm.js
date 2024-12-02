"use client";

export function useSignupForm() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("deviceMode");
  const [isJoined, setIsJoined] = useState(false);

  const preventBlank = useCallback((e, setState) => {
    if (e.target.value.includes(" ")) {
      e.target.value = e.target.value.trim();
    }
    setState(e.target.value);
  }, []);

  return {
    formData: { userId, userName, profileImage, bio, theme, isJoined },
    setters: {
      setUserId,
      setUserName,
      setProfileImage,
      setBio,
      setTheme,
      setIsJoined,
    },
    utils: { preventBlank },
  };
}
