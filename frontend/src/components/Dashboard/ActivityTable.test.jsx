import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

// Mock window.confirm + window.alert
beforeAll(() => {
  window.confirm = jest.fn();
  window.alert = jest.fn(); // Prevent JSDOM "not implemented" errors
});

afterAll(() => {
  jest.restoreAllMocks();
});

// Define mockActivities here (outside describe)
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

describe('ActivityTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    activityService.getAll.mockResolvedValue({ data: mockActivities });
  });

  test('renders ActivityTable with loading state initially', () => {
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
});