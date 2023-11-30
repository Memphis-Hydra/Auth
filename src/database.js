import mysql from "mysql2"; // Import the MySQL database library.
import dotenv from "dotenv"; // Import the dotenv library for managing environment variables.
import bcrypt from "bcrypt"; // Import the bcrypt library for password hashing.

dotenv.config(); // Load environment variables from a .env file if present.

// Create a MySQL database connection pool using environment variables for configuration.
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST, // Database host from environment variables.
    user: process.env.MYSQL_USER, // Database user from environment variables.
    password: process.env.MYSQL_PASSWORD, // Database password from environment variables.
    database: process.env.MYSQL_DATABASE, // Database name from environment variables.
  })
  .promise();

// Function to get all users from the "users" table.
export async function getUsers() {
  const [rows] = await pool.query("SELECT * FROM users"); // Execute a simple SQL query.
  return rows; // Return the fetched rows.
}

// Function to get a user by their username from the "users" table.
export async function getUser(username) {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE username='${username}'`
  ); // Execute a SQL query with a parameter.
  return rows; // Return the fetched rows.
}

// Function to create a new user in the "users" table.
export async function createUser(username, password) {
  try {
    const result = await pool.query(
      `
      INSERT INTO users (username, password)
      VALUES (?, ?)
      `,
      [username, await bcrypt.hash(password, 12)] // Hash the password before insertion.
    );
  } catch (err) {
    console.log("user exists"); // Handle the case where the user already exists.
  }
}

// Function to create a new file entry in the 'files' table.
export const createFileEntry = async (filename, userId) => {
  try {
    // Use the connection pool to execute the query
    const query = "INSERT INTO files (filename, user_id) VALUES (?, ?)";
    const [result] = await pool.query(query, [filename, userId]);

    // Check if the file entry was successfully created
    if (result.affectedRows === 1) {
      console.log("File entry created successfully."); // Log success message.
      return result.insertId;
    }

    console.error("Failed to create a file entry."); // Log failure message.
    return false;
  } catch (error) {
    console.error("Error creating file entry:", error); // Log any error during file entry creation.
    return false;
  }
};

// Function to update the 'uploaded_at' field in the 'files' table.
export const updateUploadedAt = async (id, fileId) => {
  try {
    // Use the connection pool to execute the query
    const query =
      "UPDATE files SET uploaded_at = CURRENT_TIMESTAMP(), url = ? WHERE id = ?";
    const [result] = await pool.query(query, [
      "https://f005.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=" +
        fileId,
      id,
    ]);

    // Check if the 'uploaded_at' field was successfully updated
    if (result.affectedRows === 1) {
      console.log("Uploaded_at field updated successfully."); // Log success message.
      return true;
    }

    console.error("NOK"); // Log failure message.
    return false;
  } catch (error) {
    console.error("Error updating uploaded_at field:", error); // Log any error during the update.
    return false;
  }
};



export const getFiles = async (userId) => {
  try {
    // Use the connection pool to execute the query
    const query = `
    SELECT f.id, f.filename, f.created_at, f.url, f.uploaded_at , f.uploaded_by, u.username as uploaded_by
    FROM files f
    INNER JOIN users u ON f.user_id = u.id  
    where u.id = ? 
    and status = 1
     
  `;
    const [result] = await pool.query(query, [userId]);

    return result; // Return the fetched files.
  } catch (error) {
    console.error("Error updating uploaded_at field:", error); // Log any error during file retrieval.
    return false;
  }
};

const result = createUser; //
// console.log(result); // Log the result of user creation.
