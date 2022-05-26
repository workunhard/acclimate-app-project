const express = require("express");
const aws = require('aws-sdk');
const session = require("express-session");
const sanitizeHtml = require('sanitize-html');
const http = require('http');
const https = require("https");
const multer = require("multer");
const app = express();
const fs = require("fs");
const is_heroku = process.env.IS_HEROKU || false;
const S3_BUCKET = "acclimate-avatars";
const {
    JSDOM
} = require('jsdom');

const sslKey = fs.readFileSync('cert/key.pem', 'utf8');
const sslCertificate = fs.readFileSync('cert/cert.pem', 'utf8');
const sslCredentials = { key: sslKey, cert: sslCertificate };

const httpServer = http.createServer(app);
const httpsServer = https.createServer(sslCredentials, app);

const localDbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
};

const herokuDbConfig = {
    host: process.env.HEROKU_HOST,
    user: process.env.HEROKU_USER,
    password: process.env.HEROKU_PASS,
    database: process.env.HEROKU_DB
}

if (is_heroku) {
    var dbconfig = herokuDbConfig;
} else {
    var dbconfig = localDbConfig;
}

app.engine('html', require('ejs').renderFile);

aws.config.region = 'us-west-1';

const mysql = require("mysql2");
const { resolveNaptr } = require("dns");
const connection = mysql.createPool(dbconfig);

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/profileimages/avatars");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.split("/").pop().trim());
    },
});

const upload = multer({
    storage: storage
});

const timeline = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./app/profileimages/timeline");
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.split("/").pop().trim());
    },
});

const timelineupload = multer({
    storage: timeline
});


// static path mappings
app.use("/scripts", express.static("public/scripts"));
app.use("/styles", express.static("public/styles"));
app.use("/images", express.static("public/images"));
app.use("/html", express.static("app/html"));
app.use("/text", express.static("app/text"));
app.use("/profileimages", express.static("app/profileimages"));
app.use("/timeline", express.static("app/profileimages"));

app.use(session({
    secret: "extra text that no one will guess",
    name: "codeSessionID",
    resave: false,
    saveUninitialized: true
}));



// app.use("/", getLocation);

app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/dashboard");
    } else {
        let doc = fs.readFileSync("./app/html/login.html", "utf8");
        res.send(doc);
    }
});

