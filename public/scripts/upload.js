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

document.getElementById("description_ifr").addEventListener("click", cleanUp);
// document.getElementById("mceu_41.mce-edit-area.mce-container.mce-panel.mce-stack-layout-item").addEventListener("click", cleanUp);
function cleanUp() {
  tinymce.activeEditor.setContent('');
  document.getElementById("dexcription_ifr").removeEventListener("click", cleanUp);
  // document.getElementById("mceu_41.mce-edit-area.mce-container.mce-panel.mce-stack-layout-item").removeEventListener("click", cleanUp);
}

document.getElementById("submit").addEventListener("click", uploadTimeline);

function uploadTimeline(e) {
  e.preventDefault();

  let text = tinyMCE.activeEditor.getContent({ format: "text" });
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
    ("Error:", err)
  });
  setTimeout(function () {
    window.location.href ="/dashboard";
  }, 3000);
  
}

