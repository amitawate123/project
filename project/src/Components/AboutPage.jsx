import React from 'react';
import './About.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

function AboutPage() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/dt'); // Navigate to the DT page
  };

  return (
    <div className="content">
      <h1 className="heading">About Page</h1>
      <p>Welcome to the about page.</p>
      <button className="styled-button" onClick={handleNavigate}>
        Edit DT
      </button>
    </div>
  );
}

export default AboutPage;
