import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(username, password)

    // Simple validation
    if (!username || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    if (username.toLowerCase() !== 'amit' && username.toLowerCase() !== 'sagar' && username.toLowerCase() !== "anoop"){
      setErrorMessage("Invalid Username")
      return;
    }

    if (password.toLowerCase() !== 'amit' && password.toLowerCase() !== 'sagar' && password.toLowerCase() !== 'anoop'){
      setErrorMessage("Invalid Pasword")
      return;
    }

    // Here you would typically call an API to authenticate
    console.log('Login attempt with:', { username });

    // Reset the form fields after submission
    setUsername('');
    setPassword('');
    setErrorMessage('');
    navigate('/about');
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;