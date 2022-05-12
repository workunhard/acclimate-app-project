const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const is_heroku = process.env.IS_HEROKU || false;
const {
    JSDOM
} = require('jsdom');
const mysql = require('mysql2');

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

// static path mappings
app.use("/scripts", express.static("public/scripts"));
app.use("/styles", express.static("public/styles"));
app.use("/images", express.static("public/images"));
app.use("/html", express.static("app/html"));
app.use("/text", express.static("app/text"));

app.use(session({
    secret: "extra text that no one will guess",
    name: "codeSessionID",
    resave: false,
    saveUninitialized: true
}));

// Access login page
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

// Access dashboard
app.get("/dashboard", function (req, res) {

    if (req.session.loggedIn && req.session.admin == 1) {

        let profile = fs.readFileSync("./app/html/admin-dashboard.html", "utf8");
        let profileDOM = new JSDOM(profile);

        profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back " + req.session.name +".";
        res.send(profileDOM.serialize());

    } else if (req.session.loggedIn && req.session.admin == 0) {
        let profile = fs.readFileSync("./app/html/user-dashboard.html", "utf8");
        let profileDOM = new JSDOM(profile);

        profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back " + req.session.name +".";
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
    let results = authenticate(req.body.email, req.body.password,
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
                req.session.save(function (err) {});

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

function authenticate(email, pwd, callback) {
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "comp2800"
    });
    connection.connect();
    connection.query(
        "SELECT * FROM bby23_user WHERE email = ? AND password = ?", [email, pwd],
        function (error, results, fields) {
            if (error) {
                res.redirect("/");
            }
            if (results.length > 0) {
                return callback(results[0]);
            } else {
                return callback(null);
            }
        }
    );
}

app.get('/get-users', function (req, res) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'COMP2800'
    });
    connection.connect();
    connection.query('SELECT * FROM bby23_user', function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('Rows returned are: ', results);
        res.send({ status: "success", rows: results });

    });
    connection.end();
});

app.post('/add-user', function (req, res) {
	res.setHeader('Content-Type', 'application/json');

	console.log("Name", req.body.name);
	console.log("Email", req.body.email);
	console.log("Password", req.body.password);
    console.log("Admin", req.body.admin);

	let connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'COMP2800'
	});
	connection.connect();

	connection.query('INSERT INTO bby23_user (name, email, password, admin) values (?, ?, ?, ?)',
		  [req.body.name, req.body.email, req.body.password, req.body.admin],
		  function (error, results, fields) {
	  if (error) {
		  console.log(error);
	  }
	  res.send({ status: "success", msg: "Record added." });

	});
	connection.end();

});

app.post('/update-email', function (req, res) {
	res.setHeader('Content-Type', 'application/json');

	const mysql = require("mysql2");
	let connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'COMP2800'
	});
	connection.connect();
console.log("updated values", req.body.email, req.body.id)
	connection.query('UPDATE bby23_user SET email = ? WHERE ID = ?',
		  [req.body.email, req.body.id],
		  function (error, results, fields) {
	  if (error) {
		  console.log(error);
	  }
	  res.send({ status: "success", msg: "Recorded update." });

	});
	connection.end();

});

app.post('/update-name', function (req, res) {
	res.setHeader('Content-Type', 'application/json');

	const mysql = require("mysql2");
	let connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'COMP2800'
	});
	connection.connect();
console.log("updated values", req.body.name, req.body.id)
	connection.query('UPDATE bby23_user SET name = ? WHERE ID = ?',
		  [req.body.name, req.body.id],
		  function (error, results, fields) {
	  if (error) {
		  console.log(error);
	  }
	  res.send({ status: "success", msg: "Recorded update." });

	});
	connection.end();

});

app.post('/update-password', function (req, res) {
	res.setHeader('Content-Type', 'application/json');

	const mysql = require("mysql2");
	let connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'COMP2800'
	});
	connection.connect();
console.log("updated values", req.body.password, req.body.id)
	connection.query('UPDATE bby23_user SET password = ? WHERE ID = ?',
		  [req.body.password, req.body.id],
		  function (error, results, fields) {
	  if (error) {
		  console.log(error);
	  }
	  res.send({ status: "success", msg: "Recorded update." });

	});
	connection.end();

});

app.post('/update-admin', function (req, res) {
	res.setHeader('Content-Type', 'application/json');

	const mysql = require("mysql2");
	let connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'COMP2800'
	});
	connection.connect();
console.log("updated values", req.body.admin, req.body.id)
	connection.query('UPDATE bby23_user SET admin = ? WHERE ID = ?',
		  [req.body.admin, req.body.id],
		  function (error, results, fields) {
	  if (error) {
		  console.log(error);
	  }
	  res.send({ status: "success", msg: "Recorded update." });

	});
	connection.end();

});

// Deletes users
app.post('/delete-user', function (req, res) {
	res.setHeader('Content-Type', 'application/json');

    const mysql = require("mysql2");
	let connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'COMP2800'
	});
	connection.connect();
	connection.query('DELETE FROM bby23_user WHERE ID = ?',
        [req.body.id],
		  function (error, results, fields) {
	  if (error) {
		  console.log(error);
	  }
	  res.send({ status: "success", msg: req.body.id + " deleted." });
	});
	connection.end();
});

// RUN SERVER
let port = 8000;
app.listen(port);
console.log("Listening on port " + port + "!");