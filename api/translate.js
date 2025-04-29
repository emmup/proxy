export default async function handler(req, res) {
  const { text } = req.query;

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=id&dt=t&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);
  const data = await response.json();
  res.status(200).json(data);
}
