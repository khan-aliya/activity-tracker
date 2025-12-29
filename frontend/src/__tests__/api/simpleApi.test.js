// Simple API tests using CommonJS syntax
const { authService, activityService } = require('./mockApi.js');

describe('API Service Tests', () => {
  test('Auth service methods exist', () => {
    expect(typeof authService.register).toBe('function');
    expect(typeof authService.login).toBe('function');
    expect(typeof authService.logout).toBe('function');
    expect(typeof authService.getUser).toBe('function');
  });

  test('Activity service methods exist', () => {
    expect(typeof activityService.getAll).toBe('function');
    expect(typeof activityService.create).toBe('function');
    expect(typeof activityService.update).toBe('function');
    expect(typeof activityService.delete).toBe('function');
    expect(typeof activityService.getCategories).toBe('function');
  });

  test('Auth register returns expected structure', async () => {
    const response = await authService.register({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(response.data.status).toBe('success');
    expect(response.data.user).toHaveProperty('id');
    expect(response.data.user.name).toBe('Test User');
    expect(response.data.token).toBe('fake-token-123');
  });

  test('Activity create returns expected structure', async () => {
    const activity = {
      title: 'Evening Walk',
      category: 'Self-care',
      duration: 30,
      date: '2024-01-15'
    };
    
    const response = await activityService.create(activity);
    
    expect(response.data.status).toBe('success');
    expect(response.data.activity.id).toBe(3);
    expect(response.data.activity.title).toBe('Evening Walk');
  });

  test('Get all activities returns array', async () => {
    const response = await activityService.getAll();
    
    expect(Array.isArray(response.data.activities)).toBe(true);
    expect(response.data.activities).toHaveLength(2);
    expect(response.data.activities[0].title).toBe('Morning Run');
  });
});