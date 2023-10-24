import express from 'express'
import multer from 'multer'
import path from 'path'

const app = express();
const port = 8080;

// Define storage for uploaded files.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved in the "uploads" directory.
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Rename the file to avoid naming conflicts.
  },
});

// Create a multer instance with the defined storage.
export const upload = multer({ storage });