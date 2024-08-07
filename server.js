// Import dependencies
const { Client } = require('pg');
const inquirer = require('inquirer');
// const cTable = require('console.table');
require('dotenv').config();
const { 
  showDepartments, 
  showRoles, 
  showEmployees, 
  addDepartment, 
  addRole, 
  addEmployee, 
  updateEmployeeRole, 
  updateEmployeeManager, 
  viewEmployeesByDepartment, 
  deleteDepartment, 
  deleteRole, 
  deleteEmployee, 
  viewDepartmentBudgets 
} = require('./lib/queries');

// PostgreSQL connection setup
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});


// client.connect(err => {
//   if (err) {
//     console.error('Connection error', err.stack);
//     process.exit(1); // Exit the process with an error code
//   } else {
//     console.log('Connected to the database');
//     afterConnection();
//   }
// });


// Main menu prompt
const promptUser = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update an employee manager',
        'View employees by department',
        'Delete a department',
        'Delete a role',
        'Delete an employee',
        'View department budgets',
        'Exit',
    ]
  }]);

  await handleUserAction(action);
};

// Function after connection is established and welcome message is shown
const afterConnection = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE MANAGER         *")
  console.log("*                                 *")
  console.log("***********************************")
  promptUser();
};
const handleUserAction = async (action) => {
  switch (action) {
    case 'View all departments':
      await showDepartments(client);
      break;
    case 'View all roles':
      await showRoles(client);
      break;
    case 'View all employees':
      await showEmployees(client);
      break;
    case 'Add a department':
      await addDepartment(client);
      break;
    case 'Add a role':
      await addRole(client);
      break;
    case 'Add an employee':
      await addEmployee(client);
      break;
    case 'Update an employee role':
      await updateEmployeeRole(client);
      break;
    case 'Update an employee manager':
      await updateEmployeeManager(client);
      break;
    case 'View employees by department':
      await viewEmployeesByDepartment(client);
      break;
    case 'Delete a department':
      await deleteDepartment(client);
      break;
    case 'Delete a role':
      await deleteRole(client);
      break;
    case 'Delete an employee':
      await deleteEmployee(client);
      break;
    case 'View department budgets':
      await viewDepartmentBudgets(client);
      break;
    case 'Exit':
      client.end();
      console.log('Goodbye!');
      break;
    default:
      console.log('Invalid action');
  }
 // Show the main menu again unless exiting
 if (action !== 'Exit') {
  promptUser();
}
};

// Connect to the database and start the application
client.connect()
.then(afterConnection)
.catch(err => console.error('Connection error', err.stack));