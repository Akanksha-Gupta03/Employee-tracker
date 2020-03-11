const inquirer = require("inquirer");
const mysql = require( 'mysql' );
require('events').EventEmitter.defaultMaxListeners = 15;

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
            message: "Enter the first name of employee", 
        },
        {
            type: "input", 
            name: "eLastName",
            message: "Enter the last name of employee?", 
        },
        {
            type: "input", 
            name: "roleId",
            message: "What is the role id number of employee?", 
        },
        {
            type: "input",
            name: "managerId",
            message: "What is the manager id number? "
        }
    ]); 
    const addRow = await db.query(
        'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)',
            [employeeAdded.eFirstName, employeeAdded.eLastName, employeeAdded.roleId, employeeAdded.managerId]
    );
    
    console.log(`${employeeAdded.eFirstName} ${employeeAdded.eLastName} has been added `);
    startApp();
}

async function addDepartment(){
    const departmentAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "depName",
            message: "Provide the name of the department", 
        }
    ]); 

    const addRow = await db.query(
        'INSERT INTO department(name) VALUES(?)',
            [departmentAdded.depName]
    );

    console.log(`${departmentAdded.depName} has been added`);
    startApp();
}

async function addRole(){
    const roleAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "roleName",
            message: "Enter the role name.", 
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

    const addRow = await db.query(
        'INSERT INTO role(title, annual_salary, department_id ) VALUES(?,?,?)',
            [roleAdded.roleName, roleAdded.salary, roleAdded.deptId]
    );

     console.log(`${roleAdded.roleName} with salary of $${roleAdded.salary}has been added`)
    
    startApp();

}
async function viewEmployees(){
    const sqlTable = await db.query("Select * FROM employee");
    console.table(sqlTable);

    startApp();

};

async function viewDepartment(){
    const sqlTable = await db.query("SELECT * FROM department");
    console.table(sqlTable);

    startApp();

};
async function viewRoles(){
    const sqlTable = await db.query("SELECT * FROM role");
    console.table(sqlTable);

    startApp();

};

async function viewEmployeesByRoles(){
    const sqlTable = await db.query("SELECT first_name, last_name, title, annual_salary FROM employee LEFT JOIN role ON employee.role_id = role.roleId");
    console.table(sqlTable);

    startApp();   
};
async function viewEmployeesByDepartment(){
    const sqlTable = await db.query("SELECT name, first_name, last_name from department LEFT JOIN role ON role.department_id = department.depId LEFT JOIN employee ON employee.role_id = role.roleId ");
    console.table(sqlTable);

    startApp();   
};

async function viewAll(){
    const sqlTable = await db.query("SELECT first_name, last_name, title, annual_salary,name FROM employee LEFT JOIN role ON employee.role_id = role.roleId LEFT JOIN department ON role.department_id = department.depId");
    console.table(sqlTable);
    startApp();

};


async function updateEmployee(){
    const updateEmployeeRole = await inquirer.prompt([
        {
            type: "list", 
            name: "eFirstName",
            message: "Who would you like to update?", 
        },
        {
            type: "input", 
            name: "updateRoleId",
            message: "What do you want to update the employee's role to?", 
        }
    ]);
    
    userUpdateName = updateEmployeeRole.eFirstName;
    updateRole = updateEmployeeRole.updateRoleId;
    const updatedTable = await db.query("UPDATE employee SET role_id=? WHERE first_name=?", [updateRole, userUpdateName]);

    console.log(`${updateEmployeeRole.eFirstName}'s role has been updated.`)
    startApp();

}

async function removeEmployee(){
    const removeSql = await inquirer.prompt([
        {
            type: "input", 
            name: "eFirstName",
            message: "Who would you like to remove?"
        }
    ]);

    const deletedEmp = await db.query("DELETE FROM employee WHERE first_name=?",[removeSql.eFirstName]);


    console.log(`${removeSql.eFirstName} has been removed.`)
}
async function startApp(){
    const askUser = await inquirer.prompt([
        {
            type: "input",
            message: "Restart ?",
            name: "userConfirm"
        }
    ]);

    if(askUser.userConfirm == "yes"){
        return startPrompts();
    }else{
        process.exit;
    }
}

