CREATE TABLE IF NOT EXISTS user (
  ID int NOT NULL AUTO_INCREMENT,
  name varchar(30),
  email varchar(30),
  password varchar(30),
  admin boolean,
  PRIMARY KEY (ID));