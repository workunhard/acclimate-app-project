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
window.onload = function() {
	if(!window.location.hash) {
		window.location = window.location + '#loaded';
		window.location.reload();
	}
}
