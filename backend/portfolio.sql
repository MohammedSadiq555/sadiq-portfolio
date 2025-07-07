CREATE DATABASE portfolio;
USE portfolio;

CREATE TABLE projects (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    date VARCHAR(50),
    image VARCHAR(255)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234567890';
FLUSH PRIVILEGES;
