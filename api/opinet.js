// Vercel Serverless Function: 오피넷 aroundAll.do 프록시
// 브라우저에서 www.opinet.co.kr 직접 호출 시 CORS로 막히므로 서버 경유.
// 키는 쿼리로 전달받아 그대로 전달하고, 서버에 저장/기록하지 않음.
export default async function handler(req, res) {
  const q = req.query || {};
  const { code, x, y } = q;
  if (!code || !x || !y) {
    return res.status(400).json({ error: 'missing params' });
  }
  try {
    const url = 'https://www.opinet.co.kr/api/aroundAll.do'
      + '?code=' + encodeURIComponent(code)
      + '&x=' + encodeURIComponent(x)
      + '&y=' + encodeURIComponent(y)
      + '&radius=' + encodeURIComponent(q.radius || '3000')
      + '&sort=' + encodeURIComponent(q.sort || '1')
      + '&prodcd=' + encodeURIComponent(q.prodcd || 'B027')
      + '&out=json';
    const r = await fetch(url);
    const data = await r.json().catch(() => ({}));
    return res.status(r.status).json(data);
  } catch (e) {
    return res.status(502).json({ error: 'proxy failed' });
  }
}
