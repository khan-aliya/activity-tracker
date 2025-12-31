import { useState } from 'react';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaChartLine, FaBalanceScale } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) {
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await login(formData);
            
            if (result.success) {
                navigate('/dashboard');
            } else {
                if (result.message.includes('credentials') || result.message.includes('Invalid')) {
                    setError('Invalid email or password');
                } else if (result.message.includes('Validation')) {
                    setError('Please enter valid email and password');
                } else {
                    setError(result.message || 'Login failed. Please try again.');
                }
            }
        
} catch (err) {
  console.error('Login error:', err);
  
  let errorMessage = 'An error occurred during login';
  
  // Fix: Check if err exists before accessing properties
  if (err && err.response && err.response.data && err.response.data.errors) {
    const errorMessages = Object.values(err.response.data.errors).flat();
    errorMessage = errorMessages.join(', ');
  } else if (err && err.response && err.response.data && err.response.data.message) {
    errorMessage = err.response.data.message;
  } else if (err && err.message) {
    errorMessage = err.message;
  }
  
  setError(errorMessage);
} finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Row className="w-100 justify-content-center">
                <Col md={8} lg={6} xl={5}>
                    {/* App Header */}
                    <div className="text-center mb-5">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                            <div className="bg-primary bg-gradient p-3 rounded-circle me-3">
                                <FaChartLine size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="fw-bold text-primary mb-0">ActivityTracker</h1>
                                <p className="text-muted">Balance Your Life, Track Your Progress</p>
                            </div>
                        </div>
                        <p className="text-muted">
                            Track your self-care, productivity, and rewards in one place
                        </p>
                    </div>

                    <Card className="border-0 shadow-lg rounded-3 overflow-hidden">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold">Welcome Back</h3>
                                <p className="text-muted">Sign in to continue to your dashboard</p>
                            </div>

                            {error && (
                                <Alert variant="danger" className="mb-4" onClose={() => setError(null)} dismissible>
                                    <div className="d-flex align-items-center">
                                        <FaBalanceScale className="me-2" />
                                        {error}
                                    </div>
                                </Alert>
                            )}
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        required
                                        disabled={loading}
                                        className="py-2"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <Form.Label className="fw-semibold mb-0">Password</Form.Label>
                                        <Link to="/forgot-password" className="text-decoration-none small">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                        className="py-2"
                                    />
                                </Form.Group>

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
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <FaSignInAlt className="me-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>

                                <div className="text-center mt-4">
                                    <p className="text-muted mb-2">Don't have an account?</p>
                                    <Link to="/register">
                                        <Button variant="outline-primary" className="w-100">
                                            <FaUserPlus className="me-2" />
                                            Create New Account
                                        </Button>
                                    </Link>
                                </div>
                            </Form>

                            {/* Features Preview */}
                            <div className="mt-5 pt-4 border-top">
                                <h6 className="text-center mb-3 text-muted">What you can track:</h6>
                                <Row className="g-3 text-center">
                                    <Col xs={4}>
                                        <div className="p-2 bg-success bg-opacity-10 rounded">
                                            <small className="fw-semibold text-success">Self-care</small>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="p-2 bg-primary bg-opacity-10 rounded">
                                            <small className="fw-semibold text-primary">Productivity</small>
                                        </div>
                                    </Col>
                                    <Col xs={4}>
                                        <div className="p-2 bg-warning bg-opacity-10 rounded">
                                            <small className="fw-semibold text-warning">Rewards</small>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Footer */}
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            © {new Date().getFullYear()} ActivityTracker. Track your daily activities.
                        </small>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;