function getWeather(latlng) {
  const lat = latlng.lat;
  const long = latlng.lng;
  console.log(lat + " " + long);

  const key = '01a2ba83bf76f2ed62c6a9cc680e3c6f';
  const lang = 'en';
  const units = 'metric';
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}&units=${units}&lang=${lang}`;


  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        console.log(resp.statusText);
      } else {
        return resp.json();
      }
    })
    .then(data => {
      console.log(data);
      showWeather(data);
    })
    .catch(console.err);


}

function showWeather(data) {
  // $("#forecast").load('/text/weather.html');
  // let {temp, feels_like, humidity, wind_speed } = data.current;
  const currentDay = document.getElementById('forecast');

  currentDay.innerHTML = data.daily.map((day, idx) => {
    if (idx <= 6) {
      let dt = new Date(day.dt * 1000).toDateString();
      let sr = new Date(day.sunrise * 1000).toLocaleTimeString();
      let ss = new Date(day.sunset * 1000).toLocaleTimeString();
      return (
        `<div class = "box">
        <div class = "day">${dt}</div>
        <img class = "weatherImg" src = "http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt = "http://openweathermap.org/img/wn/${
          day.weather[0].description}">
        <div class = "dayTemp">Temp: ${day.temp.day}&deg;C</div>
        <div class = "feelsLike">Feels Like: ${day.feels_like.day}&deg;C</div>
        <div class = "humidity">Humidity: ${day.humidity}%</div>

      </div>`);
    }
  }).join(' ');

}
