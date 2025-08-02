import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SupportAgentDashboard.css';
import TicketList from './TicketList';
import apiService, { Ticket, TicketStats } from '../services/api';

interface SupportAgentDashboardProps {
  onLogout: () => void;
  userRole: 'user' | 'admin' | 'support';
}

const SupportAgentDashboard: React.FC<SupportAgentDashboardProps> = ({ onLogout, userRole }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const loadStats = async () => {
    try {
      const response = await apiService.getTicketStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    // You can implement a ticket detail modal here
    console.log('Ticket clicked:', ticket);
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
          <div className={`nav-item ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
            <div className="nav-icon">🎫</div>
            <span>My Tickets</span>
          </div>
          <div className={`nav-item ${activeTab === 'queue' ? 'active' : ''}`} onClick={() => setActiveTab('queue')}>
            <div className="nav-icon">📋</div>
            <span>Ticket Queue</span>
          </div>
          <div className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`} onClick={() => setActiveTab('knowledge')}>
            <div className="nav-icon">📚</div>
            <span>Knowledge Base</span>
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
            <h1>Support Agent Dashboard</h1>
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
                <div className="profile-name">Support Agent</div>
                <div className="profile-email">agent@help.com</div>
              </div>
              <div className="profile-avatar">
                <div className="avatar">👨‍💻</div>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {activeTab === 'dashboard' && (
            <>
              {/* Overview Cards */}
              <div className="overview-cards">
                <Row>
                  <Col md={3}>
                    <Card className="overview-card">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon blue">📋</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getStatusCount('open')}</h3>
                          <h4>Open Tickets</h4>
                          <p>Awaiting response</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="overview-card">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon yellow">⚡</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getStatusCount('in-progress')}</h3>
                          <h4>In Progress</h4>
                          <p>Being handled</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3}>
                    <Card className="overview-card">
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
                  <Col md={3}>
                    <Card className="overview-card">
                      <Card.Body>
                        <div className="card-header">
                          <div className="card-icon red">🚨</div>
                          <div className="refresh-icon">🔄</div>
                        </div>
                        <div className="card-content">
                          <h3>{getPriorityCount('urgent')}</h3>
                          <h4>Urgent</h4>
                          <p>High priority tickets</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* My Assigned Tickets */}
              <div className="my-tickets">
                <div className="section-header">
                  <h3>My Assigned Tickets</h3>
                  <p>Tickets assigned to you for resolution</p>
                </div>
                <TicketList 
                  onTicketClick={handleTicketClick}
                  showCreateButton={false}
                />
              </div>
            </>
          )}

          {activeTab === 'tickets' && (
            <div className="tickets-section">
              <div className="section-header">
                <h2>My Tickets</h2>
                <p>Manage tickets assigned to you</p>
              </div>
              <TicketList 
                onTicketClick={handleTicketClick}
                showCreateButton={false}
              />
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="queue-section">
              <div className="section-header">
                <h2>Ticket Queue</h2>
                <p>Unassigned tickets available for pickup</p>
              </div>
              <TicketList 
                onTicketClick={handleTicketClick}
                showCreateButton={false}
              />
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="knowledge-section">
              <h2>Knowledge Base</h2>
              <p>Access support documentation and solutions</p>
              <div className="text-center py-5">
                <p className="text-muted">Knowledge base features coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Settings</h2>
              <p>Manage your support agent preferences</p>
              <div className="text-center py-5">
                <p className="text-muted">Settings features coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupportAgentDashboard; 