app.get("/dashboard", function (req, res) {
	connection.query(
		"SELECT * from bby23_user WHERE ID = ?",
		[req.session.key],
		function (err, results) {
			if (err) {
				console.log(err.message);
			}
			req.session.name = results[0]?.name;
		}
	)

	if (req.session.loggedIn && req.session.admin == 1) {
		let profile = fs.readFileSync("./app/html/admin-dashboard.html", "utf8");
		let profileDOM = new JSDOM(profile);

		connection.query(
			"SELECT * from bby23_timeline WHERE ID = ?",
			[req.session.key],
			function (err, results, fields) {
				if (err) {
					console.log(err.message);
				}
				profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back, " + req.session.name;
				if (results.length > 0) {
					let str = "";

					for (i = results.length - 1; i >= 0; i--) {


						if (results[i].filename != null) {

                            str = str + "<div id=\"card\">" +
                            `<h3>Posted by @${req.session.name} on ${results[i].date} at ${results[i].time}</h3>` +
                            "<table><tr><td class='imageIDdescription'>" + results[i].imageID + "</td></tr>" +
                            "<tr class='description'><td class='description'><span>" + results[i].description + "</span></td></tr></table>" +
                            "<img id=\"photo\" src=\"profileimages/timeline/" + results[i].filename + "\"><br>" +
                            "<table><tr><td class='imageID'>" + results[i].imageID +
                            "</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" +
                            "<td class='deleteImage'><input type='button' id='deleteImage' value='Delete Image Only'></td>" +
                            "<td class='updateImage'><label for='image-upload' class='image-label'>Edit image</label><input id='image-upload' type='file' value='Edit images' accept='image/png, image/gif, image/jpeg'/></td>" +
                            "<td class='confirmImage'><input id='confirm' type='button' value='Confirm'></td></tr></table><br>" +
                            "</div><br>"
							// str = str + "<div id=\"card\">" +
							// 	results[i].date + " " + results[i].time + "<br>" +
							// 	"<img id=\"photo\" src=\"profileimages/timeline/"
							// 	+ results[i].filename + "\"><br>" +
							// 	"<table><tr><td class='imageID'>" + results[i].imageID +
							// 	"</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" +
							// 	"<td class='deleteImage'><input type='button' id='deleteImage' value='Delete Image Only'></td>" +
							// 	"<td class='updateImage'><label for='image-upload' class='image-label'>Edit image</label><input id='image-upload' type='file' value='Edit images' accept='image/png, image/gif, image/jpeg'/></td>" +
							// 	"<td class='confirmImage'><input id='confirm' type='button' value='Confirm'></td></tr></table><br>" +
							// 	"<table><tr><td class='imageIDdescription'>" + results[i].imageID +
							// 	"</td><td class='description'><span>" + results[i].description + "</span></td></tr></table></div><br>"

						} else {

							str = str + "<div id=\"card\">" +
                                `<h3>Posted by @${req.session.name} on ${results[i].date} at ${results[i].time}</h3>` +
								"<table><tr><td class='imageID'>" + results[i].imageID + "<br>" +
								"</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" +
								"<td class='updateImage'><label for='image-upload' class='image-label'>Edit image</label><input id='image-upload' type='file' value='Edit images' accept='image/png, image/gif, image/jpeg'/></td>" +
								"<td class='confirmImage'><input id='confirm' type='button' value='Confirm'></td></tr></table><br>" +
								"<table><tr><td class='imageIDdescription'>" + results[i].imageID +
								"</td><td class='description'><span>" + results[i].description + "</span></td></tr></table></div>" 

                                // str = str + "<div id=\"card\">" +
								// results[i].date + " " + results[i].time +
								// "<table><tr><td class='imageID'>" + results[i].imageID + "<br>" +
								// "</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" +
								// "<td class='updateImage'><input id='image-upload' type='file' value='Edit images' accept='image/png, image/gif, image/jpeg'/></td>" +
								// "<td class='confirmImage'><input id='confirm' type='button' value='Confirm'></td></tr></table><br>" +
								// "<table><tr><td class='imageIDdescription'>" + results[i].imageID +
								// "</td><td class='description'><span>" + results[i].description + "</span></td></tr></table></div><br>"
						}


					}

					profileDOM.window.document.getElementById("timeline").innerHTML = str;
				}
				res.send(profileDOM.serialize());
			}
		);

	} else if (req.session.loggedIn && req.session.admin == 0) {
		let profile = fs.readFileSync("./app/html/user-dashboard.html", "utf8");
		let profileDOM = new JSDOM(profile);

		connection.query(
			"SELECT * from bby23_timeline WHERE ID = ?",
			[req.session.key],
			function (err, results, fields) {
				if (err) {
					console.log(err.message);
				}
				profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back, " + req.session.name;
				if (results.length > 0) {
					let str = "";

					for (i = results.length - 1; i >= 0; i--) {


						if (results[i].filename != null) {

							str = str + "<div id=\"card\">" +
                                `<h3>Posted by @${req.session.name} on ${results[i].date} at ${results[i].time}</h3>` +
                                "<table><tr><td class='imageIDdescription'>" + results[i].imageID + "</td></tr>" +
								"<tr class='description'><td class='description'><span>" + results[i].description + "</span></td></tr></table>" +
								"<img id=\"photo\" src=\"profileimages/timeline/" + results[i].filename + "\"><br>" +
								"<table><tr><td class='imageID'>" + results[i].imageID +
								"</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" +
								"<td class='deleteImage'><input type='button' id='deleteImage' value='Delete Image Only'></td>" +
								"<td class='updateImage'><label for='image-upload' class='image-label'>Edit image</label><input id='image-upload' type='file' value='Edit images' accept='image/png, image/gif, image/jpeg'/></td>" +
								"<td class='confirmImage'><input id='confirm' type='button' value='Confirm'></td></tr></table><br>" +
								"</div><br>"

						} else {

							str = str + "<div id=\"card\">" +
                                `<h3>Posted by @${req.session.name} on ${results[i].date} at ${results[i].time}</h3>` +
								"<table><tr><td class='imageID'>" + results[i].imageID +
								"</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" +
								"<td class='updateImage'><label for='image-upload' class='image-label'>Edit image</label><input id='image-upload' type='file' value='Edit images' accept='image/png, image/gif, image/jpeg'/></td>" +
								"<td class='confirmImage'><input id='confirm' type='button' value='Confirm'></td></tr></table><br>" +
								"<table><tr><td class='imageIDdescription'>" + results[i].imageID +
								"</td><td class='description'><span>" + results[i].description + "</span></td></tr></table></div>" 
						}


					}
					profileDOM.window.document.getElementById("timeline").innerHTML = str;
				}
				res.send(profileDOM.serialize());
			}
		);
	} else {
		res.redirect("/");
	}
});

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Log-in
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    let results = authenticate(res, req.body.email, req.body.password,
        function (userRecord) {
            if (userRecord == null) {
                res.send({
                    status: "fail",
                    msg: "User account not found."
                });
            } else {
                // authenticate the user, create a session
                req.session.loggedIn = true;
                req.session.email = userRecord.email;
                req.session.name = userRecord.name;
                req.session.password = userRecord.password;
                req.session.admin = userRecord.admin;
                req.session.key = userRecord.ID;
                req.session.save(function (err) { });
                res.send({
                    status: "success",
                    msg: "Logged in."
                });
            }
        });
});

