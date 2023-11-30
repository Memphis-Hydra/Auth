// import express from "express";
// const app = express();
// const port = 8080; // Choose the port you prefer

// const mysql = require("mysql2");

// export const connection = mysql.createConnection({
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Database connection error: " + err.stack);
//     return;
//   }
//   console.log("Connected to the database");
// });

// // Define the API endpoint /files to retrieve data from the database
// app.get("/files", (req, res) => {
//   const query = `
//     SELECT f.id, f.filename, f.uploaded_at
//     FROM files f
//     INNER JOIN users u ON f.user_id = u.id
//   `;

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error("Error querying the database: " + error);
//       return res.status(500).json({ error: "Database query error" });
//     }
//     res.json(results);
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
