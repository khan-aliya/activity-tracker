import { useState } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await register(formData);
        
        if (result.success) {
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    const features = [
        { icon: '📊', title: 'Track Activities', desc: 'Log daily self-care, work, and rewards' },
        { icon: '⚖️', title: 'Balance Life', desc: 'Maintain harmony between different aspects' },
        { icon: '📈', title: 'See Progress', desc: 'Monitor your growth over time' },
        { icon: '😊', title: 'Track Mood', desc: 'Record how activities make you feel' }
    ];

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col lg={10} xl={8}>
                    <Row className="g-4">
                        {/* Left Column - App Info */}
                        <Col md={6} className="d-flex flex-column justify-content-center">
                            <div className="mb-5">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="bg-primary bg-gradient p-3 rounded-circle me-3">
                                        <FaChartLine size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h1 className="fw-bold text-primary mb-0">ActivityTracker</h1>
                                        <p className="text-muted">Your Personal Activity Journal</p>
                                    </div>
                                </div>
                                
                                <h2 className="fw-bold mb-4">Start Tracking Your Journey</h2>
                                <p className="text-muted mb-5">
                                    Join thousands of users who are balancing their lives and achieving more 
                                    by tracking their daily activities across self-care, productivity, and rewards.
                                </p>

                                <div className="row g-3 mb-5">
                                    {features.map((feature, index) => (
                                        <div key={index} className="col-6">
                                            <div className="d-flex align-items-start">
                                                <span className="fs-4 me-2">{feature.icon}</span>
                                                <div>
                                                    <h6 className="fw-semibold mb-1">{feature.title}</h6>
                                                    <small className="text-muted">{feature.desc}</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="d-flex align-items-center text-muted">
                                    <FaCheckCircle className="text-success me-2" />
                                    <small>Free forever • No credit card required</small>
                                </div>
                            </div>
                        </Col>

                        {/* Right Column - Registration Form */}
                        <Col md={6}>
                            <Card className="border-0 shadow-lg rounded-3 h-100">
                                <Card.Body className="p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <h3 className="fw-bold">Create Your Account</h3>
                                        <p className="text-muted">Fill in your details to get started</p>
                                    </div>

                                    {error && (
                                        <Alert variant="danger" className="text-center mb-4">
                                            {error}
                                        </Alert>
                                    )}

                                    {success && (
                                        <Alert variant="success" className="text-center mb-4">
                                            {success}
                                        </Alert>
                                    )}

                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <FaUser className="me-2" />
                                                Full Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                required
                                                className="py-2"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <FaEnvelope className="me-2" />
                                                Email Address
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="name@example.com"
                                                required
                                                className="py-2"
                                            />
                                            <Form.Text className="text-muted">
                                                We'll never share your email with anyone else.
                                            </Form.Text>
                                        </Form.Group>

                                        <Row className="g-3 mb-4">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        <FaLock className="me-2" />
                                                        Password
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="Create password"
                                                        required
                                                        minLength="6"
                                                        className="py-2"
                                                    />
                                                    <Form.Text className="text-muted">
                                                        At least 6 characters
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-semibold">
                                                        <FaLock className="me-2" />
                                                        Confirm Password
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        name="password_confirmation"
                                                        value={formData.password_confirmation}
                                                        onChange={handleChange}
                                                        placeholder="Confirm password"
                                                        required
                                                        className="py-2"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Button 
                                            type="submit" 
                                            variant="primary"
                                            size="lg"
                                            className="w-100 py-2 mb-3 fw-semibold"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    <FaUserPlus className="me-2" />
                                                    Create Account
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-center mt-4">
                                            <p className="text-muted mb-2">Already have an account?</p>
                                            <Link to="/login">
                                                <Button variant="outline-primary" className="w-100">
                                                    Sign In Instead
                                                </Button>
                                            </Link>
                                        </div>

                                        <div className="mt-4 pt-3 border-top text-center">
                                            <small className="text-muted">
                                                By registering, you agree to our Terms and Privacy Policy
                                            </small>
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;