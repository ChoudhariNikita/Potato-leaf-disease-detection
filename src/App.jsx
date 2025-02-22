import React from 'react';
import FileUpload from './components/FileUpload';
import pdLogo from './assets/pdlogo.png'; // Import the logo correctly
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Custom CSS for further styling

function App() {
  return (
    <div className="App">
      {/* Header Section with Blue Gradient */}
      <header className="bg-dark text-white d-flex align-items-center p-3 shadow-lg">
        <img src={pdLogo} alt="Logo" className="me-3 rounded-circle logo-img" />
        <h1 className="m-0 fs-2">LeafHealth</h1>
      </header>

      {/* Main Section */}
      <main className="container mt-5">
        <div className="card shadow p-4 bg-light">
          <FileUpload />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center mt-5 py-3 border-top">
        <p className="mb-0">© 2024 LeafHealth. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;
