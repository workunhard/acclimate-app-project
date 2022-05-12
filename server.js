const express = require("express");
const session = require("express-session");

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

const mysql = require("mysql2");
const connection = mysql.createPool(dbconfig);

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
        profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back " + req.session.name + ".";
        res.send(profileDOM.serialize());
    } else if (req.session.loggedIn && req.session.admin == 0) {
        let profile = fs.readFileSync("./app/html/user-dashboard.html", "utf8");
        let profileDOM = new JSDOM(profile);
        profileDOM.window.document.getElementById("profile_name").innerHTML = "Welcome back " + req.session.name + ".";
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
    console.log("pre-authenticate");
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

function authenticate(res, email, pwd, callback) {
    console.log("Authenticate 1");
    connection.query(
        "SELECT * FROM bby23_user WHERE email = ? AND password = ?", [email, pwd],
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

app.get('/get-users', function (req, res) {

    connection.query('SELECT * FROM bby23_user', function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        console.log('Rows returned are: ', results);
        res.send({
            status: "success",
            rows: results
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
            //console.log('Rows returned are: ', results);
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
            //console.log('Rows returned are: ', results);
            res.send({
                status: "success",
                msg: "Recorded update."
            });
        });
});

// RUN SERVER
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
})