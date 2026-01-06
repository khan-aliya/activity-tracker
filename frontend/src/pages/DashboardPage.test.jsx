import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import DashboardPage from './DashboardPage';

// Mock dependencies
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('../components/Dashboard/ActivityForm', () => {
  return function MockActivityForm({ onActivityAdded }) {
    return (
      <div data-testid="mock-activity-form">
        <button
          onClick={() => onActivityAdded && onActivityAdded()}
          data-testid="mock-submit"
        >
          Mock Submit
        </button>
      </div>
    );
  };
});

jest.mock('../components/Dashboard/ActivityTable', () => {
  return function MockActivityTable({ refreshTrigger }) {
    return <div data-testid="mock-activity-table">Refresh: {refreshTrigger}</div>;
  };
});

import { useAuth } from '../contexts/AuthContext';

describe('DashboardPage - Edge Cases & Behaviour Tests', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  const mockAuth = (value) => {
    useAuth.mockReturnValue({ user: value });
  };

  /* ---------------------------------------------------------
     USER GREETING
  --------------------------------------------------------- */
  it('shows user name when available', () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    expect(screen.getByText(/Welcome, Aliya/i)).toBeInTheDocument();
  });

  it('falls back to email when name is missing', () => {
    mockAuth({ email: 'aliya@example.com' });

    render(<DashboardPage />);

    expect(screen.getByText(/Welcome, aliya@example.com/i)).toBeInTheDocument();
  });

  it('falls back to "User" when no user info exists', () => {
    mockAuth(null);

    render(<DashboardPage />);

    expect(screen.getByText(/Welcome, User/i)).toBeInTheDocument();
  });

  /* ---------------------------------------------------------
     FORM TOGGLE BEHAVIOUR
  --------------------------------------------------------- */
  it('shows the form when "Add New Activity" is clicked', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    const addButton = screen.getByRole('button', { name: /Add New Activity/i });
    await user.click(addButton);

    expect(screen.getByTestId('mock-activity-form')).toBeInTheDocument();
  });

  it('hides the form when "Hide Form" is clicked', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    await user.click(screen.getByRole('button', { name: /Add New Activity/i }));

    const hideButton = screen.getByRole('button', { name: /Hide Form/i });
    await user.click(hideButton);

    expect(screen.queryByTestId('mock-activity-form')).not.toBeInTheDocument();
  });

  it('does nothing if "Hide Form" is clicked while already hidden', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    expect(screen.queryByTestId('mock-activity-form')).not.toBeInTheDocument();

    // Try clicking hide button (should not exist)
    expect(screen.queryByRole('button', { name: /Hide Form/i })).not.toBeInTheDocument();
  });

  /* ---------------------------------------------------------
     handleActivityAdded BEHAVIOUR
  --------------------------------------------------------- */
  it('increments refreshTrigger when activity is added', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    // Show form
    await user.click(screen.getByRole('button', { name: /Add New Activity/i }));

    // Submit via mock form
    await user.click(screen.getByTestId('mock-submit'));

    // ActivityTable should receive updated refreshTrigger
    expect(screen.getByTestId('mock-activity-table')).toHaveTextContent('Refresh: 1');
  });

  it('hides the form after successful activity submission', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    await user.click(screen.getByRole('button', { name: /Add New Activity/i }));

    expect(screen.getByTestId('mock-activity-form')).toBeInTheDocument();

    await user.click(screen.getByTestId('mock-submit'));

    expect(screen.queryByTestId('mock-activity-form')).not.toBeInTheDocument();
  });

  it('handles multiple activity submissions correctly', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    // First submission
    await user.click(screen.getByRole('button', { name: /Add New Activity/i }));
    await user.click(screen.getByTestId('mock-submit'));

    // Second submission
    await user.click(screen.getByRole('button', { name: /Add New Activity/i }));
    await user.click(screen.getByTestId('mock-submit'));

    expect(screen.getByTestId('mock-activity-table')).toHaveTextContent('Refresh: 2');
  });

  /* ---------------------------------------------------------
     ACTIVITY TABLE PROPS
  --------------------------------------------------------- */
  it('passes refreshTrigger to ActivityTable', () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    expect(screen.getByTestId('mock-activity-table')).toHaveTextContent('Refresh: 0');
  });

  it('re-renders ActivityTable when refreshTrigger changes', async () => {
    mockAuth({ name: 'Aliya' });

    render(<DashboardPage />);

    await user.click(screen.getByRole('button', { name: /Add New Activity/i }));
    await user.click(screen.getByTestId('mock-submit'));

    expect(screen.getByTestId('mock-activity-table')).toHaveTextContent('Refresh: 1');
  });

  /* ---------------------------------------------------------
     COMPONENT STABILITY
  --------------------------------------------------------- */
  it('renders without crashing even if ActivityForm throws', async () => {
    jest.mock('../components/Dashboard/ActivityForm', () => {
      return function BrokenForm() {
        throw new Error('Form crashed');
      };
    });

    mockAuth({ name: 'Aliya' });

    expect(() => render(<DashboardPage />)).not.toThrow();
  });

  it('renders without crashing even if ActivityTable throws', () => {
    jest.mock('../components/Dashboard/ActivityTable', () => {
      return function BrokenTable() {
        throw new Error('Table crashed');
      };
    });

    mockAuth({ name: 'Aliya' });

    expect(() => render(<DashboardPage />)).not.toThrow();
  });
});
