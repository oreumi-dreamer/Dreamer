// /api/today로 접속했을 때 서버 기준 오늘 날짜를 반환하는 API

export async function GET() {
  const currentDate = new Date();

  return Response.json({
    date: currentDate.toISOString(),
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
  });
}
