import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onLogout: () => void;
  userRole: 'user' | 'admin' | 'support';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, userRole }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Logo */}
        <div className="logo-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 44 45" fill="none">
            <path d="M44 22.5C32.0322 22.0705 22.4295 12.4678 22 0.5C21.5705 12.4678 11.9678 22.0705 0 22.5C11.9678 22.9295 21.5705 32.5322 22 44.5C22.4295 32.5322 32.0322 22.9295 44 22.5Z" fill="url(#paint0_linear_11_1026)"/>
            <defs>
              <linearGradient id="paint0_linear_11_1026" x1="44" y1="22.5" x2="0" y2="22.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#656565"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">Quick Desk</span>
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <div className="nav-icon">👤</div>
            <span>Dashboard</span>
          </div>
          <div className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`} onClick={() => setActiveTab('notification')}>
            <div className="nav-icon">🔔</div>
            <span>Notification</span>
          </div>
          <div className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
            <div className="nav-icon">🎫</div>
            <span>My Tickets</span>
          </div>
          <div className={`nav-item ${activeTab === 'help' ? 'active' : ''}`} onClick={() => setActiveTab('help')}>
            <div className="nav-icon">❓</div>
            <span>Help / FAQ</span>
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <div className="nav-icon">⚙️</div>
            <span>Settings</span>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="logout-section">
          <Button variant="danger" className="logout-btn" onClick={onLogout}>
            Log out
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Header */}
        <div className="top-header">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="action-btn">
                <span>🔍</span>
              </button>
              <button className="action-btn">
                <span>⬜</span>
              </button>
            </div>
            <div className="user-profile">
              <div className="profile-info">
                <div className="profile-name">Admin</div>
                <div className="profile-email">alexamring@gmail.com</div>
              </div>
              <div className="profile-avatar">
                <div className="avatar">👩</div>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Overview Cards */}
          <div className="overview-cards">
            <Row>
              <Col md={3}>
                <Card className="overview-card">
                  <Card.Body>
                    <div className="card-header">
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>254</h3>
                      <h4>Tickets Created</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="overview-card">
                  <Card.Body>
                    <div className="card-header">
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>87%</h3>
                      <h4>Resolution Rate</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="overview-card">
                  <Card.Body>
                    <div className="card-header">
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>4.2h</h3>
                      <h4>Avg Resolution Time</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="overview-card">
                  <Card.Body>
                    <div className="card-header">
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>4.6/5</h3>
                      <h4>Customer Satisfaction</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Middle Section */}
          <div className="middle-section">
            <Row>
              <Col md={6}>
                <Card className="category-card">
                  <Card.Body>
                    <div className="card-title">
                      <h4>Category Management</h4>
                    </div>
                    <div className="category-list">
                      <div className="category-item">
                        <span className="category-name">Authentication</span>
                        <span className="category-count">45 tickets</span>
                      </div>
                      <div className="category-item">
                        <span className="category-name">Performance</span>
                        <span className="category-count">32 tickets</span>
                      </div>
                      <div className="category-item">
                        <span className="category-name">Hardware</span>
                        <span className="category-count">28 tickets</span>
                      </div>
                      <div className="category-item">
                        <span className="category-name">Software</span>
                        <span className="category-count">67 tickets</span>
                      </div>
                    </div>
                    <Button variant="secondary" className="add-category-btn">
                      Add Category
                    </Button>
                    <div className="category-icon">🐱</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="user-stats-card">
                  <Card.Body>
                    <div className="card-title">
                      <h4>User Statistics</h4>
                    </div>
                    <div className="stats-list">
                      <div className="stat-item">
                        <span className="stat-label">Active Users:</span>
                        <span className="stat-value">156</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Support Agents:</span>
                        <span className="stat-value">12</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">New This Week:</span>
                        <span className="stat-value">8</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Bottom Section */}
          <div className="bottom-section">
            <Row>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <div className="card-header">
                      <h4>Ticket Volume Trends</h4>
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="chart-container">
                      <div className="chart-placeholder">
                        <div className="chart-line">
                          <div className="data-point" style={{left: '10%', top: '60%'}}>Mon</div>
                          <div className="data-point" style={{left: '25%', top: '50%'}}>Tue</div>
                          <div className="data-point" style={{left: '40%', top: '40%'}}>Wed</div>
                          <div className="data-point" style={{left: '55%', top: '30%'}}>Thu</div>
                          <div className="data-point" style={{left: '70%', top: '45%'}}>Fri</div>
                          <div className="data-point" style={{left: '85%', top: '55%'}}>Sat</div>
                          <div className="data-point" style={{left: '95%', top: '65%'}}>Sun</div>
                        </div>
                        <div className="chart-label">50 Ticket</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="chart-card">
                  <Card.Body>
                    <div className="card-header">
                      <h4>Ticket Distribution</h4>
                    </div>
                    <div className="donut-chart-container">
                      <div className="donut-chart">
                        <div className="donut-segment yellow"></div>
                        <div className="donut-segment blue"></div>
                        <div className="donut-segment green"></div>
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-dot blue"></span>
                          <span className="legend-label">Hardware</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot yellow"></span>
                          <span className="legend-label">Software</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-dot green"></span>
                          <span className="legend-label">Network</span>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 