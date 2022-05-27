var loginInput = document.getElementById("login");
var regInput = document.getElementById("register");

var logTabI = document.getElementById("lt");
var regTabI = document.getElementById("rt");



function loginTab() {
  event.preventDefault();
  regInput.style.visibility = "hidden";
  loginInput.style.visibility = "visible";
  console.log("logintab");
}

function registerTab() {
  event.preventDefault()
  regInput.style.visibility = "visible";
  loginInput.style.visibility = "hidden";
  console.log("registertab");
}

// document.querySelector("#signin").addEventListener("click", function (e) {
//   e.preventDefault();
//   console.log("Login Attempt");

//   let email = document.getElementById("email");
//   let password = document.getElementById("password");
//   let emailEntry = email ? email.value : null;
//   let passwordEntry = password ? password.value : null;

//   let queryString = "email=" + emailEntry + "&password=" + passwordEntry;

//   ajaxPOST("/login", function (data) {

//     if (data) {
//       let dataParsed = JSON.parse(data);
//       console.log(dataParsed);
//       if (dataParsed.status == "fail") {
//         document.getElementById("serverMsg").innerHTML = dataParsed.msg;
//       } else {
//         window.location.replace("/dashboard");
//       }
//     }
//   }, queryString);
// });

// document.querySelector("#signUp").addEventListener("click", function (e) {
//   e.preventDefault();
//   console.log("Sign up");
//   $('#inputBox').load('/text/signup.html');
//   const button = document.getElementById('signup');
//   // button.value = "Sign-Up";
//   button.id = "signupsubmission";

//   // document.querySelector("#signupsubmission").addEventListener("click", function (e) {
//   // 	e.preventDefault();
//   // 	console.log("Sign up submission");
//     let name = document.getElementById("nameSignup");
//     let email = document.getElementById("emailSignup");
//     let password = document.getElementById("passwordSignup");
//     let cpassword = document.getElementById("cpasswordSignup");
//     let queryString = "name=" + name.value + "&email=" + email.value + "&password=" + password.value + "&cpassword=" + cpassword.value + "&admin=" + 0;

//     ajaxPOST("/create-user", function (data) {

//       if (data) {
//         let dataParsed = JSON.parse(data);
//         console.log(dataParsed);
//         if (dataParsed.status == "fail") {
//           document.getElementById("serverMsg").innerHTML = dataParsed.msg;
//           return;
//         } else {
//           // window.location.replace("/");
//         }
//       }
//     }, queryString);
//   });