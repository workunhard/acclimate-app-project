/**
 * Selects all .deletePost elements and adds an on click
 * event listener which will invoke the deletePost function.
 */
let posts = document.querySelectorAll("td[class='deletePost']");
for (let i = 0; i < posts.length; i++) {
    posts[i].addEventListener("click", deletePost);
}

/**
 * Allows the user to delete the post specified and brings up a
 * confirmation window to confirm the delete. The id of the post is sent
 * server side to instruct the database to delete the specified post.
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
    }
}

/**
 * Selects all .description elements and adds an on click
 * event listener which will invoke the editDescription function.
 */
let text = document.querySelectorAll("td[class='description'] span");
for (let i = 0; i < text.length; i++) {
    text[i].addEventListener("click", editDescription);
}

/**
 * Allows the user to edit the description of a post specified and brings up a
 * confirmation window to confirm the change. The id and text of the post is sent
 * server side to instruct the database to modify the description with the specific id.
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
                    if (xhr.status === 200) {} else {
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
        }
    }
    });
    parent.innerHTML = "";
    parent.appendChild(input);
}

/**
 * Selects all .deleteImage elements and adds an on click
 * event listener which will invoke the deleteImage function.
 */
let deleteImages = document.querySelectorAll("td[class='deleteImage']");
for (let i = 0; i < deleteImages.length; i++) {
    deleteImages[i].addEventListener("click", deleteImage);
}

/**
 * Allows the user to delete the image of a post and brings up a
 * confirmation window to confirm the delete. The id of the post is sent
 * server side to instruct the database to remove the image given the id.
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
                if (xhr.status === 200) {} else {
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
    }
}

/**
 * Selects all .confirmImage elements and adds an on click
 * event listener which will invoke the updateImage function.
 */
let confirmImages = document.querySelectorAll("td[class='confirmImage']");
for (let i = 0; i < confirmImages.length; i++) {
    confirmImages[i].addEventListener("click", updateImage);
}

/**
 * Allows the user to update the image of a post and brings up a
 * confirmation window to confirm the update. The id of the post is sent
 * server side to instruct the database to update the image given the id.
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

/**
 * Function that inserts a loading animation into an element with the id "loadAnimation".
 */
function loader() {
    document.getElementById("loadAnimation").innerHTML =
        '<div class=\"loader-wrapper\"><span class=\"loader\"><span class=\"loader-inner\"></span></span></div>'
}