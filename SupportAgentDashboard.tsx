import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SupportAgentDashboard.css';

interface SupportAgentDashboardProps {
  onLogout: () => void;
  userRole: 'user' | 'admin' | 'support';
}

const SupportAgentDashboard: React.FC<SupportAgentDashboardProps> = ({ onLogout, userRole }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dummy data for tickets
  const tickets = [
    {
      id: 'T-001',
      title: 'Login Issues',
      description: 'Unable to access account after password reset',
      status: 'Open',
      time: '2 hours ago',
    },
    {
      id: 'T-002',
      title: 'Software Installation',
      description: 'Need assistance installing new design software',
      status: 'Open',
      time: '4 hours ago',
    },
    {
      id: 'T-003',
      title: 'Email Configuration',
      description: 'Outlook not syncing with server',
      status: 'Resolved',
      time: '1 day ago',
    },
    {
      id: 'T-004',
      title: 'Hardware Malfunction',
      description: 'Laptop screen flickering intermittently',
      status: 'In Progress',
      time: '3 days ago',
    },
    {
      id: 'T-005',
      title: 'Network Connectivity',
      description: 'Frequent disconnections from office Wi-Fi',
      status: 'Open',
      time: '5 hours ago',
    },
    {
      id: 'T-006',
      title: 'Printer Not Responding',
      description: 'Printer shows offline status despite being connected',
      status: 'Resolved',
      time: '2 days ago',
    },
  ];

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
                <div className="profile-name">Agent</div>
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
          {/* Summary Cards */}
          <div className="summary-cards">
            <Row>
              <Col md={4}>
                <Card className="summary-card resolved">
                  <Card.Body>
                    <div className="card-header">
                      <div className="card-icon green">✅</div>
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>28</h3>
                      <h4>Tickets Resolved</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="summary-card satisfaction">
                  <Card.Body>
                    <div className="card-header">
                      <div className="card-icon blue">😊</div>
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>4.8</h3>
                      <h4>Satisfaction Rating</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="summary-card response-time">
                  <Card.Body>
                    <div className="card-header">
                      <div className="card-icon purple">⏱️</div>
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>3.2h</h3>
                      <h4>Avg Response Time</h4>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* My Tickets Section */}
          <div className="my-tickets-section">
            <div className="tickets-header">
              <div className="tickets-title">
                <span className="search-icon">🔍</span>
                <h3>My Tickets</h3>
              </div>
              <div className="tickets-filter">
                <Form.Select className="status-filter">
                  <option>My Tickets</option>
                  <option>All Tickets</option>
                  <option>Open</option>
                  <option>Resolved</option>
                  <option>In Progress</option>
                </Form.Select>
              </div>
            </div>

            <div className="tickets-list">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="ticket-card">
                  <Card.Body>
                    <div className="ticket-header">
                      <div className="ticket-info">
                        <h5 className="ticket-title">{ticket.title}</h5>
                        <p className="ticket-description">{ticket.description}</p>
                      </div>
                      <div className="ticket-meta">
                        <div className="ticket-actions-top">
                          <span className="share-icon">🔗</span>
                          <span className="ticket-id">{ticket.id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ticket-footer">
                      <div className="ticket-status-info">
                        <Button 
                          variant={ticket.status === 'Open' ? 'success' : ticket.status === 'Resolved' ? 'primary' : 'warning'} 
                          size="sm" 
                          className="status-btn"
                        >
                          {ticket.status}
                        </Button>
                        <span className="ticket-time">{ticket.time}</span>
                      </div>
                      <div className="ticket-actions">
                        <Button variant="primary" size="sm" className="resolve-btn">
                          Resolve
                        </Button>
                        <Button variant="secondary" size="sm" className="assign-btn">
                          Assign
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAgentDashboard; 