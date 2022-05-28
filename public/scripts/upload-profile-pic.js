/**
 * Adds an event listener to the submit input of the form with the id
 * "upload-images-form" to invoke the uploadImages function on click.
 */
const upLoadForm = document.getElementById("upload-images-form");
upLoadForm.addEventListener("submit", uploadImages);

/**
 * Function which will take the uploaded file and send it to the /upload-images server path
 * to be stored into the database.
 */
function uploadImages(e) {
    e.preventDefault();
    
    var result = window.confirm("Are you sure?");
            if (result == true) {
    const imageUpload = document.querySelector('#image-upload');
    const formData = new FormData();

    for (let i = 0; i < imageUpload.files.length; i++) {
        formData.append("files", imageUpload.files[i]);
    }
    const options = {
        method: 'POST',
        body: formData,
    };
    fetch("/upload-images", options).then(function (res) {
        console.log(res);
    }).catch(function (err) {
        ("Error:", err);
    });
    setTimeout(function () {
        window.location.reload();
    }, 3000);
}
window.onload = function () {
    if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
}
};