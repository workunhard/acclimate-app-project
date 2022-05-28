
/**
 * This function makes a request to the DB to get all user information stored and populate it 
 * into a table for the administrator to view every user's ID, name, email, password and if 
 * they are classified as an admin or regular user. Also attaches event listeners for their
 * respective edit functions for each field.
 */
function getUsers() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {

                let data = JSON.parse(this.responseText);
                if (data.status == "success") {

                    let str = `<caption>Administrator View</caption><tr>
<th class="id_header"><span>ID</span></th>
<th class="name_header"><span>Name</span></th>
<th class="email_header"><span>Email</span></th>
<th class="password_header"><span>Password</span></th>
<th class="admin_header">Admin</th>
<th class="delete_header">Delete</th>
</tr>`;

                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        str += ("<tr><td class='id'>" +
                            row.ID + "</td><td class='name'><span>" +
                            row.name + "</span></td><td class='email'><span>" +
                            row.email + "</span></td><td class='password'><span>" +
                            row.password + "</span></td><td class='admin'><span>" +
                            row.admin +
                            "</span></td><td class ='delete'><input type='button' id='delete' value='Delete'></td></tr>");
                    }
                    document.getElementById("adminArea").innerHTML = str;

                    let records = document.querySelectorAll("td[class='email'] span");
                    for (let j = 0; j < records.length; j++) {
                        records[j].addEventListener("click", editCellEmail);
                    }
                    let userRecords = document.querySelectorAll("td[class='name'] span");
                    for (let k = 0; k < userRecords.length; k++) {
                        userRecords[k].addEventListener("click", editCellName);
                    }
                    let deleteRecords = document.querySelectorAll("td[class='delete']");
                    for (let i = 0; i < deleteRecords.length; i++) {
                        deleteRecords[i].addEventListener("click", deleteUser);
                    }
                    let userPassword = document.querySelectorAll("td[class='password'] span");
                    for (let i = 0; i < userPassword.length; i++) {
                        userPassword[i].addEventListener("click", editCellPassword);
                    }
                    let userAdmin = document.querySelectorAll("td[class='admin'] span");
                    for (let i = 0; i < userAdmin.length; i++) {
                        userAdmin[i].addEventListener("click", editCellAdmin);
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
    };
    xhr.open("GET", "/get-users");
    xhr.send();
}
getUsers();

/**
 * Edits a user's emails while keeping track of the id and username of that user on the same row so that information 
 * is not lost. sends the updated email information to the server to update.
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
                id: parent.parentNode.querySelector(".id").innerHTML,
                name: parent.parentNode.querySelector(".name").innerHTML,
                email: v
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
            };
            xhr.open("POST", "/update-email");
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
 * Edits a user's name and sends the updated user's name to the server to update into the database.
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
            };
            xhr.open("POST", "/update-name");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&name=" + dataToSend.name);

        }
    }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

/**
 * Updates a user's password and sends this information to the database for update.
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
            };
            xhr.open("POST", "/update-password");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&password=" + dataToSend.password);

        }}
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}

/**
 * Edits and updates the user's permissions to set them as as administrator user(1) or
 * a regular user(0). Sends this information back to the database for update after.
 * @param {*} e 
 */
function editCellAdmin(e) {

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
            };
            xhr.open("POST", "/update-admin");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("id=" + dataToSend.id + "&admin=" + dataToSend.admin);
        }}
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}

/**
 * Adds a user to the database after clicking on the submit button.
 */
document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();

    var result = window.confirm("Are you sure?");
            if (result == true) {
    let formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        admin: document.querySelector('input[name="admin"]:checked').value
    };
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";

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
    };
    xhr.open("POST", "/add-user");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("name=" + formData.name + "&email=" + formData.email + "&password=" + formData.password + "&admin=" + formData.admin);
    window.location.replace("/dashboard");
}
});

/**
 * Deletes a user from the database.
 * @param {*} e 
 */
function deleteUser(e) {
    e.preventDefault();
    var result = window.confirm("Are you sure?");
            if (result == true) {
    let parent = e.target.parentNode;
    let formData = {
        id: parent.parentNode.querySelector(".id").innerHTML
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
    };
    xhr.open("POST", "/delete-user");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("id=" + formData.id);
}}

