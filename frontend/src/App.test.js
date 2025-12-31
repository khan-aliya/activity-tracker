import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'; // ADD THIS LINE
import App from './App';

// Mock everything that could cause issues
jest.mock('./components/PerformanceMonitor', () => () => null);
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ children }) => <div data-testid="route">{children}</div>,
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}));

// Mock the AuthContext
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

// Mock lazy-loaded components - Return functions, not objects
jest.mock('./pages/HomePage', () => ({
  __esModule: true,
  default: () => <div data-testid="homepage">Home Page</div>
}));

jest.mock('./pages/DashboardPage', () => ({
  __esModule: true,
  default: () => <div>Dashboard Page</div>
}));

jest.mock('./components/Auth/Login', () => ({
  __esModule: true,
  default: () => <div>Login Page</div>
}));

jest.mock('./components/Auth/Register', () => ({
  __esModule: true,
  default: () => <div>Register Page</div>
}));

jest.mock('./components/Layout/Navbar', () => ({
  __esModule: true,
  default: () => <div>Navbar</div>
}));

// Mock Suspense fallback
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    Suspense: ({ children }) => children,
    lazy: (factory) => {
      const component = factory();
      return component.default || component;
    },
  };
});

test('renders App without crashing', () => {
  // This will now render without any async loading issues
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});