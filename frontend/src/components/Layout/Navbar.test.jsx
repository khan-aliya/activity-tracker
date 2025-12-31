import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  NavLink: ({ children, ...props }) => <a {...props}>{children}</a>
}));

// Mock auth context
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User' },
    logout: jest.fn(),
    isAuthenticated: true
  })
}));

describe('Navbar Component', () => {
  test('renders Navbar with logo and user info', () => {
    render(<Navbar />);
    
    expect(screen.getByText(/Activity Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  test('shows logout button when authenticated', () => {
    render(<Navbar />);
    
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('has correct navigation structure', () => {
    render(<Navbar />);
    
    const brandLink = screen.getByText(/Activity Tracker/i);
    expect(brandLink).toHaveAttribute('href', '/dashboard');
  });

  test('renders user information section', () => {
    render(<Navbar />);
    
    const userInfo = screen.getByText(/Test User/i);
    expect(userInfo).toHaveClass('text-muted');
  });
});
