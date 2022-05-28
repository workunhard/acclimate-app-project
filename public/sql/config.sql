CREATE TABLE bby23_user (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(30),
    email varchar(30) UNIQUE,
    password varchar(30),
    admin boolean,
    avatar varchar (50) UNIQUE,
    PRIMARY KEY (ID)
    );

INSERT INTO bby23_user (name, email, password, admin, avatar) VALUES ("Code", "test@acclimate.com", "abcdefg", true, NULL);
INSERT INTO bby23_user (name, email, password, admin, avatar) VALUES ("Bruce", "bruce_link@bcit.ca", "abc123", false, NULL);
INSERT INTO bby23_user (name, email, password, admin, avatar) VALUES ("John", "john_romero@bcit.ca", "abc123", false, NULL);

CREATE TABLE bby23_timeline (
    imageID int NOT NULL AUTO_INCREMENT,
    filename varchar(60),
    description varchar(140),
    date varchar(30),
    lat DECIMAL(20, 10),
    lng DECIMAL(20, 10),
    time varchar(30),
    ID int,
    FOREIGN KEY(ID) REFERENCES bby23_user(ID),
    PRIMARY KEY (imageID)
);