import React from "react";
import styles from "./MainList.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MainList() {
  const [dreamItemList, setDreamItemList] = useState([
    {
      id: "0001",
      author: "",
      title: "",
      content: "",
      uploadedTime: "",
      imageList: [
        {
          id: "image0001",
          src: "/images/image.svg"
        },
        {
          id: "image0002",
          src: "/images/image.svg"
        },
        {
          id: "image0003",
          src: "/images/image.svg"
        },
        {
          id: "image0004",
          src: "/images/image.svg"
        },
        {
          id: "image0005",
          src: "/images/image.svg"
        },
      ],
      commentList: [],
      commentCount: 0,
      favoriteCount: 0,
      userInMention: "",
    },
    {
      id: "0002",
      author: "",
      title: "",
      content: "",
      uploadedTime: "",
      imageList: [
        {
          id: "image0001",
          src: "/images/image.svg"
        },
        {
          id: "image0002",
          src: "/images/image.svg"
        },
        {
          id: "image0003",
          src: "/images/image.svg"
        },
        {
          id: "image0004",
          src: "/images/image.svg"
        },
        {
          id: "image0005",
          src: "/images/image.svg"
        },
      ],
      commentList: [],
      commentCount: 0,
      favoriteCount: 0,
      userInMention: "",
    },
    {
      id: "0003",
      author: "",
      title: "",
      content: "",
      uploadedTime: "",
      imageList: [
        {
          id: "image0001",
          src: "/images/image.svg"
        },
        {
          id: "image0002",
          src: "/images/image.svg"
        },
        {
          id: "image0003",
          src: "/images/image.svg"
        },
        {
          id: "image0004",
          src: "/images/image.svg"
        },
        {
          id: "image0005",
          src: "/images/image.svg"
        },
      ],
      commentList: [],
      commentCount: 0,
      favoriteCount: 0,
      userInMention: "",
    },
    {
      id: "0004",
      author: "",
      title: "",
      content: "",
      uploadedTime: "",
      imageList: [
        {
          id: "image0001",
          src: "/images/image.svg"
        },
        {
          id: "image0002",
          src: "/images/image.svg"
        },
        {
          id: "image0003",
          src: "/images/image.svg"
        },
        {
          id: "image0004",
          src: "/images/image.svg"
        },
        {
          id: "image0005",
          src: "/images/image.svg"
        },
      ],
      commentList: [],
      commentCount: 0,
      favoriteCount: 0,
      userInMention: "",
    },
    {
      id: "0005",
      author: "",
      title: "",
      content: "",
      uploadedTime: "",
      imageList: [
        {
          id: "image0001",
          src: "/images/image.svg"
        },
        {
          id: "image0002",
          src: "/images/image.svg"
        },
        {
          id: "image0003",
          src: "/images/image.svg"
        },
        {
          id: "image0004",
          src: "/images/image.svg"
        },
        {
          id: "image0005",
          src: "/images/image.svg"
        },
      ],
      commentList: [],
      commentCount: 0,
      favoriteCount: 0,
      userInMention: "",
    },
  ]);







  useEffect(() => {
    // fetch("/api/post/search", {
    //     method: "GET",
    //     headers: {
    //     "Content-Type": "application/json",
    //     },
    // }).then((response) => response.json()).then((json) => {
    //     console.log(json);
    // }).catch((error) => console.error(error));
  }, []);
  

  return (
    <>
      {/* <div className={styles.dimmed}></div> */}
      <main className={styles["post-modal"]} open>
        
        {dreamItemList.map((item) => (
            <section  key={item.id}   className={styles["each-item-section"]}   >
              <h2 className="sr-only">글 본문 내용 확인</h2>
              <section className={styles["post-info-section"]}>
                <h3 className="sr-only">작성자 정보 및 본문 관련 버튼 모음</h3>
                <Link className={styles.profile} href="/">
                  <Image src="/images/rabbit.svg" width={49} height={49}></Image>
                  <p className={styles["profile-info"]}>
                    {"JINI"}
                    <span href="/">@jini</span>
                    <time className={styles["uploaded-time"]}>2시간전</time>
                  </p>
                </Link>
                <ul className={styles["button-list"]}>
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
                <div className={styles["post-text-header"]}></div>
                <p   className={styles["post-text-content"]}>
                  나는 오늘 꿈에서<Link href="/">친구</Link>를 만났다.
                  {/* <br /> */}
                  친구와놀이터에 가서 놀았다.
                  {/* <br /> */}
                  놀고 있는데 외계인이 침공했다. 너무 무서웠다.
                  {/* <br /> */}
                  국가는 외계인 침공에 대항해야 할 것이다.
                  {/* <br /> */}
                  국가는 무엇을 하는가 우리의 세금은 잔뜩 가져가면서
                  {/* <br /> */}
                  침공에 대한 방안에는 무엇이 있는가 내일까지 작성해오세요.
                </p>

                <div   className={styles["post-text-wrap-image"]}  >
                  {item.imageList.map((imgItem) => (
                    <Image  src={imgItem.src}    width={100} height={100}></Image>
                  ))}
                </div>

              </section>

              <section   
                className={styles["each-item-bottom"]}  
              >
                <ul className={styles["button-list-bottom"]}>
                  <li>
                    <button>
                      <Image
                        src="/images/star.svg"
                        alt="좋아요반짝"
                        width={30}
                        height={30}
                      ></Image>
                    </button>
                    <span>{"99"}반짝</span>
                  </li>
                  <li>
                    <button>
                      <Image
                        src="/images/comment.svg"
                        alt="공유하기"
                        width={30}
                        height={30}
                      ></Image>
                    </button>
                    <span>{"99"}댓글</span>
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
                </ul>
                <ul    className={styles["button-list-sub"]}>
                  <li>
                  <Image
                    src={"/images/mark.svg"}
                    alt="스크랩"
                    width={30}
                    height={30}
                  ></Image>
                  </li>
                </ul>
              </section>
            </section>
          )
        )}

      </main>
    </>
  );
}
