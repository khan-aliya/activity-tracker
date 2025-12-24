import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterForm from '../RegisterForm';

// Mock AuthContext
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => ({
    register: jest.fn().mockResolvedValue({ success: true }),
    loading: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

describe('RegisterForm', () => {
  test('renders registration form correctly', () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('validates password match', async () => {
    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different' }
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});