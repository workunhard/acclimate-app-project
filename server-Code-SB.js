const express = require("express");
const aws = require('aws-sdk');
const session = require("express-session");
const multer = require("multer");
const app = express();
const fs = require("fs");
const is_heroku = process.env.IS_HEROKU || false;
const {
    JSDOM
} = require('jsdom');

const localDbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'COMP2800'
};

const herokuDbConfig = {
    host: 'qz8si2yulh3i7gl3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'i8titfbhmggktzud',
    password: 't5frs4lz1adk3rmr',
    database: 'qhfgyfeinmbwri94'
}

if (is_heroku) {
    var dbconfig = herokuDbConfig;
} else {
    var dbconfig = localDbConfig;
}

app.engine('html', require('ejs').renderFile);
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'us-east-1';

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
        profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back, " + req.session.name;
        res.send(profileDOM.serialize());
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

    console.log("updated values", req.body.email, req.body.id)
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

app.post('/update-name', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    console.log("updated values", req.body.name, req.body.id)
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

app.post('/update-password', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    console.log("updated values", req.body.password, req.body.id)
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

app.post('/update-admin', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    console.log("updated values", req.body.admin, req.body.id)
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

app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 300,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  }
);

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

// RUN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
})