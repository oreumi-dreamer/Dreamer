export default function postTime(createdAt, updatedAt) {
  const createDate = new Date(createdAt).getTime(); // 게시일시
  const updateDate = new Date(updatedAt).getTime(); // 수정일시
  const nowDate = new Date().getTime(); // 현재 일시

  // 시간 기준으로 24 시간 전 / 7일 전 / 전체 날짜 표기 | 수정 업로드시 (수정됨) 표기
  if (createDate === updateDate) {
    const calHour = (nowDate - createDate) / (1000 * 60 * 60);
    return calHour < 24
      ? `${calHour}시간 전`
      : calHour / 24 < 7
        ? `${Math.trunc(calHour / 24)}일 전`
        : createdAt.slice(0, -14);
  } else {
    const updateCalHour = (nowDate - updateDate) / (1000 * 60 * 60);
    return updateCalHour < 24
      ? `${updateCalHour}시간 전(수정됨)`
      : updateCalHour / 24 < 7
        ? `${Math.trunc(updateCalHour / 24)}일 전(수정됨)`
        : `${updatedAt.slice(0, -14)}(수정됨)`;
  }
}
