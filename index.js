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

function formatTime(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  let h = d.getUTCHours(),
    m = d.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

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
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      ),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json();
      throw new Error(err.message || 'City not found');
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

function renderWeather(data, forecast) {
  const tz = data.timezone;
  const main = data.weather[0].main;

  $('cityName').textContent = data.name;
  $('countryDate').textContent =
    `${data.sys.country} · ${formatDate(data.dt, tz)}`;
  $('weatherDesc').textContent =
    data.weather[0].description.charAt(0).toUpperCase() +
    data.weather[0].description.slice(1);
  $('tempDisplay').textContent = `${Math.round(data.main.temp)}°`;
  $('feelsLike').textContent =
    `Feels like ${Math.round(data.main.feels_like)}°C`;
  $('weatherIcon').textContent = weatherEmojis[main] || '🌡';
  $('humidity').textContent = `${data.main.humidity}%`;
  $('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
  $('visibility').textContent = data.visibility
    ? `${(data.visibility / 1000).toFixed(1)} km`
    : '—';
  $('pressure').textContent = `${data.main.pressure} hPa`;
  $('sunrise').textContent = formatTime(data.sys.sunrise, tz);
  $('sunset').textContent = formatTime(data.sys.sunset, tz);

  const dailyMap = {};
  forecast.list.forEach(item => {
    const d = new Date((item.dt + tz) * 1000);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    const hour = d.getUTCHours();
    if (
      !dailyMap[key] ||
      Math.abs(hour - 12) <
        Math.abs(new Date((dailyMap[key].dt + tz) * 1000).getUTCHours() - 12)
    ) {
      dailyMap[key] = item;
    }
  });

  const dailyItems = Object.values(dailyMap).slice(0, 5);

  $('forecastContainer').innerHTML = dailyItems
    .map((item, i) => {
      const d = new Date((item.dt + tz) * 1000);
      const day = days[d.getUTCDay()];
      const emoji = weatherEmojis[item.weather[0].main] || '🌡';
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
          ${Math.round(item.main.temp)}°
        </p>
        <p style="font-size:clamp(9px,1.2vw,11px); color:rgba(255,255,255,0.22); text-align:center; line-height:1.4;">
          ${Math.round(item.main.temp_min)}°<br/>${Math.round(item.main.temp_max)}°
        </p>
      </div>
    `;
    })
    .join('');

  setLoading(false);
  $('weatherCard').classList.remove('hidden');
}
