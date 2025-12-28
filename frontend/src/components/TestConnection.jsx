import React, { useState, useEffect } from 'react';
import { Button, Alert, Card, Container } from 'react-bootstrap';

const TestConnection = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Basic connection
      const testRes = await fetch('http://localhost:8000/api/test-connection');
      results.connection = await testRes.json();
    } catch (err) {
      results.connection = { error: err.message };
    }

    try {
      // Test 2: Categories
      const catRes = await fetch('http://localhost:8000/api/categories');
      results.categories = await catRes.json();
    } catch (err) {
      results.categories = { error: err.message };
    }

    if (token) {
      try {
        // Test 3: User data
        const userRes = await fetch('http://localhost:8000/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        results.user = await userRes.json();
      } catch (err) {
        results.user = { error: err.message };
      }

      try {
        // Test 4: Activities
        const actRes = await fetch('http://localhost:8000/api/activities', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        results.activities = await actRes.json();
      } catch (err) {
        results.activities = { error: err.message };
      }
    }

    setStatus(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4>System Connection Test</h4>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <Alert variant="info">Running tests...</Alert>
          ) : (
            <>
              <Alert variant={status.connection?.status === 'success' ? 'success' : 'danger'}>
                <strong>Backend Connection:</strong> {status.connection?.message || 'Failed'}
              </Alert>

              <Alert variant={status.categories?.categories ? 'success' : 'warning'}>
                <strong>Categories:</strong> {status.categories?.categories ? 'Loaded' : 'Failed'}
                {status.categories?.categories && (
                  <div className="mt-2">
                    {JSON.stringify(status.categories.categories)}
                  </div>
                )}
              </Alert>

              {token ? (
                <>
                  <Alert variant={status.user?.user ? 'success' : 'warning'}>
                    <strong>User Authentication:</strong> {status.user?.user?.email || 'Failed'}
                  </Alert>

                  <Alert variant={status.activities ? 'success' : 'warning'}>
                    <strong>Activities:</strong> {Array.isArray(status.activities) ? `${status.activities.length} activities loaded` : 'Data loaded'}
                  </Alert>
                </>
              ) : (
                <Alert variant="warning">No authentication token found</Alert>
              )}

              <Button onClick={runTests} variant="primary" className="mt-3">
                Re-run Tests
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestConnection;