var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC5Z5HTQx6KUfp-isvrs8orgQc5a3KAUWQ&callback=initLocation';
script.async = true;
script.defer = true;

window.initLocation = function initLocation() {


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let queryString = "lat=" + position.coords.latitude + "&lng=" + position.coords.longitude;
        ajaxPOST("/location", function (data) {
          if (data) {
            let dataParsed = JSON.parse(data);
            console.log(dataParsed);
            if (dataParsed.status == "fail") {
              console.log("Errrrrrrrr");
            }
          }
        }, queryString);
        initMap();
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}


document.head.appendChild(script);


let map, infoWindow;

// To allow the coordinates to be used by the openWeather API.



/**
 * 
 */
function initMap() {
  // let location = await initLocation();
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 13,
  });
  infoWindow = new google.maps.InfoWindow();

  ajaxGET("/coords", function (data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      const pos = {
        lat: parseFloat(dataParsed.lat),
        lng: parseFloat(dataParsed.lng),
      }
      // const coordinates = new google.maps.LatLng(pos.lat, pos.lng);
      // console.log(coordinates);
      getWeather(pos);
      infoWindow.setPosition(pos);
      infoWindow.setContent("Location found.");
      infoWindow.open(map);
      map.setCenter(pos);
    } else {
      console.log("error");
    }
  })
  // window.onload = () => {
  // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         posOutside = structuredClone(pos);
  //         // getWeather();
  //         console.log(posOutside.lat + "  " + posOutside.lng);
  //         infoWindow.setPosition(pos);
  //         infoWindow.setContent("Location found.");
  //         infoWindow.open(map);
  //         map.setCenter(pos);
  //       },
  //       () => {
  //         handleLocationError(true, infoWindow, map.getCenter());
  //       }
  //     );
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infoWindow, map.getCenter());
  //   }
  // // };


}



function ajaxPOST(url, callback, data) {

  let params = typeof data == 'string' ? data : Object.keys(data).map(
    function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');
  console.log("params in ajaxPOST", params);

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      callback(this.responseText);
    } else {
      console.log(this.status);
    }
  }
  xhr.open("POST", url);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
}

function ajaxGET(url, callback) {

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      console.log('responseText:' + xhr.responseText);
      callback(this.responseText);

    } else {
      console.log(this.status);
    }
  }
  xhr.open("GET", url);
  xhr.send();
}


/**
 * To handle any errors encountered in the geolocation API. 
 * @param {*} browserHasGeolocation Whether the user has granted permission for their location to be tracked. 
 * @param {*} infoWindow The default window displayed on top of the google maps. 
 * @param {*} pos The positions object containing the latitude and the longitude of the user. 
 */
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

