import { useState } from "react";

const UploadingPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      // You can perform further actions here, such as sending the file to a server.
      // For simplicity, let's assume you have an API endpoint to handle file uploads.

      // Create a FormData object to send the file to the server.
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Send the file to the server using a fetch or axios request.
      fetch("http://localhost:8080/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      })
        .then((response) => {
          // Handle the response from the server (e.g., success or error).
          if (response.ok) {
            console.log("File uploaded successfully.");
          } else {
            console.error("File upload failed.");
          }
        })
        .catch((error) => {
          console.error("Error uploading the file:", error);
        });
    } else {
      alert("Please select a file before uploading.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-black">Upload a video</h2>

      <div className="border border-blue-500 p-4 rounded-lg bg-white border-l-5 mb-4">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="mb-2 p-2 rounded-lg"
        />

        {selectedFile && (
          <div>
            <p className="font-bold">Selected Video:</p>
            <p>{selectedFile.name}</p>
          </div>
        )}

<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleFileUpload}>
          Submit Video
        </button>
      </div>
    </div>
  );
};

export default UploadingPage;
