import React, { useEffect, useRef, useState } from "react";
import styles from "./PostModal.module.css";
import Image from "next/image";
import Link from "next/link";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";

export default function PostModal() {
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [isStarTwinkle, setIsStarTwinkle] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const [isOneiromancy, setOneiromancy] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comment, setComment] = useState(undefined);
  const commentRef = useRef(null);
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    const viewPost = async () => {
      const postId = "sZfIASnHrW87XhoC34Id"; // 임시 적용
      const response = await fetchWithAuth(`/api/post/search/${postId}`);
      const data = await response.json();
      setPostData(data.post);
      setIsModalOpen(true);
    };

    viewPost();
  }, []);

  function handleModalClose() {
    if (comment) {
      const exitAnswer = confirm("댓글을 작성중입니다. 종료하시겠습니까?");
      return exitAnswer ? setIsModalOpen(false) : setIsModalOpen(true);
    }
    setIsModalOpen(false);
    commentRef.current.parentElement.classList.add(styles["text-long"]);
  }

  if (!isModalOpen) {
    return null;
  }

  function handleButtonClick(e) {
    const buttonName = e.currentTarget.className;
    if (buttonName === "star") {
      setIsStarTwinkle((prev) => !prev);
    } else if (buttonName === "scrap") {
      setIsScrap((prev) => !prev);
    }
  }

  function handleCheckboxClick(e) {
    const checkboxName = e.target.parentElement.innerText;
    const isCheckboxChecked = e.target.checked;
    if (checkboxName === "꿈해몽") {
      setOneiromancy(isCheckboxChecked);
    } else if (checkboxName === "비공개") {
      setIsPrivate(isCheckboxChecked);
    }
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
  }

  function handleCommentClick(e) {
    if (e.currentTarget.querySelector("p").textContent.length >= 127) {
      e.currentTarget.classList.toggle(styles["comment-open"]);
    }
  }
  function postCreatedTime() {
    const createDate = new Date(postData.createdAt).getTime();
    const updateDate = new Date(postData.updatedAt).getTime();
    const nowDate = new Date().getTime();

    if (createDate === updateDate) {
      const calHour = (nowDate - createDate) / (1000 * 60 * 60);
      return calHour < 24
        ? `${calHour}시간 전`
        : postData.createdAt.slice(0, -14);
    } else {
      const updateCalHour = (nowDate - updateDate) / (1000 * 60 * 60);
      return updateCalHour < 24
        ? `${updateCalHour}시간 전(수정됨)`
        : `${postData.updatedAt.slice(0, -14)}(수정됨)`;
    }
  }

  // 댓글 api 구현 시 수정 예정
  function CommentArticles() {
    if (postData.commentsCount === 0) {
      return <p className={styles["no-comment"]}>댓글이 없습니다.</p>;
    }

    return postData.comments.map((comment, index) => {
      return (
        <article
          key={index}
          className={styles["comment-article"]}
          onClick={handleCommentClick}
        >
          <ul className={styles["comment-info"]}>
            <li>
              <Link href="/">
                <span>{"JIh2"}</span> @jhjh
              </Link>
            </li>
            <li>
              <time>{"1분 전"}</time>
            </li>

            <li>
              {/* {isPrivate && <Image />} */}
              <Image
                src="/images/lock.svg"
                width={10}
                height={13}
                alt="비공개 댓글"
              />
            </li>
          </ul>

          {/* {isMyComment && <ul ></ul>} */}
          <ul className={styles["edit-delete-button"]}>
            <li>
              <button>수정</button>
            </li>
            <li>
              <button>삭제</button>
            </li>
          </ul>

          {/* {isOneiromancy && <Image />} */}
          <Image
            src="/images/oneiromancy.svg"
            className={styles.oneiromancy}
            width={17}
            height={13}
            alt="꿈해몽 댓글"
          />

          {/* 글자 수 추후 데이터 불러왔을 때 변수 설정 후 수정 */}
          <p ref={commentRef}>
            {
              "안녕하세요 꿈 과학자 입니다. 저의 소견으로는 당신의 현재 상황에 대한 불안함을 갖고 있던 일이, 곧 좋은 기회를 얻어 좋게 풀려나갈 좋은 징조라고 보여집니다. 이런 경우 외계인은 금전운을 뜻하며, 친구는 영혼의 동반자를 의미할것이라고 예상됩니다. 요즘 말로 소울메이트 같은 존재라는 거죠. 항상 좋은일 가득하시길 바랍니다~^^*"
            }
          </p>
        </article>
      );
    });
  }

  return (
    <>
      <div className={styles.dimmed} onClick={handleModalClose}></div>
      <dialog className={styles["post-modal"]}>
        <Image
          className={styles.bookmark}
          src="/images/bookmark.svg"
          alt="책갈피"
          width={54}
          height={131}
        />
        <section className={styles["post-section"]}>
          <h2 className="sr-only">글 본문 내용 확인</h2>
          <section className={styles["post-info-section"]}>
            <h3 className="sr-only">작성자 정보 및 본문 관련 버튼 모음</h3>
            <Link className={styles.profile} href={`/${postData.authorId}`}>
              <Image
                src="/images/rabbit.svg"
                width={49}
                height={49}
                alt="토끼 프로필"
              />
              <p className={styles["profile-info"]}>
                {postData.authorName}
                <span>{`@${postData.authorId}`}</span>
                <time
                  dateTime={postData.createdAt.slice(0, -5)}
                  className={styles["uploaded-time"]}
                >
                  {postCreatedTime()}
                </time>
              </p>
            </Link>
            <ul className={styles["button-list"]}>
              <li>
                <button onClick={handleButtonClick} className="star">
                  <Image
                    src={
                      isStarTwinkle
                        ? "/images/star-fill.svg"
                        : "/images/star.svg"
                    }
                    alt="좋아요반짝"
                    width={30}
                    height={30}
                  />
                </button>
                <span>
                  {postData.sparkCount} 명의 관심을 받고 있는 꿈이에요.
                </span>
              </li>
              <li>
                <button>
                  <Image
                    src="/images/share.svg"
                    alt="공유하기"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li>
                <button onClick={handleButtonClick} className="scrap">
                  <Image
                    src={isScrap ? "/images/mark-fill.svg" : "/images/mark.svg"}
                    alt="스크랩"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
              <li>
                <button>
                  <Image
                    src="/images/more.svg"
                    alt="더보기"
                    width={30}
                    height={30}
                  />
                </button>
              </li>
            </ul>
          </section>
          <section className={styles["post-text"]}>
            <h3 className="sr-only">본문 내용</h3>
            <div className={styles["post-text-header"]}>
              <ul className={styles["post-tag"]}>
                {postData.dreamGenres.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>

              <span className={styles["dream-felt"]}>
                {`${postData.dreamMoods.join(",")}`}
              </span>

              <span className={styles["dream-score"]}>
                오늘의 꿈 별점:{" "}
                {`${"★".repeat(postData.dreamRating)}${"☆".repeat(5 - postData.dreamRating)}`}
              </span>
            </div>

            <strong>{postData.title}</strong>
            <p>{postData.content}</p>

            <Image
              src={postData.imageUrls[0]}
              width={555}
              height={330}
              alt="임시 이미지"
              unoptimized
            />
          </section>
        </section>
        <section>
          <h2 className="sr-only">댓글 작성 및 확인</h2>
          <button className={styles["close-btn"]} onClick={handleModalClose}>
            <Image
              src="/images/close.svg"
              width={30}
              height={30}
              alt="닫기 버튼"
            />
          </button>

          <form
            action="#"
            className={styles["comment-form"]}
            onSubmit={handleCommentSubmit}
          >
            <label htmlFor="comment" className="sr-only">
              댓글 입력
            </label>
            <textarea
              className={styles["comment-input"]}
              id="comment"
              maxLength={1000}
              rows={4}
              cols={103}
              placeholder="댓글입력(최대 1000자)"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <ul className={styles["comment-setting"]}>
              <li>
                <input
                  type="checkbox"
                  id="oneiromancy"
                  className={styles["checkbox-hide"]}
                  onChange={handleCheckboxClick}
                />
                <label htmlFor="oneiromancy" className={styles["checkbox"]}>
                  꿈해몽
                </label>
              </li>

              <li>
                <input
                  type="checkbox"
                  id="private"
                  className={styles["checkbox-hide"]}
                  onChange={handleCheckboxClick}
                />
                <label htmlFor="private" className={styles["checkbox"]}>
                  비공개
                </label>
              </li>

              <li>
                <button type="submit">
                  <Image
                    src="/images/send.svg"
                    width={30}
                    height={30}
                    alt="댓글 입력 버튼"
                  />
                </button>
              </li>
            </ul>
          </form>

          <section className={styles["comment-articles-section"]}>
            <h3 className="sr-only">댓글 모음 확인</h3>
            <CommentArticles />
          </section>
        </section>
      </dialog>
    </>
  );
}
