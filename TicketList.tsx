import React, { useState, useEffect, useRef } from 'react';
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

  const isMounted = useRef(true);

  const loadTickets = async () => {
    if (!isMounted.current) return;
    
    console.log('TicketList: Starting to load tickets...');
    setLoading(true);
    setError('');
    
    try {
      // Check if user is authenticated
      if (!apiService.isAuthenticated()) {
        setError('User not authenticated. Please log in again.');
        setLoading(false);
        return;
      }

      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      // Only add non-empty filter values
      if (filters.status && filters.status.trim() !== '') {
        params.status = filters.status;
      }
      if (filters.priority && filters.priority.trim() !== '') {
        params.priority = filters.priority;
      }
      if (filters.category && filters.category.trim() !== '') {
        params.category = filters.category;
      }
      
      console.log('TicketList: Making API call with params:', params);
      const response = await apiService.getTickets(params);
      console.log('TicketList: API response received:', response);
      console.log('TicketList: Tickets count:', response.data.tickets.length);
      
      if (isMounted.current) {
        setTickets(response.data.tickets);
        setPagination(response.data.pagination);
        console.log('TicketList: State updated with tickets');
      }
    } catch (error) {
      if (isMounted.current) {
        console.error('Error loading tickets:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to load tickets. Please check your connection.');
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        console.log('TicketList: Loading finished, loading state:', false);
      }
    }
  };

  // Single useEffect to handle initial load
  useEffect(() => {
    loadTickets();
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Only run once on mount

  // Handle filter and pagination changes without causing loops
  const prevFiltersRef = useRef(filters);
  const prevPaginationRef = useRef(pagination);

  useEffect(() => {
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    const paginationChanged = JSON.stringify(prevPaginationRef.current) !== JSON.stringify(pagination);
    
    if ((filtersChanged || paginationChanged) && !loading && isMounted.current) {
      loadTickets();
      prevFiltersRef.current = filters;
      prevPaginationRef.current = pagination;
    }
  }, [filters, pagination.page, pagination.limit, loading]);

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
        <Spinner animation="border" role="status" variant="light">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2 text-light">Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="ticket-list-container" style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '20px' }}>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
          <strong>Error:</strong> {error}
          <br />
          <small>Please check your connection and try again.</small>
        </Alert>
      )}

      <Row className="mb-3 align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label className="text-light">Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', color: '#ffffff' }}
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
            <Form.Label className="text-light">Priority</Form.Label>
            <Form.Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', color: '#ffffff' }}
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
            <Form.Label className="text-light">Category</Form.Label>
            <Form.Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              style={{ backgroundColor: '#2d2d2d', border: '1px solid #404040', color: '#ffffff' }}
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
            <Button variant="primary" onClick={onCreateClick} style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
              Create Ticket
            </Button>
          )}
        </Col>
      </Row>

      {tickets.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No tickets found.</p>
          {showCreateButton && onCreateClick && (
            <Button variant="primary" onClick={onCreateClick} style={{ backgroundColor: '#007bff', borderColor: '#007bff' }}>
              Create Your First Ticket
            </Button>
          )}
        </div>
      ) : (
        <>
          <Table responsive hover style={{ backgroundColor: '#2d2d2d', color: '#ffffff', borderRadius: '8px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#1a1a1a' }}>
              <tr>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Title</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Status</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Priority</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Category</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Created By</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Assigned To</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Created</th>
                <th style={{ borderColor: '#404040', color: '#ffffff' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className={onTicketClick ? 'cursor-pointer' : ''} style={{ borderColor: '#404040' }}>
                  <td style={{ borderColor: '#404040' }}>
                    <div>
                      <strong style={{ color: '#ffffff' }}>{ticket.title}</strong>
                      <div className="text-muted small" style={{ color: '#b0b0b0' }}>
                        {truncateText(ticket.description, 80)}
                      </div>
                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="mt-1">
                          {ticket.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} bg="secondary" className="me-1" style={{ backgroundColor: '#6c757d' }}>
                              {tag}
                            </Badge>
                          ))}
                          {ticket.tags.length > 3 && (
                            <Badge bg="secondary" style={{ backgroundColor: '#6c757d' }}>
                              +{ticket.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ borderColor: '#404040' }}>{getStatusBadge(ticket.status)}</td>
                  <td style={{ borderColor: '#404040' }}>{getPriorityBadge(ticket.priority)}</td>
                  <td style={{ borderColor: '#404040' }}>
                    <Badge bg="outline-secondary" style={{ backgroundColor: '#6c757d', color: '#ffffff' }}>{ticket.category}</Badge>
                  </td>
                  <td style={{ borderColor: '#404040' }}>
                    <div className="small">
                      <div style={{ color: '#ffffff' }}>{ticket.createdBy.email}</div>
                      <div className="text-muted" style={{ color: '#b0b0b0' }}>{ticket.createdBy.role}</div>
                    </div>
                  </td>
                  <td style={{ borderColor: '#404040' }}>
                    {ticket.assignedTo ? (
                      <div className="small">
                        <div style={{ color: '#ffffff' }}>{ticket.assignedTo.email}</div>
                        <div className="text-muted" style={{ color: '#b0b0b0' }}>{ticket.assignedTo.role}</div>
                      </div>
                    ) : (
                      <span className="text-muted" style={{ color: '#b0b0b0' }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ borderColor: '#404040' }}>
                    <div className="small" style={{ color: '#b0b0b0' }}>
                      {formatDate(ticket.createdAt)}
                    </div>
                  </td>
                  <td style={{ borderColor: '#404040' }}>
                    {onTicketClick && (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => onTicketClick(ticket)}
                        style={{ borderColor: '#007bff', color: '#007bff' }}
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
              <Pagination style={{ backgroundColor: '#2d2d2d', borderRadius: '8px', padding: '10px' }}>
                <Pagination.First 
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  style={{ backgroundColor: '#2d2d2d', borderColor: '#404040', color: '#ffffff' }}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  style={{ backgroundColor: '#2d2d2d', borderColor: '#404040', color: '#ffffff' }}
                />
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.pages - 4, pagination.page - 2)) + i;
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === pagination.page}
                      onClick={() => handlePageChange(pageNum)}
                      style={{ 
                        backgroundColor: pageNum === pagination.page ? '#007bff' : '#2d2d2d',
                        borderColor: '#404040',
                        color: pageNum === pagination.page ? '#ffffff' : '#ffffff'
                      }}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                })}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  style={{ backgroundColor: '#2d2d2d', borderColor: '#404040', color: '#ffffff' }}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={pagination.page === pagination.pages}
                  style={{ backgroundColor: '#2d2d2d', borderColor: '#404040', color: '#ffffff' }}
                />
              </Pagination>
            </div>
          )}

          <div className="text-center text-muted mt-2" style={{ color: '#b0b0b0' }}>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tickets
          </div>
        </>
      )}
    </div>
  );
};

export default TicketList; 