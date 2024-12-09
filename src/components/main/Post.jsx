import Image from "next/image";

export default function Post({ styles, post }) {
  return (
    <article className={styles["main-post-wrap"]}>
      <section className={styles["post-user-info"]}>
        <img
          src={post.profileImageUrl}
          alt={`${post.authorName}님의 프로필 사진`}
          width={49}
          height={49}
        />
        <div className={styles["user-name"]}>{post.authorName}</div>
        <div className={styles["user-id"]}>@{post.authorId}</div>
        <time className={styles["posting-time"]}>2시간 전</time>
        <Image
          src="/images/more.svg"
          alt="더보기"
          width={40}
          height={40}
          className={styles["more-btn"]}
        />
      </section>
      <section className={styles["post-content"]}>
        <p className={styles["post-text"]}>{post.content}</p>
        {post.imageUrls && (
          <div className={styles["post-img-wrap"]}>
            {post.imageUrls.map((url, index) => (
              <img
                key={index}
                className={styles["post-img"]}
                src={url}
                alt="게시글 이미지"
              />
            ))}
          </div>
        )}
      </section>
      <section className={styles["post-btn-content"]}>
        <button>
          <Image src="/images/star.svg" alt="반짝" width={40} height={40} />
        </button>
        <button className={styles["btn-label"]}>99+ 반짝</button>
        <button>
          <Image src="/images/message.svg" alt="댓글" width={40} height={40} />
        </button>
        <button className={styles["btn-label"]}>99+ 댓글</button>
        <button>
          <Image
            src="/images/share.svg"
            alt="공유하기"
            width={40}
            height={40}
          />
        </button>
        <button className={styles["mark-btn"]}>
          <Image src="/images/mark.svg" alt="스크랩" width={40} height={40} />
        </button>
      </section>
    </article>
  );
}
