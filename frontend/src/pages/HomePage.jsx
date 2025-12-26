import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaBullseye, FaUsers } from 'react-icons/fa';

const HomePage = () => {
    const features = [
        {
            icon: <FaChartLine />,
            title: 'Track Everything',
            description: 'Monitor your daily activities across three main categories: Self-care, Productivity, and Rewards.'
        },
        {
            icon: <FaCalendarAlt />,
            title: 'Daily Progress',
            description: 'See your progress with beautiful charts and statistics. Stay motivated with goal tracking.'
        },
        {
            icon: <FaBullseye />,
            title: 'Set Goals',
            description: 'Define personal goals for each category and track your achievements over time.'
        },
        {
            icon: <FaUsers />,
            title: 'Balance Life',
            description: 'Achieve perfect work-life balance by tracking all aspects of your daily routine.'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section py-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
            }}>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h1 className="display-4 fw-bold mb-4">
                                Track Your Daily Activities
                            </h1>
                            <p className="lead mb-4">
                                Achieve perfect balance between self-care, productivity, and rewards. 
                                Monitor your progress, set goals, and improve your daily routine.
                            </p>
                            <div className="d-flex gap-3">
                                <Button 
                                    as={Link} 
                                    to="/register" 
                                    size="lg"
                                    className="btn-light"
                                >
                                    Get Started Free
                                </Button>
                                <Button 
                                    as={Link} 
                                    to="/login" 
                                    size="lg"
                                    variant="outline-light"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="glass-card p-4 mt-4 mt-lg-0" style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <div className="text-center p-3">
                                    <h4 className="mb-3">Dashboard Preview</h4>
                                    <div className="d-flex justify-content-center mb-3">
                                        <span className="badge bg-success me-2">Self-care</span>
                                        <span className="badge bg-primary me-2">Productivity</span>
                                        <span className="badge bg-warning">Reward</span>
                                    </div>
                                    <p className="mb-0">Track activities, view stats, and achieve goals</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Features Section */}
            <section className="py-5">
                <Container>
                    <h2 className="text-center mb-5 fw-bold gradient-text">Why Choose Daily Tracker?</h2>
                    <Row>
                        {features.map((feature, index) => (
                            <Col key={index} md={6} lg={3} className="mb-4">
                                <Card className="glass-card border-0 h-100">
                                    <Card.Body className="text-center p-4">
                                        <div className="display-4 text-primary mb-3">
                                            {feature.icon}
                                        </div>
                                        <Card.Title className="mb-3">{feature.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {feature.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="py-5 bg-light">
                <Container>
                    <h2 className="text-center mb-5 fw-bold gradient-text">Three Pillars of Balanced Life</h2>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle bg-success p-3 me-3">
                                            <FaChartLine size={24} color="white" />
                                        </div>
                                        <Card.Title className="mb-0">Self-care</Card.Title>
                                    </div>
                                    <Card.Text>
                                        Track activities like Yoga, Meditation, Gym, Spa, Hobby, and Walks to maintain physical and mental well-being.
                                    </Card.Text>
                                    <ul className="list-unstyled">
                                        <li>✓ Yoga & Meditation</li>
                                        <li>✓ Gym & Exercise</li>
                                        <li>✓ Personal Hobbies</li>
                                        <li>✓ Relaxation Time</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle bg-primary p-3 me-3">
                                            <FaBullseye size={24} color="white" />
                                        </div>
                                        <Card.Title className="mb-0">Productivity</Card.Title>
                                    </div>
                                    <Card.Text>
                                        Monitor your productive activities including Study, Cleaning, Reading, Cooking, and other tasks to maximize efficiency.
                                    </Card.Text>
                                    <ul className="list-unstyled">
                                        <li>✓ Study & Learning</li>
                                        <li>✓ Cleaning & Chores</li>
                                        <li>✓ Reading & Research</li>
                                        <li>✓ Cooking & Meal Prep</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4} className="mb-4">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle bg-warning p-3 me-3">
                                            <FaUsers size={24} color="white" />
                                        </div>
                                        <Card.Title className="mb-0">Rewards</Card.Title>
                                    </div>
                                    <Card.Text>
                                        Reward yourself with activities like Watching TV, Hangouts, Shopping, Desserts, and Vacations for maintaining balance.
                                    </Card.Text>
                                    <ul className="list-unstyled">
                                        <li>✓ Entertainment</li>
                                        <li>✓ Social Activities</li>
                                        <li>✓ Shopping & Leisure</li>
                                        <li>✓ Vacation & Travel</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-5">
                <Container className="text-center">
                    <div className="glass-card p-5" style={{
                        background: 'linear-gradient(45deg, #4e54c8, #8f94fb)',
                        color: 'white'
                    }}>
                        <h2 className="mb-4">Ready to Transform Your Daily Routine?</h2>
                        <p className="lead mb-4">
                            Join thousands of users who have improved their work-life balance with Daily Activity Tracker.
                        </p>
                        <Button 
                            as={Link} 
                            to="/register" 
                            size="lg"
                            className="btn-light px-5"
                        >
                            Start Tracking Now
                        </Button>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default HomePage;