ready(function () {

	function ajaxGET(url, callback) {

		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
				//console.log('responseText:' + xhr.responseText);
				callback(this.responseText);

			} else {
				console.log(this.status);
			}
		}
		xhr.open("GET", url);
		xhr.send();
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

	
	document.querySelector("#submit").addEventListener("click", function (e) {
		e.preventDefault();
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


	document.querySelector("#signUp").addEventListener("click", function (e) {
		e.preventDefault();
		$('#inputBox').load('/text/signup.html');
		const button = document.getElementById('submit');
		button.value = "Sign-Up";
		button.id = "signupsubmission";

		document.querySelector("#signupsubmission").addEventListener("click", function (e) {
			e.preventDefault();
			let name = document.getElementById("nameSignup");
			let email = document.getElementById("emailSignup");
			let password = document.getElementById("passwordSignup");
			let cpassword = document.getElementById("cpasswordSignup");
			let queryString = "name=" + name.value + "&email=" + email.value + "&password=" + password.value + "&cpassword=" + cpassword.value + "&admin=" + 0;

			ajaxPOST("/create-user", function (data) {

				if (data) {
					let dataParsed = JSON.parse(data);
					console.log(dataParsed);
					if (dataParsed.status == "fail") {
						document.getElementById("serverMsg").innerHTML = dataParsed.msg;
						return;
					} else {
						window.location.replace("/");
					}
				}
			}, queryString);
		});
	});

	

});

function ready(callback) {
	if (document.readyState != "loading") {
		callback();
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
}
