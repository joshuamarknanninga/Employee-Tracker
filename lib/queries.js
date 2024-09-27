// lib/queries.js

const inquirer = require('inquirer');
const cTable = require('console.table'); // Ensure you have this installed

// Show all departments
const showDepartments = async (client) => {
  try {
    const res = await client.query('SELECT id, name FROM departments ORDER BY id');
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching departments:', err);
  }
};

// Show all roles
const showRoles = async (client) => {
  try {
    const res = await client.query(`
      SELECT roles.id, roles.title, departments.name AS department, roles.salary
      FROM roles
      LEFT JOIN departments ON roles.department_id = departments.id
      ORDER BY roles.id
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching roles:', err);
  }
};

// Show all employees
const showEmployees = async (client) => {
  try {
    const res = await client.query(`
      SELECT e.id, e.first_name, e.last_name, roles.title, departments.name AS department, roles.salary, 
             CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles ON e.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees m ON e.manager_id = m.id
      ORDER BY e.id
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
  }
};

// Add a new department
const addDepartment = async (client) => {
  try {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
        validate: (input) => input.trim() !== '' || 'Department name cannot be empty.',
      },
    ]);

    await client.query('INSERT INTO departments (name) VALUES ($1)', [name.trim()]);
    console.log(`Department "${name}" added successfully.`);
  } catch (err) {
    console.error('Error adding department:', err);
  }
};

// Add a new role
const addRole = async (client) => {
  try {
    // Fetch existing departments for selection
    const departmentsRes = await client.query('SELECT id, name FROM departments ORDER BY id');
    const departments = departmentsRes.rows.map(dept => ({ name: dept.name, value: dept.id }));

    if (departments.length === 0) {
      console.log('No departments found. Please add a department first.');
      return;
    }

    const { title, salary, department_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:',
        validate: (input) => input.trim() !== '' || 'Role title cannot be empty.',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the new role:',
        validate: (input) => !isNaN(input) && input > 0 || 'Please enter a valid positive number.',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the new role:',
        choices: departments,
      },
    ]);

    await client.query(
      'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
      [title.trim(), salary, department_id]
    );
    console.log(`Role "${title}" added successfully.`);
  } catch (err) {
    console.error('Error adding role:', err);
  }
};

// Add a new employee
const addEmployee = async (client) => {
  try {
    // Fetch existing roles for selection
    const rolesRes = await client.query('SELECT id, title FROM roles ORDER BY id');
    const roles = rolesRes.rows.map(role => ({ name: role.title, value: role.id }));

    if (roles.length === 0) {
      console.log('No roles found. Please add a role first.');
      return;
    }

    // Fetch existing employees to choose a manager
    const employeesRes = await client.query('SELECT id, first_name, last_name FROM employees ORDER BY id');
    const managers = employeesRes.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
    managers.unshift({ name: 'None', value: null }); // Option for no manager

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
        validate: (input) => input.trim() !== '' || 'First name cannot be empty.',
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
        validate: (input) => input.trim() !== '' || 'Last name cannot be empty.',
      },
      {
        type: 'list',
        name: 'role_id',
        message: "Select the employee's role:",
        choices: roles,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: "Select the employee's manager:",
        choices: managers,
      },
    ]);

    await client.query(
      'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name.trim(), last_name.trim(), role_id, manager_id]
    );
    console.log(`Employee "${first_name} ${last_name}" added successfully.`);
  } catch (err) {
    console.error('Error adding employee:', err);
  }
};

// Update an employee's role
const updateEmployeeRole = async (client) => {
  try {
    // Fetch existing employees
    const employeesRes = await client.query('SELECT id, first_name, last_name FROM employees ORDER BY id');
    const employees = employeesRes.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    if (employees.length === 0) {
      console.log('No employees found.');
      return;
    }

    // Fetch existing roles
    const rolesRes = await client.query('SELECT id, title FROM roles ORDER BY id');
    const roles = rolesRes.rows.map(role => ({ name: role.title, value: role.id }));

    if (roles.length === 0) {
      console.log('No roles found. Please add a role first.');
      return;
    }

    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee whose role you want to update:',
        choices: employees,
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role:',
        choices: roles,
      },
    ]);

    await client.query(
      'UPDATE employees SET role_id = $1 WHERE id = $2',
      [role_id, employee_id]
    );
    console.log('Employee role updated successfully.');
  } catch (err) {
    console.error('Error updating employee role:', err);
  }
};

// Update an employee's manager
const updateEmployeeManager = async (client) => {
  try {
    // Fetch existing employees
    const employeesRes = await client.query('SELECT id, first_name, last_name FROM employees ORDER BY id');
    const employees = employeesRes.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    if (employees.length === 0) {
      console.log('No employees found.');
      return;
    }

    const { employee_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee whose manager you want to update:',
        choices: employees,
      },
    ]);

    // Exclude the selected employee from potential managers to prevent self-reference
    const potentialManagers = employees.filter(emp => emp.value !== employee_id);
    potentialManagers.unshift({ name: 'None', value: null }); // Option for no manager

    const { manager_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the new manager:',
        choices: potentialManagers,
      },
    ]);

    await client.query(
      'UPDATE employees SET manager_id = $1 WHERE id = $2',
      [manager_id, employee_id]
    );
    console.log('Employee manager updated successfully.');
  } catch (err) {
    console.error('Error updating employee manager:', err);
  }
};

