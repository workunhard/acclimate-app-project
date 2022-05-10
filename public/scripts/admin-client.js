function getUsers() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

                let data = JSON.parse(this.responseText);
                if (data.status == "success") {

                    let str = `        <tr>
<th class="id_header"><span>ID</span></th>
<th class="name_header"><span>Name</span></th>
<th class="email_header"><span>Email</span></th>
</tr>`;


                    for (let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        //console.log("row", row);
                        str += ("<tr><td class='id'>" + row.ID
                            + "</td><td class='name'><span>" + row.name
                            + "</span></td><td class='email'><span>"
                            + row.email + "</span></td></tr>");
                    }
                    //console.log(str);
                    document.getElementById("adminArea").innerHTML = str;

                    // select all spans under the email class of td elements
                    let records = document.querySelectorAll("td[class='email'] span");
                    for (let j = 0; j < records.length; j++) {
                        records[j].addEventListener("click", editCell);
                    }
                    let userRecords = document.querySelectorAll("td[class='name' span");
                    for (let j = 0; j < userRecords.length; j++) {
                        records[j].addEventListener("click", editCell);
                    }

                } else {
                    console.log("Error!");
                }

            } else {

                // not a 200, could be anything (404, 500, etc.)
                console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-users");
    xhr.send();
}
getUsers();

function editCell(e) {

    // add a listener for clicking on the field to change email
    // span's text
    let spanText = e.target.innerHTML;
    // span's parent (td)
    let parent = e.target.parentNode;
    // create a new input, and add a key listener to it
    let input = document.createElement("input");
    input.value = spanText;
    input.addEventListener("keyup", function (e) {
        let u = null;
        let v = null;
        // pressed enter
        if (e.which == 13) {
            v = input.value;
            u = input.value;
            let newSpan = document.createElement("span");
            // have to wire an event listener to the new element
            newSpan.addEventListener("click", editCell);
            newSpan.innerHTML = v;
            parent.innerHTML = "";
            parent.appendChild(newSpan);
            let dataToSend = {
                id: parent.parentNode.querySelector(".id").innerHTML,
                name: u,
                // name: parent.parentNode.querySelector(".name").innerHTML,
                email: v
            };

            // now send
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (this.readyState == XMLHttpRequest.DONE) {

                    // 200 means everthing worked
                    if (xhr.status === 200) {
                        document.getElementById("status").innerHTML = "Record updated.";
                        getUsers();


                    } else {

                        // not a 200, could be anything (404, 500, etc.)
                        console.log(this.status);

                    }

                } else {
                    console.log("ERROR", this.status);
                }
            }
            xhr.open("POST", "/update-users");
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
            xhr.send("id=" + dataToSend.id + "&user=" + dataToSend.name + "&email=" + dataToSend.email);

        }
    });
    parent.innerHTML = "";
    parent.appendChild(input);

}
