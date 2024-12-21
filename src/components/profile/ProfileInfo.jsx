import { UsersList } from "../Controls";
import { useState } from "react";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function ProfileInfo({
  profile,
  toggleFollow,
  setIsEdit,
  styles,
}) {
  const [isShowUsersModal, setIsShowUsersModal] = useState(false);
  const [usersModalType, setUsersModalType] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  const handleFollowersClick = async () => {
    setIsShowUsersModal(true);
    setUsersModalType("followers");
    const res = await fetchWithAuth(
      `/api/account/followers/${profile.id}?type=followers`
    );
    const data = await res.json();
    setUsers(data.followers);
    setIsUsersLoading(false);
  };

  const handleFollowingClick = async () => {
    setIsShowUsersModal(true);
    setUsersModalType("following");
    const res = await fetchWithAuth(
      `/api/account/followers/${profile.id}?type=following`
    );
    const data = await res.json();
    setUsers(data.following);
    setIsUsersLoading(false);
  };

  const handleModalClose = () => {
    setIsShowUsersModal(false);
    setUsers([]);
    setIsUsersLoading(true);
  };

  return (
    <>
      <article className={styles["profile-wrap"]}>
        <h2 className="sr-only">프로필</h2>
        <div className={styles["profile-image"]}>
          <img
            src={
              profile.profileImageUrl
                ? profile.profileImageUrl
                : "/images/rabbit.svg"
            }
            width={160}
            height={160}
            className={styles["user-profile-img"]}
            alt={profile.name + "님의 프로필 이미지"}
          />
          {profile.isPrivate && (
            <div className={styles["lock-icon"]}>
              <img
                src="/images/lock.svg"
                width={16}
                height={16}
                alt="비공개계정"
              />
            </div>
          )}
        </div>

        <div className={styles["profile-info"]}>
          <div className={styles["profile-name-wrap"]}>
            <p className={styles["profile-name"]}>{profile.name}</p>
            {profile.isMyself ? (
              <button
                onClick={() => setIsEdit(true)}
                className={`${styles["profile-btn"]}`}
              >
                프로필 수정
              </button>
            ) : profile.isFollowing ? (
              <button
                onClick={toggleFollow}
                className={`${styles["profile-btn"]} ${styles.active}`}
              >
                팔로잉
              </button>
            ) : (
              <button
                onClick={toggleFollow}
                className={`${styles["profile-btn"]}`}
              >
                팔로우
              </button>
            )}
            <p className={styles["profile-id"]}>@{profile.id}</p>
          </div>
          <ul className={styles["profile-stat"]}>
            <li>게시물 {profile.length}개</li>
            <li onClick={handleFollowingClick} role="button">
              팔로잉 {profile.followingCount ? profile.followingCount : 0}명
            </li>
            <li onClick={handleFollowersClick} role="button">
              팔로워 {profile.followersCount ? profile.followersCount : 0}명
            </li>
          </ul>
          <p className={styles["profile-bio"]}>{profile.bio}</p>
        </div>
      </article>
      {isShowUsersModal && (
        <UsersList
          isOpen={() => setIsShowUsersModal(true)}
          closeModal={handleModalClose}
          users={users}
          setUsers={setUsers}
          type={usersModalType}
          isLoading={isUsersLoading}
        />
      )}
    </>
  );
}
