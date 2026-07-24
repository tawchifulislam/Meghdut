<div align="center">
<pre>
███╗   ███╗███████╗ ██████╗ ██╗  ██╗██████╗ ██╗   ██╗████████╗
████╗ ████║██╔════╝██╔════╝ ██║  ██║██╔══██╗██║   ██║╚══██╔══╝
██╔████╔██║█████╗  ██║  ███╗███████║██║  ██║██║   ██║   ██║
██║╚██╔╝██║██╔══╝  ██║   ██║██╔══██║██║  ██║██║   ██║   ██║
██║ ╚═╝ ██║███████╗╚██████╔╝██║  ██║██████╔╝╚██████╔╝   ██║
╚═╝     ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝    ╚═╝  
</pre>

### **Weather, beautifully told.**

<br/>

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-meghdut.vercel.app-c9a96e?style=for-the-badge&labelColor=080c18)](https://meghdut.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-tawchifulislam-white?style=for-the-badge&logo=github&labelColor=080c18)](https://github.com/tawchifulislam/Meghdut)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify&labelColor=080c18)](https://meghdut-weather.netlify.app)

<br/>

</div>

---

<div align="center">

## ⛈ &nbsp; ☀️ &nbsp; 🌧 &nbsp; ❄️ &nbsp; ☁️

*A minimal, dark-aesthetic weather experience - no frameworks, no clutter.*

</div>

---

## ✦ &nbsp;Overview

**Meghdut** is a weather web app built with pure HTML, CSS, and JavaScript. It focuses on delivering real-time weather data through a calm, elegant interface - inspired by the idea that information can be both useful and beautiful.

No React. No build tools. Just clean code and a refined UI.

---

## ✦ &nbsp;Features

```
🌡  Real-time weather conditions
📅  3-day daily forecast with min / max temps
🌅  Sunrise & Sunset times
💨  Wind speed, Humidity, Pressure, Visibility
✨  Glassmorphism UI with gold accent tones
🎞  Smooth fade-up animations & floating icon
📱  Fully responsive - mobile to desktop
🔍  Search any city in the world
```

---

## ✦ &nbsp;Tech Stack

<div align="center">

| Layer | Tech |
|:---:|:---:|
| Markup | `HTML5` |
| Styling | `CSS3` + `Tailwind CSS` |
| Logic | `Vanilla JavaScript` |
| Fonts | `Playfair Display` · `Outfit` |
| Data | `WeatherAPI.com` |
| Hosting | `Netlify` |

</div>

---

## ✦ &nbsp;Getting Started

**1. Clone the repo**

```bash
git clone https://github.com/tawchifulislam/Meghdut.git
cd Meghdut
```

**2. Add your API key**

Create a `config.js` file in the root:

```js
const API_KEY = 'your_weatherapi_key_here';
```

> Get a free key at [weatherapi.com →](https://www.weatherapi.com/signup.aspx)

**3. Launch**

```bash
open index.html
# No build step. No dependencies. Just open it.
```

---

## ✦ &nbsp;Project Structure

```
Meghdut/
│
├── 📄 index.html      → App structure & layout
├── 🎨 style.css       → Custom styles & animations
├── ⚙️  index.js       → Weather logic & API calls
├── 🔑 config.js       → API key (gitignored)
└── 🚫 .gitignore
```

---

## ✦ &nbsp;API Endpoints

Two endpoints from [WeatherAPI.com](https://www.weatherapi.com/docs/) power the app:

```
GET /v1/current.json?key=KEY&q=CITY
    → Real-time temperature, wind, humidity, pressure, visibility

GET /v1/forecast.json?key=KEY&q=CITY&days=5
    → 3-day forecast + sunrise & sunset (astro data)
```

---

## ✦ &nbsp;Design Philosophy

> *Less noise. More signal.*

Meghdut was built around one idea - weather data should feel calm, not chaotic. The dark background, Playfair Display typeface, muted gold accents, and subtle glassmorphism all serve that single purpose.

---

<div align="center">

---

Made with care by **[Tawchiful Islam](https://github.com/tawchifulislam)**

*If you like this project, consider leaving a ⭐ on GitHub.*

---

</div>
