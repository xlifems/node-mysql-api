CREATE DATABASE IF NOT EXISTS schooldb;

USE schooldb;

CREATE TABLE schooldb.school (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  department VARCHAR(20) NOT NULL,
  city VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  shield VARCHAR(255),
  dane_code VARCHAR(255) NOT NULL,
  nit VARCHAR(255) NOT NULL,
  resolution VARCHAR(255) NOT NULL,
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
  document_type ENUM('rc', 'ti', 'cc'),
  document VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_student_school
    FOREIGN KEY (school_id) REFERENCES schooldb.school(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
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
  CONSTRAINT fk_employee_school
    FOREIGN KEY (school_id) REFERENCES schooldb.school(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.user (
  id INT(11) NOT NULL AUTO_INCREMENT,
  school_id INT(11) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  role ENUM('admin', 'typist', 'institution'),
  uid VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_user_school
    FOREIGN KEY (school_id) REFERENCES schooldb.school(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.course (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  school_id INT NOT NULL, 
  CONSTRAINT fk_course_school
    FOREIGN KEY (school_id)
    REFERENCES schooldb.school (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.professor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT(11) NOT NULL,
  course_id INT NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  hire_date DATE,
  job_title VARCHAR(100),  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_professor_course
    FOREIGN KEY (school_id) REFERENCES schooldb.school(id)   
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.course_professor (
  course_id INT NOT NULL,
  professor_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (course_id, professor_id),
  CONSTRAINT fk_course_professor_course
    FOREIGN KEY (course_id) REFERENCES schooldb.course (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_course_professor_professor
    FOREIGN KEY (professor_id) REFERENCES schooldb.professor (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.subject (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hours INT(1) NOT NULL,
  course_id INT NOT NULL,
  professor_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_subject_course
    FOREIGN KEY (course_id) REFERENCES schooldb.course (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_subject_professor
    FOREIGN KEY (professor_id) REFERENCES schooldb.professor (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE note (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  subject_id INT NOT NULL,
  CONSTRAINT fk_note_subject
    FOREIGN KEY (subject_id)
    REFERENCES subject (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.book (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school_id INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  year INT(11) NOT NULL,
  type ENUM('qualitative', 'quantitative', 'both'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (school_id) REFERENCES schooldb.school(id)
);


CREATE TABLE schooldb.page (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT(11) NOT NULL,
  student_id INT(11) NOT NULL,
  status VARCHAR(100) NOT NULL,
  observation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_page_book
    FOREIGN KEY (book_id) REFERENCES schooldb.book (id),
  CONSTRAINT fk_page_student
    FOREIGN KEY (student_id) REFERENCES schooldb.student(id)
);

CREATE TABLE schooldb.matter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT(11) NOT NULL,
  name VARCHAR(255) NOT NULL,
  hours INT(11) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_matter_book
    FOREIGN KEY (book_id) REFERENCES schooldb.book(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE schooldb.page_matter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_id INT NOT NULL,
  matter_id INT NOT NULL,
  qualitative_note VARCHAR(255),
  quantitative_note DOUBLE, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
  CONSTRAINT fk_page_matter_page
    FOREIGN KEY (page_id) REFERENCES schooldb.page (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_page_matter_matter
    FOREIGN KEY (matter_id) REFERENCES schooldb.matter (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER TABLE page_matter MODIFY quantitative_note DOUBLE; 



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

-- Insert data into the book table
INSERT INTO schooldb.book (school_id, name, year, type)
VALUES (1, 'SEXTO A', 2012, 'quantitative'), (1, 'SEXTO B', 2012, 'quantitative');

-- Insert data into the matter table
INSERT INTO schooldb.matter (book_id, name, hours)
VALUES (1, 'MATEMATICAS', 4), (1, 'LENGUA CASTELLANA', 6);

-- Insert data into the page table
INSERT INTO schooldb.page (book_id, student_id,  status, observation)
VALUES (1, 3, 'APROBO', "nivel alto");

-- Insert data into the page_matter table
INSERT INTO schooldb.page_matter (page_id, matter_id, qualitative_note, quantitative_note)
VALUES (1, 1, '', 10.0 ), (1, 2, '', 9.8 );

INSERT INTO users (school_id, first_name, last_name, email, password, phone, address, role)
VALUES (1, 'John', 'Doe', 'johndoe@example.com', 'password123', '555-1234', '123 Main St', 'admin');




DESCRIBE school;
DESCRIBE student;
DESCRIBE employee;


SELECT s.id, s.first_name, s.last_name, s.email, s.phone, s.address, s.date_of_birth, s.gender, sch.name as school_name, sch.address as school_address, sch.phone as school_phone
FROM schooldb.student s
INNER JOIN schooldb.school sch ON s.school_id = sch.id;

SELECT n.title, n.body
FROM note n
JOIN subject s ON n.subject_id = s.id
JOIN course c ON s.course_id = c.id
JOIN student st ON c.school_id = st.school_id
WHERE st.id = 1;


SELECT pgm.id, s.id, s.first_name, s.last_name, pg.status, pgm.quantitative_note as note , mt.name, mt.hours, bk.year, bk.name
FROM schooldb.student s
INNER JOIN schooldb.school sc ON s.school_id = sc.id
INNER JOIN schooldb.book bk ON sc.id = bk.school_id
INNER JOIN schooldb.page pg ON s.id = pg.student_id
INNER JOIN schooldb.matter mt ON mt.book_id = bk.id
INNER JOIN schooldb.page_matter pgm ON pgm.matter_id = mt.id
WHERE s.id = 3;


SELECT *
FROM school.book b
INNER JOIN school.matter m ON b.id = m.book_id;