-- Inserted departments
INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('Finance');

-- Inserted roles
INSERT INTO role (title, salary, department_id) VALUES
('Sales Associate', 60000.00, 1),
('Sales Manager', 100000.00, 1),
('Software Engineer', 85000.00, 2),
('Senior Software Engineer', 115000.00, 2),
('Accountant', 70000.00, 3),
('Financial Analyst', 80000.00, 3);

-- Inserted employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Santiao', 'Palacio', 1, NULL),
('Juan', 'Gonzalez', 2, NULL),
('Alex', 'Johnson', 3, 1),
('Sandra', 'Salazar', 4, 2),
('Chris', 'Brown', 5, 3),
('Sarah', 'Wilson', 6, 3);
