import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function WritePost() {
  return (
    <>
      <h2 className="sr-only">새로운 글 작성</h2>
      <Image src="/images/rabbit.svg" width={49} height={49} />
      <p>
        {"JINI"}
        <Link href="/">@jini</Link>
      </p>

      <button>
        <Image src="/images/close.svg" width={40} height={40}></Image>
        <span className="sr-only">닫기</span>
      </button>

      <label id="title">
        Title
        <input type="text" for="title" placeholder="00년 00월 00일 꿈 일기" />
      </label>
      <label id="hidden">
        <input type="checkbox" for="hidden" />
        비공개
      </label>

      <div>
        <button>
          <Image src="/images/plus-circle.svg" width={28} height={28} />
          <span className="sr-only">태그 추가하기</span>
        </button>
      </div>
    </>
  );
}
