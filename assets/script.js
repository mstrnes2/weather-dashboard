var cityName = document.querySelector(".city-name");
var date = document.querySelector(".date");
var weatherIcon = document.querySelector(".weather-icon");
var temp = document.querySelector(".temp");
var humidity = document.querySelector(".humidity");
var windSpeed = document.querySelector(".wind-speed");
var searchInput = document.querySelector(".location");
var weatherApiRootUrl = 'https://api.openweathermap.org';
var apiKey = "7ab439372a6b7834b1058543aced3bee";
var weatherResults = document.querySelector(".hide");

function displayCurrentWeather(data){
    cityName.textContent = data.name;
    date.textContent = dayjs.unix(data.dt).format("MM/DD/YYYY");
    weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    temp.textContent = `${data.main.temp}° F`;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`;

}

function displayForecast(data) {

  for (let i = 0; i < data.list.length; i++) {
    const forecastDate = dayjs.unix(data.list[i].dt).format("MM/DD/YYYY");
    const forecastIcon = data.list[i].weather[0].icon;
    const forecastTemp = `${data.list[i].main.temp}° F`;
    const forecastHumidity = `Humidity: ${data.list[i].main.humidity} %`;
    const forecastWind = `Wind Speed: ${data.list[i].wind.speed} MPH`

    const iconUrl = `https://openweathermap.org/img/w/${forecastIcon}.png`;

    const forecast = document.getElementById(`#day${i + 1}`);
    forecast.querySelector(".forecast-date").textContent = forecastDate;
    forecast.querySelector(".forecast-icon").src = iconUrl;
    forecast.querySelector(".forecast-temp").textContent = forecastTemp;
    forecast.querySelector(".forecast-humidity").textContent = forecastHumidity;
    forecast.querySelector(".forecast-wind").textContent = forecastWind;
}

}

document.querySelector(".btn").addEventListener("click", handleSearchFormSubmit)

function handleSearchFormSubmit(e) {

    weatherResults.classList.remove("hide");
    // Don't continue if there is nothing in the search form
    if (!searchInput.value) {
      return
    }
  
    e.preventDefault()
    var search = searchInput.value.trim()
    fetchCoords(search)
    searchInput.value = ''
  }
  function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found')
        } else {
          console.log(data[0])
          //appendToHistory(search)
          fetchWeather(data[0])
        }
      })
      .catch(function (err) {
        console.error(err)
      })
  }

function fetchWeather(location) {
    var { lat, lon, name } = location
  
    //   get the current waether now, uses city name
    var apiUrlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&q=${name}&units=imperial`
  
    //   get the forecast, uses lat/lon
    var apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  
    fetch(apiUrlWeather)
      .then(function (res) {
        return res.json()
      })
      .then(function (data) {
        console.log(data)
        displayCurrentWeather(data)
      })
      .then(function () {
        fetch(apiUrlForecast)
          .then(function (res) {
            return res.json()
          })
          .then(function (data) {
            console.log(data)
            displayForecast(data)
          })
      })
      .catch(function (err) {
        console.error(err)
      })
  }

