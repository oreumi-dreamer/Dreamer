"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, ButtonLink } from "@/components/Controls";
import styles from "./Tomong.module.css";
import markdownStyles from "./Result.module.css";
import { fetchWithAuth } from "@/utils/auth/tokenUtils";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
import { DREAM_MOODS, DREAM_GENRES } from "@/utils/constants";
import { auth } from "@/lib/firebase";
import convertToHtml from "@/utils/markdownToHtml";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import TomongListItem from "@/components/tomong/TomongListItem";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { metadataMaker } from "@/utils/metadata";

export function TomongIntro({ setProcess }) {
  return (
    <>
      <h2 className={styles["title"]}>토몽 AI</h2>
      <div className={styles["tomong-body"]}>
        <p className={styles["headings"]}>
          반가워요! 드리머 여러분의 꿈 해몽가 <strong>토몽</strong>이에요!{" "}
        </p>
        <p className={styles["intro"]}>
          앨런 AI의 도움으로 드리머님이 작성하신 꿈의 해몽을 들려드릴게요!
        </p>
        <Image
          src="/images/tomong-hi-480p.png"
          width={240}
          height={240}
          alt="마법사 토끼 토몽이 손을 들고 인사하고 있다."
        />
        <Button
          highlight={true}
          onClick={() => setProcess(1)}
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          시작하기
        </Button>
      </div>
      <div className={styles["btn-row"]}>
        <Button onClick={() => history.back()}>이전 페이지로</Button>
        <Button onClick={() => setProcess(101)}>해몽된 꿈 보러 가기</Button>
      </div>
    </>
  );
}

export function TomongSelect({ setProcess, setSelectedDream }) {
  const [dreams, setDreams] = useState([]);
  const [selectedDream, setSelectedDreamState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, userName, theme } = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getDreams = async () => {
      const res = await fetchWithAuth(`/api/post/read/${userId}`);

      let data = null;
      if (res.ok) {
        data = await res.json();
        setDreams(data.posts);
      }

      setIsLoading(false);
    };

    getDreams();
  }, []);

  const handleRadioChange = (dream) => {
    setSelectedDreamState(dream);
    setSelectedDream(dream);
  };

  return (
    <>
      <h2 className={styles["title"]}>꿈을 골라주세요!</h2>
      <div className={styles["tomong-body"]}>
        {isLoading ? (
          <Loading type="small" />
        ) : !dreams.length ? (
          <>
            <p>아직 {userName}님이 들려준 꿈이 없어요!</p>
            <ButtonLink highlight={true} href={`/${userId}?write=true`}>
              꿈 작성하러 가기
            </ButtonLink>
          </>
        ) : (
          <ul className={styles["dreams-list"]}>
            {dreams.map((dream) => (
              <TomongListItem
                key={dream.id}
                dream={dream}
                theme={theme}
                selectedDream={selectedDream}
                handleRadioChange={handleRadioChange}
                styles={styles}
              />
            ))}
          </ul>
        )}
      </div>
      <div className={styles["btn-row"]}>
        <Button onClick={() => setProcess(0)}>뒤로</Button>
        {!selectedDream && <Button disabled>해몽하기</Button>}
        {selectedDream && (
          <Button highlight={true} onClick={() => setProcess(2)}>
            해몽하기
          </Button>
        )}
      </div>
    </>
  );
}

export function TomongResult({
  setProcess,
  selectedDream,
  setTomongDream,
  setBefore,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("");
  const [retry, setRetry] = useState(0);
  const eventSourceRef = useRef(null);
  const retryCountRef = useRef(0);
  const isComponentMounted = useRef(true);
  const { userId } = useSelector((state) => state.auth.user);
  const [clickNext, setClickNext] = useState(false);

  const RETRY_LIMIT = 2;

  useEffect(() => {
    // 컴포넌트 마운트 상태 추적
    isComponentMounted.current = true;

    const setupEventSource = async () => {
      // 이미 연결이 있다면 무시
      if (eventSourceRef.current) {
        return;
      }

      try {
        const idToken = auth.currentUser
          ? await auth.currentUser.getIdToken(true)
          : null;
        if (!idToken || !isComponentMounted.current) {
          return;
        }

        const tokenResponse = await fetch("/api/tomong/streaming-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!tokenResponse.ok || !isComponentMounted.current) {
          return;
        }

        const { streamToken } = await tokenResponse.json();

        const params = new URLSearchParams({
          streamToken,
          postId: selectedDream.id,
          title: selectedDream.title || "",
          content: selectedDream.content || "",
          genre: selectedDream.dreamGenres || "",
          mood: selectedDream.dreamMoods || "",
          rating: selectedDream.dreamRating || "",
        });

        // 새로운 EventSource 생성 전에 이전 연결 정리
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        if (!isComponentMounted.current) return;

        eventSourceRef.current = new EventSource(
          `/api/tomong?${params.toString()}`
        );

        eventSourceRef.current.onmessage = (event) => {
          if (!isComponentMounted.current) return;

          try {
            const data = event.data;

            // 'complete' 메시지인 경우
            const completeMatch = data.match(
              /'type':\s*'complete'.*?'content':\s*'(.*?)'\}\}/s
            );
            if (completeMatch) {
              setResult(completeMatch[1]);
              // complete 메시지를 받았으면 연결을 깔끔하게 종료
              eventSourceRef.current?.close();
              return;
            }

            // 'continue' 메시지인 경우
            const continueMatch = data.match(
              /'type':\s*'continue'.*?'content':\s*'(.*?)'\}\}/s
            );
            if (continueMatch) {
              setResult((prev) => prev + continueMatch[1]);
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        };

        eventSourceRef.current.onerror = (error) => {
          // complete 후의 정상적인 연결 종료는 무시
          if (eventSourceRef.current?.readyState === 2) {
            return;
          }

          // 실제 에러인 경우만 처리
          console.error("EventSource error:", error);
          eventSourceRef.current?.close();
          setIsLoading(false);
        };

        eventSourceRef.current.onopen = () => {
          if (!isComponentMounted.current) return;
          setIsLoading(false);
          retryCountRef.current = 0;
        };
      } catch (error) {
        console.error("Error setting up EventSource:", error);
        if (isComponentMounted.current) {
          setIsLoading(false);
        }
      }
    };

    setupEventSource();

    // cleanup 함수
    return () => {
      isComponentMounted.current = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [selectedDream, retry]);

  const handleRetry = () => {
    if (retryCountRef.current >= RETRY_LIMIT) {
      return;
    }
    setRetry((prev) => prev + 1);
    setIsLoading(true);
  };

  const handleNext = async () => {
    // userId를 사용하여 현재 선택된 꿈의 ID로 서버에서 다시 불러오기
    const res = await fetchWithAuth(`/api/post/read/${userId}`);

    if (res.ok) {
      const data = await res.json();
      const foundDream = data.posts.find(
        (dream) => dream.id === selectedDream.id
      );
      if (foundDream) {
        // 불러온 꿈 데이터를 tomongDream state에 설정
        setTomongDream(foundDream);
        // setBefore를 사용하여 이전 process를 저장
        setBefore(2);
        // process를 102로 변경하여 TomongRead 컴포넌트로 전환
        setProcess(102);
      }
    }
  };

  return (
    <>
      <h2 className={styles["title"]}>꿈을 해몽해드릴게요!</h2>
      {isLoading ? (
        <Loading type="small" />
      ) : (
        <>
          <div
            className={markdownStyles["markdown"]}
            dangerouslySetInnerHTML={{ __html: convertToHtml(result) }}
          />
          <Button onClick={handleRetry} disabled={retry === RETRY_LIMIT}>
            해몽 다시 듣기 ({RETRY_LIMIT - retry} / {RETRY_LIMIT})
          </Button>
        </>
      )}
      <div className={styles["btn-row"]}>
        <Button onClick={() => setProcess(1)}>뒤로</Button>
        {isLoading ? (
          <Button disabled>다음</Button>
        ) : (
          <Button highlight={true} onClick={() => handleNext()}>
            다음
          </Button>
        )}
      </div>
    </>
  );
}

export function TomongLists({ setProcess, setTomongDream }) {
  const [dreams, setDreams] = useState([]);
  const [selectedDream, setSelectedDreamState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, userName, theme } = useSelector((state) => state.auth.user);

  useEffect(() => {
    const getDreams = async () => {
      const res = await fetchWithAuth(`/api/post/read/${userId}`);

      let data = null;
      if (res.ok) {
        data = await res.json();
        const filteredDream = data.posts.filter((post) => !!post.tomongs);
        setDreams(filteredDream);
      }

      setIsLoading(false);
    };

    getDreams();
  }, []);

  const handleRadioChange = (dream) => {
    setSelectedDreamState(dream);
    setTomongDream(dream);
  };

  return (
    <>
      <h2 className={styles["title"]}>해몽된 꿈 목록</h2>
      <div className={styles["tomong-body"]}>
        {isLoading ? (
          <Loading type="small" />
        ) : !dreams.length ? (
          <>
            <p>토몽이가 해석해 준 {userName}님의 꿈이 없어요!</p>
            <Button highlight={true} onClick={() => setProcess(1)}>
              해몽하러 가기
            </Button>
          </>
        ) : (
          <ul className={styles["dreams-list"]}>
            {dreams.map((dream) => (
              <TomongListItem
                key={dream.id}
                dream={dream}
                theme={theme}
                selectedDream={selectedDream}
                handleRadioChange={handleRadioChange}
                styles={styles}
              />
            ))}
          </ul>
        )}
      </div>
      <div className={styles["btn-row"]}>
        <Button onClick={() => setProcess(0)}>뒤로</Button>
        {!selectedDream && <Button disabled>해몽 보기</Button>}
        {selectedDream && (
          <Button highlight={true} onClick={() => setProcess(102)}>
            해몽 보기
          </Button>
        )}
      </div>
    </>
  );
}

export function TomongRead({ setProcess, tomongDream, before }) {
  const tomongSelected = tomongDream?.tomongSelected
    ? tomongDream.tomongSelected
    : -1;
  const [showTomong, setShowTomong] = useState(tomongSelected);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { userId } = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const handleSetTomong = async (num) => {
    const res = await fetchWithAuth(`/api/tomong/set/${tomongDream.id}`, {
      method: "POST",
      body: {
        selectedIndex: num,
      },
    });

    if (res.ok) {
      setShowTomong(num);
      return true;
    } else {
      return false;
    }
  };

  const handleBack = () => {
    if (before === 2) {
      setProcess(1);
    } else {
      setProcess(101);
    }
  };

  return (
    <>
      <h2 className={styles["title"]}>해몽된 꿈 보기</h2>
      <div className={styles["tomong-results-chevrons"]}>
        <button
          onClick={() => scrollTo(selectedIndex - 1)}
          style={selectedIndex === 0 ? { opacity: 0 } : { opacity: 1 }}
          disabled={selectedIndex === 0}
        >
          <img src="images/arrow-left.svg" alt="왼쪽으로 이동" />
        </button>
        <button
          onClick={() => scrollTo(selectedIndex + 1)}
          style={
            selectedIndex === tomongDream.tomongs.length - 1
              ? { opacity: 0 }
              : { opacity: 1 }
          }
          disabled={selectedIndex === tomongDream.tomongs.length - 1}
        >
          <img src="images/arrow-right.svg" alt="오른쪽으로 이동" />
        </button>
      </div>
      <div className={styles["tomong-results-wrapper"]} ref={emblaRef}>
        <div className={styles["tomong-results"]}>
          {tomongDream.tomongs.map((dream, index) => (
            <div
              key={index}
              className={markdownStyles["markdown"]}
              dangerouslySetInnerHTML={{ __html: convertToHtml(dream.content) }}
            />
          ))}
        </div>
      </div>
      <div>
        <Button
          disabled={showTomong === selectedIndex}
          onClick={() => handleSetTomong(selectedIndex)}
        >
          {showTomong === selectedIndex
            ? "대표 해몽 설정됨"
            : "대표 해몽으로 설정"}
        </Button>
      </div>
      <div className={styles["carousel-row"]}>
        {tomongDream.tomongs.map((_, index) => (
          <button
            key={index}
            className={`${styles["carousel-indicator"]} ${
              selectedIndex === index ? styles["active"] : ""
            }`}
            onClick={() => scrollTo(index)}
            aria-label={`슬라이드 ${index + 1}`}
          />
        ))}
      </div>
      <div className={styles["btn-row"]}>
        <Button onClick={handleBack}>뒤로</Button>
        <ButtonLink href={`/${userId}`} highlight={true}>
          프로필로 이동
        </ButtonLink>
      </div>
    </>
  );
}

export default function TomongComponent() {
  const [process, setProcess] = useState(0);
  const [before, setBefore] = useState(0);
  const [selectedDream, setSelectedDream] = useState(null);
  const [tomongDream, setTomongDream] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const router = useRouter();

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className={styles["container"]}>
      <h1>
        <Link href="/">
          <img src="/images/logo-full.svg" alt="DREAMER" width={240} />
        </Link>
      </h1>
      <main className={styles["main"]}>
        {process === 0 && <TomongIntro setProcess={setProcess} />}
        {process === 1 && (
          <TomongSelect
            setProcess={setProcess}
            setSelectedDream={setSelectedDream}
          />
        )}
        {process === 2 && (
          <TomongResult
            setProcess={setProcess}
            selectedDream={selectedDream}
            setTomongDream={setTomongDream}
            tomongDream={tomongDream}
            setBefore={setBefore}
          />
        )}
        {process === 101 && (
          <TomongLists
            setProcess={setProcess}
            setTomongDream={setTomongDream}
          />
        )}
        {process === 102 && (
          <TomongRead
            setProcess={setProcess}
            tomongDream={tomongDream}
            before={before}
          />
        )}
      </main>
    </div>
  );
}
