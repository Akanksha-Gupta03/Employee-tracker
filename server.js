const express = require('express');
const inquirer = require('inquirer');

const PORT = process.env.PORT ||8080;

const app = express();
app.use(express.urlencoded({extended: true}));
// Managers questions
async function main(){
   
    const questions1 = await inquirer.prompt([
        {
            type:"list",
            message:"What would you like to do?",
            name:"userChoice",
            choices: ["Add","View","Update"]
        }
    ])
    if(questions1.name == "Add"){
        const quesAdd = await inquirer.prompt([
            {
                type:"list",
                message:"What would you like to add?",
                name:"userChoice",
                choices: ["Department","Role","Employees"]
            }
        ]);


        if(quesAdd.name == "Department"){
            const quesDept = await inquirer.prompt([  
                {
                    type:"input",
                    message:"What is the name of the department that you would like to add?",
                    name:"department"
                    
                } 
            ])
        }else if(quesAdd.name == "Role"){
            
        }

    }else if(questions1.name == "View"){
        const questions2 = await inquirer.prompt([
            {
                type:"list",
                message:"What would you like to View?",
                name:"userChoice",
                choices: ["Department","Role","Employees","All"]
            }
        ])

    }else {
        const questions2 = await inquirer.prompt([
            {
                type:"list",
                message:"What would you like to update employee ?",
                name:"userChoice",
                choices: ["Department","Role","Employees"]
            }
        ])
    }
}

       