// Lives at /api/timeseries.js -> https://yoursite.vercel.app/api/timeseries
// Same hidden-key pattern as price.js, used for the Daily/Weekly HLC auto-fill.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol, interval, outputsize } = req.query;

  if (!symbol || !interval) {
    return res.status(400).json({ error: 'Missing symbol or interval parameter.' });
  }

  const apiKey = process.env.TWELVE_DATA_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing TWELVE_DATA_KEY — check Vercel Environment Variables.' });
  }

  const size = outputsize || 30;
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&outputsize=${encodeURIComponent(size)}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not reach the price provider. Try again shortly.' });
  }
}
