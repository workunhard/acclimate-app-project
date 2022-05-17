function getUserInfo() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                let data = JSON.parse(this.responseText);
                if (data.status == "success") {

                    let str = `<caption>User Profile View</caption><tr>
<th class="name_header"><span>Name</span></th>
<th class="email_header"><span>Email</span></th>
<th class="password_header"><span>Password</span></th>
</tr>`;


                    // for (let i = 0; i < data.rows.length; i++) {
                    //     let row = data.rows[i];
                        //console.log("row", row);
                        str += ("<tr><td class='name'><span>" + data.name +
                            "</span></td><td class='email'><span>" +
                            data.email + "</span></td><td class='password'><span>" + 
                            data.password + "</span></td></tr>");
                    // }
                    //console.log(str);
                    document.getElementById("userInfo").innerHTML = str;

                    // select all spans under the email class of td elements
                    let records = document.querySelectorAll("td[class='email'] span");
                    for (let j = 0; j < records.length; j++) {
                        records[j].addEventListener("click", editCellEmail);
                    }
                    let userRecords = document.querySelectorAll("td[class='name'] span");
                    for (let k = 0; k < userRecords.length; k++) {
                        userRecords[k].addEventListener("click", editCellName);
                    }
                    // let deleteRecords = document.querySelectorAll("td[class='delete']");
                    // for (let i = 0; i < deleteRecords.length; i++) {
                    //     deleteRecords[i].addEventListener("click", deleteUser);
                    // }
                    let userPassword = document.querySelectorAll("td[class='password'] span");
                    for (let i = 0; i < userPassword.length; i++) {
                        userPassword[i].addEventListener("click", editCellPassword);
                    }
                    // let userAdmin = document.querySelectorAll("td[class='admin'] span");
                    // for (let i = 0; i < userAdmin.length; i++) {
                    //     userAdmin[i].addEventListener("click", editCellAdmin);
                    // }

                } else {
                    console.log("Error!");
                }
            } else {

                // not a 200, could be anything (404, 500, etc.)
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

function editCellEmail(e) {

    // add a listener for clicking on the field to change email
    // span's text
    let spanText = e.target.innerHTML;
    // span's parent (td)
    let parent = e.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        // pressed enter
        if (e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            // have to wire an event listener to the new element
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                id: parent.parentNode.querySelector(".id").innerHTML,
                name: parent.parentNode.querySelector(".name").innerHTML,
                email: v
            };

            // now send
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {

                    // 200 means everthing worked
                    if (xhr.status === 200) {
                        // document.getElementById("status").innerHTML = "Record updated.";
                        getUsers();


                    } else {

                        // not a 200, could be anything (404, 500, etc.)
                        console.log(this.status);

                    }

                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-email");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&email=" + dataToSend.email);

        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}

function editCellName(e) {

    // add a listener for clicking on the field to change email
    // span's text
    let spanText = e.target.innerHTML;
    // span's parent (td)
    let parent = e.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        // pressed enter
        if (e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            // have to wire an event listener to the new element
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                id: parent.parentNode.querySelector(".id").innerHTML,
                name: v,
                email: parent.parentNode.querySelector(".email").innerHTML
            };

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        getUsers();
                    } else {
                        console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-name");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&name=" + dataToSend.name);

        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}

function editCellPassword(e) {

    // add a listener for clicking on the field to change email
    // span's text
    let spanText = e.target.innerHTML;
    // span's parent (td)
    let parent = e.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        // pressed enter
        if (e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            // have to wire an event listener to the new element
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                id: parent.parentNode.querySelector(".id").innerHTML,
                name: parent.parentNode.querySelector(".name").innerHTML,
                email: parent.parentNode.querySelector(".email").innerHTML,
                password: v
            };

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        getUsers();
                    } else {
                        console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-password");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&password=" + dataToSend.password);

        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}


function editCellAdmin(e) {

    // add a listener for clicking on the field to change email
    // span's text
    let spanText = e.target.innerHTML;
    // span's parent (td)
    let parent = e.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;
        // pressed enter
        if (e.which == 13) {
            v = input.value;
            let newSpan = document.createElement("span");
            // have to wire an event listener to the new element
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                id: parent.parentNode.querySelector(".id").innerHTML,
                name: parent.parentNode.querySelector(".name").innerHTML,
                email: parent.parentNode.querySelector(".email").innerHTML,
                password: parent.parentNode.querySelector(".password").innerHTML,
                admin: v
            };

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        getUsers();
                    } else {
                        console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-admin");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&admin=" + dataToSend.admin);
        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}

//Add user
document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    let formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        admin: document.querySelector('input[name="admin"]:checked').value
    }
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {
                getUsers();
            } else {
                console.log(this.status);
            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/add-user");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("name=" + formData.name + "&email=" + formData.email + "&password=" + formData.password + "&admin=" + formData.admin);

})

function deleteUser(e) {

    e.preventDefault();
    let parent = e.target.parentNode;
    let formData = { id: parent.parentNode.querySelector(".id").innerHTML }

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                getUsers();
            } else {
                console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("POST", "/delete-user");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("id=" + formData.id);
}
