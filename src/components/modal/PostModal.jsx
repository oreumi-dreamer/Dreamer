import React, { useState } from "react";
import styles from "./PostModal.module.css";
import Image from "next/image";
import Link from "next/link";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function PostModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isStarTwinkle, setIsStarTwinkle] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const [isOneiromancy, setOneiromancy] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comment, setComment] = useState(undefined);

  // 임시 적용
  const user = null;

  const handleViewPost = async () => {
    const postId = 1;

    const posts = await fetch(`/api/post/search/${[postId]}`);
    // const data = await posts.json();
    // console.log(posts);
    // fetchwithauth;
  };

  function handleModalClose() {
    if (comment) {
      const exitAnswer = confirm("댓글을 작성중입니다. 종료하시겠습니까?");
      return exitAnswer ? setIsModalOpen(false) : setIsModalOpen(true);
    }
    setIsModalOpen(false);
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

  function handleChangeComment(e) {
    setComment(e.target.value);
  }

  function handleCommentSubmit(e) {
    e.preventDefault();
  }

  function handleCommentClick(e) {
    const articleComment = e.currentTarget.children[2].textContent;

    e.currentTarget.classList.add(styles["comment-open"]);
    console.log(e.currentTarget.classList[1].includes("open"));
  }

  return (
    <>
      <div className={styles.dimmed} onClick={handleViewPost}></div>
      <dialog className={styles["post-modal"]}>
        <Image
          className={styles.bookmark}
          src="/images/bookmark.svg"
          alt="책갈피"
          width={54}
          height={131}
        ></Image>
        <section className={styles["post-section"]}>
          <h2 className="sr-only">글 본문 내용 확인</h2>
          <section className={styles["post-info-section"]}>
            <h3 className="sr-only">작성자 정보 및 본문 관련 버튼 모음</h3>
            <Link className={styles.profile} href="/">
              <Image
                src="/images/rabbit.svg"
                width={49}
                height={49}
                alt="토끼 프로필"
              ></Image>
              <p className={styles["profile-info"]}>
                {user ? posts.authorName : "JINI"}
                <span href="/">{user ? `@${posts.authorId}` : "@jini"}</span>
                <time className={styles["uploaded-time"]}>
                  {user ? posts.createdAt : "2시간전"}
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
                  ></Image>
                </button>
                <span>
                  {user ? posts.sparkCount : "1200"}명의 관심을 받고 있는
                  꿈이에요.
                </span>
              </li>
              <li>
                <button>
                  <Image
                    src="/images/share.svg"
                    alt="공유하기"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </li>
              <li>
                <button onClick={handleButtonClick} className="scrap">
                  {/* 추후 mark-fill 파일 추가 */}
                  <Image
                    src={isScrap ? "/images/mark-fill.svg" : "/images/mark.svg"}
                    alt="스크랩"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </li>
              <li>
                <button>
                  <Image
                    src="/images/more.svg"
                    alt="더보기"
                    width={30}
                    height={30}
                  ></Image>
                </button>
              </li>
            </ul>
          </section>
          <section className={styles["post-text"]}>
            <h3 className="sr-only">본문 내용</h3>
            <div className={styles["post-text-header"]}>
              <ul className={styles["post-tag"]}>
                {user ? (
                  posts.dramGenres.map((tag) => <li>{tag}</li>)
                ) : (
                  <>
                    <li>친구</li>
                    <li>가족</li>
                    <li>외계인</li>
                  </>
                )}
              </ul>

              <span className={styles["dream-felt"]}>
                {user
                  ? `${posts.dreamMoods.join(",")}`
                  : "혼란스러움,무서움,분노"}
              </span>

              <span className={styles["dream-score"]}>
                오늘의 꿈 별점:{" "}
                {user
                  ? `${"★".repeat(posts.dreamRating)}${"☆".repeat(5 - posts.dreamRating)}`
                  : "★☆☆☆☆"}
              </span>
            </div>

            {user ? (
              posts.content
            ) : (
              <p>
                나는 오늘 꿈에서<Link href="/">친구</Link>를 만났다.
                <br />
                친구와놀이터에 가서 놀았다.
                <br />
                놀고 있는데 외계인이 침공했다. 너무 무서웠다.
                <br />
                국가는 외계인 침공에 대항해야 할 것이다.
                <br />
                국가는 무엇을 하는가 우리의 세금은 잔뜩 가져가면서
                <br />
                침공에 대한 방안에는 무엇이 있는가 내일까지 작성해오세요.
                <br />
                <br />
                그림
                <br />
                <br />
                <br />
                <br />
                이런식으로
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
              </p>
            )}

            <Image width={555} height={330} alt="임시 이미지"></Image>
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
            ></Image>
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
              onChange={handleChangeComment}
              value={comment}
            />
            <ul className={styles["comment-setting"]}>
              <li>
                <label>
                  <input type="checkbox" onChange={handleCheckboxClick} />
                  꿈해몽
                </label>
              </li>

              <li>
                <label>
                  <input type="checkbox" onChange={handleCheckboxClick} />
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
                  ></Image>
                </button>
              </li>
            </ul>
          </form>

          <section className={styles["comment-articles-section"]}>
            <h3 className="sr-only">댓글 모음 확인</h3>

            {/* 컴포넌트 분리 예정 */}
            <article
              className={styles["comment-article"]}
              onClick={handleCommentClick}
            >
              <ul className={styles["comment-info"]}>
                <li>
                  <Link href="/">
                    <span>{"JIh2"}</span>@jhjh
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
                  ></Image>
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
              ></Image>

              {/* 글자 수 추후 데이터 불러왔을 때 변수 설정 후 수정 */}
              <p>
                {
                  "안녕하세요 꿈 과학자 입니다. 저의 소견으로는 당신의 현재 상황에 대한 불안함을 갖고 있던 일이, 곧 좋은 기회를 얻어 좋게 풀려나갈 좋은 징조라고 보여집니다. 이런 경우 외계인은 금전운을 뜻하며, 친구는 영혼의 동반자를 의미할것이라고 예상됩니다. 요즘 말로 소울메이트 같은 존재라는 거죠. 항상 좋은일 가득하시길 바랍니다~^^*"
                }
              </p>
            </article>
            {/* 컴포넌트 분리 예정 */}
            <article
              className={styles["comment-article"]}
              onClick={handleCommentClick}
            >
              <ul className={styles["comment-info"]}>
                <li>
                  <Link href="/">
                    <span>{"JIh2"}</span>@jhjh
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
                  ></Image>
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
              ></Image>

              {/* 글자 수 추후 데이터 불러왔을 때 변수 설정 후 수정 */}
              <p>
                {
                  "안녕하세요. 외계인 침공방안에는 1번 지구 진입 시 불에 타죽게끔 뜨거운 띠를 설치한다. 2번 외계인에게 말을 걸다가 중간에 멈추게 되면"
                }
              </p>
            </article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
            <article className={styles["comment-article"]}></article>
          </section>
        </section>
      </dialog>
    </>
  );
}
