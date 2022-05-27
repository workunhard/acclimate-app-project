ready(function () {

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


	// });
}
);

function ready(callback) {
	if (document.readyState != "loading") {
		callback();
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
}
