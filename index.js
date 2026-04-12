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
