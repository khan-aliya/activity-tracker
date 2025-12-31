import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityFilter from './ActivityFilter';

describe('ActivityFilter Component', () => {
  const mockOnFilter = jest.fn();

  beforeEach(() => {
    mockOnFilter.mockClear();
  });

  test('renders ActivityFilter with basic controls', () => {
    render(<ActivityFilter onFilter={mockOnFilter} />);
    
    expect(screen.getByText(/Filter Activities/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by title/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Apply/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
  });

  test('handles search input change', () => {
    render(<ActivityFilter onFilter={mockOnFilter} />);
    
    const searchInput = screen.getByPlaceholderText(/Search by title/i);
    fireEvent.change(searchInput, { target: { value: 'Yoga' } });
    
    expect(searchInput.value).toBe('Yoga');
  });

  test('handles category selection', () => {
    render(<ActivityFilter onFilter={mockOnFilter} />);
    
    // The select should have options
    const selectElement = screen.getByDisplayValue(/All Categories/i);
    expect(selectElement).toBeInTheDocument();
  });

  test('applies filters when Apply button is clicked', () => {
    render(<ActivityFilter onFilter={mockOnFilter} />);
    
    // Change search input
    const searchInput = screen.getByPlaceholderText(/Search by title/i);
    fireEvent.change(searchInput, { target: { value: 'Yoga' } });
    
    // Click Apply button
    const applyButton = screen.getByRole('button', { name: /Apply/i });
    fireEvent.click(applyButton);
    
    expect(mockOnFilter).toHaveBeenCalled();
  });

  test('resets filters when Reset button is clicked', () => {
    render(<ActivityFilter onFilter={mockOnFilter} />);
    
    // Change some filters
    const searchInput = screen.getByPlaceholderText(/Search by title/i);
    fireEvent.change(searchInput, { target: { value: 'Yoga' } });
    
    // Click Reset button
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);
    
    // Should call onFilter with reset values
    expect(mockOnFilter).toHaveBeenCalled();
  });

  test('shows advanced filters toggle', () => {
    render(<ActivityFilter onFilter={mockOnFilter} />);
    
    // Check for advanced filters toggle
    const advancedFiltersToggle = screen.getByText(/Advanced Filters/i);
    expect(advancedFiltersToggle).toBeInTheDocument();
  });
});
