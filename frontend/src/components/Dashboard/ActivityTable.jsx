import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Spinner, Badge, Pagination, Form, Row, Col, Card, Modal, Alert } from 'react-bootstrap';
import { activityService } from '../../services/api';

const ActivityTable = ({ refreshTrigger }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    
    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        category: 'Self-care',
        sub_category: 'Yoga',
        duration: 60,
        date: '',
        feeling: 5,
        notes: ''
    });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    
    // Filter states (Simplified)
    const [filters, setFilters] = useState({
        search: '',
        category: 'all',
        date_range: 'all',
        start_date: '',
        end_date: ''
    });

    const categories = {
        'Self-care': {
            color: 'success',
            subCategories: ['Yoga', 'Gym', 'Meditation', 'Spa', 'Hobby', 'Walk', 'Other']
        },
        'Productivity': {
            color: 'primary',
            subCategories: ['Study', 'Cleaning', 'Laundry', 'Reading', 'Cooking', 'Other']
        },
        'Reward': {
            color: 'warning',
            subCategories: ['Watching TV', 'Hangout with friends', 'Shopping', 'Enjoying dessert', 'Vacation', 'Other']
        }
    };

    const fetchActivities = useCallback(async (page = 1) => {
        setLoading(true);
        setError('');
        
        // Prepare filter params
        const params = {
            page,
            per_page: 10
        };
        
        // Add filters if they have values
        if (filters.search) params.search = filters.search;
        if (filters.category !== 'all') params.category = filters.category;
        
        // Handle date range filters
        if (filters.date_range !== 'all') {
            const today = new Date();
            const startDate = new Date();
            
            switch (filters.date_range) {
                case 'today':
                    startDate.setHours(0, 0, 0, 0);
                    params.start_date = startDate.toISOString().split('T')[0];
                    params.end_date = today.toISOString().split('T')[0];
                    break;
                case 'week':
                    startDate.setDate(today.getDate() - 7);
                    params.start_date = startDate.toISOString().split('T')[0];
                    params.end_date = today.toISOString().split('T')[0];
                    break;
                case 'month':
                    startDate.setDate(today.getDate() - 30);
                    params.start_date = startDate.toISOString().split('T')[0];
                    params.end_date = today.toISOString().split('T')[0];
                    break;
                case 'custom':
                    if (filters.start_date) params.start_date = filters.start_date;
                    if (filters.end_date) params.end_date = filters.end_date;
                    break;
                default:
                    // For 'all', don't add any date filters
                    break;
            }
        }

        try {
            const response = await activityService.getAll(params);
            
            // Handle paginated response
            if (response.data && response.data.data) {
                // Laravel paginated response
                setActivities(response.data.data);
                setTotalPages(response.data.last_page || 1);
                setCurrentPage(response.data.current_page || 1);
                setTotalItems(response.data.total || 0);
            } else if (Array.isArray(response.data)) {
                // Simple array response
                setActivities(response.data);
                setTotalPages(1);
                setCurrentPage(1);
                setTotalItems(response.data.length || 0);
            } else {
                // Fallback
                setActivities([]);
                setTotalPages(1);
                setCurrentPage(1);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            setError(error.response?.data?.message || 'Failed to load activities. Please try again.');
            setActivities([]);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [filters, refreshTrigger]);

    useEffect(() => {
        fetchActivities(currentPage);
    }, [fetchActivities, currentPage, refreshTrigger]);

    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setEditFormData({
            title: activity.title || '',
            category: activity.category || 'Self-care',
            sub_category: activity.sub_category || 'Yoga',
            duration: activity.duration || 60,
            date: activity.date ? activity.date.split('T')[0] : new Date().toISOString().split('T')[0],
            feeling: activity.feeling || 5,
            notes: activity.notes || ''
        });
        setEditError('');
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingActivity) return;
        
        setEditLoading(true);
        setEditError('');
        
        try {
            await activityService.update(editingActivity._id || editingActivity.id, editFormData);
            setShowEditModal(false);
            fetchActivities(currentPage); // Refresh the list
            
            // Show success message
            alert('Activity updated successfully!');
        } catch (error) {
            console.error('Error updating activity:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                setEditError(errorMessages.join(', '));
            } else {
                setEditError(error.response?.data?.message || 'Failed to update activity. Please try again.');
            }
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this activity?')) {
            try {
                await activityService.delete(id);
                fetchActivities(currentPage); // Refresh the list
                alert('Activity deleted successfully!');
            } catch (error) {
                console.error('Error deleting activity:', error);
                alert(error.response?.data?.message || 'Failed to delete activity');
            }
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = {
            ...filters,
            [key]: value
        };
        
        // If date_range changes from custom, clear custom dates
        if (key === 'date_range' && value !== 'custom') {
            newFilters.start_date = '';
            newFilters.end_date = '';
        }
        
        setFilters(newFilters);
    };

    const handleApplyFilters = () => {
        setCurrentPage(1); // Reset to first page when filters change
        fetchActivities(1);
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            category: 'all',
            date_range: 'all',
            start_date: '',
            end_date: ''
        });
        setCurrentPage(1);
        // Trigger fetch with reset filters
        setTimeout(() => fetchActivities(1), 0);
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Self-care': return 'success';
            case 'Productivity': return 'primary';
            case 'Reward': return 'warning';
            default: return 'secondary';
        }
    };

    const getFeelingEmoji = (feeling) => {
        if (feeling >= 9) return '😊';
        if (feeling >= 7) return '🙂';
        if (feeling >= 5) return '😐';
        if (feeling >= 3) return '😕';
        return '😔';
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    const isToday = (dateString) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            return dateString === today;
        } catch (error) {
            return false;
        }
    };

    // Simplified Filter Form Component
    const FilterForm = () => (
        <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
                <h6 className="mb-3">Filter Activities</h6>
                <Row className="g-3">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label className="small">Search Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search activities..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                size="sm"
                            />
                        </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="small">Category</Form.Label>
                            <Form.Select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                size="sm"
                            >
                                <option value="all">All Categories</option>
                                <option value="Self-care">Self-care</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Reward">Reward</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label className="small">Date Range</Form.Label>
                            <Form.Select
                                value={filters.date_range}
                                onChange={(e) => handleFilterChange('date_range', e.target.value)}
                                size="sm"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                                <option value="custom">Custom Range</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    
                    <Col md={2} className="d-flex align-items-end">
                        <div className="d-flex gap-2 w-100">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={handleApplyFilters}
                                className="flex-grow-1"
                            >
                                Apply
                            </Button>
                            <Button 
                                variant="outline-secondary" 
                                size="sm"
                                onClick={handleResetFilters}
                            >
                                Reset
                            </Button>
                        </div>
                    </Col>
                </Row>
                
                {/* Custom Date Range (only shown when custom is selected) */}
                {filters.date_range === 'custom' && (
                    <Row className="g-3 mt-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small">Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.start_date}
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                    size="sm"
                                    max={filters.end_date || new Date().toISOString().split('T')[0]}
                                />
                            </Form.Group>
                        </Col>
                        
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="small">End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={filters.end_date}
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                    size="sm"
                                    min={filters.start_date}
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}
            </Card.Body>
        </Card>
    );

    // Edit Modal Component
    const EditModal = () => (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editError && (
                    <Alert variant="danger" onClose={() => setEditError('')} dismissible>
                        {editError}
                    </Alert>
                )}
                
                {editingActivity && (
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Activity Title *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editFormData.title}
                                        onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                                        placeholder="Enter activity title"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category *</Form.Label>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {Object.keys(categories).map((cat) => (
                                            <Button
                                                key={cat}
                                                type="button"
                                                variant={editFormData.category === cat ? categories[cat].color : 'outline-' + categories[cat].color}
                                                onClick={() => setEditFormData({
                                                    ...editFormData, 
                                                    category: cat,
                                                    sub_category: categories[cat].subCategories[0]
                                                })}
                                                className="flex-grow-1"
                                            >
                                                {cat}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Sub Category *</Form.Label>
                            <div className="d-flex flex-wrap gap-2">
                                {categories[editFormData.category]?.subCategories.map((sub) => (
                                    <Button
                                        key={sub}
                                        type="button"
                                        variant={editFormData.sub_category === sub ? categories[editFormData.category].color : 'outline-' + categories[editFormData.category].color}
                                        onClick={() => setEditFormData({...editFormData, sub_category: sub})}
                                    >
                                        {sub}
                                    </Button>
                                ))}
                            </div>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duration: {editFormData.duration} minutes *</Form.Label>
                                    <Form.Range
                                        value={editFormData.duration}
                                        onChange={(e) => setEditFormData({...editFormData, duration: parseInt(e.target.value)})}
                                        min="5"
                                        max="240"
                                        step="5"
                                    />
                                    <div className="d-flex justify-content-between small text-muted">
                                        <span>5 min</span>
                                        <span>240 min (4 hours)</span>
                                    </div>
                                </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editFormData.date}
                                        onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>How are you feeling? ({editFormData.feeling}/10) *</Form.Label>
                            <Form.Range
                                value={editFormData.feeling}
                                onChange={(e) => setEditFormData({...editFormData, feeling: parseInt(e.target.value)})}
                                min="1"
                                max="10"
                            />
                            <div className="d-flex justify-content-between align-items-center mt-2">
                                <small className="text-muted">😔 Sad</small>
                                <div className="text-center">
                                    <div className="fs-4">{editFormData.feeling}/10</div>
                                    <div className="small">
                                        {editFormData.feeling >= 9 ? 'Excellent' : 
                                         editFormData.feeling >= 7 ? 'Good' : 
                                         editFormData.feeling >= 5 ? 'Neutral' : 
                                         editFormData.feeling >= 3 ? 'Fair' : 'Poor'}
                                    </div>
                                </div>
                                <small className="text-muted">😊 Happy</small>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={editFormData.notes}
                                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                                rows={3}
                                placeholder="Add any additional notes..."
                            />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdate} disabled={editLoading}>
                    {editLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                        </>
                    ) : 'Update Activity'}
                </Button>
            </Modal.Footer>
        </Modal>
    );

    if (loading && activities.length === 0) {
        return (
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white">
                    <h5 className="mb-0">Your Activities</h5>
                </Card.Header>
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Loading activities...</p>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div>
            <FilterForm />
            <EditModal />
            
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white">
                    <h5 className="mb-0">Your Activities</h5>
                    {totalItems > 0 && (
                        <small className="text-muted">
                            {totalItems} activity{totalItems !== 1 ? 's' : ''} found
                        </small>
                    )}
                </Card.Header>
                
                <div className="table-responsive px-3"> {/* Added px-3 for padding */}
                    <Table hover className="mb-0">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Category</th>
                                <th>Duration</th>
                                <th>Date</th>
                                <th>Feeling</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="text-muted mb-2">
                                            {filters.search || filters.category !== 'all' || filters.date_range !== 'all'
                                                ? 'No activities match your filters' 
                                                : 'No activities found. Add your first activity above!'}
                                        </div>
                                        {(filters.search || filters.category !== 'all' || filters.date_range !== 'all') && (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                onClick={handleResetFilters}
                                            >
                                                Clear Filters
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                activities.map((activity) => (
                                    <tr key={activity._id || activity.id}>
                                        <td>
                                            <div>
                                                <strong>{activity.title}</strong>
                                                {activity.notes && (
                                                    <div className="text-muted small mt-1">
                                                        {activity.notes}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-muted small">
                                                {activity.sub_category}
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg={getCategoryColor(activity.category)}>
                                                {activity.category}
                                            </Badge>
                                        </td>
                                        <td>
                                            <strong>{activity.duration}</strong> min
                                        </td>
                                        <td>
                                            {formatDate(activity.date)}
                                            {isToday(activity.date) && (
                                                <div className="small text-success">Today</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2 fs-5">
                                                    {getFeelingEmoji(activity.feeling)}
                                                </span>
                                                <div>
                                                    <strong>{activity.feeling}/10</strong>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => handleEdit(activity)}
                                                    title="Edit activity"
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(activity._id || activity.id)}
                                                    title="Delete activity"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
                
                {totalPages > 1 && (
                    <Card.Footer className="bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">
                                Page {currentPage} of {totalPages} • {totalItems} total items
                            </small>
                            <Pagination size="sm" className="mb-0">
                                <Pagination.Prev 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                />
                                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = index + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = index + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + index;
                                    } else {
                                        pageNum = currentPage - 2 + index;
                                    }
                                    
                                    return (
                                        <Pagination.Item
                                            key={pageNum}
                                            active={pageNum === currentPage}
                                            onClick={() => setCurrentPage(pageNum)}
                                        >
                                            {pageNum}
                                        </Pagination.Item>
                                    );
                                })}
                                <Pagination.Next 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                />
                            </Pagination>
                        </div>
                    </Card.Footer>
                )}
            </Card>
        </div>
    );
};

export default ActivityTable;