var apiKey = "8aac2c1bb4f228ebf4a3ecf51e0e6e58";

var currentWeather = document.querySelector("#currentWeather");
var forecast = document.querySelector("#forecast");
var cityForm = document.querySelector("#cityForm");
var mainContent = document.querySelector("#mainContent");
var forecastContainer = document.querySelector("#forecastContainer");
var searchHistory = document.querySelectorAll(".searchHistory");
var userInput = document.querySelector("#cityInput");
var todaysDate = dayjs().format("MM/DD/YYYY");
var cityButton;
var clearSearchBtn = document.querySelector("#clearSearchBtn");
var error; 

let cityLat = "47.6062";
let cityLon = "122.3321";
let cityName = "Seattle";

function getCity() {
    const cityName = userInput.value;
    if (!cityName) {
      console.error("City name is missing");
      return;
    }
    const weatherUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
  
    fetch(weatherUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Bad Request");
        }
        return response.json();
      })
      .then(data => {
        cityLat = data[0].lat;
        cityLon = data[0].lon;
  
        getWeather();
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle the error here (e.g., display an error message to the user)
      });
  }
  
  function getWeather() {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=imperial`;
  
    fetch(weatherUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("Bad Request");
        }
        return response.json();
      })
      .then(data => {
        const cityWeather = data.list[0].main.temp;
        const cityWindSpeed = data.list[0].wind.speed;
        const cityHumidity = data.list[0].main.humidity;
        const weatherIcon = data.list[0].weather[0].icon;
  
        currentWeather.innerHTML = `
          <h2>${cityName}, ${todaysDate}</h2>
          <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="weather icon">
          <p>Temperature: ${cityWeather}°F</p>
          <p>Wind Speed: ${cityWindSpeed} MPH</p>
          <p>Humidity: ${cityHumidity}%</p>`;
  
        displayForecast(data);
      })
      .catch(error => {
        console.error("Error:", error);
        // Handle the error here (e.g., display an error message to the user)
      });
  }
  

function displayForecast(data) {
    for (let i = 1; i < 40; i += 8) {
        const tempForecast = data.list[i].main.temp;
        const dateForecast = data.list[i].dt_txt;

        const forecastCard = document.createElement("div");
        forecastCard.classList.add("forecast");
    
        forecastCard.innerHTML =
        `<p>${tempForecast}</p>
        <p>${dateForecast}</p>`

        forecastContainer.appendChild(forecastCard);
    }
}

cityForm.addEventListener("submit", function(event) {
    event.preventDefault();
    cityName = userInput.value;
    forecastContainer.innerHTML = "";
    getCity();
    cityButtons();
    userInput.value = "";
});

var cityButton; // Define cityButton variable outside the function

function cityButtons() {
    var cityName = userInput.value;
    
    if (cityName === "") {
      return;
    }

    var cityButton = document.createElement("button");
    var listItem = document.createElement("li");
    var historySelector = document.getElementById("historySelector");
    var ulElement = historySelector.nextElementSibling;
    
   
    cityButton.classList.add("btn", "searchHistory");
    cityButton.innerHTML = cityName;
  
    listItem.appendChild(cityButton);
    ulElement.appendChild(listItem);

    var cityNames = JSON.parse(localStorage.getItem("cityNames")) || [];
    cityNames.push(cityName);
    localStorage.setItem("cityNames", JSON.stringify(cityNames));



  }
  

  window.addEventListener("DOMContentLoaded", function() {
    var cityNames = JSON.parse(localStorage.getItem("cityNames")) || [];
  
    for (var i = 0; i < cityNames.length; i++) {
      var cityName = cityNames[i];
  
      var cityButton = document.createElement("button");
      cityButton.classList.add("btn", "searchHistory");
      cityButton.innerHTML = cityName;
  
      var listItem = document.createElement("li");
      listItem.appendChild(cityButton);
  
      var historySelector = document.getElementById("historySelector");
      var ulElement = historySelector.nextElementSibling;
      ulElement.appendChild(listItem);
    }
  });
  
  function clearSearchHistory() {
    localStorage.removeItem("cityNames");
    location.reload();
  }

clearSearchBtn.addEventListener("click", clearSearchHistory);
