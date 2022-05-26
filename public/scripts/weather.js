
/**
 * Makes an API call using the LatLang object referenced by the Google Map API.
 * @param {*} latlng provided by the Geolocation API, contains user's latitude and longitude.
 */
function getWeather(latlng) {
  const lat = latlng.lat;
  const long = latlng.lng;

  const key = '01a2ba83bf76f2ed62c6a9cc680e3c6f';
  const lang = 'en';
  const units = 'metric';
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}&units=${units}&lang=${lang}`;

  /**
   * The fetch request to request the user's locational weather data which can then be displayed to the user.
   */
  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        console.log(resp.statusText);
      } else {
        return resp.json();
      }
    })
    .then(data => {
      showWeather(data);
    })
    .catch(console.err);
}

/**
 * Takes in the data from the open weatherAPi and inserts an HTML element with the info.
 * @param {*} data provided by the OpenWeatherApi upon API call.
 */
function showWeather(data) {
  const currentDay = document.getElementById('forecast');

  // TO make sure that the user is only shown the weekly weather forecast. 
  currentDay.innerHTML = data.daily.map((day, idx) => {
    if (idx <= 6) {
      let dt = new Date(day.dt * 1000).toDateString();
      return (
        `<div class = "box">
        <div class = "day">${dt}</div>
        <img class = "weatherImg" src = "https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt = "https://openweathermap.org/img/wn/${
          day.weather[0].description}">
        <div class = "dayTemp">Temp: ${day.temp.day}&deg;C</div>
        <div class = "feelsLike">Feels Like: ${day.feels_like.day}&deg;C</div>
        <div class = "humidity">Humidity: ${day.humidity}%</div>

      </div>`);
    }
  }).join(' ');

}
