/**
<<<<<<< HEAD
 * Pulls relevant user info (name, email and password) and inserts them into profile.html to display
 * for the user to view or edit. Event listeners are added to each field which have edit functions
 * assigned to them.
=======
 * 
>>>>>>> eafeabcdd6b46bac140a1b579e461c8314503d56
 */
function getUserInfo() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                let data = JSON.parse(this.responseText);
                let user = data.profile;
                if (data.status == "success") {

                    let str = `<caption>Profile Info</caption>
                        <tr>
                            <th class="name_header"><span>Name</span></th>
                            <td class='name'><span>${user.name}</span></td>
                        </tr>
                        <tr>
                            <th class="email_header"><span>Email</span></th>
                            <td class='email'><span>${user.email}</span></td>
                        </tr>
                        <tr>
                            <th class="password_header"><span>Password</span></th>
                            <td class='password'><span>${user.password}</span></td>
                        </tr>`;
                    document.getElementById("userInfo").innerHTML = str;

                    let records = document.querySelectorAll("td[class='email'] span");
                    for (let j = 0; j < records.length; j++) {
                        records[j].addEventListener("click", editCellEmail);
                    }
                    let userRecords = document.querySelectorAll("td[class='name'] span");
                    for (let k = 0; k < userRecords.length; k++) {
                        userRecords[k].addEventListener("click", editCellName);
                    }

                    let userPassword = document.querySelectorAll("td[class='password'] span");
                    for (let i = 0; i < userPassword.length; i++) {
                        userPassword[i].addEventListener("click", editCellPassword);
                    }


                } else {
                    console.log("Error!");
                }
            } else {

                console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-userInfo");
    xhr.send();
}
getUserInfo();

/**
 * 
 * @param {*} e 
 */
function editCellEmail(e) {

    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        if (e.which == 13) {
            var result = window.confirm("Are you sure?");
            if (result == true) {
                v = input.value;
                let newSpan = document.createElement("span");
                newSpan.innerHTML = v;
                parent.innerHTML = "";
                parent.appendChild(newSpan);
                let dataToSend = {
                    email: v
                };

                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (this.readyState == XMLHttpRequest.DONE) {

                        if (xhr.status === 200) {
                            getUserInfo();


                        } else {

                            console.log(this.status);

                        }

                    } else {
                        console.log("ERROR", this.status);
                    }
                }
                xhr.open("POST", "/update-userEmail");
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send("id=" + dataToSend.id + "&email=" + dataToSend.email);

            }
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

/**
 * 
 * @param {*} e 
 */
function editCellName(e) {
    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        if (e.which == 13) {
            var result = window.confirm("Are you sure?");
            if (result == true) {
                v = input.value;
                let newSpan = document.createElement("span");
                newSpan.innerHTML = v;
                parent.innerHTML = "";
                parent.appendChild(newSpan);
                let dataToSend = {
                    name: v
                };

                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            getUserInfo();
                        } else {
                            console.log(this.status);
                        }
                    } else {
                        console.log("ERROR", this.status);
                    }
                }
                xhr.open("POST", "/update-userName");
                xhr.setRequestHeader('X-RequeSsted-With', 'XMLHttpRequest');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send("&name=" + dataToSend.name);
            }
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

/**
 * 
 * @param {*} e 
 */
function editCellPassword(e) {

    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        if (e.which == 13) {
            var result = window.confirm("Are you sure?");
            if (result == true) {
                v = input.value;
                let newSpan = document.createElement("span");
                newSpan.innerHTML = v;
                parent.innerHTML = "";
                parent.appendChild(newSpan);
                let dataToSend = {
                    password: v
                };

                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (this.readyState == XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            getUserInfo();
                        } else {
                            console.log(this.status);
                        }
                    } else {
                        console.log("ERROR", this.status);
                    }
                }
                xhr.open("POST", "/update-userPassword");
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send("id=" + dataToSend.id + "&password=" + dataToSend.password);

            }
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}