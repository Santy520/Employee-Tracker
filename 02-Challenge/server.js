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
// Function to view all departments
async function addDepartments(connection) {
  const { choice } = await inquirer.prompt([
    {
      type: 'input',
      name: 'choice',
      message: 'What would you like to do?',
    
     
    }
  ]);
  console.log(choice);
  try {
    // const [rows, fields] = await
    await connection.query(`INSERT INTO department (name)
    VALUES (?)`, choice, (err, result) => {
      console.log(result);
    });
    await start;
    // console.log(table([fields.map(field => field.name), ...rows.map(row => Object.values(row))]));
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

// Function to start the application
async function start() {
  const connection = await connectToDB();
  if (!connection) {
    console.error('Failed to connect to the database.');
    return;
  }

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
        'View all employees',
        'Exit'
      ]
    }
  ]);
        // Added types of options I could use.
    // {
    //   type: 'input',
    //   name: 'username',
    //   message: 'Enter your username:'
    // },
    // {
    //   type: 'password',
    //   name: 'password',
    //   message: 'Enter your password:'
    // },
    // {
    //   type: 'confirm',
    //   name: 'confirm',
    //   message: 'Are you sure you want to proceed?'
    // },
    // {
    //   type: 'number',
    //   name: 'age',
    //   message: 'Enter your age:'
    // },
    // {
    //   type: 'checkbox',
    //   name: 'colors',
    //   message: 'Select your favorite colors:',
    //   choices: ['Red', 'Green', 'Blue', 'Yellow']
    // },
    // {
    //   type: 'editor',
    //   name: 'bio',
    //   message: 'Enter your bio:'
    // }
    
    // Performed actions based on user choice
  switch (choice) {
    case 'View all departments':
      await viewDepartments(connection);
      break;
    case 'Add Department':
      await addDepartments(connection);
      break;
    case 'View all roles':
      await viewRoles(connection);
      break;
    case 'View all employees':
      await viewEmployees(connection);
      break;
    case 'Exit':
      console.log('Exiting...');
      connection.end();
      process.exit(0);
  }
}

// Calling the start function to initiate the application
start();

