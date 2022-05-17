const successCallback = position => console.log(position);
const errorCallback = err => console.log(err);


navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

