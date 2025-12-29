import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  fetchActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitySummary
} from '../../services/activityService';

const mock = new MockAdapter(axios);

describe('Activity API Tests', () => {
  const BASE_URL = 'http://localhost:8000/api';

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  test('fetchActivities should make GET request', async () => {
    const mockActivities = {
      activities: [
        { id: 1, title: 'Morning Run', type: 'exercise', duration: 45 },
        { id: 2, title: 'Project Work', type: 'work', duration: 120 }
      ]
    };

    mock.onGet(`${BASE_URL}/activities`).reply(200, mockActivities);

    const response = await fetchActivities();

    expect(response.data).toEqual(mockActivities);
    expect(mock.history.get.length).toBe(1);
  });

  test('fetchActivities with filters should append query params', async () => {
    const filters = { type: 'exercise', date: '2024-01-15' };
    
    mock.onGet(`${BASE_URL}/activities`).reply(200, { activities: [] });

    await fetchActivities(filters);

    expect(mock.history.get[0].params).toEqual(filters);
  });

  test('createActivity should make POST request with activity data', async () => {
    const newActivity = {
      title: 'Evening Walk',
      description: 'Walk in the park',
      type: 'exercise',
      duration: 30,
      date: '2024-01-15'
    };

    const mockResponse = {
      status: 'success',
      activity: { id: 1, ...newActivity }
    };

    mock.onPost(`${BASE_URL}/activities`).reply(201, mockResponse);

    const response = await createActivity(newActivity);

    expect(response.data).toEqual(mockResponse);
    expect(mock.history.post[0].data).toBe(JSON.stringify(newActivity));
  });

  test('updateActivity should make PUT request', async () => {
    const activityId = 1;
    const updateData = {
      title: 'Updated Activity',
      duration: 60
    };

    mock.onPut(`${BASE_URL}/activities/${activityId}`).reply(200, {
      status: 'success',
      message: 'Activity updated'
    });

    const response = await updateActivity(activityId, updateData);

    expect(response.status).toBe(200);
    expect(mock.history.put[0].data).toBe(JSON.stringify(updateData));
  });

  test('deleteActivity should make DELETE request', async () => {
    const activityId = 1;

    mock.onDelete(`${BASE_URL}/activities/${activityId}`).reply(200, {
      status: 'success',
      message: 'Activity deleted'
    });

    const response = await deleteActivity(activityId);

    expect(response.status).toBe(200);
    expect(mock.history.delete.length).toBe(1);
  });

  test('getActivitySummary should make GET request', async () => {
    const mockSummary = {
      summary: {
        total_activities: 5,
        total_duration: 300,
        activities_by_type: { exercise: 2, work: 3 }
      }
    };

    mock.onGet(`${BASE_URL}/activities/summary`).reply(200, mockSummary);

    const response = await getActivitySummary();

    expect(response.data).toEqual(mockSummary);
  });

  test('should include authorization header in all requests', async () => {
    mock.onGet(`${BASE_URL}/activities`).reply(200, { activities: [] });
    mock.onPost(`${BASE_URL}/activities`).reply(201, {});
    mock.onPut(`${BASE_URL}/activities/1`).reply(200, {});
    mock.onDelete(`${BASE_URL}/activities/1`).reply(200, {});

    await fetchActivities();
    await createActivity({ title: 'Test', type: 'test', duration: 10, date: '2024-01-15' });
    await updateActivity(1, { title: 'Updated' });
    await deleteActivity(1);

    // Check all requests have authorization header
    [mock.history.get, mock.history.post, mock.history.put, mock.history.delete].forEach(requests => {
      requests.forEach(request => {
        expect(request.headers.Authorization).toBe('Bearer fake-token');
      });
    });
  });
});