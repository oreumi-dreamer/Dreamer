"use client";

// ref => useRef로 접근한 모달요소
// callback => 모달 닫기 함수(ref가 참조하는 요소 외부를 클릭했을 때 호출됨)
export const outsideClickModalClose = (ref, callback) => {
  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  document.addEventListener('click', handleClickOutside);

  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
};