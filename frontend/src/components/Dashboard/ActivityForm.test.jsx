
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityForm from './ActivityForm';

// Mock the activityService module
jest.mock('../../services/api', () => ({
  createActivity: jest.fn(),
}));

import { createActivity } from '../../services/activityService';

describe('ActivityForm Component', () => {
  const mockOnActivityAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnActivityAdded.mockClear();
    localStorage.setItem('token', 'fake-test-token-123');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders ActivityForm with all required elements', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Check for main title
    expect(screen.getByText(/Add New Activity/i)).toBeInTheDocument();
    
    // Check for form inputs - use placeholder instead of label
    expect(screen.getByPlaceholderText(/E.g., Morning Yoga Session/i)).toBeInTheDocument();
    
    // Check for category buttons
    expect(screen.getByText(/Self-care/i)).toBeInTheDocument();
    expect(screen.getByText(/Productivity/i)).toBeInTheDocument();
    expect(screen.getByText(/Reward/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByRole('button', { name: /Add Activity/i })).toBeInTheDocument();
  });

  test('handles title input change', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Morning Yoga Session' } });
    
    expect(titleInput.value).toBe('Morning Yoga Session');
  });

  test('handles category selection - Self-care is default', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const selfCareButton = screen.getByText('Self-care');
    const productivityButton = screen.getByText('Productivity');
    
    // Self-care should be selected by default
    expect(selfCareButton).toHaveClass('btn-success');
    expect(productivityButton).toHaveClass('btn-outline-primary');
    
    // Click Productivity
    fireEvent.click(productivityButton);
    expect(productivityButton).toHaveClass('btn-primary');
    expect(selfCareButton).toHaveClass('btn-outline-success');
  });

  test('handles sub-category selection', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const yogaButton = screen.getByText('Yoga');
    const meditationButton = screen.getByText('Meditation');
    
    // Yoga should be selected by default
    expect(yogaButton).toHaveClass('btn-success');
    expect(meditationButton).toHaveClass('btn-outline-success');
    
    // Click Meditation
    fireEvent.click(meditationButton);
    expect(meditationButton).toHaveClass('btn-success');
    expect(yogaButton).toHaveClass('btn-outline-success');
  });

  test('handles duration slider change', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Find duration slider by its name attribute
      const durationSlider = screen.getByDisplayValue('60');
    
    // Default should be 60
    expect(durationSlider.value).toBe('60');
    
    // Change to 30
    fireEvent.change(durationSlider, { target: { value: '30' } });
    expect(durationSlider.value).toBe('30');
  });

  
test('handles date input change', () => {
  render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
  
  // Find by display value instead of label
  const dateInput = screen.getByDisplayValue('2025-12-31');
  fireEvent.change(dateInput, { target: { value: '2024-01-15' } });
  expect(dateInput.value).toBe('2024-01-15');
});

  test('submits form with valid data', async () => {
    const mockResponse = {
      data: {
        status: 'success',
        activity: { 
          id: '123', 
          title: 'Test Yoga Session',
          category: 'Self-care'
        }
      }
    };
    
    createActivity.mockResolvedValueOnce(mockResponse);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Fill in form data
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test Yoga Session' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    // Submit form
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
      // Wait for API call - the form might be submitting to real API
  // Let's check if createActivity was called
  await waitFor(() => {
    // The mock should have been called
    expect(createActivity).toHaveBeenCalled();
  });
  
  // Check that onActivityAdded was called if createActivity succeeds
  if (createActivity.mock.calls.length > 0) {
    expect(mockOnActivityAdded).toHaveBeenCalled();
  }
  });

  test('shows loading state during submission', async () => {
    // Create a promise that we can resolve later
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = () => resolve({
        data: {
          status: 'success',
          activity: { id: '123', title: 'Test Activity' }
        }
      });
    });
    
    createActivity.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Fill in minimal data
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test Activity' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Button should show loading state
    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/Adding Activity/i);
      expect(submitButton).toBeDisabled();
    });
    
    // Resolve the promise to clean up
    resolvePromise();
    
    // Wait for promise to resolve
    await act(async () => {
      await promise;
    });
  });

  test('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to add activity';
    const errorResponse = {
      response: {
        data: { 
          message: errorMessage,
          errors: {
            title: ['Title is required']
          }
        }
      }
    };
    
    createActivity.mockRejectedValueOnce(errorResponse);

    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test Activity' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Should show error message
    await waitFor(() => {
      const errorElements = screen.getAllByRole('alert');
      expect(errorElements.length).toBeGreaterThan(0);
    });
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  test('disables submit button during loading', async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = () => resolve({
        data: {
          status: 'success',
          activity: { id: '123', title: 'Test' }
        }
      });
    });
    
    createActivity.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Test Activity' } });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Button should be disabled during loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    
    // Clean up
    resolvePromise();
    await act(async () => {
      await promise;
    });
  });
});