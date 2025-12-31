import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityTable from './ActivityTable';

// Mock the activityService
jest.mock('../../services/api', () => ({
  activityService: {
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

import { activityService } from '../../services/api';

// Mock window.confirm
const originalConfirm = window.confirm;
beforeAll(() => {
  window.confirm = jest.fn();
});

afterAll(() => {
  window.confirm = originalConfirm;
});

describe('ActivityTable Component', () => {
  const mockActivities = {
    data: [
      {
        _id: '1',
        title: 'Morning Yoga',
        category: 'Self-care',
        sub_category: 'Yoga',
        duration: 30,
        date: '2024-01-01',
        feeling: 8,
        notes: 'Felt great'
      },
      {
        _id: '2',
        title: 'Study Session',
        category: 'Productivity',
        sub_category: 'Study',
        duration: 60,
        date: '2024-01-02',
        feeling: 7,
        notes: 'Productive study'
      }
    ],
    total: 2,
    current_page: 1,
    last_page: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm.mockClear();
    activityService.getAll.mockResolvedValue({ data: mockActivities });
  });

  test('renders ActivityTable with loading state initially', () => {
    // Mock delayed response for loading test
    activityService.getAll.mockImplementation(() => new Promise(() => {}));

    render(<ActivityTable refreshTrigger={1} />);
    
    expect(screen.getByText(/Loading activities/i)).toBeInTheDocument();
  });

  test('renders activities after loading', async () => {
    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Your Activities/i)).toBeInTheDocument();
      expect(screen.getByText('Morning Yoga')).toBeInTheDocument();
      expect(screen.getByText('Study Session')).toBeInTheDocument();
    });
  });

  test('renders empty state when no activities', async () => {
    activityService.getAll.mockResolvedValueOnce({
      data: { data: [], total: 0, current_page: 1, last_page: 1 }
    });

    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      expect(screen.getByText(/No activities found/i)).toBeInTheDocument();
    });
  });

  test('shows filters', async () => {
    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Filter Activities/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search activities/i)).toBeInTheDocument();
    });
  });

  test('handles edit button click', async () => {
    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBeGreaterThan(0);
      
      // Click edit button
      fireEvent.click(editButtons[0]);
      
      // Check if edit modal appears
      expect(screen.getByText(/Edit Activity/i)).toBeInTheDocument();
    });
  });

  test('handles delete button click with confirmation when activities exist', async () => {
    window.confirm.mockReturnValue(true);
    activityService.delete.mockResolvedValueOnce({});
    
    // Mock the refresh to return empty after delete
    activityService.getAll
      .mockResolvedValueOnce({ data: mockActivities }) // First call
      .mockResolvedValueOnce({ data: { data: [], total: 0, current_page: 1, last_page: 1 } }); // After delete

    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
      
      fireEvent.click(deleteButtons[0]);
      
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this activity?');
      expect(activityService.delete).toHaveBeenCalledWith('1');
    });
  });

  test('does not delete when confirmation is cancelled', async () => {
    window.confirm.mockReturnValue(false);

    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(activityService.delete).not.toHaveBeenCalled();
    });
  });

  test('applies search filter', async () => {
    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search activities/i);
      fireEvent.change(searchInput, { target: { value: 'Yoga' } });
      
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);
      
      expect(activityService.getAll).toHaveBeenCalledWith(expect.objectContaining({
        search: 'Yoga'
      }));
    });
  });

  test('shows edit and delete buttons for each activity', async () => {
    render(<ActivityTable refreshTrigger={1} />);
    
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });
});
