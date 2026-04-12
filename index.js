const $ = id => document.getElementById(id);

const weatherEmojis = {
  Thunderstorm: '⛈',
  Drizzle: '🌦',
  Rain: '🌧',
  Snow: '❄️',
  Mist: '🌫',
  Smoke: '🌫',
  Haze: '🌫',
  Dust: '🌫',
  Fog: '🌫',
  Sand: '🌫',
  Ash: '🌫',
  Squall: '🌫',
  Tornado: '🌪',
  Clear: '☀️',
  Clouds: '☁️',
};

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDate(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function showError(msg) {
  const el = $('errorMsg');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideError() {
  $('errorMsg').classList.add('hidden');
}

function setLoading(on) {
  $('loadingState').classList.toggle('hidden', !on);
  $('emptyState').classList.add('hidden');
  $('weatherCard').classList.add('hidden');
}

async function fetchWeather() {
  const city = $('cityInput').value.trim();
  if (!city) return;

  hideError();
  setLoading(true);

  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`,
      ),
      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5`,
      ),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json();
      throw new Error(err.error?.message || 'City not found');
    }

    const data = await currentRes.json();
    const forecast = await forecastRes.json();

    renderWeather(data, forecast);
  } catch (err) {
    setLoading(false);
    $('emptyState').classList.remove('hidden');
    showError(
      err.message === 'Failed to fetch'
        ? 'Network error. Please check your connection.'
        : `${err.message}`,
    );
  }
}

function mapCondition(text) {
  text = text.toLowerCase();
  if (text.includes('thunder')) return 'Thunderstorm';
  if (text.includes('drizzle') || text.includes('freezing')) return 'Drizzle';
  if (text.includes('rain') || text.includes('shower')) return 'Rain';
  if (
    text.includes('snow') ||
    text.includes('blizzard') ||
    text.includes('sleet')
  )
    return 'Snow';
  if (text.includes('fog')) return 'Fog';
  if (text.includes('mist')) return 'Mist';
  if (text.includes('haze')) return 'Haze';
  if (text.includes('dust') || text.includes('sand')) return 'Dust';
  if (text.includes('tornado')) return 'Tornado';
  if (text.includes('overcast') || text.includes('cloud')) return 'Clouds';
  if (text.includes('sunny') || text.includes('clear')) return 'Clear';
  return 'Clear';
}

function renderWeather(data, forecast) {
  const current = data.current;
  const location = data.location;
  const conditionText = current.condition.text;
  const main = mapCondition(conditionText);

  $('cityName').textContent = location.name;
  $('countryDate').textContent =
    `${location.country} · ${formatDate(location.localtime_epoch, 0)}`;
  $('weatherDesc').textContent = conditionText;
  $('tempDisplay').textContent = `${Math.round(current.temp_c)}°`;
  $('feelsLike').textContent =
    `Feels like ${Math.round(current.feelslike_c)}°C`;
  $('weatherIcon').textContent = weatherEmojis[main] || '🌡';
  $('humidity').textContent = `${current.humidity}%`;
  $('windSpeed').textContent = `${Math.round(current.wind_kph)} km/h`;
  $('visibility').textContent = `${current.vis_km} km`;
  $('pressure').textContent = `${current.pressure_mb} hPa`;

  const astro = forecast.forecast.forecastday[0].astro;
  $('sunrise').textContent = astro.sunrise;
  $('sunset').textContent = astro.sunset;

  const dailyItems = forecast.forecast.forecastday.slice(0, 5);

  $('forecastContainer').innerHTML = dailyItems
    .map((item, i) => {
      const d = new Date(item.date_epoch * 1000);
      const day = days[d.getUTCDay()];
      const emoji =
        weatherEmojis[mapCondition(item.day.condition.text)] || '🌡';
      const isFirst = i === 0;
      const bg = isFirst
        ? 'background:rgba(255,255,255,0.07); border:0.5px solid rgba(255,255,255,0.1);'
        : 'background:rgba(255,255,255,0.03);';
      const dayColor = isFirst
        ? 'rgba(201,169,110,0.9)'
        : 'rgba(255,255,255,0.28)';
      return `
      <div style="${bg} border-radius:16px; padding:14px 4px; display:flex; flex-direction:column; align-items:center; gap:8px; transition:background 0.2s; cursor:default;">
        <p style="font-size:clamp(9px,1.4vw,11px); font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:${dayColor};">
          ${day}
        </p>
        <span style="font-size:clamp(20px,4vw,28px); line-height:1;">${emoji}</span>
        <p style="font-family:'Playfair Display',serif; font-size:clamp(14px,2.5vw,20px); font-weight:500; color:#fff;">
          ${Math.round(item.day.avgtemp_c)}°
        </p>
        <p style="font-size:clamp(9px,1.2vw,11px); color:rgba(255,255,255,0.22); text-align:center; line-height:1.4;">
          ${Math.round(item.day.mintemp_c)}°<br/>${Math.round(item.day.maxtemp_c)}°
        </p>
      </div>`;
    })
    .join('');

  setLoading(false);
  $('weatherCard').classList.remove('hidden');
}
