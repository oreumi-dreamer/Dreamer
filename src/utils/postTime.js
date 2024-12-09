export default function postTime(createdAt, updatedAt) {
  const createDate = new Date(createdAt).getTime();
  const updateDate = new Date(updatedAt).getTime();
  const nowDate = new Date().getTime();

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
