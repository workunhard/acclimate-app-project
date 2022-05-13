const express = require("express");
const session = require("express-session");
const multer = require("multer");
const app = express();
const fs = require("fs");
const is_heroku = process.env.IS_HEROKU || false;
const { JSDOM } = require("jsdom");

const localDbConfig = {
	host: "localhost",
	user: "root",
	password: "",
	database: "COMP2800",
};

const herokuDbConfig = {
	host: "qz8si2yulh3i7gl3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	user: "i8titfbhmggktzud",
	password: "t5frs4lz1adk3rmr",
	database: "qhfgyfeinmbwri94",
};

if (is_heroku) {
	var dbconfig = herokuDbConfig;
} else {
	var dbconfig = localDbConfig;
}

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

const upload = multer({ storage: storage });

// static path mappings
app.use("/scripts", express.static("public/scripts"));
app.use("/styles", express.static("public/styles"));
app.use("/images", express.static("public/images"));
app.use("/html", express.static("app/html"));
app.use("/text", express.static("app/text"));
app.use("/profileimages", express.static("app/profileimages"));


app.use(
	session({
		secret: "extra text that no one will guess",
		name: "codeSessionID",
		resave: false,
		saveUninitialized: true,
	})
);

app.get("/", function (req, res) {
	if (req.session.loggedIn) {
		res.redirect("/dashboard");
	} else {
		let doc = fs.readFileSync("./app/html/login.html", "utf8");
		res.set("Server", "Code Engine");
		res.set("X-Powered-By", "Code");
		res.send(doc);
	}
});

app.get("/dashboard", function (req, res) {
	if (req.session.loggedIn && req.session.admin == 1) {
		let profile = fs.readFileSync("./app/html/admin-dashboard.html", "utf8");
		let profileDOM = new JSDOM(profile);
		profileDOM.window.document.getElementById("profile_name").innerHTML =
			"Welcome back " + req.session.name + ".";
		res.send(profileDOM.serialize());
	} else if (req.session.loggedIn && req.session.admin == 0) {
		let profile = fs.readFileSync("./app/html/user-dashboard.html", "utf8");
		let profileDOM = new JSDOM(profile);
		profileDOM.window.document.getElementById("profile_name").innerHTML =
			"Welcome back " + req.session.name + ".";
		res.send(profileDOM.serialize());
	} else {
		res.redirect("/");
	}
});

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Log-in
app.post("/login", function (req, res) {
	res.setHeader("Content-Type", "application/json");
	console.log("pre-authenticate");
	let results = authenticate(
		res,
		req.body.email,
		req.body.password,
		function (userRecord) {
			if (userRecord == null) {
				res.send({
					status: "fail",
					msg: "User account not found.",
				});
			} else {
				// authenticate the user, create a session
				req.session.loggedIn = true;
				req.session.email = userRecord.email;
				req.session.name = userRecord.name;
				req.session.password = userRecord.password;
				req.session.admin = userRecord.admin;
				req.session.save(function (err) {});
				res.send({
					status: "success",
					msg: "Logged in.",
				});
			}
		}
	);
});

app.get("/logout", function (req, res) {
	if (req.session) {
		req.session.destroy(function (error) {
			if (error) {
				res.status(400).send("Unable to log out");
			} else {
				res.redirect("/");
			}
		});
	}
});

function authenticate(res, email, pwd, callback) {
	console.log("Authenticate 1");
	connection.query(
		"SELECT * FROM bby23_user WHERE email = ? AND password = ?",
		[email, pwd],
		function (error, results, fields) {
			console.log("Authenticate query callback");
			console.log("email: ");
			console.log(email);
			console.log("pword: ");
			console.log(pwd);
			console.log("results: ");
			console.log(results);
			if (error) {
				console.log("Authenticate query error");
				console.log(error);
				res.redirect("/");
			} else {
				if (results.length > 0) {
					console.log("Authenticate query success");
					return callback(results[0]);
				} else {
					console.log("Authenticate query but empty result");
					return callback(null);
				}
			}
		}
	);
}

app.get("/profile", function (req, res) {
	if (req.session.loggedIn) {
		let profile = "";
		if (req.session.admin == 1) {
			profile = fs.readFileSync("./app/html/profile.html", "utf8");
		}
		let profileDOM = new JSDOM(profile);
		profileDOM.window.document.getElementById("avatar_name").innerHTML =
			req.session.name;
		profileDOM.window.document.getElementById("avatar_email").innerHTML =
			req.session.email;
		profileDOM.window.document.getElementById("avatar_password").innerHTML =
			req.session.password;

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
							console.log(results[0].avatar);
							profileDOM.window.document.getElementById("userAvatar").innerHTML = "<img id=\"photo\" src=\"profileimages/avatars/" + results[0].avatar + "\">";
							// profileDOM.window.document.getElementById("userAvatar").innerHTML = "<img src=\"../../" + results[0].avatar + "\">";
							res.send(profileDOM.serialize());
							// const rows = JSON.parse(JSON.stringify(results[0]));
							// const key = Object.values(rows);
							// profileDOM.window.document.getElementById(
							// 	"userAvatar"
							// ).src = `${key}`;
						}
					);
				}
                // const answer = results[0].toString();
                // const rows = JSON.parse(JSON.stringify(results[0]));
                // console.log(rows);
                // console.log(req.body.id);
				// console.log("Results:" + rows);
				// profileDOM.window.document.getElementById("userAvatar").innerHTML = "<img src=\"" + results[0].avatar + "\">";
				// res.send(profileDOM.serialize());
			}
		);
            
		// res.send(profileDOM.serialize());
		// res.send(profile);
	} else {
		res.redirect("/");
	}
});

app.post("/upload-images", upload.array("files"), function (req, res) {
    connection.query("SELECT ID FROM bby23_user WHERE name = ?", [req.session.name], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            const name = results.name;
            console.log(name);
            connection.query("UPDATE bby23_user SET avatar = ? WHERE ID = ?", [req.files[0].filename, 1], function (err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                }
            })
        }
    })

    connection.query("UPDATE bby23_user SET avatar = ? WHERE ID = ?", [req.files[0].filename, 1], function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
        }
    })

});

app.get("/get-users", function (req, res) {
	connection.query(
		"SELECT * FROM bby23_user",
		function (error, results, fields) {
			if (error) {
				console.log(error);
			}
			console.log("Rows returned are: ", results);
			res.send({
				status: "success",
				rows: results,
			});
		}
	);
});

app.post("/update-email", function (req, res) {
	res.setHeader("Content-Type", "application/json");
	console.log("updated values", req.body.email, req.body.id);
	connection.query(
		"UPDATE bby23_user SET email = ? WHERE ID = ?",
		[req.body.email, req.body.id],
		function (error, results, fields) {
			if (error) {
				console.log(error);
			}
			//console.log('Rows returned are: ', results);
			res.send({
				status: "success",
				msg: "Recorded update.",
			});
		}
	);
});

app.post("/update-name", function (req, res) {
	res.setHeader("Content-Type", "application/json");
	console.log("updated values", req.body.name, req.body.id);
	connection.query(
		"UPDATE bby23_user SET name = ? WHERE ID = ?",
		[req.body.name, req.body.id],
		function (error, results, fields) {
			if (error) {
				console.log(error);
			}
			//console.log('Rows returned are: ', results);
			res.send({
				status: "success",
				msg: "Recorded update.",
			});
		}
	);
});

// RUN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
	console.log("Press Ctrl+C to quit.");
});
