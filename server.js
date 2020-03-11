const inquirer = require("inquirer");
const mysql = require( 'mysql' );
require('events').EventEmitter.defaultMaxListeners = 15;

//connection to my sql
class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args=[] ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

const db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "akanksha12",
    database: "employee_tracker" 
});

startPrompts();

async function startPrompts(){
    const startChoices = ["Add employee","Add department","Add role","View employees", "View departments", "View roles", "View employees by Role","View employees by Department","View all", "Update Employee","Remove Employee" ];
    const quesFirst = await inquirer.prompt([
        {
            type: "list", 
            name: "userChoice",
            message: "What would you like to do?", 
            choices: startChoices
        }
    ]);

    switch(quesFirst.userChoice){
        case ("Add employee"):
            return addEmployee();
        case ("Add department"):
            return addDepartment();
        case ("Add role"):
            return addRole();
        case ("View employees"):
            return viewEmployees();
        case ("View departments"):
            return viewDepartment();
        case ("View roles"):
            return viewRoles();
        case ("View employees by Role"):
            return viewEmployeesByRoles();
        case ("View employees by Department"):
            return viewEmployeesByDepartment();
        case ("View all"):
            return viewAll();
        case ("Update Employee"):
            return updateEmployee();
        case ("Remove Employee"):
            return removeEmployee();
    }  
}

async function addEmployee(){
    const employeeAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "eFirstName",
            message: "What is the employee's first name?", 
        },
        {
            type: "input", 
            name: "eLastName",
            message: "What is the employee's last name?", 
        },
        {
            type: "input", 
            name: "roleId",
            message: "What is the employee's role id number?", 
        },
        {
            type: "input",
            name: "managerId",
            message: "What is the manager id number? "
        }
    ]); 
    const insertRow = await db.query(
        'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)',
            [employeeAdded.eFirstName, employeeAdded.eLastName, employeeAdded.roleId, employeeAdded.managerId]
    );
    
    console.log(`${employeeAdded.eFirstName} ${employeeAdded.eLastName} has been added `);
    startAgain();
}

async function addDepartment(){
    const departmentAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "depName",
            message: "Provide the name of the department", 
        }
    ]); 

    const insertRow = await db.query(
        'INSERT INTO department(name) VALUES(?)',
            [departmentAdded.depName]
    );

    console.log(`${departmentAdded.depName} has been added`);
    startAgain();
}

async function addRole(){
    const roleAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "roleName",
            message: "Provide the role name.", 
        },
        {
            type: "input", 
            name: "salary",
            message:  "What is the salary for this role?", 
        },
        {
            type: "input", 
            name: "deptId",
            message: "What is the department id number?", 
        }
    ]); 

    const insertRow = await db.query(
        'INSERT INTO role(title, yearly_salary, department_id ) VALUES(?,?,?)',
            [roleAdded.roleName, roleAdded.salary, roleAdded.deptId]
    );

    console.log(`${roleAdded.roleName} with salary of $${roleAdded.salary}has been added`)
    
    startAgain();

}

