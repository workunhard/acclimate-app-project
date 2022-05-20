let deletePosts = document.querySelectorAll("td[class='deletePost']");
for (let i = 0; i < deletePosts.length; i++) {
    deletePosts[i].addEventListener("click", deletePost);
}

function refreshTimeline() {
        document.location.reload();
}

function deletePost(e) {

    e.preventDefault();
    let parent = e.target.parentNode;

    let formData = { imageID: parent.parentNode.querySelector(".imageID").innerHTML }

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
    }
    xhr.open("POST", "/delete-post");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send("imageID=" + formData.imageID);
}

let image = document.querySelectorAll("td[class='confirmImage']");
for (let i = 0; i < image.length; i++) {
    image[i].addEventListener("click", updateImage);
}

function updateImage(e) {
    e.preventDefault();
    let parent = e.target.parentNode;
  
    const imageUpload = document.querySelector('#image-upload');
    let formData = new FormData();
  
      for (let i = 0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("timeline", imageUpload.files[i]);
      }
    
    formData.append("imageID", parent.parentNode.querySelector(".imageID").innerHTML)
    const options = {
      method: 'POST',
      body: formData
    };
  
    fetch("/update-image", options).then(function (res) {
      console.log(res);
    }).catch(function (err) {
      ("Error:", err)
    });
    window.location.replace("/dashboard");
  }

window.onload = function() {
	if(!window.location.hash) {
		window.location = window.location + '#loaded';
		window.location.reload();
	}
}

// let editPosts = document.querySelectorAll("td[class='editPost']");
// for (let i = 0; i < editPosts.length; i++) {
//     editPosts[i].addEventListener("click", editPost);
// }

// function editPost() {
//     window.location.replace("/edit-post");
// }