app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                res.redirect("/");
            }
        });
    }
});

function authenticate(res, email, pwd, callback) {
    connection.query(
        "SELECT * FROM bby23_user WHERE email = ? AND password = ?", [email, pwd],
        function (error, results, fields) {
            if (error) {
                res.redirect("/");
            } else {
                if (results.length > 0) {
                    return callback(results[0]);
                } else {
                    return callback(null);
                }
            }
        }
    );
}


app.post('/location', function (req, res) {
	if (req.session) {
		req.session.lat = req.body.lat;
		req.session.lng = req.body.lng;
		req.session.save(function (err) {
			if (err) {
				console.log(err);
			}
		});
		res.send({
			status: "success",
		});
	};
});

app.get('/timeline', function (req, res) {
	connection.query(
		"SELECT p.*, n.name from bby23_timeline AS p JOIN bby23_user AS n ON p.ID = n.ID ", function (err, results, fields) {
			if (err) {
				console.log(err.message);
			}
			res.send({
				status: "success",
				rows: results
			});
		});
});


app.get('/coords', function (req, res) {
	if (req.session) {
		res.send({
			status: "success",
			lat: req.session.lat,
			lng: req.session.lng,
		})
	} else {
		res.send({
			status: "fail"
		})
	}
})




app.get('/get-users', function (req, res) {

    connection.query('SELECT * FROM bby23_user', function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        res.send({
            status: "success",
            rows: results
        });
    });
});

app.get('/get-userInfo', function (req, res) {
    connection.query('SELECT * FROM bby23_user WHERE ID = ?', [req.session.key],

        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                profile: results[0]
            });
        });
});

app.post('/add-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    console.log("Name", req.body.name);
    console.log("Email", req.body.email);
    console.log("Password", req.body.password);
    console.log("Admin", req.body.admin);

    connection.query('INSERT INTO bby23_user (name, email, password, admin) values (?, ?, ?, ?)',
        [req.body.name, req.body.email, req.body.password, req.body.admin],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Record added."
            });

        });
});

app.post('/update-email', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET email = ? WHERE ID = ?',
        [req.body.email, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });

        });
});

app.post('/update-userEmail', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET email = ? WHERE ID = ?',
        [req.body.email, req.session.key],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });

        });
});

