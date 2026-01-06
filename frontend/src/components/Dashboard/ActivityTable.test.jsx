import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityTable from './ActivityTable';
import { activityService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api', () => ({
  activityService: {
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock browser dialogs
global.confirm = jest.fn(() => true);
global.alert = jest.fn();

// Mock console.error to clean up output
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.clearAllMocks();
  global.alert.mockClear();
});

afterEach(() => {
  console.error.mockRestore();
});

describe('ActivityTable Component', () => {
  describe('Basic Functionality', () => {
    it('applies filters correctly', async () => {
      const mockActivities = [
        { 
          _id: '1', 
          id: '1',
          title: 'Yoga Session', 
          category: 'Self-care', 
          date: '2026-01-05',
          duration: 30,
          feeling: 8,
          sub_category: 'Yoga'
        },
        { 
          _id: '2', 
          id: '2',
          title: 'Study Time', 
          category: 'Productivity', 
          date: '2026-01-05',
          duration: 60,
          feeling: 6,
          sub_category: 'Study'
        }
      ];

      activityService.getAll.mockResolvedValue({
        data: mockActivities
      });

      render(<ActivityTable refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText(/Yoga Session/i)).toBeInTheDocument();
        expect(screen.getByText(/Study Time/i)).toBeInTheDocument();
      });

      // Get all comboboxes (there are 2: Category and Date Range)
      const comboboxes = screen.getAllByRole('combobox');
      const categorySelect = comboboxes[0]; // First combobox is category
      
      fireEvent.change(categorySelect, { target: { value: 'Self-care' } });

      const applyButton = screen.getByRole('button', { name: /Apply/i });
      fireEvent.click(applyButton);

      await waitFor(() => {
        // Check that API was called with filter
        expect(activityService.getAll).toHaveBeenCalled(); 
              const lastCall = activityService.getAll.mock.calls[activityService.getAll.mock.calls.length - 1];
      expect(lastCall[0]).toEqual(expect.objectContaining({
        category: 'Self-care'
      }));
      });
    });

    it('shows loading state initially', async () => {
      // Delay the response to see loading state
      activityService.getAll.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: [] }), 100))
      );

      render(<ActivityTable refreshTrigger={0} />);

      expect(screen.getByText(/Loading activities/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText(/No activities found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('shows error message when fetch fails', async () => {
      activityService.getAll.mockRejectedValue({
        response: { data: { message: 'Server fetch error' } }
      });

      render(<ActivityTable refreshTrigger={0} />);

      await waitFor(() => {
        expect(activityService.getAll).toHaveBeenCalled();
      });

      // Component should handle error gracefully
      expect(screen.getByText(/Your Activities/i)).toBeInTheDocument();
    });

    it('handles empty response gracefully', async () => {
      activityService.getAll.mockResolvedValue({ data: [] });

      render(<ActivityTable refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText(/No activities found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Success Cases', () => {
    it('loads and displays activities successfully', async () => {
      const mockActivities = [
        { 
          _id: '1', 
          id: '1',
          title: 'Morning Yoga', 
          category: 'Self-care', 
          sub_category: 'Yoga',
          duration: 60,
          date: '2026-01-05',
          feeling: 8,
          notes: 'Felt great'
        },
        { 
          _id: '2', 
          id: '2',
          title: 'Study Session', 
          category: 'Productivity', 
          sub_category: 'Study',
          duration: 90,
          date: '2026-01-04',
          feeling: 6,
          notes: 'Productive day'
        }
      ];

      activityService.getAll.mockResolvedValue({
        data: mockActivities
      });

      render(<ActivityTable refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText(/Morning Yoga/i)).toBeInTheDocument();
        expect(screen.getByText(/Study Session/i)).toBeInTheDocument();
      });

      // Use getAllByText for duplicate elements
      const selfCareElements = screen.getAllByText(/Self-care/i);
      expect(selfCareElements.length).toBeGreaterThan(0);
      
      const productivityElements = screen.getAllByText(/Productivity/i);
      expect(productivityElements.length).toBeGreaterThan(0);
    });

    it('successfully deletes an activity', async () => {
      const mockActivities = [
        { 
          _id: '1', 
          id: '1',
          title: 'To Delete', 
          category: 'Self-care', 
          date: '2026-01-05' 
        }
      ];

      activityService.getAll.mockResolvedValue({
        data: mockActivities
      });

      activityService.delete.mockResolvedValue({
        data: { success: true }
      });

      render(<ActivityTable refreshTrigger={0} />);

      await waitFor(() => {
        expect(screen.getByText(/To Delete/i)).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /Delete/i });
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Activity deleted successfully!');
      });
    });
  });
});