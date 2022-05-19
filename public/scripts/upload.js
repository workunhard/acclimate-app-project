tinymce.init({
  selector: '#description',
  height: 300,
  setup: function (editor) {
      editor.on('init', function () {
          this.setContent('<p>Add content via on init!</p>');
          console.log(tinyMCE.activeEditor.getContent());
      });
  },
  theme: 'modern',
  plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'insertdatetime media nonbreaking save table contextmenu directionality',
      'emoticons template paste textcolor colorpicker textpattern imagetools'
  ],
  toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  toolbar2: 'print preview media | forecolor backcolor emoticons',
  image_advtab: true
});


document.getElementById("submit").addEventListener("click", uploadTimeline);
// const upLoadForm = document.getElementById("upload-timeline-form");
// upLoadForm.addEventListener("submit", uploadTimeline, getDescription);

function uploadTimeline(e) {
  e.preventDefault();

  let text = tinyMCE.activeEditor.getContent();
  const imageUpload = document.querySelector('#timeline-upload');
  let formData = new FormData();

  for (let i = 0; i < imageUpload.files.length; i++) {
    // put the images from the input into the form data
    formData.append("timeline", imageUpload.files[i]);
  }

  formData.append("description", text);

  const options = {
    method: 'POST',
    body: formData
  };

  fetch("/upload-timeline", options).then(function (res) {
    console.log(res);
  }).catch(function (err) {
    ("Error:", err)
  });
}
