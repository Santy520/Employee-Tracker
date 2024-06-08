const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const { table } = require('table');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_db'
};

// Function to connect to the database
async function connectToDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Function to view all departments
async function viewDepartments(connection) {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM department');
    console.log(table([fields.map(field => field.name), ...rows.map(row => Object.values(row))]));
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

// Function to view all roles
async function viewRoles(connection) {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM role');
    console.log(table([fields.map(field => field.name), ...rows.map(row => Object.values(row))]));
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

// Function to view all employees
async function viewEmployees(connection) {
  try {
    const [rows, fields] = await connection.query('SELECT * FROM employee');
    console.log(table([fields.map(field => field.name), ...rows.map(row => Object.values(row))]));
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

// Function to add departments
async function addDepartment(connection) {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?'
      }
    ]);
    
    await connection.query('INSERT INTO department (name) VALUES (?)', departmentName);
    console.log(`Added department "${departmentName}" to the database.`);
    await start(connection);
  } catch (error) {
    console.error('Error adding department:', error);
  }
}

// Function to add roles
async function addRole(connection) {
  try {
    const { title, salary, departmentId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the new role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role:'
      },
      {
        type: 'input',
        name: 'departmentId',
        message: 'Enter the department ID for the new role:'
      }
    ]);
    
    await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    console.log(`Added role "${title}" to the database.`);
    await start(connection);
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

// Function to add employees
async function addEmployee(connection) {
  try {
    // Fetch existing roles from the database
    const [roles] = await connection.query('SELECT id, title FROM role');

    // Prepare choices for role selection prompt
    const roleChoices = roles.map(role => ({
      name: `${role.title} (ID: ${role.id})`,
      value: role.id
    }));

    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:"
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:"
      },
      {
        type: 'list',
        name: 'roleId',
        message: "Select the employee's role:",
        choices: roleChoices
      },
      {
        type: 'input',
        name: 'managerId',
        message: "Enter the employee's manager ID:"
      }
    ]);

    // Insert the new employee into the database
    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, managerId]);
    console.log(`Added employee "${firstName} ${lastName}" to the database.`);
    await start(connection);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}

// Function to update employees
async function updateEmployee(connection) {
  try {
    const [employees] = await connection.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id
    }));

    const { employeeId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee you want to update:',
        choices: employeeChoices
      }
    ]);

    const { firstName, lastName, roleId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter the new first name for the employee:'
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter the new last name for the employee:'
      },
      {
        type: 'input',
        name: 'roleId',
        message: 'Enter the new role ID for the employee:'
      }
    ]);

    // Check if the provided role ID exists in the role table
    const [roleExists] = await connection.query('SELECT id FROM role WHERE id = ?', roleId);
    if (roleExists.length === 0) {
      console.log('Error: The provided role ID does not exist.');
      await start(connection);
      return;
    }

    // Update the employee in the database
    const [result] = await connection.query('UPDATE employee SET first_name = ?, last_name = ?, role_id = ? WHERE id = ?', [firstName, lastName, roleId, employeeId]);

    console.log(`Updated employee with ID ${employeeId} in the database.`);
    await start(connection);
  } catch (error) {
    console.error('Error updating employee:', error);
  }
}


// Function to start the application
async function start(connection) {
  try {
    // Presented options to the user
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'Add Department',
          'View all roles',
          'Add Role',
          'View all employees',
          'Add Employee',
          'Update Employee',
          'Exit'
        ]
      }
    ]);

    // Performed actions based on user choice
    switch (choice) {
      case 'View all departments':
        await viewDepartments(connection);
        break;
      case 'Add Department':
        await addDepartment(connection);
        break;
      case 'View all roles':
        await viewRoles(connection);
        break;
      case 'Add Role':
        await addRole(connection);
        break;
      case 'View all employees':
        await viewEmployees(connection);
        break;
      case 'Add Employee':
        await addEmployee(connection);
        break;
      case 'Update Employee':
        await updateEmployee(connection);
        break;
      case 'Exit':
        console.log('Exiting...');
        connection.end();
        process.exit(0);
    }

    // After viewing tables, return to the initial menu
    await start(connection);
  } catch (error) {
    console.error('Error:', error);
  }
}


// Calling the start function to initiate the application
(async () => {
  const connection = await connectToDB();
  if (!connection) {
    console.error('Failed to connect to the database.');
    return;
  }
  await start(connection);
})();
