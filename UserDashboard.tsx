import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserDashboard.css';

interface UserDashboardProps {
  onLogout: () => void;
  userRole: 'user' | 'admin' | 'support';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, userRole }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);

  const handleCloseModal = () => setShowAddTicketModal(false);
  const handleShowModal = () => setShowAddTicketModal(true);

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
                <div className="profile-name">Alexa May</div>
                <div className="profile-email">alexamring@gmail.com</div>
              </div>
              <div className="profile-avatar">
                <div className="avatar">👩</div>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
            <Button variant="primary" className="add-ticket-btn" onClick={handleShowModal}>
              + Add a new Ticket
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome back, User!</h2>
            <p className="ticket-summary">2 Open Tickets, 1 In Progress, 3 Resolved, 1 Awaiting for your response</p>
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
                      <h3>2</h3>
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
                      <h3>1</h3>
                      <h4>In Progress</h4>
                      <p>Ticket is being handled</p>
                      <div className="agent-info">
                        <small>Agent assigned: Maria S.</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="status-card awaiting-reply">
                  <Card.Body>
                    <div className="card-header">
                      <div className="card-icon orange">⏰</div>
                      <div className="refresh-icon">🔄</div>
                    </div>
                    <div className="card-content">
                      <h3>1</h3>
                      <h4>Awaiting for your reply</h4>
                      <p>Needs your response to continue</p>
                      <Button variant="outline-primary" size="sm" className="reply-btn">
                        Reply now →
                      </Button>
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
                      <h3>3</h3>
                      <h4>Recently Resolved</h4>
                      <p>Recently Resolved</p>
                      <div className="resolved-info">
                        <small>2 resolved 1 day ago</small>
                      </div>
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
                <h3>My Activities</h3>
              </div>
              <div className="activities-filter">
                <Form.Select className="status-filter">
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </Form.Select>
              </div>
            </div>

            <div className="activities-list">
              <Card className="activity-card">
                <Card.Body>
                  <div className="ticket-header">
                    <div className="ticket-id">T-001</div>
                    <Button variant="primary" size="sm" className="status-btn">Open</Button>
                  </div>
                  <div className="ticket-content">
                    <h4>Login Issues</h4>
                    <p>Unable to access account after password reset</p>
                    <div className="ticket-meta">
                      <span className="timestamp">2 hours ago</span>
                      <div className="engagement">
                        <span className="upvote">⬆️ 44</span>
                        <span className="downvote">⬇️ 1</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="activity-card">
                <Card.Body>
                  <div className="ticket-header">
                    <div className="ticket-id">T-002</div>
                    <Button variant="primary" size="sm" className="status-btn">Open</Button>
                  </div>
                  <div className="ticket-content">
                    <h4>System Performance</h4>
                    <p>Application running slowly on mobile devices</p>
                    <div className="ticket-meta">
                      <span className="timestamp">4 hours ago</span>
                      <div className="engagement">
                        <span className="upvote">⬆️ 12</span>
                        <span className="downvote">⬇️ 0</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="activity-card">
                <Card.Body>
                  <div className="ticket-header">
                    <div className="ticket-id">T-003</div>
                    <Button variant="success" size="sm" className="status-btn">Resolved</Button>
                  </div>
                  <div className="ticket-content">
                    <h4>Feature Request</h4>
                    <p>Dark mode toggle for better user experience</p>
                    <div className="ticket-meta">
                      <span className="timestamp">1 day ago</span>
                      <div className="engagement">
                        <span className="upvote">⬆️ 28</span>
                        <span className="downvote">⬇️ 2</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="activity-card">
                <Card.Body>
                  <div className="ticket-header">
                    <div className="ticket-id">T-004</div>
                    <Button variant="warning" size="sm" className="status-btn">In Progress</Button>
                  </div>
                  <div className="ticket-content">
                    <h4>Bug Report</h4>
                    <p>Dashboard not loading on Safari browser</p>
                    <div className="ticket-meta">
                      <span className="timestamp">3 days ago</span>
                      <div className="engagement">
                        <span className="upvote">⬆️ 15</span>
                        <span className="downvote">⬇️ 1</span>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Ticket Modal */}
      <Modal show={showAddTicketModal} onHide={handleCloseModal} size="lg" className="ticket-modal">
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Create New Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Brief description of the issue"
                    className="modal-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select className="modal-input">
                    <option>Technical Issue</option>
                    <option>Feature Request</option>
                    <option>Bug Report</option>
                    <option>General Inquiry</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Priority *</Form.Label>
                  <Form.Select className="modal-input">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select className="modal-input">
                    <option>IT Support</option>
                    <option>Customer Service</option>
                    <option>Sales</option>
                    <option>General</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Detailed description of the issue..."
                className="modal-input"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Attachments</Form.Label>
              <Form.Control 
                type="file" 
                multiple 
                className="modal-input"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary">
            Create Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserDashboard; 