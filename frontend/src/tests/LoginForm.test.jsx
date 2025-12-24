import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';
import { AuthProvider } from '../contexts/AuthContext';

describe('LoginForm Component', () => {
  test('renders login form correctly', () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });
});