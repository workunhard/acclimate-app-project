
let map, infoWindow;

// To allow the coordinates to be used by the openWeather API.
let posOutside = {lat: 0, lng:0}; 


/**
 * 
 */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 13,
  });
  infoWindow = new google.maps.InfoWindow();


  // window.onload = () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          posOutside = structuredClone(pos);
          getWeather();
          console.log(posOutside.lat + "  " + posOutside.lng);
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  // };
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

