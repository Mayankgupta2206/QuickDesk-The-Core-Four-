import React, { useState, useEffect, useCallback } from 'react';
import { Table, Badge, Button, Form, Row, Col, Pagination, Alert, Spinner } from 'react-bootstrap';
import apiService, { Ticket } from '../services/api';

interface TicketListProps {
  onTicketClick?: (ticket: Ticket) => void;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

const TicketList: React.FC<TicketListProps> = ({ 
  onTicketClick, 
  showCreateButton = false, 
  onCreateClick 
}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const loadTickets = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        setError('User not authenticated. Please log in again.');
        setLoading(false);
        return;
      }

      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await apiService.getTickets(params);
      
      setTickets(response.data.tickets);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading tickets:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load tickets. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []); // Only run once on mount

  // Handle filter and pagination changes
  useEffect(() => {
    if (!loading) {
      loadTickets();
    }
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'secondary',
      medium: 'info',
      high: 'warning',
      urgent: 'danger'
    };
    return <Badge bg={variants[priority as keyof typeof variants] || 'secondary'}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'primary',
      'in-progress': 'warning',
      resolved: 'success',
      closed: 'secondary'
    };
    return <Badge bg={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <strong>Error:</strong> {error}
          <br />
          <small>Please check your connection and try again.</small>
        </Alert>
      )}

      <Row className="mb-3 align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="bug">Bug Report</option>
              <option value="feature-request">Feature Request</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="text-end">
          {showCreateButton && onCreateClick && (
            <Button variant="primary" onClick={onCreateClick}>
              Create Ticket
            </Button>
          )}
        </Col>
      </Row>

      {tickets.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No tickets found.</p>
          {showCreateButton && onCreateClick && (
            <Button variant="primary" onClick={onCreateClick}>
              Create Your First Ticket
            </Button>
          )}
        </div>
      ) : (
        <>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Created By</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className={onTicketClick ? 'cursor-pointer' : ''}>
                  <td>
                    <div>
                      <strong>{ticket.title}</strong>
                      <div className="text-muted small">
                        {truncateText(ticket.description, 80)}
                      </div>
                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="mt-1">
                          {ticket.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} bg="light" text="dark" className="me-1">
                              {tag}
                            </Badge>
                          ))}
                          {ticket.tags.length > 3 && (
                            <Badge bg="light" text="dark">
                              +{ticket.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>
                    <Badge bg="outline-secondary">{ticket.category}</Badge>
                  </td>
                  <td>
                    <div className="small">
                      <div>{ticket.createdBy.email}</div>
                      <div className="text-muted">{ticket.createdBy.role}</div>
                    </div>
                  </td>
                  <td>
                    {ticket.assignedTo ? (
                      <div className="small">
                        <div>{ticket.assignedTo.email}</div>
                        <div className="text-muted">{ticket.assignedTo.role}</div>
                      </div>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div className="small">
                      {formatDate(ticket.createdAt)}
                    </div>
                  </td>
                  <td>
                    {onTicketClick && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => onTicketClick(ticket)}
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.First 
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                />
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === pagination.page}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={pagination.page === pagination.pages}
                />
              </Pagination>
            </div>
          )}

          <div className="text-center text-muted mt-2">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
          </div>
        </>
      )}
    </div>
  );
};

export default TicketList; 