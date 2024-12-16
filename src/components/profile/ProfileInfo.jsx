export default function ProfileInfo({
  profile,
  toggleFollow,
  setIsEdit,
  styles,
}) {
  return (
    <article className={styles["profile-wrap"]}>
      <h2 className="sr-only">프로필</h2>
      <img
        src={
          profile.profileImageUrl
            ? profile.profileImageUrl
            : "/images/rabbit.svg"
        }
        className={styles["profile-image"]}
        width={160}
        height={160}
        alt={profile.name + "님의 프로필 이미지"}
      />
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
          <li>
            팔로우 {profile.followingCount ? profile.followingCount : 0}명
          </li>
          <li>
            팔로워 {profile.followersCount ? profile.followersCount : 0}명
          </li>
        </ul>
        <div className={styles["profile-bio"]}>{profile.bio}</div>
      </div>
    </article>
  );
}
