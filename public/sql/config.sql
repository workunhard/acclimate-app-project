CREATE TABLE bby23_user (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(30),
    email varchar(30),
    password varchar(30),
    admin boolean,
    PRIMARY KEY (ID)
    );

INSERT INTO bby23_user (name, email, password, admin) VALUES ("Code", "code@acclimate.com", "abcdefg", true);
INSERT INTO bby23_user (name, email, password, admin) VALUES ("Bruce", "bruce_link@bcit.ca", "abc123", false);
INSERT INTO bby23_user (name, email, password, admin) VALUES ("John", "john_romero@bcit.ca", "abc123", false);


CREATE TABLE bby23_img (
    imgID int NOT NULL AUTO_INCREMENT,
    name varchar(100),
    userID int (10),
    PRIMARY KEY (imgID),
    FOREIGN KEY (userID) REFERENCES bby23_user(ID)
)
            