app.post('/update-name', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET name = ? WHERE ID = ?',
        [req.body.name, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

app.post('/update-userName', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET name = ? WHERE ID = ?',
        [req.body.name, req.session.key],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

app.post('/update-password', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET password = ? WHERE ID = ?',
        [req.body.password, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

app.post('/update-userPassword', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET password = ? WHERE ID = ?',
        [req.body.password, req.session.key],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

app.post('/update-admin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE bby23_user SET admin = ? WHERE ID = ?',
        [req.body.admin, req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

app.post('/update-description', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    req.body.description = sanitizeHtml(req.body.description);
    connection.query('UPDATE bby23_timeline SET description = ? WHERE imageID = ?',
        [req.body.description, req.body.imageID],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

// Deletes users
app.post('/delete-user', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('DELETE FROM bby23_user WHERE ID = ?',
        [req.body.id],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: req.body.id + " deleted."
            });
        });
});

app.get("/profile", function (req, res) {
    if (req.session.loggedIn) {
        const profile = fs.readFileSync("./app/html/profile.html", "utf8");

        let profileDOM = new JSDOM(profile);

        connection.query(
            "SELECT ID FROM bby23_user WHERE name = ?",
            [req.session.name],
            function (err, results, fields) {
                if (err) {
                    console.log(err);
                } else {
                    // const rows = JSON.parse(JSON.stringify(results[0]));
                    // const value = Object.values(rows);
                    connection.query(
                        "select avatar from bby23_user WHERE ID = ?",
                        [req.session.key],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                            }
                            if (results.length > 0) {
                                if (results[0].avatar != null) {
                                    profileDOM.window.document.getElementById("userAvatar").innerHTML = "<img id=\"photo\" src=\"profileimages/avatars/" + results[0].avatar + "\">";
                                }
                            }
                            res.send(profileDOM.serialize());
                        }
                    );
                }
            }
        );
    } else {
        res.redirect("/");
    }
});

// app.get('/sign-s3', (req, res) => {
//     const s3 = new aws.S3();
//     const fileName = req.query['file-name'];
//     const fileType = req.query['file-type'];
//     const s3Params = {
//         Bucket: "acclimate-avatars",
//         Key: fileName,
//         Expires: 300,
//         ContentType: fileType,
//         ACL: 'public-read'
//     };

//     console.log("at sign-s3 / getsigned");

//     s3.getSignedUrl('putObject', s3Params, (err, data) => {
//         if (err) {
//             console.log("error in getSignedUrl");
//             console.log(err);
//             return res.end();
//         }
//         const returnData = {
//             signedRequest: data,
//             url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//         };
//         console.log("returned data");
//         console.log(returnData);
//         res.write(JSON.stringify(returnData));
//         res.end();
//     });
//     console.log("end of sign-s3");
// }
// );

// app.post('/save-details', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     var today = new Date();
//     var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
//     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//     req.body.description = sanitizeHtml(req.body.description);



//     if (req.files.length > 0) {
//         connection.query("INSERT INTO bby23_timeline (filename, description, date, time, ID) VALUES (?, ?, ?, ?, ?)",
//             [`${req.files[0].filename}`, req.body.description, date, time, req.session.key],
//             function (err, results) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log(results);
//                 }
//             })
//     } else {
//         connection.query("INSERT INTO bby23_timeline (filename, description, date, time, ID) VALUES (?, ?, ?, ?, ?)",
//             [null, req.body.description, date, time, req.session.key],
//             function (err, results) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     console.log(results);
//                 }
//             })
//     }
// }
// );

app.post("/upload-images", upload.array("files"), function (req, res) {
    connection.query("SELECT ID FROM bby23_user WHERE name = ?", [req.session.name], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            // const rows = JSON.parse(JSON.stringify(results[0]));
            // const key = Object.values(rows);
            connection.query("UPDATE bby23_user SET avatar = ? WHERE ID = ?", [req.files[0]?.filename, req.session.key], function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            })
        }
    })
});

function numberFixedPositions(x) {
	return Number.parseFloat(x).toFixed(5);
}

app.post("/upload-timeline", timelineupload.array("timeline"), function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    req.body.description = sanitizeHtml(req.body.description);
    var lat = numberFixedPositions(req.session.lat);
    var lng = numberFixedPositions(req.session.lng);



    if (req.files.length > 0) {
        connection.query("INSERT INTO bby23_timeline (filename, description, date, time, ID, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [`${req.files[0].filename}`, req.body.description, date, time, req.session.key, lat, lng],
            function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            })
    } else {
        connection.query("INSERT INTO bby23_timeline (filename, description, date, time, ID, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [null, req.body.description, date, time, req.session.key, lat, lng],
            function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            })
    }
});

