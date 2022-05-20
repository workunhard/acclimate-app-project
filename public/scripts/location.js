// let watchID = 0;

// function success(position) {
//   const latitude = position.coords.latitude;
//   const longitude = position.coords.longitude;
//   initMap(latitude,longitude);

//   console.log("Lat: " + latitude + "Long: " + longitude);
// }

// function error() {
//   console.log("Couldn't get the coordinates");
//   // Later add code to ask user to manually input their address if they don't allow tracking.
// }

// if (!navigator.geolocation) {
//   console.log("Please allow the location permission");
// } else {
//   watchID = navigator.geolocation.watchPosition(success, error);
// }

// function initMap(latitude, longitude) {
//   const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 8,
//     center: {lat: latitude, lng: longitude},
//   });
//   const geocoder = new google.maps.Geocoder();
//   const infowindow = new google.maps.InfoWindow();

//   reverseGeocoding(geocoder,map,infowindow,latitude,longitude)
// } 

// function reverseGeocoding(geocoder, map, infowindow, latitude, longitude) {
//   const latlng = {
//     lat: parseFloat(latitude),
//     lng: parseFloat(longitude)
//   };

//   geocoder.geocode({location: latlng})
//   .then((response)=> {
//     if (response.results[0]) {
//       map.setZoom(11);

//       const marker = new google.maps.Marker({
//         position: latlng,
//         map: map,
//       });

//       infowindow.setContent(response.results[0].formatted_address);
//       infowindow.open(map, marker);
//     } else {
//       console.log("No results found");
//     }
//   })
//   .catch((e)=> console.log("Failed due to :" + e));

// }

// window.initMap = initMap;

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.


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
initMap();
// window.initMap = initMap;

