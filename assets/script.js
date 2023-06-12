var apiKey = "9457beb5d836209c93dec440f8a75d78"

var currentWeather = document.querySelector("#currentWeather");
var forecast = document.querySelector("#forecast");
var lat = 0;
var lon = 0;


function fetchCurrentWeather(){
     var apiUrl = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(apiUrl)
    .then(response => response.json())
    .then(data=> {
        currentWeather.textContent = data.main.temp;
    })
    .catch(error => {
        console.log(error);
    });
}
fetchCurrentWeather();