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
    database: "employer_tracker" 
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

