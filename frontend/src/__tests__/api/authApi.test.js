import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser 
} from '../../services/authService';

const mock = new MockAdapter(axios);

describe('Auth API Tests', () => {
  const BASE_URL = 'http://localhost:8000/api';

  afterEach(() => {
    mock.reset();
    localStorage.clear();
  });

  test('registerUser should make POST request and return user data', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse = {
      status: 'success',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'fake-jwt-token'
    };

    mock.onPost(`${BASE_URL}/register`).reply(200, mockResponse);

    const response = await registerUser(mockUser);

    expect(response.data).toEqual(mockResponse);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].data).toBe(JSON.stringify(mockUser));
  });

  test('loginUser should make POST request and store token', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse = {
      status: 'success',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'fake-jwt-token'
    };

    mock.onPost(`${BASE_URL}/login`).reply(200, mockResponse);

    const response = await loginUser(credentials);

    expect(response.data).toEqual(mockResponse);
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
  });

  test('logoutUser should make POST request and clear token', async () => {
    localStorage.setItem('token', 'existing-token');
    
    mock.onPost(`${BASE_URL}/logout`).reply(200, {
      status: 'success',
      message: 'Logged out successfully'
    });

    await logoutUser();

    expect(localStorage.getItem('token')).toBeNull();
    expect(mock.history.post.length).toBe(1);
  });

  test('getCurrentUser should make GET request with token', async () => {
    localStorage.setItem('token', 'fake-token');
    
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    };

    mock.onGet(`${BASE_URL}/user`).reply(200, mockUser);

    const response = await getCurrentUser();

    expect(response.data).toEqual(mockUser);
    expect(mock.history.get[0].headers.Authorization).toBe('Bearer fake-token');
  });

  test('should handle network errors', async () => {
    mock.onPost(`${BASE_URL}/login`).networkError();

    await expect(loginUser({ email: 'test@example.com', password: 'password' }))
      .rejects
      .toThrow();
  });

  test('should handle 401 unauthorized', async () => {
    mock.onPost(`${BASE_URL}/login`).reply(401, {
      status: 'error',
      message: 'Invalid credentials'
    });

    try {
      await loginUser({ email: 'wrong@example.com', password: 'wrong' });
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Invalid credentials');
    }
  });
});