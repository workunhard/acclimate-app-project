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
            if (dataParsed.status == "fail") {
              console.log("Location Error");
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

/**
 * 
 */
function initMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 13,
  });

  ajaxGET("/coords", function (data) {
    if (data) {
      let dataParsed = JSON.parse(data);
      let pos = {
        lat: parseFloat(dataParsed.lat),
        lng: parseFloat(dataParsed.lng),
      }

      getWeather(pos);

      map.setCenter(pos);
      ajaxGET("/timeline", function (data) {
        if (data) {
          let dataParsed = JSON.parse(data);
          dataParsed.rows.forEach(results => {
            var title = results.description;
            var pos = new google.maps.LatLng(results.lat, results.lng);
            var content = "<div id=\"card\">" +
            results.date + " " + results?.time + "<br>" +
            "<img id=\"photo\" src=\"profileimages/timeline/"
            + results?.filename + "\"><br>" +
            "<table><tr><td class='imageID'>" + results?.imageID +
            "</td></tr></table><br>" +
            "<table><tr><td class='imageIDdescription'>" + results?.imageID +
            "</td><td class='description'><span>" + results?.description + "</span></td></tr></table></div><br>"
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
      shouldFocus: false,
    })
  })
}



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

