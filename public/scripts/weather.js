


function getWeather() {
  const lat = posOutside.lat;
  const long = posOutside.lng;

  const key = '01a2ba83bf76f2ed62c6a9cc680e3c6f';
  const lang = 'en';
  const units = 'metrics';
  let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${key}&units=${units}&lang=${lang}`;


  fetch(url)
    .then(resp=> {
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
  $("#forecast").load('/text/weather.html');
  // let {sunrise, sunset, temp, }
}
