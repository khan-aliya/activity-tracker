import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import ActivityForm from '../components/Dashboard/ActivityForm';
import ActivityTable from '../components/Dashboard/ActivityTable';

const DashboardPage = () => {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleActivityAdded = () => {
        setRefreshTrigger(prev => prev + 1);
        setShowForm(false); // Hide form after adding
    };

    return (
        <Container fluid className="py-4 px-3 dashboard-container">
            {/* Header - Simplified */}
            <Row className="mb-4">
                <Col>
                    <div className="mb-4">
                        <h1 className="fw-bold mb-2">
                            Welcome, {user?.name || user?.email || 'User'}! 👋
                        </h1>
                        <p className="text-muted mb-0">
                            Track your daily activities and maintain balance in your life
                        </p>
                    </div>
                </Col>
            </Row>

            {/* Activity Categories Section - MOVED TO TOP */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Activity Categories</h5>
                            <div className="d-flex flex-wrap gap-4 justify-content-center">
                                <div className="text-center">
                                    <div className="bg-success bg-opacity-10 p-4 rounded-circle mb-3">
                                        <span className="fs-2">🧘‍♀️</span>
                                    </div>
                                    <h6 className="mb-1">Self-care</h6>
                                    <small className="text-muted">Personal well-being activities</small>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-primary bg-opacity-10 p-4 rounded-circle mb-3">
                                        <span className="fs-2">💼</span>
                                    </div>
                                    <h6 className="mb-1">Productivity</h6>
                                    <small className="text-muted">Work & task related activities</small>
                                </div>
                                
                                <div className="text-center">
                                    <div className="bg-warning bg-opacity-10 p-4 rounded-circle mb-3">
                                        <span className="fs-2">🎁</span>
                                    </div>
                                    <h6 className="mb-1">Reward</h6>
                                    <small className="text-muted">Fun & relaxation activities</small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Stats Summary */}
            <Row className="mb-4">
                <Col md={3} sm={6} className="mb-3">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <span className="fs-3 text-primary">📝</span>
                            </div>
                            <h6 className="mb-1">Activity Tracker</h6>
                            <p className="text-muted mb-0 small">Log your daily activities</p>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={3} sm={6} className="mb-3">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center">
                            <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <span className="fs-3 text-success">⚖️</span>
                            </div>
                            <h6 className="mb-1">3 Categories</h6>
                            <p className="text-muted mb-0 small">Balance all aspects</p>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={3} sm={6} className="mb-3">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center">
                            <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <span className="fs-3 text-warning">😊</span>
                            </div>
                            <h6 className="mb-1">Mood Tracking</h6>
                            <p className="text-muted mb-0 small">Rate 1-10 scale</p>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={3} sm={6} className="mb-3">
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center">
                            <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                <span className="fs-3 text-info">📊</span>
                            </div>
                            <h6 className="mb-1">History View</h6>
                            <p className="text-muted mb-0 small">View past activities</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Activity Section */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <h5 className="mb-0">Log New Activity</h5>
                                    <small className="text-muted">
                                        Track what you're doing and how you feel about it
                                    </small>
                                </div>
                                <div className="d-flex gap-2">
                                    {!showForm && (
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => setShowForm(true)}
                                        >
                                            <span className="me-1">+</span> Add New Activity
                                        </Button>
                                    )}
                                    {showForm && (
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Hide Form
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {showForm && <ActivityForm onActivityAdded={handleActivityAdded} />}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Activity Table */}
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white">
                            <div>
                                <h5 className="mb-0">Your Activity History</h5>
                                <small className="text-muted">
                                    View, edit, and manage all your logged activities
                                </small>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-3">
                            <ActivityTable refreshTrigger={refreshTrigger} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Tips Section - Only keeping the useful tips */}
            <Row>
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <h6 className="mb-3">💡 Tips for Better Tracking</h6>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <small>• Log activities right after completion</small>
                                </li>
                                <li className="mb-2">
                                    <small>• Be honest with your feeling ratings</small>
                                </li>
                                <li className="mb-2">
                                    <small>• Balance all three categories daily</small>
                                </li>
                                <li>
                                    <small>• Review your history weekly</small>
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body>
                            <h6 className="mb-3">📈 What to Track</h6>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">
                                    <small><Badge bg="success" className="me-1">Self-care</Badge> Exercise, meditation, sleep</small>
                                </li>
                                <li className="mb-2">
                                    <small><Badge bg="primary" className="me-1">Productivity</Badge> Work, study, cleaning</small>
                                </li>
                                <li>
                                    <small><Badge bg="warning" className="me-1">Reward</Badge> Entertainment, social, hobbies</small>
                                </li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage;