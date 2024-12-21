export function postTime(createdAt, updatedAt) {
  const createDate = new Date(createdAt).getTime(); // 게시일시
  const updateDate = new Date(updatedAt).getTime(); // 수정일시
  const nowDate = new Date().getTime(); // 현재 일시

  // 시간 기준으로 24 시간 전 / 7일 전 / 전체 날짜 표기| 1시간 이내 분단위 표기 | 수정 업로드시 (수정됨) 표기
  if (createDate === updateDate) {
    const calHour = (nowDate - createDate) / (1000 * 60 * 60);
    return calHour < 1
      ? `${Math.trunc(calHour * 60)}분 전`
      : calHour < 24
        ? `${Math.trunc(calHour)}시간 전`
        : calHour / 24 < 7
          ? `${Math.trunc(calHour / 24)}일 전`
          : new Date(createdAt).toISOString().split("T")[0];
  } else {
    const updateCalHour = (nowDate - updateDate) / (1000 * 60 * 60);
    return updateCalHour < 1
      ? `${Math.trunc(updateCalHour * 60)}분 전(수정됨)`
      : updateCalHour < 24
        ? `${Math.trunc(updateCalHour)}시간 전(수정됨)`
        : updateCalHour / 24 < 7
          ? `${Math.trunc(updateCalHour / 24)}일 전(수정됨)`
          : `${new Date(updatedAt).toISOString().split("T")[0]}(수정됨)`;
  }
}

export function postTimeScreenReader(createdAt, updatedAt) {
  const createDate = new Date(createdAt).getTime(); // 게시일시
  const updateDate = new Date(updatedAt).getTime(); // 수정일시
  const nowDate = new Date().getTime(); // 현재 일시

  const createdYear = new Date(createdAt).getFullYear();
  const createdMonth = new Date(createdAt).getMonth() + 1;
  const createdDate = new Date(createdAt).getDate();

  const updatedYear = new Date(updatedAt).getFullYear();
  const updatedMonth = new Date(updatedAt).getMonth() + 1;
  const updatedDate = new Date(updatedAt).getDate();

  // 시간 기준으로 24 시간 전 / 7일 전 / 전체 날짜 표기| 1시간 이내 분단위 표기 | 수정 업로드시 (수정됨) 표기
  if (createDate === updateDate) {
    const calHour = (nowDate - createDate) / (1000 * 60 * 60);
    return calHour < 1
      ? `${Math.trunc(calHour * 60)}분 전`
      : calHour < 24
        ? `${Math.trunc(calHour)}시간 전`
        : calHour / 24 < 7
          ? `${Math.trunc(calHour / 24)}일 전`
          : `${createdYear}년 ${createdMonth}월 ${createdDate}일`;
  } else {
    const updateCalHour = (nowDate - updateDate) / (1000 * 60 * 60);
    return updateCalHour < 1
      ? `${Math.trunc(updateCalHour * 60)}분 전 수정됨`
      : updateCalHour < 24
        ? `${Math.trunc(updateCalHour)}시간 전 수정됨`
        : updateCalHour / 24 < 7
          ? `${Math.trunc(updateCalHour / 24)}일 전 수정됨`
          : `${updatedYear}년 ${updatedMonth}월 ${updatedDate}에 수정됨`;
  }
}
