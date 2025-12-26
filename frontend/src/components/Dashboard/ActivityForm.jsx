import { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { activityService } from '../../services/api';

const ActivityForm = ({ onActivityAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        category: 'Self-care',
        sub_category: 'Yoga',
        duration: 60,
        date: new Date().toISOString().split('T')[0],
        feeling: 5,
        notes: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Make actual API call
            const response = await activityService.create(formData);
            
            setSuccess('Activity added successfully!');
            
            // Reset form but keep category selection
            setFormData({
                title: '',
                category: formData.category, // Keep same category
                sub_category: categories[formData.category].subCategories[0], // Reset to first sub-category
                duration: 60,
                date: new Date().toISOString().split('T')[0],
                feeling: 5,
                notes: '',
            });

            if (onActivityAdded) {
                onActivityAdded(response.data.activity);
            }
            
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Error adding activity:', error);
            if (error.response?.data?.errors) {
                // Handle Laravel validation errors
                const errorMessages = Object.values(error.response.data.errors).flat();
                setError(errorMessages.join(', '));
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('Failed to add activity. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (category) => {
        setFormData({
            ...formData,
            category: category,
            sub_category: categories[category].subCategories[0] // Reset to first sub-category
        });
    };

    const handleSubCategoryChange = (subCategory) => {
        setFormData({
            ...formData,
            sub_category: subCategory
        });
    };

    return (
        <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
                <Card.Title className="mb-4">Add New Activity</Card.Title>
                
                {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Activity Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="E.g., Morning Yoga Session"
                                    required
                                    disabled={loading}
                                />
                                <Form.Text className="text-muted">
                                    Give your activity a descriptive title
                                </Form.Text>
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
                                            variant={formData.category === cat ? categories[cat].color : 'outline-' + categories[cat].color}
                                            onClick={() => handleCategoryChange(cat)}
                                            className="flex-grow-1"
                                            disabled={loading}
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
                            {categories[formData.category].subCategories.map((sub) => (
                                <Button
                                    key={sub}
                                    type="button"
                                    variant={formData.sub_category === sub ? categories[formData.category].color : 'outline-' + categories[formData.category].color}
                                    onClick={() => handleSubCategoryChange(sub)}
                                    disabled={loading}
                                >
                                    {sub}
                                </Button>
                            ))}
                        </div>
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Duration: {formData.duration} minutes *</Form.Label>
                                <Form.Range
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    min="5"
                                    max="240"
                                    step="5"
                                    disabled={loading}
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
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>How are you feeling? ({formData.feeling}/10) *</Form.Label>
                        <Form.Range
                            name="feeling"
                            value={formData.feeling}
                            onChange={handleChange}
                            min="1"
                            max="10"
                            disabled={loading}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                            <small className="text-muted">😔 Sad</small>
                            <div className="text-center">
                                <div className="fs-4">{formData.feeling}/10</div>
                                <div className="small">
                                    {formData.feeling >= 9 ? 'Excellent' : 
                                     formData.feeling >= 7 ? 'Good' : 
                                     formData.feeling >= 5 ? 'Neutral' : 
                                     formData.feeling >= 3 ? 'Fair' : 'Poor'}
                                </div>
                            </div>
                            <small className="text-muted">😊 Happy</small>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Add any additional notes (optional)..."
                            disabled={loading}
                        />
                    </Form.Group>

                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-100 py-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Adding Activity...
                            </>
                        ) : (
                            'Add Activity'
                        )}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ActivityForm;