DROP DATABASE IF EXISTS employer_tracker;

CREATE DATABASE employer_tracker;
USE employer_tracker;

CREATE TABLE department (
	deptId INT PRIMARY KEY auto_increment,
	name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
	roleId INT PRIMARY KEY auto_increment ,
	title VARCHAR(30) NOT NULL,
	annual_salary DECIMAL,
	department_id INT,
	FOREIGN KEY (department_id) REFERENCES department(deptId)
);

CREATE TABLE employee (
	employee_id INT PRIMARY KEY auto_increment,
	first_name VARCHAR(30) NOT NULL ,
	last_name VARCHAR(30) NOT NULL,
	role_id INT NOT NULL,
	manager_id INT,
	FOREIGN KEY (role_id) REFERENCES role(roleId)
);

INSERT INTO department(name) VALUES("HR");
INSERT INTO department(name) VALUES("IT");
INSERT INTO department(name) VALUES("Sales");
INSERT INTO department(name) VALUES("Accounting");



INSERT INTO role(title, annual_salary, department_id) VALUES("HR representative", "60453", "1");
INSERT INTO role(title, annual_salary, department_id) VALUES("HR analyst", "89786", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("HR Tech Lead", "120000", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("IT Manager", "156347", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("IT Consultant", "166584", "1");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Director", "974677", "4");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Analyst", "55467", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Manager", "55647", "3");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Consultant", "77565", "2");
INSERT INTO role(title, annual_salary, department_id) VALUES("Sales Trainer", "56475", "4");
INSERT INTO role(title, annual_salary, department_id) VALUES("Accountant", "77583", "4");
INSERT INTO role(title, annual_salary, department_id) VALUES("Technical Support", "78797", "5");
INSERT INTO role(title, annual_salary, department_id) VALUES("Data Analyst", "67581", "2");






INSERT INTO employee(first_name, last_name, role_id) VALUES("Akanksha", "Gupta", "1");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Norma", "Moras", "2");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Sara", "Munir", "3");
INSERT INTO employee(first_name, last_name, role_id) VALUES("Joanna", "Santhosh", "4");




SELECT first_name, last_name, title, annual_salary,name FROM employee 
LEFT JOIN role ON employee.role_id = role.roleId
LEFT JOIN department ON role.department_id = department.deptId;

SELECT first_name, last_name, title, annual_salary FROM employee LEFT JOIN role ON employee.role_id = role.roleId;

SELECT name, first_name, last_name from department LEFT JOIN role ON role.department_id = department.deptId LEFT JOIN employee ON employee.role_id = role.roleId ;