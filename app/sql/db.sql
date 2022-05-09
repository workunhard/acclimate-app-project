CREATE DATABASE IF NOT EXISTS bby23db;
use bby23db;
CREATE TABLE IF NOT EXISTS user (ID int NOT NULL AUTO_INCREMENT, name varchar(30), email varchar(30), password varchar(30), admin boolean, PRIMARY KEY (ID));
INSERT INTO user (name, email, password, admin) VALUES ('Code', 'Code@acclimate.com', 'abcdefg', true);

