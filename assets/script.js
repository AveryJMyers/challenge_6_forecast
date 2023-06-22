var apiKey = "8aac2c1bb4f228ebf4a3ecf51e0e6e58";

var currentWeather = document.querySelector("#currentWeather");
var forecast = document.querySelector("#forecast");
var cityForm = document.querySelector("#cityForm");
var mainContent = document.querySelector("#mainContent");
var forecastContainer = document.querySelector("#forecastContainer");
var searchHistory = document.querySelectorAll(".searchHistory");
var userInput = document.querySelector("#searchBar");
var todaysDate = dayjs().format("MM/DD/YYYY");
var cityButton;
var clearSearchBtn = document.querySelector("#clearSearchBtn");
var error; 
cityPicker = document.querySelector("#cityPicker");

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
    createButtons();
    userInput.value = "";
});


function createButtons() {
  var cityButton = document.createElement("button");
  var buttonList = document.createElement("li");
  cityButton.classList.add("btn", "btn-dark", "searchHistory");
  cityButton.innerHTML = cityName;
  if (cityName === "") {
    return;
  }


  cityPicker.appendChild(buttonList);
  buttonList.appendChild(cityButton);

  // Check if local storage is available
  if (typeof localStorage !== "undefined") {
    // Save the list of buttons to local storage
    var buttons = JSON.parse(localStorage.getItem("cityButtons")) || [];
    buttons.push(cityName);
    localStorage.setItem("cityButtons", JSON.stringify(buttons));
  }
}

// Function to load and display the saved buttons
function loadButtons() {
  // Check if local storage is available
  if (typeof localStorage !== "undefined") {
    var buttons = JSON.parse(localStorage.getItem("cityButtons")) || [];
    buttons.forEach(function(cityName) {
      var cityButton = document.createElement("button");
      var buttonList = document.createElement("li");
      cityButton.classList.add("btn", "btn-dark", "searchHistory");
      cityButton.innerHTML = cityName + "<br>";

      cityPicker.appendChild(buttonList);
      buttonList.appendChild(cityButton);
    });
  }
}

// Call the loadButtons function when the page loads
window.addEventListener("load", loadButtons);

function clearSearchHistory() {
  localStorage.removeItem("cityButtons");
  location.reload();
}
clearSearchBtn.addEventListener("click", clearSearchHistory);


function createButtons(cityName) {
  var cityButton = document.createElement("button");
  var buttonList = document.createElement("li");
  cityButton.classList.add("btn", "btn-dark", "searchHistory");
  cityButton.innerHTML = cityName;
  if (cityName === "") {
    return;
  }

  cityButton.addEventListener("click", function() {
    // Fill out the user input form with the button's inner text
    userInput.value = cityName;
    
    // Call the getCity() function
    getCity(cityName);
  });

  cityPicker.appendChild(buttonList);
  buttonList.appendChild(cityButton);

  // Check if local storage is available
  if (typeof localStorage !== "undefined") {
    // Save the list of buttons to local storage
    var buttons = JSON.parse(localStorage.getItem("cityButtons")) || [];
    buttons.push(cityName);
    localStorage.setItem("cityButtons", JSON.stringify(buttons));
  }
}
  