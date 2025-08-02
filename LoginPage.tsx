import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import apiService, { LoginCredentials } from '../services/api';

interface LoginPageProps {
  onLogin: (role: 'user' | 'admin' | 'support') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'support'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Clear any previous errors
    setError('');
    
    // Validate that email and password are entered
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: email.trim(),
        password: password
      };

      const response = await apiService.login(credentials);
      
      // Store the token
      apiService.setToken(response.data.token);
      
      // Call the onLogin callback with the user's role from the backend
      onLogin(response.data.user.role);
      
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Header with logo, centered role buttons, and home button */}
      <div className="header-section">
        <div className="logo-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 44 45" fill="none">
            <path d="M44 22.5C32.0322 22.0705 22.4295 12.4678 22 0.5C21.5705 12.4678 11.9678 22.0705 0 22.5C11.9678 22.9295 21.5705 32.5322 22 44.5C22.4295 32.5322 32.0322 22.9295 44 22.5Z" fill="url(#paint0_linear_11_1026)"/>
            <defs>
              <linearGradient id="paint0_linear_11_1026" x1="44" y1="22.5" x2="0" y2="22.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#656565"/>
              </linearGradient>
            </defs>
          </svg>
          <h1>Quick Desk</h1>
        </div>
        <div className="role-selector">
          <Button
            variant={selectedRole === 'user' ? 'primary' : 'secondary'}
            onClick={() => setSelectedRole('user')}
            className="role-btn"
          >
            User
          </Button>
          <Button
            variant={selectedRole === 'admin' ? 'primary' : 'secondary'}
            onClick={() => setSelectedRole('admin')}
            className="role-btn"
          >
            Admin
          </Button>
          <Button
            variant={selectedRole === 'support' ? 'primary' : 'secondary'}
            onClick={() => setSelectedRole('support')}
            className="role-btn"
          >
            Support Agent
          </Button>
        </div>
        <Button variant="primary" className="home-btn">
          Home
        </Button>
      </div>

      {/* Main content */}
      <Container className="main-content">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {/* App title and icon */}
            <div className="app-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="45" viewBox="0 0 44 45" fill="none">
                <path d="M44 22.5C32.0322 22.0705 22.4295 12.4678 22 0.5C21.5705 12.4678 11.9678 22.0705 0 22.5C11.9678 22.9295 21.5705 32.5322 22 44.5C22.4295 32.5322 32.0322 22.9295 44 22.5Z" fill="url(#paint0_linear_11_1026)"/>
                <defs>
                  <linearGradient id="paint0_linear_11_1026" x1="44" y1="22.5" x2="0" y2="22.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white"/>
                    <stop offset="1" stopColor="#656565"/>
                  </linearGradient>
                </defs>
              </svg>
              <h1>Quick Desk</h1>
            </div>

            {/* Welcome message */}
            <div className="welcome-message">
              <h2>Welcome Back. Let's Solve What Matters.</h2>
            </div>

            {/* Description */}
            <div className="app-description">
              <p>
                Access your dashboard to create, track, and manage support tickets effortlessly. 
                Your workspace for fast resolutions and smoother communication.
              </p>
            </div>

            {/* Login form */}
            <div className="login-form">
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              <div className="mb-3">
                <div className="input-group-custom">
                  <span className="input-icon">👤</span>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="input-group-custom">
                  <span className="input-icon">🔑</span>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-input"
                  />
                </div>
              </div>

              <div className="forgot-password">
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <Button 
                variant="primary" 
                className="login-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Log In'}
                <span className="arrow-icon">→</span>
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage; 