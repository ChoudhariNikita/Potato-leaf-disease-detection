import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Spinner, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        // Example validation: Check dimensions
        if (img.width < 50 || img.height < 50) {
          reject('Image is too small. Please upload a larger image.');
        }

        // Example validation: Check for uniform color (e.g., all white or black)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const pixels = imageData.data;
        let isUniform = true;
        const [r, g, b] = [pixels[0], pixels[1], pixels[2]];

        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] !== r || pixels[i + 1] !== g || pixels[i + 2] !== b) {
            isUniform = false;
            break;
          }
        }

        if (isUniform) {
          reject('Image appears to be blank or uniform in color. Please upload a valid image.');
        }

        resolve();
      };

      img.onerror = () => {
        reject('Failed to load the image. Please upload a valid image file.');
      };

      img.src = objectUrl;
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await validateImage(file);
      setSelectedFile(file);
      toast.success('File selected successfully!');
    } catch (error) {
      toast.error(error);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsLoading(true);
    setResponse(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await axios.post('https://potato-leaf-disease-api.onrender.com/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(res.data);
      setShowModal(true); // Show the modal with the result
      toast.success('File uploaded successfully!');
      setTimeout(() => {
        setShowModal(true); // Show the modal with the result after a short delay
      }, 500);
    } catch (error) {
      console.error('Error uploading the file:', error);

      // Handle specific error codes
      if (error.response) {
        if (error.response.status === 500) {
            toast.error('Invalid image: The uploaded file is not a valid plant or leaf image.');
        } else if (error.response.status === 400) {
          toast.error('Invalid image: The uploaded file is not a valid plant or leaf image.');
        } else {
          toast.error(`Unexpected error: ${error.response.data.error || 'Please try again.'}`);
        }
      } else {
        toast.error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResponse(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
    toast.info('File input cleared.');
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="container mt-4 text-center">
      <h2>Please select a potato leaf image to classify</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="form-control mb-3 my-4"
        ref={fileInputRef}
      />
      <button
        className="btn btn-primary my-1"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <Spinner animation="border" /> : 'Upload File'}
      </button>
      <button
        className="btn btn-secondary mx-4 my-1"
        onClick={handleClear}
      >
        Clear
      </button>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} animation={true} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Prediction Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Uploaded"
              className="img-fluid mb-3"
            />
          )}
          <p><strong>Label:</strong> {response?.class}</p>
          <p><strong>Confidence:</strong> {response?.confidence ? (response.confidence * 100).toFixed(2) + '%' : ''}</p>
          <p><strong>File Name:</strong> {response?.filename}</p>
          <p><strong>File Size:</strong> {selectedFile ? (selectedFile.size / 1024).toFixed(2) + ' KB' : ''}</p>
          <p><strong>File Type:</strong> {response?.content_type}</p>
          <p><strong>Model Version:</strong> 1.0.0</p>
        </Modal.Body>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default FileUpload;