import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Test component that uses the auth context
const TestComponent = () => {
  const { user, token, login, register, logout, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="token">{token || 'No token'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>
        Login
      </button>
      <button onClick={() => register('John', 'john@example.com', 'password123', 'password123')}>
        Register
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('initial state is correct', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('token')).toHaveTextContent('No token');
  });

  test('login function works correctly', async () => {
    const mockResponse = {
      data: {
        token: 'test_token_123',
        user: { id: 1, name: 'Test User', email: 'test@example.com' }
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);
    axios.get.mockResolvedValue({ data: { user: mockResponse.data.user } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      screen.getByText('Login').click();
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    // Check that token is stored
    expect(localStorage.getItem('token')).toBe('test_token_123');
  });

  test('logout function works correctly', async () => {
    // First set a token
    localStorage.setItem('token', 'existing_token');
    
    axios.post.mockResolvedValue({});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click logout button
    await act(async () => {
      screen.getByText('Logout').click();
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  test('register function works correctly', async () => {
    const mockResponse = {
      data: {
        token: 'new_token_123',
        user: { id: 2, name: 'John', email: 'john@example.com' }
      }
    };
    
    axios.post.mockResolvedValue(mockResponse);
    axios.get.mockResolvedValue({ data: { user: mockResponse.data.user } });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click register button
    await act(async () => {
      screen.getByText('Register').click();
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/auth/register', {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      });
    });
  });
});