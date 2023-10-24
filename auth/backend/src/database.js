import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create a MySQL database connection pool using environment variables for configuration.
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

// Function to get all users from the "users" table.
export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
}

// Function to get a user by their username from the "users" table.
export async function getUser(username) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE username='${username}'`
  );
  return rows;
}

// Function to create a new user in the "users" table.
export async function createUser(username, password) {
  const result = await pool.query(
    `
    INSERT INTO users (username, password)
    VALUES (?, ?)
    `,
    [username, password]
  );

  const id = result[0].insertId;

  // Retrieve the newly created user by their ID and return it.
  return getUser(id);

  // Alternatively, you can return an object with the user's details if needed.
  // return {
  //   id,
  //   username,
  //   password,
  // };
}

// Example usage: Create a user with the username "test" and password "test."
const result = createUser;
console.log(result);
