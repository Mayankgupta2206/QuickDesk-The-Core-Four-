import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDashboard.css';
import CreateTicketForm from './CreateTicketForm';
import TicketList from './TicketList';
import apiService, { Ticket, TicketStats } from '../services/api';

interface UserDashboardProps {
  onLogout: () => void;
  userRole: 'user' | 'admin' | 'support';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, userRole }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleCloseAddTicket = () => setShowAddTicket(false);
  const handleShowAddTicket = () => setShowAddTicket(true);
  const handleCloseUpgrade = () => setShowUpgrade(false);
  const handleShowUpgrade = () => setShowUpgrade(true);

  const loadStats = async () => {
    try {
      const response = await apiService.getTicketStats();
      setStats(response.data);
    } catch (error) {
      console.error('UserDashboard: Failed to load stats:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleTicketCreated = () => {
    loadStats(); // Refresh stats when a new ticket is created
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    // You can implement a ticket detail modal here
  };

  const getStatusCount = (status: string) => {
    if (!stats?.statusBreakdown) return 0;
    const statusItem = stats.statusBreakdown.find(item => item._id === status);
    return statusItem?.count || 0;
  };

  const getPriorityCount = (priority: string) => {
    if (!stats?.priorityBreakdown) return 0;
    const priorityItem = stats.priorityBreakdown.find(item => item._id === priority);
    return priorityItem?.count || 0;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="main-content">
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="profile-name">User</div>
                <div className="profile-email">user@example.com</div>
              </div>
              <div className="profile-avatar">
                <div className="avatar">👤</div>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
            <div className="header-buttons">
              <Button variant="success" className="upgrade-btn" onClick={handleShowUpgrade}>
                Upgrade
              </Button>
              <Button variant="primary" className="add-ticket-btn" onClick={handleShowAddTicket}>
                + Add a new Ticket
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              <strong>Error:</strong> {error}
              <br />
              <small>Please check your connection and try again.</small>
            </Alert>
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="welcome-section">
                <h2>Welcome back, User!</h2>
                <p className="ticket-summary">
                  {stats ? (
                    `${getStatusCount('open')} Open Tickets, ${getStatusCount('in-progress')} In Progress, ${getStatusCount('resolved')} Resolved`
                  ) : (
                    'Loading ticket summary...'
                  )}
                </p>
              </div>

              {/* Ticket Status Cards */}
              <div className="ticket-cards">
                <Row>
                  <Col md={6} lg={3}>
                    <Card className="status-card open-tickets">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon blue">📋</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getStatusCount('open')}</h3>
                          <h4>Open Tickets</h4>
                          <p>Tickets awaiting response</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="status-card in-progress">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon yellow">⚡</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getStatusCount('in-progress')}</h3>
                          <h4>In Progress</h4>
                          <p>Ticket is being handled</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="status-card resolved">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon green">✅</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getStatusCount('resolved')}</h3>
                          <h4>Resolved</h4>
                          <p>Successfully resolved</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6} lg={3}>
                    <Card className="status-card closed">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon gray">🔒</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getStatusCount('closed')}</h3>
                          <h4>Closed</h4>
                          <p>Closed tickets</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* My Activities Section */}
              <div className="my-activities">
                <div className="activities-header">
                  <div className="activities-title">
                    <span className="search-icon">🔍</span>
                    <h3>My Recent Tickets</h3>
                  </div>
                </div>

                <div className="activities-list">
                  <TicketList 
                    onTicketClick={handleTicketClick}
                    showCreateButton={false}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'tickets' && (
            <div className="tickets-section">
              <div className="section-header">
                <h2>My Tickets</h2>
                <p>Manage and track all your support tickets</p>
              </div>
              <TicketList 
                onTicketClick={handleTicketClick}
                showCreateButton={true}
                onCreateClick={handleShowAddTicket}
              />
            </div>
          )}

          {activeTab === 'notification' && (
            <div className="notification-section">
              <h2>Notifications</h2>
              <p>No new notifications</p>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="help-section">
              <h2>Help & FAQ</h2>
              <p>How can we help you today?</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Settings</h2>
              <p>Manage your account settings</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketForm
        show={showAddTicket}
        onHide={handleCloseAddTicket}
        onTicketCreated={handleTicketCreated}
      />

      {/* Upgrade Profile Modal */}
      <Modal show={showUpgrade} onHide={handleCloseUpgrade} size="lg" className="upgrade-modal">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <div className="upgrade-content">
            <Row>
              <Col md={8}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter your name"
                      className="modal-input"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Role:</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter your role"
                          className="modal-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end">
                      <Button variant="success" className="upgrade-action-btn">
                        Upgrade
                      </Button>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Category Interested:</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter your interests"
                      className="modal-input"
                    />
                  </Form.Group>
                </Form>
              </Col>
              <Col md={4}>
                <div className="avatar-placeholder">
                  <div className="avatar-upload">
                    <span className="avatar-icon">📷</span>
                    <p>Profile Picture</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={handleCloseUpgrade}>
            Cancel
          </Button>
          <Button variant="success">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDashboard; 