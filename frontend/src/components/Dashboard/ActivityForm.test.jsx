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
    
    expect(screen.getByText(/Activity Title \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Sub Category \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Duration:/i)).toBeInTheDocument();
    expect(screen.getByText(/Date \*/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Activity/i })).toBeInTheDocument();
  });

  it('handles title input change', async () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Morning Yoga' } });
    });

    expect(titleInput.value).toBe('Morning Yoga');
  });

  it('handles category selection - Self-care is default', () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const selfCareButton = screen.getByRole('button', { name: /Self-care/i });
    expect(selfCareButton).toHaveClass('btn-success');
  });

  it('handles sub-category selection', async () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const yogaButton = screen.getByRole('button', { name: /Yoga/i });

    await act(async () => {
      fireEvent.click(yogaButton);
    });

    expect(yogaButton).toHaveClass('btn-success');
  });

  it('handles duration slider change', async () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const sliders = screen.getAllByRole('slider');
    const durationSlider = sliders.find(s => s.getAttribute('name') === 'duration');

    await act(async () => {
      fireEvent.change(durationSlider, { target: { value: '45' } });
    });

    expect(durationSlider.value).toBe('45');
  });

  it('handles date input change', async () => {
    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const dateInput = screen.getByDisplayValue('2026-01-03');

    await act(async () => {
      fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
    });

    expect(dateInput.value).toBe('2023-12-31');
  });

  it('submits form with valid data', async () => {
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
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    const sliders = screen.getAllByRole('slider');
    const durationSlider = sliders.find(s => s.getAttribute('name') === 'duration');
    const dateInput = screen.getByDisplayValue('2026-01-03');
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Morning Yoga' } });
      fireEvent.change(durationSlider, { target: { value: '30' } });
      fireEvent.change(dateInput, { target: { value: '2023-12-31' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(activityService.create).toHaveBeenCalled();
      expect(mockOnActivityAdded).toHaveBeenCalled();
    });
  });

  it('shows loading state during submission', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => { resolvePromise = resolve; });
    
    activityService.create.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Test' } });
      fireEvent.click(submitButton);
    });
    
    expect(screen.getByRole('button', { name: /Adding Activity\.\.\./i })).toBeDisabled();
    
    resolvePromise({ data: {} });
  });

  it('handles API errors gracefully', async () => {
    const errorResponse = {
      response: {
        data: { message: 'Error creating activity' }
      }
    };
    
    activityService.create.mockRejectedValue(errorResponse);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Test' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(screen.getByText(/Error creating activity|Failed to add activity/i)).toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  it('disables submit button during loading', async () => {
    let resolvePromise;
    const promise = new Promise(resolve => { resolvePromise = resolve; });
    
    activityService.create.mockReturnValue(promise);

    render(<ActivityForm onActivityAdded={mockOnActivityAdded} />);
    
    const titleInput = screen.getByPlaceholderText(/E.g., Morning Yoga Session/i);
    const submitButton = screen.getByRole('button', { name: /Add Activity/i });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: 'Test' } });
      fireEvent.click(submitButton);
    });
    
    expect(submitButton).toBeDisabled();
    
    resolvePromise({ data: {} });
  });
});
