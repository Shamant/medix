// App.js
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, firestore } from "./config/firebase";

const UploadPDF = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  // Handle multiple file selection
  const handleFileChange = (event) => {
    setFiles(event.target.files);  // Save all selected files
  };

  // Handle file upload for all selected files
  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus("No files selected");
      return;
    }

    try {
      setUploadStatus("Uploading...");

      const uploadPromises = [];
      // Loop through each selected file and upload them
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `pdfs/${file.name}`);

        // Upload each file to Firebase Storage
        const uploadTask = uploadBytes(storageRef, file).then(async (snapshot) => {
          const downloadURL = await getDownloadURL(snapshot.ref);
          await savePDFLinkToFirestore(downloadURL, file.name);
        });

        uploadPromises.push(uploadTask);
      }

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);

      setUploadStatus("All PDFs uploaded and links saved to Firestore!");
    } catch (error) {
      console.error("Error uploading PDFs:", error);
      setUploadStatus("Error uploading PDFs");
    }
  };

  // Function to save the download URL in Firestore
  const savePDFLinkToFirestore = async (downloadURL, fileName) => {
    try {
      // Add a new document to the "resources" collection
      const resourcesCollectionRef = collection(firestore, "resources");

      // Save PDF download link, file name, and timestamp
      await addDoc(resourcesCollectionRef, {
        caption: fileName,
        link: downloadURL,
        date: new Date(),
      });

      console.log(`${fileName} link saved to Firestore successfully!`);
    } catch (error) {
      console.error(`Error saving ${fileName} link to Firestore:`, error);
    }
  };

  return (
    <div>
      <h1>Upload PDFs to Firebase</h1>
      <input type="file" accept="application/pdf" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload PDFs</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default UploadPDF;
