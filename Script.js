function fetchWeatherData(location) {
    const apiKey = 'e670e7958da160c425a25bbb72601997';
    const currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
  
    // Fetch current weather data
    fetch(currentWeatherUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(currentData => {
        // Fetch 5-day forecast data
        fetch(forecastUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(forecastData => {
            // Update the weather dashboard with current and forecast data
            updateWeatherDashboard(currentData, forecastData);
          })
          .catch(error => {
            console.error('There was a problem with fetching forecast data:', error);
          });
      })
      .catch(error => {
        console.error('There was a problem with fetching current weather data:', error);
      });
  }
  
  function updateWeatherDashboard(currentData, forecastData) {
    // Update current weather section
    const currentWeatherSection = document.getElementById('current-weather');
    currentWeatherSection.innerHTML = `
      <p><strong>Location:</strong> ${currentData.name}</p>
      <p><strong>Temperature:</strong> ${currentData.main.temp}°C</p>
      <p><strong>Weather Condition:</strong> ${currentData.weather[0].main}</p>
      <p><strong>Description:</strong> ${currentData.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${currentData.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${currentData.wind.speed} m/s</p>
    `;
  
    // Update 5-day weather forecast section
    const forecastSection = document.getElementById('forecast');
    forecastSection.innerHTML = ''; // Clear previous forecast data
  
    // Group forecast data by day
    const dailyForecasts = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
  
      if (!dailyForecasts[day]) {
        dailyForecasts[day] = {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      } else {
        dailyForecasts[day].temp_min = Math.min(dailyForecasts[day].temp_min, item.main.temp_min);
        dailyForecasts[day].temp_max = Math.max(dailyForecasts[day].temp_max, item.main.temp_max);
      }
    });
  
    // Display the forecast for each day
    for (const [day, forecast] of Object.entries(dailyForecasts)) {
      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
        <h3>${day}</h3>
        <p><strong>Temperature:</strong> ${Math.round(forecast.temp_min)}°C - ${Math.round(forecast.temp_max)}°C</p>
        <p><strong>Description:</strong> ${forecast.description}</p>
        <img src="http://openweathermap.org/img/wn/${forecast.icon}.png" alt="${forecast.description}">
      `;
      forecastSection.appendChild(forecastItem);
    }
  }
  
  // Event listener for search button click
  document.getElementById('search-btn').addEventListener('click', function() {
    const location = document.getElementById('location-input').value;
    fetchWeatherData(location);
  });
  
  // Initial fetch for default location or any other initialization
  fetchWeatherData('Mumbai'); // You can set default location to any Indian city like Mumbai, Delhi, etc.
  