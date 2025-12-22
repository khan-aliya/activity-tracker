import { useState, useEffect } from 'react';
import { activityAPI } from '../services/api';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { 
  FaChartBar, 
  FaCheckCircle, 
  FaClock, 
  FaCalendarAlt 
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalActivities: 0,
    completedActivities: 0,
    totalDuration: 0,
    averageDuration: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await activityAPI.getAll();
      const activities = response.data;
      
      const total = activities.length;
      const completed = activities.filter(a => a.status === 'completed').length;
      const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
      const averageDuration = total > 0 ? Math.round(totalDuration / total) : 0;

      setStats({
        totalActivities: total,
        completedActivities: completed,
        totalDuration,
        averageDuration
      });
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <Card className={`shadow-sm border-0 ${bgColor}`}>
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={3} className="text-center">
            <div className={`rounded-circle p-3 d-inline-flex ${color}`}>
              <Icon size={24} />
            </div>
          </Col>
          <Col xs={9}>
            <h6 className="text-muted mb-1">{title}</h6>
            <h4 className="mb-0">{value}</h4>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <>
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="g-4 mb-4">
        <Col md={3} sm={6}>
          <StatCard
            title="Total Activities"
            value={stats.totalActivities}
            icon={FaChartBar}
            color="bg-primary text-white"
            bgColor="bg-light"
          />
        </Col>
        <Col md={3} sm={6}>
          <StatCard
            title="Completed"
            value={stats.completedActivities}
            icon={FaCheckCircle}
            color="bg-success text-white"
            bgColor="bg-light"
          />
        </Col>
        <Col md={3} sm={6}>
          <StatCard
            title="Total Duration"
            value={`${Math.round(stats.totalDuration / 60)}h`}
            icon={FaClock}
            color="bg-info text-white"
            bgColor="bg-light"
          />
        </Col>
        <Col md={3} sm={6}>
          <StatCard
            title="Avg. Duration"
            value={`${stats.averageDuration}m`}
            icon={FaCalendarAlt}
            color="bg-warning text-white"
            bgColor="bg-light"
          />
        </Col>
      </Row>

      <Card className="shadow">
        <Card.Header>
          <h5 className="mb-0">Recent Activities</h5>
        </Card.Header>
        <Card.Body>
          <div className="text-center text-muted py-5">
            <p>No activities yet. Start by adding your first activity!</p>
            <button className="btn btn-primary mt-2">
              Add Activity
            </button>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default Dashboard;