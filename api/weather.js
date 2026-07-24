export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { city, type } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const API_KEY = process.env.WEATHER_API_KEY;

  const endpoint = type === 'forecast' ? 'forecast.json' : 'current.json';
  const daysParam = type === 'forecast' ? '&days=5' : '';

  const url = `https://api.weatherapi.com/v1/${endpoint}?key=${API_KEY}&q=${encodeURIComponent(city)}${daysParam}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Failed to fetch weather data',
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
