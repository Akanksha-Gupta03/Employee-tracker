DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;
USE employee_tracker;

CREATE TABLE department (
	depId INT PRIMARY KEY auto_increment,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
	roleId INT PRIMARY KEY auto_increment ,
	title VARCHAR(30) NOT NULL,
	annual_salary DECIMAL,
	department_id INT,
	FOREIGN KEY (department_id) REFERENCES department(depId)
);

CREATE TABLE employee (
	employee_id INT PRIMARY KEY auto_increment,
	first_name VARCHAR(30) NOT NULL ,
	last_name VARCHAR(30) NOT NULL,
	role_id INT NOT NULL,
	manager_id INT,
	FOREIGN KEY (role_id) REFERENCES role(roleId)
	-- FOREIGN KEY (manager_id) REFERENCES role(roleId) 
);

INSERT INTO department(name) VALUES("HR");
INSERT INTO department(name) VALUES("IT");
INSERT INTO department(name) VALUES("Sales");
INSERT INTO department(name) VALUES("Accounting");

INSERT INTO role(title, annual_salary, department_id) VALUES("HR Tech Lead", "126920", "1");
INSERT INTO role(title, annual_salary, department_id) VALUES("HR representative", "60000", "1");
INSERT INTO role(title, annual_salary, department_id) VALUES("HR analyst", "70057", "1");
INSERT INTO role(title, annual_salary, department_id) VALUES("IT Manager", "114536", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("IT Consultant", "127753", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Director", "98734", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Analyst", "89549", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Engineer", "65469", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Consultant", "51723", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Trainer", "68743", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("Accountant", "53278", "4");
INSERT INTO role(title, annual_salary, department_id) VALUES("Technical Support", "87965", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("Data Analyst", "67675", "2");


INSERT INTO employee(first_name, last_name, role_id) VALUES("Akanksha", "Gupta", "2");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Norma", "Moras", "3");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Joanna", "Santhosh", "4");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Sara", "Munir", "5");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Stephanie", "Blom", "6");


SELECT first_name, last_name, title, annual_salary,name FROM employee 
LEFT JOIN role ON employee.role_id = role.roleId
LEFT JOIN department ON role.department_id = department.depId;

SELECT first_name, last_name, title, annual_salary FROM employee LEFT JOIN role ON employee.role_id = role.roleId;

SELECT name, first_name, last_name from department LEFT JOIN role ON role.department_id = department.depId LEFT JOIN employee ON employee.role_id = role.roleId ;