app.post("/update-image", timelineupload.array("timeline"), function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    connection.query("UPDATE bby23_timeline SET filename = ?, date = ?, time = ? WHERE imageID = ?",
        [req.files[0].filename, date, time, req.body.imageID],
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }
        })
});

app.post("/delete-image", function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query("UPDATE bby23_timeline SET filename = null WHERE imageID = ?",
        [req.body.imageID],
        function (err, results) {
            if (err) {
                console.log(err);
            } else {
                res.send({
                    status: "success",
                    msg: req.body.imageID + " deleted.",
                })
            }
        })
});

app.post('/delete-post', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('DELETE FROM bby23_timeline WHERE imageID = ?',
        [req.body.imageID],
        function (error, results, fields) {
            if (error) {
                console.log(error);
            }
            res.send({
                status: "success",
                msg: req.body.id + " deleted."
            });
        });
});


// To allow validation of both email and passwords and ensure proper syntax.
const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Seven characters in total, at least one special character and at least one number. 
const validPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;


/**
 * To validate User email.
 * @param {*} req the request object in HTTP requests, extracts the email.
 * @returns an array that informs of the result and in case of failure provides an associated message.
 */
function validateUserEmail(req) {
    let email = req.body.email;
    if (email.match(validEmailRegex) && email != "") {
        return [email, null];
    } else {
        return [false, "Please enter valid email"];
    }
}

/**
 * To validate User name.
 * @param {*} req the request object in HTTP requests, extracts the name.
 * @returns an array that informs of the result and in case of failure provides an associated message.
 */
function validateUserName(req) {
    let name = req.body.name;
    if (name != "") {
        return [name, null];
    } else {
        return [false, "Please enter a valid name"];
    }
}


/**
 * To validate User password.
 * @param {*} req the request object in HTTP requests, extracts the password.
 * @returns an array that informs of the result and in case of failure provides an associated message.
 */
function validateUserPassword(req) {
    let password = req.body.password;
    let cpassword = req.body.cpassword;
    if (password != cpassword) {
        return [false, "Both passwords must be the same"]
    }
    if (password.match(validPasswordRegex) && password != "") {
        return [password, null];
    } else {
        return [false, "Please enter a valid password"];
    }
}

/**
 * Validates all of the user input one by one by consolidating all of the validation functions.
 * @param {*} req the request object in HTTP requests.
 * @returns an array that informs the user of the validation result, if validation fails then provides the reason as well.
 */
function userValidation(req) {

    var email = validateUserEmail(req);
    if (!email[0]) {
        return email;
    }
    var name = validateUserName(req);
    if (!name[0]) {
        return name;
    }
    var password = validateUserPassword(req);
    if (!password[0]) {
        return password;
    } else {
        return [true, null];
    }


}

/**
 * Creates a new user upon signup and uses the validation functions before making an SQL query.
 */
app.post("/create-user", function (req, res) {
    var validation = userValidation(req);
    var result = validation[0];
    var message = validation[1];
    if (result) {
        connection.query('INSERT INTO bby23_user (name, email, password, admin) values (?, ?, ?, ?)',
            [req.body.name, req.body.email, req.body.password, 0], function (error, results, fields) {
                if (error) {
                    if (error.code == 'ER_DUP_ENTRY') {
                        message = "The user already exists";
                    } else {
                        console.log(error);
                        message = "Error";
                    }
                    res.send({
                        status: "fail",
                        msg: "Error: " + message
                    })
                } else {
                    console.log(req.body);
                    connection.query('SELECT * FROM bby23_user WHERE email = ?', [req.body.email], function (error, results, fields) {
                        if (error) {
                            console.log(error);
                            res.send({ status: "fail", msg: "User creation: " + error });
                        } else {
                            res.send({ status: "success", msg: "User created: " + results[0] })
                        }
                    })
                }
            })
    } else {
        res.send({
            status: "fail",
            msg: "Invalid Input: " + message
        })
    }
})

// RUN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
})

const securePort = 8080;
httpsServer.listen(securePort, () => {
    console.log(`App listening on port ${securePort}`);
})
