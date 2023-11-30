CREATE DATABASE mydb;
use mydb;


CREATE TABLE users (
    id int primary key auto_increment,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE files (
    id int primary key auto_increment,
    filename VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    uploaded_at TIMESTAMP NOT NULL
    user_id int
    FOREIGN KEY user_id REFERENCES users(id)
);