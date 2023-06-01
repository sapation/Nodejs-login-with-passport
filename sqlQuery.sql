CREATE DATABASE passportlogin_app;
USE passportlogin_app;

CREATE TABLE users (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT NOW()
);