// View employees by department
const viewEmployeesByDepartment = async (client) => {
  try {
    // Fetch existing departments
    const departmentsRes = await client.query('SELECT id, name FROM departments ORDER BY id');
    const departments = departmentsRes.rows.map(dept => ({ name: dept.name, value: dept.id }));

    if (departments.length === 0) {
      console.log('No departments found.');
      return;
    }

    const { department_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department to view its employees:',
        choices: departments,
      },
    ]);

    const res = await client.query(`
      SELECT e.id, e.first_name, e.last_name, roles.title, roles.salary, 
             CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles ON e.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE departments.id = $1
      ORDER BY e.id
    `, [department_id]);

    if (res.rows.length === 0) {
      console.log('No employees found in this department.');
    } else {
      console.table(res.rows);
    }
  } catch (err) {
    console.error('Error viewing employees by department:', err);
  }
};

// Delete a department
const deleteDepartment = async (client) => {
  try {
    // Fetch existing departments
    const departmentsRes = await client.query('SELECT id, name FROM departments ORDER BY id');
    const departments = departmentsRes.rows.map(dept => ({ name: dept.name, value: dept.id }));

    if (departments.length === 0) {
      console.log('No departments to delete.');
      return;
    }

    const { department_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department to delete:',
        choices: departments,
      },
    ]);

    // Optional: Confirm deletion
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete this department? All associated roles and employees will also be deleted.',
        default: false,
      },
    ]);

    if (!confirm) {
      console.log('Deletion cancelled.');
      return;
    }

    // Delete the department (assuming ON DELETE CASCADE is set up in your foreign keys)
    await client.query('DELETE FROM departments WHERE id = $1', [department_id]);
    console.log('Department deleted successfully.');
  } catch (err) {
    console.error('Error deleting department:', err);
  }
};

// Delete a role
const deleteRole = async (client) => {
  try {
    // Fetch existing roles
    const rolesRes = await client.query('SELECT id, title FROM roles ORDER BY id');
    const roles = rolesRes.rows.map(role => ({ name: role.title, value: role.id }));

    if (roles.length === 0) {
      console.log('No roles to delete.');
      return;
    }

    const { role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role to delete:',
        choices: roles,
      },
    ]);

    // Optional: Confirm deletion
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete this role? All associated employees will also be deleted.',
        default: false,
      },
    ]);

    if (!confirm) {
      console.log('Deletion cancelled.');
      return;
    }

    // Delete the role (assuming ON DELETE CASCADE is set up in your foreign keys)
    await client.query('DELETE FROM roles WHERE id = $1', [role_id]);
    console.log('Role deleted successfully.');
  } catch (err) {
    console.error('Error deleting role:', err);
  }
};

// Delete an employee
const deleteEmployee = async (client) => {
  try {
    // Fetch existing employees
    const employeesRes = await client.query('SELECT id, first_name, last_name FROM employees ORDER BY id');
    const employees = employeesRes.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    if (employees.length === 0) {
      console.log('No employees to delete.');
      return;
    }

    const { employee_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to delete:',
        choices: employees,
      },
    ]);

    // Optional: Confirm deletion
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Are you sure you want to delete this employee?',
        default: false,
      },
    ]);

    if (!confirm) {
      console.log('Deletion cancelled.');
      return;
    }

    // Delete the employee
    await client.query('DELETE FROM employees WHERE id = $1', [employee_id]);
    console.log('Employee deleted successfully.');
  } catch (err) {
    console.error('Error deleting employee:', err);
  }
};

// View department budgets (sum of salaries)
const viewDepartmentBudgets = async (client) => {
  try {
    const res = await client.query(`
      SELECT departments.name AS department, SUM(roles.salary) AS utilized_budget
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      GROUP BY departments.name
      ORDER BY departments.name
    `);
    
    console.table(res.rows);
  } catch (err) {
    console.error('Error viewing department budgets:', err);
  }
};

// View employees by manager
const viewEmployeesByManager = async (client) => {
  try {
    // Fetch managers (employees who are managers)
    const managersRes = await client.query(`
      SELECT DISTINCT m.id, m.first_name, m.last_name
      FROM employees e
      INNER JOIN employees m ON e.manager_id = m.id
      ORDER BY m.id
    `);
    const managers = managersRes.rows.map(mgr => ({ name: `${mgr.first_name} ${mgr.last_name}`, value: mgr.id }));

    if (managers.length === 0) {
      console.log('No managers found.');
      return;
    }

    const { manager_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager to view their employees:',
        choices: managers,
      },
    ]);

    const res = await client.query(`
      SELECT e.id, e.first_name, e.last_name, roles.title, departments.name AS department, roles.salary
      FROM employees e
      LEFT JOIN roles ON e.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      WHERE e.manager_id = $1
      ORDER BY e.id
    `, [manager_id]);

    if (res.rows.length === 0) {
      console.log('No employees found under this manager.');
    } else {
      console.table(res.rows);
    }
  } catch (err) {
    console.error('Error viewing employees by manager:', err);
  }
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
  viewEmployeesByManager, // Bonus Feature
};
