import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityForm from './ActivityForm';

// Mock the activity service correctly
jest.mock('../../services/api', () => ({
  activityService: {
    create: jest.fn(),
  },
}));

import { activityService } from '../../services/api';

describe('ActivityForm Component', () => {
  const mockOnActivityAdded = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ActivityForm with all required elements', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Use getAllByText for the duplicate text issue
    const categoryLabels = screen.getAllByText(/Category \*/i);
    expect(categoryLabels.length).toBeGreaterThan(0);
    
    // Check for specific elements
    expect(screen.getByText(/Activity Title \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Sub Category \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Duration:/i)).toBeInTheDocument();
    expect(screen.getByText(/Date \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Activity/i })).toBeInTheDocument();
  });

  it('handles title input change', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    fireEvent.change(titleInput, { target: { value: 'Morning Yoga' } });
    
    expect(titleInput.value).toBe('Morning Yoga');
  });

  it('handles category selection - Self-care is default', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const selfCareButton = screen.getByRole('button', { name: /Self-care/i });
    expect(selfCareButton).toHaveClass('btn-success');
  });

  it('handles sub-category selection', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const yogaButton = screen.getByRole('button', { name: /Yoga/i });
    fireEvent.click(yogaButton);
    
    expect(yogaButton).toHaveClass('btn-success');
  });

  it('handles duration slider change', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const durationSlider = screen.getByLabelText(/Duration:/i);
    fireEvent.change(durationSlider, { target: { value: '45' } });
    
    expect(durationSlider.value).toBe('45');
    // Use a function to match the dynamic text
    expect(screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === 'label' && 
             content.includes('Duration:') && 
             content.includes('45') && 
             content.includes('minutes');
    })).toBeInTheDocument();
  });

  it('handles date input change', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const dateInput = screen.getByLabelText(/Date \*/i);
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    
    expect(dateInput.value).toBe('2023-12-31');
  });

  it('submits form with valid data', async () => {
    // Mock the API response
    const mockResponse = {
      data: {
        activity: {
          id: 1,
          title: 'Morning Yoga',
          category: 'Self-care',
          sub_category: 'Yoga',
          duration: 30,
          date: '2023-12-31'
        }
      }
    };
    
    activityService.create.mockResolvedValue(mockResponse);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/E.g., Morning Yoga Session/i), { 
      target: { value: 'Morning Yoga' } 
    });
    
    // Duration slider - set to 30
    const durationSlider = screen.getByLabelText(/Duration:/i);
    fireEvent.change(durationSlider, { target: { value: '30' } });
    
    // Date
    const dateInput = screen.getByLabelText(/Date \*/i);
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    
    // Submit - wrap in act to handle async state updates
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Add Activity/i }));
    });
    
    await waitFor(() => {
      // Note: duration comes as string from form input
      expect(activityService.create).toHaveBeenCalledWith({
        title: 'Morning Yoga',
        category: 'Self-care',
        sub_category: 'Yoga',
        duration: "30", // This is a string from the form
        date: '2023-12-31',
        feeling: 5,
        notes: ''
      });
      expect(mockOnActivityAdded).toHaveBeenCalledWith(mockResponse.data.activity);
    });
  });

  it('shows loading state during submission', async () => {
    // Create a promise that doesn't resolve immediately
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    activityService.create.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/E.g., Morning Yoga Session/i), { 
      target: { value: 'Test' } 
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Add Activity/i }));
    });
    
    // Should show loading state
    expect(screen.getByRole('button', { name: /Adding Activity\.\.\./i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Adding Activity\.\.\./i })).toBeDisabled();
    
    // Resolve the promise
    resolvePromise({ data: {} });
  });

  it('handles API errors gracefully', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Error creating activity'
        }
      }
    };
    
    activityService.create.mockRejectedValue(errorResponse);

    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/E.g., Morning Yoga Session/i), { 
      target: { value: 'Test' } 
    });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Add Activity/i }));
    });
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(screen.getByText(/Error creating activity|Failed to add activity/i)).toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('disables submit button during loading', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    activityService.create.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    // Fill and submit form
    fireEvent.change(screen.getByPlaceholderText(/E.g., Morning Yoga Session/i), { 
      target: { value: 'Test' } 
    });
    
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });
    
    // Button should be disabled during loading
    expect(submitButton).toBeDisabled();
    
    // Clean up
    resolvePromise({ data: {} });
  });
});