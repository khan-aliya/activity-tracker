import { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';

const ActivityFilter = ({ onFilter, initialFilters = {} }) => {
    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        category: initialFilters.category || 'all',
        sub_category: initialFilters.sub_category || 'all',
        start_date: initialFilters.start_date || '',
        end_date: initialFilters.end_date || '',
        min_feeling: initialFilters.min_feeling || '',
        max_feeling: initialFilters.max_feeling || '',
        min_duration: initialFilters.min_duration || '',
        max_duration: initialFilters.max_duration || '',
        sort_by: initialFilters.sort_by || 'date',
        sort_order: initialFilters.sort_order || 'desc'
    });

    const categories = {
        'all': 'All Categories',
        'Self-care': 'Self-care',
        'Productivity': 'Productivity',
        'Reward': 'Reward'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            category: 'all',
            sub_category: 'all',
            start_date: '',
            end_date: '',
            min_feeling: '',
            max_feeling: '',
            min_duration: '',
            max_duration: '',
            sort_by: 'date',
            sort_order: 'desc'
        };
        setFilters(resetFilters);
        onFilter(resetFilters);
    };

    return (
        <Card className="mb-3 border-0 shadow-sm">
            <Card.Body>
                <h6 className="mb-3">Filter Activities</h6>
                <Form onSubmit={handleSubmit}>
                    <Row className="g-2">
                        <Col md={12}>
                            <Form.Group>
                                <Form.Control
                                    type="text"
                                    placeholder="Search by title..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Select
                                    value={filters.category}
                                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                                >
                                    {Object.entries(categories).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Control
                                    type="date"
                                    placeholder="Start Date"
                                    value={filters.start_date}
                                    onChange={(e) => setFilters({...filters, start_date: e.target.value})}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Control
                                    type="date"
                                    placeholder="End Date"
                                    value={filters.end_date}
                                    onChange={(e) => setFilters({...filters, end_date: e.target.value})}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <div className="d-flex gap-2">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="flex-grow-1"
                                >
                                    Apply
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline-secondary"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </Col>

                        {/* Advanced Filters (Collapsible) */}
                        <Col md={12}>
                            <details className="mt-2">
                                <summary className="text-primary" style={{cursor: 'pointer'}}>
                                    Advanced Filters
                                </summary>
                                <Row className="g-2 mt-2">
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="small">Min Feeling (1-10)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={filters.min_feeling}
                                                onChange={(e) => setFilters({...filters, min_feeling: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="small">Max Feeling (1-10)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={filters.max_feeling}
                                                onChange={(e) => setFilters({...filters, max_feeling: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="small">Min Duration (min)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={filters.min_duration}
                                                onChange={(e) => setFilters({...filters, min_duration: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group>
                                            <Form.Label className="small">Max Duration (min)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                min="1"
                                                value={filters.max_duration}
                                                onChange={(e) => setFilters({...filters, max_duration: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </details>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default ActivityFilter;