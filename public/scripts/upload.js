/**
 * Initializes the Tiny MCE into the textarea element with the id "description".
 */
tinymce.init({
  selector: '#description',
  height: 200,
  setup: function (editor) {
    editor.on('init', function () {
      this.setContent('<p>Write a caption..</p>');
      console.log(tinyMCE.activeEditor.getContent());
    });
  },
  theme: 'modern',
  plugins: [
    'code', 'lists',
    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
    'searchreplace wordcount visualblocks visualchars code fullscreen',
    'insertdatetime media nonbreaking save table contextmenu directionality',
    'emoticons template paste textcolor colorpicker textpattern imagetools'
  ],
  toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  toolbar2: 'print preview media | forecolor backcolor emoticons',
  image_advtab: true
});

/**
 * Adds an event listener to the element with the id "uploadbox" which will invoke the cleanUp function
 * when clicked.
 */
document.getElementById("uploadbox").addEventListener("click", cleanUp);

/**
 * Function which clears the text area when the element with the id "uploadbox" is clicked.
 */
function cleanUp() {
  tinymce.activeEditor.setContent('');
  document.getElementById("uploadbox").removeEventListener("click", cleanUp);
}

/**
 * Adds an event listener to the input element with the id "submit" which will invoke the 
 * uploadTimeline function when clicked.
 */
document.getElementById("submit").addEventListener("click", uploadTimeline);

/**
 * Function that sends the uploaded image along with the text inside the tiny mce to the server
 * which will instruct the database to store the sent data.
 */
function uploadTimeline(e) {
  e.preventDefault();

  let text = tinyMCE.activeEditor.getContent({
    format: "text"
  });
  const imageUpload = document.querySelector('#file-input');
  let formData = new FormData();

  if (imageUpload.files.length > 0) {

    for (let i = 0; i < imageUpload.files.length; i++) {
      formData.append("timeline", imageUpload.files[i]);
    }
  }

  formData.append("description", text);

  const options = {
    method: 'POST',
    body: formData
  };

  fetch("/upload-timeline", options).then(function (res) {
    console.log(res);
  }).catch(function (err) {
    ("Error:", err);
  });
  setTimeout(function () {
    window.location.href = "/dashboard";
  }, 3000);
}