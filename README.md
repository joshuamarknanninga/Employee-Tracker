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
- [Walkthrough Video](#walkthrough-video)
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
npm install inquirer@8.2.4
Set up the PostgreSQL database:

Run the schema.sql and seeds.sql files located in the db folder:

bash
Copy code
psql -U postgres -d employee_tracker -f db/schema.sql
psql -U postgres -d employee_tracker -f db/seeds.sql
Replace postgres with your PostgreSQL username if different.

Create a .env file in the root of the project with your PostgreSQL credentials:

bash
Copy code
PG_USER=your_username
PG_HOST=localhost
PG_DATABASE=employee_tracker
PG_PASSWORD=your_password
PG_PORT=5432
Replace your_username and your_password with your actual PostgreSQL credentials.

Ensure .env is listed in your .gitignore file to prevent sensitive information from being pushed to version control:

bash
Copy code
.env
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

Department Table
id: SERIAL PRIMARY KEY
name: VARCHAR(30) UNIQUE NOT NULL
Role Table
id: SERIAL PRIMARY KEY
title: VARCHAR(30) UNIQUE NOT NULL
salary: DECIMAL NOT NULL
department_id: INTEGER NOT NULL (Foreign key to department)
Employee Table
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
View employees by department.
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

markdown
Copy code

---

### Notes:

1. **Database Setup:**
   - Before running the application, ensure that your PostgreSQL database is set up correctly with the necessary tables. Run the `schema.sql` file to create the tables and the `seeds.sql` file to populate them with initial data.
   - Example commands to run these scripts:

     ```bash
     \i db/schema.sql
     \i db/seeds.sql
     ```

     *Replace `postgres` with your PostgreSQL username if different.*

2. **Environment Variables:**
   - Make sure your `.env` file matches the variable names used in your `server.js` and `queries.js`. The example above uses `PG_` prefixes, which align with the PostgreSQL configuration.

3. **Walkthrough Video:**
   - https://www.loom.com/share/2012e2e700f54c959ce08e651576b244?sid=584a88c7-7a78-4e6d-8af1-292a7f34149e

4. **Dependencies:**
   - Ensure all dependencies are installed as per the Installation instructions. This includes `pg`, `inquirer`, `console.table`, and `dotenv`.

5. **Running the Application:**
   - After setting up the database and configuring your environment variables, start the application using:

     ```bash
     node server.js
     ```

   - Follow the on-screen prompts to interact with the Employee Tracker.

6. **License:**
   - Ensure you have a `LICENSE` file in your repository if you mention it in the README.

### Final Checklist:

- [x] **Database Tables Exist:** Ensure `departments`, `roles`, and `employees` tables are created in your PostgreSQL database.
- [x] **Environment Variables Configured:** `.env` file contains correct PostgreSQL credentials.
- [x] **Dependencies Installed:** Run `npm install` and `npm install inquirer@8.2.4`.
- [x] **Database Seeded:** Run `schema.sql` and `seeds.sql` to set up the database.
- [x] **README Updated:** All sections are properly formatted and accurate.
- [x] **Walkthrough Video Linked:** Update the video link in the README.

By following this structured README, users and collaborators will have a clear understan