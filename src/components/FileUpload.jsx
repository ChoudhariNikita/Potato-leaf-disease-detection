import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Spinner, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
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
    } catch (error) {
      console.error('Error uploading the file:', error);
      setResponse('Error uploading the file');
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
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default FileUpload;
