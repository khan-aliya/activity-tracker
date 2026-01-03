import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock PerformanceMonitor
jest.mock('./components/PerformanceMonitor', () => () => null);

// Mock react-router-dom components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>,
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}));

// Mock AuthContext
jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    isAuthenticated: false,
    loading: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
}));

// Mock Navbar component
jest.mock('./components/Layout/Navbar.jsx', () => () => <div data-testid="navbar">Navbar</div>);

// Mock the pages/components to avoid lazy loading issues
jest.mock('./pages/HomePage.jsx', () => () => <div data-testid="homepage">Home Page</div>);
jest.mock('./pages/DashboardPage.jsx', () => () => <div data-testid="dashboard">Dashboard Page</div>);
jest.mock('./components/Auth/Login.jsx', () => () => <div data-testid="login">Login Page</div>);
jest.mock('./components/Auth/Register.jsx', () => () => <div data-testid="register">Register Page</div>);

test('renders App without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});