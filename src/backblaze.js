// Import required modules
import BackblazeB2 from "backblaze-b2";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Create an instance of Backblaze B2 and authorize it using environment variables.
const __filename = fileURLToPath(import.meta.url);
const b2 = new BackblazeB2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
  applicationKey: process.env.B2_APPLICATION_KEY,
});

// Authorize the Backblaze B2 instance.
b2.authorize();

// Function to check if a file exists with retry
const checkFileExistsWithRetry = async (fileId, retryCount = 3) => {
  try {
    const fileInfoResponse = await b2.getFileInfo({
      fileId: fileId,
    });
    console.log("File exists:", fileInfoResponse.data);
    return "File uploaded successfully"; // You can customize the status message.
  } catch (error) {
    console.error("File not found:", error);
    if (retryCount > 0) {
      console.log(`Retrying check, attempts left: ${retryCount}`);
      return checkFileExistsWithRetry(fileId, retryCount - 1);
    } else {
      console.error("Max retry attempts reached. File not found.");
      throw error;
    }
  }
};

// Function to upload a file with retry and return a Promise
export const uploadFileWithRetry = async (req, filename, retryCount) => {
  try {
    const response = await b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });

    // Perform the file upload
    const uploadResponse = await b2.uploadFile({
      uploadUrl: response.data.uploadUrl,
      uploadAuthToken: response.data.authorizationToken,
      fileName: filename, // provide a specific file name here
      data: req.file.buffer,
      mime: req.file.mimetype,
      onUploadProgress: (event) => {},
    });

    const fileId = uploadResponse.data.fileId;

    // Check if the file exists in the bucket with retry
    const status = await checkFileExistsWithRetry(fileId);
    return { status: status,fileId :fileId };
  } catch (error) {
    console.error("Error uploading file:", error);
    const retryCount = 3;
    if (retryCount > 0) {
      console.log(`Retrying upload, attempts left: ${retryCount}`);
      return uploadFileWithRetry(req, filename, retryCount - 1);
    } else {
      console.error("Max retry attempts reached. Upload failed.");
      throw error;
    }
  }
};
