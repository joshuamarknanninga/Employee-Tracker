const inquirer = require('inquirer');

const showDepartments = async (client) => {
  try {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
  }
};

/**
 * Displays a table of all roles, including their ids, titles, salaries, and
 * departments.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const showRoles = async (client) => {
  const res = await client.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  console.table(res.rows);
};

/**
 * Displays a table of all employees, including their ids, first names, last
 * names, job titles, departments, salaries, and managers.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const showEmployees = async (client) => {
  const res = await client.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `);
  console.table(res.rows);
};

/**
 * Retrieves all roles associated with the given department.
 *
 * @param {Client} client - A PostgreSQL client instance.
 * @param {Number} departmentId - The id of the department to search for roles in.
 * @returns {Promise<Object[]>} Resolves with an array of objects, each with an `id` and a `title` property.
 */
const getRolesByDepartment = async (client, departmentId) => {
  const res = await client.query(`
    SELECT id, title
    FROM role
    WHERE department_id = $1
  `, [departmentId]);
  return res.rows;
};

/**
 * Prompts the user for a department name and adds it to the database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const addDepartment = async (client) => {
  const { name } = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Enter the name of the department:' },
  ]);
  await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
  console.log(`Added department: ${name}`);
};

/**
 * Prompts the user for a role name, salary, and department, and adds it to the
 * database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const addRole = async (client) => {
  try {
    const departments = await client.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({
      name: department.name,
      value: department.id,
    }));
    const { title, salary, department_id } = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Enter the name of the role:' },
      { 
        type: 'input', 
        name: 'salary', 
        message: 'Enter the salary for the role:', 
        validate: input => !isNaN(input) || 'Please enter a valid number'
      },
      { type: 'list', name: 'department_id', message: 'Select the department for the role:', choices: departmentChoices },
    ]);
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role: ${title}`);
  } catch (err) {
    console.error('Error adding role:', err);
  }
};

/**
 * Prompts the user for an employee's first name, last name, role, and manager,
 * and adds the employee to the database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const addEmployee = async (client) => {
  const roles = await client.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
  const employees = await client.query('SELECT * FROM employee');
  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  managerChoices.unshift({ name: 'None', value: null });
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { type: 'input', name: 'first_name', message: 'Enter the first name of the employee:' },
    { type: 'input', name: 'last_name', message: 'Enter the last name of the employee:' },
    { type: 'list', name: 'role_id', message: 'Select the role for the employee:', choices: roleChoices },
    { type: 'list', name: 'manager_id', message: 'Select the manager for the employee:', choices: managerChoices },
  ]);
  await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
  console.log(`Added employee: ${first_name} ${last_name}`);
};

/**
 * Prompts the user to select an employee and a new role, and then updates
 * the employee's role in the database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const updateEmployeeRole = async (client) => {
  const employees = await client.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  const roles = await client.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
  const { employee_id, role_id } = await inquirer.prompt([
    { type: 'list', name: 'employee_id', message: 'Select the employee to update:', choices: employeeChoices },
    { type: 'list', name: 'role_id', message: 'Select the new role for the employee:', choices: roleChoices },
  ]);
  await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log(`Updated employee's role`);
};


/**
 * Prompts the user to select an employee and a new manager, and then updates
 * the employee's manager in the database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const updateEmployeeManager = async (client) => {
  const employees = await client.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  const managerChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  managerChoices.unshift({ name: 'None', value: null });
  const { employee_id, manager_id } = await inquirer.prompt([
    { type: 'list', name: 'employee_id', message: 'Select the employee to update:', choices: employeeChoices },
    { type: 'list', name: 'manager_id', message: 'Select the new manager for the employee:', choices: managerChoices },
  ]);
  await client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [manager_id, employee_id]);
  console.log(`Updated employee's manager`);
};

// Insert new employee into database
await client.query(
  'INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)',
  [firstName, lastName, roleId]
);

/**
 * Prompts the user to select a department and then displays all employees in
 * that department in a formatted table.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const viewEmployeesByDepartment = async (client) => {
  const departments = await client.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id,
  }));
  const { department_id } = await inquirer.prompt([
    { type: 'list', name: 'department_id', message: 'Select the department to view employees:', choices: departmentChoices },
  ]);
  const res = await client.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    JOIN role ON employee.role_id = role.id
    WHERE role.department_id = $1
  `, [department_id]);
  console.table(res.rows);
};


/**
 * Prompts the user to select a department and then deletes it from the
 * database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const deleteDepartment = async (client) => {
  const departments = await client.query('SELECT * FROM department');
  const departmentChoices = departments.rows.map(department => ({
    name: department.name,
    value: department.id,
  }));
  const { department_id } = await inquirer.prompt([
    { type: 'list', name: 'department_id', message: 'Select the department to delete:', choices: departmentChoices },
  ]);
  await client.query('DELETE FROM department WHERE id = $1', [department_id]);
  console.log(`Deleted department`);
};

/**
 * Prompts the user to select a role and then deletes it from the database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const deleteRole = async (client) => {
  const roles = await client.query('SELECT * FROM role');
  const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));
  const { role_id } = await inquirer.prompt([
    { type: 'list', name: 'role_id', message: 'Select the role to delete:', choices: roleChoices },
  ]);
  await client.query('DELETE FROM role WHERE id = $1', [role_id]);
  console.log(`Deleted role`);
};

/**
 * Prompts the user to select an employee and then deletes it from the
 * database.
 *
 * @param {Client} client - A PostgreSQL client instance.
 */
const deleteEmployee = async (client) => {
  const employees = await client.query('SELECT * FROM employee');
  const employeeChoices = employees.rows.map(employee => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id,
  }));
  const { employee_id } = await inquirer.prompt([
    { type: 'list', name: 'employee_id', message: 'Select the employee to delete:', choices: employeeChoices },
  ]);
  await client.query('DELETE FROM employee WHERE id = $1', [employee_id]);
  console.log(`Deleted employee`);
};

const viewDepartmentBudgets = async (client) => {
  const res = await client.query(`
    SELECT department.name AS department, SUM(role.salary) AS budget
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    GROUP BY department.name
  `);
  console.table(res.rows);
};

module.exports = {
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
  viewDepartmentBudgets,
};
