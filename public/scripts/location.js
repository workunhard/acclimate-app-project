var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC5Z5HTQx6KUfp-isvrs8orgQc5a3KAUWQ&callback=initLocation';
script.async = true;
script.defer = true;


/**
 * Makes a call to the Geolocation API to find user's coordinates.
 */
window.initLocation = function initLocation() {
  var geoOptions = {
    maximumAge: 5*60*1000,
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let queryString = "lat=" + position.coords.latitude + "&lng=" + position.coords.longitude;
        ajaxPOST("/location", function (data) {
          if (data) {
            let dataParsed = JSON.parse(data);
            if (dataParsed.status == "fail") {
              console.log("Location Error");
            }
          }
        }, queryString);
        initMap();
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }, geoOptions);
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// Appends the current script file to the appropriate HTML page. 
document.head.appendChild(script);

/**
 * The map object: to allow manipulation of the map throughout the file. 
 */
let map;

/**
 * The info window: Will show details of the current marker. 
 */
let infoWindow;

/**
 * Initializes the map object (from google maps) and uses a GET request to receive user's coordinates.
 * Upon receiving the coordinates, it makes a call to the Openweather API to provide it with the user's coordinates.
 * Also initializes all of the markers on the map via a GET request to receive any timeline info that must be marked. 
 */
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 13,
  });

  // To get the user's coordinates at the current time. 
  ajaxGET("/coords", function (data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      let pos = {
        lat: parseFloat(dataParsed.lat),
        lng: parseFloat(dataParsed.lng),
      }
      // Sends the coordinates to the OpenWeather API so that the weather data may be populated.
      getWeather(pos);

      // Center the map on the user's location.
      map.setCenter(pos);

      //To receive any and all posts made by users.

      ajaxGET("/timeline", function (data) {
        if (data) {
          let dataParsed = JSON.parse(data);

          // Gets the timeline posts and creates a marker for each result received. 

          dataParsed.rows.forEach(results => {
            var title = results.description;
            var pos = new google.maps.LatLng(results.lat, results.lng);
            console.log(results);
            // The HTML template to be injected into the info window.


            var content = "<div id=\"card\">" +
            `<h3>Posted by @${results?.name} on ${results?.date} at ${results?.time}</h3>` +
            "<table><tr><td class='imageIDdescription'>" + results?.imageID + "</td></tr>" +
            "<tr class='description'><td class='description'><span>" + results?.description + "</span></td></tr></table>" +
            `${results?.filename ? ("<img id=\"photo\" src=\"profileimages/timeline/" + `${results.filename}` + "\"><br>") : ''}` + 
            "<br>" +
            "<table><tr><td class='imageID'>" + results?.imageID +
            "</td>" +
            "</tr></table><br>" +
            "</div><br>";
            createMarker(pos, map, title, content);
          });

            
          if (dataParsed.status == "fail") {
            console.log("Location error");
          }
        }
      })
    } else {
      console.log("error");
    }
  })
}

/**
 * Creates a marker in a map with an info window.
 * @param {*} location object containing the latitude and longitude of the user's location.
 * @param {*} map the map object upon which the marker will be shown ie Google Maps.
 * @param {*} title for the marker.
 * @param {*} content the HTML element to be displayed in the info window.
 */
function createMarker(location, map, title, content) {
  var marker = new google.maps.Marker({
    position: location,
    title: title,
    map: map,
  })
  var infoWindow = new google.maps.InfoWindow({
    content: content,
    maxWidth: 800,
  })

  marker.addListener("click", () => {
    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: true,
    })
    
  })
}


/**
 * Creates an HTTP POST request using AJAX and XHR.
 * @param {*} url the link on which the POST request is to be made.
 * @param {*} callback mehtod to call in case the request is successfull.
 * @param {*} data the data being sent in the POST request. 
 */
function ajaxPOST(url, callback, data) {

  let params = typeof data == 'string' ? data : Object.keys(data).map(
    function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
  ).join('&');

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

/**
 * Creates an HTTP GET request using AJAX and XHR.
 * @param {*} url the link on which the request is to be made
 * @param {*} callback method to call in case the request is successful. 
 */
function ajaxGET(url, callback) {

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
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

