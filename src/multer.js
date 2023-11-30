import multer from "multer";
import concat from "concat-stream";
import express from "express";

const app = express();
// Extend the _handleFile method of MemoryStorage
const handleFile = function (req, file, cb) {
  file.stream.pipe(
    concat(function (data) {
      cb(null, {
        buffer: data,
        size: data.length,
      });
    })
  );
};

// Define a new memory storage with the extended _handleFile method
const storage = multer.memoryStorage();
storage._handleFile = handleFile;

// Create a multer instance with the custom memory storage
export const upload = multer({ storage });

// Example usage in your route or controller
const uploadMiddleware = upload.single("file"); // Assuming you are uploading a single file

app.post("/upload", uploadMiddleware, (req, res) => {
  // Access the file size in bytes
  const fileSize = req.file.size;

  // Additional logic here
  res.send("File uploaded successfully!");
});
