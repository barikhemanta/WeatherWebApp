const apiKey = "6e0d8277d9b05f22cf07887d8d6f7039"; // Replace with your API key
const locationInput = document.getElementById("location-input");
const getWeatherButton = document.getElementById("submit");
const weatherDataContainer = document.getElementById("weather-info");
const errorMessageContainer = document.getElementById("error-msg");
const unitToggle = document.getElementById("unit-toggle");
const unitInputs = document.getElementsByName("unit");

getWeatherButton.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    getWeather(location);
  } else {
    errorMessageContainer.textContent = "Please enter a valid location.";
  }
});

unitToggle.addEventListener("change", () => {
  const selectedUnit = getSelectedUnit();
  const location = locationInput.value.trim();

  if (location) {
    getWeather(location, selectedUnit);
  }
});

async function getWeather(location, unit = "metric") {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      clearError();
      displayWeather(data, unit); // Pass the unit when displaying weather
      updateUnitToggle(unit);
    } else {
      showError("Location not found.");
    }
  } catch (error) {
    showError("Error fetching weather data.");
  }
}

function displayWeather(data, unit = "metric") {
  const { main, weather, wind } = data;
  const temperature = main.temp;
  const humidity = main.humidity;
  const description = weather[0].description;
  const windSpeed = wind.speed;

  let unitSymbol = "";

  if (unit === "metric") {
    unitSymbol = "°C";
  } else if (unit === "imperial") {
    unitSymbol = "°F";
  } else if (unit === "kelvin") {
    unitSymbol = "K";
  }

  const weatherHTML = `
        <h2>Weather in ${data.name}, ${data.sys.country}</h2>
        <p>Temperature: ${temperature} ${unitSymbol}</p>
        <p>Humidity: ${humidity} %</p>
        <p>Weather: ${description}</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;

  weatherDataContainer.innerHTML = weatherHTML;
}

function showError(message) {
  errorMessageContainer.textContent = message;
  weatherDataContainer.innerHTML = ""; // Clear weather data
}

function clearError() {
  errorMessageContainer.textContent = "";
}

function getSelectedUnit() {
  for (const unitInput of unitInputs) {
    if (unitInput.checked) {
      return unitInput.value;
    }
  }
  return "metric"; // Default to Celsius if none is selected
}

function updateUnitToggle(unit) {
  for (const unitInput of unitInputs) {
    if (unitInput.value === unit) {
      unitInput.checked = true;
    } else {
      unitInput.checked = false;
    }
  }
}
