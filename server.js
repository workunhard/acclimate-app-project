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
    const mysql = require("mysql2");
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
    connection.query(
        "SELECT * FROM bby23_user WHERE email = ? AND password = ?", [email, pwd],
        function (error, results, fields) {
            if (error) {
                console.log(error);
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

    const mysql = require("mysql2");
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
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
    connection.end();


});

app.post('/update-email', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const mysql = require("mysql2");
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
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
    connection.end();

});

app.post('/update-name', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const mysql = require("mysql2");
    const connection = mysql.createConnection(dbconfig);
    connection.connect();
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
    connection.end();

});


// Connect to DBMS and create tables
async function init() {
    // const mysql = require("mysql2/promise");
    // const connection = await mysql.createConnection({
    //     host: "localhost",
    //     user: "root",
    //     password: "",
    //     multipleStatements: true
    // });
    // const createDBAndTables = `CREATE DATABASE IF NOT EXISTS bby23;
    //     use bby23;

    //     CREATE TABLE IF NOT EXISTS bby23_user (
    //         ID int NOT NULL AUTO_INCREMENT,
    //         name varchar(30),
    //         email varchar(30),
    //         password varchar(30),
    //         admin boolean,
    //         PRIMARY KEY (ID));`;
    // await connection.query(createDBAndTables);

    // // Data for user table
    // const [rows, fields] = await connection.query("SELECT * FROM bby23_user");
    // if (rows.length == 0) {
    //     let userRecords = "insert into bby23_user (name, email, password, admin) values ?";
    //     let recordValues = [
    //         ["Code", "code@acclimate.com", "abcdefg", true],
    //         ["Bruce", "bruce_link@bcit.ca", "abc123", false],
    //         ["John", "john_romero@bcit.ca", "abc123", false]
    //     ];
    //     await connection.query(userRecords, [recordValues]);
    // }
    console.log("Listening on port " + port + "!");
}

// RUN SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log('App listening on port ${PORT}');
    console.log('Press Ctrl+C to quit.');
})
// let port = 8000;
// app.listen(port, init);
//