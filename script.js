// Function to get weather details for the entered city
function getWeather() {
  const apiKey = 'b81571b64cab3598a61336de5a9d4799';
  const city = document.getElementById('city').value;

  if (!city) {
    alert('Please enter a city name');
    return;
  }

  // API URLs for current weather and 5-day forecast
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  // Fetch current weather
  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(error => {
      console.error('Error fetching current weather:', error);
      alert('Unable to fetch current weather data. Please try again.');
    });

  // Fetch 5-day / 3-hour forecast
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => displayHourlyForecast(data.list))
    .catch(error => {
      console.error('Error fetching forecast:', error);
      alert('Unable to fetch forecast data. Please try again.');
    });
}

// Function to display the current weather details
function displayWeather(data) {
  const tempDiv = document.getElementById('temp-div');
  const infoDiv = document.getElementById('weather-info');
  const iconImg = document.getElementById('weather-icon');
  const forecastDiv = document.getElementById('hourly-forecast');

  // Clear old content
  tempDiv.innerHTML = '';
  infoDiv.innerHTML = '';
  forecastDiv.innerHTML = '';

  if (data.cod === '404') {
    infoDiv.innerHTML = `<p>${data.message}</p>`;
    return;
  }

  // Extract and format weather details
  const cityName = data.name;
  const temperature = Math.round(data.main.temp - 273.15); // Kelvin → Celsius
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  // Update UI with current weather
  tempDiv.innerHTML = `<p>${temperature}°C</p>`;
  infoDiv.innerHTML = `
    <p>${cityName}</p>
    <p>${description}</p>
  `;
  iconImg.src = iconUrl;
  iconImg.alt = description;

  showImage();
}

// Function to display the next 24 hours of forecast (8 intervals × 3 hours)
function displayHourlyForecast(hourlyData) {
  const forecastDiv = document.getElementById('hourly-forecast');
  forecastDiv.innerHTML = '';

  const next24Hours = hourlyData.slice(0, 8);

  next24Hours.forEach(item => {
    const dateTime = new Date(item.dt * 1000);
    const hour = dateTime.getHours();
    const temperature = Math.round(item.main.temp - 273.15);
    const iconCode = item.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const hourlyItem = `
      <div class="hourly-item">
        <span>${hour}:00</span>
        <img src="${iconUrl}" alt="Hourly weather icon">
        <span>${temperature}°C</span>
      </div>
    `;
    forecastDiv.innerHTML += hourlyItem;
  });
}

// Function to make the weather icon visible after it loads
function showImage() {
  const iconImg = document.getElementById('weather-icon');
  iconImg.style.display = 'block';
}
