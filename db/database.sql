CREATE DATABASE IF NOT EXISTS schooldb;

USE schooldb;

CREATE TABLE schooldb.school (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE schooldb.student (
  id INT(11) NOT NULL AUTO_INCREMENT,
  school_id INT(11) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (school_id) REFERENCES schooldb.school(id)
);

CREATE TABLE schooldb.employee (
  id INT(11) NOT NULL AUTO_INCREMENT,
  school_id INT(11) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  hire_date DATE,
  job_title VARCHAR(100),
  salary DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (school_id) REFERENCES schooldb.school(id)
);

-- Insert data into the school table
INSERT INTO schooldb.school (name, address, phone)
VALUES ('XYZ High School', '123 Main St.', '555-1234');

-- Insert data into the students table
INSERT INTO schooldb.student (school_id, first_name, last_name, email, phone, address, date_of_birth, gender)
VALUES (1, 'John', 'Doe', 'johndoe@example.com', '555-5555', '456 Elm St.', '1999-01-01', 'male'),
       (1, 'Jane', 'Smith', 'janesmith@example.com', '555-6666', '789 Oak St.', '2000-02-02', 'female');

-- Insert data into the employees table
INSERT INTO schooldb.employee (school_id, first_name, last_name, email, phone, address, hire_date, job_title, salary)
VALUES (1, 'Bob', 'Jones', 'bjones@example.com', '555-7777', '321 Pine St.', '2020-01-01', 'Teacher', 50000.00),
       (1, 'Alice', 'Johnson', 'ajohnson@example.com', '555-8888', '654 Maple St.', '2019-01-01', 'Principal', 75000.00);

DESCRIBE school;
DESCRIBE student;
DESCRIBE employee;


SELECT s.id, s.first_name, s.last_name, s.email, s.phone, s.address, s.date_of_birth, s.gender, sch.name as school_name, sch.address as school_address, sch.phone as school_phone
FROM schooldb.student s
INNER JOIN schooldb.school sch ON s.school_id = sch.id;
