const express = require("express");
const aws = require('aws-sdk');
const session = require("express-session");
// const http = require('http');
// const https = require("https");
const multer = require("multer");
const app = express();
const fs = require("fs");
const is_heroku = process.env.IS_HEROKU || false;
const S3_BUCKET = "acclimate-avatars";
const {
	JSDOM
} = require('jsdom');

// const sslKey = fs.readFileSync('cert/key.pem', 'utf8');
// const sslCertificate = fs.readFileSync('cert/cert.pem', 'utf8');
// const sslCredentials = { key: sslKey, cert: sslCertificate };

// const httpServer = http.createServer(app);
// const httpsServer = https.createServer(sslCredentials, app);

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

app.get("/", function (req, res) {
	if (req.session.loggedIn) {
		res.redirect("/dashboard");
	} else {
		let doc = fs.readFileSync("./app/html/login.html", "utf8");
		res.send(doc);
	}
});

app.get("/dashboard", function (req, res) {
	if (req.session.loggedIn && req.session.admin == 1) {
		let profile = fs.readFileSync("./app/html/admin-dashboard.html", "utf8");
		let profileDOM = new JSDOM(profile);
		profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back, " + req.session.name;
		res.send(profileDOM.serialize());
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
						str = str + "<table><tr><td class='imageID'>" + results[i].imageID +
							"</td><td class='deletePost'><input type='button' id='deletePost' value='Delete Post'></td>" + 
                            "<td class='editPost'><input type='button' id='editPost' value='Edit Post'></td></tr></table><br>" +
							"<img id=\"photo\" src=\"profileimages/timeline/" + results[i].filename + "\"><br>" +
							results[i].description + "<br>" +
							results[i].date + " " + results[i].time + "<br>"
					}
					// if (results[0].filename != null) {
					profileDOM.window.document.getElementById("timeline").innerHTML = str;
					// "<img id=\"photo\" src=\"profileimages/timeline/" + results[0].filename + "\">";
					// }
				}
				res.send(profileDOM.serialize());
			}
		);

		// profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back, " + req.session.name;
		// res.send(profileDOM.serialize());
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
				// name: req.session.name,
				// email: req.session.email,
				// password: req.session.password,
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
		// profileDOM.window.document.getElementById("avatar_name").innerHTML =
		//     req.session.name;
		// profileDOM.window.document.getElementById("avatar_email").innerHTML =
		//     req.session.email;
		// profileDOM.window.document.getElementById("avatar_password").innerHTML =
		//     req.session.password;

		connection.query(
			"SELECT ID FROM bby23_user WHERE name = ?",
			[req.session.name],
			function (err, results, fields) {
				if (err) {
					console.log(err);
				} else {
					const rows = JSON.parse(JSON.stringify(results[0]));
					const value = Object.values(rows);
					connection.query(
						"select avatar from bby23_user WHERE ID = ?",
						[value],
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

app.get('/sign-s3', (req, res) => {
	const s3 = new aws.S3();
	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];
	const s3Params = {
		Bucket: "acclimate-avatars",
		Key: fileName,
		Expires: 300,
		ContentType: fileType,
		ACL: 'public-read'
	};

	console.log("at sign-s3 / getsigned");

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if (err) {
			console.log("error in getSignedUrl");
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};
		console.log("returned data");
		console.log(returnData);
		res.write(JSON.stringify(returnData));
		res.end();
	});
	console.log("end of sign-s3");
}
);

app.post('/save-details', (req, res) => {
	// TODO: Read POSTed form data and do something useful
}
);

app.post("/upload-images", upload.array("files"), function (req, res) {
	connection.query("SELECT ID FROM bby23_user WHERE name = ?", [req.session.name], function (err, results) {
		if (err) {
			console.log(err);
		} else {
			const rows = JSON.parse(JSON.stringify(results[0]));
			const key = Object.values(rows);
			connection.query("UPDATE bby23_user SET avatar = ? WHERE ID = ?", [req.files[0].filename, key], function (err, results) {
				if (err) {
					console.log(err);
				} else {
					console.log(results);
				}
			})
		}
	})
});

app.post("/upload-timeline", timelineupload.array("timeline"), function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	var today = new Date();
	var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	if (req.files.length > 0) { 
	connection.query("INSERT INTO bby23_timeline (filename, description, date, time, ID) VALUES (?, ?, ?, ?, ?)",
		[req.files[0].filename, req.body.description, date, time, req.session.key],
		function (err, results) {
			if (err) {
				console.log(err);
			} else {
				console.log(results);
			}
		})
} else {
	connection.query("INSERT INTO bby23_timeline (filename, description, date, time, ID) VALUES (?, ?, ?, ?, ?)",
		[null, req.body.description, date, time, req.session.key],
		function (err, results) {
			if (err) {
				console.log(err);
			} else {
				console.log(results);
			}
		})
}
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

// RUN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log('Press Ctrl+C to quit.');
})

// const securePort = 8000;
// httpsServer.listen(securePort, () => {
// 	console.log(`App listening on port ${securePort}`);
// })
