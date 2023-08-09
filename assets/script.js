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
    weatherIcon.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
    temp.textContent = `${data.main.temp}° F`
    humidity.textContent = `Humidity: ${data.main.humidity} %`
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} MPH`

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
// function currentWeather(){
//     var url = "https://api.openweathermap.org/data/2.5/weather?appid=7ab439372a6b7834b1058543aced3bee&q=atlanta&units=imperial"
//     fetch(url)
//         .then(response => {
//             console.log(response);
//             response.json()
            
//         })
//         .then(data => console.log(data))

//         .catch(err => alert(err.message))
// }
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
            //displayForecast(data.list)
          })
      })
      .catch(function (err) {
        console.error(err)
      })
  }

// fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ee5aadde629a52e00ec9baf6c42378d5&units=imperial")
// .then(response => response.JSON)
// .then(data => console.log(data))

// .catch(err => alert("Wrong city name!"))




//  console.log(city);

// function renderWeather() {
//     var currentWeather = $("#weather-results")
// }

// function fetchWeather() {
//     var weatherUrl = "api.openweathermap.org/data/2.5/forecast?q="+ city +"&appid=ee5aadde629a52e00ec9baf6c42378d5"

//     fetch(weatherUrl)
//     .then((response) => response.json())
//     .then((data) => console.log(data));
// }

// fetchWeather();