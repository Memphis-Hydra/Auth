// server.js

import express from "express";
import bcrypt from "bcrypt";

import {
  createFileEntry,
  createUser,
  getUser,
  updateUploadedAt,
  getFiles,
} from "./src/database.js";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { verifyToken } from "./src/middleware/index.js";
import { upload } from "./src/multer.js";
import { uploadFileWithRetry } from "./src/backblaze.js";
import testRouter from "./src/routes/testRoute.js";

dotenv.config();


const app = express();
const port = process.env.PORT

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api",testRouter)

app.use(cookieParser());
app.use(express.json());

// Create a user if not exists
await createUser("user1", "pass1"); // add a new User

// Login
app.post(
  "/login",
  [
    body("username").notEmpty().isString(),
    body("password").notEmpty().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (errors.array().length) {
        return res.status(400).send("Bad request.");
      }

      const { username, password } = req.body;
      const user = await getUser(username);

      if (!user || user.length === 0) {
        return res.status(401).send("User not found.");
      }

      const result = await bcrypt.compare(password, user[0].password);

      if (result) {
        const expirationInSeconds = 60 * 60 * 24 * 30; // 30 days * 24 hours * 60 minutes * 60 seconds

        const payload = {
          username: user[0].username,
          id: user[0].id,
        };

        const token = jwt.sign(payload, process.env.ACCES_TOKEN_SECRET, {
          expiresIn: expirationInSeconds,
        });

        res.cookie("accessToken", token);
        res.send("success");
      } else {
        res.status(401).send("false");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

app.get("/verify", verifyToken, async (req, res) => {
  res.send("valid token");
});

// Upload route
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const file_name = "TestFile";
    const DbFileId = await createFileEntry(file_name, req.user.id);
    const result = await uploadFileWithRetry(req, file_name);
    await updateUploadedAt(DbFileId, result.fileId);

    if (result) {
      res.send(req.user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading file");
  }
});

// Get files by user ID route
app.get("/getFilesByUserId", verifyToken, async (req, res) => {
  const files = await getFiles(req.user.id);
  res.json(files);
});

// Delete file by ID route
app.delete("/deleteFile/:fileId", verifyToken, async (req, res) => {
  try {
    const fileId = req.params.fileId;

    res.send("File deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting file");
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send("Bad Request: Malformed JSON");
  }

  res.status(500).send("Internal Server Error");
});



// Start the server and listen on port 8080
app.listen(8080, () => {
  console.log("Server is running on port ${PORT}");
});
