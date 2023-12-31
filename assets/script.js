var cityName = document.querySelector(".city-name");
var date = document.querySelector(".date");
var weatherIcon = document.querySelector(".weather-icon");
var temp = document.querySelector(".temp");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".wind-speed");
var searchInput = document.querySelector(".location");
var weatherApiRootUrl = "https://api.openweathermap.org";
var apiKey = "7ab439372a6b7834b1058543aced3bee";
var weatherResults = document.getElementById("weather-results");
var searchCityBtn = document.querySelector(".btn");
var forecastContainer = document.getElementById("forecast-container");

updateFavoriteCitiesList();

searchCityBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var cityName = document.querySelector(".location").value.trim();

  var favoriteCities = JSON.parse(localStorage.getItem("favoriteCities")) || [];

  favoriteCities.unshift(cityName);

  favoriteCities.slice(5);

  localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));

  updateFavoriteCitiesList();
});

function updateFavoriteCitiesList() {
  var favoriteCities = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  var listGroup = document.querySelector(".list-group");

  listGroup.innerHTML = "";

  for (var i = 0; i < 5; i++) {
    const favCityEl = document.createElement("button");
    favCityEl.setAttribute("class", "list-group-item");
    favCityEl.textContent = favoriteCities[i];
    listGroup.append(favCityEl);
  }
  searchCityListeners();
}

function searchCityListeners() {
  var favCityBtn = document.querySelectorAll(".list-group-item");
  for (var i = 0; i < favCityBtn.length; i++) {
    favCityBtn[i].addEventListener("click", function (event) {
      var cityName = event.target.textContent;
      fetchCoords(cityName);
      weatherResults.classList.remove("hide");
      forecastContainer.classList.remove("hide");
    });
  }
}

searchCityListeners();

function displayCurrentWeather(data) {
  cityName.textContent = data.name;
  date.textContent = dayjs.unix(data.dt).format("MM/DD/YYYY");
  weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  temp.textContent = `${data.main.temp}° F`;
  humidity.textContent = `Humidity: ${data.main.humidity} %`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;
}

function displayForecast(data) {
  let weatherData = [];
  for (let i = 3; i < data.list.length; i += 8) {
    weatherData.push(data.list[i]);
  }
  for (let i = 0; i < weatherData.length; i++) {
    const forecastDate = dayjs.unix(weatherData[i].dt).format("MM/DD/YYYY");
    const forecastIcon = weatherData[i].weather[0].icon;
    const forecastTemp = `${weatherData[i].main.temp}° F`;
    const forecastHumidity = `Humidity: ${weatherData[i].main.humidity} %`;
    const forecastWind = `Wind Speed: ${weatherData[i].wind.speed} MPH`;

    const iconUrl = `https://openweathermap.org/img/w/${forecastIcon}.png`;

    const forecast = document.getElementById("day" + (i + 1));
    forecast.querySelector(".forecast-date").textContent = forecastDate;
    forecast.querySelector(".forecast-icon").src = iconUrl;
    forecast.querySelector(".forecast-temp").textContent = forecastTemp;
    forecast.querySelector(".forecast-humidity").textContent = forecastHumidity;
    forecast.querySelector(".forecast-wind").textContent = forecastWind;
  }
}

document
  .querySelector(".btn")
  .addEventListener("click", handleSearchFormSubmit);

function handleSearchFormSubmit(e) {
  weatherResults.classList.remove("hide");
  forecastContainer.classList.remove("hide");
  // Don't continue if there is nothing in the search form
  if (!searchInput.value) {
    return;
  }

  e.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = "";
}
function fetchCoords(search) {
  var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        //console.log(data[0])
        //appendToHistory(search)
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchWeather(location) {
  var { lat, lon, name } = location;

  //   get the current waether now, uses city name
  var apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${name}&units=imperial`;

  //   get the forecast, uses lat/lon
  var apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(apiUrlWeather)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      //console.log(data)
      displayCurrentWeather(data);
    })
    .then(function () {
      fetch(apiUrlForecast)
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          //console.log(data)
          displayForecast(data);
        });
    })
    .catch(function (err) {
      console.error(err);
    });
}
