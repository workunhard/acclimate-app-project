let watchID = 0;

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  console.log("Lat: " + latitude + "Long: " + longitude);
}

function error() {
  console.log("Couldn't get the coordinates");
  // Later add code to ask user to manually input their address if they don't allow tracking.
}

if (!navigator.geolocation) {
  console.log("Please allow the location permission");
} else {
  watchID = navigator.geolocation.watchPosition(success, error);
}

function initMap(latitude, longitude) {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: {lat: latitude, lng: longitude},
  });
  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();

  reverseGeocoding(geocoder,map,infowindow,)
} 

function reverseGeocoding(geocoder, map, infowindow, coord) {
  const input = coord;
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1])
  };

  geocoder.geocode({location: latlng})
  .then((response)=> {
    if (response.results[0]) {
      map.setZoom(11);

      const marker = new google.maps.Marker({
        position: latlng,
        map: map,
      });

      infowindow.setContent(response.results[0].formatted_address);
      infowindow.open(map, marker);
    } else {
      console.log("No results found");
    }
  })
  .catch((e)=> console.log("Failed due to :" + e));

}

window.initMap = initMap;