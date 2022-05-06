CREATE DATABASE IF NOT EXISTS bby23db;
use bby23db;

CREATE TABLE IF NOT EXISTS user (
  ID int NOT NULL AUTO_INCREMENT,
  personName varchar(30),
  email varchar(30),
  userPassword varchar(30),
  adminRights boolean,
  PRIMARY KEY (ID));

INSERT INTO user (personName, email, userPassword, adminRights) VALUES ('Code', 'Code@acclimate.com', 'abcdefg', true);

