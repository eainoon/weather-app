const apiKey = 3cc32891bb7c83b5ee1db142b5ee1bcd;

const statusElem = document.getElementById("status");
const iconElem = document.getElementById("icon");
const cityElem = document.getElementById("city");
const tempElem = document.getElementById("temp");
const descElem = document.getElementById("desc");
const humidityElem = document.getElementById("humidity");
const loadingElem = document.getElementById("loading");
const errorElem = document.getElementById("error");

window.addEventListener("load", () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, locationError);
  } else {
    showError("Geolocation not supported by your browser.");
  }
});

function success(pos) {
  const { latitude, longitude } = pos.coords;
  statusElem.textContent = "Fetching weather data...";
  getWeather(latitude, longitude);
}

function locationError() {
  showError("Location access denied. Showing Kuala Lumpur weather instead.");
  getWeather(3.139, 101.6869); // fallback
}

async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error("Network response was not ok.");
    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    showError("Unable to retrieve weather data. Check your API key or internet.");
    console.error(err);
  }
}

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { description, icon } = data.weather[0];

  statusElem.textContent = "";
  loadingElem.style.display = "none";
  iconElem.style.display = "block";
  iconElem.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  cityElem.textContent = name;
  tempElem.textContent = `${Math.round(temp)}°C`;
  descElem.textContent = description;
  humidityElem.textContent = `💧 Humidity: ${humidity}%`;
}

function showError(msg) {
  statusElem.textContent = "";
  loadingElem.style.display = "none";
  errorElem.textContent = msg;
}
