'use client'
import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");

  const apiBaseUrl = "/api/v1/files"; // Update with your backend URL.

  // Static JWT token (replace with your actual JWT token)
  const jwtToken = "eyJraWQiOiJiZDM0NWUyMi1jZDhiLTQxMWQtOTk4Ny0yY2QxYTQyNmI1MTgiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiYXVkIjoibmV4dGpzMiIsIm5iZiI6MTczMjk4MzUwNywic2NvcGUiOlsiZmlsZTpyZWFkIiwiZmlsZTp3cml0ZSIsIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwOTAiLCJleHAiOjE3MzMwNjk5MDcsImlhdCI6MTczMjk4MzUwNywidXVpZCI6ImEyMWM4YjkxLTcwNDEtNDBkZC1iZDAxLWZmMjdjMTdhYzFlNyIsImp0aSI6InVzZXIifQ.WVIa0dDd4UvKT7UubX9l6isbSOkWB3SDN_vat6kmGitjWTtCjzmU6gJjMPwSD8kHL9fEjBe1EJ11vS8-E-sc3avPvNFTsxLkfrEtPmyS-fjzgh2ma-uNn82aKUhCJatIIBJ51l4dKDjV6Dnb201CQbCGUBLMMXQbkxS_XsvY5Rr-s5KE0ync4SXz8jqK2LMcPCiDC2zGVMD19EJ09v_aF_a1flNNNIUjJOZ3glsnhIqscHi1olkkcH9u3WRkIf6DGF2-n1k1X-2T_AU2wdhxlO6fnMLH_N_eJ4PaPdzWi28ZVdCfYpi3wXo2pt22JQHJxjEjP0jrD1d8XaItE7Bguw";

  // Upload File
  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(apiBaseUrl, formData, {
        headers: { 
          "Content-Type": "multipart/form-data", 
          "Authorization": `Bearer ${jwtToken}` // Attach static JWT token
        },
      });
      alert("File uploaded successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Fetch All Files
  const fetchAllFiles = async () => {
    try {
      const response = await axios.get(apiBaseUrl, {
        headers: {
          "Authorization": `Bearer ${jwtToken}` // Attach static JWT token
        }
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Fetch File by Name
  const fetchFileByName = async () => {
    if (!fileName) return alert("Enter a file name!");
    try {
      const response = await axios.get(`${apiBaseUrl}/${fileName}`, {
        headers: {
          "Authorization": `Bearer ${jwtToken}` // Attach static JWT token
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // Delete File by Name
  const deleteFileByName = async () => {
    if (!fileName) return alert("Enter a file name!");
    try {
      const response = await axios.delete(`${apiBaseUrl}/${fileName}`, {
        headers: {
          "Authorization": `Bearer ${jwtToken}` // Attach static JWT token
        }
      });
      alert("File deleted successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen">
      {/* Header Actions */}
      <div className="h-[100px] w-full text-[1.5rem] bg-slate-600 flex justify-around items-center text-white">
        <button onClick={handleUpload}>Upload File</button>
        <button onClick={fetchFileByName}>Get File</button>
        <button onClick={fetchAllFiles}>Get All Files</button>
        <button onClick={deleteFileByName}>Delete File</button>
      </div>

      {/* Content Area */}
      <div className="h-full w-full p-4">
        <div className="flex flex-col items-center gap-4">
          {/* Upload File Input */}
          <div>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mb-2"
            />
          </div>

          {/* Fetch/Delete File Input */}
          <div>
            <input
              type="text"
              placeholder="Enter file name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="border p-2"
            />
          </div>

          {/* Display Fetched Files */}
          {files.length > 0 && (
            <div className="w-full max-w-lg">
              <h2 className="text-lg font-bold mb-2">Files:</h2>
              <ul className="list-disc pl-4">
                {files.map((file, index) => (
                  <li key={index}>{file.name || "Unnamed File"}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
