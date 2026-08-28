// This file lives at /api/price.js in your project.
// Vercel automatically turns any file in /api into a live endpoint —
// so this becomes: https://yoursite.vercel.app/api/price
//
// It runs on Vercel's server, NOT in the visitor's browser, so the
// API key (read from the Environment Variable you set in Step 2)
// is never visible to anyone using the app.

export default async function handler(req, res) {
  // CORS: without this, browsers block reading the response when this page
  // is served from a DIFFERENT domain than this Vercel deployment (e.g. a
  // GitHub Pages site calling this API) — the request would go through but
  // the browser would silently refuse to hand the data back to the page.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter, e.g. ?symbol=EUR/USD' });
  }

  const apiKey = process.env.TWELVE_DATA_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing TWELVE_DATA_KEY — check Vercel Environment Variables.' });
  }

  const url = `https://api.twelvedata.com/price?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Pass through Twelve Data's own response as-is
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Could not reach the price provider. Try again shortly.' });
  }
}
