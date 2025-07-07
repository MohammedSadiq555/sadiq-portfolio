CREATE DATABASE portfolio;
USE portfolio;

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    date VARCHAR(50),
    image VARCHAR(255)
);

ALTER TABLE projects ADD COLUMN number INT NOT NULL, ADD COLUMN category VARCHAR(50) NOT NULL;
