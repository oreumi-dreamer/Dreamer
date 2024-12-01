import React from "react";
import styles from "./PostModal.module.css";
import Image from "next/image";
import Link from "next/link";

export default function PostModal() {
  return (
    <>
      <div className={styles.dimmed}>
        <dialog className={styles["post-modal"]} open>
          <section>
            <h2 className="sr-only">글 본문 내용 확인</h2>
            <section>
              <h3 className="sr-only">작성자 정보 및 본문 관련 버튼 모음</h3>
              <Image
                src="/images/rabbit.svg"
                width={27.97}
                height={35.3}
                className={styles.profile}
              ></Image>
              <p>
                {"JINI"}
                <Link href="/">@jini</Link>
              </p>
              <span className={styles.time}>2시간전</span>
              <ul className={styles["button-list"]}>
                <li>
                  <button>
                    <Image
                      src="/images/star.svg"
                      alt="좋아요반짝"
                      width={30}
                      height={30}
                    ></Image>
                  </button>
                  <span>{"1200"}명의 관심을 받고 있는 꿈이에요</span>
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
                  <button>
                    <Image
                      src="/images/mark.svg"
                      alt="스크랩하기"
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
            <section>
              <h3 className="sr-only">본문 내용</h3>
              <div>
                <ul>
                  <li>친구</li>
                  <li>가족</li>
                  <li>외계인</li>
                </ul>

                <span>{"혼란스러움,무서움,분노"}</span>

                <span>오늘의 꿈 별점: {"★☆☆☆☆"}</span>
              </div>
              <p>{`나는 오늘 꿈에서 ${(<Link href="/">친구</Link>)}를 만났다. 친구와 놀이터에 가서 놀았다. 놀고 있는데 외계인이 침공했다. 너무 무서웠다. 국가는 외계인 침공에 대항해야 할 것이다. 국가는 무엇을 하는가 우리의 세금은 잔뜩 가져가면서 침공에 대한 방안에는 무엇이 있는가 내일까지 작성해오세요.`}</p>
              <Image width={555} height={330}></Image>
            </section>
          </section>
          <hr className={styles.dash} />
          <section>
            <h2 className="sr-only">댓글 작성 및 확인</h2>
            <button>
              <Image src="/images/close.svg" width={30} height={30}></Image>
            </button>

            <form action="#">
              <label htmlFor="comment" className="sr-only">
                댓글 입력
              </label>
              <input
                id="comment"
                type="textarea"
                maxLength={1000}
                placeholder="댓글입력(최대 1000자)"
              />
              <label>
                <input type="checkbox" />
                꿈해몽
              </label>
              <label>
                <input type="checkbox" />
                비공개
              </label>

              <button type="submit">
                {" "}
                <Image src="/images/send.svg" width={30} height={30}></Image>
              </button>
            </form>
            {/* 컴포넌트 분리 예정 */}
            <article>
              {/* {isPrivate && <Image />} */}
              <Image width={10} height={13}></Image>
              {/* {isOneiromancy && <Image />} */}
              <Image width={17} height={13}></Image>

              <p>
                {
                  "안녕하세요 꿈 과학자 입니다. 저의 소견으로는 당신의 현재 상황에 대한 불안함을 갖고 있던 일이, 곧 좋은 기회를 얻어 좋게 풀려나갈 좋은 징조라고 보여집니다. 이런 경우 외계인은 금전운을 뜻하며, 친구는 영혼의 동반자를 의미할것이라고 예상됩니다. 요즘 말로 소울메이트 같은 존재라는 거죠. 항상 좋은일 가득하시길 바랍니다~^^*"
                }
              </p>
              <ul>
                <li>
                  <button>수정</button>
                </li>
                <li>
                  <button>삭제</button>
                </li>
              </ul>
              <span>
                {"1분 전"}
                {"JIh2"}
                <Link href="/">@jhjh</Link>
              </span>
            </article>
          </section>
        </dialog>
      </div>
    </>
  );
}
