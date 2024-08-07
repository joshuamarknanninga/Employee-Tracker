-- Insert departments
INSERT INTO department (name) VALUES 
('Engineering'), 
('Finance'), 
('Human Resources'), 
('Marketing'), 
('Sales'), 
('IT Support');

-- Insert roles
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 70000, 1),
('Senior Software Engineer', 90000, 1),
('Junior Software Engineer', 50000, 1),
('Accountant', 60000, 2),
('Senior Accountant', 80000, 2),
('HR Specialist', 50000, 3),
('HR Manager', 75000, 3),
('Marketing Specialist', 55000, 4),
('Marketing Manager', 85000, 4),
('Sales Representative', 50000, 5),
('Sales Manager', 80000, 5),
('IT Support Specialist', 45000, 6),
('IT Manager', 70000, 6);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 4, NULL),
('Mike', 'Johnson', 6, NULL),
('Emily', 'Davis', 2, 1),
('James', 'Brown', 3, 2),
('Sarah', 'Wilson', 5, 4),
('David', 'Lee', 7, 3),
('Sophia', 'Martinez', 8, NULL),
('Daniel', 'Garcia', 9, 8),
('Emma', 'Hernandez', 10, NULL),
('Olivia', 'Lopez', 11, 10),
('Liam', 'Gonzalez', 12, NULL),
('Mason', 'Perez', 13, 12);
