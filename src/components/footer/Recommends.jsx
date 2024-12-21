"use client";

import { useState, useEffect } from "react";
import Loading from "../Loading";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import Link from "next/link";
import { Button } from "../Controls";

export default function Recommends({ className, styles }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetchWithAuth("/api/recommends?limit=4");
      const data = await response.json();

      setUsersList(data.users);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handleFollow = async (user) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.userId === user.userId) {
          return {
            ...u,
            isFollowing: !u.isFollowing,
          };
        }
        return u;
      })
    );

    const response = await fetchWithAuth(`/api/account/follow/${user.userId}`);

    if (!response.ok) {
      setUsersList((prev) =>
        prev.map((u) => {
          if (u.userId === user.userId) {
            return {
              ...u,
              isFollowing: !u.isFollowing,
            };
          }
          return u;
        })
      );
    }
  };

  return (
    <ul className={className}>
      {loading ? (
        <Loading type="circle" />
      ) : (
        <>
          {usersList.map((user) => (
            <li key={user.userId + user.userName}>
              <Link
                className={styles["recommend-link"]}
                href={`/users/${user.userId}`}
              >
                <img
                  src={user.profileImageUrl}
                  alt={user.userName + "님의 프로필 사진"}
                />
                <span>{user.userName}</span>
                <span>@{user.userId}</span>
              </Link>
              <Button
                highlight={!user.isFollowing}
                className={styles["recommend-follow"]}
                onClick={() => handleFollow(user)}
              >
                {user.isFollowing ? "팔로잉" : "팔로우"}
              </Button>
            </li>
          ))}
        </>
      )}
    </ul>
  );
}
