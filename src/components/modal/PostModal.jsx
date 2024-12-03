import React, { useState } from "react";
import styles from "./PostModal.module.css";
import Image from "next/image";
import Link from "next/link";

export default function PostModal() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isStarTwinkle, setIsStarTwinkle] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const [isOneiromancy, setOneiromancy] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comment, setComment] = useState(null);

  function handleModalClose() {
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

  function handleChangeCommnet(e) {
    setComment(e.target.value);
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
        ></Image>

        <section>
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
                {"JINI"}
                <span href="/">@jini</span>
                <time className={styles["uploaded-time"]}>2시간전</time>
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
                <span>{"1200"}명의 관심을 받고 있는 꿈이에요.</span>
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
                <li>친구</li>
                <li>가족</li>
                <li>외계인</li>
              </ul>

              <span className={styles["dream-felt"]}>
                {"혼란스러움,무서움,분노"}
              </span>

              <span className={styles["dream-score"]}>
                오늘의 꿈 별점: {"★☆☆☆☆"}
              </span>
            </div>
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
            <Image width={555} height={330} alt="임시 이미지"></Image>
          </section>
        </section>
        <hr className={styles.dash} />
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

          <form action="#" className={styles["comment-form"]}>
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
              onChange={handleChangeCommnet}
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
            <article className={styles["comment-article"]}>
              {/* {isPrivate && <Image />} */}
              <Image
                src="/images/lock.svg"
                className={styles.lock}
                width={10}
                height={13}
                alt="비공개 댓글"
              ></Image>
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
              {/* {isMyComment && <ul ></ul>} */}
              <ul className={styles["edit-delete-button"]}>
                <li>
                  <button>수정</button>
                </li>
                <li>
                  <button>삭제</button>
                </li>
              </ul>

              <ul className={styles["comment-info"]}>
                <li>
                  <time>{"1분 전"}</time>
                </li>
                <li>
                  <Link href="/">
                    <span>{"JIh2"}</span>@jhjh
                  </Link>
                </li>
              </ul>
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
