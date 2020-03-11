const inquirer = require("inquirer");
const mysql = require( 'mysql' );
require('events').EventEmitter.defaultMaxListeners = 40;

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
    database: "employer_tracker" 
});

startPrompts();

async function startPrompts(){
    const startChoices = ["Add employee",
                          "Add department",
                          "Add role",
                          "View employees",
                          "View departments",
                          "View roles", 
                          "View employees by Role",
                          "View employees by Department",
                          "View all", 
                          "Update Employee","Remove Employee" ];

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
    };
}

async function addEmployee(){

    let roleArray =   await db.query(`SELECT roleId, title FROM role `);
    roleArray = JSON.stringify(roleArray);
    roleArray = JSON.parse(roleArray);

    let roleChoices = [];
    for (var i = 0; i <roleArray.length; i++){
        roleChoices.push(roleArray[i].title);
    }

    const employeeAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "eFirstName",
            message: "What is the first name of Employee?", 
        },
        {
            type: "input", 
            name: "eLastName",
            message: "What is the last name of Employee?", 
        },
        {
            type: "list", 
            name: "roleId",
            message: "What is the role of Employee?", 
            choices: roleChoices

        },
        {
            type: "input",
            name: "managerId",
            message: "What is the manager id number? "
        }
    ]); 

    
    for (var i = 0; i <roleArray.length; i++){
        if(employeeAdded.roleId == roleArray[i].title){
            const addRow = await db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)',
                    [employeeAdded.eFirstName, employeeAdded.eLastName, roleArray[i].roleId, employeeAdded.managerId]
            );
            break;
        }
    }
    
    console.log(`${employeeAdded.eFirstName} ${employeeAdded.eLastName} has been added `);
    Restart();
}

async function addDepartment(){
    const departmentAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "depName",
            message: "Enter the department name", 
        }
    ]); 

    const addRow = await db.query(
        'INSERT INTO department(name) VALUES(?)',
            [departmentAdded.depName]
    );

    console.log(`${departmentAdded.depName} has been added`);
    Restart();
}

async function addRole(){
    let depArray =   await db.query(`SELECT deptId, name FROM department `);
    depArray = JSON.stringify(depArray);
    depArray = JSON.parse(depArray);

    let depChoices = [];
    for (var i = 0; i <depArray.length; i++){
        depChoices.push(depArray[i].name);
    }

    console.log(depChoices);
    const roleAdded = await inquirer.prompt([
        {
            type: "input", 
            name: "roleName",
            message: "Provide the role name.", 
        },
        {
            type: "input", 
            name: "salary",
            message: "What is the salary for this role?", 
        },
        {
            type: "list", 
            name: "deptId",
            message: "What is the name of the department?", 
            choices:depChoices
        }
    ]); 

    for (var i = 0; i <depArray.length; i++){
        if(roleAdded.deptId == depArray[i].name){
            const addRow = await db.query('INSERT INTO role(title, annual_salary, department_id ) VALUES(?,?,?)',
            [roleAdded.roleName, roleAdded.salary, depArray[i].deptId]);
            break;
        }
    }

    console.log(`${roleAdded.roleName} with salary of $${roleAdded.salary} has been added`)
    Restart();
}

async function viewEmployees(){
    const sqlTable = await db.query("Select * FROM employee");
    console.table(sqlTable);

    Restart();

};

async function viewDepartment(){
    const sqlTable = await db.query("SELECT * FROM department");
    console.table(sqlTable);

    Restart();

};

async function viewRoles(){
    const sqlTable = await db.query("SELECT * FROM role");
    console.table(sqlTable);

    Restart();

};

async function viewEmployeesByRoles(){
    const sqlTable = await db.query("SELECT first_name, last_name, title, annual_salary FROM employee LEFT JOIN role ON employee.role_id = role.roleId");
    console.table(sqlTable);

    Restart();   
};

async function viewEmployeesByDepartment(){
    const sqlTable = await db.query("SELECT name, first_name, last_name from department LEFT JOIN role ON role.department_id = department.deptId LEFT JOIN employee ON employee.role_id = role.roleId ");
    console.table(sqlTable);

    Restart();   
};

async function viewAll(){
    const sqlTable = await db.query("SELECT first_name, last_name, title, annual_salary,name FROM employee LEFT JOIN role ON employee.role_id = role.roleId LEFT JOIN department ON role.department_id = department.deptId");
    console.table(sqlTable);
    Restart();

};

async function updateEmployee(){
    let roleUpdate =  await db.query(`SELECT roleId, title FROM role `);
    roleUpdate = JSON.stringify(roleUpdate);
    roleUpdate = JSON.parse(roleUpdate);

    let roleChoices = [];
    
    for (var i = 0; i <roleUpdate.length; i++){
        roleChoices.push(roleUpdate[i].title);
    }

    const updateEmployeeRole = await inquirer.prompt([
        {
            type: "input", 
            name: "firstName",
            message: "Provide the first name of the employee you would like to update.", 
        },
        {
            type: "list", 
            name: "updateroleId",
            message: "What do you want to update the employee's role to?", 
            choices: roleChoices
        }
    ]);
    
    userName = updateEmployeeRole.firstName;
    updateRole = updateEmployeeRole.updateroleId;

    for (var i = 0; i <roleUpdate.length; i++){
        if(updateRole == roleUpdate[i].title){
            const addRow = await db.query("UPDATE employee SET role_id=? WHERE first_name=?", [roleUpdate[i].roleId, userName]);
            break;
        }
    }
    console.log(`${userName}'s role has been updated.`)
    Restart();
}

async function removeEmployee(){
    let employeeName =  await db.query(`SELECT first_name FROM employee `);
    employeeName = JSON.stringify(employeeName);
    employeeName = JSON.parse(employeeName);

    let employeeChoices = [];
    
    for (var i = 0; i <employeeName.length; i++){
        employeeChoices.push(employeeName[i].first_name);
    }

    const removeSql = await inquirer.prompt([
        {
            type: "list", 
            name: "eFirstName",
            message: "Who would you like to remove?",
            choices: employeeChoices
        }
    ]);

    for (var i = 0; i <employeeChoices.length; i++){
        if(removeSql.eFirstName == employeeName[i].first_name){
            const deletedEmp = await db.query("DELETE FROM employee WHERE first_name=?",[removeSql.eFirstName]);
            break;
        }
    }
    
    console.log(`${removeSql.eFirstName} has been removed.`);
    Restart();
}

async function Restart(){
    const askUser = await inquirer.prompt([
        {
            type: "input",
            message: "Restart?",
            name: "userConfirm"
        }
    ]);

    if(askUser.userConfirm == "yes"){
        return startPrompts();
    }else{
        process.exit;
    }
}
