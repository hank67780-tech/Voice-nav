// Vercel Serverless Function: 카카오 자전거 길찾기 프록시
// 브라우저에서 dapi.kakao.com 직접 호출 시 CORS로 막히므로 서버 경유.
// 키는 쿼리로 전달받아 헤더에 넣어 호출하고, 서버에 저장/기록하지 않음.
export default async function handler(req, res) {
  const { start_x, start_y, end_x, end_y, key } = req.query || {};
  if (!key || !start_x || !start_y || !end_x || !end_y) {
    return res.status(400).json({ error: 'missing params' });
  }
  try {
    const url = 'https://dapi.kakao.com/v2/routing/bicycle' +
      '?start_x=' + encodeURIComponent(start_x) +
      '&start_y=' + encodeURIComponent(start_y) +
      '&end_x=' + encodeURIComponent(end_x) +
      '&end_y=' + encodeURIComponent(end_y);
    const r = await fetch(url, { headers: { 'Authorization': 'KakaoAK ' + key } });
    const data = await r.json().catch(() => ({}));
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'proxy failed' });
  }
}
