const upLoadForm = document.getElementById("upload-timeline-form");
upLoadForm.addEventListener("submit", uploadTimeline);

function uploadTimeline(e) {
  e.preventDefault();

  const imageUpload = document.querySelector('#timeline-upload');
  const formData = new FormData();

  for (let i = 0; i < imageUpload.files.length; i++) {
    // put the images from the input into the form data
    formData.append("timeline", imageUpload.files[i]);
  }
  const options = {
    method: 'POST',
    body: formData,
  };
  fetch("/upload-timeline", options).then(function (res) {
    console.log(res);
  }).catch(function (err) {
    ("Error:", err)
  });
}

function getDescription(e) {
  e.preventDefault();

  const imageUpload = document.querySelector('#timeline-upload');
  var myContent = tinymce.get("description").getContent();

  let formData = {
    description: myContent,
  }

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
  xhr.open("POST", "/upload-timeline");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send("description=" + formData.description);
}