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