let posts = document.querySelectorAll("td[class='deletePost']");
for (let i = 0; i < posts.length; i++) {
    posts[i].addEventListener("click", deletePost);
}

/**
 * Deletes a timeline post.
 * @param {*} e 
 */
function deletePost(e) {
    e.preventDefault();
    var result = window.confirm("Are you sure?");
    if (result == true) {
    let parent = e.target.parentNode;

    let formData = {
        imageID: parent.parentNode.querySelector(".imageID").innerHTML
    };

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                document.location.reload();
            } else {
                console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    };
    xhr.open("POST", "/delete-post");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("imageID=" + formData.imageID);
    window.location.replace("/dashboard");
    window.onload = function () {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    };
}}

let text = document.querySelectorAll("td[class='description'] span");
for (let i = 0; i < text.length; i++) {
    text[i].addEventListener("click", editDescription);
}

/**
 * Edits the post's description.
 * @param {*} e 
 */
function editDescription(e) {

    let spanText = e.target.innerHTML;
    let parent = e.target.parentNode;

    let input = document.createElement("input");

    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let v = null;

        if (e.which == 13) {
            var result = window.confirm("Are you sure?");
            if (result == true) {
            str = "Enter description here";
            if (input.value === null || input.value.match(/^[\s\n\r]*$/) !== null) {
                v = str;
            } else {
                v = input.value;
            }
            let newSpan = document.createElement("span");


            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                imageID: parent.parentNode.querySelector(".imageIDdescription").innerHTML,
                description: v
            };

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (xhr.status === 200) { } else {
                        console.log(this.status);
                    }
                } else {
                    console.log("ERROR", this.status);
                }
            };
            xhr.open("POST", "/update-description");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send("&description=" + dataToSend.description + "&imageID=" + dataToSend.imageID);
            window.location.replace("/dashboard");
            window.onload = function () {
                if (!window.location.hash) {
                    window.location = window.location + '#loaded';
                    window.location.reload();
                }
            };
        }}
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

let deleteImages = document.querySelectorAll("td[class='deleteImage']");
for (let i = 0; i < deleteImages.length; i++) {
    deleteImages[i].addEventListener("click", deleteImage);
}

/**
 * Deletes the image associated with the post keeping everything else in tact.
 * @param {*} e 
 */
function deleteImage(e) {

    e.preventDefault();
    var result = window.confirm("Are you sure?");
    if (result == true) {
    let parent = e.target.parentNode;

    let formData = {
        imageID: parent.parentNode.querySelector(".imageID").innerHTML
    };

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) { } else {
                console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    };
    xhr.open("POST", "/delete-image");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("imageID=" + formData.imageID);
    window.location.replace("/dashboard");
    window.onload = function () {
        if (!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
    };
}}


let confirmImages = document.querySelectorAll("td[class='confirmImage']");
for (let i = 0; i < confirmImages.length; i++) {
    confirmImages[i].addEventListener("click", updateImage);
}

/**
 * Allows the user to change the image associated with a particular user's post.
 * @param {*} e 
 */
function updateImage(e) {
    e.preventDefault();
    var result = window.confirm("Are you sure?");
    if (result == true) {
    let parent = e.target.parentNode;

    const imageUpload = document.querySelector('#image-upload');
    let formData = new FormData();

    for (let i = 0; i < imageUpload.files.length; i++) {
        formData.append("timeline", imageUpload.files[i]);
    }

    formData.append("imageID", parent.parentNode.querySelector(".imageID").innerHTML);
    const options = {
        method: 'POST',
        body: formData
    };

    fetch("/update-image", options).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        ("Error:", err);
    });
    loader();
    setTimeout(function () {
        window.location.href = "/dashboard";
      }, 3000);
}}

function loader() {
    document.getElementById("loadAnimation").innerHTML =
        '<div class=\"loader-wrapper\"><span class=\"loader\"><span class=\"loader-inner\"></span></span></div>'
}