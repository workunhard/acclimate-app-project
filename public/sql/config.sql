CREATE TABLE bby23_user (
    ID int NOT NULL AUTO_INCREMENT,
    name varchar(30),
    email varchar(30) UNIQUE,
    password varchar(30),
    admin boolean,
    avatar varchar (500) UNIQUE,
    PRIMARY KEY (ID)
    );

INSERT INTO bby23_user (name, email, password, admin, avatar) VALUES ("Code", "code@acclimate.com", "abcdefg", true, NULL);
INSERT INTO bby23_user (name, email, password, admin, avatar) VALUES ("Bruce", "bruce_link@bcit.ca", "abc123", false, NULL);
INSERT INTO bby23_user (name, email, password, admin, avatar) VALUES ("John", "john_romero@bcit.ca", "abc123", false, NULL);





            
