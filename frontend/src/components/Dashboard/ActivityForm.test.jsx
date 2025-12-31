import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityForm from './ActivityForm';

// Mock the activityService
jest.mock('../../services/api', () => ({
  activityService: {
    create: jest.fn()
  }
}));

import { activityService } from '../../services/api';

describe('ActivityForm Component', () => {
  const mockOnActivityAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnActivityAdded.mockClear();
    activityService.create.mockClear();
  });

  test('renders ActivityForm with all required elements', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    expect(screen.getByText(/Add New Activity/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/E.g., Morning Yoga Session/i)).toBeInTheDocument();
    expect(screen.getByText(/Self-care/i)).toBeInTheDocument();
    expect(screen.getByText(/Productivity/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward/i)).toBeInTheDocument();
  });

  test('handles title input change', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Morning Yoga Session' } });
    expect(titleInput.value).toBe('Morning Yoga Session');
  });

  test('handles category selection', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const productivityButton = screen.getByText('Productivity');
    fireEvent.click(productivityButton);
    
    expect(productivityButton).toHaveClass('btn-primary');
  });

  test('handles sub-category selection', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const meditationButton = screen.getByText('Meditation');
    fireEvent.click(meditationButton);
    
    expect(meditationButton).toHaveClass('btn-success');
  });

  test('submits form with valid data', async () => {
    activityService.create.mockResolvedValueOnce({
      data: { activity: { id: '123', title: 'Test Activity' } }
    });

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test Yoga Session' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    // Use act for async state updates
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(activityService.create).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Yoga Session',
        category: 'Self-care'
      }));
    });
  });

  test('shows loading state during submission', async () => {
    // Mock a delayed response
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    activityService.create.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Should show loading state
    expect(screen.getByText(/Adding Activity/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    // Resolve the promise to clean up
    resolvePromise({ data: { activity: {} } });
    
    // Wait for loading to finish
    await act(async () => {
      await promise;
    });
  });

  test('handles API errors', async () => {
    const errorMessage = 'Failed to add activity';
    activityService.create.mockRejectedValueOnce({
      response: {
        data: { message: errorMessage }
      }
    });

    // Mock console.error to prevent test output noise
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test Activity' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Wait for error to appear
    await waitFor(() => {
      // Check for alert or error message
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });
    
    // Restore console.error
    console.error.mockRestore();
  });
});
