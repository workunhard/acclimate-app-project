var loginInput = document.getElementById("login");
var regInput = document.getElementById("register");

var logTabI = document.getElementById("lt");
var regTabI = document.getElementById("rt");


/**
 * Changes the visibility of the login form.
 */
function loginTab() {
  event.preventDefault();
  regInput.style.visibility = "hidden";
  loginInput.style.visibility = "visible";
  console.log("logintab");
}

/**
 * Changes the visibility of the register form.
 */
function registerTab() {
  event.preventDefault()
  regInput.style.visibility = "visible";
  loginInput.style.visibility = "hidden";
  console.log("registertab");
}


document.addEventListener("keyup", function (e) {
  if (e.which == 13) {
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let emailEntry = email ? email.value : null;
    let passwordEntry = password ? password.value : null;

    let queryString = "email=" + emailEntry + "&password=" + passwordEntry;

    ajaxPOST("/login", function (data) {

      if (data) {
        let dataParsed = JSON.parse(data);
        console.log(dataParsed);
        if (dataParsed.status == "fail") {
          document.getElementById("serverMsg").innerHTML = dataParsed.msg;
        } else {
          window.location.replace("/dashboard");
        }
      }

    }, queryString);
  }
});


document.querySelector("#signin").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Login Attempt");

  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let emailEntry = email ? email.value : null;
  let passwordEntry = password ? password.value : null;

  let queryString = "email=" + emailEntry + "&password=" + passwordEntry;

  ajaxPOST("/login", function (data) {

    if (data) {
      let dataParsed = JSON.parse(data);
      console.log(dataParsed);
      if (dataParsed.status == "fail") {
        document.getElementById("serverMsg").innerHTML = dataParsed.msg;
      } else {
        window.location.replace("/dashboard");
      }
    }
  }, queryString);
});


document.querySelector("#signup").addEventListener("click", function (e) {
  e.preventDefault();
  console.log("Sign up");

  let name = document.getElementById("rname");
  let email = document.getElementById("remail");
  let password = document.getElementById("rpassword");
  let cpassword = document.getElementById("rcpassword");
  let queryString = "name=" + name.value + "&email=" + email.value + "&password=" + password.value + "&cpassword=" + cpassword.value + "&admin=" + 0;

  ajaxPOST("/create-user", function (data) {

    if (data) {
      let dataParsed = JSON.parse(data);
      console.log(dataParsed);
      if (dataParsed.status == "fail") {
        document.getElementById("serverMsgReg").innerHTML = dataParsed.msg;
        return;
      } else {
        window.location.replace("/dashboard");
      }
    }
  }, queryString);
});

/**
 * 
 * @param {*} url 
 * @param {*} callback 
 */
function ajaxGET(url, callback) {

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      callback(this.responseText);

    } else {
      console.log(this.status);
    }
  };
  xhr.open("GET", url);
  xhr.send();
}

/**
 * 
 * @param {*} url 
 * @param {*} callback 
 * @param {*} data 
 */
function ajaxPOST(url, callback, data) {

  let params = typeof data == 'string' ? data : Object.keys(data).map(
    function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }
  ).join('&');
  console.log("params in ajaxPOST", params);

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      callback(this.responseText);
    } else {
      console.log(this.status);
    }
  };
  xhr.open("POST", url);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
}

