# Employee Tracker

## Description
The **Employee Tracker** is a command-line application that helps business owners view and manage the departments, roles, and employees in their company. This app utilizes **Node.js**, **Inquirer**, and **PostgreSQL** to interact with a company's employee database.

## Table of Contents
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Features](#features)
- [Bonus Features](#bonus-features)
- [Technologies](#technologies)
- [License](#license)

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
Acceptance Criteria
md
Copy code
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
Installation
Clone the repository:

bash
Copy code
git clone <repository-url>
Install the necessary dependencies:

bash
Copy code
npm install
Install the specific version of Inquirer:

bash
Copy code
npm i inquirer@8.2.4
Set up the PostgreSQL database by running the schema.sql and seeds.sql files located in the db folder.

Create a .env file in the root of the project with your PostgreSQL credentials:

bash
Copy code
PG_USER=<your-postgres-username>
PG_HOST=localhost
PG_DATABASE=<your-database-name>
PG_PASSWORD=<your-password>
PG_PORT=5432
Usage
Start the application by running the following command:

bash
Copy code
node server.js
Choose one of the following options from the menu:

View all departments
View all roles
View all employees
Add a department
Add a role
Add an employee
Update an employee role
Update an employee manager
View employees by department
Delete a department
Delete a role
Delete an employee
View department budgets
Exit
Database Schema
The database schema includes the following tables:

Department Table:

id: SERIAL PRIMARY KEY
name: VARCHAR(30) UNIQUE NOT NULL
Role Table:

id: SERIAL PRIMARY KEY
title: VARCHAR(30) UNIQUE NOT NULL
salary: DECIMAL NOT NULL
department_id: INTEGER NOT NULL (Foreign key to department)
Employee Table:

id: SERIAL PRIMARY KEY
first_name: VARCHAR(30) NOT NULL
last_name: VARCHAR(30) NOT NULL
role_id: INTEGER NOT NULL (Foreign key to role)
manager_id: INTEGER (Foreign key to another employee)
Features
View all departments, roles, and employees in a formatted table.
Add new departments, roles, and employees.
Update an employee's role or manager.
Delete departments, roles, or employees.
View employees by department or manager.
Bonus Features
Update employee managers.
View employees by manager.
View the total utilized budget of a department (sum of salaries).
Delete departments, roles, and employees.
Walkthrough Video
You can find a video walkthrough of the application here: Watch Video

Technologies
Node.js
Inquirer
PostgreSQL
dotenv
pg (Node-Postgres)
console.table (For displaying formatted tables)
License
Licensed under the MIT License. For more details, refer to the LICENSE file in this repository.