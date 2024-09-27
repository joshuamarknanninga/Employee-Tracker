-- db/seeds.sql

-- Insert Departments
INSERT INTO departments (name) VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Marketing');

-- Insert Roles
INSERT INTO roles (title, salary, department_id) VALUES 
('Software Engineer', 80000, (SELECT id FROM departments WHERE name = 'Engineering')),
('Accountant', 70000, (SELECT id FROM departments WHERE name = 'Finance')),
('HR Manager', 75000, (SELECT id FROM departments WHERE name = 'Human Resources')),
('Marketing Specialist', 65000, (SELECT id FROM departments WHERE name = 'Marketing'));

-- Insert Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', (SELECT id FROM roles WHERE title = 'Software Engineer'), NULL),
('Jane', 'Smith', (SELECT id FROM roles WHERE title = 'Accountant'), NULL),
('Emily', 'Davis', (SELECT id FROM roles WHERE title = 'HR Manager'), NULL),
('Michael', 'Brown', (SELECT id FROM roles WHERE title = 'Marketing Specialist'), NULL),
('Sarah', 'Wilson', (SELECT id FROM roles WHERE title = 'Software Engineer'), 1),
('David', 'Lee', (SELECT id FROM roles WHERE title = 'Software Engineer'), 1);
